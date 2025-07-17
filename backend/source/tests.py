from django.test import TestCase

from dissect_engine import DissectEngine
from dissect.target.tools.utils import execute_function_on_target,find_functions,find_and_filter_plugins
from dissect.target.plugins.scrape.qfind import QFindPlugin,progress
from dissect.target import Target
from dissect.target.helpers.keychain import KeyType
def main():
    path = "/mnt/disk/TEST/c-drive/c-drive.vmdk"
    d = DissectEngine(path=path)
    #d.plugin('sam',['-j'])
    v = d.get_volumes()
    f_d = d.get_directory_content('',1)
    #d.plugin('authlog',[''])
    #print(d.getPlugins('authlog'))
    plugins = d.run_plugin({'name':'prefetch','params':['--grouped']})

    print("hex")
   
    

if __name__ == "__main__":
    main()
