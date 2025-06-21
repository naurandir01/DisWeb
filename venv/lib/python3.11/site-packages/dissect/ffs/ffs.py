from __future__ import annotations

import io
import logging
import os
import stat
from functools import cached_property, lru_cache
from typing import TYPE_CHECKING, BinaryIO

from dissect.util import ts
from dissect.util.stream import RunlistStream

from dissect.ffs.c_ffs import c_ffs
from dissect.ffs.exceptions import (
    Error,
    FileNotFoundError,
    NotADirectoryError,
    NotASymlinkError,
)

if TYPE_CHECKING:
    from collections.abc import Iterator
    from datetime import datetime

log = logging.getLogger(__name__)
log.setLevel(os.getenv("DISSECT_LOG_FFS", "CRITICAL"))

DEV_BSIZE = 512
SBLOCKSEARCH = [
    c_ffs.SBLOCK_UFS2,
    c_ffs.SBLOCK_UFS1,
    c_ffs.SBLOCK_FLOPPY,
    c_ffs.SBLOCK_PIGGY,
]


class FFS:
    def __init__(self, fh: BinaryIO):
        self.fh = fh

        self.sb = None
        for sb_offset in SBLOCKSEARCH:
            sb = FFS.read_sb(fh, sb_offset)
            if sb is not None:
                self.sb = sb
                break
        else:
            raise Error("Can't find FFS superblock")

        if self.sb.fs_magic == c_ffs.FS_UFS1_MAGIC:
            self.version = 1
            self._inode_type = c_ffs.ufs1_dinode
            self._addr_type = c_ffs.ufs1_daddr_t
        else:
            self.version = 2
            self._inode_type = c_ffs.ufs2_dinode
            self._addr_type = c_ffs.ufs2_daddr_t

        self.block_size = self.sb.fs_bsize
        self.fragment_size = self.sb.fs_fsize
        self.inode_size = self.sb.fs_bsize // self.sb.fs_inopb

        self.mount_name = bytes(self.sb.fs_fsmnt).split(b"\x00")[0].decode(errors="surrogateescape")
        self.volume_name = bytes(self.sb.fs_volname).split(b"\x00")[0].decode(errors="surrogateescape")

        self.cylinder_group = lru_cache(1024)(self.cylinder_group)
        self.inode = lru_cache(4096)(self.inode)

        self.root = self.inode(c_ffs.UFS_ROOTINO, "/")

    @staticmethod
    def read_sb(fh: BinaryIO, offset: int) -> c_ffs.fs:
        fh.seek(offset)
        try:
            sb = c_ffs.fs(fh)
        except Exception:
            return None

        if sb.fs_magic not in (c_ffs.FS_UFS1_MAGIC, c_ffs.FS_UFS2_MAGIC):
            return None

        if sb.fs_ncg < 1 or not (c_ffs.MINBSIZE <= sb.fs_bsize <= c_ffs.MAXBSIZE) or sb.fs_sbsize > c_ffs.SBLOCKSIZE:
            return None

        return sb

    def cylinder_group(self, num: int) -> CylinderGroup:
        return CylinderGroup(self, num)

    def cylinder_groups(self) -> Iterator[CylinderGroup]:
        for num in range(self.sb.fs_ncg):
            yield self.cylinder_group(num)

    def inode(
        self, inum: int, name: str | None = None, filetype: int | None = None, parent: INode | None = None
    ) -> INode:
        return INode(self, inum, name, filetype, parent=parent)

    def get(self, path: str | int, node: INode | None = None) -> INode:
        if isinstance(path, int):
            return self.inode(path)

        node = node or self.root

        parts = path.split("/")

        for part_num, part in enumerate(parts):
            if not part:
                continue

            while node._type == stat.S_IFLNK and part_num < len(parts):
                node = node.link_inode

            for entry in node.iterdir():
                if entry.name == part:
                    node = entry
                    break
            else:
                raise FileNotFoundError(f"File not found: {path}")

        return node

    def iter_inodes(self) -> Iterator[INode]:
        cur_cg = None
        cur_cgnum = None

        num_inodes = self.sb.fs_ncg * self.sb.fs_ipg  # number of groups * inodes per group
        for inum in range(c_ffs.UFS_ROOTINO, num_inodes):
            cgnum = ino_to_cg(self, inum)
            if cgnum != cur_cgnum:
                cur_cg = self.cylinder_group(cgnum)
                cur_cgnum = cgnum

            if cur_cg.inode_allocated(inum):
                yield self.inode(inum)


class CylinderGroup:
    def __init__(self, fs: FFS, num: int):
        self.fs = fs
        self.num = num

        self.block = fsbtodb(fs, cgtod(fs, num))
        self.offset = self.block * DEV_BSIZE

        fs.fh.seek(self.offset)
        self.cg = c_ffs.cg(fs.fh)
        if self.cg.cg_magic != c_ffs.CG_MAGIC:
            raise Error("Invalid cylinder group magic")

    def inode_allocated(self, inum: int) -> bool:
        rel_inum = inum % self.fs.sb.fs_ipg

        byte_offset, bit_offset = divmod(rel_inum, 8)
        offset = self.offset + self.cg.cg_iusedoff + byte_offset

        self.fs.fh.seek(offset)
        bitmap = self.fs.fh.read(1)[0]

        return bitmap & (1 << bit_offset) != 0


class INode:
    def __init__(
        self, fs: FFS, inum: int, name: str | None = None, filetype: int | None = None, parent: INode | None = None
    ):
        self.fs = fs
        self.inum = inum
        self.name = name
        self._type = filetype
        self.parent = parent

        self._dirlist = None
        self._runlist = None

    def __repr__(self) -> str:
        return f"<inode {self.inum:d}>"

    def _read_inode(self) -> c_ffs.ufs1_dinode | c_ffs.ufs2_dinode:
        block = fsbtodb(self.fs, ino_to_fsba(self.fs, self.inum))
        offset = (block * DEV_BSIZE) + (ino_to_fsbo(self.fs, self.inum) * self.fs.inode_size)
        self.fs.fh.seek(offset)
        return self.fs._inode_type(self.fs.fh)

    @cached_property
    def cg(self) -> CylinderGroup:
        return self.fs.cylinder_group(ino_to_cg(self.fs, self.inum))

    @cached_property
    def inode(self) -> c_ffs.ufs1_dinode | c_ffs.ufs2_dinode:
        return self._read_inode()

    @cached_property
    def size(self) -> int:
        return self.inode.di_size

    @cached_property
    def type(self) -> int:
        return self._type or stat.S_IFMT(self.inode.di_mode)

    @cached_property
    def mode(self) -> int:
        return self.inode.di_mode

    @cached_property
    def atime(self) -> datetime:
        return ts.from_unix_ns(self.atime_ns)

    @cached_property
    def atime_ns(self) -> int:
        return (self.inode.di_atime * 1_000_000_000) + self.inode.di_atimensec

    @cached_property
    def mtime(self) -> datetime:
        return ts.from_unix_ns(self.mtime_ns)

    @cached_property
    def mtime_ns(self) -> int:
        return (self.inode.di_mtime * 1_000_000_000) + self.inode.di_mtimensec

    @cached_property
    def ctime(self) -> datetime:
        return ts.from_unix_ns(self.ctime_ns)

    @cached_property
    def ctime_ns(self) -> int:
        return (self.inode.di_ctime * 1_000_000_000) + self.inode.di_ctimensec

    @cached_property
    def btime(self) -> datetime | None:
        if btime_ns := self.btime_ns:
            return ts.from_unix_ns(btime_ns)
        return None

    @cached_property
    def btime_ns(self) -> int | None:
        if hasattr(self.inode, "di_birthtime"):
            return (self.inode.di_birthtime * 1_000_000_000) + self.inode.di_birthnsec
        return None

    @cached_property
    def link(self) -> str:
        if not self.is_symlink():
            raise NotASymlinkError(f"{self!r} is not a symlink")

        return self.open().read().decode(errors="surrogateescape")

    @cached_property
    def link_inode(self) -> INode:
        # Relative lookups work because . and .. are actual directory entries
        link = self.link
        relnode = None if link.startswith("/") else self.parent
        return self.fs.get(self.link, relnode)

    @cached_property
    def nblocks(self) -> int:
        return self.inode.di_blocks

    def is_dir(self) -> bool:
        return self.type == stat.S_IFDIR

    def is_file(self) -> bool:
        return self.type == stat.S_IFREG

    def is_symlink(self) -> bool:
        return self.type == stat.S_IFLNK

    def listdir(self) -> dict[str, INode]:
        if not self._dirlist:
            self._dirlist = {node.name: node for node in self.iterdir()}
        return self._dirlist

    def iterdir(self) -> Iterator[INode]:
        if not self.is_dir():
            raise NotADirectoryError(f"{self!r} is not a directory")

        buf = self.open()
        offset = 0

        while offset < self.size - 8:
            dirent = c_ffs.direct(buf)
            if dirent.d_reclen == 0:
                log.critical("Zero-length directory entry in %s (offset 0x%x)", self, offset)
                return

            dname = buf.read(dirent.d_namlen).decode(errors="surrogateescape")
            dtype = dirent.d_type << 12

            yield self.fs.inode(dirent.d_ino, dname, dtype, parent=self)

            # Can find slack entries if d_reclen > d_namlen (rounded to nearest 4 bytes)
            offset += dirent.d_reclen
            buf.seek(offset)

    def dataruns(self) -> list[tuple[int, int]]:
        # So this is a bit confusing.
        # FFS uses file system blocks for logical addressing (e.g. 32k).
        # File system blocks are made up of fragments (e.g. 4k).
        # Within source code, you generally only see references to file system blocks.
        # However, all block numbers are actually fragment numbers. File system blocks
        # just happen to be in steps of however-many-fragments-are-in-a-file-system-block.
        # E.g. the file system blocks 993776 and 993784 are actually contigious, because
        # there are 8 fragments in a file system block.
        # Because of this, we do a bit of run number manipulation to create an efficient run list.
        # To be safe, we also use the fragment size as block size for the RunlistStream.
        if not self._runlist:
            runs = []
            run_offset = None
            run_size = 1
            for block_num in self._iter_blocks():
                if run_offset is None:
                    run_offset = block_num
                    continue

                if block_num == run_offset + (run_size * self.fs.sb.fs_frag):
                    run_size += 1
                else:
                    run_size *= self.fs.sb.fs_frag
                    if run_offset == 0:
                        runs.append((None, run_size))
                    else:
                        runs.append((run_offset, run_size))

                    run_offset = block_num
                    run_size = 1

            runs.append((run_offset, run_size * self.fs.sb.fs_frag))

            self._runlist = runs

        return self._runlist

    def open(self) -> io.BytesIO | RunlistStream:
        if self.is_symlink() and self.size < self.fs.sb.fs_maxsymlinklen:
            # This is a bit hacky since we prefer to parse di_db and di_ib as arrays, rather than bytes
            # However, short symlinks store the link here
            buf = io.BytesIO()
            self.fs._addr_type[c_ffs.UFS_NDADDR].write(buf, self.inode.di_db)
            self.fs._addr_type[c_ffs.UFS_NIADDR].write(buf, self.inode.di_ib)
            buf.seek(0)
            buf.truncate(self.size)
            # Need to add a size attribute to maintain compatibility with dissect streams
            buf.size = self.size
            return buf

        return RunlistStream(self.fs.fh, self.dataruns(), self.size, self.fs.fragment_size)

    def _iter_blocks(self) -> Iterator[int]:
        num_blocks = (self.size + (self.fs.block_size - 1)) // self.fs.block_size
        num_direct_blocks = min(num_blocks, c_ffs.UFS_NDADDR)

        blocks = self.inode.di_db[:num_direct_blocks]
        num_blocks -= num_direct_blocks

        yield from blocks

        if num_blocks > 0:
            for level1 in range(c_ffs.UFS_NIADDR):
                indirect_block = self.inode.di_ib[level1]
                for block, level2 in self._walk_indirect(indirect_block, level1 + 1, num_blocks):
                    if level2 != 0:
                        continue

                    yield block
                    num_blocks -= 1

                    if num_blocks == 0:
                        return

    def _walk_indirect(self, block: int, level: int, num_blocks: int) -> Iterator[tuple[int, int]]:
        yield block, level

        if level > 0:
            addresses_per_block = self.fs.sb.fs_nindir
            max_level_blocks = addresses_per_block**level
            blocks_per_nest = max_level_blocks // addresses_per_block
            read_blocks = (num_blocks + blocks_per_nest - 1) // blocks_per_nest
            read_blocks = min(read_blocks, addresses_per_block)

            self.fs.fh.seek(fsbtodb(self.fs, block) * DEV_BSIZE)
            for addr in self.fs._addr_type[read_blocks](self.fs.fh):
                yield from self._walk_indirect(addr, level - 1, num_blocks)


# Some useful C macros used by UFS/FFS converted to Python functions
# The names are kept to ease debugging/readability when comparing to the original source.
def fsbtodb(fs: FFS, b: int) -> int:
    return b << fs.sb.fs_fsbtodb


def dbtofsb(fs: FFS, b: int) -> int:
    return b >> fs.sb.fs_fsbtodb


def cgbase(fs: FFS, c: int) -> int:
    return fs.sb.fs_fpg * c


def cgdata(fs: FFS, c: int) -> int:
    return cgdmin(fs, c) + fs.sb.fs_metaspace


def cgmeta(fs: FFS, c: int) -> int:
    return cgdmin(fs, c)


def cgdmin(fs: FFS, c: int) -> int:
    return cgstart(fs, c) + fs.sb.fs_dblkno


def cgimin(fs: FFS, c: int) -> int:
    return cgstart(fs, c) + fs.sb.fs_iblkno


def cgsblock(fs: FFS, c: int) -> int:
    return cgstart(fs, c) + fs.sb.fs_sblkno


def cgtod(fs: FFS, c: int) -> int:
    return cgstart(fs, c) + fs.sb.fs_cblkno


def cgstart(fs: FFS, c: int) -> int:
    if fs.sb.fs_magic == c_ffs.FS_UFS2_MAGIC:
        return cgbase(fs, c)

    return cgbase(fs, c) + fs.sb.fs_old_cgoffset * (c & ~fs.sb.fs_old_cgmask)


def ino_to_cg(fs: FFS, x: int) -> int:
    # inode number to cylinder group number.
    return x // fs.sb.fs_ipg


def ino_to_fsba(fs: FFS, x: int) -> int:
    # inode number to filesystem block address.
    return cgimin(fs, ino_to_cg(fs, x)) + blkstofrags(fs, (x % fs.sb.fs_ipg) // fs.sb.fs_inopb)


def ino_to_fsbo(fs: FFS, x: int) -> int:
    # inode number to filesystem block offset.
    return x % fs.sb.fs_inopb


def blkstofrags(fs: FFS, blks: int) -> int:
    return blks << fs.sb.fs_fragshift
