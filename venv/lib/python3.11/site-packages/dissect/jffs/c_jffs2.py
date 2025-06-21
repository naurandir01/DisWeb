# References:
# - https://github.com/torvalds/linux/blob/master/include/uapi/linux/jffs2.h
# - https://github.com/torvalds/linux/blob/master/include/linux/fs_types.h

from __future__ import annotations

import stat

from dissect.cstruct import cstruct

jffs2_def = """
/* these are defined by POSIX and also present in glibc's dirent.h */
#define DT_UNKNOWN                      0
#define DT_FIFO                         1
#define DT_CHR                          2
#define DT_DIR                          4
#define DT_BLK                          6
#define DT_REG                          8
#define DT_LNK                          10
#define DT_SOCK                         12
#define DT_WHT                          14

/* Values we may expect to find in the 'magic' field */
#define JFFS2_OLD_MAGIC_BITMASK         0x1984
#define JFFS2_MAGIC_BITMASK             0x1985
#define KSAMTIB_CIGAM_2SFFJ             0x8519      /* For detecting wrong-endian fs */
#define JFFS2_EMPTY_BITMASK             0xffff
#define JFFS2_DIRTY_BITMASK             0x0000

/* Summary node MAGIC marker */
#define JFFS2_SUM_MAGIC                 0x02851885

/* We only allow a single char for length, and 0xFF is empty flash so
   we don't want it confused with a real length. Hence max 254.
*/
#define JFFS2_MAX_NAME_LEN              254

/* How small can we sensibly write nodes? */
#define JFFS2_MIN_DATA_LEN              128

#define JFFS2_COMPR_NONE                0x00
#define JFFS2_COMPR_ZERO                0x01        /* All data in such an inode should be 0x00 */
#define JFFS2_COMPR_RTIME               0x02        /* https://github.com/torvalds/linux/blob/master/fs/jffs2/compr_rtime.c */
#define JFFS2_COMPR_RUBINMIPS           0x03        /* Deprecated. */
#define JFFS2_COMPR_COPY                0x04        /* Never implemented. */
#define JFFS2_COMPR_DYNRUBIN            0x05        /* https://github.com/torvalds/linux/blob/master/fs/jffs2/compr_rubin.c */
#define JFFS2_COMPR_ZLIB                0x06
#define JFFS2_COMPR_LZO                 0x07

/* Compatibility flags. */
#define JFFS2_COMPAT_MASK               0xc000      /* What do to if an unknown nodetype is found */
#define JFFS2_NODE_ACCURATE             0x2000
/* INCOMPAT: Fail to mount the filesystem */
#define JFFS2_FEATURE_INCOMPAT          0xc000
/* ROCOMPAT: Mount read-only */
#define JFFS2_FEATURE_ROCOMPAT          0x8000
/* RWCOMPAT_COPY: Mount read/write, and copy the node when it's GC'd */
#define JFFS2_FEATURE_RWCOMPAT_COPY     0x4000
/* RWCOMPAT_DELETE: Mount read/write, and delete the node when it's GC'd */
#define JFFS2_FEATURE_RWCOMPAT_DELETE   0x0000

#define JFFS2_NODETYPE_DIRENT           (JFFS2_FEATURE_INCOMPAT | JFFS2_NODE_ACCURATE | 1)
#define JFFS2_NODETYPE_INODE            (JFFS2_FEATURE_INCOMPAT | JFFS2_NODE_ACCURATE | 2)
#define JFFS2_NODETYPE_CLEANMARKER      (JFFS2_FEATURE_RWCOMPAT_DELETE | JFFS2_NODE_ACCURATE | 3)
#define JFFS2_NODETYPE_PADDING          (JFFS2_FEATURE_RWCOMPAT_DELETE | JFFS2_NODE_ACCURATE | 4)

#define JFFS2_NODETYPE_SUMMARY          (JFFS2_FEATURE_RWCOMPAT_DELETE | JFFS2_NODE_ACCURATE | 6)

#define JFFS2_NODETYPE_XATTR            (JFFS2_FEATURE_INCOMPAT | JFFS2_NODE_ACCURATE | 8)
#define JFFS2_NODETYPE_XREF             (JFFS2_FEATURE_INCOMPAT | JFFS2_NODE_ACCURATE | 9)

/* XATTR Related */
#define JFFS2_XPREFIX_USER              1           /* for "user." */
#define JFFS2_XPREFIX_SECURITY          2           /* for "security." */
#define JFFS2_XPREFIX_ACL_ACCESS        3           /* for "system.posix_acl_access" */
#define JFFS2_XPREFIX_ACL_DEFAULT       4           /* for "system.posix_acl_default" */
#define JFFS2_XPREFIX_TRUSTED           5           /* for "trusted.*" */

#define JFFS2_ACL_VERSION               0x0001

#define JFFS2_INO_FLAG_PREREAD          1           /* Do read_inode() for this one at
                                                       mount time, don't wait for it to
                                                       happen later */
#define JFFS2_INO_FLAG_USERCOMPR        2           /* User has requested a specific
                                                       compression type */

struct jffs2_unknown_node {
    /* All start like this */
    uint16  magic;
    uint16  nodetype;
    uint32  totlen;             /* So we can skip over nodes we don't grok */
    uint32  hdr_crc;
};

struct jffs2_raw_dirent {
    uint16  magic;
    uint16  nodetype;           /* == JFFS2_NODETYPE_DIRENT */
    uint32  totlen;
    uint32  hdr_crc;
    uint32  pino;
    uint32  version;
    uint32  ino;                /* == zero for unlink */
    uint32  mctime;
    uint8   nsize;
    uint8   type;
    uint8   unused[2];
    uint32  node_crc;
    uint32  name_crc;
    char    name[nsize];
};

/* The JFFS2 raw inode structure: Used for storage on physical media.  */
/* The uid, gid, atime, mtime and ctime members could be longer, but
   are left like this for space efficiency. If and when people decide
   they really need them extended, it's simple enough to add support for
   a new type of raw node.
*/
struct jffs2_raw_inode {
    uint16  magic;              /* A constant magic number.  */
    uint16  nodetype;           /* == JFFS2_NODETYPE_INODE */
    uint32  totlen;             /* Total length of this node (inc data, etc.) */
    uint32  hdr_crc;
    uint32  ino;                /* Inode number.  */
    uint32  version;            /* Version number.  */
    uint32  mode;               /* The file's type or mode.  */
    uint16  uid;                /* The file's owner.  */
    uint16  gid;                /* The file's group.  */
    uint32  isize;              /* Total resultant size of this inode (used for truncations)  */
    uint32  atime;              /* Last access time.  */
    uint32  mtime;              /* Last modification time.  */
    uint32  ctime;              /* Change time.  */
    uint32  offset;             /* Where to begin to write.  */
    uint32  csize;              /* (Compressed) data size */
    uint32  dsize;              /* Size of the node's data. (after decompression) */
    uint8   compr;              /* Compression algorithm used */
    uint8   usercompr;          /* Compression algorithm requested by the user */
    uint16  flags;              /* See JFFS2_INO_FLAG_* */
    uint32  data_crc;           /* CRC for the (compressed) data.  */
    uint32  node_crc;           /* CRC for the raw inode (excluding data)  */
    // char    data[csize];
};

struct jffs2_raw_xattr {
    uint16  magic;
    uint16  nodetype;           /* = JFFS2_NODETYPE_XATTR */
    uint32  totlen;
    uint32  hdr_crc;
    uint32  xid;                /* XATTR identifier number */
    uint32  version;
    uint8   xprefix;
    uint8   name_len;
    uint16  value_len;
    uint32  data_crc;
    uint32  node_crc;
    uint8   data[0];
};

struct jffs2_raw_xref {
    uint16  magic;
    uint16  nodetype;           /* = JFFS2_NODETYPE_XREF */
    uint32  totlen;
    uint32  hdr_crc;
    uint32  ino;                /* inode number */
    uint32  xid;                /* XATTR identifier number */
    uint32  xseqno;             /* xref sequential number */
    uint32  node_crc;
};

struct jffs2_raw_summary {
    uint16  magic;
    uint16  nodetype;           /* = JFFS2_NODETYPE_SUMMARY */
    uint32  totlen;
    uint32  hdr_crc;
    uint32  sum_num;            /* number of sum entries*/
    uint32  cln_mkr;            /* clean marker size, 0 = no cleanmarker */
    uint32  padded;             /* sum of the size of padding nodes */
    uint32  sum_crc;            /* summary information crc */
    uint32  node_crc;           /* node crc */
    uint32  sum[0];             /* inode summary info */
};

/* Data payload for device nodes. */
union jffs2_device_node {
    uint16  old_id;
    uint32  new_id;
};
"""  # noqa

c_jffs2 = cstruct().load(jffs2_def)

JFFS2_MAGIC_NUMBERS = (c_jffs2.JFFS2_MAGIC_BITMASK, c_jffs2.JFFS2_OLD_MAGIC_BITMASK)

DT_MAP = {
    c_jffs2.DT_UNKNOWN: None,
    c_jffs2.DT_FIFO: stat.S_IFIFO,
    c_jffs2.DT_CHR: stat.S_IFCHR,
    c_jffs2.DT_DIR: stat.S_IFDIR,
    c_jffs2.DT_BLK: stat.S_IFBLK,
    c_jffs2.DT_REG: stat.S_IFREG,
    c_jffs2.DT_LNK: stat.S_IFLNK,
    c_jffs2.DT_SOCK: stat.S_IFSOCK,
    c_jffs2.DT_WHT: stat.S_IFWHT,
}
