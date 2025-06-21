from __future__ import annotations

from dissect.cstruct import cstruct

jdb2_def = """
#define JBD2_MAGIC_NUMBER                   0xC03B3998

#define JBD2_DESCRIPTOR_BLOCK               1
#define JBD2_COMMIT_BLOCK                   2
#define JBD2_SUPERBLOCK_V1                  3
#define JBD2_SUPERBLOCK_V2                  4
#define JBD2_REVOKE_BLOCK                   5

#define JBD2_CRC32_CHKSUM                   1
#define JBD2_MD5_CHKSUM                     2
#define JBD2_SHA1_CHKSUM                    3
#define JBD2_CRC32C_CHKSUM                  4
#define JBD2_CRC32_CHKSUM_SIZE              4

#define JBD2_FLAG_ESCAPE                    1   // on-disk block is escaped
#define JBD2_FLAG_SAME_UUID                 2   // block has same uuid as previous
#define JBD2_FLAG_DELETED                   4   // block deleted by this transaction
#define JBD2_FLAG_LAST_TAG                  8   // last tag in this descriptor block

#define JBD2_FEATURE_COMPAT_CHECKSUM        0x00000001

#define JBD2_FEATURE_INCOMPAT_REVOKE        0x00000001
#define JBD2_FEATURE_INCOMPAT_64BIT         0x00000002
#define JBD2_FEATURE_INCOMPAT_ASYNC_COMMIT  0x00000004
#define JBD2_FEATURE_INCOMPAT_CSUM_V2       0x00000008
#define JBD2_FEATURE_INCOMPAT_CSUM_V3       0x00000010

struct journal_header {
    uint32  h_magic;
    uint32  h_blocktype;
    uint32  h_sequence;
};

struct journal_superblock {
    journal_header s_header;
    /* Static information describing the journal */
    uint32  s_blocksize;            /* journal device blocksize */
    uint32  s_maxlen;               /* total blocks in journal file */
    uint32  s_first;                /* first block of log information */
    /* Dynamic information describing the current state of the log */
    uint32  s_sequence;             /* first commit ID expected in log */
    uint32  s_start;                /* blocknr of start of log */
    uint32  s_errno;
    /* Remaining fields are only valid in a version-2 superblock */
    uint32  s_feature_compat;       /* compatible feature set */
    uint32  s_feature_incompat;     /* incompatible feature set */
    uint32  s_feature_ro_compat;    /* readonly-compatible feature set */
    char    s_uuid[16];             /* 128-bit uuid for journal */
    uint32  s_nr_users;             /* Nr of filesystems sharing log */
    uint32  s_dynsuper;             /* Blocknr of dynamic superblock copy*/
    uint32  s_max_transaction;      /* Limit of journal blocks per trans.*/
    uint32  s_max_trans_data;       /* Limit of data blocks per trans. */
    uint8   s_checksum_type;        /* checksum type */
    char    s_padding2[3];
    char    s_padding[168];
    uint32  s_checksum;             /* crc32c(superblock) */
    uint8   s_users[16*48];         /* ids of all fs'es sharing the log */
};

struct commit_header {
    uint32  h_magic;
    uint32  h_blocktype;
    uint32  h_sequence;
    uint8   h_chksum_type;
    uint8   h_chksum_size;
    char    h_padding[2];
    char    h_chksum[32];
    uint64  h_commit_sec;
    uint32  h_commit_nsec;
};

struct journal_block_tag {
    uint32  t_blocknr;          /* The on-disk block number */
    uint16  t_checksum;         /* truncated crc32c(uuid+seq+block) */
    uint16  t_flags;            /* See below */
    uint32  t_blocknr_high;     /* most-significant high 32bits. */
};

struct journal_block_tag3 {
    uint32  t_blocknr;          /* The on-disk block number */
    uint32  t_flags;            /* See below */
    uint32  t_blocknr_high;     /* most-significant high 32bits. */
    uint32  t_checksum;         /* crc32c(uuid+seq+block) */
};
"""

c_jdb2 = cstruct(endian=">").load(jdb2_def)
