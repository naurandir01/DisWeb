from __future__ import annotations

from typing import TYPE_CHECKING

from dissect.thumbcache.exceptions import Error
from dissect.thumbcache.thumbcache import Thumbcache
from dissect.thumbcache.tools.utils import create_argument_parser, write_entry

if TYPE_CHECKING:
    from pathlib import Path


def dump_entry_data_through_index(path: Path, output_dir: Path, prefix: str) -> None:
    cache = Thumbcache(path=path, prefix=prefix)
    try:
        for location_path, entry in cache.entries():
            file_name = location_path.stem.split("_", 1)[1]
            write_entry(output_dir, entry, file_name)
    except Error as e:
        print(e)


def main() -> None:
    parser = create_argument_parser("extract indexed entries")
    parser.add_argument(
        "--prefix",
        "-p",
        type=str,
        default="thumbcache",
        help="The file prefix to search for inside the thumbcache directory.",
    )

    args = parser.parse_args()

    path: Path = args.cache_path

    if path.is_dir():
        dump_entry_data_through_index(path, args.output_dir, args.prefix)
    else:
        parser.exit("Please provide the thumbnail cache directory.")


if __name__ == "__main__":
    main()
