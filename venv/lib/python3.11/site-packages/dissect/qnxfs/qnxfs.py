from __future__ import annotations

from typing import BinaryIO

from dissect.qnxfs.exceptions import Error, InvalidFilesystemError
from dissect.qnxfs.qnx4 import QNX4, _is_qnx4
from dissect.qnxfs.qnx6 import QNX6, _find_sb


def QNXFS(fh: BinaryIO) -> QNX4 | QNX6:
    try:
        return QNX4(fh)
    except InvalidFilesystemError:
        pass

    try:
        return QNX6(fh)
    except InvalidFilesystemError:
        pass

    raise Error("Unable to open QNX filesystem")


def is_qnxfs(fh: BinaryIO) -> bool:
    if _is_qnx4(fh):
        return True

    try:
        _find_sb(fh)
    except InvalidFilesystemError:
        pass
    else:
        return True

    return False
