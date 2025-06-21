from django.test import TestCase
from back.disk import Disque
from dissect.target.tools.utils import execute_function_on_target,find_functions,find_and_filter_plugins
from dissect.target.plugins.scrape.qfind import QFindPlugin,progress
from dissect.target import Target

def main():
    path = "/mnt/disk/GIC_2024_01_TEST/c-drive/c-drive.vmdk"
    d = Disque(path,'1')
    d.plugin('sam',['-j'])
    d.plugin('yara',['-r','../external/yara/rule.yar'])
    print(d.getPlugins('yara'))
    

if __name__ == "__main__":
    main()

# Create your tests here.
