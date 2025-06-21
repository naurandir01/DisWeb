from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse,JsonResponse,FileResponse
from django_celery_results.models import TaskResult
from .models import Source
from case.models import Case
from artefact.models import Artefact,Registry
from task.models import Task
from yaras.models import YaraRule
from .dissect_engine import DissectEngine
from back.database import convertOperator
from task.tasks import source_directory,source_hayabusa,source_photorec,source_plugin,source_regf,source_timeline,source_yara
import json
import ast

class SourcesView(TemplateView):
    def get(self,request):
        sources = Source.objects.all().values()
        return JsonResponse(list(sources),safe=False)
    
    def post(self,request):
        """
        Create a new source from a path
        """
        src_case =  Case.objects.get(id_case=json.loads(request.POST['src_case'])['id_case'])
        crypt_params = {}
        try:
            crypt_params['key_type'] = request.POST['crypt_key_type']
            crypt_params['value'] = request.POST['crypt_key_value']
                
            disk = DissectEngine(path=request.POST['src_path'],key_type=crypt_params['key_type'],key_value=crypt_params['value'])
        
        except Exception as e:
            crypt_params = {"key_type":None,"value":None}
            disk = DissectEngine(path=request.POST['src_path'])

        source = Source(
            source_name = disk.target.name,
            source_path = request.POST['src_path'],
            source_type = request.POST['src_path'].split('.')[-1],
            source_version = disk.target.version,
            source_os = disk.target.os,
            source_case = src_case ,
            source_plugins = disk.get_plugins(),
            source_key = crypt_params
        )
        source.save()
        return HttpResponse(status=201,content="Source created successfully")

class SourceView(TemplateView):
    def get(self,request,id_source):
        """
        Get a source by its ID
        """
        src = Source.objects.get(id_source=id_source)
        return JsonResponse(src,safe=False)
    
    def delete(self,request,id_source):
        """
        Delete a source by its ID
        """
        Source.objects.get(id_source=id_source).delete()
        return HttpResponse(status=200,content="Source deleted successfully")

class SourceVolumes(TemplateView):
    def get(self,request,id_source):
        """
        Get the volumes of a source
        """
        src = Source.objects.get(id_source=id_source)
        disk = DissectEngine(path=src.source_path,key_type=src.source_key['key_type'],key_value=src.source_key['value'])
        volumes = disk.get_volumes()
        return JsonResponse(volumes,safe=False)

class SourceDirectoryContent(TemplateView):
    def get(self,request,id_source):
        """
        Get the content of a directory in a source
        """
        src = Source.objects.get(id_source=id_source)
        volume = request.GET.get('volume')
        directory= request.GET.get('directory')
        task_params = {
            'volume': volume,
            'directory': directory,
            'task_source': src.id_source,
            'task_case':src.source_case.id_case,
            'task_type': 'directory_'+volume+'_'+directory,
            'tast_status': 'PENDING',
            'task_values':[]
        }
        try:
            drc_content  = Artefact.objects.get(artefact_src=src,artefact_type=task_params['task_type']).artefact_values
            return JsonResponse({'pending':False,'values':drc_content},safe=False)
        except Artefact.DoesNotExist:
            try:
                task = Task.objects.get(task_src=src,task_type=task_params['task_type'])
            except Task.DoesNotExist:
                source_directory.delay(task_params)
            return JsonResponse({'pending':True,'values':[]},safe=False)

class SourceFile(TemplateView):
    def get(self,request,id_source):
        """
        Get the content of a file

        :param request: The request object
        :param id_source: The id of the Source
        
        :return: A JsonResponse with the content of the file
        """
        src = Source.objects.get(id_source=id_source)
        volume = request.GET.get('volume')
        file_path= request.GET.get('file_path')
        disk = DissectEngine(source=src)
        file = disk.get_file(file_path,volume)
        if file != '404':
            return FileResponse(file,filename=file_path.split('/')[-1])
        else:
            return HttpResponse('Not Found')

class SourceFileContent(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
        volume = request.GET.get('volume')
        file_path= request.GET.get('file_path')
        disk = DissectEngine(src)
        file = disk.get_file(file_path,volume)
        if file != '404':
            return FileResponse(file,filename=file_path.split('/')[-1],as_attachment=True)
        else:
            return HttpResponse(status=404)

class SourceFileHexDump(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
        volume = request.GET.get('volume')
        file_path= request.GET.get('file_path')
        disk = DissectEngine(src)
        file = disk.get_file_hexdump(file_path,volume)
        if file != '404':
            return JsonResponse(file,safe=False)
        else:
            return HttpResponse(status=404)

class SourceHayabusa(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
        if src.source_os == 'windows':
            try:
                artefact = Artefact.objects.get(artefact_src=src,artefact_type='hayabusa')
                return JsonResponse(artefact.artefact_values,safe=False)
            except Artefact.DoesNotExist:
                params = {'task_source':id_source,'task_case':src.source_case.id_case,'task_type':'hayabusa','task_status':'PENDING'}
                try:
                    task = Task.objects.get(task_src=id_source,task_type=params['task_type'])
                    if task.task_status == 'PENDING':
                        return JsonResponse({'pending':True},safe=False)
                except Task.DoesNotExist:
                    source_hayabusa.delay(params)
                    return JsonResponse({'pending':True},safe=False)
        else:
            return HttpResponse('Non compatible')

class SourceTimeline(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
        if src.source_os == "windows":
            list_plugins = ['evtx','usb','tasks','browser.history','shellbags','sam','walkfs']
            for sub_plugin in list_plugins:
                params = {'task_source':id_source,'task_case':src.source_case.id_case,'task_type':'timeline_'+sub_plugin,'task_subtype':sub_plugin,'task_status':'PENDING'}
                try:
                    task = Task.objects.get(task_src=id_source,task_type=params['task_type'])
                except Task.DoesNotExist:
                    source_timeline.delay(params)
            return HttpResponse('Tache lancer')
        elif src.source_os == "linux":
                list_plugins = ['walkfs']
        else:
            return HttpResponse('Nom incompatible')

class SourceYara(TemplateView):
    def get(self,request,id_source,rules):
        src = Source.objects.get(id_source=id_source)
        task_yara = YaraRule.objects.get(id_yararule=rules)
        try:
            artefact = Artefact.objects.get(artefact_src=src,artefact_type='yara',id_source=task_yara.yararule_name)
            return JsonResponse(artefact.artefact_values,safe=False)
        except Artefact.DoesNotExist:
            params = {
                'task_source':id_source,
                'task_case':src.source_case.id_case,
                'task_type':'yara_'+task_yara.yararule_name,
                'task_subtype':'yara_'+task_yara.yararule_name,
                'task_status':'PENDING',
                'yara_rule':rules}
            try:
                task = Task.objects.get(task_src=id_source,task_type='yara_'+task_yara.yararule_name)
                if task.task_status == 'PENDING':
                    return JsonResponse({'pending':True,'values':[]},safe=False)
                elif task.task_status == 'FAILED':
                    return JsonResponse({'pending':False,'values':[],'status':'FAILED'},safe=False)
            except Task.DoesNotExist:
                source_yara.delay(params)
                return JsonResponse({'pending':True,'values':[]},safe=False)

class SourceYaras(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
        try:
            artefacts = Artefact.objects.all().filter(artefact_src=src,artefact_type='yara').values('artefact_values')
            list_yara_output = []
            for yara in artefacts:
                list_yara_output = list_yara_output+ yara['artefact_values']
            return JsonResponse(list_yara_output,safe=False)
        except Artefact.DoesNotExist:
            return JsonResponse([],safe=False)

class SourceRegistryRun(TemplateView):
    def get(self,request,id_source,plugin):
        src = Source.objects.get(id_source=id_source)
        params = {'task_source':id_source,'task_case':src.source_case.id_case,'task_type':'regf','task_status':'PENDING','task_subtype':plugin}
        try:
            task = Task.objects.get(task_src=id_source,task_type=params['task_type'])
            return JsonResponse([{'id':1,'value':task.task_status}],safe=False)
        except Task.DoesNotExist:
            source_regf.delay(params)
        return JsonResponse([{'id':1,'value':'PENDING'}],safe=False)

class SourceArtefact(TemplateView):
    def get(self,request,id_source,plugin):
        src = Source.objects.get(id_source=id_source)
        try:
            artefacts = Artefact.objects.get(artefact_src=src,artefact_type=plugin)
            return JsonResponse({'pending':False,'values':artefacts.artefact_values,'status':'SUCCESS'},safe=False)
        except Artefact.DoesNotExist:
            if plugin != 'yara':
                params = {
                    'task_source':id_source,
                    'task_case':src.source_case.id_case,
                    'task_type':plugin,
                    'task_status':'PENDING',
                    'params':['']}
                try:
                    task = Task.objects.get(task_src=id_source,task_type=params['task_type'])
                    if task.task_status == 'PENDING':
                        return JsonResponse({'pending':True,'values':[],'status':'PENDING'},safe=False)
                    elif task.task_status == 'FAILED':
                        return JsonResponse({'pending':False,'values':[],'status': 'FAILED'},safe=False)
                except Task.DoesNotExist:
                    source_plugin.delay(params)
                    return JsonResponse({'pending':True,'values':[]},safe=False)

class SourcePluginsList(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
        source_disk = DissectEngine(src)
        source_list_plugins = source_disk.get_plugins()
        return JsonResponse(source_list_plugins,safe=False)

class SourceRegistry(TemplateView):
    def get(self,request,id_source,start,end):
        src = Source.objects.get(id_source=id_source)

        filter_field = request.GET.get('filtermodel[0][field]')
        filter_operator = request.GET.get('filtermodel[0][operator]')
        filter_value = request.GET.get('filtermodel[0][value]')

        sort_field = request.GET.get('sortingmodel[0][field]')
        sort_order = request.GET.get('sortingmodel[0][sort]')

        queryset = Registry.objects.filter(reg_src=src)
        
        if filter_field:
            kwargs = {
                '{0}{1}'.format(filter_field,convertOperator(filter_operator)):filter_value
            }
            queryset = queryset.filter(**kwargs)
        
        if sort_field:
            if sort_order == 'asc':
                queryset = queryset.order_by(sort_field)
            else:
                queryset = queryset.order_by(f'-{sort_field}')
        
        queryset  = queryset[start:end]
        data = list(queryset.values())
        return JsonResponse(data,safe=False)
    
class SourceRegistrySize(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
       
        filter_field = request.GET.get('filtermodel[0][field]')
        filter_operator = request.GET.get('filtermodel[0][operator]')
        filter_value = request.GET.get('filtermodel[0][value]')

        queryset = Registry.objects.filter(reg_src=src)
        
        if filter_field:
            kwargs = {
                '{0}{1}'.format(filter_field,convertOperator(filter_operator)):filter_value
            }
            queryset = queryset.filter(**kwargs)

        size = queryset.count()
        return JsonResponse({'size':size},safe=False)

class SourceRegistryPath(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
        path = request.GET.get('path')
        queryset = Registry.objects.filter(reg_src=src,reg_parent=path).order_by('reg_path').distinct('reg_path')
        data = list(queryset.values())
        return JsonResponse(data,safe=False)

class SourceRegistryPathDataGrid(TemplateView):
    def get(self,request,id_source):
        src = Source.objects.get(id_source=id_source)
        path = request.GET.get('path')
        queryset = Registry.objects.filter(reg_src=src,reg_parent=path)
        data = list(queryset.values())
        return JsonResponse(data,safe=False)

class SourceTasks(TemplateView):
    def get(self,request,id_source):
        #src = Source.objects.get(id_source=id_source)
        tasks = TaskResult.objects.all()
        data = list(tasks.values())
        return JsonResponse(data,safe=False)

class SourceTask(TemplateView):
    def get(self,request,id_source,task_type):
        src = Source.objects.get(id_source=id_source)
        try:
            task = Task.objects.get(task_src=src,task_type=task_type)
            return JsonResponse({'task_status':task.task_status},safe=False)
        except Task.DoesNotExist:
            return JsonResponse({'task_status':'NOT FOUND'},safe=False)
