from __future__ import annotations

import io
from functools import cached_property, lru_cache
from operator import itemgetter
from typing import TYPE_CHECKING, BinaryIO, Callable, Generic, TypeVar

from dissect.executable.elf.c_elf import (
    SHN,
    SHT,
    STB,
    STT,
    STV,
    Elf_Type,
    c_common_elf,
    c_elf_32,
    c_elf_64,
)
from dissect.executable.exception import InvalidSignatureError

if TYPE_CHECKING:
    from collections.abc import Iterator

    from dissect.cstruct import cstruct


class ELF:
    def __init__(self, fh: BinaryIO):
        self.fh = fh
        offset = fh.tell()
        self.e_ident = fh.read(0x10)
        fh.seek(offset)

        if self.e_ident[:4] != c_common_elf.ELFMAG:
            raise InvalidSignatureError("Invalid header magic")

        c_elf_version = c_elf_32
        if self.e_ident[c_common_elf.EI_CLASS] == c_common_elf.ELFCLASS64:
            c_elf_version = c_elf_64
        self.c_elf = c_elf_version

        # Determine endianess interpretation of bytes. This matters after the first 16 bytes.
        is_little = self.e_ident[c_common_elf.EI_DATA] == c_common_elf.ELFDATA2LSB
        self.c_elf.endian = "<" if is_little else ">"

        self.header = self.c_elf.Ehdr(fh)
        self.segments = SegmentTable.from_elf(self)
        self.section_table = SectionTable.from_elf(self)
        self.symbol_tables: list[SymbolTable] = self.section_table.by_type([SHT.SYMTAB, SHT.DYNSYM])

    def __repr__(self) -> str:
        return str(self.header)

    def dump(self) -> bytes:
        output_data = [
            self.segments.dump_table(),
            self.section_table.dump_table(),
            *self.segments.dump_data(),
            *self.section_table.dump_data(),
        ]
        output_data.sort(key=itemgetter(0))

        result = []
        output_size = 0
        for offset, output_bytes in output_data:
            output_offset = offset - output_size

            buf = None
            relative_offset = output_offset + len(output_bytes)
            if output_offset < 0 and relative_offset > 0:
                buf = output_bytes[abs(output_offset) :]
            elif output_offset >= 0:
                buf = (b"\x00" * output_offset) + output_bytes

            if buf is not None:
                result.append(buf)
                output_size += len(buf)

        return b"".join(result)

    @property
    def dynamic(self) -> bool:
        return self.header.e_type == Elf_Type.ET_DYN


T = TypeVar("T")


class Table(Generic[T]):
    def __init__(self, entries: int) -> None:
        self.entries = entries
        self.items: list[T] = [None] * entries

    def __iter__(self) -> Iterator[T]:
        for idx in range(self.entries):
            yield self[idx]

    def __getitem__(self, idx: int) -> T:
        if self.items[idx] is None:
            self.items[idx] = self._create_item(idx)
        return self.items[idx]

    def _create_item(self, idx: int) -> T:
        raise NotImplementedError

    def find(self, condition: Callable[[T], bool], **kwargs) -> list[T]:
        return [item for item in self if condition(item, **kwargs)]


class Section:
    def __init__(self, fh: BinaryIO, idx: int | None = None, c_elf: cstruct = c_elf_64):
        self.fh = fh
        self.idx = idx

        self.c_elf = c_elf
        self.header = self.c_elf.Shdr(self.fh)
        self.type = self.header.sh_type
        self.entry_size = self.header.sh_entsize
        self.alignment = self.header.sh_addralign
        self.offset = self.header.sh_offset
        self.size = self.header.sh_size

        self._name = None
        self._link = None

    def __repr__(self) -> str:
        return (
            f"<{self.__class__.__name__} idx={self.idx} name={self.name} type={self.type}"
            f" offset=0x{self.offset:x} size=0x{self.size:x}>"
        )

    def _set_name(self, table: StringTable) -> None:
        if self.header.sh_name != SHN.UNDEF:
            self._name = table[self.header.sh_name]

    def _set_link(self, table: SectionTable) -> None:
        if self.header.sh_link != SHN.UNDEF:
            self._link = table[self.header.sh_link]

    @classmethod
    def from_section_table(cls, section_table: SectionTable, idx: int) -> Section:
        result = cls(section_table.fh, idx=idx, c_elf=section_table.c_elf)
        result._set_link(section_table)

        string_table = section_table.string_table
        if isinstance(result, StringTable):
            string_table = result

        if string_table:
            result._set_name(string_table)

        return result

    @property
    def name(self) -> str | None:
        return self._name

    def is_related(self, segment: Segment) -> bool:
        return segment.is_related(self)

    @property
    def link(self) -> Section | None:
        return self._link

    @cached_property
    def contents(self) -> bytes:
        self.fh.seek(self.offset)
        return self.fh.read(self.size)


class SectionTable(Table[Section]):
    def __init__(
        self,
        fh: BinaryIO,
        offset: int,
        entries: int,
        size: int,
        string_index: int | None = None,
        c_elf: cstruct = c_elf_64,
    ):
        super().__init__(entries)
        self.fh = fh
        self.offset = offset
        self.size = size
        self.string_table = None
        self.c_elf = c_elf

        if string_index:
            self.string_table: StringTable = self[string_index]

    def __repr__(self) -> str:
        return f"<SectionTable offset=0x{self.offset:x} size=0x{self.size:x}>"

    def _create_item(self, idx: int) -> Section:
        self.fh.seek(self.offset + self.size * idx)
        _, section_type = self.c_elf.uint32[2](self.fh.read(8))
        self.fh.seek(-8, io.SEEK_CUR)

        return_class = Section
        if section_type == SHT.STRTAB:
            return_class = StringTable
        if section_type in [SHT.DYNSYM, SHT.SYMTAB]:
            return_class = SymbolTable

        return return_class.from_section_table(self, idx)

    @classmethod
    def from_elf(cls, elf: ELF) -> SectionTable:
        offset = elf.header.e_shoff
        entries = elf.header.e_shnum
        size = elf.header.e_shentsize
        other_index = elf.header.e_shstrndx
        return cls(elf.fh, offset, entries, size, other_index, elf.c_elf)

    def by_type(self, section_types: list[int] | int) -> list[Section]:
        types = section_types
        if not isinstance(section_types, list):
            types = [types]

        return self.find(lambda x: x.type in types)

    def related_sections(self, segment: Segment) -> list[Section]:
        return self.find(lambda x: x.is_related(segment))

    def by_name(self, name: str) -> list[Section]:
        return self.find(lambda x: x.name in name)

    def dump_table(self) -> tuple[int, bytes]:
        buf = bytearray()
        return self.offset, buf.join([x.header.dumps() for x in self])

    def dump_data(self) -> list[tuple[int, bytes]]:
        return [(x.offset, x.contents) for x in self]


class Segment:
    def __init__(self, fh: BinaryIO, idx: int | None = None, c_elf: cstruct = c_elf_64):
        self.fh = fh
        self.idx = idx
        self.c_elf = c_elf

        self.header = c_elf.Phdr(fh)
        self.type = self.header.p_type
        self.flags = self.header.p_flags
        self.virtual_address = self.header.p_vaddr
        self.physical_address = self.header.p_paddr
        self.memory_size = self.header.p_memsz
        self.alignment = self.header.p_align
        self.offset = self.header.p_offset
        self.size = self.header.p_filesz

        self._data = b""
        self.patched = False

    def __repr__(self) -> str:
        return repr(self.header)

    @classmethod
    def from_segment_table(cls, table: SegmentTable, idx: int | None = None) -> Segment:
        fh = table.fh
        return cls(fh, idx, table.c_elf)

    @property
    def end(self) -> int:
        return self.offset + self.size

    def is_related(self, section: Section) -> bool:
        return self.offset <= section.offset < self.end

    @property
    def contents(self) -> bytes:
        if not self._data:
            self.fh.seek(self.offset)
            self._data = self.fh.read(self.size)
        return self._data

    def _alignment_padding(self, data_length: int) -> bytes:
        padding = 0
        if self.header.p_align > 1:
            padding = data_length % self.header.p_align
        return b"\x00" * padding

    def patch(self, new_data: bytes) -> None:
        self.patched = True
        self._data = new_data + self._alignment_padding(len(new_data))
        self.header.p_filesz = len(self._data)


class SegmentTable(Table[Segment]):
    def __init__(self, fh: BinaryIO, offset: int, entries: int, size: int, c_elf: cstruct = c_elf_64):
        super().__init__(entries)
        self.fh = fh
        self.offset = offset
        self.size = size
        self.c_elf = c_elf

    def __repr__(self) -> str:
        return f"<SegmentTable offset=0x{self.offset:x} size=0x{self.size:x}>"

    def _create_item(self, idx: int) -> Segment:
        self.fh.seek(self.offset + self.size * idx)
        return Segment.from_segment_table(self, idx)

    @classmethod
    def from_elf(cls, elf: ELF) -> SegmentTable:
        header = elf.header
        offset = header.e_phoff
        entries = header.e_phnum
        size = header.e_phentsize
        return cls(fh=elf.fh, offset=offset, entries=entries, size=size, c_elf=elf.c_elf)

    def related_segments(self, section: Section) -> list[Segment]:
        return self.find(lambda x: x.is_related(section))

    def by_type(self, segment_types: list[int] | int) -> list[Segment]:
        types = segment_types
        if not isinstance(segment_types, list):
            types = [types]

        return self.find(lambda x: x.type in types)

    def dump_data(self) -> list[tuple[int, bytearray]]:
        return [(x.offset, x.contents) for x in self]

    def dump_table(self) -> tuple[int, bytearray]:
        buf = bytearray()
        return self.offset, buf.join([x.header.dumps() for x in self])


class StringTable(Section):
    def __init__(self, fh: BinaryIO, idx: int | None = None, c_elf: cstruct = c_elf_64):
        super().__init__(fh, idx, c_elf)

        self._get_string = lru_cache(256)(self._get_string)

    def __getitem__(self, offset: int) -> str:
        return self._get_string(offset)

    def _get_string(self, index: int) -> str:
        if index > len(self.contents) or index == SHN.UNDEF:
            return None
        return self.c_elf.char[None](self.contents[index:]).decode("utf8")


class Symbol:
    def __init__(self, fh: BinaryIO, idx: int | None = None, c_elf: cstruct = c_elf_64):
        self.symbol = c_elf.Sym(fh)
        self.idx = idx
        self.c_elf = c_elf

        endianness = "little" if c_elf.endian == "<" else "big"

        info = int.from_bytes(self.symbol.st_info, endianness)
        self.bind = STB(info >> 4)
        self.type = STT(info & 0xF)
        self.size = self.symbol.st_size

        other = int.from_bytes(self.symbol.st_other, endianness)
        self.visibility = STV(other & 0x3)

        self._name = None

    def __repr__(self) -> str:
        return (
            f"<Symbol idx={self.idx} value=0x{self.value:x} size={self.size} type={self.type} bind={self.bind}"
            f" visibility={self.visibility} shndex={self.symbol.st_shndx} name={self.name}>"
        )

    def _set_name(self, table: StringTable) -> None:
        self._name = table[self.symbol.st_name]

    @classmethod
    def from_symbol_table(cls, table: SymbolTable, idx: int) -> Symbol:
        offset = idx * table.entry_size
        data = table.contents[offset : offset + table.entry_size]
        output = cls(io.BytesIO(data), idx, table.c_elf)
        output._set_name(table.link)
        return output

    @property
    def name(self) -> str:
        return self._name

    @property
    def value(self) -> int:
        return 0 if self.symbol.st_shndx == SHN.UNDEF else self.symbol.st_value

    def value_based_on_shndx(self, table: SectionTable) -> int:
        symloc = self.symbol.st_shndx
        value = self.value
        if symloc not in [SHN.UNDEF, SHN.ABS]:
            value += table[symloc].offset
        return value


class SymbolTable(Section, Table[Symbol]):
    def __init__(self, fh: BinaryIO, idx: int | None = None, c_elf: cstruct = c_elf_64):
        # Initializes Section info
        Section.__init__(self, fh, idx, c_elf)
        count = self.size // self.entry_size
        # Initializes Table info
        Table.__init__(self, count)

    def _create_item(self, idx: int) -> Symbol:
        return Symbol.from_symbol_table(self, idx)
