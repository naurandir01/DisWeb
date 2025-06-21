from __future__ import annotations

from argparse import ArgumentParser
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from dissect.thumbcache.thumbcache import ThumbcacheEntry


def create_argument_parser(name: str) -> ArgumentParser:
    parser = ArgumentParser(name)
    parser.add_argument("cache_path", type=Path)
    parser.add_argument("--output-dir", "-o", type=Path, default=Path())

    return parser


def write_entry(output_path: Path, entry: ThumbcacheEntry, file_prefix: str) -> None:
    output_file = (output_path / f"{entry.hash}/{entry.identifier}_{file_prefix}").with_suffix(".bmp")
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with output_file.open("wb") as output:
        output.write(entry.data)
