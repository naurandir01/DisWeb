from dissect.cstruct import cstruct
from dissect.util.compression import lzxpress_huffman

wim_def = """
typedef int64 LARGE_INTEGER;
typedef uint64 ULARGE_INTEGER;

#define HASH_SIZE           20

// Some general Windows enums
flag FILE_ATTRIBUTE : DWORD {
    READONLY                = 0x00000001,
    HIDDEN                  = 0x00000002,
    SYSTEM                  = 0x00000004,
    DIRECTORY               = 0x00000010,
    ARCHIVE                 = 0x00000020,
    DEVICE                  = 0x00000040,
    NORMAL                  = 0x00000080,
    TEMPORARY               = 0x00000100,
    SPARSE_FILE             = 0x00000200,
    REPARSE_POINT           = 0x00000400,
    COMPRESSED              = 0x00000800,
    OFFLINE                 = 0x00001000,
    NOT_CONTENT_INDEXED     = 0x00002000,
    ENCRYPTED               = 0x00004000,
    INTEGRITY_STREAM        = 0x00008000,
    VIRTUAL                 = 0x00010000,
    NO_SCRUB_DATA           = 0x00020000,
    RECALL_ON_OPEN          = 0x00040000,
    PINNED                  = 0x00080000,
    UNPINNED                = 0x00100000,
    RECALL_ON_DATA_ACCESS   = 0x00400000,
};

enum IO_REPARSE_TAG : ULONG {
    RESERVED_ZERO           = 0x00000000,
    RESERVED_ONE            = 0x00000001,
    RESERVED_TWO            = 0x00000002,
    MOUNT_POINT             = 0xA0000003,
    HSM                     = 0xC0000004,
    DRIVE_EXTENDER          = 0x80000005,
    HSM2                    = 0x80000006,
    SIS                     = 0x80000007,
    WIM                     = 0x80000008,
    CSV                     = 0x80000009,
    DFS                     = 0x8000000A,
    FILTER_MANAGER          = 0x8000000B,
    SYMLINK                 = 0xA000000C,
    IIS_CACHE               = 0xA0000010,
    DFSR                    = 0x80000012,
    DEDUP                   = 0x80000013,
    APPXSTRM                = 0xC0000014,
    NFS                     = 0x80000014,
    FILE_PLACEHOLDER        = 0x80000015,
    DFM                     = 0x80000016,
    WOF                     = 0x80000017,
    WCI                     = 0x80000018,
    WCI_1                   = 0x90001018,
    GLOBAL_REPARSE          = 0xA0000019,
    CLOUD                   = 0x9000001A,
    CLOUD_1                 = 0x9000101A,
    CLOUD_2                 = 0x9000201A,
    CLOUD_3                 = 0x9000301A,
    CLOUD_4                 = 0x9000401A,
    CLOUD_5                 = 0x9000501A,
    CLOUD_6                 = 0x9000601A,
    CLOUD_7                 = 0x9000701A,
    CLOUD_8                 = 0x9000801A,
    CLOUD_9                 = 0x9000901A,
    CLOUD_A                 = 0x9000A01A,
    CLOUD_B                 = 0x9000B01A,
    CLOUD_C                 = 0x9000C01A,
    CLOUD_D                 = 0x9000D01A,
    CLOUD_E                 = 0x9000E01A,
    CLOUD_F                 = 0x9000F01A,
    APPEXECLINK             = 0x8000001B,
    PROJFS                  = 0x9000001C,
    LX_SYMLINK              = 0xA000001D,
    STORAGE_SYNC            = 0x8000001E,
    WCI_TOMBSTONE           = 0xA000001F,
    UNHANDLED               = 0x80000020,
    ONEDRIVE                = 0x80000021,
    PROJFS_TOMBSTONE        = 0xA0000022,
    AF_UNIX                 = 0x80000023,
    LX_FIFO                 = 0x80000024,
    LX_CHR                  = 0x80000025,
    LX_BLK                  = 0x80000026,
    WCI_LINK                = 0xA0000027,
    WCI_LINK_1              = 0xA0001027,
};

enum SYMLINK_FLAG : ULONG {
    ABSOLUTE                = 0x00000000,
    RELATIVE                = 0x00000001,
};

typedef struct _SYMBOLIC_LINK_REPARSE_BUFFER {
    USHORT                  SubstituteNameOffset;
    USHORT                  SubstituteNameLength;
    USHORT                  PrintNameOffset;
    USHORT                  PrintNameLength;
    SYMLINK_FLAG            Flags;
} SYMBOLIC_LINK_REPARSE_BUFFER;

typedef struct _MOUNT_POINT_REPARSE_BUFFER {
    USHORT                  SubstituteNameOffset;
    USHORT                  SubstituteNameLength;
    USHORT                  PrintNameOffset;
    USHORT                  PrintNameLength;
} _MOUNT_POINT_REPARSE_BUFFER;

// WIM structures
flag RESHDR_FLAG : BYTE {
    FREE                    = 0x01,
    METADATA                = 0x02,
    COMPRESSED              = 0x04,
    SPANNED                 = 0x08,
};

// Original structures for reference
/*
typedef struct _RESHDR_BASE_DISK {
    union {
        ULONGLONG           Size;
        struct {
           CHAR             sizebytes[7];
           RESHDR_FLAG      Flags;
        };
    };
    LARGE_INTEGER           Offset;
} RESHDR_BASE_DISK;

typedef struct _RESHDR_DISK_SHORT {
    RESHDR_BASE_DISK        Base;               // Must be first.
    LARGE_INTEGER           OriginalSize;
} RESHDR_DISK_SHORT;
*/

// Slightly optimized structure
typedef struct _RESHDR_DISK_SHORT {
    CHAR                    Size[7];
    RESHDR_FLAG             Flags;
    LARGE_INTEGER           Offset;
    LARGE_INTEGER           OriginalSize;
} RESHDR_DISK_SHORT;

typedef struct _RESHDR_DISK {
    RESHDR_DISK_SHORT       Base;
    USHORT                  PartNumber;
    DWORD                   RefCount;
    CHAR                    Hash[HASH_SIZE];
} RESHDR_DISK;

flag HEADER_FLAG : DWORD {
    RESERVED                = 0x00000001,
    COMPRESSION             = 0x00000002,
    READONLY                = 0x00000004,
    SPANNED                 = 0x00000008,
    RESOURCE_ONLY           = 0x00000010,
    METADATA_ONLY           = 0x00000020,
    WRITE_IN_PROGRESS       = 0x00000040,
    RP_FIX                  = 0x00000080,       // reparse point fixup
    COMPRESS_RESERVED       = 0x00010000,
    COMPRESS_XPRESS         = 0x00020000,
    COMPRESS_LZX            = 0x00040000,
};

#define VERSION_DEFAULT     0x10d00

typedef struct _WIMHEADER_V1_PACKED {
    CHAR                    ImageTag[8];        // "MSWIM\\0\\0"
    DWORD                   Size;
    DWORD                   Version;
    HEADER_FLAG             Flags;
    DWORD                   CompressionSize;
    CHAR                    WIMGuid[16];
    USHORT                  PartNumber;
    USHORT                  TotalParts;
    DWORD                   ImageCount;
    RESHDR_DISK_SHORT       OffsetTable;
    RESHDR_DISK_SHORT       XmlData;
    RESHDR_DISK_SHORT       BootMetadata;
    DWORD                   BootIndex;
    RESHDR_DISK_SHORT       Integrity;
    CHAR                    Unused[60];
} WIMHEADER_V1_PACKED;

typedef struct _SECURITYBLOCK_DISK {
    DWORD                   TotalLength;
    DWORD                   NumEntries;
    ULARGE_INTEGER          EntryLength[NumEntries];
} SECURITYBLOCK_DISK;

typedef struct _DIRENTRY {
    LARGE_INTEGER           Length;
    FILE_ATTRIBUTE          Attributes;
    DWORD                   SecurityId;
    LARGE_INTEGER           SubdirOffset;
    LARGE_INTEGER           Unused1;
    LARGE_INTEGER           Unused2;
    LARGE_INTEGER           CreationTime;
    LARGE_INTEGER           LastAccessTime;
    LARGE_INTEGER           LastWriteTime;
    CHAR                    Hash[HASH_SIZE];
    CHAR                    _Unknown[4];
    union {
        struct {
            DWORD           ReparseTag;
            DWORD           ReparseReserved;
        };
        LARGE_INTEGER       HardLink;
    };
    USHORT                  Streams;
    USHORT                  ShortNameLength;
    USHORT                  FileNameLength;
    WCHAR                   FileName[0];
} DIRENTRY;

typedef struct _STREAMENTRY {
    LARGE_INTEGER           Length;
    LARGE_INTEGER           Unused1;
    CHAR                    Hash[HASH_SIZE];
    USHORT                  StreamNameLength;
    WCHAR                   StreamName[0];
} STREAMENTRY;

typedef struct _WIMHASH {
    DWORD                   Size;
    DWORD                   NumElements;
    DWORD                   ChunkSize;
    BYTE                    HashList[0];
} WIMHASH;
"""

c_wim = cstruct().load(wim_def)

WIM_IMAGE_TAG = b"MSWIM\x00\x00\x00"
HEADER_FLAG = c_wim.HEADER_FLAG
RESHDR_FLAG = c_wim.RESHDR_FLAG

FILE_ATTRIBUTE = c_wim.FILE_ATTRIBUTE
IO_REPARSE_TAG = c_wim.IO_REPARSE_TAG
SYMLINK_FLAG = c_wim.SYMLINK_FLAG

DECOMPRESSOR_MAP = {
    HEADER_FLAG.COMPRESS_XPRESS: lzxpress_huffman.decompress,
}
