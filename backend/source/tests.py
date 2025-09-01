from django.test import TestCase
from dissect_engine import DissectEngine
from dissect.target.tools.utils import execute_function_on_target,find_functions,find_and_filter_plugins
from dissect.target.plugins.scrape.qfind import QFindPlugin,progress
from dissect.target import Target
from dissect.target.helpers.keychain import KeyType


import meilisearch


def main():
    path = "/mnt/disk/TEST/c-drive/c-drive.vmdk"
    d = DissectEngine(path=path)

    dir = d.get_directory_content("/")

    # meilisearch_client = meilisearch.Client("http://192.168.1.51:7700", "2HMCrPPjfhtm8U0aqRcJhCAe52L28n5VM5CfVzfz330")

    # meili_index = meilisearch_client.index('TEST_artefacts')

    # filter = 'source = "b2abff8b-f04e-44f4-8f4c-4f208a0075e2" AND parent = "/"'

    # params = {
    #         'filter':filter,
    #     }

    # dir_index = meili_index.get_documents(params)
    

    #evtx = d.run_plugin({'name':'evtx','params':[],'case':'case_uuid','source':'src_uuid'})

    # try:
    #     es_client.indices.create(index='case_id_artefacts')
    # except Exception as e:
    #     print(f"Index creation failed: {e}")
    # for evt in evtx:
    #     es_client.index(index='case_id_artefacts', document=evt)

    #d.run_hayabusa()
    


    print("hex")


if __name__ == "__main__":
    main()
