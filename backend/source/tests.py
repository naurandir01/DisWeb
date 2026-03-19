from django.test import TestCase
from dissect_engine import DissectEngine
from dissect.target.tools.utils.cli import execute_function_on_target,find_functions,find_and_filter_plugins
from dissect.target.tools.diff import differentiate_target_plugin_outputs
from dissect.target import Target
from dissect.target.helpers.keychain import KeyType
from dissect.target.plugins.os.windows.registry import RegistryPlugin

import meilisearch
import sys

def main():
    path = "/mnt/disk/TEST/c-drive/c-drive.vmdk"
    d = DissectEngine(path=path)
    keys = d.get_registry_subkeys("HKEY_LOCAL_MACHINE\\SYSTEM\\ControlSet001\\Enum\\USB\\ROOT_HUB")
    print("hex")




if __name__ == "__main__":
    main()
