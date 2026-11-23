from django.contrib import admin

# Register your models here.
from .models import Task
# Register your models here
# .

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id_task', 'task_type','task_status', 'task_src__source_name', 'task_case__case_name')
    search_fields = ('task_type', 'task_status')

admin.site.register(Task,TaskAdmin)