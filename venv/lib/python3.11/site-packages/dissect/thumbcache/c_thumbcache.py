from __future__ import annotations

from dissect.cstruct import cstruct

thumbcache_def = """
struct INDEX_HEADER_V1 {
    char    Signature[4];   // 0x00
    uint32  Version;        // 0x04
    uint32  Unknown1;       // 0x08
    uint32  UsedEntries;    // 0x0C
    uint32  TotalEntries;   // 0x10
    uint32  Unknown2;       // 0x14
}; // 0x18

struct INDEX_HEADER_V2 {
    char    Signature[8];   // 0x00
    uint64  Version;        // 0x08
    uint32  Unknown1;       // 0x10
    uint32  UsedEntries;    // 0x14
    uint32  TotalEntries;   // 0x18
    uint32  Unknown2;       // 0x1B
}; // 0x20

struct VISTA_ENTRY {
    char    Hash[8];        // 0x00
    uint64  LastModified;   // 0x08
    uint32  Flags;          // 0x10
}; // 0x14

struct WINDOWS7_ENTRY {
    char    Hash[8];        // 0x00
    uint32  Flags;          // 0x08
}; // 0x0C

struct WINDOWS8_ENTRY {
    char    Hash[8];        // 0x00
    uint32  Flags;          // 0x08
    uint32  Unknown;        // 0x0C Is sometimes filled with information, couldn't figure out what it meant yet though.
}; // 0x10

struct CACHE_HEADER {
    char    Signature[4];   // 0x00
    uint32  Version;        // 0x04
    uint32  Type;           // 0x08
    uint32  Size;           // 0x0C
    uint32  Offset;         // 0x10
    uint32  Entries;        // 0x14
}; // 0x18

struct CACHE_HEADER_VISTA {
    char    Signature[4];   // 0x00
    uint32  Version;        // 0x04
    uint32  Type;           // 0x08
    uint32  Offset;         // 0x0C
    uint32  Size;           // 0x10
    uint32  Entries;        // 0x14
}; // 0x18

struct CACHE_ENTRY {
    char    Signature[4];   // 0x00
    uint32  Size;           // 0x04
    char    Hash[8];        // 0x08
    uint32  IdentifierSize; // 0x10
    uint32  PaddingSize;    // 0x14
    uint32  DataSize;       // 0x18
    uint32  Unknown;        // 0x1C
}; // 0x20

struct CACHE_ENTRY_VISTA {
    char    Signature[4];   // 0x04
    uint32  Size;           // 0x08
    char    Hash[8];        // 0x0C
    wchar   Extension[4];   // 0x14
    uint32  IdentifierSize; // 0x1C
    uint32  PaddingSize;    // 0x20
    uint32  DataSize;       // 0x24
    uint32  Unknown;        // 0x28
}; // 0x2C
"""
c_thumbcache = cstruct().load(thumbcache_def)
