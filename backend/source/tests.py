from dissect_engine import DissectEngine

def main():
    path = "/mnt/cases/test/c-drive/c-drive.vmdk"
    d = DissectEngine(path=path)
    #keys = d.get_registry_subkeys("HKEY_LOCAL_MACHINE\\SYSTEM\\ControlSet001\\Enum\\USB\\ROOT_HUB")
    dir = d.get_directory_content(path="/sysvol")
    print("dir:",dir)

if __name__ == "__main__":
    main()
