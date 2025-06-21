from django.core.management.base import BaseCommand
from yaras.models import YaraRule



class Command(BaseCommand):
    def handle(self, *args, **options):
        # Ajouter une fonction pour parser le dossier contenant les règles Yara
        list_yara_rules=[{'yararule_name': 'rule1','yararule_path':''},]
        for yara_rule in list_yara_rules:
            try:
                # Check if the Yara Rule  already exists
                existing_ioc_type = YaraRule.objects.filter(yararule_name=yara_rule['yararule_name']).first()
                if existing_ioc_type:
                    pass
                else:
                    # Create the IYara Rule if it doesn't exist
                    print(f"Creating Yara Rule {yara_rule['ioc_type_value']}...")
                    # Use the create method to add the Yara Rule to the database
                    YaraRule.objects.create(
                        yararule_name=yara_rule['yararule_name'],
                        yararule_description=yara_rule['yararule_name']
                    )
            except Exception as e:
                print(f"Error creating Yara Rule {yara_rule['yararule_name']}: {e}")
        print("Yara Rules initialized successfully.")
