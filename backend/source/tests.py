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

    meili_client = meilisearch.Client('http://localhost:7700', '2HMCrPPjfhtm8U0aqRcJhCAe52L28n5VM5CfVzfz330')
    stats = meili_client.get_all_stats()

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
