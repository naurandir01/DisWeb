from django.db import models
import uuid
from case.models import Case
from source.models import Source

class IOCType(models.Model):
    id_ioctype = models.UUIDField( primary_key = True, default = uuid.uuid4, editable = False)
    ioctype_value = models.CharField(max_length=250,null=True)
    ioctype_description = models.CharField(max_length=250,null=True)
    
    def __str__(self):
        return self.ioctype_value


class IOC(models.Model):
    id_ioc = models.UUIDField( primary_key = True, default = uuid.uuid4, editable = False)
    ioc_type = models.ForeignKey(IOCType,editable=True,on_delete=models.CASCADE)
    ioc_src = models.ForeignKey(Source,editable=True,on_delete=models.CASCADE)
    ioc_case = models.ForeignKey(Case,editable=True,on_delete=models.CASCADE)
    ioc_value = models.CharField(max_length=500,null=True)
    
    def __str__(self):
        return self.ioc_value


