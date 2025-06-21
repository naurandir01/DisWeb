from __future__ import annotations

import logging
import os
import stat
import zlib
from bisect import bisect_right
from functools import cache, cached_property, lru_cache
from typing import TYPE_CHECKING, BinaryIO

from dissect.util import ts
from dissect.util.compression import lzo
from dissect.util.stream import AlignedStream, RunlistStream

from dissect.jffs.c_jffs2 import DT_MAP, JFFS2_MAGIC_NUMBERS, c_jffs2
from dissect.jffs.exceptions import (
    Error,
    FileNotFoundError,
    NotADirectoryError,
    NotASymlinkError,
)

if TYPE_CHECKING:
    from collections.abc import Iterator
    from datetime import datetime

log = logging.getLogger(__name__)
log.setLevel(os.getenv("DISSECT_LOG_JFFS", "CRITICAL"))


class JFFS2:
    """Journalling Flash File System, version 2 implementation.

    Currently supports the most common compression formats (``zlib``, ``lzo``, ``none`` and ``zero``).
    CRC checksums are currently ignored. Compression formats ``rtime``, ``rubinmips``, ``copy``
    and ``dynrubin`` are not supported.

    References:
        - https://sourceware.org/jffs2/
        - https://github.com/torvalds/linux/blob/master/fs/jffs2/readinode.c
    """

    def __init__(self, fh: BinaryIO):
        self.fh = fh

        # Dict of ino to list of tuples of (inode, offset)
        self._inodes: dict[int, list[tuple[c_jffs2.jffs2_raw_inode, int]]] = {}
        # Dict of pino to dict of dirent names to list of dirents
        self._dirents: dict[int, dict[bytes, list[DirEntry]]] = {}
        self._lost_found: list[list[DirEntry]] = []
        # Map of nlinks by inum
        self._nlinks_by_inum: dict[int, int] = {}

        if (node := c_jffs2.jffs2_unknown_node(fh)).magic not in JFFS2_MAGIC_NUMBERS:
            raise Error(f"Unknown JFFS2 magic: {node.magic:#x}")

        self.inode = lru_cache(4096)(self.inode)

        self.root = self.inode(inum=0x1, type=c_jffs2.DT_DIR, parent=None)

        self._scan()
        self._count_nlinks()
        self._garbage_collect()

    def inode(self, inum: int, type: int | None = None, parent: INode | None = None) -> INode:
        return INode(self, inum, type, parent)

    def get(self, path: str | int, node: INode | None = None) -> INode:
        if isinstance(path, int):
            return self.inode(path)

        parts = path.encode().split(b"/")
        node = node or self.root

        for part in parts:
            if not part:
                continue

            while node.type == stat.S_IFLNK:
                node = node.link_inode

            if dirent := self._dirents[node.inum].get(part):
                node = self.inode(dirent[-1].inum)
            else:
                raise FileNotFoundError(f"File not found: {path}")

        return node

    def _scan(self) -> None:
        """Scan the filesystem for inodes and dirents."""
        fh = self.fh
        pos = 0

        while True:
            fh.seek(pos)

            # Cheat a little and bypass cstruct for performance reasons
            buf = fh.read(4)
            if len(buf) != 4:
                break

            header = int.from_bytes(buf, "little")
            magic = header & 0xFFFF
            nodetype = header >> 16

            if magic not in JFFS2_MAGIC_NUMBERS:
                pos += 4
                continue

            if nodetype == c_jffs2.JFFS2_NODETYPE_DIRENT:
                self.fh.seek(pos)
                dirent = c_jffs2.jffs2_raw_dirent(self.fh)

                # If the dirent.ino is 0x00 this indicates that the dirent
                # and any associated data inodes are unlinked.
                if dirent.ino == 0:
                    orphaned = self._dirents[dirent.pino].pop(dirent.name)
                    self._lost_found.append(orphaned)
                else:
                    dirents = self._dirents.setdefault(dirent.pino, {}).setdefault(dirent.name, [])
                    entry = DirEntry(self, dirent)

                    # Only assure that the last entry is sorted correctly
                    if dirents and dirents[-1].version < entry.version:
                        dirents.append(entry)
                    else:
                        dirents.insert(0, entry)

                totlen = dirent.totlen

            elif nodetype == c_jffs2.JFFS2_NODETYPE_INODE:
                self.fh.seek(pos)
                inode = c_jffs2.jffs2_raw_inode(self.fh)

                inodes = self._inodes.setdefault(inode.ino, [])
                entry = (inode, pos + len(c_jffs2.jffs2_raw_inode))

                # Only assure that the last entry is sorted correctly
                if inodes and inodes[-1][0].version < inode.version:
                    inodes.append(entry)
                else:
                    inodes.insert(0, entry)

                totlen = inode.totlen

            else:
                log.warning("Unknown nodetype %#x, skipping", nodetype)
                try:
                    totlen = int.from_bytes(fh.read(4), "little")
                except EOFError:
                    break

            pos += (totlen + 3) & ~3

    def _count_nlinks(self) -> None:
        """Count the number of hardlinks for each inode.

        JFFS does not store nlink information in the inode itself, so we have to calculate it.
        """
        for direntries in self._dirents.values():
            for versions in direntries.values():
                if not versions:
                    continue

                last_version = versions[-1]
                if last_version.type == c_jffs2.DT_DIR:
                    # Root dir (inum == 1) gets three nlinks
                    # (see https://github.com/torvalds/linux/blob/6485cf5ea253d40d507cd71253c9568c5470cd27/fs/jffs2/fs.c#L311)
                    self._nlinks_by_inum[last_version.inum] = 3 if last_version.inum == 1 else 2

                    # Now update the parent entry, which might not have an associated nlink yet.
                    # The parent directory gets one nlink for each child directory.
                    base_nlinks = 3 if last_version.parent_inum == 1 else 2
                    self._nlinks_by_inum[last_version.parent_inum] = (
                        self._nlinks_by_inum.get(last_version.parent_inum, base_nlinks) + 1
                    )

                elif last_version.type == c_jffs2.DT_REG:
                    self._nlinks_by_inum[last_version.inum] = self._nlinks_by_inum.get(last_version.inum, 0) + 1
                elif last_version.type == c_jffs2.DT_LNK:
                    self._nlinks_by_inum[last_version.inum] = 1

    def _garbage_collect(self) -> None:
        """Collect all found orphaned files and put them in the lost+found folder."""
        if not self._lost_found:
            log.debug("No files to collect for lost+found folder.")
            return

        # Add lost+found folder to root
        trash_dirent = DirEntry(
            self,
            c_jffs2.jffs2_raw_dirent(
                pino=self.root.inum,
                version=1,
                ino=-1,
                type=c_jffs2.DT_DIR,
                name=b"lost+found",
            ),
        )
        self._dirents[self.root.inum][trash_dirent.entry.name] = [trash_dirent]
        self._dirents[-1] = {}

        # Add all orphaned files to the lost+found folder
        for dirents in self._lost_found:
            dirent = dirents[-1]
            dirent.name = f"{dirent.name}_ino_{dirent.inum}_pino_{dirent.parent_inum}_ver_{dirent.version}"
            dirent.parent_inum = -1
            self._dirents[-1][dirent.name.encode()] = dirents


class DirEntry:
    def __init__(self, fs: JFFS2, entry: c_jffs2.jffs2_raw_dirent):
        self.fs = fs
        self.entry = entry

        self.parent_inum = entry.pino
        self.version = entry.version
        self.inum = entry.ino
        self.type = entry.type

    @cached_property
    def name(self) -> str:
        return self.entry.name.decode(errors="surrogateescape")


class INode:
    def __init__(self, fs: JFFS2, inum: int, type: int | None = None, parent: INode | None = None):
        self.fs = fs
        self.inum = inum
        self._type = type
        self.parent = parent

        self.listdir = cache(self.listdir)

    def __repr__(self) -> str:
        return f"<INode inum={self.inum}>"

    @cached_property
    def inodes(self) -> list[tuple[c_jffs2.jffs2_raw_inode, int]]:
        # Root inode does not exist in jffs2 so we create a fake one (0x1),
        # -1 is reserved for the lost+found directory
        if self.inum in [0x1, -1]:
            return [
                (
                    c_jffs2.jffs2_raw_inode(
                        ino=self.inum,
                        version=0x1,
                        mode=0o40755,
                        uid=0x0,
                        gid=0x0,
                        atime=0x0,
                        mtime=0x0,
                        ctime=0x0,
                        csize=0x0,
                        dsize=0x0,
                    ),
                    0,
                )
            ]

        inodes = self.fs._inodes.get(self.inum)
        if not inodes:
            raise ValueError(f"INode with inum {self.inum} does not exist")

        return inodes

    @cached_property
    def inode(self) -> c_jffs2.jffs2_raw_inode:
        return self.inodes[-1][0]

    @cached_property
    def size(self) -> int:
        return self.inode.isize

    @cached_property
    def mode(self) -> int:
        return self.inode.mode

    @cached_property
    def type(self) -> int:
        return DT_MAP.get(self._type) or stat.S_IFMT(self.inode.mode)

    @cached_property
    def atime(self) -> datetime:
        return ts.from_unix(self.inode.atime)

    @cached_property
    def mtime(self) -> datetime:
        return ts.from_unix(self.inode.mtime)

    @cached_property
    def ctime(self) -> datetime:
        return ts.from_unix(self.inode.ctime)

    @cached_property
    def uid(self) -> int:
        return self.inode.uid

    @cached_property
    def gid(self) -> int:
        return self.inode.gid

    @cached_property
    def nlink(self) -> int:
        return self.fs._nlinks_by_inum.get(self.inum, 0)

    def is_dir(self) -> bool:
        return self.type == stat.S_IFDIR

    def is_file(self) -> bool:
        return self.type == stat.S_IFREG

    def is_symlink(self) -> bool:
        return self.type == stat.S_IFLNK

    @cached_property
    def link(self) -> str:
        if not self.is_symlink():
            raise NotASymlinkError(f"{self!r} is not a symlink")

        return self.open().read().decode(errors="surrogateescape")

    @cached_property
    def link_inode(self) -> INode:
        link = self.link
        return self.fs.get(self.link, self.parent if link.startswith("/") else None)

    def listdir(self) -> dict:
        return dict(self.iterdir())

    def iterdir(self) -> Iterator[tuple[str, INode]]:
        if not self.is_dir():
            raise NotADirectoryError(f"{self!r} is not a directory")

        for dirents in self.fs._dirents.get(self.inum, {}).values():
            dirent = dirents[-1]
            yield dirent.name, self.fs.inode(dirent.inum, dirent.type, parent=self)

    def open(self) -> RunlistStream:
        """Return data contained in all associated data inodes.

        Supports JFFS2_COMPR_NONE, JFFS2_COMPR_ZERO, JFFS2_COMPR_ZLIB and JFFS2_COMPR_LZO.

        Does not support JFFS2_COMPR_RTIME, JFFS2_COMPR_RUBINMIPS, JFFS2_COMPR_COPY and JFFS2_COMPR_DYNRUBIN.
        """
        return DataStream(self.fs, self.inum, self.size)


class DataStream(AlignedStream):
    """JFFS2 buffered stream that provides easy aligned reads.

    To read file contents, the log inodes are played back in
    version order, to recreate a map of where each range of
    data is located on the physical medium.
    """

    def __init__(self, fs: JFFS2, inum: int, size: int):
        self.fs = fs
        self.inum = inum

        runs = []
        run_offsets = []

        offset = 0
        for entry, pos in fs._inodes.get(inum, []):
            if offset != 0:
                run_offsets.append(offset)

            if offset < entry.offset:
                runs.append((None, None, entry.offset - offset, c_jffs2.JFFS2_COMPR_NONE))
                offset = entry.offset
                run_offsets.append(offset)

            runs.append((pos, entry.csize, entry.dsize, entry.compr))
            offset += entry.dsize

        if offset < size:
            runs.append((None, None, size - offset, c_jffs2.JFFS2_COMPR_NONE))
            run_offsets.append(offset)

        self._runlist = runs
        self._runlist_offsets = run_offsets

        super().__init__(size)

    def _read(self, offset: int, length: int) -> bytes:
        r = []

        run_idx = bisect_right(self._runlist_offsets, offset)
        runlist_len = len(self._runlist)
        size = self.size

        while length > 0:
            if run_idx >= runlist_len:
                # We somehow requested more data than we have runs for
                break

            # If run_idx == 0, we only have a single run
            run_pos = offset - (0 if run_idx == 0 else self._runlist_offsets[run_idx - 1])
            run_offset, run_data_size, run_size, run_compr = self._runlist[run_idx]
            run_remaining = run_size - run_pos

            # Sometimes the self.size is way larger than what we actually have runs for?
            # Stop reading if we reach a negative run_remaining
            if run_remaining < 0:
                break

            read_count = min(size - offset, min(run_remaining, length))

            # Sparse run
            if run_offset is None:
                r.append(b"\x00" * read_count)
            else:
                if run_compr in (c_jffs2.JFFS2_COMPR_NONE, c_jffs2.JFFS2_COMPR_ZERO):
                    self.fs.fh.seek(run_offset + run_pos)
                    r.append(self.fs.fh.read(read_count))
                else:
                    self.fs.fh.seek(run_offset)
                    buf = self.fs.fh.read(run_data_size)
                    if run_compr == c_jffs2.JFFS2_COMPR_ZLIB:
                        buf = zlib.decompress(buf)
                    elif run_compr == c_jffs2.JFFS2_COMPR_LZO:
                        buf = lzo.decompress(buf)
                    else:
                        raise NotImplementedError(f"Unsupported compression: {run_compr:#x}")

                    r.append(buf[run_pos : run_pos + read_count])

            offset += read_count
            length -= read_count
            run_idx += 1

        return b"".join(r)
