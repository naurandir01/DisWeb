from dissect.cstruct import cstruct

qnx6_def = """
typedef __u16 __fs16;
typedef __u32 __fs32;
typedef __u64 __fs64;

#define QNX4_SUPER_MAGIC            0x002f
#define QNX6_SUPER_MAGIC            0x68191122

#define QNX6_ROOT_INO               1

/* for di_status */
#define QNX6_FILE_DIRECTORY         0x01
#define QNX6_FILE_DELETED           0x02
#define QNX6_FILE_NORMAL            0x03

#define QNX6_SUPERBLOCK_SIZE        0x200       /* superblock always is 512 bytes */
#define QNX6_SUPERBLOCK_AREA        0x1000      /* area reserved for superblock */
#define QNX6_BOOTBLOCK_SIZE         0x2000      /* heading bootblock area */
#define QNX6_DIR_ENTRY_SIZE         0x20        /* dir entry size of 32 bytes */
#define QNX6_INODE_SIZE             0x80        /* each inode is 128 bytes */
#define QNX6_INODE_SIZE_BITS        7           /* inode entry size shift */

#define QNX6_NO_DIRECT_POINTERS     16          /* 16 blockptrs in sbl/inode */
#define QNX6_PTR_MAX_LEVELS         5           /* maximum indirect levels */

/* for filenames */
#define QNX6_SHORT_NAME_MAX         27
#define QNX6_LONG_NAME_MAX          510

/* list of mount options */
#define QNX6_MOUNT_MMI_FS           0x010000    /* mount as Audi MMI 3G fs */

/*
 * This is the original qnx6 inode layout on disk.
 * Each inode is 128 byte long.
 */
struct qnx6_inode_entry {
    __fs64  di_size;
    __fs32  di_uid;
    __fs32  di_gid;
    __fs32  di_ftime;
    __fs32  di_mtime;
    __fs32  di_atime;
    __fs32  di_ctime;
    __fs16  di_mode;
    __fs16  di_ext_mode;
    __fs32  di_block_ptr[QNX6_NO_DIRECT_POINTERS];
    __u8    di_filelevels;
    __u8    di_status;
    char    di_unknown2[2];
    char    di_zero2[24];
};

/*
 * Each directory entry is maximum 32 bytes long.
 * If more characters or special characters required it is stored
 * in the longfilenames structure.
 */
struct qnx6_dir_entry {
    __fs32  de_inode;
    __u8    de_size;
    char    de_fname[QNX6_SHORT_NAME_MAX];
};

/*
 * Longfilename direntries have a different structure
 */
struct qnx6_long_dir_entry {
    __fs32  de_inode;
    __u8    de_size;
    char    de_unknown[3];
    __fs32  de_long_inode;
    __fs32  de_checksum;
};

struct qnx6_long_filename {
    __fs16  lf_size;
    char    lf_fname[QNX6_LONG_NAME_MAX];
};

struct qnx6_root_node {
    __fs64  size;
    __fs32  ptr[QNX6_NO_DIRECT_POINTERS];
    __u8    levels;
    __u8    mode;
    char    spare[6];
};

struct qnx6_super_block {
    __fs32  sb_magic;
    __fs32  sb_checksum;
    __fs64  sb_serial;
    __fs32  sb_ctime;                           /* time the fs was created */
    __fs32  sb_atime;                           /* last access time */
    __fs32  sb_flags;
    __fs16  sb_version1;                        /* filesystem version information */
    __fs16  sb_version2;                        /* filesystem version information */
    char    sb_volumeid[16];
    __fs32  sb_blocksize;
    __fs32  sb_num_inodes;
    __fs32  sb_free_inodes;
    __fs32  sb_num_blocks;
    __fs32  sb_free_blocks;
    __fs32  sb_allocgroup;
    struct qnx6_root_node   Inode;
    struct qnx6_root_node   Bitmap;
    struct qnx6_root_node   Longfile;
    struct qnx6_root_node   Unknown;
};

/* Audi MMI 3G superblock layout is different to plain qnx6 */
struct qnx6_mmi_super_block {
    __fs32  sb_magic;
    __fs32  sb_checksum;
    __fs64  sb_serial;
    char    sb_spare0[12];
    char    sb_id[12];
    __fs32  sb_blocksize;
    __fs32  sb_num_inodes;
    __fs32  sb_free_inodes;
    __fs32  sb_num_blocks;
    __fs32  sb_free_blocks;
    char    sb_spare1[4];
    struct qnx6_root_node   Inode;
    struct qnx6_root_node   Bitmap;
    struct qnx6_root_node   Longfile;
    struct qnx6_root_node   Unknown;
};
"""


c_qnx6_le = cstruct().load(qnx6_def)
c_qnx6_be = cstruct(endian=">").load(qnx6_def)

c_qnx6 = c_qnx6_le
