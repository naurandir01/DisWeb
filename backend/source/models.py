from django.db import models
from case.models import Case
import uuid

class Source(models.Model):
    id_source = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source_name = models.CharField(max_length=250, null=True)
    source_path = models.TextField(null=True)
    source_type = models.CharField(max_length=250, null=True)
    source_version = models.CharField(max_length=250, null=True)
    source_os = models.CharField(max_length=250, null=True)
    source_case = models.ForeignKey(Case, editable=True, on_delete=models.CASCADE)
    source_plugins = models.JSONField(null=True)
    source_key = models.JSONField(default={'key_type': None, 'value': None})  # {"type":"bitlocker|luks","key_type":"recovery_key|passphrase","value":"<key_value>"}
    

    def __str__(self):
        return self.source_name
# Create your models here.
