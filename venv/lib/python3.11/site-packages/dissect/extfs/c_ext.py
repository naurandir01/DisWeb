from __future__ import annotations

import stat

from dissect.cstruct import cstruct

ext_def = """
#define EXT2_SBOFF              1024        // offset to superblock
#define EXT2_FS_MAGIC           0xef53

#define EXT2_BAD_INO            1           // Bad blocks inode
#define EXT2_ROOT_INO           2           // Root inode
#define EXT4_USR_QUOTA_INO      3           // User quota inode
#define EXT4_GRP_QUOTA_INO      4           // Group quota inode
#define EXT2_BOOT_LOADER_INO    5           // Boot loader inode
#define EXT2_UNDEL_DIR_INO      6           // Undelete directory inode
#define EXT2_RESIZE_INO         7           // Reserved group descriptors inode
#define EXT2_JOURNAL_INO        8           // Journal inode

#define EXT2_NDIR_BLOCKS        12          // direct blocks in inode
#define EXT2_NIND_BLOCKS        3           // indirect blocks in inode

#define EXT2_NAME_LEN           255
#define EXT2_MIN_BLOCK_SIZE     1024
#define EXT2_MAX_BLOCK_SIZE     4096
#define EXT4_MAX_BLOCK_SIZE     65536

#define EXT2_FEATURE_COMPAT_DIR_PREALLOC        0x0001
#define EXT2_FEATURE_COMPAT_IMAGIC_INODES       0x0002
#define EXT3_FEATURE_COMPAT_HAS_JOURNAL         0x0004
#define EXT2_FEATURE_COMPAT_EXT_ATTR            0x0008
#define EXT2_FEATURE_COMPAT_RESIZE_INODE        0x0010
#define EXT2_FEATURE_COMPAT_DIR_INDEX           0x0020
#define EXT4_FEATURE_COMPAT_SPARSE_SUPER2       0x0200

#define EXT2_FEATURE_RO_COMPAT_SPARSE_SUPER     0x0001
#define EXT2_FEATURE_RO_COMPAT_LARGE_FILE       0x0002
#define EXT2_FEATURE_RO_COMPAT_BTREE_DIR        0x0004
#define EXT2_FEATURE_RO_COMPAT_HUGE_FILE        0x0008
#define EXT4_FEATURE_RO_COMPAT_GDT_CSUM         0x0010
#define EXT4_FEATURE_RO_COMPAT_DIR_NLINK        0x0020
#define EXT4_FEATURE_RO_COMPAT_EXTRA_ISIZE      0x0040
#define EXT4_FEATURE_RO_COMPAT_QUOTA            0x0100
#define EXT4_FEATURE_RO_COMPAT_BIGALLOC         0x0200
#define EXT4_FEATURE_RO_COMPAT_METADATA_CSUM    0x0400
#define EXT4_FEATURE_RO_COMPAT_READONLY         0x1000
#define EXT4_FEATURE_RO_COMPAT_PROJECT          0x2000

#define EXT2_FEATURE_INCOMPAT_COMPRESSION       0x0001
#define EXT2_FEATURE_INCOMPAT_FILETYPE          0x0002
#define EXT3_FEATURE_INCOMPAT_RECOVER           0x0004
#define EXT3_FEATURE_INCOMPAT_JOURNAL_DEV       0x0008
#define EXT2_FEATURE_INCOMPAT_META_BG           0x0010
#define EXT4_FEATURE_INCOMPAT_EXTENTS           0x0040
#define EXT4_FEATURE_INCOMPAT_64BIT             0x0080
#define EXT4_FEATURE_INCOMPAT_MMP               0x0100
#define EXT4_FEATURE_INCOMPAT_FLEX_BG           0x0200
#define EXT4_FEATURE_INCOMPAT_EA_INODE          0x0400
#define EXT4_FEATURE_INCOMPAT_DIRDATA           0x1000
#define EXT4_FEATURE_INCOMPAT_CSUM_SEED         0x2000
#define EXT4_FEATURE_INCOMPAT_LARGEDIR          0x4000
#define EXT4_FEATURE_INCOMPAT_INLINE_DATA       0x8000          // data in inode
#define EXT4_FEATURE_INCOMPAT_ENCRYPT           0x10000         // >2GB or 3-lvl htree

#define EXT2_FT_FMT                             0x0000F000
#define EXT2_FT_SOCK                            0x0000C000
#define EXT2_FT_LNK                             0x0000A000
#define EXT2_FT_REG                             0x00008000
#define EXT2_FT_BLK                             0x00006000
#define EXT2_FT_DIR                             0x00004000
#define EXT2_FT_CHR                             0x00002000
#define EXT2_FT_FIFO                            0x00001000

#define EXT2_SECRM_FL                           0x00000001      // Secure deletion
#define EXT2_UNRM_FL                            0x00000002      // Undelete
#define EXT2_COMPR_FL                           0x00000004      // Compress file
#define EXT2_SYNC_FL                            0x00000008      // Synchronous updates
#define EXT2_IMMUTABLE_FL                       0x00000010      // Immutable file
#define EXT2_APPEND_FL                          0x00000020      // writes to file may only append
#define EXT2_NODUMP_FL                          0x00000040      // do not dump file
#define EXT2_NOATIME_FL                         0x00000080      // do not update atime
#define EXT2_DIRTY_FL                           0x00000100
#define EXT2_COMPRBLK_FL                        0x00000200      // One or more compressed clusters
#define EXT2_NOCOMP_FL                          0x00000400      // Don't compress
#define EXT2_ECOMPR_FL                          0x00000800      // Compression error
#define EXT4_ENCRYPT_FL                         0x00000800      // encrypted file
#define EXT2_BTREE_FL                           0x00001000      // btree format dir
#define EXT4_INDEX_FL                           0x00001000      // hash-indexed directory
#define EXT2_IMAGIC_FL                          0x00002000      // AFS directory
#define EXT2_JOURNAL_DATA_FL                    0x00004000      // file data should be journaled
#define EXT2_NOTAIL_FL                          0x00008000      // file tail should not be merged
#define EXT2_DIRSYNC_FL                         0x00010000      // dirsync behaviour (directories only)
#define EXT2_TOPDIR_FL                          0x00020000      // Top of directory hierarchies
#define EXT4_HUGE_FILE_FL                       0x00040000      // Set to each huge file
#define EXT4_EXTENTS_FL                         0x00080000      // Inode uses extents
#define EXT4_EA_INODE_FL                        0x00200000      // Inode used for large EA
#define EXT4_EOFBLOCKS_FL                       0x00400000      // Blocks allocated beyond EOF
#define EXT4_INLINE_DATA_FL                     0x10000000      // Inode has inline data.
#define EXT4_PROJINHERIT_FL                     0x20000000      // Create with parents projid
#define EXT2_RESERVED_FL                        0x80000000      // reserved

#define EXT2_FL_USER_VISIBLE                    0x304BDFFF      // User visible flags
#define EXT2_FL_USER_MODIFIABLE                 0x204BC0FF      // User modifiable flags

struct ext4_super_block {
    uint32      s_inodes_count;             /* Inodes count */
    uint32      s_blocks_count_lo;          /* Blocks count */
    uint32      s_r_blocks_count_lo;        /* Reserved blocks count */
    uint32      s_free_blocks_count_lo;     /* Free blocks count */
    uint32      s_free_inodes_count;        /* Free inodes count */
    uint32      s_first_data_block;         /* First Data Block */
    uint32      s_log_block_size;           /* Block size */
    uint32      s_log_cluster_size;         /* Allocation cluster size */
    uint32      s_blocks_per_group;         /* # Blocks per group */
    uint32      s_clusters_per_group;       /* # Clusters per group */
    uint32      s_inodes_per_group;         /* # Inodes per group */
    uint32      s_mtime;                    /* Mount time */
    uint32      s_wtime;                    /* Write time */
    uint16      s_mnt_count;                /* Mount count */
    uint16      s_max_mnt_count;            /* Maximal mount count */
    uint16      s_magic;                    /* Magic signature */
    uint16      s_state;                    /* File system state */
    uint16      s_errors;                   /* Behaviour when detecting errors */
    uint16      s_minor_rev_level;          /* minor revision level */
    uint32      s_lastcheck;                /* time of last check */
    uint32      s_checkinterval;            /* max. time between checks */
    uint32      s_creator_os;               /* OS */
    uint32      s_rev_level;                /* Revision level */
    uint16      s_def_resuid;               /* Default uid for reserved blocks */
    uint16      s_def_resgid;               /* Default gid for reserved blocks */
    uint32      s_first_ino;                /* First non-reserved inode */
    uint16      s_inode_size;               /* size of inode structure */
    uint16      s_block_group_nr;           /* block group # of this superblock */
    uint32      s_feature_compat;           /* compatible feature set */
    uint32      s_feature_incompat;         /* incompatible feature set */
    uint32      s_feature_ro_compat;        /* readonly-compatible feature set */
    char        s_uuid[16];                 /* 128-bit uuid for volume */
    char        s_volume_name[16];          /* volume name */
    char        s_last_mounted[64];         /* directory where last mounted */
    uint32      s_algorithm_usage_bitmap;   /* For compression */
    uint8       s_prealloc_blocks;          /* Nr of blocks to try to preallocate*/
    uint8       s_prealloc_dir_blocks;      /* Nr to preallocate for dirs */
    uint16      s_reserved_gdt_blocks;      /* Per group desc for online growth */
    // Journaling support valid if EXT4_FEATURE_COMPAT_HAS_JOURNAL set.
    char        s_journal_uuid[16];         /* uuid of journal superblock */
    uint32      s_journal_inum;             /* inode number of journal file */
    uint32      s_journal_dev;              /* device number of journal file */
    uint32      s_last_orphan;              /* start of list of inodes to delete */
    char        s_hash_seed[16];            /* HTREE hash seed */
    uint8       s_def_hash_version;         /* Default hash version to use */
    uint8       s_jnl_backup_type;
    uint16      s_desc_size;                /* size of group descriptor */
    uint32      s_default_mount_opts;
    uint32      s_first_meta_bg;            /* First metablock block group */
    uint32      s_mkfs_time;                /* When the filesystem was created */
    uint32      s_jnl_blocks[17];           /* Backup of the journal inode */
    // 64bit support valid if EXT4_FEATURE_COMPAT_64BIT
    uint32      s_blocks_count_hi;          /* Blocks count */
    uint32      s_r_blocks_count_hi;        /* Reserved blocks count */
    uint32      s_free_blocks_count_hi;     /* Free blocks count */
    uint16      s_min_extra_isize;          /* All inodes have at least # bytes */
    uint16      s_want_extra_isize;         /* New inodes should reserve # bytes */
    uint32      s_flags;                    /* Miscellaneous flags */
    uint16      s_raid_stride;              /* RAID stride */
    uint16      s_mmp_update_interval;      /* # seconds to wait in MMP checking */
    uint64      s_mmp_block;                /* Block for multi-mount protection */
    uint32      s_raid_stripe_width;        /* blocks on all data disks (N*stride)*/
    uint8       s_log_groups_per_flex;      /* FLEX_BG group size */
    uint8       s_checksum_type;            /* metadata checksum algorithm used */
    uint8       s_encryption_level;         /* versioning level for encryption */
    uint8       s_reserved_pad;             /* Padding to next 32bits */
    uint64      s_kbytes_written;           /* nr of lifetime kilobytes written */
    uint32      s_snapshot_inum;            /* Inode number of active snapshot */
    uint32      s_snapshot_id;              /* sequential ID of active snapshot */
    uint64      s_snapshot_r_blocks_count;  /* reserved blocks for active snapshot's future use */
    uint32      s_snapshot_list;            /* inode number of the head of the on-disk snapshot list */
    uint32      s_error_count;              /* number of fs errors */
    uint32      s_first_error_time;         /* first time an error happened */
    uint32      s_first_error_ino;          /* inode involved in first error */
    uint64      s_first_error_block;        /* block involved of first error */
    uint8       s_first_error_func[32];     /* function where the error happened */
    uint32      s_first_error_line;         /* line number where error happened */
    uint32      s_last_error_time;          /* most recent time of an error */
    uint32      s_last_error_ino;           /* inode involved in last error */
    uint32      s_last_error_line;          /* line number where error happened */
    uint64      s_last_error_block;         /* block involved of last error */
    uint8       s_last_error_func[32];      /* function where the error happened */
    uint8       s_mount_opts[64];
    uint32      s_usr_quota_inum;           /* inode for tracking user quota */
    uint32      s_grp_quota_inum;           /* inode for tracking group quota */
    uint32      s_overhead_clusters;        /* overhead blocks/clusters in fs */
    uint32      s_backup_bgs[2];            /* groups with sparse_super2 SBs */
    uint8       s_encrypt_algos[4];         /* Encryption algorithms in use  */
    uint8       s_encrypt_pw_salt[16];      /* Salt used for string2key algorithm */
    uint32      s_lpf_ino;                  /* Location of the lost+found inode */
    uint32      s_prj_quota_inum;           /* inode for tracking project quota */
    uint32      s_checksum_seed;            /* crc32c(uuid) if csum_seed set */
    uint32      s_reserved[98];             /* Padding to the end of the block */
    uint32      s_checksum;                 /* crc32c(superblock) */
};

struct ext2_group_desc
{
    uint32      bg_block_bitmap_lo;         /* Blocks bitmap block */
    uint32      bg_inode_bitmap_lo;         /* Inodes bitmap block */
    uint32      bg_inode_table_lo;          /* Inodes table block */
    uint16      bg_free_blocks_count_lo;    /* Free blocks count */
    uint16      bg_free_inodes_count_lo;    /* Free inodes count */
    uint16      bg_used_dirs_count_lo;      /* Directories count */
    uint16      bg_pad;
    uint32      bg_reserved[3];
};

struct ext4_group_desc
{
    uint32      bg_block_bitmap_lo;         /* Blocks bitmap block */
    uint32      bg_inode_bitmap_lo;         /* Inodes bitmap block */
    uint32      bg_inode_table_lo;          /* Inodes table block */
    uint16      bg_free_blocks_count_lo;    /* Free blocks count */
    uint16      bg_free_inodes_count_lo;    /* Free inodes count */
    uint16      bg_used_dirs_count_lo;      /* Directories count */
    uint16      bg_flags;                   /* EXT4_BG_flags (INODE_UNINIT, etc) */
    uint32      bg_exclude_bitmap_lo;       /* Exclude bitmap for snapshots */
    uint16      bg_block_bitmap_csum_lo;    /* crc32c(s_uuid+grp_num+bbitmap) LE */
    uint16      bg_inode_bitmap_csum_lo;    /* crc32c(s_uuid+grp_num+ibitmap) LE */
    uint16      bg_itable_unused_lo;        /* Unused inodes count */
    uint16      bg_checksum;                /* crc16(sb_uuid+group+desc) */
    uint32      bg_block_bitmap_hi;         /* Blocks bitmap block MSB */
    uint32      bg_inode_bitmap_hi;         /* Inodes bitmap block MSB */
    uint32      bg_inode_table_hi;          /* Inodes table block MSB */
    uint16      bg_free_blocks_count_hi;    /* Free blocks count MSB */
    uint16      bg_free_inodes_count_hi;    /* Free inodes count MSB */
    uint16      bg_used_dirs_count_hi;      /* Directories count MSB */
    uint16      bg_itable_unused_hi;        /* Unused inodes count MSB */
    uint32      bg_exclude_bitmap_hi;       /* Exclude bitmap block MSB */
    uint16      bg_block_bitmap_csum_hi;    /* crc32c(s_uuid+grp_num+bbitmap) BE */
    uint16      bg_inode_bitmap_csum_hi;    /* crc32c(s_uuid+grp_num+ibitmap) BE */
    uint32      bg_reserved;
};

struct ext4_inode {
    uint16      i_mode;                     /* File mode */
    uint16      i_uid;                      /* Low 16 bits of Owner Uid */
    uint32      i_size_lo;                  /* Size in bytes */
    uint32      i_atime;                    /* Access time */
    uint32      i_ctime;                    /* Inode Change time */
    uint32      i_mtime;                    /* Modification time */
    uint32      i_dtime;                    /* Deletion Time */
    uint16      i_gid;                      /* Low 16 bits of Group Id */
    uint16      i_links_count;              /* Links count */
    uint32      i_blocks_lo;                /* Blocks count */
    uint32      i_flags;                    /* File flags */
    uint32      i_reserved_1;
    char        i_block[60];                /* Pointers to blocks */
    uint32      i_generation;               /* File version (for NFS) */
    uint32      i_file_acl_lo;              /* File ACL */
    uint32      i_size_high;
    uint32      i_obso_faddr;               /* Obsoleted fragment address */
    uint16      i_blocks_high;              /* were l_i_reserved1 */
    uint16      i_file_acl_high;
    uint16      i_uid_high;                 /* these 2 fields */
    uint16      i_gid_high;                 /* were reserved2[0] */
    uint16      i_checksum_lo;              /* crc32c(uuid+inum+inode) LE */
    uint16      i_reserved;
    uint16      i_extra_isize;
    uint16      i_checksum_hi;              /* crc32c(uuid+inum+inode) BE */
    uint32      i_ctime_extra;              /* extra Change time       (nsec << 2 | epoch) */
    uint32      i_mtime_extra;              /* extra Modification time (nsec << 2 | epoch) */
    uint32      i_atime_extra;              /* extra Access time       (nsec << 2 | epoch) */
    uint32      i_crtime;                   /* File Creation time */
    uint32      i_crtime_extra;             /* extra FileCreationtime  (nsec << 2 | epoch) */
    uint32      i_version_hi;               /* high 32 bits for 64-bit version */
    uint32      i_projid;                   /* Project ID */
    char        i_extra[256 - 128 - i_extra_isize];
};

struct ext2_dir_entry {
    uint32      inode;                      /* Inode number */
    uint16      rec_len;                    /* Directory entry length */
    uint16      name_len;                   /* Name length */
    char        name[0];                    /* File name */
};

struct ext2_dir_entry_2 {
    uint32      inode;                      /* Inode number */
    uint16      rec_len;                    /* Directory entry length */
    uint8       name_len;                   /* Name length */
    uint8       file_type;
    char        name[0];                    /* File name */
};

struct ext4_dir_entry_tail {
    uint32      det_reserved_zero1;         /* Pretend to be unused */
    uint16      det_rec_len;                /* 12 */
    uint8       det_reserved_zero2;         /* Zero name length */
    uint8       det_reserved_ft;            /* 0xDE, fake file type */
    uint32      det_checksum;               /* crc32c(uuid+inum+dirblock) */
};

struct dx_root {
    ext2_dir_entry_2    dot;
    char                _pad0[3];
    ext2_dir_entry_2    dotdot;
    char                _pad1[2];
    uint32              reserved_zero;
    uint8               hash_version;
    uint8               info_length;
    uint8               indirect_levels;
    uint8               unused_flags;
    uint16              limit;
    uint16              count;
    uint32              block;
};

struct dx_node {
    ext2_dir_entry_2    fake_direntry;
    uint16              limit;
    uint16              count;
    int32               block;
};

struct dx_entry
{
    uint32 hash;
    uint32 block;
};

struct ext4_extent_header {
    uint16      eh_magic;                   /* probably will support different formats */
    uint16      eh_entries;                 /* number of valid entries */
    uint16      eh_max;                     /* capacity of store in entries */
    uint16      eh_depth;                   /* has tree real underlying blocks? */
    uint32      eh_generation;              /* generation of the tree */
};

struct ext4_extent_idx {
    uint32      ei_block;                   /* index covers logical blocks from 'block' */
    uint32      ei_leaf_lo;                 /* pointer to the physical block of the next level. */
                                            /* leaf or next index could be there */
    uint16      ei_leaf_hi;                 /* high 16 bits of physical block */
    uint16      ei_unused;
};

struct ext4_extent {
    uint32      ee_block;                   /* first logical block extent covers */
    uint16      ee_len;                     /* number of blocks covered by extent */
    uint16      ee_start_hi;                /* high 16 bits of physical block */
    uint32      ee_start_lo;                /* low 32 bits of physical block */
};

#define EXT4_XATTR_MAGIC                    0xEA020000

/* Name indexes */
#define EXT4_XATTR_INDEX_USER               1
#define EXT4_XATTR_INDEX_POSIX_ACL_ACCESS   2
#define EXT4_XATTR_INDEX_POSIX_ACL_DEFAULT  3
#define EXT4_XATTR_INDEX_TRUSTED            4
#define EXT4_XATTR_INDEX_LUSTRE             5
#define EXT4_XATTR_INDEX_SECURITY           6
#define EXT4_XATTR_INDEX_SYSTEM             7
#define EXT4_XATTR_INDEX_RICHACL            8
#define EXT4_XATTR_INDEX_ENCRYPTION         9
#define EXT4_XATTR_INDEX_HURD               10  /* Reserved for Hurd */

#define XATTR_HURD_PREFIX                   "gnu."
#define XATTR_SECURITY_PREFIX               "security."
#define XATTR_SYSTEM_PREFIX                 "system."
#define XATTR_TRUSTED_PREFIX                "trusted."
#define XATTR_USER_PREFIX                   "user."
#define XATTR_POSIX_ACL_ACCESS              "posix_acl_access"
#define XATTR_POSIX_ACL_DEFAULT             "posix_acl_default"

#define EXT4_XATTR_PAD_BITS                 2
#define EXT4_XATTR_PAD                      (1<<EXT4_XATTR_PAD_BITS)
#define EXT4_XATTR_ROUND                    (EXT4_XATTR_PAD-1)

struct ext4_xattr_header {
    uint32      h_magic;                    /* magic number for identification */
    uint32      h_refcount;                 /* reference count */
    uint32      h_blocks;                   /* number of disk blocks used */
    uint32      h_hash;                     /* hash value of all attributes */
    uint32      h_checksum;                 /* crc32c(uuid+id+xattrblock) */
                                            /* id = inum if refcount=1, blknum otherwise */
    uint32      h_reserved[3];              /* zero right now */
};

struct ext4_xattr_ibody_header {
    uint32      h_magic;                    /* magic number for identification */
};

struct ext4_xattr_entry {
    uint8       e_name_len;                 /* length of name */
    uint8       e_name_index;               /* attribute name index */
    uint16      e_value_offs;               /* offset in disk block of value */
    uint32      e_value_inum;               /* inode in which the value is stored */
    uint32      e_value_size;               /* size of attribute value */
    uint32      e_hash;                     /* hash value of name and value */
    char        e_name[e_name_len];         /* attribute name */
};
"""

c_ext = cstruct().load(ext_def)

EXT2 = 2
EXT3 = 3
EXT4 = 4

# Filetypes used in v2 directory listings
FILETYPES = {
    0x1: stat.S_IFREG,
    0x2: stat.S_IFDIR,
    0x3: stat.S_IFCHR,
    0x4: stat.S_IFBLK,
    0x5: stat.S_IFIFO,
    0x6: stat.S_IFSOCK,
    0x7: stat.S_IFLNK,
}


XATTR_PREFIX_MAP = {
    c_ext.EXT4_XATTR_INDEX_USER: c_ext.XATTR_USER_PREFIX,
    c_ext.EXT4_XATTR_INDEX_POSIX_ACL_ACCESS: c_ext.XATTR_SYSTEM_PREFIX,
    c_ext.EXT4_XATTR_INDEX_POSIX_ACL_DEFAULT: c_ext.XATTR_SYSTEM_PREFIX,
    c_ext.EXT4_XATTR_INDEX_TRUSTED: c_ext.XATTR_TRUSTED_PREFIX,
    c_ext.EXT4_XATTR_INDEX_SECURITY: c_ext.XATTR_SECURITY_PREFIX,
    c_ext.EXT4_XATTR_INDEX_SYSTEM: c_ext.XATTR_SYSTEM_PREFIX,
}

XATTR_NAME_MAP = {
    c_ext.EXT4_XATTR_INDEX_POSIX_ACL_ACCESS: c_ext.XATTR_POSIX_ACL_ACCESS,
    c_ext.EXT4_XATTR_INDEX_POSIX_ACL_DEFAULT: c_ext.XATTR_POSIX_ACL_DEFAULT,
}
