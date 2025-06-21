import stat

from dissect.cstruct import cstruct

btrfs_def = """
#define BTRFS_SUPER_INFO_OFFSET         0x00010000

/* ASCII for _BHRfS_M, no terminating nul */
#define BTRFS_MAGIC                     0x4D5F53665248425F

#define BTRFS_MAX_LEVEL                 8

/*
 * We can actually store much bigger names, but lets not confuse the rest of
 * linux.
 */
#define BTRFS_NAME_LEN                  255

/*
 * Theoretical limit is larger, but we keep this down to a sane value. That
 * should limit greatly the possibility of collisions on inode ref items.
 */
#define BTRFS_LINK_MAX                  65535

/* holds pointers to all of the tree roots */
#define BTRFS_ROOT_TREE_OBJECTID        1

/* stores information about which extents are in use, and reference counts */
#define BTRFS_EXTENT_TREE_OBJECTID      2

/*
 * chunk tree stores translations from logical -> physical block numbering
 * the super block points to the chunk tree
 */
#define BTRFS_CHUNK_TREE_OBJECTID       3

/*
 * stores information about which areas of a given device are in use.
 * one per device.  The tree of tree roots points to the device tree
 */
#define BTRFS_DEV_TREE_OBJECTID         4

/* one per subvolume, storing files and directories */
#define BTRFS_FS_TREE_OBJECTID          5

/* directory objectid inside the root tree */
#define BTRFS_ROOT_TREE_DIR_OBJECTID    6

/* holds checksums of all the data extents */
#define BTRFS_CSUM_TREE_OBJECTID        7

/* holds quota configuration and tracking */
#define BTRFS_QUOTA_TREE_OBJECTID       8

/* for storing items that use the BTRFS_UUID_KEY* types */
#define BTRFS_UUID_TREE_OBJECTID        9

/* tracks free space in block groups. */
#define BTRFS_FREE_SPACE_TREE_OBJECTID  10

/* Holds the block group items for extent tree v2. */
#define BTRFS_BLOCK_GROUP_TREE_OBJECTID 11

/* device stats in the device tree */
#define BTRFS_DEV_STATS_OBJECTID        0

/* for storing balance parameters in the root tree */
#define BTRFS_BALANCE_OBJECTID          -4

/* orphan objectid for tracking unlinked/truncated files */
#define BTRFS_ORPHAN_OBJECTID           -5

/* does write ahead logging to speed up fsyncs */
#define BTRFS_TREE_LOG_OBJECTID         -6
#define BTRFS_TREE_LOG_FIXUP_OBJECTID   -7

/* for space balancing */
#define BTRFS_TREE_RELOC_OBJECTID       -8
#define BTRFS_DATA_RELOC_TREE_OBJECTID  -9

/*
 * extent checksums all have this objectid
 * this allows them to share the logging tree
 * for fsyncs
 */
#define BTRFS_EXTENT_CSUM_OBJECTID      -10

/* For storing free space cache */
#define BTRFS_FREE_SPACE_OBJECTID       -11

/*
 * The inode number assigned to the special inode for storing
 * free ino cache
 */
#define BTRFS_FREE_INO_OBJECTID         -12

/* dummy objectid represents multiple objectids */
#define BTRFS_MULTIPLE_OBJECTIDS        -255

/*
 * All files have objectids in this range.
 */
#define BTRFS_FIRST_FREE_OBJECTID       256
#define BTRFS_LAST_FREE_OBJECTID        -256
#define BTRFS_FIRST_CHUNK_TREE_OBJECTID 256

/*
 * the device items go into the chunk tree.  The key is in the form
 * [ 1 BTRFS_DEV_ITEM_KEY device_id ]
 */
#define BTRFS_DEV_ITEMS_OBJECTID        1

#define BTRFS_BTREE_INODE_OBJECTID      1

#define BTRFS_EMPTY_SUBVOL_DIR_OBJECTID 2

#define BTRFS_DEV_REPLACE_DEVID         0

/*
 * inode items have the data typically returned from stat and store other
 * info about object characteristics.  There is one for every file and dir in
 * the FS
 */
#define BTRFS_INODE_ITEM_KEY            1
#define BTRFS_INODE_REF_KEY             12
#define BTRFS_INODE_EXTREF_KEY          13
#define BTRFS_XATTR_ITEM_KEY            24

/*
 * fs verity items are stored under two different key types on disk.
 * The descriptor items:
 * [ inode objectid, BTRFS_VERITY_DESC_ITEM_KEY, offset ]
 *
 * At offset 0, we store a btrfs_verity_descriptor_item which tracks the size
 * of the descriptor item and some extra data for encryption.
 * Starting at offset 1, these hold the generic fs verity descriptor.  The
 * latter are opaque to btrfs, we just read and write them as a blob for the
 * higher level verity code.  The most common descriptor size is 256 bytes.
 *
 * The merkle tree items:
 * [ inode objectid, BTRFS_VERITY_MERKLE_ITEM_KEY, offset ]
 *
 * These also start at offset 0, and correspond to the merkle tree bytes.  When
 * fsverity asks for page 0 of the merkle tree, we pull up one page starting at
 * offset 0 for this key type.  These are also opaque to btrfs, we're blindly
 * storing whatever fsverity sends down.
 */
#define BTRFS_VERITY_DESC_ITEM_KEY      36
#define BTRFS_VERITY_MERKLE_ITEM_KEY    37

#define BTRFS_ORPHAN_ITEM_KEY           48
/* reserve 2-15 close to the inode for later flexibility */

/*
 * dir items are the name -> inode pointers in a directory.  There is one
 * for every name in a directory.  BTRFS_DIR_LOG_ITEM_KEY is no longer used
 * but it's still defined here for documentation purposes and to help avoid
 * having its numerical value reused in the future.
 */
#define BTRFS_DIR_LOG_ITEM_KEY          60
#define BTRFS_DIR_LOG_INDEX_KEY         72
#define BTRFS_DIR_ITEM_KEY              84
#define BTRFS_DIR_INDEX_KEY             96
/*
 * extent data is for file data
 */
#define BTRFS_EXTENT_DATA_KEY           108

/*
 * extent csums are stored in a separate tree and hold csums for
 * an entire extent on disk.
 */
#define BTRFS_EXTENT_CSUM_KEY           128

/*
 * root items point to tree roots.  They are typically in the root
 * tree used by the super block to find all the other trees
 */
#define BTRFS_ROOT_ITEM_KEY             132

/*
 * root backrefs tie subvols and snapshots to the directory entries that
 * reference them
 */
#define BTRFS_ROOT_BACKREF_KEY          144

/*
 * root refs make a fast index for listing all of the snapshots and
 * subvolumes referenced by a given root.  They point directly to the
 * directory item in the root that references the subvol
 */
#define BTRFS_ROOT_REF_KEY              156

/*
 * extent items are in the extent map tree.  These record which blocks
 * are used, and how many references there are to each block
 */
#define BTRFS_EXTENT_ITEM_KEY           168

/*
 * The same as the BTRFS_EXTENT_ITEM_KEY, except it's metadata we already know
 * the length, so we save the level in key->offset instead of the length.
 */
#define BTRFS_METADATA_ITEM_KEY         169

#define BTRFS_TREE_BLOCK_REF_KEY        176

#define BTRFS_EXTENT_DATA_REF_KEY       178

#define BTRFS_EXTENT_REF_V0_KEY         180

#define BTRFS_SHARED_BLOCK_REF_KEY      182

#define BTRFS_SHARED_DATA_REF_KEY       184

/*
 * block groups give us hints into the extent allocation trees.  Which
 * blocks are free etc etc
 */
#define BTRFS_BLOCK_GROUP_ITEM_KEY      192

/*
 * Every block group is represented in the free space tree by a free space info
 * item, which stores some accounting information. It is keyed on
 * (block_group_start, FREE_SPACE_INFO, block_group_length).
 */
#define BTRFS_FREE_SPACE_INFO_KEY       198

/*
 * A free space extent tracks an extent of space that is free in a block group.
 * It is keyed on (start, FREE_SPACE_EXTENT, length).
 */
#define BTRFS_FREE_SPACE_EXTENT_KEY     199

/*
 * When a block group becomes very fragmented, we convert it to use bitmaps
 * instead of extents. A free space bitmap is keyed on
 * (start, FREE_SPACE_BITMAP, length); the corresponding item is a bitmap with
 * (length / sectorsize) bits.
 */
#define BTRFS_FREE_SPACE_BITMAP_KEY     200

#define BTRFS_DEV_EXTENT_KEY            204
#define BTRFS_DEV_ITEM_KEY              216
#define BTRFS_CHUNK_ITEM_KEY            228

/*
 * Records the overall state of the qgroups.
 * There's only one instance of this key present,
 * (0, BTRFS_QGROUP_STATUS_KEY, 0)
 */
#define BTRFS_QGROUP_STATUS_KEY         240
/*
 * Records the currently used space of the qgroup.
 * One key per qgroup, (0, BTRFS_QGROUP_INFO_KEY, qgroupid).
 */
#define BTRFS_QGROUP_INFO_KEY           242
/*
 * Contains the user configured limits for the qgroup.
 * One key per qgroup, (0, BTRFS_QGROUP_LIMIT_KEY, qgroupid).
 */
#define BTRFS_QGROUP_LIMIT_KEY          244
/*
 * Records the child-parent relationship of qgroups. For
 * each relation, 2 keys are present:
 * (childid, BTRFS_QGROUP_RELATION_KEY, parentid)
 * (parentid, BTRFS_QGROUP_RELATION_KEY, childid)
 */
#define BTRFS_QGROUP_RELATION_KEY       246

/*
 * Obsolete name, see BTRFS_TEMPORARY_ITEM_KEY.
 */
#define BTRFS_BALANCE_ITEM_KEY          248

/*
 * The key type for tree items that are stored persistently, but do not need to
 * exist for extended period of time. The items can exist in any tree.
 *
 * [subtype, BTRFS_TEMPORARY_ITEM_KEY, data]
 *
 * Existing items:
 *
 * - balance status item
 *   (BTRFS_BALANCE_OBJECTID, BTRFS_TEMPORARY_ITEM_KEY, 0)
 */
#define BTRFS_TEMPORARY_ITEM_KEY        248

/*
 * Obsolete name, see BTRFS_PERSISTENT_ITEM_KEY
 */
#define BTRFS_DEV_STATS_KEY             249

/*
 * The key type for tree items that are stored persistently and usually exist
 * for a long period, eg. filesystem lifetime. The item kinds can be status
 * information, stats or preference values. The item can exist in any tree.
 *
 * [subtype, BTRFS_PERSISTENT_ITEM_KEY, data]
 *
 * Existing items:
 *
 * - device statistics, store IO stats in the device tree, one key for all
 *   stats
 *   (BTRFS_DEV_STATS_OBJECTID, BTRFS_DEV_STATS_KEY, 0)
 */
#define BTRFS_PERSISTENT_ITEM_KEY       249

/*
 * Persistently stores the device replace state in the device tree.
 * The key is built like this: (0, BTRFS_DEV_REPLACE_KEY, 0).
 */
#define BTRFS_DEV_REPLACE_KEY           250

/*
 * Stores items that allow to quickly map UUIDs to something else.
 * These items are part of the filesystem UUID tree.
 * The key is built like this:
 * (UUID_upper_64_bits, BTRFS_UUID_KEY*, UUID_lower_64_bits).
 */
#define BTRFS_UUID_KEY_SUBVOL           251     /* for UUIDs assigned to subvols */
#define BTRFS_UUID_KEY_RECEIVED_SUBVOL  252     /* for UUIDs assigned to received subvols */

/*
 * string items are for debugging.  They just store a short string of
 * data in the FS
 */
#define BTRFS_STRING_ITEM_KEY           253

/* Maximum metadata block size (nodesize) */
#define BTRFS_MAX_METADATA_BLOCKSIZE    65536

/* 32 bytes in various csum fields */
#define BTRFS_CSUM_SIZE                 32

/*
 * flags definitions for directory entry item type
 *
 * Used by:
 * struct btrfs_dir_item.type
 *
 * Values 0..7 must match common file type values in fs_types.h.
 */
#define BTRFS_FT_UNKNOWN                0
#define BTRFS_FT_REG_FILE               1
#define BTRFS_FT_DIR                    2
#define BTRFS_FT_CHRDEV                 3
#define BTRFS_FT_BLKDEV                 4
#define BTRFS_FT_FIFO                   5
#define BTRFS_FT_SOCK                   6
#define BTRFS_FT_SYMLINK                7
#define BTRFS_FT_XATTR                  8
#define BTRFS_FT_MAX                    9
/* Directory contains encrypted data */
#define BTRFS_FT_ENCRYPTED              0x80

/*
 * Inode flags
 */
#define BTRFS_INODE_NODATASUM           (1 << 0)
#define BTRFS_INODE_NODATACOW           (1 << 1)
#define BTRFS_INODE_READONLY            (1 << 2)
#define BTRFS_INODE_NOCOMPRESS          (1 << 3)
#define BTRFS_INODE_PREALLOC            (1 << 4)
#define BTRFS_INODE_SYNC                (1 << 5)
#define BTRFS_INODE_IMMUTABLE           (1 << 6)
#define BTRFS_INODE_APPEND              (1 << 7)
#define BTRFS_INODE_NODUMP              (1 << 8)
#define BTRFS_INODE_NOATIME             (1 << 9)
#define BTRFS_INODE_DIRSYNC             (1 << 10)
#define BTRFS_INODE_COMPRESS            (1 << 11)

#define BTRFS_INODE_ROOT_ITEM_INIT      (1 << 31)

#define BTRFS_VOL_NAME_MAX              255
#define BTRFS_LABEL_SIZE                256

#define BTRFS_FSID_SIZE                 16
#define BTRFS_UUID_SIZE                 16

/* different types of block groups (and chunks) */
flag BTRFS_BLOCK_GROUP : uint64 {
    DATA        = 0x0001
    SYSTEM      = 0x0002
    METADATA    = 0x0004
    RAID0       = 0x0008
    RAID1       = 0x0010
    DUP         = 0x0020
    RAID10      = 0x0040
    RAID5       = 0x0080
    RAID6       = 0x0100
    RAID1C3     = 0x0200
    RAID1C4     = 0x0400
};

/*
 * The key defines the order in the tree, and so it also defines (optimal)
 * block layout.
 *
 * objectid corresponds to the inode number.
 *
 * type tells us things about the object, and is a kind of stream selector.
 * so for a given inode, keys with type of 1 might refer to the inode data,
 * type of 2 may point to file data in the btree and type == 3 may point to
 * extents.
 *
 * offset is the starting byte offset for this key in the stream.
 *
 * btrfs_disk_key is in disk byte order.  struct btrfs_key is always
 * in cpu native order.  Otherwise they are identical and their sizes
 * should be the same (ie both packed)
 */
struct btrfs_disk_key {
    uint64      objectid;
    uint8       type;
    uint64      offset;
};

/*
 * Every tree block (leaf or node) starts with this header.
 */
struct btrfs_header {
    /* These first four must match the super block */
    char        csum[BTRFS_CSUM_SIZE];
    /* FS specific uuid */
    char        fsid[BTRFS_FSID_SIZE];
    /* Which block this node is supposed to live in */
    uint64      bytenr;
    uint64      flags;

    /* Allowed to be different from the super from here on down */
    char        chunk_tree_uuid[BTRFS_UUID_SIZE];
    uint64      generation;
    uint64      owner;
    uint32      nritems;
    uint8       level;
};

/*
 * This is a very generous portion of the super block, giving us room to
 * translate 14 chunks with 3 stripes each.
 */
#define BTRFS_SYSTEM_CHUNK_ARRAY_SIZE   2048

/*
 * Just in case we somehow lose the roots and are not able to mount, we store
 * an array of the roots from previous transactions in the super.
 */
#define BTRFS_NUM_BACKUP_ROOTS 4
struct btrfs_root_backup {
    uint64      tree_root;
    uint64      tree_root_gen;

    uint64      chunk_root;
    uint64      chunk_root_gen;

    uint64      extent_root;
    uint64      extent_root_gen;

    uint64      fs_root;
    uint64      fs_root_gen;

    uint64      dev_root;
    uint64      dev_root_gen;

    uint64      csum_root;
    uint64      csum_root_gen;

    uint64      total_bytes;
    uint64      bytes_used;
    uint64      num_devices;
    /* future */
    uint64      unused_64[4];

    uint8       tree_root_level;
    uint8       chunk_root_level;
    uint8       extent_root_level;
    uint8       fs_root_level;
    uint8       dev_root_level;
    uint8       csum_root_level;
    /* future and to align */
    char        unused_8[10];
};

/*
 * A leaf is full of items. offset and size tell us where to find the item in
 * the leaf (relative to the start of the data area)
 */
struct btrfs_item {
    struct btrfs_disk_key   key;
    uint32      offset;
    uint32      size;
};

/*
 * Leaves have an item area and a data area:
 * [item0, item1....itemN] [free space] [dataN...data1, data0]
 *
 * The data is separate from the items to get the keys closer together during
 * searches.
 */
struct btrfs_leaf {
    struct btrfs_header     header;
    struct btrfs_item       items[];
};

/*
 * All non-leaf blocks are nodes, they hold only keys and pointers to other
 * blocks.
 */
struct btrfs_key_ptr {
    struct btrfs_disk_key   key;
    uint64      blockptr;
    uint64      generation;
};

struct btrfs_node {
    struct btrfs_header     header;
    struct btrfs_key_ptr    ptrs[];
};

struct btrfs_dev_item {
    /* the internal btrfs device id */
    uint64      devid;

    /* size of the device */
    uint64      total_bytes;

    /* bytes used */
    uint64      bytes_used;

    /* optimal io alignment for this device */
    uint32      io_align;

    /* optimal io width for this device */
    uint32      io_width;

    /* minimal io size for this device */
    uint32      sector_size;

    /* type and info about this device */
    uint64      type;

    /* expected generation for this device */
    uint64      generation;

    /*
     * starting byte of this partition on the device,
     * to allow for stripe alignment in the future
     */
    uint64      start_offset;

    /* grouping information for allocation decisions */
    uint32      dev_group;

    /* seek speed 0-100 where 100 is fastest */
    uint8       seek_speed;

    /* bandwidth 0-100 where 100 is fastest */
    uint8       bandwidth;

    /* btrfs generated uuid for this device */
    char        uuid[BTRFS_UUID_SIZE];

    /* uuid of FS who owns this device */
    char        fsid[BTRFS_UUID_SIZE];
};

struct btrfs_stripe {
    uint64      devid;
    uint64      offset;
    char        dev_uuid[BTRFS_UUID_SIZE];
};

struct btrfs_chunk {
    /* size of this chunk in bytes */
    uint64      length;

    /* objectid of the root referencing this chunk */
    uint64      owner;

    uint64      stripe_len;
    BTRFS_BLOCK_GROUP   type;

    /* optimal io alignment for this chunk */
    uint32      io_align;

    /* optimal io width for this chunk */
    uint32      io_width;

    /* minimal io size for this chunk */
    uint32      sector_size;

    /* 2^16 stripes is quite a lot, a second limit is the size of a single
     * item in the btree
     */
    uint16      num_stripes;

    /* sub stripes only matter for raid10 */
    uint16      sub_stripes;
    struct btrfs_stripe     stripe[num_stripes];
    /* additional stripes go here */
};

/*
 * The super block basically lists the main trees of the FS.
 */
struct btrfs_super_block {
    /* The first 4 fields must match struct btrfs_header */
    char        csum[BTRFS_CSUM_SIZE];
    /* FS specific UUID, visible to user */
    char        fsid[BTRFS_FSID_SIZE];
    /* This block number */
    uint64      bytenr;
    uint64      flags;

    /* Allowed to be different from the btrfs_header from here own down */
    uint64      magic;
    uint64      generation;
    uint64      root;
    uint64      chunk_root;
    uint64      log_root;

    /*
     * This member has never been utilized since the very beginning, thus
     * it's always 0 regardless of kernel version.  We always use
     * generation + 1 to read log tree root.  So here we mark it deprecated.
     */
    uint64      __unused_log_root_transid;
    uint64      total_bytes;
    uint64      bytes_used;
    uint64      root_dir_objectid;
    uint64      num_devices;
    uint32      sectorsize;
    uint32      nodesize;
    uint32      __unused_leafsize;
    uint32      stripesize;
    uint32      sys_chunk_array_size;
    uint64      chunk_root_generation;
    uint64      compat_flags;
    uint64      compat_ro_flags;
    uint64      incompat_flags;
    uint16      csum_type;
    uint8       root_level;
    uint8       chunk_root_level;
    uint8       log_root_level;
    struct btrfs_dev_item       dev_item;

    char        label[BTRFS_LABEL_SIZE];

    uint64      cache_generation;
    uint64      uuid_tree_generation;

    /* The UUID written into btree blocks */
    char        metadata_uuid[BTRFS_FSID_SIZE];

    uint64      nr_global_roots;

    /* Future expansion */
    uint64      reserved[27];
    char        sys_chunk_array[BTRFS_SYSTEM_CHUNK_ARRAY_SIZE];
    struct btrfs_root_backup    super_roots[BTRFS_NUM_BACKUP_ROOTS];

    /* Padded to 4096 bytes */
    char        padding[565];
};

struct btrfs_inode_ref {
    uint64      index;
    uint16      name_len;
    char        name[name_len];
};

struct btrfs_inode_extref {
    uint64      parent_objectid;
    uint64      index;
    uint16      name_len;
    char        name[name_len];
};

struct btrfs_timespec {
    uint64      sec;
    uint32      nsec;
};

struct btrfs_inode_item {
    /* nfs style generation number */
    uint64      generation;
    /* transid that last touched this inode */
    uint64      transid;
    uint64      size;
    uint64      nbytes;
    uint64      block_group;
    uint32      nlink;
    uint32      uid;
    uint32      gid;
    uint32      mode;
    uint64      rdev;
    uint64      flags;

    /* modification sequence number for NFS */
    uint64      sequence;

    /*
     * a little future expansion, for more than this we can
     * just grow the inode item and version it
     */
    uint64      reserved[4];
    struct btrfs_timespec   atime;
    struct btrfs_timespec   ctime;
    struct btrfs_timespec   mtime;
    struct btrfs_timespec   otime;
};

struct btrfs_dir_item {
    struct btrfs_disk_key   location;
    uint64      transid;
    uint16      data_len;
    uint16      name_len;
    uint8       type;
    char        name[name_len];
    char        data[data_len];
};

struct btrfs_root_item {
    struct btrfs_inode_item     inode;
    uint64      generation;
    uint64      root_dirid;
    uint64      bytenr;
    uint64      byte_limit;
    uint64      bytes_used;
    uint64      last_snapshot;
    uint64      flags;
    uint32      refs;
    struct btrfs_disk_key   drop_progress;
    uint8       drop_level;
    uint8       level;

    /*
     * The following fields appear after subvol_uuids+subvol_times
     * were introduced.
     */

    /*
     * This generation number is used to test if the new fields are valid
     * and up to date while reading the root item. Every time the root item
     * is written out, the "generation" field is copied into this field. If
     * anyone ever mounted the fs with an older kernel, we will have
     * mismatching generation values here and thus must invalidate the
     * new fields. See btrfs_update_root and btrfs_find_last_root for
     * details.
     * the offset of generation_v2 is also used as the start for the memset
     * when invalidating the fields.
     */
    uint64      generation_v2;
    char        uuid[BTRFS_UUID_SIZE];
    char        parent_uuid[BTRFS_UUID_SIZE];
    char        received_uuid[BTRFS_UUID_SIZE];
    uint64      ctransid; /* updated when an inode changes */
    uint64      otransid; /* trans when created */
    uint64      stransid; /* trans when sent. non-zero for received subvol */
    uint64      rtransid; /* trans when received. non-zero for received subvol */
    struct btrfs_timespec   ctime;
    struct btrfs_timespec   otime;
    struct btrfs_timespec   stime;
    struct btrfs_timespec   rtime;
    uint64 reserved[8]; /* for future */
};

/*
 * this is used for both forward and backward root refs
 */
struct btrfs_root_ref {
    uint64      dirid;
    uint64      sequence;
    uint16      name_len;
    char        name[name_len];
};

enum {
    BTRFS_FILE_EXTENT_INLINE   = 0,
    BTRFS_FILE_EXTENT_REG      = 1,
    BTRFS_FILE_EXTENT_PREALLOC = 2,
    BTRFS_NR_FILE_EXTENT_TYPES = 3,
};

enum {
    BTRFS_COMPRESS_NONE  = 0,
    BTRFS_COMPRESS_ZLIB  = 1,
    BTRFS_COMPRESS_LZO   = 2,
    BTRFS_COMPRESS_ZSTD  = 3,
    BTRFS_NR_COMPRESS_TYPES = 4,
};

struct btrfs_file_extent_item_inline {
    /*
     * transaction id that created this extent
     */
    uint64      generation;
    /*
     * max number of bytes to hold this extent in ram
     * when we split a compressed extent we can't know how big
     * each of the resulting pieces will be.  So, this is
     * an upper limit on the size of the extent in ram instead of
     * an exact limit.
     */
    uint64      ram_bytes;

    /*
     * 32 bits for the various ways we might encode the data,
     * including compression and encryption.  If any of these
     * are set to something a given disk format doesn't understand
     * it is treated like an incompat flag for reading and writing,
     * but not for stat.
     */
    uint8       compression;
    uint8       encryption;
    uint16      other_encoding; /* spare for later use */

    /* are we inline data or a real extent? */
    uint8       type;
};

struct btrfs_file_extent_item_reg {
    /*
     * transaction id that created this extent
     */
    uint64      generation;
    /*
     * max number of bytes to hold this extent in ram
     * when we split a compressed extent we can't know how big
     * each of the resulting pieces will be.  So, this is
     * an upper limit on the size of the extent in ram instead of
     * an exact limit.
     */
    uint64      ram_bytes;

    /*
     * 32 bits for the various ways we might encode the data,
     * including compression and encryption.  If any of these
     * are set to something a given disk format doesn't understand
     * it is treated like an incompat flag for reading and writing,
     * but not for stat.
     */
    uint8       compression;
    uint8       encryption;
    uint16      other_encoding; /* spare for later use */

    /* are we inline data or a real extent? */
    uint8       type;

    /*
     * disk space consumed by the extent, checksum blocks are included
     * in these numbers
     *
     * At this offset in the structure, the inline extent data start.
     */
    uint64      disk_bytenr;
    uint64      disk_num_bytes;
    /*
     * the logical offset in file blocks (no csums)
     * this extent record is for.  This allows a file extent to point
     * into the middle of an existing extent on disk, sharing it
     * between two snapshots (useful if some bytes in the middle of the
     * extent have changed
     */
    uint64      offset;
    /*
     * the logical number of file blocks (no csums included).  This
     * always reflects the size uncompressed and without encoding.
     */
    uint64      num_bytes;
};
"""

c_btrfs = cstruct().load(btrfs_def)

BTRFS_BLOCK_GROUP = c_btrfs.BTRFS_BLOCK_GROUP

BTRFS_BLOCK_GROUP_TYPE_MASK = BTRFS_BLOCK_GROUP.DATA | BTRFS_BLOCK_GROUP.SYSTEM | BTRFS_BLOCK_GROUP.METADATA

BTRFS_BLOCK_GROUP_PROFILE_MASK = (
    BTRFS_BLOCK_GROUP.RAID0
    | BTRFS_BLOCK_GROUP.RAID1
    | BTRFS_BLOCK_GROUP.RAID1C3
    | BTRFS_BLOCK_GROUP.RAID1C4
    | BTRFS_BLOCK_GROUP.RAID5
    | BTRFS_BLOCK_GROUP.RAID6
    | BTRFS_BLOCK_GROUP.DUP
    | BTRFS_BLOCK_GROUP.RAID10
)
BTRFS_BLOCK_GROUP_RAID56_MASK = BTRFS_BLOCK_GROUP.RAID5 | BTRFS_BLOCK_GROUP.RAID6

BTRFS_BLOCK_GROUP_RAID1_MASK = BTRFS_BLOCK_GROUP.RAID1 | BTRFS_BLOCK_GROUP.RAID1C3 | BTRFS_BLOCK_GROUP.RAID1C4

BTRFS_BLOCK_GROUP_STRIPE_MASK = BTRFS_BLOCK_GROUP.RAID0 | BTRFS_BLOCK_GROUP.RAID10 | BTRFS_BLOCK_GROUP_RAID56_MASK

FT_MAP = {
    c_btrfs.BTRFS_FT_UNKNOWN: None,
    c_btrfs.BTRFS_FT_REG_FILE: stat.S_IFREG,
    c_btrfs.BTRFS_FT_DIR: stat.S_IFDIR,
    c_btrfs.BTRFS_FT_CHRDEV: stat.S_IFCHR,
    c_btrfs.BTRFS_FT_BLKDEV: stat.S_IFBLK,
    c_btrfs.BTRFS_FT_FIFO: stat.S_IFIFO,
    c_btrfs.BTRFS_FT_SOCK: stat.S_IFSOCK,
    c_btrfs.BTRFS_FT_SYMLINK: stat.S_IFLNK,
}

BTRFS_RAID_ATTRIBUTES = {
    # (ncopies, nparity, tolerated_failures)
    BTRFS_BLOCK_GROUP(0): (1, 0, 0),  # BTRFS_RAID_SINGLE
    BTRFS_BLOCK_GROUP.RAID0: (1, 0, 0),
    BTRFS_BLOCK_GROUP.RAID1: (2, 0, 1),
    BTRFS_BLOCK_GROUP.DUP: (2, 0, 0),
    BTRFS_BLOCK_GROUP.RAID10: (2, 0, 1),
    BTRFS_BLOCK_GROUP.RAID5: (1, 1, 1),
    BTRFS_BLOCK_GROUP.RAID6: (1, 2, 2),
    BTRFS_BLOCK_GROUP.RAID1C3: (3, 0, 2),
    BTRFS_BLOCK_GROUP.RAID1C4: (4, 0, 3),
}
