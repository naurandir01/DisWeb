# backend/source/models.py
import uuid

from case.models import Case
from django.db import models


class Source(models.Model):
    id_source = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source_name = models.CharField(max_length=250, null=True)
    source_path = models.TextField(null=True)
    source_type = models.CharField(max_length=250, null=True)
    source_version = models.CharField(max_length=250, null=True)
    source_os = models.CharField(max_length=250, null=True)
    # FIX (sprint 3): PROTECT — deleting a case with linked evidence must be
    # refused instead of cascading the destruction of all proof
    source_case = models.ForeignKey(Case, editable=True, on_delete=models.PROTECT)
    source_plugins = models.JSONField(null=True)
    source_key = models.JSONField(
        default={"key_type": None, "value": None}
    )  # {"type":"bitlocker|luks","key_type":"recovery_key|passphrase","value":"<key_value>"}
    # FIX (sprint 3): integrity of the evidence image
    source_hash_sha256 = models.CharField(max_length=64, null=True, blank=True)
    source_hash_verified_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.source_name


# Create your models here.
