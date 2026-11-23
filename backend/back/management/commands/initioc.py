from django.core.management.base import BaseCommand
from ioc.models import IOCType

list_ioc_type = [
    {'ioc_type_value': 'ipv4', 'ioc_type_description': 'ip address'},
    {'ioc_type_value': 'ipv6', 'ioc_type_description': 'ip address'},
    {'ioc_type_value': 'filename', 'ioc_type_description': 'file name'},
    {'ioc_type_value': 'sha256', 'ioc_type_description': 'hash sha256'},
    {'ioc_type_value': 'md5', 'ioc_type_description': 'hash md5'},
    {'ioc_type_value': 'path', 'ioc_type_description': 'file path'},
    {'ioc_type_value': 'url', 'ioc_type_description': 'url'},
    {'ioc_type_value': 'domain', 'ioc_type_description': 'domain name'},
    {'ioc_type_value': 'email', 'ioc_type_description': 'email address'},
    {'ioc_type_value': 'user-agent', 'ioc_type_description': 'user agent'},
    {'ioc_type_value': 'phone-number', 'ioc_type_description': 'phone number'},
    {'ioc_type_value': 'credit-card', 'ioc_type_description': 'credit card number'},
    {'ioc_type_value': 'hash', 'ioc_type_description': 'hash'},
    {'ioc_type_value': 'email-subject', 'ioc_type_description': 'email subject'},
    {'ioc_type_value': 'email-body', 'ioc_type_description': 'email body'},
    {'ioc_type_value': 'email-attachment', 'ioc_type_description': 'email attachment'},
    {'ioc_type_value': 'email-header', 'ioc_type_description': 'email header'},
    {'ioc_type_value': 'url-path', 'ioc_type_description': 'url path'},
    {'ioc_type_value': 'url-query', 'ioc_type_description': 'url query'},
    {'ioc_type_value': 'url-fragment', 'ioc_type_description': 'url fragment'},
    {'ioc_type_value': 'ip-range', 'ioc_type_description': 'ip address range'},
    {'ioc_type_value': 'asn', 'ioc_type_description': 'autonomous system number'},
    {'ioc_type_value': 'port', 'ioc_type_description': 'port number'},
    {'ioc_type_value': 'protocol', 'ioc_type_description': 'network protocol'},
    {'ioc_type_value': 'file-size', 'ioc_type_description': 'file size'},
    {'ioc_type_value': 'file-type', 'ioc_type_description': 'file type'},
    {'ioc_type_value': 'file-version', 'ioc_type_description': 'file version'},
    {'ioc_type_value': 'file-permissions', 'ioc_type_description': 'file permissions'},
    {'ioc_type_value': 'file-owner', 'ioc_type_description': 'file owner'},
    {'ioc_type_value': 'file-group', 'ioc_type_description': 'file group'},
    {'ioc_type_value': 'file-creation-time', 'ioc_type_description': 'file creation time'},
    {'ioc_type_value': 'file-modification-time', 'ioc_type_description': 'file modification time'},
    {'ioc_type_value': 'file-access-time', 'ioc_type_description': 'file access time'},
    {'ioc_type_value': 'file-attributes', 'ioc_type_description': 'file attributes'},
    {'ioc_type_value': 'file-signature', 'ioc_type_description': 'file signature'},
    {'ioc_type_value': 'registry-key', 'ioc_type_description': 'registry key'},
    {'ioc_type_value': 'registry-value', 'ioc_type_description': 'registry value'},
    {'ioc_type_value': 'registry-data', 'ioc_type_description': 'registry data'},
    {'ioc_type_value': 'process-name', 'ioc_type_description': 'process name'},
    {'ioc_type_value': 'process-id', 'ioc_type_description': 'process id'},
    {'ioc_type_value': 'process-path', 'ioc_type_description': 'process path'},
    {'ioc_type_value': 'process-command-line', 'ioc_type_description': 'process command line'},
    {'ioc_type_value': 'process-user', 'ioc_type_description': 'process user'},
    {'ioc_type_value': 'process-parent-id', 'ioc_type_description': 'parent process id'},
    {'ioc_type_value': 'process-parent-path', 'ioc_type_description': 'parent process path'},
    {'ioc_type_value': 'process-parent-command-line', 'ioc_type_description': 'parent process command line'}
]

class Command(BaseCommand):
    def handle(self, *args, **options):
        for ioc_type in list_ioc_type:
            try:
                # Check if the IOC type already exists
                existing_ioc_type = IOCType.objects.filter(ioctype_value=ioc_type['ioc_type_value']).first()
                if existing_ioc_type:
                    print(f"IOC type {ioc_type['ioc_type_value']} already exists. Skipping creation.")
                else:
                    # Create the IOC type if it doesn't exist
                    print(f"Creating IOC type {ioc_type['ioc_type_value']}...")
                    # Use the create method to add the IOC type to the database
                    IOCType.objects.create(
                        ioctype_value=ioc_type['ioc_type_value'],
                        ioctype_description=ioc_type['ioc_type_description']
                    )
            except Exception as e:
                print(f"Error creating IOC type {ioc_type['ioc_type_value']}: {e}")
        print("IOC types initialized successfully.")
