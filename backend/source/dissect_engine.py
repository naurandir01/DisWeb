from dissect.target import Target
from dissect.target.tools.utils import execute_function_on_target,find_functions,keychain
from dissect.target.helpers.keychain import KeyType
from dissect.cstruct import hexdump
import os
import magic
import subprocess

class DissectEngine:
    """
    DissectEngine is a class that provides an interface to interact with a target disk image.
    It allows for the execution of plugins, retrieval of plugin information, get a file, get the content of a directory.
    It can be initialized with a source object or a path to a disk image, along with optional key type and value for keychain registration for encryption.
    """
    def __init__(self, source=None,path=None,key_type=None,key_value=None):
        """
        Initializes the DissectEngine with a target disk image.
        Args:
            source (object, optional): A source object containing previous path and key information.
            path (str, optional): The path to the disk image.
            key_type (str, optional): The type of key to register in the keychain ('PASSPHRASE' or 'RECOVERY_KEY').
            key_value (str, optional): The value of the key to register in the keychain.
        """
        if source is not None:
            self.path = source.source_path
            if source.source_key['key_type'] == 'PASSPHRASE':
                keychain.register_key(key_type=KeyType.PASSPHRASE,value=source.source_key['value'])
            if source.source_key['key_type'] == 'RECOVERY_KEY':
                keychain.register_key(key_type=KeyType.RECOVERY_KEY,value=source.source_key['value'])
            self.target = Target.open(self.path)
        elif path is not None:
            self.path = path
            if key_type == 'PASSPHRASE':
                keychain.register_key(key_type=KeyType.PASSPHRASE,value=key_value)
            if key_type == 'RECOVERY_KEY':
                keychain.register_key(key_type=KeyType.RECOVERY_KEY,value=key_value)
            self.target = Target.open(self.path)

    def get_plugins(self)-> list:
        """
        Retrieves a list of available plugins for the target disk image.
        Returns:
            list: A list of dictionaries containing plugin names and their output types.
        """
        source_plugins = find_functions(target=self.target,patterns='*')
        list_plugins=[]
        for plugin in source_plugins[0]:
            name = plugin.name
            pg = {'name':name,'output':plugin.output,'doc':plugin.cls.__doc__}
            if name not in list_plugins:
                list_plugins.append(pg)
        return list_plugins
    
    def run_plugin(self,plugin:dict)-> list | str:
        """
        Executes a specified plugin on the target disk image with given parameters.
        Args:
            plugin (dict): A dictionary containing the plugin name and parameters.
        Returns:
            str or list: The output of the plugin execution, either as a string or a list of json records.
        """
        functions = find_functions(target=self.target,patterns=plugin['name'])
        for function in functions[0]:
            output_type,value,_ = execute_function_on_target(self.target,func=function,arguments=plugin['params'])
        if output_type == "default":
            return value
        elif output_type == "record":
            return self.record_to_json(value)
    
    def record_to_json(self,records:list)-> list:
        """
        Converts a list of records into a JSON-compatible format.
        Args:
            records (list): A list of records, where each record is a named tuple.
        Returns:
            list: A list of dictionaries, each representing a record with keys as field names and values as strings.
        """
        count = 0
        records_json=[]
        for rec in records:
            rdict = rec._asdict()
            record={}
            for (key, value) in rdict.items():
                if value != None:
                    if key != 'linkefiles':
                        record[key.replace('_','')]=str(value)
                else:
                    record[key.replace('_','')]="None_"
            record['id']=count
            count += 1
            records_json.append(record)
        return records_json
    
    def get_directory_content(self,path:str,volume:str)->list:
        """
        Retrieves the content of a specified directory on a given volume.
        Args:
            path (str): The path to the directory.
            volume (str): The number of the volume.
        Returns:
            list: A list of dictionaries containing metadata about files and directories in the specified path.
        """
        fs = self.target.filesystems
        fs_drc =[]
        for f in fs:
            if f.volume.number == int(volume):
                try:
                    content = f.listdir(path)
                except Exception:
                    return []
                for c in content:
                    try:
                        state = f.lstat(path+'/'+c)
                        file = f.get(path+'/'+c)
                        try:
                            sha256 = f.sha256(path+'/'+c)
                            sha1 = f.sha1(path+'/'+c)
                            md5 = f.md5(path+'/'+c)
                        except Exception:
                            sha256 = ''
                    except Exception:
                        pass
                    if f.is_dir(path+'/'+c):
                        fs_drc.append({'name':c,'type':'drc','path':path+'/'+c,
                                        'atime':state.st_atime_ns,
                                        'btime':state.st_birthtime_ns,
                                        'ctime':state.st_ctime_ns,
                                        'mtime':state.st_mtime_ns,
                                        'size':state.st_size,
                                        'volume':volume,})
                    if f.is_file(path+'/'+c):
                        try: 
                            file = magic.from_buffer(f.get(path+'/'+c).open().read(2048))
                        except:
                            file =''
                        fs_drc.append({'name':c,'type':'fls','path':path+'/'+c,'volume':volume,'subtype':file,
                                        'atime':state.st_atime_ns,
                                        'btime':state.st_birthtime_ns,
                                        'ctime':state.st_ctime_ns,
                                        'mtime':state.st_mtime_ns,
                                        'size':state.st_size,
                                        'sha256':sha256,
                                        'sha1':sha1,
                                        'md5':md5,
                                        'fstype':state.st_fstype,
                                        'uid':state.st_uid,
                                        'gid':state.st_gid,
                                        'attribute':state.st_file_attributes
                                        })
                        
                    if f.is_symlink(path+'/'+c):
                        fs_drc.append({'name':c,'type':'link','path':path+'/'+c,'volume':volume,
                                        'atime':state.st_atime_ns,
                                        'btime':state.st_birthtime_ns,
                                        'ctime':state.st_ctime_ns,
                                        'mtime':state.st_mtime_ns,
                                        'size':state.st_size,
                                        'sha256':sha256,
                                        'uid':state.st_uid,
                                        'gid':state.st_gid,
                                        'attribute':state.st_file_attributes
                                        })
        return fs_drc

    def get_file_hexdump(self,file_path:str,volume:str)->list:
        """
        Retrieves the hexadecimal dump of a specified file on a given volume.
        Args:
            file_path (str): The path to the file.
            volume (str): The number of the volume.
        Returns:
            list: A list of dictionaries containing the address, hex value, and string representation of each line in the hex dump.
        """
        fs = self.target.filesystems
        for f in fs:
            if f.volume.number == int(volume):
                hex_dump =  hexdump(f.get(file_path).open().read(),output="string")
                lines = hex_dump.split('\n')
                result = []
                for line in lines:
                    string = line.split('   ')[-1]
                    address_HexValue = line.split('   ')[0].split(' ')

                    entry = {
                        'address': address_HexValue[0],
                        'hexvalue': ' '.join(address_HexValue[1:10]) +' '+ ' '.join(address_HexValue[11:19]),
                        'string': string
                    }
                    result.append(entry)
                return result
        return []
    
    def get_file(self,file_path:str,volume:str)->str:
        """
        Retrieves the content of a specified file on a given volume.
        Args:
            file_path (str): The path to the file.
            volume (str): The number of the volume.
        Returns:
            str: The content of the file as a string.
        """
        fs = self.target.filesystems
        for f in fs:
            if f.volume.number == int(volume):
                try:
                    return f.get(file_path).open()
                except Exception as e:
                    return e
        return False
    
    def get_file_no_open(self,file_path:str,volume:str):
        """
        Retrieves the content of a specified file on a given volume without opening it.
        Args:
            file_path (str): The path to the file.
            volume (str): The name of the volume.
        Returns:
            str: The content of the file as a string.
        """
        fs = self.target.filesystems
        for f in fs:
            if f.volume.number == int(volume):
                try:
                    return f.get(file_path)
                except Exception as e:
                    return e
        return False
    
    
    def get_volumes(self)->list:
        """
        Retrieves a list of volumes available in the target disk image.
        Returns:
            list: A list of dictionaries containing volume name, number and size.
        """
        volumes = []
        fs = self.target.filesystems
        for f in fs:
            volumes.append({'name':f.volume.name,'number':f.volume.number,'size':f.volume.size})
        return volumes

    def run_hayabusa(self):
        """
        Executes the Hayabusa plugin on the target disk image.

        Returns:
            str: The output of the Hayabusa plugin execution.
        """
        volumes = self.get_volumes()
        evt_path = "/Windows/System32/winevt/Logs/"
        for volume in volumes:
            evtx_folder = self.get_directory_content(evt_path,volume['name'])
            for evtx in evtx_folder:
                try:
                    os.rmdir('/tmp/hayabusa')
                except OSError:
                    pass
                os.makedirs('/tmp/hayabusa', exist_ok=True)
                
                if len(evtx_folder) > 0:
                    evtx_file = self.get_file_no_open(evt_path+'/'+evtx['name'],volume['name'])
                    with open('/tmp/hayabusa/'+evtx['name'], 'wb') as f:
                        open_file = evtx_file.open()
                        f.write(open_file.readall())
            cmd ='/backend/external/hayabusa/hayabusa json-timeline --no-wizard -d /tmp/hayabusa -A -D -n -u -C -L -o /tmp/hayabusa.json'
            result = subprocess.check_output(cmd,shell=True)
            result_json = []
            with open('/tmp/hayabusa.json', 'r') as f:
                for line in f:
                    result_json.append(line)
            return result_json
        return []