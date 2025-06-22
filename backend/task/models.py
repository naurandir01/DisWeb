from django.db import models
from case.models import Case
from source.models import Source
# Create your models here.
import uuid

class Task(models.Model):
    """
    Task model to represent a task associated with a case and a source.
    
    Each task has a unique identifier, creation date, associated case, source, type, and status.
    """
    id_task = models.UUIDField( primary_key = True, default = uuid.uuid4, editable = False) 
    create = models.DateTimeField("date published",null=True)
    task_case = models.ForeignKey(Case,editable=True,on_delete=models.CASCADE)
    task_src = models.ForeignKey(Source,editable=True,on_delete=models.CASCADE)
    task_type = models.TextField(null=True)
    task_status = models.CharField(max_length=250,null=True)
    
    def __str__(self):
        return self.task_case.case_name +'/'+self.task_src.source_name+':'+self.task_type