from __future__ import annotations

from typing import TYPE_CHECKING

from dissect.thumbcache.index import IndexEntry, ThumbnailIndex
from dissect.thumbcache.thumbcache_file import ThumbcacheEntry, ThumbcacheFile

if TYPE_CHECKING:
    from collections.abc import Iterator
    from pathlib import Path


class Thumbcache:
    """This class combines the thumbnailindex and thumbcachefile.

    The class looks up all files inside ``path`` that have the same ``prefix``.

    Args:
        path: The directory that contains the thumbcache files.
        prefix: The start of the name to search for.
    """

    def __init__(self, path: Path, prefix: str = "thumbcache") -> None:
        self._mapping: dict[str, Path] = {}
        self.index_file, self.cache_files = self._populate_files(path, prefix)

    def _populate_files(self, path: Path, prefix: str) -> tuple[Path, list[Path]]:
        cache_files = []
        index_file = None
        for file in path.glob(f"{prefix}*"):
            if file.name.endswith("_idx.db"):
                index_file = file
            else:
                cache_files.append(file)
        return index_file, cache_files

    @property
    def mapping(self) -> dict[int, Path]:
        """Looks at the version field in the cache file header."""
        if not self._mapping:
            for file in self.cache_files:
                with file.open("rb") as cache_file:
                    t_file = ThumbcacheFile(cache_file)
                    key = t_file.type
                self._mapping.update({key: file})
        return self._mapping

    def entries(self) -> Iterator[tuple[Path, ThumbcacheEntry]]:
        """Iterates through all the specific entries from the thumbcache files."""
        used_entries = list(self.index_entries())

        for entry in used_entries:
            yield from self._entries_from_offsets(entry.cache_offsets)

    def index_entries(self) -> Iterator[IndexEntry]:
        """Iterates through all the index entries that are in use."""
        with self.index_file.open("rb") as i_file:
            yield from ThumbnailIndex(i_file).entries()

    def _entries_from_offsets(self, offsets: list[int]) -> Iterator[tuple[Path, ThumbcacheEntry]]:
        """Retrieves Thumbcache entries from a ThumbcacheFile using offsets."""
        for idx, offset in enumerate(offsets):
            if offset == 0xFFFFFFFF:
                continue

            cache_path = self.mapping.get(idx)

            with cache_path.open("rb") as cache_file:
                yield cache_path, ThumbcacheFile(cache_file)[offset]
