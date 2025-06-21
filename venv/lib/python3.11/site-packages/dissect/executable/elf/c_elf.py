from enum import Flag, IntEnum

from dissect.cstruct import cstruct

elf_32_def = """
typedef uint32      Elf32_Addr;
typedef uint16      Elf32_Half;
typedef uint32      Elf32_Off;
typedef int32       Elf32_Sword;
typedef uint32      Elf32_Word;

typedef struct {
    Elf32_Addr      r_offset;
    Elf32_Word      r_info;
} Rel;

typedef struct {
    Elf32_Addr      r_offset;
    Elf32_Word      r_info;
    Elf32_Sword     r_addend;
} Rela;

typedef struct {
    Elf32_Word      st_name;
    Elf32_Addr      st_value;
    Elf32_Word      st_size;
    char            st_info;
    char            st_other;
    Elf32_Half      st_shndx;
} Sym;

typedef struct {
    char            e_ident[EI_NIDENT];
    Elf_Type        e_type;
    Elf32_Half      e_machine;
    Elf32_Word      e_version;
    Elf32_Addr      e_entry;             /* Entry point */
    Elf32_Off       e_phoff;
    Elf32_Off       e_shoff;
    Elf32_Word      e_flags;
    Elf32_Half      e_ehsize;
    Elf32_Half      e_phentsize;
    Elf32_Half      e_phnum;
    Elf32_Half      e_shentsize;
    Elf32_Half      e_shnum;
    Elf32_Half      e_shstrndx;
} Ehdr;

typedef struct {
    PT              p_type;
    Elf32_Off       p_offset;
    Elf32_Addr      p_vaddr;
    Elf32_Addr      p_paddr;
    Elf32_Word      p_filesz;
    Elf32_Word      p_memsz;
    PF              p_flags;
    Elf32_Word      p_align;
} Phdr;

typedef struct {
    Elf32_Word      sh_name;
    SHT             sh_type;
    Elf32_Word      sh_flags;
    Elf32_Addr      sh_addr;
    Elf32_Off       sh_offset;
    Elf32_Word      sh_size;
    Elf32_Word      sh_link;
    Elf32_Word      sh_info;
    Elf32_Word      sh_addralign;
    Elf32_Word      sh_entsize;
} Shdr;

/* Note header in a PT_NOTE section */
typedef struct {
    Elf32_Word      n_namesz;            /* Name size */
    Elf32_Word      n_descsz;            /* Content size */
    Elf32_Word      n_type;              /* Content type */
} Nhdr;
"""

elf_64_def = """
typedef uint64      Elf64_Addr;
typedef uint16      Elf64_Half;
typedef int16       Elf64_SHalf;
typedef uint64      Elf64_Off;
typedef int32       Elf64_Sword;
typedef uint32      Elf64_Word;
typedef uint64      Elf64_Xword;
typedef int64       Elf64_Sxword;

typedef struct {
    Elf64_Addr      r_offset;            /* Location at which to apply the action */
    Elf64_Xword     r_info;              /* index and type of relocation */
} Rel;

typedef struct {
    Elf64_Addr      r_offset;            /* Location at which to apply the action */
    Elf64_Xword     r_info;              /* index and type of relocation */
    Elf64_Sxword    r_addend;            /* Constant addend used to compute value */
} Rela;

typedef struct {
    Elf64_Word      st_name;             /* Symbol name, index in string tbl */
    char            st_info;             /* Type and binding attributes */
    char            st_other;            /* No defined meaning, 0 */
    Elf64_Half      st_shndx;            /* Associated section index */
    Elf64_Addr      st_value;            /* Value of the symbol */
    Elf64_Xword     st_size;             /* Associated symbol size */
} Sym;

typedef struct {
    char            e_ident[EI_NIDENT];  /* ELF "magic number" */
    Elf_Type        e_type;
    Elf64_Half      e_machine;
    Elf64_Word      e_version;
    Elf64_Addr      e_entry;             /* Entry point virtual address */
    Elf64_Off       e_phoff;             /* Program header table file offset */
    Elf64_Off       e_shoff;             /* Section header table file offset */
    Elf64_Word      e_flags;
    Elf64_Half      e_ehsize;
    Elf64_Half      e_phentsize;
    Elf64_Half      e_phnum;
    Elf64_Half      e_shentsize;
    Elf64_Half      e_shnum;
    Elf64_Half      e_shstrndx;
} Ehdr;

typedef struct {
    PT              p_type;
    PF              p_flags;
    Elf64_Off       p_offset;             /* Segment file offset */
    Elf64_Addr      p_vaddr;              /* Segment virtual address */
    Elf64_Addr      p_paddr;              /* Segment physical address */
    Elf64_Xword     p_filesz;             /* Segment size in file */
    Elf64_Xword     p_memsz;              /* Segment size in memory */
    Elf64_Xword     p_align;              /* Segment alignment, file & memory */
} Phdr;

typedef struct {
    Elf64_Word      sh_name;              /* Section name, index in string tbl */
    SHT             sh_type;              /* Type of section */
    Elf64_Xword     sh_flags;             /* Miscellaneous section attributes */
    Elf64_Addr      sh_addr;              /* Section virtual addr at execution */
    Elf64_Off       sh_offset;            /* Section file offset */
    Elf64_Xword     sh_size;              /* Size of section in bytes */
    Elf64_Word      sh_link;              /* Index of another section */
    Elf64_Word      sh_info;              /* Additional section information */
    Elf64_Xword     sh_addralign;         /* Section alignment */
    Elf64_Xword     sh_entsize;           /* Entry size if section holds table */
} Shdr;

/* Note header in a PT_NOTE section */
typedef struct {
    Elf64_Word      n_namesz;             /* Name size */
    Elf64_Word      n_descsz;             /* Content size */
    Elf64_Word      n_type;               /* Content type */
} Nhdr;
"""

elf_def = """
#define PT_LOOS         0x60000000        /* OS-specific */
#define PT_HIOS         0x6fffffff        /* OS-specific */
#define PT_LOPROC       0x70000000
#define PT_HIPROC       0x7fffffff
#define PT_GNU_EH_FRAME 0x6474e550

enum PT : uint32 {
    NULL                = 0,
    LOAD                = 1,
    DYNAMIC             = 2,
    INTERP              = 3,
    NOTE                = 4,
    SHLIB               = 5,
    PHDR                = 6,
    TLS                 = 7
};

#define PT_GNU_STACK    (PT_LOOS + 0x474e551)

#define PN_XNUM         0xffff

/* These constants define the different elf file types */
#define ET_LOPROC       0xff00
#define ET_HIPROC       0xffff

enum Elf_Type : uint16 {
    ET_NONE             = 0, // Unkown Type
    ET_REL              = 1, // Relocatable File
    ET_EXEC             = 2, // Executable File
    ET_DYN              = 3,
    ET_CORE             = 4
};

/* This is the info that is needed to parse the dynamic section of the file */
#define DT_NULL         0
#define DT_NEEDED       1
#define DT_PLTRELSZ     2
#define DT_PLTGOT       3
#define DT_HASH         4
#define DT_STRTAB       5
#define DT_SYMTAB       6
#define DT_RELA         7
#define DT_RELASZ       8
#define DT_RELAENT      9
#define DT_STRSZ        10
#define DT_SYMENT       11
#define DT_INIT         12
#define DT_FINI         13
#define DT_SONAME       14
#define DT_RPATH        15
#define DT_SYMBOLIC     16
#define DT_REL          17
#define DT_RELSZ        18
#define DT_RELENT       19
#define DT_PLTREL       20
#define DT_DEBUG        21
#define DT_TEXTREL      22
#define DT_JMPREL       23
#define DT_ENCODING     32
#define OLD_DT_LOOS     0x60000000
#define DT_LOOS         0x6000000d
#define DT_HIOS         0x6ffff000
#define DT_VALRNGLO     0x6ffffd00
#define DT_VALRNGHI     0x6ffffdff
#define DT_ADDRRNGLO    0x6ffffe00
#define DT_ADDRRNGHI    0x6ffffeff
#define DT_VERSYM       0x6ffffff0
#define DT_RELACOUNT    0x6ffffff9
#define DT_RELCOUNT     0x6ffffffa
#define DT_FLAGS_1      0x6ffffffb
#define DT_VERDEF       0x6ffffffc
#define DT_VERDEFNUM    0x6ffffffd
#define DT_VERNEED      0x6ffffffe
#define DT_VERNEEDNUM   0x6fffffff
#define OLD_DT_HIOS     0x6fffffff
#define DT_LOPROC       0x70000000
#define DT_HIPROC       0x7fffffff

/* This info is needed when parsing the symbol table */
enum STB {
    LOCAL               = 0, /* Local scope */
    GLOBAL              = 1, /* Global scope */
    WEAK                = 2  /* Weak, (ie. __attribute__((weak))) */
};

enum STT {
    NOTYPE              = 0, // No type
    OBJECT              = 1, // Variables, arrays, etc.
    FUNC                = 2, // Methods or functions
    SECTION             = 3,
    FILE                = 4,
    COMMON              = 5,
    TLS                 = 6
};

enum STV {
    DEFAULT              = 0,
    INTERNAL             = 1,
    HIDDEN               = 2,
    PROTECTED            = 3
};

/* These constants define the permissions on sections in the program
   header, p_flags. */
flag PF : uint32 {
    R = 0x4,
    W = 0x2,
    X = 0x1
};

/* sh_type */
enum SHT : uint32 {
    NULL                = 0,   /* Null section */
    PROGBITS            = 1,   /* Program information */
    SYMTAB              = 2,   /* Symbol table */
    STRTAB              = 3,   /* String table */
    RELA                = 4,   /* Relocation (w/ addend) */
    HASH                = 5,
    DYNAMIC             = 6,
    NOTE                = 7,
    NOBITS              = 8,   /* Not present in file */
    REL                 = 9,   /* Relocation (no addend) */
    SHLIB               = 10,
    DYNSYM              = 11,
    NUM                 = 12
};

/* sh_flags */
enum SHN : uint16 {
    UNDEF               = 0x0000,
    LOPROC              = 0xff00,
    HIPROC              = 0xff1f,
    LIVEPATCH           = 0xff20,
    ABS                 = 0xfff1
    COMMON              = 0xfff2
    HIRESERVE           = 0xffff
};


#define EI_NIDENT       16                /* Size of e_ident[] */
#define EI_MAG0         0                 /* e_ident[] indexes */
#define EI_MAG1         1
#define EI_MAG2         2
#define EI_MAG3         3
#define EI_CLASS        4
#define EI_DATA         5                 /* Defines endianness */
#define EI_VERSION      6
#define EI_OSABI        7
#define EI_PAD          8

#define ELFMAG0         0x7f              /* EI_MAG */
#define ELFMAG1         'E'
#define ELFMAG2         'L'
#define ELFMAG3         'F'
#define ELFMAG          b"\x7fELF"
#define SELFMAG         4

#define ELFCLASSNONE    0                 /* EI_CLASS */
#define ELFCLASS32      1
#define ELFCLASS64      2
#define ELFCLASSNUM     3

#define ELFDATANONE     0                 /* e_ident[EI_DATA] */
#define ELFDATA2LSB     1
#define ELFDATA2MSB     2

#define EV_NONE         0                 /* e_version, EI_VERSION */
#define EV_CURRENT      1
#define EV_NUM          2

#define ELFOSABI_NONE   0
#define ELFOSABI_LINUX  3

/*
 * Notes used in ET_CORE. Architectures export some of the arch register sets
 * using the corresponding note types via the PTRACE_GETREGSET and
 * PTRACE_SETREGSET requests.
 */
#define NT_PRSTATUS     1
#define NT_PRFPREG      2
#define NT_PRPSINFO     3
#define NT_TASKSTRUCT   4
#define NT_AUXV         6

#define NT_SIGINFO          0x53494749
#define NT_FILE             0x46494c45
#define NT_PRXFPREG         0x46e62b7f  /* copied from gdb5.1/include/elf/common.h */
#define NT_PPC_VMX          0x100       /* PowerPC Altivec/VMX registers */
#define NT_PPC_SPE          0x101       /* PowerPC SPE/EVR registers */
#define NT_PPC_VSX          0x102       /* PowerPC VSX registers */
#define NT_PPC_TAR          0x103       /* Target Address Register */
#define NT_PPC_PPR          0x104       /* Program Priority Register */
#define NT_PPC_DSCR         0x105       /* Data Stream Control Register */
#define NT_PPC_EBB          0x106       /* Event Based Branch Registers */
#define NT_PPC_PMU          0x107       /* Performance Monitor Registers */
#define NT_PPC_TM_CGPR      0x108       /* TM checkpointed GPR Registers */
#define NT_PPC_TM_CFPR      0x109       /* TM checkpointed FPR Registers */
#define NT_PPC_TM_CVMX      0x10a       /* TM checkpointed VMX Registers */
#define NT_PPC_TM_CVSX      0x10b       /* TM checkpointed VSX Registers */
#define NT_PPC_TM_SPR       0x10c       /* TM Special Purpose Registers */
#define NT_PPC_TM_CTAR      0x10d       /* TM checkpointed Target Address Register */
#define NT_PPC_TM_CPPR      0x10e       /* TM checkpointed Program Priority Register */
#define NT_PPC_TM_CDSCR     0x10f       /* TM checkpointed Data Stream Control Register */
#define NT_PPC_PKEY         0x110       /* Memory Protection Keys registers */
#define NT_386_TLS          0x200       /* i386 TLS slots (struct user_desc) */
#define NT_386_IOPERM       0x201       /* x86 io permission bitmap (1=deny) */
#define NT_X86_XSTATE       0x202       /* x86 extended state using xsave */
#define NT_S390_HIGH_GPRS   0x300       /* s390 upper register halves */
#define NT_S390_TIMER       0x301       /* s390 timer register */
#define NT_S390_TODCMP      0x302       /* s390 TOD clock comparator register */
#define NT_S390_TODPREG     0x303       /* s390 TOD programmable register */
#define NT_S390_CTRS        0x304       /* s390 control registers */
#define NT_S390_PREFIX      0x305       /* s390 prefix register */
#define NT_S390_LAST_BREAK  0x306       /* s390 breaking event address */
#define NT_S390_SYSTEM_CALL 0x307       /* s390 system call restart data */
#define NT_S390_TDB         0x308       /* s390 transaction diagnostic block */
#define NT_S390_VXRS_LOW    0x309       /* s390 vector registers 0-15 upper half */
#define NT_S390_VXRS_HIGH   0x30a       /* s390 vector registers 16-31 */
#define NT_S390_GS_CB       0x30b       /* s390 guarded storage registers */
#define NT_S390_GS_BC       0x30c       /* s390 guarded storage broadcast control block */
#define NT_S390_RI_CB       0x30d       /* s390 runtime instrumentation */
#define NT_ARM_VFP          0x400       /* ARM VFP/NEON registers */
#define NT_ARM_TLS          0x401       /* ARM TLS register */
#define NT_ARM_HW_BREAK     0x402       /* ARM hardware breakpoint registers */
#define NT_ARM_HW_WATCH     0x403       /* ARM hardware watchpoint registers */
#define NT_ARM_SYSTEM_CALL  0x404       /* ARM system call number */
#define NT_ARM_SVE          0x405       /* ARM Scalable Vector Extension registers */
#define NT_ARC_V2           0x600       /* ARCv2 accumulator/extra registers */
#define NT_VMCOREDD         0x700       /* Vmcore Device Dump Note */
#define NT_MIPS_DSP         0x800       /* MIPS DSP ASE registers */
#define NT_MIPS_FP_MODE     0x801       /* MIPS floating-point mode */

"""


def copy_cstruct(src_struct: cstruct) -> cstruct:
    dst_struct = cstruct()
    dst_struct.consts = src_struct.consts.copy()
    dst_struct.typedefs = src_struct.typedefs.copy()
    dst_struct.lookups = src_struct.lookups.copy()
    return dst_struct


c_common_elf = cstruct().load(elf_def)
c_elf_32 = copy_cstruct(c_common_elf).load(elf_32_def)
c_elf_64 = copy_cstruct(c_common_elf).load(elf_64_def)

PT: IntEnum = c_common_elf.PT
Elf_Type: IntEnum = c_common_elf.Elf_Type
STB: IntEnum = c_common_elf.STB
STT: IntEnum = c_common_elf.STT
STV: IntEnum = c_common_elf.STV
PF: Flag = c_common_elf.PF
SHN: IntEnum = c_common_elf.SHN
SHT: IntEnum = c_common_elf.SHT
