# Reference:
# - https://github.com/torvalds/linux/blob/master/fs/qnx4
# - fs-qnx4.so

from __future__ import annotations

import stat
from functools import cached_property, lru_cache
from typing import TYPE_CHECKING, BinaryIO

from dissect.util import ts
from dissect.util.stream import RunlistStream

from dissect.qnxfs.c_qnx4 import c_qnx4
from dissect.qnxfs.exceptions import (
    Error,
    FileNotFoundError,
    InvalidFilesystemError,
    NotADirectoryError,
    NotASymlinkError,
)

if TYPE_CHECKING:
    from collections.abc import Iterator
    from datetime import datetime


class QNX4:
    """QNX4 filesystem implementation.

    Args:
        fh: A file-like object of the volume containing the filesystem.
    """

    def __init__(self, fh: BinaryIO):
        if not _is_qnx4(fh):
            raise InvalidFilesystemError("Invalid QNX4 filesystem")

        self.fh = fh
        self.block_size = c_qnx4.QNX4_BLOCK_SIZE
        self.inode = lru_cache(1024)(self.inode)

        self.root = self.inode(c_qnx4.QNX4_ROOT_INO * c_qnx4.QNX4_INODES_PER_BLOCK)

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
    def __init__(self, fs: QNX4, inum: int):
        self.fs = fs
        self.inum = inum

    def __repr__(self) -> str:
        return f"<inode {self.inum}>"

    def _read_inode(self) -> c_qnx4.qnx4_inode_entry:
        block, index = divmod(self.inum, c_qnx4.QNX4_INODES_PER_BLOCK)
        self.fs.fh.seek((block * self.fs.block_size) + (index * c_qnx4.QNX4_DIR_ENTRY_SIZE))
        return c_qnx4.qnx4_inode_entry(self.fs.fh)

    @cached_property
    def inode(self) -> c_qnx4.qnx4_inode_entry:
        """Return the inode entry."""
        return self._read_inode()

    @cached_property
    def name(self) -> str:
        """Return the file name."""
        return self.inode.di_fname.split(b"\x00")[0].decode(errors="surrogateescape")

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
    def nlink(self) -> int:
        """Return the number of hard links."""
        return self.inode.di_nlink

    @cached_property
    def status(self) -> int:
        """Return the file status."""
        return self.inode.di_status

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
        return bool(self.type == stat.S_IFLNK or self.status & c_qnx4.QNX4_FILE_LINK)

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

        fh = self.fs.fh
        for block, size in self._iter_chain():
            for i in range(c_qnx4.QNX4_INODES_PER_BLOCK * size):
                fh.seek((block * self.fs.block_size) + (i * c_qnx4.QNX4_DIR_ENTRY_SIZE))

                buf = fh.read(c_qnx4.QNX4_DIR_ENTRY_SIZE)
                if len(buf) != c_qnx4.QNX4_DIR_ENTRY_SIZE:
                    raise Error("Invalid QNX4 directory entry")

                status = buf[-1]

                if not buf[0]:
                    continue

                if not status & (c_qnx4.QNX4_FILE_USED | c_qnx4.QNX4_FILE_LINK):
                    continue

                if status & c_qnx4.QNX4_FILE_LINK:
                    link_info = c_qnx4.qnx4_link_info(buf)
                    inum = ((link_info.dl_inode_blk - 1) * c_qnx4.QNX4_INODES_PER_BLOCK) + link_info.dl_inode_ndx

                    if link_info.dl_lfn_blk:
                        fh.seek((link_info.dl_lfn_blk - 1) * self.fs.block_size)
                        lfn_entry = c_qnx4.qnx4_longfilename_entry(fh)
                        name = lfn_entry.lfn_name
                    else:
                        name = buf[: c_qnx4.QNX4_NAME_MAX]
                else:
                    inum = (block * c_qnx4.QNX4_INODES_PER_BLOCK) + i
                    name = buf[: c_qnx4.QNX4_SHORT_NAME_MAX]

                name = name.split(b"\x00")[0].decode(errors="surrogateescape")
                yield name, self.fs.inode(inum)

    def _iter_chain(self) -> Iterator[tuple[int, int]]:
        """Iterate the extent chain."""
        num_extents = self.inode.di_num_xtnts
        if not num_extents:
            return

        yield self.inode.di_first_xtnt.xtnt_blk - 1, self.inode.di_first_xtnt.xtnt_size
        num_extents -= 1

        xblk_num = self.inode.di_xblk
        while num_extents:
            self.fs.fh.seek((xblk_num - 1) * self.fs.block_size)
            xblk = c_qnx4.qnx4_xblk(self.fs.fh)
            if xblk.signature != b"IamXblk":
                raise Error("Invalid QNX4 xblk signature")

            for i in range(xblk.xblk_num_xtnts):
                xtnt = xblk.xblk_xtnts[i]
                yield xtnt.xtnt_blk - 1, xtnt.xtnt_size

            xblk_num = xblk.xblk_next_xblk

    def dataruns(self) -> list[tuple[int, int]]:
        """Return the data runlist."""
        return list(self._iter_chain())

    def open(self) -> BinaryIO:
        """Return a file-like object for reading the file."""
        return RunlistStream(self.fs.fh, self.dataruns(), self.size, self.fs.block_size)


def _is_qnx4(fh: BinaryIO) -> bool:
    fh.seek(c_qnx4.QNX4_BLOCK_SIZE)
    return fh.read(16) == b"/" + b"\x00" * 15
