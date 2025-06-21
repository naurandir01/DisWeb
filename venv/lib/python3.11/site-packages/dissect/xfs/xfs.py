from __future__ import annotations

import io
import logging
import os
import stat
from functools import lru_cache
from typing import TYPE_CHECKING, BinaryIO
from uuid import UUID

from dissect.util import ts
from dissect.util.stream import RangeStream, RunlistStream

from dissect.xfs.c_xfs import FILETYPES, c_xfs
from dissect.xfs.exceptions import (
    Error,
    FileNotFoundError,
    NotADirectoryError,
    NotASymlinkError,
    SymlinkUnavailableException,
    UnsupportedDataforkException,
)

if TYPE_CHECKING:
    from collections.abc import Iterator
    from datetime import datetime

log = logging.getLogger(__name__)
log.setLevel(os.getenv("DISSECT_LOG_XFS", "CRITICAL"))


class XFS:
    def __init__(self, fh: BinaryIO):
        self.fh = fh
        self.ag = {0: AllocationGroup(self, fh, 0)}
        self.sb = self.ag[0].sb

        self.block_size = self.sb.sb_blocksize
        self.version = self.sb.sb_versionnum & c_xfs.XFS_SB_VERSION_NUMBITS
        self._has_ftype = (self.version == 5 and self.sb.sb_features_incompat & c_xfs.XFS_SB_FEAT_INCOMPAT_FTYPE) or (
            self.sb.sb_features2 & c_xfs.XFS_SB_VERSION2_FTYPE
        )
        self._has_crc = self.version == 5

        # This should be the same across all AG's
        self._inum_bits = self.sb.sb_agblklog + self.sb.sb_inopblog
        self._inum_mask = (1 << self._inum_bits) - 1
        self._inum_max = self.sb.sb_agblocks * self.sb.sb_inopblock
        # Not necessarily correct for the last AG, but doesn't harm
        self._ag_size = self.sb.sb_agblocks * self.block_size

        self._lblock_s = c_xfs.xfs_btree_lblock_crc if self._has_crc else c_xfs.xfs_btree_lblock
        self._sblock_s = c_xfs.xfs_btree_sblock_crc if self._has_crc else c_xfs.xfs_btree_sblock

        self.name = self.sb.sb_fname.split(b"\x00")[0].decode(errors="surrogateescape")
        self.uuid = UUID(bytes=self.sb.sb_uuid)
        self.meta_uuid = UUID(bytes=self.sb.sb_meta_uuid)

        self.root = self.get_inode(self.sb.sb_rootino)

    def get(self, path: int | str, node: INode | None = None) -> INode:
        if isinstance(path, int):
            return self.get_inode(path)

        node = node if node else self.root

        parts = path.split("/")
        for part in parts:
            if not part:
                continue

            while node.filetype == stat.S_IFLNK:
                node = node.link_inode

            for entry in node.iterdir():
                if entry.filename == part:
                    node = entry
                    break
            else:
                raise FileNotFoundError(f"File not found: {path}")

        return node

    def get_allocation_group(self, agnum: int) -> AllocationGroup:
        if agnum not in self.ag:
            self.ag[agnum] = AllocationGroup(self, RangeStream(self.fh, agnum * self._ag_size, self._ag_size), agnum)
        return self.ag[agnum]

    def get_inode(self, absinum: int, *args, **kwargs) -> INode:
        return self.get_relative_inode(absinum >> self._inum_bits, absinum & self._inum_mask, *args, **kwargs)

    def get_relative_inode(self, agnum: int, inum: int, *args, **kwargs) -> INode:
        if agnum >= self.sb.sb_agcount:
            raise Error(f"Allocation group num exceeds number of allocation groups: {agnum} >= {self.sb.sb_agcount}")
        if inum >= self._inum_max:
            raise Error(f"inode number exceeds number of inodes per allocation group: {inum} >= {self._inum_max}")

        return self.get_allocation_group(agnum).get_inode(inum, *args, **kwargs)

    def walk_agi(self, block: int, agnum: int) -> Iterator[c_xfs.xfs_inobt_rec]:
        for record in self.walk_small_tree(block, agnum, 16, (c_xfs.XFS_IBT_MAGIC, c_xfs.XFS_IBT_CRC_MAGIC)):
            yield c_xfs.xfs_inobt_rec(record)

    def walk_extents(self, block: int) -> Iterator[tuple[int, int, int, int]]:
        for record in self.walk_large_tree(block, 16, (c_xfs.XFS_BMAP_MAGIC, c_xfs.XFS_BMAP_CRC_MAGIC)):
            yield parse_fsblock(record)

    def walk_large_tree(self, block: int, leaf_size: int, magic: list[int] | None = None) -> Iterator[bytes]:
        self.fh.seek(block * self.block_size)
        root = self._lblock_s(self.fh)

        yield from self._walk_large_tree(root, leaf_size, magic)

    def walk_small_tree(
        self, block: int, agnum: int, leaf_size: int, magic: list[int] | None = None
    ) -> Iterator[bytes]:
        block = agnum * self.sb.sb_agblocks + block
        self.fh.seek(block * self.block_size)
        root = self._sblock_s(self.fh)

        yield from self._walk_small_tree(root, leaf_size, agnum, magic)

    def _walk_small_tree(
        self,
        node: c_xfs.xfs_btree_sblock | c_xfs.xfs_btree_sblock_crc,
        leaf_size: int,
        agnum: int,
        magic: list[int] | None = None,
    ) -> Iterator[bytes]:
        fh = self.fh
        if magic and node.bb_magic not in magic:
            magic_values = ", ".join([f"0x{magic_value:x}" for magic_value in magic])
            raise Error(f"B+Tree node has invalid magic. Expected one of ({magic_values}), got 0x{node.bb_magic:x}")

        if node.bb_level == 0:
            buf = fh.read(node.bb_numrecs * leaf_size)
            for rec_num in range(node.bb_numrecs):
                yield buf[rec_num * leaf_size : (rec_num + 1) * leaf_size]
        else:
            # Pointers start around halfway, we should already be at offset len(struct)
            maxrecs = (self.block_size - len(self._sblock_s)) // 8
            fh.seek(maxrecs * 4, io.SEEK_CUR)
            ptrs = c_xfs.uint32[node.bb_numrecs](fh)
            for ptr in ptrs:
                block = agnum * self.sb.sb_agblocks + ptr
                fh.seek(block * self.block_size)

                yield from self._walk_small_tree(self._sblock_s(fh), leaf_size, agnum, magic)

    def _walk_large_tree(
        self,
        node: c_xfs.xfs_btree_lblock | c_xfs.xfs_btree_lblock_crc,
        leaf_size: int,
        magic: list[int] | None = None,
    ) -> Iterator[bytes]:
        fh = self.fh
        if magic and node.bb_magic not in magic:
            magic_values = ", ".join([f"0x{magic_value:x}" for magic_value in magic])
            raise Error(f"B+Tree node has invalid magic. Expected one of ({magic_values}), got 0x{node.bb_magic:x}")

        if node.bb_level == 0:
            buf = fh.read(node.bb_numrecs * leaf_size)
            for rec_num in range(node.bb_numrecs):
                yield buf[rec_num * leaf_size : (rec_num + 1) * leaf_size]
        else:
            # Pointers start around halfway, we should already be at offset len(struct)
            maxrecs = (self.block_size - len(self._lblock_s)) // 16
            fh.seek(maxrecs * 8, io.SEEK_CUR)
            ptrs = c_xfs.uint64[node.bb_numrecs](fh)
            for ptr in ptrs:
                agnum, blknum = fsb_to_bb(ptr, self.sb.sb_agblklog)
                block = agnum * self.sb.sb_agblocks + blknum
                fh.seek(block * self.block_size)

                yield from self._walk_large_tree(self._lblock_s(fh), leaf_size, magic)


class AllocationGroup:
    def __init__(self, xfs: XFS, fh: BinaryIO, num: int):
        self.xfs = xfs
        self.fh = fh
        self.num = num

        fh.seek(0)

        self.sb = c_xfs.xfs_sb(fh)
        sb = self.sb

        if sb.sb_magicnum != c_xfs.XFS_SB_MAGIC:
            raise Error("Not a valid XFS filesystem (magic mismatch)")

        self.block_size = sb.sb_blocksize
        if self.block_size == 0 or self.block_size % 512:
            raise Error("Not a valid XFS filesystem (invalid block size)")

        # This seems to be all related to allocation
        # Do we really need to parse this?
        # fh.seek(sb.sb_sectsize * 1)
        # self.agf = c_xfs.xfs_agf(fh)

        fh.seek(sb.sb_sectsize * 2)
        self.agi = c_xfs.xfs_agi(fh)
        if self.agi.agi_magicnum != c_xfs.XFS_AGI_MAGIC:
            raise Error("Not a valid XFS filesystem (AGI magic mismatch)")

        # This should be the same across all AG's
        self._inum_bits = sb.sb_agblklog + sb.sb_inopblog
        self._inum_mask = (1 << self._inum_bits) - 1
        self._inum_max = sb.sb_agblocks * sb.sb_inopblock

        self.get_inode = lru_cache(4096)(self.get_inode)

    def get_inode(
        self,
        inum: int,
        filename: str | None = None,
        filetype: int | None = None,
        parent: INode | None = None,
        lazy: bool = False,
    ) -> INode:
        inode = INode(self, inum, filename, filetype, parent=parent)

        if not lazy:
            inode._inode = inode._read_inode()

        return inode

    def walk_extents(self, fsb: int) -> Iterator[tuple[int, int, int, int]]:
        agnum, blknum = fsb_to_bb(fsb, self.sb.sb_agblklog)
        block = agnum * self.xfs.sb.sb_agblocks + blknum
        yield from self.xfs.walk_extents(block)

    def walk_agi(self) -> Iterator[c_xfs.xfs_inobt_rec]:
        yield from self.xfs.walk_agi(self.agi.agi_root, self.num)

    def walk_tree(self, fsb: int, magic: list[int] | None = None, small: bool = False) -> Iterator[bytes]:
        agnum, blknum = fsb_to_bb(fsb, self.sb.sb_agblklog)
        block = agnum * self.xfs.sb.sb_agblocks + blknum

        if small:
            yield from self.xfs.walk_small_tree(block, agnum, 16, magic)
        else:
            yield from self.xfs.walk_large_tree(block, 16, magic)


class INode:
    def __init__(
        self,
        ag: AllocationGroup,
        inum: int,
        filename: str | None = None,
        filetype: int | None = None,
        parent: INode | None = None,
    ) -> None:
        self.ag = ag
        self.xfs = ag.xfs
        self.inum = inum + (ag.num << ag._inum_bits)
        self.relative_inum = inum
        self.parent = parent
        self._inode = None
        self._buf = None

        self.filename = filename
        self._filetype = filetype
        self._link = None
        self._link_inode = None

        self._dirlist = None
        self._runlist = None

    def __repr__(self) -> str:
        return f"<inode {self.inum} ({self.ag.num}:{self.relative_inum})>"

    def _read_inode(self) -> c_xfs.xfs_dinode:
        self.ag.fh.seek(self.relative_inum * self.ag.sb.sb_inodesize)
        self._buf = io.BytesIO(self.ag.fh.read(self.ag.sb.sb_inodesize))
        inode = c_xfs.xfs_dinode(self._buf)

        if inode.di_magic != c_xfs.XFS_DINODE_MAGIC:
            raise Error(f"{self!r} has invalid inode magic")

        return inode

    @property
    def inode(self) -> c_xfs.xfs_dinode:
        if not self._inode:
            self._inode = self._read_inode()
        return self._inode

    def _has_bigtime(self) -> bool:
        return self.inode.di_version >= 3 and self.inode.di_flags2 & c_xfs.XFS_DIFLAG2_BIGTIME != 0

    def _has_large_extent_counts(self) -> bool:
        return self.inode.di_version >= 3 and self.inode.di_flags2 & c_xfs.XFS_DIFLAG2_NREXT64 != 0

    @property
    def size(self) -> int:
        return self.inode.di_size

    @property
    def nblocks(self) -> int:
        return self.inode.di_nblocks

    @property
    def data_extents(self) -> int:
        if self._has_large_extent_counts():
            return self.inode.di_big_nextents
        # Actually di_nextents, but we optimized the union away
        return self.inode.di_big_anextents

    @property
    def attr_extents(self) -> int:
        if self._has_large_extent_counts():
            return self.inode.di_big_anextents
        # Actually di_anextents, but we optimized the union away
        return self.inode.di_nrext64_pad

    @property
    def filetype(self) -> int:
        if not self._filetype:
            self._filetype = stat.S_IFMT(self.inode.di_mode)
        return self._filetype

    @property
    def link(self) -> str:
        if self.filetype != stat.S_IFLNK:
            raise NotASymlinkError(f"{self!r} is not a symlink")

        if not self._link:
            if self.inode.di_format != c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_LOCAL and self.xfs.version == 5:
                # Almost always, symlinks (max size of 1024) fit within a block. If the block size if 512, we might
                # need three blocks. These three blocks could theoretially be distributed over multiple extents.
                # Linux kernel handles this by using sl_offset to piece the symlink back together.
                # As this edge case of an edge case is very unlikely, it is unsupported until we observe it.
                # Ticket: https://github.com/fox-it/dissect.xfs/issues/36
                if len(self.dataruns()) > 1:
                    raise NotImplementedError(f"{self!r} has a symlink distributed over multiple extents")

                # We do not use open because for non-resident symlinks self.size does not include the symlink header
                symlink_size = len(c_xfs.xfs_dsymlink_hdr) + self.size
                fh = RunlistStream(self.xfs.fh, self.dataruns(), symlink_size, self.xfs.block_size)

                header = c_xfs.xfs_dsymlink_hdr(fh)
                if header.sl_magic != c_xfs.XFS_SYMLINK_MAGIC:
                    raise NotASymlinkError(f"{self!r} has invalid symlink magic")

                self._link = fh.read(header.sl_bytes).decode(errors="surrogateescape")
            else:
                self._link = self.open().read().decode(errors="surrogateescape")
        return self._link

    @property
    def link_inode(self) -> INode:
        if not self._link_inode:
            # Relative lookups work because . and .. are actual directory entries
            link = self.link
            if link.startswith("/"):
                relnode = None
            elif link.startswith("../"):
                relnode = self.parent
                if relnode is None:
                    raise SymlinkUnavailableException(f"{self!r} is a symlink to another filesystem")
            else:
                relnode = self.parent
            self._link_inode = self.xfs.get(self.link, relnode)
        return self._link_inode

    @property
    def atime(self) -> datetime:
        return ts.from_unix_ns(self.atime_ns)

    @property
    def atime_ns(self) -> int:
        return _parse_ts(self.inode.di_atime, self._has_bigtime())

    @property
    def mtime(self) -> datetime:
        return ts.from_unix_ns(self.mtime_ns)

    @property
    def mtime_ns(self) -> int:
        return _parse_ts(self.inode.di_mtime, self._has_bigtime())

    @property
    def ctime(self) -> datetime:
        return ts.from_unix_ns(self.ctime_ns)

    @property
    def ctime_ns(self) -> int:
        return _parse_ts(self.inode.di_ctime, self._has_bigtime())

    @property
    def crtime(self) -> datetime:
        return ts.from_unix_ns(self.crtime_ns)

    @property
    def crtime_ns(self) -> int:
        return _parse_ts(self.inode.di_crtime, self._has_bigtime())

    def listdir(self) -> dict[str, INode]:
        if not self._dirlist:
            self._dirlist = {node.filename: node for node in self.iterdir()}
        return self._dirlist

    dirlist = listdir

    def iterdir(self) -> Iterator[INode]:
        if self.filetype != stat.S_IFDIR:
            raise NotADirectoryError(f"{self!r} is not a directory")

        buf = self.open()
        if self.inode.di_format == c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_LOCAL:
            header = c_xfs.xfs_dir2_sf_hdr(buf)
            inum_s = c_xfs.uint64 if header.i8count else c_xfs.uint32

            if header.i8count:
                header.parent = (header.parent << 32) | c_xfs.uint32(buf)

            yield self.xfs.get_inode(self.inum, filename=".")
            yield self.xfs.get_inode(header.parent, filename="..")

            for _ in range(header.count):
                entry = c_xfs.xfs_dir2_sf_entry(buf)
                fname = entry.name.decode(errors="surrogateescape")
                ftype = c_xfs.uint8(buf) if self.xfs._has_ftype else 0
                inum = inum_s(buf)

                ftype = FILETYPES[ftype]

                yield self.xfs.get_inode(inum, fname, ftype, parent=self, lazy=True)
        elif self.inode.di_format in (
            c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_EXTENTS,
            c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_BTREE,
        ):
            for block_num in range(self.size // self.xfs.block_size):
                buf.seek(block_num * self.xfs.block_size)

                block_data = buf.read(self.xfs.block_size)
                block = io.BytesIO(block_data)

                block.seek(-len(c_xfs.xfs_dir2_block_tail), io.SEEK_END)
                tail = c_xfs.xfs_dir2_block_tail(block)
                block.seek(0)

                if self.data_extents > 1:
                    entries_end = self.xfs.block_size
                else:
                    entries_end = self.xfs.block_size
                    entries_end -= len(c_xfs.xfs_dir2_block_tail)
                    entries_end -= len(c_xfs.xfs_dir2_leaf_entry) * tail.count

                if self.xfs.version == 5:
                    header = c_xfs.xfs_dir3_data_hdr(block)
                    if header.magic not in (c_xfs.XFS_DIR3_BLOCK_MAGIC, c_xfs.XFS_DIR3_DATA_MAGIC):
                        # Probably a sparse block
                        continue
                else:
                    header = c_xfs.xfs_dir2_data_hdr(block)
                    if header.magic not in (c_xfs.XFS_DIR2_BLOCK_MAGIC, c_xfs.XFS_DIR2_DATA_MAGIC):
                        # Probably a sparse block
                        continue

                data_entry = c_xfs.xfs_dir2_data_entry_ftype if self.xfs._has_ftype else c_xfs.xfs_dir2_data_entry

                while True:
                    if block.tell() >= entries_end:
                        break

                    try:
                        if block_data[block.tell() : block.tell() + 2] == b"\xff\xff":
                            unused = c_xfs.xfs_dir2_data_unused(block)

                            block.read(unused.length - 6)

                            misalign = block.tell() % 8
                            if misalign:
                                block.seek(8 - misalign, io.SEEK_CUR)

                            continue

                        entry = data_entry(block)

                        # Entries are 8 byte aligned
                        # uint64 inum | uint8 namelen | variable name | uint8 ftype | uint16 tag
                        misalign = block.tell() % 8
                        if misalign:
                            block.seek(8 - misalign, io.SEEK_CUR)
                    except EOFError:
                        break

                    inum = entry.inumber
                    if inum >> 48 == 0xFFFF:  # XFS_DIR2_DATA_FREE_TAG
                        break

                    ftype = FILETYPES[entry.ftype] if self.xfs._has_ftype else None

                    fname = entry.name.decode(errors="surrogateescape")

                    yield self.xfs.get_inode(inum, fname, ftype, parent=self, lazy=True)
        else:
            raise Error(f"{self!r} has invalid inode format for dirlist")

    def datafork(self) -> BinaryIO:
        offset = 0xB0 if self.inode.di_version == 0x3 else 0x64
        if self.inode.di_format == c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_LOCAL:
            size = self.size
        elif self.inode.di_forkoff:
            size = self.inode.di_forkoff * 8
        else:
            size = self.ag.sb.sb_inodesize - offset

        return RangeStream(self._buf, offset, size)

    def attrfork(self) -> BinaryIO:
        if self.inode.di_forkoff == 0:
            raise Error(f"{self!r} has no extended attributes")

        offset = 0xB0 if self.inode.di_version == 0x3 else 0x64
        offset += self.inode.di_forkoff * 8
        size = self.ag.sb.sb_inodesize - offset

        return RangeStream(self._buf, offset, size)

    def dataruns(self) -> list[tuple[int | None, int]]:
        if not self._runlist:
            runs = []
            run_offset = 0
            expected_runs = (self.size + self.xfs.block_size - 1) // self.xfs.block_size

            for offset, block, count, _ in self._iter_blocks():
                if offset != run_offset:
                    gap = offset - run_offset
                    runs.append((None, gap))
                    run_offset += gap

                # Convert filesystem blocks to logical blocks
                agnum, blknum = fsb_to_bb(block, self.ag.sb.sb_agblklog)
                block = agnum * self.xfs.sb.sb_agblocks + blknum

                runs.append((block, count))
                run_offset += count

            if run_offset < expected_runs:
                runs.append((None, expected_runs - run_offset))

            self._runlist = runs
        return self._runlist

    def _iter_blocks(self) -> Iterator[tuple[int, int, int, int]]:
        if self.inode.di_format == c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_EXTENTS:
            buf = self.datafork().read(self.data_extents * 16)
            for extent_num in range(self.data_extents):
                yield parse_fsblock(buf[extent_num * 16 : (extent_num + 1) * 16])
        elif self.inode.di_format == c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_BTREE:
            # B+tree extent lists are always large trees (64bit block numbers)
            df = self.datafork()
            root = c_xfs.xfs_bmdr_block(df)

            # Pointers start around halfway
            maxrecs = (df.size - 4) // 16
            df.seek(4 + maxrecs * 8)
            ptrs = c_xfs.uint64[root.bb_numrecs](df)

            for ptr in ptrs:
                yield from self.ag.walk_extents(ptr)

    def open(self) -> BinaryIO:
        if self.inode.di_format == c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_LOCAL:
            return self.datafork()
        if self.inode.di_format in (
            c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_EXTENTS,
            c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_BTREE,
        ):
            return RunlistStream(self.xfs.fh, self.dataruns(), self.size, self.xfs.block_size)
        if self.inode.di_format == c_xfs.xfs_dinode_fmt.XFS_DINODE_FMT_DEV:
            raise UnsupportedDataforkException(f"{self!r} is a character/block device.")
        dinode_type = c_xfs.xfs_dinode_fmt(self.inode.di_format)
        raise UnsupportedDataforkException(f"{self!r} is an unsupported datafork: {dinode_type}")


def parse_fsblock(s: bytes) -> tuple[int, int, int, int]:
    # MSB -> LSB
    # flag = 1 bit
    # offset = 54 bits
    # block = 52 bits
    # count = 21 bits
    l0, l1 = c_xfs.uint64[2](s)

    flag = l0 >> 63
    offset = (l0 & ((1 << 63) - 1)) >> 9
    block = (l0 & ((1 << 9) - 1)) << 43 | (l1 >> 21)
    count = l1 & ((1 << 21) - 1)

    return offset, block, count, flag


def fsb_to_bb(block: int, agblklog: int) -> tuple[int, int]:
    agnum = block >> agblklog
    blknum = block & ((1 << agblklog) - 1)
    return agnum, blknum


def _parse_ts(ts: int, is_bigtime: bool) -> int:
    if is_bigtime:
        sec, nsec = divmod(ts, 1000000000)
        sec -= 1 << 31
    else:
        sec, nsec = ts >> 32, ts & 0xFFFFFFFF
    return (sec * 1000000000) + nsec
