from django.db import models

# Create your models here.
import uuid
class Case(models.Model):
    """
    Model d'un Cas
    """
    id_case = models.UUIDField( primary_key = True, default = uuid.uuid4, editable = False)
    case_name = models.CharField(max_length=250,null=True,help_text="Le nom du cas")
    case_description = models.CharField(max_length=250,null=True,help_text="La description du cas")
    case_create = models.DateTimeField("date published",null=True)

    def __str__(self):
        return self.case_name