from django.db import models
import uuid
# Create your models here.

class YaraRule(models.Model):
    id_yararule = models.UUIDField( primary_key = True, default = uuid.uuid4, editable = False)
    yararule_path = models.TextField(null=True)
    yararule_name = models.CharField(null=True)
    yararule_description = models.CharField(null=True)
    
    def __str__(self):
        return self.yararule_name
