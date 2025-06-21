from __future__ import annotations

from typing import TYPE_CHECKING, Any, BinaryIO

from dissect.thumbcache.c_thumbcache import c_thumbcache
from dissect.thumbcache.exceptions import (
    InvalidSignatureError,
    UnknownThumbnailTypeError,
)
from dissect.thumbcache.util import ThumbnailType, seek_and_return

if TYPE_CHECKING:
    from collections.abc import Iterator

UNKNOWN_BYTES = 8


class ThumbcacheFile:
    __slots__ = [
        "_cached_entries",
        "_entries",
        "_header",
        "fh",
        "offset",
        "signature",
        "size",
        "type",
    ]

    """
    This class defines a thumbcache file, that is usually denoted by
    thumbcache_*.db. Which is is different from the thumbcache_idx.db.

    Args:
        fh: A file-like object.
    """

    _signature = b"CMMM"

    def __init__(self, fh: BinaryIO) -> None:
        self.fh = fh
        self._header = self._get_header_type(self.fh)
        self._cached_entries: dict[int, ThumbcacheEntry] = {}

    def _get_header_type(self, fh: BinaryIO) -> c_thumbcache.CACHE_HEADER_VISTA | c_thumbcache.CACHE_HEADER:
        tmp_header = c_thumbcache.CACHE_HEADER(fh)

        if self._signature != tmp_header.Signature:
            raise InvalidSignatureError(
                f"The signature {tmp_header.Signature!r} does not match the expected {self._signature!r}"
            )

        if tmp_header.Version <= ThumbnailType.WINDOWS_7:
            return c_thumbcache.CACHE_HEADER_VISTA(tmp_header.dumps())
        return tmp_header

    @property
    def header(self) -> c_thumbcache.CACHE_HEADER_VISTA | c_thumbcache.CACHE_HEADER:
        return self._header

    @property
    def version(self) -> ThumbnailType:
        try:
            return ThumbnailType(self.header.Version)
        except ValueError:
            raise UnknownThumbnailTypeError(f"{self.header.Version} is not known.")

    def __getitem__(self, key: int) -> ThumbcacheEntry:
        if key in self._cached_entries:
            return self._cached_entries[key]

        with seek_and_return(self.fh, key) as file:
            item = ThumbcacheEntry(file, self.version)
        self._cached_entries[key] = item
        return item

    def __getattribute__(self, name: str) -> Any:
        try:
            return object.__getattribute__(self, name)
        except AttributeError:
            pass

        return getattr(self.header, name.capitalize())

    def entries(self) -> Iterator[ThumbcacheEntry]:
        with seek_and_return(self.fh, self.fh.tell()):
            try:
                while True:
                    yield ThumbcacheEntry(self.fh, self.version)
            except EOFError:
                pass


class ThumbcacheEntry:
    _signature = b"CMMM"

    """ThumbcacheEntry represents an entry inside the thumbcache file.

    A cache entry contains a hash that is constructed from GUID, NTFS FILEID, the extention and last modified time.
    At least for Windows 7: http://www.swiftforensics.com/2012/06/windows-7-thumbcache-hash-algorithm.html

    Args:
        fh: A reference to binary data, where we can read from.
        type: The type of system that generated the entry.

    Raises:
        InvalidSignatureError: If the entry does not have a proper signature.
    """

    _checksum_lengths = 0x10

    def __init__(self, fh: BinaryIO, type: ThumbnailType) -> None:
        self._type = type
        self._header = self._get_header(type)(fh)

        if self._header.Signature != self._signature:
            raise InvalidSignatureError(
                f"The signature {self._header.Signature!r} does not match the expected {self._signature}."
            )

        additional_bytes = self._checksum_lengths
        if type > ThumbnailType.WINDOWS_7:
            # There are some additional unknown bytes before the header continues,
            # I do not know what kind of information it contains
            fh.read(UNKNOWN_BYTES)
            additional_bytes += UNKNOWN_BYTES

        self.data_checksum: bytes = c_thumbcache.char[8](fh)
        self.header_checksum: bytes = c_thumbcache.char[8](fh)

        self.identifier: str = c_thumbcache.wchar[self._header.IdentifierSize // 2](fh)

        header_size = len(self._header) + self._header.IdentifierSize + additional_bytes

        self._data = fh.read(self._header.Size - header_size)

    def _get_header(
        self, thumbnail_type: ThumbnailType
    ) -> type[c_thumbcache.CACHE_ENTRY_VISTA | c_thumbcache.CACHE_ENTRY]:
        if thumbnail_type == ThumbnailType.WINDOWS_VISTA:
            return c_thumbcache.CACHE_ENTRY_VISTA
        return c_thumbcache.CACHE_ENTRY

    @property
    def hash(self) -> str:
        return self._header.Hash.hex()

    @property
    def extension(self) -> str:
        """This property contains the extension type of the data (Only in VISTA)."""
        if self._type == ThumbnailType.WINDOWS_VISTA:
            return self._header.Extension.strip("\x00")
        return ""

    @property
    def data(self) -> bytes:
        return self._data[self._header.PaddingSize :]

    def __repr__(self):
        return f"{self.hash=} {self.data_checksum=} {self.header_checksum=} {self.identifier=}"
