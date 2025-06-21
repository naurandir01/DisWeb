# Reference:
# - https://github.com/torvalds/linux/blob/master/Documentation/filesystems/qnx6.rst
# - https://github.com/torvalds/linux/blob/master/fs/qnx6

from __future__ import annotations

import stat
import struct
from functools import cached_property, lru_cache
from typing import TYPE_CHECKING, BinaryIO
from uuid import UUID

from dissect.util import ts
from dissect.util.stream import RunlistStream
from dissect.util.ts import from_unix

from dissect.qnxfs.c_qnx6 import c_qnx6, c_qnx6_be, c_qnx6_le
from dissect.qnxfs.exceptions import (
    FileNotFoundError,
    InvalidFilesystemError,
    NotADirectoryError,
    NotASymlinkError,
)

if TYPE_CHECKING:
    from collections.abc import Iterator
    from datetime import datetime

    from dissect.cstruct import cstruct


class QNX6:
    """QNX6 filesystem implementation.

    Args:
        fh: A file-like object of the volume containing the filesystem.
    """

    def __init__(self, fh: BinaryIO):
        self.fh = fh
        self._c_qnx: c_qnx6 = None

        sb_offset, self.sb1, self._c_qnx = _find_sb(fh)
        second_sb_offset = self.sb1.sb_num_blocks * self.sb1.sb_blocksize + sb_offset + c_qnx6.QNX6_SUPERBLOCK_AREA
        fh.seek(second_sb_offset)
        self.sb2 = self._c_qnx.qnx6_super_block(fh)
        if self.sb2.sb_magic != c_qnx6.QNX6_SUPER_MAGIC:
            raise InvalidFilesystemError("Unable to find second QNX6 superblock")

        self.sb = self.sb1 if self.sb1.sb_serial >= self.sb2.sb_serial else self.sb2
        self.ctime = from_unix(self.sb.sb_ctime)
        self.atime = from_unix(self.sb.sb_atime)
        self.volume_id = UUID(bytes_le=self.sb.sb_volumeid)
        self.block_size = self.sb.sb_blocksize
        self.num_inodes = self.sb.sb_num_inodes
        self.num_blocks = self.sb.sb_num_blocks

        self._blocks_offset = (sb_offset + c_qnx6.QNX6_SUPERBLOCK_AREA) // self.block_size

        self._inodes = RunlistStream(
            self.fh,
            list(_generate_dataruns(self, self.sb.Inode.size, self.sb.Inode.ptr, self.sb.Inode.levels)),
            self.sb.Inode.size,
            self.block_size,
        )
        self._long_file = RunlistStream(
            self.fh,
            list(_generate_dataruns(self, self.sb.Longfile.size, self.sb.Longfile.ptr, self.sb.Longfile.levels)),
            self.sb.Longfile.size,
            self.block_size,
        )

        self.inode = lru_cache(1024)(self.inode)

        self.root = self.inode(c_qnx6.QNX6_ROOT_INO)

    def inode(self, inum: int) -> INode:
        """Return an inode object for the given inode number.

        Args:
            inum: The inode number.
        """
        return INode(self, inum)

    def get(self, path: str | int, node: INode | None = None) -> INode:
        """Return an inode object for the given path or inode number.

        Args:
            path: The path or inode number.
            node: An optional inode object to relatively resolve the path from.
        """
        if isinstance(path, int):
            return self.inode(path)

        node = node or self.root
        parts = path.split("/")

        prev_node = None
        for part in parts:
            if not part:
                continue

            while node.is_symlink():
                if not prev_node:
                    raise FileNotFoundError(f"Illegal symlink layout detected: {path}")
                prev_node, node = node, self.get(node.link, prev_node)

            for name, entry in node.iterdir():
                if name == part:
                    prev_node, node = node, entry
                    break
            else:
                raise FileNotFoundError(f"File not found: {path}")

        return node


class INode:
    def __init__(self, fs: QNX6, inum: int):
        self.fs = fs
        self.inum = inum

    def __repr__(self) -> str:
        return f"<inode {self.inum}>"

    def _read_inode(self) -> c_qnx6.qnx6_inode_entry:
        offset = (self.inum - 1) * c_qnx6.QNX6_INODE_SIZE
        self.fs._inodes.seek(offset)
        return self.fs._c_qnx.qnx6_inode_entry(self.fs._inodes)

    @cached_property
    def inode(self) -> c_qnx6.qnx6_inode_entry:
        """Return the inode entry."""
        return self._read_inode()

    @cached_property
    def size(self) -> int:
        """Return the file size."""
        return self.inode.di_size

    @cached_property
    def uid(self) -> int:
        """Return the owner user ID."""
        return self.inode.di_uid

    @cached_property
    def gid(self) -> int:
        """Return the owner group ID."""
        return self.inode.di_gid

    @cached_property
    def ftime(self) -> datetime:
        """Return the file creation time."""
        return ts.from_unix(self.inode.di_ftime)

    @cached_property
    def mtime(self) -> datetime:
        """Return the file modification time."""
        return ts.from_unix(self.inode.di_mtime)

    @cached_property
    def atime(self) -> datetime:
        """Return the file access time."""
        return ts.from_unix(self.inode.di_atime)

    @cached_property
    def ctime(self) -> datetime:
        """Return the file change time."""
        return ts.from_unix(self.inode.di_ctime)

    @cached_property
    def mode(self) -> int:
        """Return the file mode."""
        return self.inode.di_mode

    @cached_property
    def type(self) -> int:
        """Return the file type."""
        return stat.S_IFMT(self.mode)

    @cached_property
    def link(self) -> str:
        """Return the symlink target."""
        if not self.is_symlink():
            raise NotASymlinkError(f"{self!r} is not a symlink")

        return self.open().read().decode(errors="surrogateescape")

    def is_dir(self) -> bool:
        """Return whether this inode is a directory."""
        return self.type == stat.S_IFDIR

    def is_file(self) -> bool:
        """Return whether this inode is a regular file."""
        return self.type == stat.S_IFREG

    def is_symlink(self) -> bool:
        """Return whether this inode is a symlink."""
        return self.type == stat.S_IFLNK

    def is_block_device(self) -> bool:
        """Return whether this inode is a block device."""
        return self.type == stat.S_IFBLK

    def is_character_device(self) -> bool:
        """Return whether this inode is a character device."""
        return self.type == stat.S_IFCHR

    def is_device(self) -> bool:
        """Return whether this inode is a device."""
        return self.is_block_device() or self.is_character_device()

    def is_fifo(self) -> bool:
        """Return whether this inode is a FIFO file."""
        return self.type == stat.S_IFIFO

    def is_socket(self) -> bool:
        """Return whether this inode is a socket file."""
        return self.type == stat.S_IFSOCK

    def is_ipc(self) -> bool:
        """Return whether this inode is an IPC file."""
        return self.is_fifo() or self.is_socket()

    def listdir(self) -> dict[str, INode]:
        """Return a directory listing."""
        return dict(self.iterdir())

    def iterdir(self) -> Iterator[tuple[str, INode]]:
        """Iterate directory contents."""
        if not self.is_dir():
            raise NotADirectoryError(f"{self!r} is not a directory")

        fh = self.open()
        while fh.tell() < self.size:
            data = fh.read(c_qnx6.QNX6_DIR_ENTRY_SIZE)

            entry = self.fs._c_qnx.qnx6_dir_entry(data)
            if entry.de_inode == 0 or entry.de_size == 0:
                break

            if entry.de_size > c_qnx6.QNX6_SHORT_NAME_MAX:
                long_entry = self.fs._c_qnx.qnx6_long_dir_entry(data)
                self.fs._long_file.seek(long_entry.de_long_inode * self.fs.block_size)

                long_filename = self.fs._c_qnx.qnx6_long_filename(self.fs._long_file)
                name = long_filename.lf_fname[: long_filename.lf_size]
            else:
                name = entry.de_fname[: entry.de_size]

            name = name.decode(errors="surrogateescape")
            yield name, self.fs.inode(entry.de_inode)

    def dataruns(self) -> list[tuple[int, int]]:
        """Return the data runlist."""
        return list(_generate_dataruns(self.fs, self.size, self.inode.di_block_ptr, self.inode.di_filelevels))

    def open(self) -> BinaryIO:
        """Return a file-like object for reading the file."""
        return RunlistStream(self.fs.fh, self.dataruns(), self.size, self.fs.block_size)


def _find_sb(fh: BinaryIO) -> tuple[int, c_qnx6.qnx6_super_block, cstruct]:
    for sb_offset in [c_qnx6.QNX6_BOOTBLOCK_SIZE, 0]:
        fh.seek(sb_offset)
        try:
            sb = c_qnx6_le.qnx6_super_block(fh)
        except EOFError:
            continue

        if sb.sb_magic == c_qnx6.QNX6_SUPER_MAGIC:
            return sb_offset, sb, c_qnx6_le

        # Try big-endian
        fh.seek(sb_offset)
        sb = c_qnx6_be.qnx6_super_block(fh)
        if sb.sb_magic == c_qnx6.QNX6_SUPER_MAGIC:
            return sb_offset, sb, c_qnx6_be

    raise InvalidFilesystemError("Unable to find QNX6 superblock")


def _generate_dataruns(fs: QNX6, size: int, pointers: list[int], levels: int) -> Iterator[tuple[int, int]]:
    if levels == 0:
        for ptr in pointers:
            if ptr == 0xFFFFFFFF or size <= 0:
                break

            yield fs._blocks_offset + ptr, 1
            size -= fs.block_size
    else:
        for ptr in pointers:
            if ptr == 0xFFFFFFFF:
                break

            fs.fh.seek((fs._blocks_offset + ptr) * fs.block_size)
            blocks = struct.unpack(f"{fs._c_qnx.endian}{fs.block_size // 4}I", fs.fh.read(fs.block_size))
            yield from _generate_dataruns(fs, size, blocks, levels - 1)
