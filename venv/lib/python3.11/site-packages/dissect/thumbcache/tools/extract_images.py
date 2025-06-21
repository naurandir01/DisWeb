#!/bin/python3
from __future__ import annotations

from typing import TYPE_CHECKING

from dissect.thumbcache.exceptions import Error
from dissect.thumbcache.thumbcache_file import ThumbcacheFile
from dissect.thumbcache.tools.utils import create_argument_parser, write_entry

if TYPE_CHECKING:
    from pathlib import Path


def dump_entry_data(path: Path, output_dir: Path) -> None:
    with path.open("rb") as file:
        try:
            cache_file = ThumbcacheFile(file)

            for entry in cache_file.entries():
                write_entry(output_dir, entry, path.name.split("_", 1)[1])
        except Error as e:
            print(e)


def main() -> None:
    parser = create_argument_parser("extract raw thumbcache entries")
    args = parser.parse_args()
    path: Path = args.cache_path

    if path.name.endswith("idx.db"):
        parser.exit("Please provide a file other than the idx file.")

    if path.is_dir():
        for file in path.iterdir():
            if file.name.endswith("idx.db"):
                continue
            dump_entry_data(file, args.output_dir)
    else:
        dump_entry_data(path, args.output_dir)


if __name__ == "__main__":
    main()
