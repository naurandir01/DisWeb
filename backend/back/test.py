from disk import Disque
from backend.source.dissect_engine import DissectEngine
from dissect.target.tools.utils import execute_function_on_target,find_functions,find_and_filter_plugins
from dissect.target.plugins.scrape.qfind import QFindPlugin,progress
from dissect.target import Target
from dissect.target.helpers.keychain import KeyType
def main():
    path = "/mnt/disk/GIC_2024_01_TEST/c-drive/c-drive.vmdk"
    d = DissectEngine(path=path)
    #d.plugin('sam',['-j'])
    #v = d.getDisqueVolume()
    #d.plugin('authlog',[''])
    #print(d.getPlugins('authlog'))
    sam = d.run_plugin({'name':'sam','params':['--json']})

    print("hex")
   
    

if __name__ == "__main__":
    main()
