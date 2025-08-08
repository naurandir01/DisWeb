from django.test import TestCase

from dissect_engine import DissectEngine
from dissect.target.tools.utils import execute_function_on_target,find_functions,find_and_filter_plugins
from dissect.target.plugins.scrape.qfind import QFindPlugin,progress
from dissect.target import Target
from dissect.target.helpers.keychain import KeyType
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

import meilisearch


def main():
    path = "/mnt/disk/TEST/c-drive/c-drive.vmdk"
    d = DissectEngine(path=path)

    meili_client = meilisearch.Client('http://localhost:7700', 'masterKey')

    artefacts_index = meili_client.index('evtx')
    timeline_index = meili_client.index('timeline')
  
    evtx = d.run_plugin({'name':'artefacts','params':[],'case':'case_uuid','source':'src_uuid'})
    walkfs = d.run_plugin({'name':'walkfs','params':[],'case':'case_uuid','source':'src_uuid'})
    try:
        timeline_index.add_documents(walkfs, primary_key='id')
    except Exception as e:
        pass
    #v = d.get_volumes()
    #f_d = d.get_directory_content('',1)
    #d.plugin('authlog',[''])
    #print(d.getPlugins('authlog'))
    #plugins = d.run_plugin({'name':'prefetch','params':['--grouped']})

    print("hex")
   
def main3():
    path = "/mnt/disk/TEST/c-drive/c-drive.vmdk"
    path_dir ='/c:'
    d = DissectEngine(path=path)
    drcs = d.get_directory_content(path_dir)
    print("Iterating through files in the root directory:")

if __name__ == "__main__":
    main()
