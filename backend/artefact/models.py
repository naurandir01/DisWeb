from django.db import models
from case.models import Case
from source.models import Source
import uuid

class Artefact(models.Model):
    id_artefact = models.UUIDField( primary_key = True, default = uuid.uuid4, editable = False)
    artefact_type = models.CharField(max_length=250,null=True)
    artefact_case = models.ForeignKey(Case,on_delete=models.CASCADE)
    artefact_src = models.ForeignKey(Source,on_delete=models.CASCADE,null=True)
    artefact_values = models.JSONField(null=True)
    
    def __str__(self):
        return self.artefact_src.source_name + '_' + self.artefact_type

class Registry(models.Model):
    id = models.UUIDField( primary_key = True, default = uuid.uuid4, editable = False)
    reg_source = models.ForeignKey(Source,on_delete=models.CASCADE)
    reg_path = models.TextField()
    reg_parent = models.TextField()
    reg_key = models.TextField()
    reg_value = models.TextField()
    reg_ts = models.DateTimeField()

    def __str__(self):
        return self.reg_key

class Timeline(models.Model):
    id = models.UUIDField( primary_key = True, default = uuid.uuid4, editable = False)
    timeline_src = models.ForeignKey(Source,on_delete=models.CASCADE)
    timeline_case = models.ForeignKey(Case,on_delete=models.CASCADE)
    timeline_ts = models.DateTimeField()
    timeline_value = models.CharField(max_length=500)
    timeline_type = models.CharField(max_length=500)

    def __str__(self):
        return self.timeline_value