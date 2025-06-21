# Reference: https://github.com/freebsd/freebsd-src/tree/main/sys/ufs

from __future__ import annotations

from dissect.cstruct import cstruct

ffs_def = """
typedef uint8 u_int8_t;
typedef uint16 u_int16_t;
typedef uint32 u_int32_t;
typedef uint64 u_int64_t;
typedef uchar u_char;
typedef uint32 u_int;

/*
 * The size of physical and logical block numbers and time fields in UFS.
 */
typedef int32_t ufs1_daddr_t;
typedef int64_t ufs2_daddr_t;
typedef int64_t ufs_lbn_t;
typedef int64_t ufs_time_t;

/*
 * The root inode is the root of the filesystem.  Inode 0 can't be used for
 * normal purposes and historically bad blocks were linked to inode 1, thus
 * the root inode is 2.  (Inode 1 is no longer used for this purpose, however
 * numerous dump tapes make this assumption, so we are stuck with it).
 */
#define UFS_ROOTINO     2

/*
 * Each disk drive contains some number of filesystems.
 * A filesystem consists of a number of cylinder groups.
 * Each cylinder group has inodes and data.
 *
 * A filesystem is described by its super-block, which in turn
 * describes the cylinder groups.  The super-block is critical
 * data and is replicated in each cylinder group to protect against
 * catastrophic loss.  This is done at `newfs' time and the critical
 * super-block data does not change, so the copies need not be
 * referenced further unless disaster strikes.
 *
 * For filesystem fs, the offsets of the various blocks of interest
 * are given in the super block as:
 *  [fs->fs_sblkno]     Super-block
 *  [fs->fs_cblkno]     Cylinder group block
 *  [fs->fs_iblkno]     Inode blocks
 *  [fs->fs_dblkno]     Data blocks
 * The beginning of cylinder group cg in fs, is given by
 * the ``cgbase(fs, cg)'' macro.
 *
 * Depending on the architecture and the media, the superblock may
 * reside in any one of four places. For tiny media where every block
 * counts, it is placed at the very front of the partition. Historically,
 * UFS1 placed it 8K from the front to leave room for the disk label and
 * a small bootstrap. For UFS2 it got moved to 64K from the front to leave
 * room for the disk label and a bigger bootstrap, and for really piggy
 * systems we check at 256K from the front if the first three fail. In
 * all cases the size of the superblock will be SBLOCKSIZE. All values are
 * given in byte-offset form, so they do not imply a sector size. The
 * SBLOCKSEARCH specifies the order in which the locations should be searched.
 */
#define SBLOCK_FLOPPY   0
#define SBLOCK_UFS1     8192
#define SBLOCK_UFS2     65536
#define SBLOCK_PIGGY    262144
#define SBLOCKSIZE      8192

/*
 * Max number of fragments per block. This value is NOT tweakable.
 */
#define MAXFRAG         8

/*
 * Addresses stored in inodes are capable of addressing fragments
 * of `blocks'. File system blocks of at most size MAXBSIZE can
 * be optionally broken into 2, 4, or 8 pieces, each of which is
 * addressable; these pieces may be DEV_BSIZE, or some multiple of
 * a DEV_BSIZE unit.
 *
 * Large files consist of exclusively large data blocks.  To avoid
 * undue wasted disk space, the last data block of a small file may be
 * allocated as only as many fragments of a large block as are
 * necessary.  The filesystem format retains only a single pointer
 * to such a fragment, which is a piece of a single large block that
 * has been divided.  The size of such a fragment is determinable from
 * information in the inode, using the ``blksize(fs, ip, lbn)'' macro.
 *
 * The filesystem records space availability at the fragment level;
 * to determine block availability, aligned fragments are examined.
 */

/*
 * MINBSIZE is the smallest allowable block size.
 * In order to insure that it is possible to create files of size
 * 2^32 with only two levels of indirection, MINBSIZE is set to 4096.
 * MINBSIZE must be big enough to hold a cylinder group block,
 * thus changes to (struct cg) must keep its size within MINBSIZE.
 * Note that super blocks are always of size SBLOCKSIZE,
 * and that both SBLOCKSIZE and MAXBSIZE must be >= MINBSIZE.
 */
#define MINBSIZE        4096
#define MAXBSIZE        65536

/*
 * The path name on which the filesystem is mounted is maintained
 * in fs_fsmnt. MAXMNTLEN defines the amount of space allocated in
 * the super block for this name.
 */
#define MAXMNTLEN       468

/*
 * The volume name for this filesystem is maintained in fs_volname.
 * MAXVOLLEN defines the length of the buffer allocated.
 */
#define MAXVOLLEN       32

/*
 * A summary of contiguous blocks of various sizes is maintained
 * in each cylinder group. Normally this is set by the initial
 * value of fs_maxcontig. To conserve space, a maximum summary size
 * is set by FS_MAXCONTIG.
 */
#define FS_MAXCONTIG    16

/*
 * The maximum number of snapshot nodes that can be associated
 * with each filesystem. This limit affects only the number of
 * snapshot files that can be recorded within the superblock so
 * that they can be found when the filesystem is mounted. However,
 * maintaining too many will slow the filesystem performance, so
 * having this limit is a good idea.
 */
#define FSMAXSNAP       20

/*
 * Per cylinder group information; summarized in blocks allocated
 * from first cylinder group data blocks.  These blocks have to be
 * read in from fs_csaddr (size fs_cssize) in addition to the
 * super block.
 */
struct csum {
    int32_t     cs_ndir;                /* number of directories */
    int32_t     cs_nbfree;              /* number of free blocks */
    int32_t     cs_nifree;              /* number of free inodes */
    int32_t     cs_nffree;              /* number of free frags */
};
struct csum_total {
    int64_t     cs_ndir;                /* number of directories */
    int64_t     cs_nbfree;              /* number of free blocks */
    int64_t     cs_nifree;              /* number of free inodes */
    int64_t     cs_nffree;              /* number of free frags */
    int64_t     cs_numclusters;         /* number of free clusters */
    int64_t     cs_spare[3];            /* future expansion */
};

/*
 * Pointers to super block summary information. Placed in a separate
 * structure so there is just one pointer in the superblock.
 *
 * The pointers in this structure are used as follows:
 *   fs_contigdirs references an array that tracks the creation of new
 *    directories
 *   fs_csp references a contiguous array of struct csum for
 *    all cylinder groups
 *   fs_maxcluster references an array of cluster sizes that is computed
 *    as cylinder groups are inspected
 *   fs_active is used when creating snapshots; it points to a bitmap
 *    of cylinder groups for which the free-block bitmap has changed
 *    since the snapshot operation began.
 */
struct fs_summary_info {
    uint8_t     *si_contigdirs;         /* (u) # of contig. allocated dirs */
    struct csum *si_csp;                /* (u) cg summary info buffer */
    int32_t     *si_maxcluster;         /* (u) max cluster in each cyl group */
    u_int       *si_active;             /* (u) used by snapshots to track fs */
};

/*
 * Super block for an FFS filesystem.
 */
struct fs {
    int32_t     fs_firstfield;          /* historic filesystem linked list, */
    int32_t     fs_unused_1;            /*     used for incore super blocks */
    int32_t     fs_sblkno;              /* offset of super-block in filesys */
    int32_t     fs_cblkno;              /* offset of cyl-block in filesys */
    int32_t     fs_iblkno;              /* offset of inode-blocks in filesys */
    int32_t     fs_dblkno;              /* offset of first data after cg */
    int32_t     fs_old_cgoffset;        /* cylinder group offset in cylinder */
    int32_t     fs_old_cgmask;          /* used to calc mod fs_ntrak */
    int32_t     fs_old_time;            /* last time written */
    int32_t     fs_old_size;            /* number of blocks in fs */
    int32_t     fs_old_dsize;           /* number of data blocks in fs */
    u_int32_t   fs_ncg;                 /* number of cylinder groups */
    int32_t     fs_bsize;               /* size of basic blocks in fs */
    int32_t     fs_fsize;               /* size of frag blocks in fs */
    int32_t     fs_frag;                /* number of frags in a block in fs */
/* these are configuration parameters */
    int32_t     fs_minfree;             /* minimum percentage of free blocks */
    int32_t     fs_old_rotdelay;        /* num of ms for optimal next block */
    int32_t     fs_old_rps;             /* disk revolutions per second */
/* these fields can be computed from the others */
    int32_t     fs_bmask;               /* ``blkoff'' calc of blk offsets */
    int32_t     fs_fmask;               /* ``fragoff'' calc of frag offsets */
    int32_t     fs_bshift;              /* ``lblkno'' calc of logical blkno */
    int32_t     fs_fshift;              /* ``numfrags'' calc number of frags */
/* these are configuration parameters */
    int32_t     fs_maxcontig;           /* max number of contiguous blks */
    int32_t     fs_maxbpg;              /* max number of blks per cyl group */
/* these fields can be computed from the others */
    int32_t     fs_fragshift;           /* block to frag shift */
    int32_t     fs_fsbtodb;             /* fsbtodb and dbtofsb shift constant */
    int32_t     fs_sbsize;              /* actual size of super block */
    int32_t     fs_spare1[2];           /* old fs_csmask */
                                        /* old fs_csshift */
    int32_t     fs_nindir;              /* value of NINDIR */
    u_int32_t   fs_inopb;               /* value of INOPB */
    int32_t     fs_old_nspf;            /* value of NSPF */
/* yet another configuration parameter */
    int32_t     fs_optim;               /* optimization preference, see below */
    int32_t     fs_old_npsect;          /* # sectors/track including spares */
    int32_t     fs_old_interleave;      /* hardware sector interleave */
    int32_t     fs_old_trackskew;       /* sector 0 skew, per track */
    int32_t     fs_id[2];               /* unique filesystem id */
/* sizes determined by number of cylinder groups and their sizes */
    int32_t     fs_old_csaddr;          /* blk addr of cyl grp summary area */
    int32_t     fs_cssize;              /* size of cyl grp summary area */
    int32_t     fs_cgsize;              /* cylinder group size */
    int32_t     fs_spare2;              /* old fs_ntrak */
    int32_t     fs_old_nsect;           /* sectors per track */
    int32_t     fs_old_spc;             /* sectors per cylinder */
    int32_t     fs_old_ncyl;            /* cylinders in filesystem */
    int32_t     fs_old_cpg;             /* cylinders per group */
    u_int32_t   fs_ipg;                 /* inodes per group */
    int32_t     fs_fpg;                 /* blocks per group * fs_frag */
/* this data must be re-computed after crashes */
    struct csum fs_old_cstotal;         /* cylinder summary information */
/* these fields are cleared at mount time */
    int8_t      fs_fmod;                /* super block modified flag */
    int8_t      fs_clean;               /* filesystem is clean flag */
    int8_t      fs_ronly;               /* mounted read-only flag */
    int8_t      fs_old_flags;           /* old FS_ flags */
    u_char      fs_fsmnt[MAXMNTLEN];    /* name mounted on */
    u_char      fs_volname[MAXVOLLEN];  /* volume name */
    u_int64_t   fs_swuid;               /* system-wide uid */
    int32_t     fs_pad;                 /* due to alignment of fs_swuid */
/* these fields retain the current block allocation info */
    int32_t     fs_cgrotor;             /* last cg searched */
    uint8       fs_ocsp[120];           /* padding; was list of fs_cs buffers */
    struct      fs_summary_info *fs_si; /* In-core pointer to summary info */
    int32_t     fs_old_cpc;             /* cyl per cycle in postbl */
    int32_t     fs_maxbsize;            /* maximum blocking factor permitted */
    int64_t     fs_unrefs;              /* number of unreferenced inodes */
    int64_t     fs_providersize;        /* size of underlying GEOM provider */
    int64_t     fs_metaspace;           /* size of area reserved for metadata */
    int64_t     fs_sparecon64[13];      /* old rotation block list head */
    int64_t     fs_sblockactualloc;     /* byte offset of this superblock */
    int64_t     fs_sblockloc;           /* byte offset of standard superblock */
    struct csum_total fs_cstotal;       /* (u) cylinder summary information */
    ufs_time_t  fs_time;                /* last time written */
    int64_t     fs_size;                /* number of blocks in fs */
    int64_t     fs_dsize;               /* number of data blocks in fs */
    ufs2_daddr_t fs_csaddr;             /* blk addr of cyl grp summary area */
    int64_t     fs_pendingblocks;       /* (u) blocks being freed */
    u_int32_t   fs_pendinginodes;       /* (u) inodes being freed */
    uint32_t    fs_snapinum[FSMAXSNAP]; /* list of snapshot inode numbers */
    u_int32_t   fs_avgfilesize;         /* expected average file size */
    u_int32_t   fs_avgfpdir;            /* expected # of files per directory */
    int32_t     fs_save_cgsize;         /* save real cg size to use fs_bsize */
    ufs_time_t  fs_mtime;               /* Last mount or fsck time. */
    int32_t     fs_sujfree;             /* SUJ free list */
    int32_t     fs_sparecon32[21];      /* reserved for future constants */
    u_int32_t   fs_ckhash;              /* if CK_SUPERBLOCK, its check-hash */
    u_int32_t   fs_metackhash;          /* metadata check-hash, see CK_ below */
    int32_t     fs_flags;               /* see FS_ flags below */
    int32_t     fs_contigsumsize;       /* size of cluster summary array */
    int32_t     fs_maxsymlinklen;       /* max length of an internal symlink */
    int32_t     fs_old_inodefmt;        /* format of on-disk inodes */
    u_int64_t   fs_maxfilesize;         /* maximum representable file size */
    int64_t     fs_qbmask;              /* ~fs_bmask for use with 64-bit size */
    int64_t     fs_qfmask;              /* ~fs_fmask for use with 64-bit size */
    int32_t     fs_state;               /* validate fs_clean field */
    int32_t     fs_old_postblformat;    /* format of positional layout tables */
    int32_t     fs_old_nrpos;           /* number of rotational positions */
    int32_t     fs_spare5[2];           /* old fs_postbloff */
                                        /* old fs_rotbloff */
    int32_t     fs_magic;               /* magic number */
};

/*
 * Filesystem identification
 */
#define FS_UFS1_MAGIC   0x011954        /* UFS1 fast filesystem magic number */
#define FS_UFS2_MAGIC   0x19540119      /* UFS2 fast filesystem magic number */
#define FS_BAD_MAGIC    0x19960408      /* UFS incomplete newfs magic number */
#define FS_42INODEFMT   -1              /* 4.2BSD inode format */
#define FS_44INODEFMT   2               /* 4.4BSD inode format */

/*
 * Filesystem flags.
 *
 * The FS_UNCLEAN flag is set by the kernel when the filesystem was
 * mounted with fs_clean set to zero. The FS_DOSOFTDEP flag indicates
 * that the filesystem should be managed by the soft updates code.
 * Note that the FS_NEEDSFSCK flag is set and cleared by the fsck
 * utility. It is set when background fsck finds an unexpected
 * inconsistency which requires a traditional foreground fsck to be
 * run. Such inconsistencies should only be found after an uncorrectable
 * disk error. The FS_NEEDSFSCK can also be set when a mounted filesystem
 * discovers an internal inconsistency such as freeing a freed inode.
 * A foreground fsck will clear the FS_NEEDSFSCK flag when it has
 * successfully cleaned up the filesystem. The kernel uses this
 * flag to enforce that inconsistent filesystems be mounted read-only.
 *
 * The FS_METACKHASH flag when set indicates that the kernel maintains
 * one or more check hashes. The actual set of supported check hashes
 * is stored in the fs_metackhash field. Kernels that do not support
 * check hashes clear the FS_METACKHASH flag to indicate that the
 * check hashes need to be rebuilt (by fsck) before they can be used.
 *
 * When a filesystem is mounted, any flags not included in FS_SUPPORTED
 * are cleared. This lets newer features know that the filesystem has
 * been run on an older version of the filesystem and thus that data
 * structures associated with those features are out-of-date and need
 * to be rebuilt.
 *
 * FS_ACLS indicates that POSIX.1e ACLs are administratively enabled
 * for the file system, so they should be loaded from extended attributes,
 * observed for access control purposes, and be administered by object
 * owners.  FS_NFS4ACLS indicates that NFSv4 ACLs are administratively
 * enabled.  This flag is mutually exclusive with FS_ACLS.  FS_MULTILABEL
 * indicates that the TrustedBSD MAC Framework should attempt to back MAC
 * labels into extended attributes on the file system rather than maintain
 * a single mount label for all objects.
 */
#define FS_UNCLEAN      0x00000001      /* filesystem not clean at mount */
#define FS_DOSOFTDEP    0x00000002      /* filesystem using soft dependencies */
#define FS_NEEDSFSCK    0x00000004      /* filesystem needs sync fsck before mount */
#define FS_SUJ          0x00000008      /* Filesystem using softupdate journal */
#define FS_ACLS         0x00000010      /* file system has POSIX.1e ACLs enabled */
#define FS_MULTILABEL   0x00000020      /* file system is MAC multi-label */
#define FS_GJOURNAL     0x00000040      /* gjournaled file system */
#define FS_FLAGS_UPDATED 0x0000080      /* flags have been moved to new location */
#define FS_NFS4ACLS     0x00000100      /* file system has NFSv4 ACLs enabled */
#define FS_METACKHASH   0x00000200      /* kernel supports metadata check hashes */
#define FS_TRIM         0x00000400      /* issue BIO_DELETE for deleted blocks */
#define FS_SUPPORTED    0x00FFFFFF      /* supported flags, others cleared at mount*/

/*
 * Cylinder group block for a filesystem.
 */
#define CG_MAGIC        0x090255
struct cg {
    int32_t     cg_firstfield;          /* historic cyl groups linked list */
    int32_t     cg_magic;               /* magic number */
    int32_t     cg_old_time;            /* time last written */
    u_int32_t   cg_cgx;                 /* we are the cgx'th cylinder group */
    int16_t     cg_old_ncyl;            /* number of cyl's this cg */
    int16_t     cg_old_niblk;           /* number of inode blocks this cg */
    u_int32_t   cg_ndblk;               /* number of data blocks this cg */
    struct      csum cg_cs;             /* cylinder summary information */
    u_int32_t   cg_rotor;               /* position of last used block */
    u_int32_t   cg_frotor;              /* position of last used frag */
    u_int32_t   cg_irotor;              /* position of last used inode */
    u_int32_t   cg_frsum[MAXFRAG];      /* counts of available frags */
    int32_t     cg_old_btotoff;         /* (int32) block totals per cylinder */
    int32_t     cg_old_boff;            /* (u_int16) free block positions */
    u_int32_t   cg_iusedoff;            /* (u_int8) used inode map */
    u_int32_t   cg_freeoff;             /* (u_int8) free block map */
    u_int32_t   cg_nextfreeoff;         /* (u_int8) next available space */
    u_int32_t   cg_clustersumoff;       /* (u_int32) counts of avail clusters */
    u_int32_t   cg_clusteroff;          /* (u_int8) free cluster map */
    u_int32_t   cg_nclusterblks;        /* number of clusters this cg */
    u_int32_t   cg_niblk;               /* number of inode blocks this cg */
    u_int32_t   cg_initediblk;          /* last initialized inode */
    u_int32_t   cg_unrefs;              /* number of unreferenced inodes */
    int32_t     cg_sparecon32[1];       /* reserved for future use */
    u_int32_t   cg_ckhash;              /* check-hash of this cg */
    ufs_time_t  cg_time;                /* time last written */
    int64_t     cg_sparecon64[3];       /* reserved for future use */
    u_int8_t    cg_space[1];            /* space for cylinder group maps */
/* actually longer */
};

/*
 * A dinode contains all the meta-data associated with a UFS2 file.
 * This structure defines the on-disk format of a dinode. Since
 * this structure describes an on-disk structure, all its fields
 * are defined by types with precise widths.
 */

#define UFS_NXADDR      2               /* External addresses in inode. */
#define UFS_NDADDR      12              /* Direct addresses in inode. */
#define UFS_NIADDR      3               /* Indirect addresses in inode. */

struct ufs2_dinode {
    u_int16_t   di_mode;                /*   0: IFMT, permissions; see below. */
    int16_t     di_nlink;               /*   2: File link count. */
    u_int32_t   di_uid;                 /*   4: File owner. */
    u_int32_t   di_gid;                 /*   8: File group. */
    u_int32_t   di_blksize;             /*  12: Inode blocksize. */
    u_int64_t   di_size;                /*  16: File byte count. */
    u_int64_t   di_blocks;              /*  24: Blocks actually held. */
    ufs_time_t  di_atime;               /*  32: Last access time. */
    ufs_time_t  di_mtime;               /*  40: Last modified time. */
    ufs_time_t  di_ctime;               /*  48: Last inode change time. */
    ufs_time_t  di_birthtime;           /*  56: Inode creation time. */
    int32_t     di_mtimensec;           /*  64: Last modified time. */
    int32_t     di_atimensec;           /*  68: Last access time. */
    int32_t     di_ctimensec;           /*  72: Last inode change time. */
    int32_t     di_birthnsec;           /*  76: Inode creation time. */
    u_int32_t   di_gen;                 /*  80: Generation number. */
    u_int32_t   di_kernflags;           /*  84: Kernel flags. */
    u_int32_t   di_flags;               /*  88: Status flags (chflags). */
    u_int32_t   di_extsize;             /*  92: External attributes size. */
    ufs2_daddr_t di_extb[UFS_NXADDR];   /* 96: External attributes block. */
    ufs2_daddr_t di_db[UFS_NDADDR];     /* 112: Direct disk blocks. */
    ufs2_daddr_t di_ib[UFS_NIADDR];     /* 208: Indirect disk blocks. */
    u_int64_t   di_modrev;              /* 232: i_modrev for NFSv4 */
    uint32_t    di_freelink;            /* 240: SUJ: Next unlinked inode. */
    uint32_t    di_ckhash;              /* 244: if CK_INODE, its check-hash */
    uint32_t    di_spare[2];            /* 248: Reserved; currently unused */
};

/*
 * A UFS1 dinode contains all the meta-data associated with a UFS1 file.
 * This structure defines the on-disk format of a UFS1 dinode. Since
 * this structure describes an on-disk structure, all its fields
 * are defined by types with precise widths.
 */
struct ufs1_dinode {
    u_int16_t   di_mode;                /*   0: IFMT, permissions; see below. */
    int16_t     di_nlink;               /*   2: File link count. */
    uint32_t    di_freelink;            /*   4: SUJ: Next unlinked inode. */
    u_int64_t   di_size;                /*   8: File byte count. */
    int32_t     di_atime;               /*  16: Last access time. */
    int32_t     di_atimensec;           /*  20: Last access time. */
    int32_t     di_mtime;               /*  24: Last modified time. */
    int32_t     di_mtimensec;           /*  28: Last modified time. */
    int32_t     di_ctime;               /*  32: Last inode change time. */
    int32_t     di_ctimensec;           /*  36: Last inode change time. */
    ufs1_daddr_t di_db[UFS_NDADDR];     /*  40: Direct disk blocks. */
    ufs1_daddr_t di_ib[UFS_NIADDR];     /*  88: Indirect disk blocks. */
    u_int32_t   di_flags;               /* 100: Status flags (chflags). */
    u_int32_t   di_blocks;              /* 104: Blocks actually held. */
    u_int32_t   di_gen;                 /* 108: Generation number. */
    u_int32_t   di_uid;                 /* 112: File owner. */
    u_int32_t   di_gid;                 /* 116: File group. */
    u_int64_t   di_modrev;              /* 120: i_modrev for NFSv4 */
};

#define    UFS_LINK_MAX    32767

#define UFS_MAXNAMLEN       255

struct direct {
    u_int32_t   d_ino;                  /* inode number of entry */
    u_int16_t   d_reclen;               /* length of this record */
    u_int8_t    d_type;                 /* file type, see below */
    u_int8_t    d_namlen;               /* length of string in d_name */
    char        d_name[0];              /* name with length <= UFS_MAXNAMLEN */
};
"""

c_ffs = cstruct().load(ffs_def)
