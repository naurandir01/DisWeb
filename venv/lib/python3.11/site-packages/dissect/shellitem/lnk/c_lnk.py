from __future__ import annotations

from enum import IntEnum

from dissect.cstruct import cstruct

# structs are reconstructed as faithfull as possible from MS documentation
# reference: https://winprotocoldoc.blob.core.windows.net/productionwindowsarchives/MS-SHLLINK/%5bMS-SHLLINK%5d.pdf

lnk_def = """
flag FILE_ATTRIBUTE : uint32 {
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

flag COMMON_NETWORK_RELATIVE_LINK_FLAGS : uint32 {
    default         = 0x00000000,                               // default value returned when no flags are set.
    valid_device    = 0x00000001,                               // If set, the DeviceNameOffset field contains an offset to the device name. If not set, the DeviceNameOffset field does not contain an offset to the device name, and its value MUST be zero.
    valid_net_type  = 0x00000002,                               // If set, the NetProviderType field contains the network provider type. If not set, the NetProviderType field does not contain the network provider type, and its value MUST be zero.
    unused                                                      // Remainder of the struct, which is currently unused.
};

flag LINK_INFO_FLAGS : uint32 {
    default                                     = 0x00000000,   // default value returned when no flags are set.
    volumeid_and_local_basepath                 = 0x00000001,   // If set, the VolumeID and LocalBasePath fields are present, and their locations are specified by the values of the VolumeIDOffset and LocalBasePathOffset fields, respectively. If the value of the LinkInfoHeaderSize field is greater than or equal to 0x00000024, the LocalBasePathUnicode field is present, and its location is specified by the value of the LocalBasePathOffsetUnicode field. If not set, the VolumeID, LocalBasePath, and LocalBasePathUnicode fields are not present, and the values of the VolumeIDOffset and LocalBasePathOffset fields are zero. If the value of the LinkInfoHeaderSize field is greater than or equal to 0x00000024, the value of the LocalBasePathOffsetUnicode field is zero.
    common_network_relative_link_and_pathsuffix = 0x00000002,   // If set, the CommonNetworkRelativeLink field is present, and its location is specified by the value of the CommonNetworkRelativeLinkOffset field. If not set, the CommonNetworkRelativeLink field is not present, and the value of the CommonNetworkRelativeLinkOffset field is zero.
    unused                                                      // Remainder of the struct, which is currently unused.
};

flag LINK_FLAGS : uint32 {
    default                           = 0x00000000,             // default value returned when no flags are set.
    has_link_target_idlist            = 0x00000001,             // The shell link is saved with an item ID list (IDList). If this bit is set, a LinkTargetIDList structure (section 2.2) MUST follow the ShellLinkHeader. If this bit is not set, this structure MUST NOT be present.
    has_link_info                     = 0x00000002,             // The shell link is saved with link information. If this bit is set, a LinkInfo structure (section 2.3) MUST be present. If this bit is not set, this structure MUST NOT be present.
    has_name                          = 0x00000004,             // The shell link is saved with a name string. If this bit is set, a NAME_STRING StringData structure (section 2.4) MUST be present. If this bit is not set, this structure MUST NOT be present.
    has_relative_path                 = 0x00000008,             // The shell link is saved with a relative path string. If this bit is set, a RELATIVE_PATH StringData structure (section 2.4) MUST be present. If this bit is not set, this structure MUST NOT be present.
    has_working_dir                   = 0x00000010,             // The shell link is saved with a working directory string. If this bit is set, a WORKING_DIR StringData structure (section 2.4) MUST be present. If this bit is not set, this structure MUST NOT be present.
    has_arguments                     = 0x00000020,             // The shell link is saved with command line arguments. If this bit is set, a COMMAND_LINE_ARGUMENTS StringData structure (section 2.4) MUST be present. If this bit is not set, this structure MUST NOT be present.
    has_icon_location                 = 0x00000040,             // The shell link is saved with an icon location string. If this bit is set, an ICON_LOCATION StringData structure (section 2.4) MUST be present. If this bit is not set, this structure MUST NOT be present
    is_unicode                        = 0x00000080,             // The shell link contains Unicode encoded strings. This bit SHOULD be set. If this bit is set, the StringData section contains Unicode-encoded strings; otherwise, it contains strings that are encoded using the system default code page.
    force_nolink_info                 = 0x00000100,             // The LinkInfo structure (section 2.3) is ignored.
    has_exp_string                    = 0x00000200,             // The shell link is saved with an EnvironmentVariableDataBlock (section 2.5.4).
    run_in_seperate_process           = 0x00000400,             // The target is run in a separate virtual machine when launching a link target that is a 16-bit application.
    has_logo3id                       = 0x00000800,
    has_darwinid                      = 0x00001000,             // The shell link is saved with a DarwinDataBlock (section 2.5.3).
    run_as_user                       = 0x00002000,             // The application is run as a different user when the target of the shell link is activated.
    has_exp_icon                      = 0x00004000,             // The shell link is saved with an IconEnvironmentDataBlock (section 2.5.5).
    no_pidl_alias                     = 0x00008000,             // The file system location is represented in the shell namespace when the path to an item is parsed into an IDList.
    force_uncname                     = 0x00010000,
    run_with_shimlayer                = 0x00020000,             // The shell link is saved with a ShimDataBlock (section 2.5.8).
    force_no_link_tract               = 0x00040000,             // The TrackerDataBlock (section 2.5.10) is ignored.
    enable_target_metadata            = 0x00080000,             // The shell link attempts to collect target properties and store them in the PropertyStoreDataBlock (section 2.5.7) when the link target is set.
    disable_link_path_tracking        = 0x00100000,             // The EnvironmentVariableDataBlock is ignored.
    disable_known_folder_tracking     = 0x00200000,             // The SpecialFolderDataBlock (section 2.5.9) and the DisableKnownFolderTracking KnownFolderDataBlock (section 2.5.6) are ignored when loading the shell link. If this bit is set, these extra data blocks SHOULD NOT be saved when saving the shell link.
    disable_known_folder_alias        = 0x00400000,             // If the link has a KnownFolderDataBlock (section 2.5.6), the unaliased form of the known folder IDList SHOULD be used when translating the target IDList at the time that the link is loaded.
    allow_link_to_link                = 0x00800000,             // Creating a link that references another link is enabled. Otherwise, specifying a link as the target IDList SHOULD NOT be allowed.
    unalias_on_save                   = 0x01000000,             // When saving a link for which the target IDList is under a known folder, either the unaliased form of that known folder or the target IDList SHOULD be used.
    prefer_environment_path           = 0x02000000,             // The target IDList SHOULD NOT be stored; instead, the path specified in the EnvironmentVariableDataBlock (section 2.5.4) SHOULD be used to refer to the target.
    keep_localid_list_for_unc_target  = 0x04000000,             // When the target is a UNC name that refers to a location on a local machine, the local path IDList in the PropertyStoreDataBlock (section 2.5.7) SHOULD be stored, so it can be used when the link is loaded on the local machine.
    presist_volume_id_relative        = 0x08000000,
    is_valid                          = 0x003FF7FF,
    reserved
};

typedef struct STRING_DATA {
    uint16 character_count;                     // A 16-bit, unsigned integer that specifies either the number of characters, defined by the system default code page, or the number of Unicode characters found in the String field. A value of zero specifies an empty string.
    char string[character_count];               // An optional set of characters, defined by the system default code page, or a Unicode string with a length specified by the CountCharacters field. This string MUST NOT be NULL-terminated.
};

typedef struct VOLUME_ID_UNICODE {
    uint32 volumeid_size;                       // A 32-bit, unsigned integer that specifies the size, in bytes, of this structure. This value MUST be greater than 0x00000010. All offsets specified in this structure MUST be less than this value, and all strings contained in this structure MUST fit within the extent defined by this size.
    uint32 drive_type;                          // A 32-bit, unsigned integer that specifies the type of drive the link target is stored on. This value MUST be one of the following:
    uint32 drive_serial_number;                 // A 32-bit, unsigned integer that specifies the drive serial number of the volume the link target is stored on.
    uint32 volume_label_offset;                 // A 32-bit, unsigned integer that specifies the location of a string that contains the volume label of the drive that the link target is stored on. This value is an offset, in bytes, from the start of the VolumeID structure to a NULL-terminated string of characters, defined by the system default code page. The volume label string is located in the Data field of this structure. If the value of this field is 0x00000014, it MUST be ignored, and the value of the VolumeLabelOffsetUnicode field MUST be used to locate the volume label string.
    uint32 volume_label_offset_unicode;         // An optional, 32-bit, unsigned integer that specifies the location of a string that contains the volume label of the drive that the link target is stored on. This value is an offset, in bytes, from the start of the VolumeID structure to a NULL-terminated string of Unicode characters. The volume label string is located in the Data field of this structure. If the value of the VolumeLabelOffset field is not 0x00000014, this field MUST NOT be present; instead, the value of the VolumeLabelOffset field MUST be used to locate the volume label string.
    char data[volumeid_size - 20];              // A buffer of data that contains the volume label of the drive as a string defined by the system default code page or Unicode characters, as specified by preceding fields. We minus 20 this to account for the red bytes beforehand
};

typedef struct VOLUME_ID {
    uint32 volumeid_size;                       // A 32-bit, unsigned integer that specifies the size, in bytes, of this structure. This value MUST be greater than 0x00000010. All offsets specified in this structure MUST be less than this value, and all strings contained in this structure MUST fit within the extent defined by this size.
    uint32 drive_type;                          // A 32-bit, unsigned integer that specifies the type of drive the link target is stored on. This value MUST be one of the following:
    uint32 drive_serial_number;                 // A 32-bit, unsigned integer that specifies the drive serial number of the volume the link target is stored on.
    uint32 volume_label_offset;                 // A 32-bit, unsigned integer that specifies the location of a string that contains the volume label of the drive that the link target is stored on. This value is an offset, in bytes, from the start of the VolumeID structure to a NULL-terminated string of characters, defined by the system default code page. The volume label string is located in the Data field of this structure. If the value of this field is 0x00000014, it MUST be ignored, and the value of the VolumeLabelOffsetUnicode field MUST be used to locate the volume label string.
    char data[volumeid_size - 16];              // A buffer of data that contains the volume label of the drive as a string defined by the system default code page or Unicode characters, as specified by preceding fields. We minus 16 this to account for the red bytes beforehand
};

typedef struct NET_NAME {
    char net_name[];                            // A NULL–terminated string, as defined by the system default code page, which specifies a server share path; for example, "\\\\server\\share".
};

typedef struct DEVICE_NAME {
    char device_name[];                         // A NULL–terminated string, as defined by the system default code page, which specifies a device; for example, the drive letter "D:".
};

// TODO create unicode version
typedef struct COMMON_NETWORK_RELATIVE_LINK_HEADER {
    uint32 common_network_relative_link_size;    // A 32-bit, unsigned integer that specifies the size, in bytes, of the CommonNetworkRelativeLink structure. This value MUST be greater than or equal to 0x00000014. All offsets specified in this structure MUST be less than this value, and all strings contained in this structure MUST fit within the extent defined by this size.
    COMMON_NETWORK_RELATIVE_LINK_FLAGS common_network_relative_link_flags;   // Flags that specify the contents of the DeviceNameOffset and NetProviderType fields.
    uint32 net_name_offset;                      // A 32-bit, unsigned integer that specifies the location of the NetName field. This value is an offset, in bytes, from the start of the CommonNetworkRelativeLink structure.
    uint32 device_name_offset;                   // A 32-bit, unsigned integer that specifies the location of the DeviceName field. If the ValidDevice flag is set, this value is an offset, in bytes, from the start of the CommonNetworkRelativeLink structure; otherwise, this value MUST be zero.
    uint32 net_provider_type;                    // A 32-bit, unsigned integer that specifies the type of network provider. If the ValidNetType flag is set, this value MUST be one of the following; otherwise, this value MUST be ignored.
};

// TODO create unicode version
typedef struct COMMON_NETWORK_RELATIVE_LINK {
    uint32 common_network_relative_link_size;    // A 32-bit, unsigned integer that specifies the size, in bytes, of the CommonNetworkRelativeLink structure. This value MUST be greater than or equal to 0x00000014. All offsets specified in this structure MUST be less than this value, and all strings contained in this structure MUST fit within the extent defined by this size.
    COMMON_NETWORK_RELATIVE_LINK_FLAGS common_network_relative_link_flags;   // Flags that specify the contents of the DeviceNameOffset and NetProviderType fields.
    uint32 net_name_offset;                      // A 32-bit, unsigned integer that specifies the location of the NetName field. This value is an offset, in bytes, from the start of the CommonNetworkRelativeLink structure.
    uint32 device_name_offset;                   // A 32-bit, unsigned integer that specifies the location of the DeviceName field. If the ValidDevice flag is set, this value is an offset, in bytes, from the start of the CommonNetworkRelativeLink structure; otherwise, this value MUST be zero.
    uint32 net_provider_type;                    // A 32-bit, unsigned integer that specifies the type of network provider. If the ValidNetType flag is set, this value MUST be one of the following; otherwise, this value MUST be ignored.
    NET_NAME net_name;
    DEVICE_NAME device_name;
};

typedef struct LINK_INFO_FLAGS1 {
    uint32  volumeid_and_local_basepath:1;                 // If set, the VolumeID and LocalBasePath fields are present, and their locations are specified by the values of the VolumeIDOffset and LocalBasePathOffset fields, respectively. If the value of the LinkInfoHeaderSize field is greater than or equal to 0x00000024, the LocalBasePathUnicode field is present, and its location is specified by the value of the LocalBasePathOffsetUnicode field. If not set, the VolumeID, LocalBasePath, and LocalBasePathUnicode fields are not present, and the values of the VolumeIDOffset and LocalBasePathOffset fields are zero. If the value of the LinkInfoHeaderSize field is greater than or equal to 0x00000024, the value of the LocalBasePathOffsetUnicode field is zero.
    uint32  common_network_relative_link_and_pathsuffix:1; // If set, the CommonNetworkRelativeLink field is present, and its location is specified by the value of the CommonNetworkRelativeLinkOffset field. If not set, the CommonNetworkRelativeLink field is not present, and the value of the CommonNetworkRelativeLinkOffset field is zero.
    uint32  unused:30;                                     // Remainder of the struct, which is currently unused.
};

typedef struct LINK_INFO_HEADER {
    uint32 link_info_size;                      // A 32-bit, unsigned integer that specifies the size, in bytes, of the LinkInfo structure. All offsets specified in this structure MUST be less than this value, and all strings contained in this structure MUST fit within the extent defined by this size.
    uint32 link_info_header_size;               // A 32-bit, unsigned integer that specifies the size, in bytes, of the LinkInfo header section, which is composed of the LinkInfoSize, LinkInfoHeaderSize, LinkInfoFlags, VolumeIDOffset, LocalBasePathOffset, CommonNetworkRelativeLinkOffset, CommonPathSuffixOffset fields, and, if included, the LocalBasePathOffsetUnicode and CommonPathSuffixOffsetUnicode fields.
    LINK_INFO_FLAGS link_info_flags;            // Flags that specify whether the VolumeID, LocalBasePath, LocalBasePathUnicode, and CommonNetworkRelativeLink fields are present in this structure.
}

typedef struct LINK_INFO_BODY {
    uint32 volumeid_offset;                     // A 32-bit, unsigned integer that specifies the location of the VolumeID field. If the VolumeIDAndLocalBasePath flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 local_basepath_offset;               // A 32-bit, unsigned integer that specifies the location of the LocalBasePath field. If the VolumeIDAndLocalBasePath flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 common_network_relative_link_offset; // A 32-bit, unsigned integer that specifies the location of the CommonNetworkRelativeLink field. If the CommonNetworkRelativeLinkAndPathSuffix flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 common_pathsuffix_offset;            // A 32-bit, unsigned integer that specifies the location of the CommonPathSuffix field. This value is an offset, in bytes, from the start of the LinkInfo structure.
};

typedef struct LOCAL_BASE_PATH {
    char local_base_path[];
};

typedef struct COMMON_PATH_SUFFIX {
    char common_path_suffix[];
};

typedef struct ITEMID {
    uint16 itemid_size;                         // A 16-bit, unsigned integer that specifies the size, in bytes, of the ItemID structure, including the ItemIDSize field.
    char data[itemid_size];                     // The shell data source-defined data that specifies an item.
};

typedef struct IDLIST {
    ITEMID itemid_list;                         // An array of zero or more ItemID structures (section 2.2.2).
    uint16 terminalid;                          // A 16-bit, unsigned integer that indicates the end of the item IDs. This value MUST be zero.
};

typedef struct LINK_TARGET_IDLIST {
    uint16  idlist_size;                        // The size, in bytes, of the IDList field.
    IDLIST  idlist;                             // A stored IDList structure (section 2.2.1), which contains the item ID list. An IDList structure conforms to the following ABNF [RFC5234].
};

typedef struct HOTKEY_FLAGS {
    uint8 keycode;                              // An 8-bit unsigned integer that specifies a virtual key code that corresponds to a key on the keyboard. This value MUST be one of the following. 0x00 is no key used.
    uint8 modifier;                             // An 8-bit unsigned integer that specifies bits that correspond to modifier keys on the keyboard. This value MUST be one or a combination of the following. 0x00 is no modifier used.
};

typedef struct SHELL_LINK_HEADER {
    uint32          header_size;                // The size, in bytes, of this structure. This value MUST be 0x0000004C
    char            link_clsid[16];             // A class identifier (CLSID). This value MUST be 00021401-0000-0000-C000-000000000046.
    LINK_FLAGS      link_flags;                 // A LinkFlags structure (section 2.1.1) that specifies information about the shell link and the presence of optional portions of the structure.
    FILE_ATTRIBUTE  file_flags;                 // A FileAttributesFlags structure (section 2.1.2) that specifies information about the link target.
    uint64          creation_time;              // A FILETIME structure ([MS-DTYP] section 2.3.3) that specifies the creation time of the link target in UTC (Coordinated Universal Time). If the value is zero, there is no creation time set on the link target.
    uint64          access_time;                // A FILETIME structure ([MS-DTYP] section 2.3.3) that specifies the access time of the link target in UTC (Coordinated Universal Time). If the value is zero, there is no access time set on the link target.
    uint64          write_time;                 // A FILETIME structure ([MS-DTYP] section 2.3.3) that specifies the write time of the link target in UTC (Coordinated Universal Time). If the value is zero, there is no write time set on the link target.
    uint32          filesize;                   // A 32-bit unsigned integer that specifies the size, in bytes, of the link target. If the link target file is larger than 0xFFFFFFFF, this value specifies the least significant 32 bits of the link target file size.
    uint32          icon_index;                 // A 32-bit signed integer that specifies the index of an icon within a given icon location.
    uint32          show_command;               // A 32-bit unsigned integer that specifies the expected window state of an application launched by the link. This value SHOULD be one of the following. SW_SHOWNORMAL 0x00000001, SW_SHOWMAXIMIZED 0x00000003, SW_SHOWMINNOACTIVE 0x00000007. All other values MUST be treated as SW_SHOWNORMAL.
    HOTKEY_FLAGS    hotkey_flags;               // A HotKeyFlags structure (section 2.1.3) that specifies the keystrokes used to launch the application referenced by the shortcut key. This value is assigned to the application after it is launched, so that pressing the key activates that application.
    uint16          reserved1;                  // A value that MUST be zero.
    uint32          reserved2;                  // A value that MUST be zero.
    uint32          reserved3;                  // A value that MUST be zero.
};

//  A structure consisting of zero or more property data blocks followed by a terminal block.
typedef struct EXTRA_DATA {
    char    extra_data_block[];                 // A structure consisting of any one of the property data blocks, described in EXTRA_DATA_BLOCK_SIGNATURES
    uint32  terminal_block;                     // A structure that indicates the end of the extra data section.
};

typedef struct EXTRA_DATA_BLOCK_HEADER {
    uint32  block_size;                        // A 32-bit, unsigned integer that specifies the size of the data block
    uint32  block_signature;                   // A 32-bit, unsigned integer that specifies the signature of the data block data.
};

typedef struct TRACKER_PROPS {
    uint32  length;                            // A 32-bit, unsigned integer that specifies the size of the rest of the TrackerDataBlock structure, including this Length field. This value MUST be 0x00000058.
    uint32  version;                           // 32-bit, unsigned integer. This value MUST be 0x00000000.
    char    machine_id[16];                    // A NULL–terminated character string, as defined by the system default code page, which specifies the NetBIOS name of the machine where the link target was last known to reside.
    char    volume_droid[16];                  // Two values in GUID packet representation ([MS-DTYP] section 2.3.4.2) that are used to find the link target with the Link Tracking service, as described in [MS-DLTW].
    char    file_droid[16];                    // Two values in GUID packet representation ([MS-DTYP] section 2.3.4.2) that are used to find the link target with the Link Tracking service, as described in [MS-DLTW].
    char    volume_droid_birth[16];            // Two values in GUID packet representation that are used to find the link target with the Link Tracking service
    char    file_droid_birth[16];              // Two values in GUID packet representation that are used to find the link target with the Link Tracking service
};

typedef struct FONT_SIZE {
    uint16 height;
    uint16 width;
};

typedef struct CONSOLE_PROPS {
    uint16  fill_attributes;
    uint16  popup_fill_attributes;
    uint16  screen_buffersize_x;
    uint16  screen_buffersize_y;
    uint16  window_size_x;
    uint16  window_size_y;
    uint16  window_origin_x;
    uint16  window_origin_y;
    uint32  unused1;
    uint32  unused2;
    FONT_SIZE  font_size;
    uint32  font_family;
    uint32  font_weight;
    char    face_name[32 * 2];
    uint32  cursor_size;
    uint32  fullscreen;
    uint32  quickedit;
    uint32  insertmode;
    uint32  autoposition;
    uint32  history_buffersize;
    uint32  number_of_history_buffers;
    uint32  history_no_dup;
    char  color_table[64];
};

typedef struct TYPED_PROPERTY_VALUE {
    uint16 type;                        // MUST be a value from the PropertyType enumeration, indicating the type of property represented.
    char padding[2];                    // MUST be set to zero, and any nonzero value SHOULD be rejected.
    char value[];                       // MUST be the value of the property represented and serialized according to the value of Type as indicated in section 2.14 of [MS-OLEPS]
};

typedef struct SERIALIZED_PROPERTY_STRING_VALUE {
    uint32  value_size;                 // An unsigned integer that specifies the total size, in bytes, of this structure. It MUST be 0x00000000 if this is the last The Serialized Property Value in the enclosing Serialized Property Storage structure.
    uint32  name_size;                  // An unsigned integer that specifies the size, in bytes, of the Name field, including the null-terminating character.
    char    reserved;                   // must be 0x00
    char    name[name_size];            // A null-terminated Unicode string that specifies the identity of the property. It has to be unique within the enclosing Serialized Property Storage structure.
    TYPED_PROPERTY_VALUE value[value_size - name_size - 9];       // A TypedPropertyValue structure, as specified in [MS-OLEPS] section 2.15.
};

typedef struct SERIALIZED_PROPERTY_INTEGER_VALUE {
    uint32  value_size;                 // An unsigned integer that specifies the total size, in bytes, of this structure. It MUST be 0x00000000 if this is the last Serialized Property Value in the enclosing Serialized Property Storage structure.
    uint32  id;                         // An unsigned integer that specifies the identity of the property. It MUST be unique within the enclosing Serialized Property Storage structure.
    char    reserved;                   // Must be 0x00
    TYPED_PROPERTY_VALUE value[value_size - 9];  // A TypedPropertyValue structure, as specified in [MS-OLEPS] section 2.15
};

typedef struct PROPERTY_STORE_PROPS {
    uint32  storage_size;
    uint32  version;
    char    format_id[16]; // GUID
    char    serialized_property_value[storage_size - 24]; // A sequence of one or more property values. If the Format ID field is equal to the GUID {D5CDD505-2E9C-101B-9397-08002B2CF9AE}, then all values in the sequence MUST be Serialized Property Value (String Name) structures, as specified in section 2.3.1; otherwise, all values MUST be Serialized Property Value (Integer Name) structures, as specified in section 2.3.2. The last Serialized Property Value in the sequence MUST specify 0x00000 for the Value Size.
};

typedef struct CUSTOMDESTINATION_LINK_HEADER {
    uint32 customdestination_version[4];
    uint32 jumplist_entries;
    char customdestination_clsid[16];
}

typedef struct VISTA_AND_ABOVE_IDLIST_PROPS {
    //uint32 block_size;              // A 32-bit, unsigned integer that specifies the size of the VistaAndAboveIDListDataBlock structure. This value MUST be greater than or equal to 0x0000000A.
    //uint32 block_signature;         // A 32-bit, unsigned integer that specifies the signature of the VistaAndAboveIDListDataBlock extra data section. This value MUST be 0xA000000C.
    IDLIST idlist;                      // IDList (variable): An IDList structure (section 2.2.1)
};

typedef struct ENVIRONMENT_PROPS {
    char target_ansi[260];             // A NULL-terminated string, defined by the system default code page, which specifies a path to environment variable information.
    char target_unicode[520];          // An optional, NULL-terminated, Unicode string that specifies a path to environment variable information.
};

typedef struct ICON_ENVIRONMENT_PROPS {
    char target_ansi[260];             // A NULL-terminated string, defined by the system default code page, which specifies a path to environment variable information.
    char target_unicode[520];          // An optional, NULL-terminated, Unicode string that specifies a path to environment variable information.
};

typedef struct SPECIAL_FOLDER_PROPS {
    uint32 special_folder_id;          // A 32-bit, unsigned integer that specifies the folder integer ID.
    uint32 offset;                     // A 32-bit, unsigned integer that specifies the location of the ItemID of the first child segment of the IDList specified by SpecialFolderID. This value is the offset, in bytes, into the link target IDList.
};

typedef struct DARWIN_PROPS {
    char darwin_data_ansi[260];        // A NULL–terminated string, defined by the system default code page, which specifies an application identifier. This field SHOULD be ignored.
    char darwin_data_unicode[520];     // An optional, NULL–terminated, Unicode string that specifies an application identifier.
};

typedef struct KNOWN_FOLDER_PROPS {
    char known_folder_id[16];          // A value in GUID packet representation ([MS-DTYP] section 2.3.4.2) that specifies the folder GUID ID.
    uint32 offset;                     // A 32-bit, unsigned integer that specifies the location of the ItemID of the first child segment of the IDList specified by KnownFolderID. This value is the offset, in bytes, into the link target IDList.
};

 typedef struct LINK_INFO {
    uint32 link_info_size;                       // A 32-bit, unsigned integer that specifies the size, in bytes, of the LinkInfo structure. All offsets specified in this structure MUST be less than this value, and all strings contained in this structure MUST fit within the extent defined by this size.
    uint32 link_info_header_size;                // A 32-bit, unsigned integer that specifies the size, in bytes, of the LinkInfo header section, which is composed of the LinkInfoSize, LinkInfoHeaderSize, LinkInfoFlags, VolumeIDOffset, LocalBasePathOffset, CommonNetworkRelativeLinkOffset, CommonPathSuffixOffset fields, and, if included, the LocalBasePathOffsetUnicode and CommonPathSuffixOffsetUnicode fields.<1>
    LINK_INFO_FLAGS link_info_flags;             // Flags that specify whether the VolumeID, LocalBasePath, LocalBasePathUnicode, and CommonNetworkRelativeLink fields are present in this structure.
    uint32 volumeid_offset;                      // A 32-bit, unsigned integer that specifies the location of the VolumeID field. If the VolumeIDAndLocalBasePath flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 local_basepath_offset;                // A 32-bit, unsigned integer that specifies the location of the LocalBasePath field. If the VolumeIDAndLocalBasePath flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 common_network_relative_link_offset;  // A 32-bit, unsigned integer that specifies the location of the CommonNetworkRelativeLink field. If the CommonNetworkRelativeLinkAndPathSuffix flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 common_pathsuffix_offset;             // A 32-bit, unsigned integer that specifies the location of the CommonPathSuffix field. This value is an offset, in bytes, from the start of the LinkInfo structure.
    VOLUME_ID volumeid;                          // An optional VolumeID structure (section 2.3.1) that specifies information about the volume that the link target was on when the link was created. This field is present if the VolumeIDAndLocalBasePath flag is set.
    char local_base_path[];                      // An optional, NULL–terminated string, defined by the system default code page, which is used to construct the full path to the link item or link target by appending the string in the CommonPathSuffix field. This field is present if the VolumeIDAndLocalBasePath flag is set.
    COMMON_NETWORK_RELATIVE_LINK common_network_relative_link;
    char common_path_suffix[];                   // A NULL–terminated string, defined by the system default code page, which is used to construct the full path to the link item or link target by being appended to the string in the LocalBasePath field.
};

 typedef struct LINK_INFO_UNICODE {
    uint32 link_info_size;                      // A 32-bit, unsigned integer that specifies the size, in bytes, of the LinkInfo structure. All offsets specified in this structure MUST be less than this value, and all strings contained in this structure MUST fit within the extent defined by this size.
    uint32 link_info_header_size;               // A 32-bit, unsigned integer that specifies the size, in bytes, of the LinkInfo header section, which is composed of the LinkInfoSize, LinkInfoHeaderSize, LinkInfoFlags, VolumeIDOffset, LocalBasePathOffset, CommonNetworkRelativeLinkOffset, CommonPathSuffixOffset fields, and, if included, the LocalBasePathOffsetUnicode and CommonPathSuffixOffsetUnicode fields.<1>
    LINK_INFO_FLAGS link_info_flags;            // Flags that specify whether the VolumeID, LocalBasePath, LocalBasePathUnicode, and CommonNetworkRelativeLink fields are present in this structure.
    uint32 volumeid_offset;                     // A 32-bit, unsigned integer that specifies the location of the VolumeID field. If the VolumeIDAndLocalBasePath flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 local_basepath_offset;               // A 32-bit, unsigned integer that specifies the location of the LocalBasePath field. If the VolumeIDAndLocalBasePath flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 common_network_relative_link_offset; // A 32-bit, unsigned integer that specifies the location of the CommonNetworkRelativeLink field. If the CommonNetworkRelativeLinkAndPathSuffix flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero.
    uint32 common_pathsuffix_offset;            // A 32-bit, unsigned integer that specifies the location of the CommonPathSuffix field. This value is an offset, in bytes, from the start of the LinkInfo structure.
    uint32 local_basepath_offset_unicode;       // An optional, 32-bit, unsigned integer that specifies the location of the LocalBasePathUnicode field. If the VolumeIDAndLocalBasePath flag is set, this value is an offset, in bytes, from the start of the LinkInfo structure; otherwise, this value MUST be zero. This field can be present only if the value of the LinkInfoHeaderSize field is greater than or equal to 0x00000024.
    uint32 common_pathsuffix_offset_unicode;    // An optional, 32-bit, unsigned integer that specifies the location of the CommonPathSuffixUnicode field. This value is an offset, in bytes, from the start of the LinkInfo structure. This field can be present only if the value of the LinkInfoHeaderSize field is greater than or equal to 0x00000024.
    VOLUME_ID_UNICODE volumeid;                 // An optional VolumeID structure (section 2.3.1) that specifies information about the volume that the link target was on when the link was created. This field is present if the VolumeIDAndLocalBasePath flag is set.
};
"""  # noqa E501

# SHELL_LINK = SHELL_LINK_HEADER [LINKTARGET_IDLIST] [LINKINFO] [STRING_DATA] *EXTRA_DATA


class EXTRA_DATA_BLOCK_SIGNATURES(IntEnum):
    CONSOLE_PROPS = 0xA0000002
    CONSOLE_FE_PROPS = 0xA0000004
    DARWIN_PROPS = 0xA0000006
    ENVIRONMENT_PROPS = 0xA0000001
    ICON_ENVIRONMENT_PROPS = 0xA0000007
    KNOWN_FOLDER_PROPS = 0xA000000B
    PROPERTY_STORE_PROPS = 0xA0000009
    SHIM_PROPS = 0xA0000008
    SPECIAL_FOLDER_PROPS = 0xA0000005
    TRACKER_PROPS = 0xA0000003
    VISTA_AND_ABOVE_IDLIST_PROPS = 0xA000000C

    @classmethod
    def get_name(cls, value: int) -> str | None:
        """Get the name belonging to the passed value, without raising a ValueError.

        Args:
            value: Integer value to find the name for

        Returns:
            The name belonging to the passed integer value, else None
        """
        if cls._has_value(value):
            return cls(value).name
        return None

    @classmethod
    def _has_value(cls, value: int) -> bool:
        """Check if the passed value exists, without raising a ValueError.

        Args:
            value: Integer value to check the existence for.

        Returns:
            Whether the value exists.
        """
        return value in cls._value2member_map_


LINK_HEADER_SIZE = 0x4C
LINK_INFO_HEADER_SIZE = 0x0C
LINK_INFO_BODY_SIZE = 0x10
LINK_EXTRA_DATA_HEADER_SIZE = 0x08


JUMPLIST_HEADER_SIZE = 0x24
JUMPLIST_FOOTER = 0xBABFFBAB

c_lnk = cstruct().load(lnk_def)
