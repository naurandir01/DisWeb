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

from dissect.extfs.c_ext import (
    EXT2,
    EXT3,
    EXT4,
    FILETYPES,
    XATTR_NAME_MAP,
    XATTR_PREFIX_MAP,
    c_ext,
)
from dissect.extfs.exceptions import (
    Error,
    FileNotFoundError,
    NotADirectoryError,
    NotASymlinkError,
)
from dissect.extfs.journal import JDB2

if TYPE_CHECKING:
    from collections.abc import Iterator
    from datetime import datetime

log = logging.getLogger(__name__)
log.setLevel(os.getenv("DISSECT_LOG_EXTFS", "CRITICAL"))


class ExtFS:
    def __init__(self, fh: BinaryIO):
        self.fh = fh
        # self._path_cache = {}
        self._journal = None

        fh.seek(c_ext.EXT2_SBOFF)
        sb = c_ext.ext4_super_block(fh)
        self.sb = sb

        if sb.s_magic != c_ext.EXT2_FS_MAGIC:
            raise Error("Not a valid ExtFS filesystem (magic mismatch)")

        if sb.s_inodes_count < 10:
            raise Error("Not a valid ExtFS filesystem (inum count < 10)")

        if sb.s_blocks_per_group == 0 or sb.s_inodes_per_group == 0:
            raise Error("Not a valid ExtFS filesystem (blocks or inodes per group is 0)")

        if sb.s_log_block_size != sb.s_log_cluster_size:
            raise NotImplementedError("Different size cluster than blocks is currently not supported")

        self.block_size = c_ext.EXT2_MIN_BLOCK_SIZE << sb.s_log_block_size
        if self.block_size == 0 or self.block_size % 512:
            raise Error("Not a valid ExtFS filesystem (invalid block size)")

        if sb.s_feature_incompat & c_ext.EXT4_FEATURE_INCOMPAT_EXTENTS:
            self.type = EXT4
        elif sb.s_feature_compat & c_ext.EXT3_FEATURE_COMPAT_HAS_JOURNAL:
            self.type = EXT3
        else:
            self.type = EXT2

        if sb.s_feature_incompat & c_ext.EXT2_FEATURE_INCOMPAT_FILETYPE:
            self._dirtype = c_ext.ext2_dir_entry_2
        else:
            self._dirtype = c_ext.ext2_dir_entry

        self.block_count = (sb.s_blocks_count_hi << 32) | sb.s_blocks_count_lo
        self.last_block = self.block_count - 1

        if (
            self.type == EXT4
            and self.sb.s_feature_incompat & c_ext.EXT4_FEATURE_INCOMPAT_64BIT
            and self.sb.s_desc_size >= 64
        ):
            self._group_desc_struct = c_ext.ext4_group_desc
        else:
            self._group_desc_struct = c_ext.ext2_group_desc
        self._group_desc_size = sb.s_desc_size if sb.s_desc_size else len(self._group_desc_struct)

        goff = c_ext.EXT2_SBOFF + self._group_desc_size
        self.groups_offset = goff if goff % self.block_size == 0 else goff + self.block_size - goff % self.block_size
        self.groups_count = ((self.last_block - sb.s_first_data_block) // sb.s_blocks_per_group) + 1

        self.uuid = UUID(bytes=sb.s_uuid)
        self.volume_name = sb.s_volume_name.split(b"\x00")[0].decode(errors="surrogateescape")
        self.last_mount = sb.s_last_mounted.split(b"\x00")[0].decode(errors="surrogateescape")

        self.root = self.get_inode(c_ext.EXT2_ROOT_INO, "/")

        self.get_inode = lru_cache(1024)(self.get_inode)
        self._read_group_desc = lru_cache(356)(self._read_group_desc)

    @property
    def journal(self) -> JDB2:
        if not self._journal:
            if not self.sb.s_feature_compat & c_ext.EXT3_FEATURE_COMPAT_HAS_JOURNAL:
                raise Error("Journal not supported")

            inum = self.sb.s_journal_inum
            if inum == 0:
                raise Error(
                    f"Journal inum is 0, could be on external device (s_journal_uuid = {self.sb.s_journal_uuid})"
                )

            inode = self.get_inode(inum)
            self._journal = JDB2(inode.open())

        return self._journal

    def get(self, path: str | int, node: INode | None = None) -> INode:
        if isinstance(path, int):
            return self.get_inode(path)

        node = node if node else self.root
        parts = path.split("/")
        for part_num, part in enumerate(parts):
            if not part:
                continue

            while node.filetype == stat.S_IFLNK and part_num < len(parts):
                node = node.link_inode

            for entry in node.iterdir():
                if entry.filename == part:
                    node = entry
                    break
            else:
                raise FileNotFoundError(f"File not found: {path}")

        return node

    def get_inode(
        self,
        inum: int,
        filename: str | None = None,
        filetype: int | None = None,
        parent: INode | None = None,
        lazy: bool = False,
    ) -> INode:
        if inum < c_ext.EXT2_BAD_INO or inum > self.sb.s_inodes_count:
            raise Error(f"inum out of range {c_ext.EXT2_BAD_INO}-{self.sb.s_inodes_count}: {inum}")

        inode = INode(self, inum, filename, filetype, parent=parent)
        if not lazy:
            inode._inode = inode._read_inode()

        return inode

    def _read_group_desc(self, group_num: int) -> c_ext.ext2_group_desc | c_ext.ext4_group_desc:
        if group_num >= self.groups_count:
            raise Error("Group number exceeds amount of groups")

        offset = self.groups_offset + group_num * self._group_desc_size
        self.fh.seek(offset)
        group_desc = self._group_desc_struct(self.fh)

        if self._group_desc_struct == c_ext.ext4_group_desc:
            block_bitmap = (group_desc.bg_block_bitmap_hi << 32) | group_desc.bg_block_bitmap_lo
            inode_bitmap = (group_desc.bg_inode_bitmap_hi << 32) | group_desc.bg_inode_bitmap_lo
            table_block = (group_desc.bg_inode_table_hi << 32) | group_desc.bg_inode_table_lo
        else:
            block_bitmap = group_desc.bg_block_bitmap_lo
            inode_bitmap = group_desc.bg_inode_bitmap_lo
            table_block = group_desc.bg_inode_table_lo

        if block_bitmap > self.last_block or inode_bitmap > self.last_block or table_block > self.last_block:
            raise Error("Group descriptor block locations exceed last block")

        return group_desc


class INode:
    def __init__(
        self,
        extfs: ExtFS,
        inum: int,
        filename: str | None = None,
        filetype: int | None = None,
        parent: INode | None = None,
    ):
        self.extfs = extfs
        self.inum = inum
        self.parent = parent
        self._inode = None

        self.filename = filename
        self._filetype = filetype
        self._size = None
        self._link = None
        self._link_inode = None
        self._xattr = None

        self._dirlist = None
        self._runlist = None

    def __repr__(self) -> str:
        return f"<inode {self.inum}>"

    def _read_inode(self) -> c_ext.ext4_inode:
        block_group_num, index = divmod(self.inum - 1, self.extfs.sb.s_inodes_per_group)
        block_group = self.extfs._read_group_desc(block_group_num)

        if self.extfs._group_desc_struct == c_ext.ext4_group_desc:
            table_block = (block_group.bg_inode_table_hi << 32) | block_group.bg_inode_table_lo
        else:
            table_block = block_group.bg_inode_table_lo

        offset = table_block * self.extfs.block_size + index * self.extfs.sb.s_inode_size
        self.extfs.fh.seek(offset)
        return c_ext.ext4_inode(self.extfs.fh)

    @property
    def inode(self) -> c_ext.ext4_inode:
        if not self._inode:
            self._inode = self._read_inode()
        return self._inode

    @property
    def size(self) -> int:
        if not self._size:
            self._size = (self.inode.i_size_high << 32) + self.inode.i_size_lo
        return self._size

    @property
    def filetype(self) -> int:
        if not self._filetype:
            self._filetype = stat.S_IFMT(self.inode.i_mode)
        return self._filetype

    @property
    def link(self) -> str:
        if self.filetype != stat.S_IFLNK:
            raise NotASymlinkError(f"{self!r} is not a symlink")

        if not self._link:
            self._link = self.open().read().decode(errors="surrogateescape")
        return self._link

    @property
    def link_inode(self) -> INode:
        if not self._link_inode:
            # Relative lookups work because . and .. are actual directory entries
            link = self.link
            relnode = None if link.startswith("/") else self.parent
            self._link_inode = self.extfs.get(self.link, relnode)
        return self._link_inode

    @property
    def xattr(self) -> list[XAttr]:
        if not self._xattr:
            xattr = []

            if self.inode.i_extra.strip(b"\x00"):
                buf = io.BytesIO(self.inode.i_extra)
                hdr = c_ext.ext4_xattr_ibody_header(buf)
                if hdr.h_magic != c_ext.EXT4_XATTR_MAGIC:
                    raise Error("Invalid xattr magic value")

                xattr.extend(_iter_xattr(self, buf, len(self.inode.i_extra), 4))

            if self.inode.i_file_acl_lo:
                block = (self.inode.i_file_acl_high << 32) | self.inode.i_file_acl_lo
                block_offset = block * self.extfs.block_size

                buf = RangeStream(self.extfs.fh, block_offset, self.extfs.block_size)
                hdr = c_ext.ext4_xattr_header(buf)
                if hdr.h_magic != c_ext.EXT4_XATTR_MAGIC:
                    raise Error("Invalid xattr magic value")

                xattr.extend(_iter_xattr(self, buf, buf.size))

            self._xattr = xattr
        return self._xattr

    @property
    def atime(self) -> datetime:
        return ts.from_unix_ns(self.atime_ns)

    @property
    def atime_ns(self) -> int:
        time = self.inode.i_atime
        time_extra = self.inode.i_atime_extra if self.extfs.sb.s_inode_size > 128 else 0

        return _parse_ns_ts(time, time_extra)

    @property
    def mtime(self) -> datetime:
        return ts.from_unix_ns(self.mtime_ns)

    @property
    def mtime_ns(self) -> int:
        time = self.inode.i_mtime
        time_extra = self.inode.i_mtime_extra if self.extfs.sb.s_inode_size > 128 else 0

        return _parse_ns_ts(time, time_extra)

    @property
    def ctime(self) -> datetime:
        return ts.from_unix_ns(self.ctime_ns)

    @property
    def ctime_ns(self) -> int:
        time = self.inode.i_ctime
        time_extra = self.inode.i_ctime_extra if self.extfs.sb.s_inode_size > 128 else 0

        return _parse_ns_ts(time, time_extra)

    @property
    def dtime(self) -> datetime:
        return ts.from_unix(self.inode.i_dtime)

    @property
    def crtime(self) -> datetime | None:
        time_ns = self.crtime_ns
        if time_ns is None:
            return None
        return ts.from_unix_ns(time_ns)

    @property
    def crtime_ns(self) -> int | None:
        if self.extfs.sb.s_inode_size <= 128:
            return None

        time = self.inode.i_crtime
        time_extra = self.inode.i_crtime_extra

        return _parse_ns_ts(time, time_extra)

    def listdir(self) -> dict[str, INode]:
        if not self._dirlist:
            self._dirlist = {node.filename: node for node in self.iterdir()}
        return self._dirlist

    dirlist = listdir

    def iterdir(self) -> Iterator[INode]:
        if self.filetype != stat.S_IFDIR:
            raise NotADirectoryError(f"{self!r} is not a directory")

        buf = self.open()
        offset = 0

        while offset < self.size - 12:
            direntry = self.extfs._dirtype(buf)

            if direntry.rec_len == 0:
                log.critical("Zero-length directory entry in %s (offset 0x%x)", self, offset)
                return

            # Sanity check if the direntry is valid
            if 0 < direntry.inode < self.extfs.sb.s_inodes_count:
                fname = buf.read(direntry.name_len).decode(errors="surrogateescape")
                ftype = direntry.file_type if self.extfs._dirtype == c_ext.ext2_dir_entry_2 else None

                if ftype:
                    ftype = FILETYPES[ftype]

                yield self.extfs.get_inode(direntry.inode, fname, ftype, parent=self, lazy=True)

            offset += direntry.rec_len
            buf.seek(offset)

    def dataruns(self) -> list[tuple[int | None, int]]:
        if not self._runlist:
            expected_runs = (self.size + self.extfs.block_size - 1) // self.extfs.block_size

            if self.inode.i_flags & c_ext.EXT4_EXTENTS_FL:
                buf = io.BytesIO(self.inode.i_block)

                runs = []
                run_offset = 0

                for extent in _parse_extents(self, buf):
                    # Account for uninitialized extents
                    if extent.ee_len > 0x8000:
                        uninitialized_gap = extent.ee_len - 0x8000
                        runs.append((None, uninitialized_gap))
                        run_offset += uninitialized_gap
                        continue

                    # Account for sparse gaps
                    if extent.ee_block != run_offset:
                        sparse_gap = extent.ee_block - run_offset
                        runs.append((None, sparse_gap))
                        run_offset += sparse_gap

                    runs.append(((extent.ee_start_hi << 32) | extent.ee_start_lo, extent.ee_len))
                    run_offset += extent.ee_len

                if run_offset < expected_runs:
                    runs.append((None, expected_runs - run_offset))

                self._runlist = runs
            else:
                i_blocks = c_ext.uint32[15](self.inode.i_block)
                num_blocks = (self.size + self.extfs.block_size - 1) // self.extfs.block_size
                num_direct_blocks = min(num_blocks, c_ext.EXT2_NDIR_BLOCKS)

                blocks = i_blocks[:num_direct_blocks]
                num_blocks -= num_direct_blocks

                if num_blocks > 0:
                    for level in range(c_ext.EXT2_NIND_BLOCKS):
                        indirect_offset = i_blocks[num_direct_blocks + level]
                        parsed_blocks = _parse_indirect(self, indirect_offset, num_blocks, level + 1)
                        num_blocks -= len(parsed_blocks)
                        blocks.extend(parsed_blocks)

                        if num_blocks == 0:
                            break

                runs = []
                if blocks:
                    run_offset = None
                    run_size = 1

                    for block in blocks:
                        if run_offset is None:
                            run_offset = block
                            continue

                        if block == run_offset + run_size:
                            run_size += 1
                        else:
                            if run_offset == 0:
                                runs.append((None, run_size))
                            else:
                                runs.append((run_offset, run_size))
                            run_offset = block
                            run_size = 1

                    runs.append((run_offset, run_size))

                self._runlist = runs

        return self._runlist

    def open(self) -> BinaryIO:
        if self.inode.i_flags & c_ext.EXT4_INLINE_DATA_FL or (self.filetype == stat.S_IFLNK and self.size < 60):
            buf = io.BytesIO(memoryview(self.inode.i_block)[: self.size])
            # Need to add a size attribute to maintain compatibility with dissect streams
            buf.size = self.size
            return buf
        return RunlistStream(self.extfs.fh, self.dataruns(), self.size, self.extfs.block_size)


class XAttr:
    def __init__(self, extfs: ExtFS, inode: INode, entry: c_ext.ext4_xattr_entry, value: bytes):
        self.extfs = extfs
        self.inode = inode
        self.entry = entry

        self.prefix = XATTR_PREFIX_MAP.get(entry.e_name_index, "unknown_prefix")
        self._name = XATTR_NAME_MAP.get(entry.e_name_index, entry.e_name.decode(errors="surrogateescape"))
        self.name = self.prefix + self._name
        self.value = value

    def __repr__(self) -> str:
        return f"<xattr name={self.name} value={self.value} inode={self.inode}>"


def _parse_indirect(inode: INode, offset: int, num_blocks: int, level: int) -> list[int]:
    offsets_per_block = inode.extfs.block_size // 4

    if level == 1:
        read_blocks = min(num_blocks, offsets_per_block)
        if offset == 0:
            return [0] * read_blocks
        inode.extfs.fh.seek(offset * inode.extfs.block_size)
        return c_ext.uint32[read_blocks](inode.extfs.fh)

    blocks = []

    max_level_blocks = offsets_per_block**level
    blocks_per_nest = max_level_blocks // offsets_per_block
    read_blocks = (num_blocks + blocks_per_nest - 1) // blocks_per_nest
    read_blocks = min(read_blocks, offsets_per_block)

    inode.extfs.fh.seek(offset * inode.extfs.block_size)
    for addr in c_ext.uint32[read_blocks](inode.extfs.fh):
        parsed_blocks = _parse_indirect(inode, addr, num_blocks, level - 1)
        num_blocks -= len(parsed_blocks)
        blocks.extend(parsed_blocks)

    return blocks


def _parse_extents(inode: INode, buf: bytes) -> Iterator[c_ext.ext4_extent]:
    extent_header = c_ext.ext4_extent_header(buf)

    if extent_header.eh_magic != 0xF30A:
        raise Error("Invalid extent_header magic")

    if extent_header.eh_depth == 0:
        for _ in range(extent_header.eh_entries):
            extent = c_ext.ext4_extent(buf)
            yield extent
    else:
        for _ in range(extent_header.eh_entries):
            idx = c_ext.ext4_extent_idx(buf)
            child = (idx.ei_leaf_hi << 32) | idx.ei_leaf_lo

            fh = inode.extfs.fh
            fh.seek(child * inode.extfs.block_size)
            blockbuf = io.BytesIO(fh.read(inode.extfs.block_size))
            yield from _parse_extents(inode, blockbuf)


def _iter_xattr(inode: INode, buf: BinaryIO, end: int, value_offset: int = 0) -> Iterator[XAttr]:
    offset = buf.tell()
    while True:
        try:
            if offset > end:
                break

            buf.seek(offset)
            entry = c_ext.ext4_xattr_entry(buf)

            if (entry.e_name_len, entry.e_name_index, entry.e_value_offs) == (0, 0, 0):
                break

            if entry.e_value_inum:
                value = inode.extfs.get_inode(entry.e_value_inum).open().read(entry.e_value_size)
            else:
                buf.seek(value_offset + entry.e_value_offs)
                value = buf.read(entry.e_value_size)

            yield XAttr(inode.extfs, inode, entry, value)

            offset += (len(entry) + c_ext.EXT4_XATTR_ROUND) & (~c_ext.EXT4_XATTR_ROUND & 0xFFFFFFFF)
        except EOFError:
            break


def _parse_ns_ts(time: int, time_extra: int) -> int:
    # The low 2 bits of time_extra are used to extend the time field
    # The remaining 30 bits are nanoseconds
    time |= (time_extra & 0b11) << 32
    ns = time_extra >> 2

    return (time * 1000000000) + ns
