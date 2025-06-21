from __future__ import annotations

import io
import zlib
from bisect import bisect_right
from typing import TYPE_CHECKING, BinaryIO, NamedTuple
from uuid import UUID

from dissect.util.compression import lzo
from dissect.util.stream import AlignedStream

try:
    import zstandard

    HAS_ZSTD = True
except ImportError:
    HAS_ZSTD = False

from dissect.btrfs.c_btrfs import (
    BTRFS_BLOCK_GROUP,
    BTRFS_BLOCK_GROUP_PROFILE_MASK,
    BTRFS_BLOCK_GROUP_RAID1_MASK,
    BTRFS_BLOCK_GROUP_RAID56_MASK,
    BTRFS_BLOCK_GROUP_STRIPE_MASK,
    BTRFS_RAID_ATTRIBUTES,
    c_btrfs,
)
from dissect.btrfs.exceptions import Error

if TYPE_CHECKING:
    from dissect.btrfs.btrfs import Btrfs


class Stripe(NamedTuple):
    fh: BinaryIO
    offset: int
    devid: int
    dev_uuid: UUID


class Chunk(NamedTuple):
    offset: int
    length: int
    stripe_length: int
    type: c_btrfs.BTRFS_BLOCK_GROUP
    num_stripes: int
    sub_stripes: int
    data_stripes: int
    stripes: list[Stripe]


class ChunkStream(AlignedStream):
    """Implements a stream over Btrfs chunks, including basic RAID support.

    Args:
        btrfs: The filesystem this stream belongs to.
    """

    def __init__(self, btrfs: Btrfs):
        self.btrfs = btrfs
        self.chunks: list[Chunk] = []
        self._chunk_offsets: list[int] = []
        super().__init__(align=0x10000)

    def add(self, offset: int, chunk: c_btrfs.btrfs_chunk) -> None:
        """Add a chunk to the stream.

        This will iterate all stripes and link them to the appropriate devices.
        Allows for missing devices, if the RAID profile allows this.

        Args:
            offset: The logical offset to add this chunk for.
            chunk: The chunk item to add.
        """

        chunk_idx = bisect_right(self._chunk_offsets, offset)
        if chunk_idx > 0:
            # Check if we already have a chunk for this offset
            existing_chunk = self.chunks[chunk_idx - 1]
            if existing_chunk.offset <= offset and existing_chunk.offset + existing_chunk.length > offset:
                return

        ncopies, nparity, tolerated_failures = BTRFS_RAID_ATTRIBUTES[chunk.type & BTRFS_BLOCK_GROUP_PROFILE_MASK]
        data_stripes = (chunk.num_stripes - nparity) // ncopies

        stripes = []
        missing_devices = 0
        for stripe in chunk.stripe:
            fh = self.btrfs.devices.get(stripe.devid)
            dev_uuid = UUID(bytes=stripe.dev_uuid)

            if fh is None:
                if missing_devices < tolerated_failures:
                    missing_devices += 1
                else:
                    raise Error(f"Missing stripe disk for chunk offset {offset:#x}: {stripe.devid} ({dev_uuid})")

            stripe = Stripe(fh, stripe.offset, stripe.devid, dev_uuid)
            stripes.append(stripe)

        chunk = Chunk(
            offset,
            chunk.length,
            chunk.stripe_len,
            chunk.type,
            chunk.num_stripes,
            chunk.sub_stripes,
            data_stripes,
            stripes,
        )

        idx = bisect_right(self._chunk_offsets, offset)
        self._chunk_offsets.insert(idx, offset)
        self.chunks.insert(idx, chunk)

    def _read(self, offset: int, length: int) -> bytes:
        r = []

        chunk_idx = bisect_right(self._chunk_offsets, offset)
        chunks_len = len(self.chunks)

        while length > 0:
            if chunk_idx > chunks_len:
                # We somehow requested more data than we have chunks for
                break

            if chunk_idx == 0:
                # Read below the lowest chunk, just fill with zero bytes until the next chunk
                read_count = min(self._chunk_offsets[0] - offset, length)
                r.append(b"\x00" * read_count)

                offset += read_count
                length -= read_count
            else:
                chunk = self.chunks[chunk_idx - 1]

                chunk_offset = offset - chunk.offset
                chunk_remaining = chunk.length - chunk_offset

                while length > 0 and chunk_remaining > 0:
                    stripe_num, stripe_idx, stripe_offset, stripe_remaining = _get_stripe_read_info(chunk, chunk_offset)
                    stripe_read = min(stripe_remaining, length)

                    stripe = chunk.stripes[stripe_idx % chunk.num_stripes]
                    while stripe.fh is None:
                        # We already checked for the maximum amount of tolerated failures when adding the chunk,
                        # so looping here should be safe
                        if chunk.type & BTRFS_BLOCK_GROUP.DUP:
                            stripe_idx = 1
                        elif chunk.type & BTRFS_BLOCK_GROUP_RAID56_MASK:
                            raise NotImplementedError("RAID56 recovery is not yet supported")
                        else:
                            stripe_idx += 1

                        stripe = chunk.stripes[stripe_idx % chunk.num_stripes]

                    stripe.fh.seek(stripe.offset + stripe_offset + stripe_num * chunk.stripe_length)
                    r.append(stripe.fh.read(stripe_read))

                    offset += stripe_read
                    length -= stripe_read
                    chunk_offset += stripe_read
                    chunk_remaining -= stripe_read

            chunk_idx += 1

        return b"".join(r)


def _get_stripe_read_info(chunk: Chunk, offset: int) -> tuple[int, int, int, int]:
    # Reference: __btrfs_map_block
    stripe_num, stripe_offset = divmod(offset, chunk.stripe_length)
    stripe_idx = 0

    if chunk.type & BTRFS_BLOCK_GROUP.RAID0:
        stripe_num, stripe_idx = divmod(stripe_num, chunk.num_stripes)
    elif chunk.type & BTRFS_BLOCK_GROUP_RAID1_MASK:
        # We don't care from which mirror we read
        stripe_idx = 0
    elif chunk.type & BTRFS_BLOCK_GROUP.DUP:
        # We don't care from which duplicate we read
        stripe_idx = 0
    elif chunk.type & BTRFS_BLOCK_GROUP.RAID10:
        factor = chunk.num_stripes // chunk.sub_stripes
        stripe_num, stripe_idx = divmod(stripe_num, factor)
    elif chunk.type & BTRFS_BLOCK_GROUP_RAID56_MASK:
        stripe_num, stripe_idx = divmod(stripe_num, chunk.data_stripes)
        stripe_idx = (stripe_num + stripe_idx) % chunk.num_stripes
    else:
        stripe_num, stripe_idx = divmod(stripe_num, chunk.num_stripes)

    if chunk.type & BTRFS_BLOCK_GROUP_STRIPE_MASK:
        stripe_remaining = chunk.stripe_length - stripe_offset
    else:
        stripe_remaining = chunk.length - offset

    return stripe_num, stripe_idx, stripe_offset, stripe_remaining


class Extent(NamedTuple):
    compression: int
    encryption: int
    disk_offset: int
    disk_length: int
    offset: int
    length: int


class ExtentStream(AlignedStream):
    """Implement a stream over Btrfs file extents.

    Supports compression.

    Args:
        fh: The file-like object to read the data from, usually the :class:`ChunkStream` of the filesystem.
        extents: The list of extents to open the stream on.
        sector_size: The sector size of the filesystem, necessary for LZO decompression.
    """

    def __init__(self, fh: BinaryIO, extents: list[Extent], size: int, sector_size: int):
        self._fh = fh

        self.extents = extents
        self._extent_offsets = []

        offset = 0
        for extent in self.extents:
            if offset != 0:
                self._extent_offsets.append(offset)
            offset += extent.length

        self.sector_size = sector_size

        super().__init__(size, sector_size)

    def _read(self, offset: int, length: int) -> bytes:
        result = []

        extent_idx = bisect_right(self._extent_offsets, offset)
        extents_len = len(self.extents)
        size = self.size

        while length > 0:
            if extent_idx >= extents_len:
                # We somehow requested more data than we have runs for
                break

            # If run_idx == 0, we only have a single run
            extent_pos = 0 if extent_idx == 0 else self._extent_offsets[extent_idx - 1]
            extent = self.extents[extent_idx]
            extent_pos = offset - extent_pos
            extent_remaining = extent.length - extent_pos

            # The relative extent offset is only relevant for knowing where to actually start reading on the disk
            # Add it to the current extent_pos because that's where this variable is only going to be used for
            extent_pos += extent.offset

            # Sometimes the self.size is way larger than what we actually have runs for?
            # Stop reading if we reach a negative run_remaining
            if extent_remaining < 0:
                break

            read_count = min(size - offset, min(extent_remaining, length))

            # Sparse run
            if (extent.disk_offset, extent.disk_length) == (0, 0):
                result.append(b"\x00" * read_count)
            else:
                if (extent.compression, extent.encryption) == (c_btrfs.BTRFS_COMPRESS_NONE, 0):
                    # Quick path for no compression and no encryption
                    self._fh.seek(extent.disk_offset + extent_pos)
                    buf = self._fh.read(read_count)
                else:
                    self._fh.seek(extent.disk_offset)
                    buf = decode_extent(
                        self._fh.read(extent.disk_length),
                        extent.compression,
                        extent.encryption,
                        self.sector_size,
                    )

                    if extent_pos or read_count != len(buf):
                        buf = buf[extent_pos : extent_pos + read_count]
                result.append(buf)

            offset += read_count
            length -= read_count
            extent_idx += 1

        return b"".join(result)


def decode_extent(buf: bytes, compression: int, encryption: int, sector_size: int) -> bytes:
    """Decode a compressed extent.

    Args:
        buf: The extent data to decode.
        compression: The compression type to decompress from.
        encryption: The encryption type - currently unused.
        sector_size: The sector size of the filesystem, necessary for LZO decompression.
    """
    if compression == c_btrfs.BTRFS_COMPRESS_ZLIB:
        buf = zlib.decompress(buf)
    elif compression == c_btrfs.BTRFS_COMPRESS_LZO:
        # Reference: lzo.c
        lzo_buf = io.BytesIO(buf)
        lzo_buf.read(4)  # total size of compressed data
        lzo_out_size = _lzo_worst_compress(sector_size)

        decompressed_buf = bytearray()
        while True:
            lzo_segment_size = int.from_bytes(lzo_buf.read(4), "little")
            if lzo_segment_size == 0:
                break

            lzo_payload = lzo_buf.read(lzo_segment_size)
            decompressed_buf.extend(lzo.decompress(lzo_payload, False, lzo_out_size))

            sector_remaining = sector_size - (lzo_buf.tell() % sector_size)
            if sector_remaining >= 4:
                continue
            lzo_buf.seek(sector_remaining, io.SEEK_CUR)

        buf = bytes(decompressed_buf)
    elif compression == c_btrfs.BTRFS_COMPRESS_ZSTD:
        if not HAS_ZSTD:
            raise RuntimeError("Install `zstandard` to read zstandard compressed files")
        buf = zstandard.decompress(buf)

    if encryption:
        # btrfs doesn't actually support extent encryption yet
        raise NotImplementedError("BTRFS extent encryption is not supported")

    return buf


def _lzo_worst_compress(size: int) -> int:
    return size + (size // 16) + 64 + 3
