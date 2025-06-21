from django.shortcuts import render
from .models import Task
from django.views.generic import TemplateView
from django.http import HttpResponse,JsonResponse,FileResponse
# Create your views here.

def create_task(params):
    task = Task(
        id_task=params['task_id'],  
        task_source=params['task_source'],
        task_case=params['task_case'],
        task_type=params['task_type'],
        task_status=params['task_status']
    )
    return task

class TasksView(TemplateView):
    def get(self,request):
        tasks = Task.objects.all()
        return JsonResponse(list(tasks),safe=False)

class TaskView(TemplateView):
    def get(self,request,id_task):
        try:
            task = Task.objects.get(id_task=id_task)
            return JsonResponse(task.to_dict(),safe=False)
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)