import stat

from dissect.cstruct import cstruct

xfs_def = """
typedef uint64 xfs_ino_t;                               /* <inode> type */

typedef uint32 xfs_agblock_t;                           /* blockno in alloc. group */
typedef uint32 xfs_extlen_t;                            /* extent length in blocks */
typedef uint32 xfs_agnumber_t;                          /* allocation group number */

typedef int64  xfs_lsn_t;                               /* log sequence number */

typedef uint64 xfs_fsblock_t;                           /* blockno in filesystem (agno|agbno) */
typedef uint64 xfs_rfsblock_t;                          /* blockno in filesystem (raw) */
typedef uint64 xfs_rtblock_t;                           /* extent (block) in realtime area */


#define XFS_SB_MAGIC                        0x58465342  /* 'XFSB' */
#define XFS_SB_VERSION_1                    1           /* 5.3, 6.0.1, 6.1 */
#define XFS_SB_VERSION_2                    2           /* 6.2 - attributes */
#define XFS_SB_VERSION_3                    3           /* 6.2 - new inode version */
#define XFS_SB_VERSION_4                    4           /* 6.2+ - bitmask version */
#define XFS_SB_VERSION_5                    5           /* CRC enabled filesystem */
#define XFS_SB_VERSION_NUMBITS              0x000f
#define XFS_SB_VERSION_ALLFBITS             0xfff0
#define XFS_SB_VERSION_ATTRBIT              0x0010
#define XFS_SB_VERSION_NLINKBIT             0x0020
#define XFS_SB_VERSION_QUOTABIT             0x0040
#define XFS_SB_VERSION_ALIGNBIT             0x0080
#define XFS_SB_VERSION_DALIGNBIT            0x0100
#define XFS_SB_VERSION_SHAREDBIT            0x0200
#define XFS_SB_VERSION_LOGV2BIT             0x0400
#define XFS_SB_VERSION_SECTORBIT            0x0800
#define XFS_SB_VERSION_EXTFLGBIT            0x1000
#define XFS_SB_VERSION_DIRV2BIT             0x2000
#define XFS_SB_VERSION_BORGBIT              0x4000      /* ASCII only case-insens. */
#define XFS_SB_VERSION_MOREBITSBIT          0x8000

#define XFS_SB_VERSION2_RESERVED1BIT        0x00000001
#define XFS_SB_VERSION2_LAZYSBCOUNTBIT      0x00000002  /* Superblk counters */
#define XFS_SB_VERSION2_RESERVED4BIT        0x00000004
#define XFS_SB_VERSION2_ATTR2BIT            0x00000008  /* Inline attr rework */
#define XFS_SB_VERSION2_PARENTBIT           0x00000010  /* parent pointers */
#define XFS_SB_VERSION2_PROJID32BIT         0x00000080  /* 32 bit project id */
#define XFS_SB_VERSION2_CRCBIT              0x00000100  /* metadata CRCs */
#define XFS_SB_VERSION2_FTYPE               0x00000200  /* inode type in dir */

/* Maximum size of the xfs filesystem label, no terminating NULL */
#define XFSLABEL_MAX                        12

typedef struct xfs_sb {
    uint32_t        sb_magicnum;                        /* magic number == XFS_SB_MAGIC */
    uint32_t        sb_blocksize;                       /* logical block size, bytes */
    xfs_rfsblock_t  sb_dblocks;                         /* number of data blocks */
    xfs_rfsblock_t  sb_rblocks;                         /* number of realtime blocks */
    xfs_rtblock_t   sb_rextents;                        /* number of realtime extents */
    char            sb_uuid[16];                        /* user-visible file system unique id */
    xfs_fsblock_t   sb_logstart;                        /* starting block of log if internal */
    xfs_ino_t       sb_rootino;                         /* root inode number */
    xfs_ino_t       sb_rbmino;                          /* bitmap inode for realtime extents */
    xfs_ino_t       sb_rsumino;                         /* summary inode for rt bitmap */
    xfs_agblock_t   sb_rextsize;                        /* realtime extent size, blocks */
    xfs_agblock_t   sb_agblocks;                        /* size of an allocation group */
    xfs_agnumber_t  sb_agcount;                         /* number of allocation groups */
    xfs_extlen_t    sb_rbmblocks;                       /* number of rt bitmap blocks */
    xfs_extlen_t    sb_logblocks;                       /* number of log blocks */
    uint16_t        sb_versionnum;                      /* header version == XFS_SB_VERSION */
    uint16_t        sb_sectsize;                        /* volume sector size, bytes */
    uint16_t        sb_inodesize;                       /* inode size, bytes */
    uint16_t        sb_inopblock;                       /* inodes per block */
    char            sb_fname[XFSLABEL_MAX];             /* file system name */
    uint8_t         sb_blocklog;                        /* log2 of sb_blocksize */
    uint8_t         sb_sectlog;                         /* log2 of sb_sectsize */
    uint8_t         sb_inodelog;                        /* log2 of sb_inodesize */
    uint8_t         sb_inopblog;                        /* log2 of sb_inopblock */
    uint8_t         sb_agblklog;                        /* log2 of sb_agblocks (rounded up) */
    uint8_t         sb_rextslog;                        /* log2 of sb_rextents */
    uint8_t         sb_inprogress;                      /* mkfs is in progress, don't mount */
    uint8_t         sb_imax_pct;                        /* max percentage of fs for inode space statistics */
    /*
     * These fields must remain contiguous.  If you really
     * want to change their layout, make sure you fix the
     * code in xfs_trans_apply_sb_deltas().
     */
    uint64_t        sb_icount;                          /* allocated inodes */
    uint64_t        sb_ifree;                           /* free inodes */
    uint64_t        sb_fdblocks;                        /* free data blocks */
    uint64_t        sb_frextents;                       /* free realtime extents */
    /*
     * End contiguous fields.
     */
    xfs_ino_t       sb_uquotino;                        /* user quota inode */
    xfs_ino_t       sb_gquotino;                        /* group quota inode */
    uint16_t        sb_qflags;                          /* quota flags */
    uint8_t         sb_flags;                           /* misc. flags */
    uint8_t         sb_shared_vn;                       /* shared version number */
    xfs_extlen_t    sb_inoalignmt;                      /* inode chunk alignment, fsblocks */
    uint32_t        sb_unit;                            /* stripe or raid unit */
    uint32_t        sb_width;                           /* stripe or raid width */
    uint8_t         sb_dirblklog;                       /* log2 of dir block size (fsbs) */
    uint8_t         sb_logsectlog;                      /* log2 of the log sector size */
    uint16_t        sb_logsectsize;                     /* sector size for the log, bytes */
    uint32_t        sb_logsunit;                        /* stripe unit size for the log */
    uint32_t        sb_features2;                       /* additional feature bits */

    /*
     * bad features2 field as a result of failing to pad the sb structure to
     * 64 bits. Some machines will be using this field for features2 bits.
     * Easiest just to mark it bad and not use it for anything else.
     *
     * This is not kept up to date in memory; it is always overwritten by
     * the value in sb_features2 when formatting the incore superblock to
     * the disk buffer.
     */
    uint32_t        sb_bad_features2;

    /* version 5 superblock fields start here */

    /* feature masks */
    uint32_t        sb_features_compat;
    uint32_t        sb_features_ro_compat;
    uint32_t        sb_features_incompat;
    uint32_t        sb_features_log_incompat;

    uint32_t        sb_crc;                             /* superblock crc */
    xfs_extlen_t    sb_spino_align;                     /* sparse inode chunk alignment */

    xfs_ino_t       sb_pquotino;                        /* project quota inode */
    xfs_lsn_t       sb_lsn;                             /* last write sequence */
    char            sb_meta_uuid[16];                   /* metadata file system unique id */
} xfs_sb_t;

#define XFS_SB_FEAT_INCOMPAT_FTYPE          (1 << 0)    /* filetype in dirent */
#define XFS_SB_FEAT_INCOMPAT_SPINODES       (1 << 1)    /* sparse inode chunks */
#define XFS_SB_FEAT_INCOMPAT_META_UUID      (1 << 2)    /* metadata UUID */
#define XFS_SB_FEAT_INCOMPAT_BIGTIME        (1 << 3)    /* large timestamps */
#define XFS_SB_FEAT_INCOMPAT_NEEDSREPAIR    (1 << 4)    /* needs xfs_repair */
#define XFS_SB_FEAT_INCOMPAT_NREXT64        (1 << 5)    /* large extent counters */


#define XFS_AGF_MAGIC                       0x58414746  /* 'XAGF' */
#define XFS_AGI_MAGIC                       0x58414749  /* 'XAGI' */
#define XFS_AGFL_MAGIC                      0x5841464c  /* 'XAFL' */
#define XFS_AGF_VERSION                     1
#define XFS_AGI_VERSION                     1

/*
 * Btree number 0 is bno, 1 is cnt, 2 is rmap. This value gives the size of the
 * arrays below.
 */
#define XFS_BTNUM_AGF                       3

typedef struct xfs_agf {
    /*
     * Common allocation group header information
     */
    uint32_t        agf_magicnum;                       /* magic number == XFS_AGF_MAGIC */
    uint32_t        agf_versionnum;                     /* header version == XFS_AGF_VERSION */
    uint32_t        agf_seqno;                          /* sequence # starting from 0 */
    uint32_t        agf_length;                         /* size in blocks of a.g. */
    /*
     * Freespace and rmap information
     */
    uint32_t        agf_roots[XFS_BTNUM_AGF];           /* root blocks */
    uint32_t        agf_levels[XFS_BTNUM_AGF];          /* btree levels */

    uint32_t        agf_flfirst;                        /* first freelist block's index */
    uint32_t        agf_fllast;                         /* last freelist block's index */
    uint32_t        agf_flcount;                        /* count of blocks in freelist */
    uint32_t        agf_freeblks;                       /* total free blocks */

    uint32_t        agf_longest;                        /* longest free space */
    uint32_t        agf_btreeblks;                      /* # of blocks held in AGF btrees */
    char            agf_uuid[16];                       /* uuid of filesystem */

    uint32_t        agf_rmap_blocks;                    /* rmapbt blocks used */
    uint32_t        agf_refcount_blocks;                /* refcountbt blocks used */

    uint32_t        agf_refcount_root;                  /* refcount tree root block */
    uint32_t        agf_refcount_level;                 /* refcount btree levels */

    /*
     * reserve some contiguous space for future logged fields before we add
     * the unlogged fields. This makes the range logging via flags and
     * structure offsets much simpler.
     */
    uint64_t        agf_spare64[14];

    /* unlogged fields, written during buffer writeback. */
    uint64_t        agf_lsn;                            /* last write sequence */
    uint32_t        agf_crc;                            /* crc of agf sector */
    uint32_t        agf_spare2;

    /* structure must be padded to 64 bit alignment */
} xfs_agf_t;

#define XFS_AGF_MAGICNUM                    (1 << 0)
#define XFS_AGF_VERSIONNUM                  (1 << 1)
#define XFS_AGF_SEQNO                       (1 << 2)
#define XFS_AGF_LENGTH                      (1 << 3)
#define XFS_AGF_ROOTS                       (1 << 4)
#define XFS_AGF_LEVELS                      (1 << 5)
#define XFS_AGF_FLFIRST                     (1 << 6)
#define XFS_AGF_FLLAST                      (1 << 7)
#define XFS_AGF_FLCOUNT                     (1 << 8)
#define XFS_AGF_FREEBLKS                    (1 << 9)
#define XFS_AGF_LONGEST                     (1 << 10)
#define XFS_AGF_BTREEBLKS                   (1 << 11)
#define XFS_AGF_UUID                        (1 << 12)
#define XFS_AGF_RMAP_BLOCKS                 (1 << 13)
#define XFS_AGF_REFCOUNT_BLOCKS             (1 << 14)
#define XFS_AGF_REFCOUNT_ROOT               (1 << 15)
#define XFS_AGF_REFCOUNT_LEVEL              (1 << 16)
#define XFS_AGF_SPARE64                     (1 << 17)
#define XFS_AGF_NUM_BITS                    18
#define XFS_AGF_ALL_BITS                    ((1 << XFS_AGF_NUM_BITS) - 1)


/*
 * Size of the unlinked inode hash table in the agi.
 */
#define XFS_AGI_UNLINKED_BUCKETS            64

typedef struct xfs_agi {
    /*
     * Common allocation group header information
     */
    uint32_t        agi_magicnum;                       /* magic number == XFS_AGI_MAGIC */
    uint32_t        agi_versionnum;                     /* header version == XFS_AGI_VERSION */
    uint32_t        agi_seqno;                          /* sequence # starting from 0 */
    uint32_t        agi_length;                         /* size in blocks of a.g. */
    /*
     * Inode information
     * Inodes are mapped by interpreting the inode number, so no
     * mapping data is needed here.
     */
    uint32_t        agi_count;                          /* count of allocated inodes */
    uint32_t        agi_root;                           /* root of inode btree */
    uint32_t        agi_level;                          /* levels in inode btree */
    uint32_t        agi_freecount;                      /* number of free inodes */

    uint32_t        agi_newino;                         /* new inode just allocated */
    uint32_t        agi_dirino;                         /* last directory inode chunk */
    /*
     * Hash table of inodes which have been unlinked but are
     * still being referenced.
     */
    uint32_t        agi_unlinked[XFS_AGI_UNLINKED_BUCKETS];
    /*
     * This marks the end of logging region 1 and start of logging region 2.
     */
    char            agi_uuid[16];                       /* uuid of filesystem */
    uint32_t        agi_crc;                            /* crc of agi sector */
    uint32_t        agi_pad32;
    uint64_t        agi_lsn;                            /* last write sequence */

    uint32_t        agi_free_root;                      /* root of the free inode btree */
    uint32_t        agi_free_level;                     /* levels in free inode btree */

    uint32_t        agi_iblocks;                        /* inobt blocks used */
    uint32_t        agi_fblocks;                        /* finobt blocks used */

    /* structure must be padded to 64 bit alignment */
} xfs_agi_t;

#define XFS_AGI_MAGICNUM                    (1 << 0)
#define XFS_AGI_VERSIONNUM                  (1 << 1)
#define XFS_AGI_SEQNO                       (1 << 2)
#define XFS_AGI_LENGTH                      (1 << 3)
#define XFS_AGI_COUNT                       (1 << 4)
#define XFS_AGI_ROOT                        (1 << 5)
#define XFS_AGI_LEVEL                       (1 << 6)
#define XFS_AGI_FREECOUNT                   (1 << 7)
#define XFS_AGI_NEWINO                      (1 << 8)
#define XFS_AGI_DIRINO                      (1 << 9)
#define XFS_AGI_UNLINKED                    (1 << 10)
#define XFS_AGI_NUM_BITS_R1                 11          /* end of the 1st agi logging region */
#define XFS_AGI_ALL_BITS_R1                 ((1 << XFS_AGI_NUM_BITS_R1) - 1)
#define XFS_AGI_FREE_ROOT                   (1u << 11)
#define XFS_AGI_FREE_LEVEL                  (1u << 12)
#define XFS_AGI_IBLOCKS                     (1u << 13)  /* both inobt/finobt block counters */
#define XFS_AGI_NUM_BITS_R2                 14


/*
 * XFS Timestamps
 * ==============
 *
 * Traditional ondisk inode timestamps consist of signed 32-bit counters for
 * seconds and nanoseconds; time zero is the Unix epoch, Jan  1 00:00:00 UTC
 * 1970, which means that the timestamp epoch is the same as the Unix epoch.
 * Therefore, the ondisk min and max defined here can be used directly to
 * constrain the incore timestamps on a Unix system.  Note that we actually
 * encode a __be64 value on disk.
 *
 * When the bigtime feature is enabled, ondisk inode timestamps become an
 * unsigned 64-bit nanoseconds counter.  This means that the bigtime inode
 * timestamp epoch is the start of the classic timestamp range, which is
 * Dec 13 20:45:52 UTC 1901.  Because the epochs are not the same, callers
 * /must/ use the bigtime conversion functions when encoding and decoding raw
 * timestamps.
 */

typedef uint64_t xfs_timestamp_t;

struct xfs_legacy_timestamp {
    uint32  t_sec;      /* timestamp seconds */
    uint32  t_nsec;     /* timestamp nanoseconds */
};


/*
 * On-disk inode structure.
 *
 * This is just the header or "dinode core", the inode is expanded to fill a
 * variable size the leftover area split into a data and an attribute fork.
 * The format of the data and attribute fork depends on the format of the
 * inode as indicated by di_format and di_aformat.  To access the data and
 * attribute use the XFS_DFORK_DPTR, XFS_DFORK_APTR, and XFS_DFORK_PTR macros
 * below.
 *
 * There is a very similar struct xfs_log_dinode which matches the layout of
 * this structure, but is kept in native format instead of big endian.
 *
 * Note: di_flushiter is only used by v1/2 inodes - it's effectively a zeroed
 * padding field for v3 inodes.
 */

#define XFS_DINODE_MAGIC                    0x494e      /* 'IN' */
struct xfs_dinode {
    uint16_t        di_magic;                           /* inode magic # = XFS_DINODE_MAGIC */
    uint16_t        di_mode;                            /* mode and type of file */
    uint8_t         di_version;                         /* inode version */
    uint8_t         di_format;                          /* format of di_c data */
    uint16_t        di_onlink;                          /* old number of links to file */
    uint32_t        di_uid;                             /* owner's user id */
    uint32_t        di_gid;                             /* owner's group id */
    uint32_t        di_nlink;                           /* number of links to file */
    uint16_t        di_projid_lo;                       /* lower part of owner's project id */
    uint16_t        di_projid_hi;                       /* higher part owner's project id */

    /*
     * DISSECT: This is a union that we optimize away because cstruct can't compile unions yet.
     *
     * The original fields are:
     *
     *     // Number of data fork extents if NREXT64 is set
     *     __be64   di_big_nextents;
     *
     *     // Padding for V3 inodes without NREXT64 set.
     *     __be64   di_v3_pad;
     *
     *     // Padding and inode flush counter for V2 inodes.
     *     struct {
     *         __u8    di_v2_pad[6];
     *         __be16  di_flushiter;
     *     };
     */
    uint64_t        di_big_nextents;

    xfs_timestamp_t di_atime;                           /* time last accessed */
    xfs_timestamp_t di_mtime;                           /* time last modified */
    xfs_timestamp_t di_ctime;                           /* time created/inode modified */
    uint64_t        di_size;                            /* number of bytes in file */
    uint64_t        di_nblocks;                         /* # of direct & btree blocks used */
    uint32_t        di_extsize;                         /* basic/minimum extent size for file */

    /*
     * DISSECT: This is another union, also optimize.
     *
     * The original fields are:
     *
     *     // For V2 inodes and V3 inodes without NREXT64 set, this
     *     // is the number of data and attr fork extents.
     *     struct {
     *         __be32 di_nextents;
     *         __be16 di_anextents;
     *     } __packed;
     *
     *     // Number of attr fork extents if NREXT64 is set.
     *     struct {
     *         __be32 di_big_anextents;
     *         __be16 di_nrext64_pad;
     *     } __packed;
     */
    uint32_t        di_big_anextents;
    uint16_t        di_nrext64_pad;

    uint8_t         di_forkoff;                         /* attr fork offs, <<3 for 64b align */
    int8_t          di_aformat;                         /* format of attr fork's data */
    uint32_t        di_dmevmask;                        /* DMIG event mask */
    uint16_t        di_dmstate;                         /* DMIG state info */
    uint16_t        di_flags;                           /* random flags, XFS_DIFLAG_... */
    uint32_t        di_gen;                             /* generation number */

    /* di_next_unlinked is the only non-core field in the old dinode */
    uint32_t        di_next_unlinked;                   /* agi unlinked list ptr */

    /* start of the extended dinode, writable fields */
    uint32_t        di_crc;                             /* CRC of the inode */
    uint64_t        di_changecount;                     /* number of attribute changes */
    uint64_t        di_lsn;                             /* flush sequence */
    uint64_t        di_flags2;                          /* more random flags */
    uint32_t        di_cowextsize;                      /* basic cow extent size for file */
    uint8_t         di_pad2[12];                        /* more padding for future expansion */

    /* fields only written to during inode creation */
    xfs_timestamp_t di_crtime;                          /* time created */
    uint64_t        di_ino;                             /* inode number */
    char            di_uuid[16];                        /* UUID of the filesystem */

    // structure must be padded to 64 bit alignment
};


/*
 * Values for di_format
 *
 * This enum is used in string mapping in xfs_trace.h; please keep the
 * TRACE_DEFINE_ENUMs for it up to date.
 */
enum xfs_dinode_fmt : uint8 {
    XFS_DINODE_FMT_DEV,                                 /* xfs_dev_t */
    XFS_DINODE_FMT_LOCAL,                               /* bulk data */
    XFS_DINODE_FMT_EXTENTS,                             /* struct xfs_bmbt_rec */
    XFS_DINODE_FMT_BTREE,                               /* struct xfs_bmdr_block */
    XFS_DINODE_FMT_UUID                                 /* added long ago, but never used */
};


/*
 * Values for di_flags
 */
#define XFS_DIFLAG_REALTIME_BIT             0           /* file's blocks come from rt area */
#define XFS_DIFLAG_PREALLOC_BIT             1           /* file space has been preallocated */
#define XFS_DIFLAG_NEWRTBM_BIT              2           /* for rtbitmap inode, new format */
#define XFS_DIFLAG_IMMUTABLE_BIT            3           /* inode is immutable */
#define XFS_DIFLAG_APPEND_BIT               4           /* inode is append-only */
#define XFS_DIFLAG_SYNC_BIT                 5           /* inode is written synchronously */
#define XFS_DIFLAG_NOATIME_BIT              6           /* do not update atime */
#define XFS_DIFLAG_NODUMP_BIT               7           /* do not dump */
#define XFS_DIFLAG_RTINHERIT_BIT            8           /* create with realtime bit set */
#define XFS_DIFLAG_PROJINHERIT_BIT          9           /* create with parents projid */
#define XFS_DIFLAG_NOSYMLINKS_BIT           10          /* disallow symlink creation */
#define XFS_DIFLAG_EXTSIZE_BIT              11          /* inode extent size allocator hint */
#define XFS_DIFLAG_EXTSZINHERIT_BIT         12          /* inherit inode extent size */
#define XFS_DIFLAG_NODEFRAG_BIT             13          /* do not reorganize/defragment */
#define XFS_DIFLAG_FILESTREAM_BIT           14          /* use filestream allocator */
/* Do not use bit 15, di_flags is legacy and unchanging now */

#define XFS_DIFLAG_REALTIME                 (1 << XFS_DIFLAG_REALTIME_BIT)
#define XFS_DIFLAG_PREALLOC                 (1 << XFS_DIFLAG_PREALLOC_BIT)
#define XFS_DIFLAG_NEWRTBM                  (1 << XFS_DIFLAG_NEWRTBM_BIT)
#define XFS_DIFLAG_IMMUTABLE                (1 << XFS_DIFLAG_IMMUTABLE_BIT)
#define XFS_DIFLAG_APPEND                   (1 << XFS_DIFLAG_APPEND_BIT)
#define XFS_DIFLAG_SYNC                     (1 << XFS_DIFLAG_SYNC_BIT)
#define XFS_DIFLAG_NOATIME                  (1 << XFS_DIFLAG_NOATIME_BIT)
#define XFS_DIFLAG_NODUMP                   (1 << XFS_DIFLAG_NODUMP_BIT)
#define XFS_DIFLAG_RTINHERIT                (1 << XFS_DIFLAG_RTINHERIT_BIT)
#define XFS_DIFLAG_PROJINHERIT              (1 << XFS_DIFLAG_PROJINHERIT_BIT)
#define XFS_DIFLAG_NOSYMLINKS               (1 << XFS_DIFLAG_NOSYMLINKS_BIT)
#define XFS_DIFLAG_EXTSIZE                  (1 << XFS_DIFLAG_EXTSIZE_BIT)
#define XFS_DIFLAG_EXTSZINHERIT             (1 << XFS_DIFLAG_EXTSZINHERIT_BIT)
#define XFS_DIFLAG_NODEFRAG                 (1 << XFS_DIFLAG_NODEFRAG_BIT)
#define XFS_DIFLAG_FILESTREAM               (1 << XFS_DIFLAG_FILESTREAM_BIT)


/*
 * Values for di_flags2 These start by being exposed to userspace in the upper
 * 16 bits of the XFS_XFLAG_s range.
 */
#define XFS_DIFLAG2_DAX_BIT                 0           /* use DAX for this inode */
#define XFS_DIFLAG2_REFLINK_BIT             1           /* file's blocks may be shared */
#define XFS_DIFLAG2_COWEXTSIZE_BIT          2           /* copy on write extent size hint */
#define XFS_DIFLAG2_BIGTIME_BIT             3           /* big timestamps */
#define XFS_DIFLAG2_NREXT64_BIT             4           /* large extent counters */

#define XFS_DIFLAG2_DAX                     (1 << XFS_DIFLAG2_DAX_BIT)
#define XFS_DIFLAG2_REFLINK                 (1 << XFS_DIFLAG2_REFLINK_BIT)
#define XFS_DIFLAG2_COWEXTSIZE              (1 << XFS_DIFLAG2_COWEXTSIZE_BIT)
#define XFS_DIFLAG2_BIGTIME                 (1 << XFS_DIFLAG2_BIGTIME_BIT)
#define XFS_DIFLAG2_NREXT64                 (1 << XFS_DIFLAG2_NREXT64_BIT)


/*
 * Remote symlink format and access functions.
 */
#define XFS_SYMLINK_MAGIC                   0x58534c4d  /* XSLM */

struct xfs_dsymlink_hdr {
    uint32_t        sl_magic;
    uint32_t        sl_offset;
    uint32_t        sl_bytes;
    uint32_t        sl_crc;
    char            sl_uuid[16];
    uint64          sl_owner;
    uint64          sl_blkno;
    uint64          sl_lsn;
};

#define XFS_SYMLINK_MAXLEN                  1024


/*
 * Allocation Btree format definitions
 *
 * There are two on-disk btrees, one sorted by blockno and one sorted
 * by blockcount and blockno.  All blocks look the same to make the code
 * simpler; if we have time later, we'll make the optimizations.
 */
#define XFS_ABTB_MAGIC                      0x41425442  /* 'ABTB' for bno tree */
#define XFS_ABTB_CRC_MAGIC                  0x41423342  /* 'AB3B' */
#define XFS_ABTC_MAGIC                      0x41425443  /* 'ABTC' for cnt tree */
#define XFS_ABTC_CRC_MAGIC                  0x41423343  /* 'AB3C' */

/*
 * Data record/key structure
 */
typedef struct xfs_alloc_rec {
    uint32_t        ar_startblock;                      /* starting block number */
    uint32_t        ar_blockcount;                      /* count of free blocks */
} xfs_alloc_rec_t, xfs_alloc_key_t;


/*
 * Inode Allocation Btree format definitions
 *
 * There is a btree for the inode map per allocation group.
 */
#define XFS_IBT_MAGIC                       0x49414254  /* 'IABT' */
#define XFS_IBT_CRC_MAGIC                   0x49414233  /* 'IAB3' */
#define XFS_FIBT_MAGIC                      0x46494254  /* 'FIBT' */
#define XFS_FIBT_CRC_MAGIC                  0x46494233  /* 'FIB3' */

/*
 * The on-disk inode record structure has two formats. The original "full"
 * format uses a 4-byte freecount. The "sparse" format uses a 1-byte freecount
 * and replaces the 3 high-order freecount bytes wth the holemask and inode
 * count.
 *
 * The holemask of the sparse record format allows an inode chunk to have holes
 * that refer to blocks not owned by the inode record. This facilitates inode
 * allocation in the event of severe free space fragmentation.
 */
struct xfs_inobt_rec {
    uint32_t        ir_startino;                        /* starting inode number */
    uint32_t        ir_freecount;                       /* count of free inodes */
    uint64_t        ir_free;                            /* free inode mask */
};


/*
 * BMAP Btree format definitions
 *
 * This includes both the root block definition that sits inside an inode fork
 * and the record/pointer formats for the leaf/node in the blocks.
 */
#define XFS_BMAP_MAGIC                      0x424d4150  /* 'BMAP' */
#define XFS_BMAP_CRC_MAGIC                  0x424d4133  /* 'BMA3' */

/*
 * Bmap root header, on-disk form only.
 */
struct xfs_bmdr_block {
    uint16          bb_level;                           /* 0 is a leaf */
    uint16          bb_numrecs;                         /* current # of data records */
};

/*
 * Generic Btree block format definitions
 *
 * This is a combination of the actual format used on disk for short and long
 * format btrees.  The first three fields are shared by both format, but the
 * pointers are different and should be used with care.
 *
 * To get the size of the actual short or long form headers please use the size
 * macros below.  Never use sizeof(xfs_btree_block).
 *
 * The blkno, crc, lsn, owner and uuid fields are only available in filesystems
 * with the crc feature bit, and all accesses to them must be conditional on
 * that flag.
 */
/* DISSECT: some of these structures are optimized. */
/* short form block header */
struct xfs_btree_sblock {
    uint32_t        bb_magic;                           /* magic number for block type */
    uint16_t        bb_level;                           /* 0 is a leaf */
    uint16_t        bb_numrecs;                         /* current # of data records */
    uint32_t        bb_leftsib;
    uint32_t        bb_rightsib;
};

struct xfs_btree_sblock_crc {
    uint32_t        bb_magic;                           /* magic number for block type */
    uint16_t        bb_level;                           /* 0 is a leaf */
    uint16_t        bb_numrecs;                         /* current # of data records */
    uint32_t        bb_leftsib;
    uint32_t        bb_rightsib;
    uint64_t        bb_blkno;
    uint64_t        bb_lsn;
    char            bb_uuid[16];
    uint32_t        bb_owner;
    uint32_t        bb_crc;
};

struct xfs_btree_lblock {
    uint32_t        bb_magic;                           /* magic number for block type */
    uint16_t        bb_level;                           /* 0 is a leaf */
    uint16_t        bb_numrecs;                         /* current # of data records */
    uint64_t        bb_leftsib;
    uint64_t        bb_rightsib;
};

struct xfs_btree_lblock_crc {
    uint32_t        bb_magic;                           /* magic number for block type */
    uint16_t        bb_level;                           /* 0 is a leaf */
    uint16_t        bb_numrecs;                         /* current # of data records */
    uint64_t        bb_leftsib;
    uint64_t        bb_rightsib;
    uint64_t        bb_blkno;
    uint64_t        bb_lsn;
    char            bb_uuid[16];
    uint64_t        bb_owner;
    uint32_t        bb_crc;
    uint32_t        bb_pad;
};

/*
 * On-disk XFS access control list structure.
 */
struct xfs_acl_entry {
    uint32_t        ae_tag;
    uint32_t        ae_id;
    uint16_t        ae_perm;
    uint16_t        ae_pad;                             /* fill the implicit hole in the structure */
};

struct xfs_acl {
    uint32_t        acl_cnt;
    xfs_acl_entry   acl_entry[];
};


/*
 * Directory version 2.
 *
 * There are 4 possible formats:
 *  - shortform - embedded into the inode
 *  - single block - data with embedded leaf at the end
 *  - multiple data blocks, single leaf+freeindex block
 *  - data blocks, node and leaf blocks (btree), freeindex blocks
 *
 * Note: many node blocks structures and constants are shared with the attr
 * code and defined in xfs_da_btree.h.
 */

#define XFS_DIR2_BLOCK_MAGIC                0x58443242  /* XD2B: single block dirs */
#define XFS_DIR2_DATA_MAGIC                 0x58443244  /* XD2D: multiblock dirs */
#define XFS_DIR2_FREE_MAGIC                 0x58443246  /* XD2F: free index blocks */

/*
 * Directory Version 3 With CRCs.
 *
 * The tree formats are the same as for version 2 directories.  The difference
 * is in the block header and dirent formats. In many cases the v3 structures
 * use v2 definitions as they are no different and this makes code sharing much
 * easier.
 *
 * Also, the xfs_dir3_*() functions handle both v2 and v3 formats - if the
 * format is v2 then they switch to the existing v2 code, or the format is v3
 * they implement the v3 functionality. This means the existing dir2 is a mix of
 * xfs_dir2/xfs_dir3 calls and functions. The xfs_dir3 functions are called
 * where there is a difference in the formats, otherwise the code is unchanged.
 *
 * Where it is possible, the code decides what to do based on the magic numbers
 * in the blocks rather than feature bits in the superblock. This means the code
 * is as independent of the external XFS code as possible as doesn't require
 * passing struct xfs_mount pointers into places where it isn't really
 * necessary.
 *
 * Version 3 includes:
 *
 *  - a larger block header for CRC and identification purposes and so the
 *  offsets of all the structures inside the blocks are different.
 *
 *  - new magic numbers to be able to detect the v2/v3 types on the fly.
 */

#define XFS_DIR3_BLOCK_MAGIC                0x58444233  /* XDB3: single block dirs */
#define XFS_DIR3_DATA_MAGIC                 0x58444433  /* XDD3: multiblock dirs */
#define XFS_DIR3_FREE_MAGIC                 0x58444633  /* XDF3: free index blocks */

/*
 * Directory layout when stored internal to an inode.
 *
 * Small directories are packed as tightly as possible so as to fit into the
 * literal area of the inode.  These "shortform" directories consist of a
 * single xfs_dir2_sf_hdr header followed by zero or more xfs_dir2_sf_entry
 * structures.  Due the different inode number storage size and the variable
 * length name field in the xfs_dir2_sf_entry all these structure are
 * variable length, and the accessors in this file should be used to iterate
 * over them.
 */
typedef struct xfs_dir2_sf_hdr {
    uint8_t         count;                              /* count of entries */
    uint8_t         i8count;                            /* count of 8-byte inode #s */
    uint32_t        parent;                             /* parent dir inode number */
} xfs_dir2_sf_hdr_t;

typedef struct xfs_dir2_sf_entry {
    uint8_t         namelen;                            /* actual name length */
    uint16_t        offset;                             /* saved offset */
    char            name[namelen];                      /* name, variable size */
    /*
     * A single byte containing the file type field follows the inode
     * number for version 3 directory entries.
     *
     * A 64-bit or 32-bit inode number follows here, at a variable offset
     * after the name.
     */
} xfs_dir2_sf_entry_t;

/*
 * Data block structures.
 *
 * A pure data block looks like the following drawing on disk:
 *
 *    +-------------------------------------------------+
 *    | xfs_dir2_data_hdr_t                             |
 *    +-------------------------------------------------+
 *    | xfs_dir2_data_entry_t OR xfs_dir2_data_unused_t |
 *    | xfs_dir2_data_entry_t OR xfs_dir2_data_unused_t |
 *    | xfs_dir2_data_entry_t OR xfs_dir2_data_unused_t |
 *    | ...                                             |
 *    +-------------------------------------------------+
 *    | unused space                                    |
 *    +-------------------------------------------------+
 *
 * As all the entries are variable size structures the accessors below should
 * be used to iterate over them.
 *
 * In addition to the pure data blocks for the data and node formats,
 * most structures are also used for the combined data/freespace "block"
 * format below.
 */

#define XFS_DIR2_DATA_FD_COUNT              3

/*
 * Header for the data blocks.
 *
 * The code knows that XFS_DIR2_DATA_FD_COUNT is 3.
 */
typedef struct xfs_dir2_data_hdr {
    uint32_t        magic;                              /* XFS_DIR2_DATA_MAGIC or XFS_DIR2_BLOCK_MAGIC */
    uint32_t        bestfree[XFS_DIR2_DATA_FD_COUNT];
} xfs_dir2_data_hdr_t;

/*
 * define a structure for all the verification fields we are adding to the
 * directory block structures. This will be used in several structures.
 * The magic number must be the first entry to align with all the dir2
 * structures so we determine how to decode them just by the magic number.
 */

struct xfs_dir3_data_hdr {
    /* DISSECT: Unfolded xfs_dir3_blk_hdr */
    uint32_t        magic;                              /* magic number */
    uint32_t        crc;                                /* CRC of block */
    uint64_t        blkno;                              /* first block of the buffer */
    uint64_t        lsn;                                /* sequence number of last write */
    char            uuid[16];                           /* filesystem we belong to */
    uint64_t        owner;                              /* inode that owns the block */
    uint32_t        bestfree[XFS_DIR2_DATA_FD_COUNT];
    uint32_t        pad;                                /* 64 bit alignment */
};

/*
 * Active entry in a data block.
 *
 * Aligned to 8 bytes.  After the variable length name field there is a
 * 2 byte tag field, which can be accessed using xfs_dir3_data_entry_tag_p.
 *
 * For dir3 structures, there is file type field between the name and the tag.
 * This can only be manipulated by helper functions. It is packed hard against
 * the end of the name so any padding for rounding is between the file type and
 * the tag.
 */

typedef struct xfs_dir2_data_entry {
    uint64_t        inumber;                            /* inode number */
    uint8_t         namelen;                            /* name length */
    char            name[namelen];                      /* name bytes, no null */
    uint16_t        tag;                                /* starting offset of us */
} xfs_dir2_data_entry_t;

/* DISSECT: extra structure with ftype field */
typedef struct xfs_dir2_data_entry_ftype {
    uint64_t        inumber;                            /* inode number */
    uint8_t         namelen;                            /* name length */
    char            name[namelen];                      /* name bytes, no null */
    uint8_t         ftype;                              /* type of inode we point to */
    uint16_t        tag;                                /* starting offset of us */
} xfs_dir2_data_entry_ftype_t;

/*
 * Unused entry in a data block.
 *
 * Aligned to 8 bytes.  Tag appears as the last 2 bytes and must be accessed
 * using xfs_dir2_data_unused_tag_p.
 */
typedef struct xfs_dir2_data_unused {
    uint16_t        freetag;                            /* XFS_DIR2_DATA_FREE_TAG */
    uint16_t        length;                             /* total free length */
                                                        /* variable offset */
    uint16_t        tag;                                /* starting offset of us */
} xfs_dir2_data_unused_t;

/*
 * Leaf block structures.
 *
 * A pure leaf block looks like the following drawing on disk:
 *
 *    +---------------------------+
 *    | xfs_dir2_leaf_hdr_t       |
 *    +---------------------------+
 *    | xfs_dir2_leaf_entry_t     |
 *    | xfs_dir2_leaf_entry_t     |
 *    | xfs_dir2_leaf_entry_t     |
 *    | xfs_dir2_leaf_entry_t     |
 *    | ...                       |
 *    +---------------------------+
 *    | xfs_dir2_data_off_t       |
 *    | xfs_dir2_data_off_t       |
 *    | xfs_dir2_data_off_t       |
 *    | ...                       |
 *    +---------------------------+
 *    | xfs_dir2_leaf_tail_t      |
 *    +---------------------------+
 *
 * The xfs_dir2_data_off_t members (bests) and tail are at the end of the block
 * for single-leaf (magic = XFS_DIR2_LEAF1_MAGIC) blocks only, but not present
 * for directories with separate leaf nodes and free space blocks
 * (magic = XFS_DIR2_LEAFN_MAGIC).
 *
 * As all the entries are variable size structures the accessors below should
 * be used to iterate over them.
 */

/*
 * Leaf block entry.
 */
typedef struct xfs_dir2_leaf_entry {
    uint32_t        hashval;                            /* hash value of name */
    uint32_t        address;                            /* address of data entry */
} xfs_dir2_leaf_entry_t;

/*
 * Single block format.
 *
 * The single block format looks like the following drawing on disk:
 *
 *    +-------------------------------------------------+
 *    | xfs_dir2_data_hdr_t                             |
 *    +-------------------------------------------------+
 *    | xfs_dir2_data_entry_t OR xfs_dir2_data_unused_t |
 *    | xfs_dir2_data_entry_t OR xfs_dir2_data_unused_t |
 *    | xfs_dir2_data_entry_t OR xfs_dir2_data_unused_t :
 *    | ...                                             |
 *    +-------------------------------------------------+
 *    | unused space                                    |
 *    +-------------------------------------------------+
 *    | ...                                             |
 *    | xfs_dir2_leaf_entry_t                           |
 *    | xfs_dir2_leaf_entry_t                           |
 *    +-------------------------------------------------+
 *    | xfs_dir2_block_tail_t                           |
 *    +-------------------------------------------------+
 *
 * As all the entries are variable size structures the accessors below should
 * be used to iterate over them.
 */

typedef struct xfs_dir2_block_tail {
    uint32_t        count;                              /* count of leaf entries */
    uint32_t        stale;                              /* count of stale lf entries */
} xfs_dir2_block_tail_t;
"""

c_xfs = cstruct(endian=">").load(xfs_def)

FILETYPES = {
    0x0: None,
    0x1: stat.S_IFREG,
    0x2: stat.S_IFDIR,
    0x3: stat.S_IFCHR,
    0x4: stat.S_IFBLK,
    0x5: stat.S_IFIFO,
    0x6: stat.S_IFSOCK,
    0x7: stat.S_IFLNK,
}

XFS_NULL = 0xFFFFFFFFFFFFFFFF
