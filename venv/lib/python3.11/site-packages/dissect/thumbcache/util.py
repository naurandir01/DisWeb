from __future__ import annotations

import enum
from contextlib import contextmanager
from typing import TYPE_CHECKING, BinaryIO

if TYPE_CHECKING:
    from collections.abc import Iterator


class ThumbnailType(enum.IntEnum):
    WINDOWS_VISTA = 0x14
    WINDOWS_7 = 0x15
    WINDOWS_81 = 0x1F
    WINDOWS_10 = 0x20


@contextmanager
def seek_and_return(fh: BinaryIO, position: int) -> Iterator[BinaryIO]:
    current_position = fh.tell()
    try:
        fh.seek(position)
        yield fh
    finally:
        fh.seek(current_position)
