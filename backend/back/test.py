
from dissect.target.tools.utils import execute_function_on_target,find_functions,find_and_filter_plugins
from dissect.target.plugins.scrape.qfind import QFindPlugin,progress
from dissect.target import Target
from dissect.target.helpers.keychain import KeyType
from source.dissect_engine import DissectEngine
def main():
    path = "/mnt/disk/GIC_2024_01_TEST/c-drive/c-drive.vmdk"
    d = DissectEngine(path=path)
    #d.plugin('sam',['-j'])
    v = d.get_volumes()
    f_d = d.get_directory_content('',1)
    #d.plugin('authlog',[''])
    #print(d.getPlugins('authlog'))
    #qfind = d.run_plugin({'name':'qfind','params':['--needles','SANS']})

    print("hex")
   
    

if __name__ == "__main__":
    main()
