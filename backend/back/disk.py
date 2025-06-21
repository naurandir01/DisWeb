from dissect.target import Target
from dissect.target.tools.utils import execute_function_on_target,find_functions,find_and_filter_plugins,keychain
from dissect.cstruct import hexdump,dumpstruct
from dissect.cstruct.types import  BaseType
from dissect.target.helpers.keychain import KeyType
from dissect.target.plugins.filesystem.yara import YaraPlugin
from psycopg.types.json import Jsonb,Json
import subprocess
import os
import magic
import json
import capa
import re

class Disque():
    """
    Class permettant de gerer un disque.

    Attributs
    ---------
    prelevement : Prelevement
    Methodes
    --------
    """

    def __init__(self,prelevement=None,path=None,key_type=None,key_value=None):
        if  prelevement is not None:
            self.chemin = prelevement.source_path
            if prelevement.source_key['key_type'] == 'PASSPHRASE':
                keychain.register_key(key_type=KeyType.PASSPHRASE,value=prelevement.source_key['value'])
            if prelevement.source_key['key_type'] == 'RECOVERY_KEY':
                keychain.register_key(key_type=KeyType.RECOVERY_KEY,value=prelevement.source_key['value'])
        elif path is not None:
            self.chemin = path
            if key_type == 'PASSPHRASE':
                keychain.register_key(key_type=KeyType.PASSPHRASE,value=key_value)
            if key_type == 'RECOVERY_KEY':
                keychain.register_key(key_type=KeyType.RECOVERY_KEY,value=key_value)
        self.t = Target.open(self.chemin)
        self.plugins = []

    
    def setFiche(self):
        """
        Permet de créer la fiche d'identité du disque.
        Nom du disque, OS et sa version, les addresses ip.
        """
        self.fiche = {
            'hostname':self.t.hostname,
            'os':self.t.os,
            'ips':self.t.ips,
            'version':self.t.version,
            'install_date':self.t.install_date,
            'langue':self.t.language,
            'timezone':self.t.timezone,
            }
        
    def convertToJson(self,table):
        res = []
        for row in table:
            res.append(Json(row))
        return res

    def getFiche(self):
        """
        Permet de crécuperer la fiche du disque.
        Nom du disque, OS et sa version, les addresses ip.
        """
        return self.fiche
    
    def getTarget(self):
        """
        Permet de recuperer le disque qui a été ouvert.
        """
        return self.t
    
    def getListOfPlugin(self):
        source_plugins = find_functions(target=self.t,patterns='*')
        list_plugins=[]
        for plugin in source_plugins[0]:
            name = plugin.name
            if name not in list_plugins:
                list_plugins.append(name)
        return list_plugins

    def plugin(self,plugin:str,params:list):
        """
        Permet d'executer un plugin sur un prelevement.
        """
        if not self.checkPluginsRun(plugin):
            functions = find_functions(target=self.t,patterns=plugin)
            for function in functions[0]:
                output_type,value,_ = execute_function_on_target(self.t,func=function,arguments=params)
            if output_type == "default":
                self.plugins.append({'name':plugin,'values':value,'type':'default'})
            elif output_type == "record":
                self.plugins.append({'name':plugin,'values':self.line_packer(value,plugin),'type':'record'})
    
    def line_packer(self,it,plugin):
        """
        Description
        -----------
        Permet de parser un résultat de type record pour pouvoir l'exploiter dans une liste de json.

        Parametre
        ----------
        it : record
            Le résultat de type record à convertir.
        Return
        ------
        records : [{}]
            La liste des résultats au format json.
        """
        count = 0
        records=[]
        for rec in it:
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
            records.append(record)
        return records
    
    def checkPluginsRun(self,plugin:str):
        """
        Permet de vérifier si un plugin a été exécuter.
        """
        for plugin in self.plugins:
            if plugin['name'] == plugin:
                return True
            else:
                False

    def printPlugins(self, plugin_str:str):
        """
        Permet d'afficher le résulstat d'un plugin.
        """
        for plugin in self.plugins:
            if plugin['name'] == plugin_str:
                for value in plugin['values']:
                    print(value+'\n')
    
    def getPlugins(self,plugin_str:str):
        """
        Permet de recuperer le résultat d'un plugin
        """
        for plugin in self.plugins:
            if plugin['name'] == plugin_str:
                return plugin['values']
    
    def digest(self,id,type:str,database):
        """
        Permet d'exécuter sur un disque tout les artefacts nécéssaires.
        """
        if type == 'Windows':
            self.digestWindows(id,database)

    def createArborescence(self):
        """
        Permet de creer l'arborescance d'un disque.
        """
        vs = self.t.volumes
        fs = self.t.filesystems
        arbo=[]
        for f in fs:
            arbo.append(self.createArboDirecWindows(f,''))
        return arbo
    
    def getOnlyDireArborescence(self):
        fs = self.t.filesystems
        volumes = self.t.volumes
        arbo=[]
        for volume in volumes:
            arbo.append(self.getOnlyDirectory(volume,''))
        return arbo
    
    def getOnlyDirectory(self,volume,path:str):
        """
        Description:
        ------------
        Get only the directory inside a directory on a specific volume

        Params: 
        -------
        path : str
            The path to the directory.
        volume : str
            The name of the volume.

        Return:
        -------
        list
            A list of directories inside the specified path on the given volume.
        """
        fs_drc =[]
        filesystem = volume.fs
        try:
            dir__content = filesystem.iterdir(path)
        except Exception:
            return []
        try:
            for sub_dir in dir__content:
                if filesystem.is_dir(path+'/'+sub_dir):
                    fs_drc.append({'path':path+'/'+sub_dir,'name':sub_dir,'subdir':self.getOnlyDirectory(volume,path+'/'+sub_dir)})
        except Exception:
            return []
        return fs_drc

    def getDirectoryContentVolume(self,path:str,volume:str):
        fs = self.t.filesystems
        fs_drc =[]
        for f in fs:
            if f.volume.name == volume:
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
                        metadata = ''
                    if f.is_dir(path+'/'+c):
                        fs_drc.append({'name':c,'type':'drc','path':path+'/'+c,
                                        'atime':state.st_atime_ns,
                                        'btime':state.st_birthtime_ns,
                                        'ctime':state.st_ctime_ns,
                                        'mtime':state.st_mtime_ns,
                                        'size':state.st_size,
                                        
                                        'volume':volume,})#'uuid_source':str(self.id)})
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
    
    def getDisqueVolume(self):
        """
        Recuperer la liste des volumes d'un disque
        """
        #vs = self.t.volumes
        fs = self.t.filesystems
        listVolumes = []
        for f in fs:
                listVolumes.append({'name':f.volume.name})
        return listVolumes
    
    def getFile(self,file_path:str,volume:str):
        """
        Recuperer un fichier en particulier
        """
        fs = self.t.filesystems
        fs_drc =[]
        for f in fs:
            if f.volume.name == volume:
                try:
                    return f.get(file_path).open()
                except Exception:
                    return '404'
                
        return '404'
    
    def getFileHexDump(self,file_path:str,volume:str):
        fs = self.t.filesystems
        fs_drc =[]
        for f in fs:
            if f.volume.name == volume:
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
        return '404'

    def getFileNotOpen(self,file_path:str,volume:str):
        fs = self.t.filesystems
        fs_drc =[]
        for f in fs:
            if f.volume.name == volume:
                try:
                    return f.get(file_path)
                except Exception:
                    return '404'
                
        return '404'

    def digestWindows(self,id,database):
        """
        Permet d'exécuter une liste de plugin sur un prélévement windows.
        """
        self.plugin('prefetch','grouped')
        self.plugin('startupinfo','')

    def createArboDirecWindows(self,filesystem,path):
        """
        Permet de creer l'arborescance d'un dossier sous windows
        """
        try:
            list_file = filesystem.listdir(path+'/')
        except Exception:
            return []
        fls_drv=[]
        for f_d in list_file:
            new_f_d = {
                'name':f_d,
                'metadata':self.getMetadataWindows(filesystem,path+'/'+f_d)
            }
            if filesystem.is_file(path+'/'+f_d):
                new_f_d['type']='fls'
                new_f_d['sub']=[]
                fls_drv.append(new_f_d)

            elif filesystem.is_dir(path+'/'+f_d):
                new_f_d['type']='drc'
                new_f_d['sub']=self.createArboDirecWindows(filesystem,path+'/'+f_d)
                fls_drv.append(new_f_d)

            elif filesystem.is_symlink(path+'/'+f_d):
                new_f_d['type']='link'
                new_f_d['sub']=[]
                new_f_d['linkpath']=filesystem.readlink(path+'/'+f_d)
                fls_drv.append(new_f_d)
        return fls_drv
    
    def generateHASH(self,filesystem,path):
        """
        Permet de recuperer les hash d'un fichier.
        """
        if filesystem.is_file(path):
            try:
                md5 = filesystem.md5(path),
            except Exception as e:
                md5 = ''
            try:
                sha1 = filesystem.sha1(path),
            except Exception as e:
                sha1 = ''
            try:
                sha256 = filesystem.sha256(path),
            except Exception as e:
                sha256 = ''

            return {
                    'md5':md5,
                    'sha1':sha1,
                    'sha256':sha256
            }
     
    def getMetadataWindows(self,filesystem,path):
        """
        Recuperer les metadata d'un fichier sous windows.
        """
        metadata = {}
        mft = filesystem.ntfs.mft
        # Creation de $STANDARD_INFORMATION
        STD_INFO_OBJ = mft.get(path).attributes.data[16][0].attribute
        STD_INFO={
                'b_time_ns':STD_INFO_OBJ.creation_time_ns,
                'a_time_ns':STD_INFO_OBJ.last_access_time_ns,
                'c_time_ns':STD_INFO_OBJ.last_change_time_ns,
                'm_time_ns':STD_INFO_OBJ.last_modification_time_ns,
                'file_attributes':STD_INFO_OBJ.file_attributes,
            
        }
        metadata['STD_INFO']=STD_INFO
        # Création de $FILE_NAME
        FILE_NAME_OBJ = mft.get(path).attributes.data[48][0].attribute
        FILE_NAME = {
                'b_time_ns':FILE_NAME_OBJ.creation_time_ns,
                'a_time_ns':FILE_NAME_OBJ.last_access_time_ns,
                'c_time_ns':FILE_NAME_OBJ.last_change_time_ns,
                'm_time_ns':FILE_NAME_OBJ.last_modification_time_ns,
                'file_attributes':FILE_NAME_OBJ.file_attributes,
           
        }

        metadata['FILE_NAME']=FILE_NAME
        # Generation des HASH:
        metadata['HASH']=self.generateHASH(filesystem,path)

        return metadata
    
    def convertRecordPrefetch(self,table):
        """
        PREFETCH
        --------
        Permet de convertir la list des prefetch pour qu'il soit compatible avec la base de données.
        """
        new_prefetch=[]
        for row in table:
            (inside,i)= self.alreadyInsidePrefetch(row,new_prefetch)
            if inside:
                if not any(row['linkedfile'] in x for x in [new_prefetch[i]['linkefiles']] ):
                    linkefiles = new_prefetch[i]['linkefiles']
                    linkefiles.append(row['linkedfile'])
                    new_prefetch[i]['linkefiles'] = linkefiles
            else:
                new_prefetch.append({"filename":row['filename'],
                                     "prefetch":row['prefetch'],
                                     "linkefiles":[row['linkedfile']],
                                     "runcount":row['runcount'],
                                     "hostname":row['hostname'],
                                     "domain":row['domain'],
                                     "ts":row['ts'],
                                     "id":row['prefetch']
                                     })
        return new_prefetch
    
    def alreadyInsidePrefetch(self,row,table_finale):
        """
        PREFETCH
        --------
        Permet de verifier si un prefetch n'est pas déjas présent.

        Parametre
        ---------
        row : dict[str]
            le prefetch à vérifier.
        table_finale : list[dict]
            le tableau à verifier.

        """
        i=0
        for rows in table_finale:
            if rows['prefetch'] == row['prefetch']:
                return True,i
            else:
                i+=1
        return False,None
    
    def convertRecordGeneric(self,table):
        """
        Description
        -----------
        Permet de convertir les tableaus pour qu'il soit compatible avec l'objet json de postgresql.

        Parametre
        ---------
        table : [{}]
            Le tableau de json à convertir.

        Return
        ------
        res : [{}]
            Le tableau convertir.
        """
        for row in table:
            row['_generated']=str(row['_generated'])
            row['generated'] = row.pop('_generated')
            row['source'] = row.pop('_source')
            row['classification'] = row.pop('_classification')
            row['version'] = row.pop('_version')
        return table
    
    def hayabusa(self):
        volumes = self.getDisqueVolume()
        evt_path = '/Windows/System32/winevt/Logs'
        for volume in volumes:
            evt_folder = []
            evtx_folder = self.getDirectoryContentVolume(evt_path,volume['name'])
        if len(evtx_folder) != 0:
            for evtx in evtx_folder:
                evt = self.getFileNotOpen(evt_path+'/'+evtx['name'],volume['name'])
                try:
                    os.makedirs(self.chemin+'_hayabusa')
                except Exception as e:
                    print("")
                with open(self.chemin+'_hayabusa/'+evtx['name'],'wb') as f:
                        open_file = evt.open()
                        f.write(open_file.readall())

        cmd ='/backend/external/hayabusa/hayabusa json-timeline --no-wizard -d '+self.chemin+'_hayabusa'+' -A -D -n -u -C -L -o '+self.chemin+'_hayabusa.json'
        result = subprocess.check_output(cmd,shell=True)
        data = []
        with open(self.chemin+'_hayabusa.json') as file:
            for line in file:
                if line:
                    data.append(line)
        return data
    
    def capa(self,volume,file_path):
        # Extrait le fichier à analayser
        file = self.getFileNotOpen(file_path,volume)
        try:
            os.makedirs(self.chemin+'_capa')
        except Exception as e:
            print("")
        with open(self.chemin+'_capa/'+file['name'],'wb') as f:
            open_file = file.open()
            f.write(open_file.readall())
        # Analyse le fichier

        cmd = "capa -h"
        result = subprocess.check_output(cmd,shell=True)   

        return []

    def yara(self,rule_drc):
        """
        Permet d'executer une régle yara sur le disque dur.
        """
        yara_plungin = YaraPlugin(self.t)
        res = yara_plungin.yara(rule_drc)
        return res

