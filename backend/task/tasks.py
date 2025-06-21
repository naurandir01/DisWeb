from celery import shared_task
from celery import Task as CeleryTask
from django_celery_results.models import TaskResult
from case.models import Case
from back.disk import Disque
from source.dissect_engine import DissectEngine
from artefact.models import Artefact
from yaras.models import YaraRule
from source.models import Source
from .models import Task
from .views import create_task
from artefact.views import add_artefact,add_timeline,add_registry
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.dispatch import receiver
from celery.exceptions import Ignore
import ast
import datetime
import json
import uuid


class CustomTask(CeleryTask):
    def before_start(self, task_id, args, kwargs):
        params = args[0]
        task_src = Source.objects.get(id_source=params['task_source'])
        task_case = Case.objects.get(id_case=params['task_case'])
        # Check if an task with the same parameters already exists
        try:
            existing_task = Task.objects.get(
                task_src=task_src,
                task_case=task_case,
                task_type=params['task_type'],
            )
            raise Ignore(f"Task with ID {existing_task.id_task} already exists.")
        except Task.DoesNotExist:
            Task(
                id_task=task_id,  
                task_src=task_src,
                task_case=task_case,
                task_type=params['task_type'],
            ).save()
            return super().before_start(task_id, args, kwargs)
    
    def on_success(self, retval, task_id, args, kwargs):
        try:
        # Update the task status in the database
            task_instance = Task.objects.get(id_task=task_id)  # Get the Task instance using the Celery task ID
            task_instance.task_status = "SUCCESS"  # Update the status
            task_instance.save()
        except ObjectDoesNotExist:
            print(f"Task with ID {task_id} does not exist.")
        return super().on_success(retval, task_id, args, kwargs)
    
    def on_failure(self, exc, task_id, args, kwargs, einfo):
        try:
        # Update the task status in the database
            task_instance = Task.objects.get(id_task=task_id)  # Get the Task instance using the Celery task ID
            task_instance.task_status = "FAILED"  # Update the status
            print(f"Task {task_instance.task_type} FAILED")
            task_instance.save()
        except ObjectDoesNotExist:
            print(f"Task with ID {task_id} does not exist.")
        return super().on_failure(exc, task_id, args, kwargs, einfo)
    
@shared_task(bind=True,base=CustomTask)
def source_hayabusa(self, params):
    """Permet d'executer l'outil hayabusa sur un prelevement windows.

    Args:
        params (json): les paramétres de la tache.

    Returns:
        UUID: L'id de la tache
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])
    
    disk = DissectEngine(task_src)
    hayabusa_res = disk.run_hayabusa()
    json_artefact = []
    for art in hayabusa_res:
        json_artefact.append(json.loads(art))
    artefact_params = {
                'artefact_type':'hayabusa',
                'artefact_ts':datetime.datetime.now(),
                'artefact_case':task_case,
                'artefact_src':task_src,
                'artefact_values':json_artefact
            }
    add_artefact(artefact_params)
    return self.request.id  

@shared_task(bind=True,base=CustomTask)
def source_photorec(self,params):
    return self.request.id

@shared_task(bind=True,base=CustomTask)
def source_timeline(self,params):
    """Permet d'éxécuter un plugin sur le prelevement de stocker dans la table Artefacts le résultat du plugin pour créer une timeline.

    Args:
        params (json): les parmétres de la tache: 
            task_src: L'id du prelevement, 
            task_case: L'id du cas,
            task_type: le nom du plugin à executer, 
            task_champ: la liste des champs à stocker dans la table Artefact
                [{'champ_key:'btime',champ_type:'fs_btime'}]

    Returns:
        UUID: L'id de la tache
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    disk = DissectEngine(task_src)
    res = disk.run_plugin({'name':params['task_subtype'],'params':''})
    
    values = []
    match params['task_subtype']:
        case 'usb': 
            for usb in res:
                values.append({ 'timeline_ts':usb['firstinsert'],'timeline_value':f"Serie: {usb['serial']}; Produit: {usb['product']}",'timeline_type':'usb_firstinsert','id':str(uuid.uuid4())})
                values.append({ 'timeline_ts':usb['lastinsert'],'timeline_value':f"Serie: {usb['serial']}; Produit: {usb['product']}",'timeline_type':'usb_lastinsert','id':str(uuid.uuid4())})
        case 'walkfs':
            for fs in res:
                values.append({ 'timeline_ts':fs['atime'],'timeline_value':fs['path'],'timeline_type':'atime','id':str(uuid.uuid4())})
                values.append({ 'timeline_ts':fs['btime'],'timeline_value':fs['path'],'timeline_type':'btime','id':str(uuid.uuid4())})
                values.append({ 'timeline_ts':fs['ctime'],'timeline_value':fs['path'],'timeline_type':'ctime','id':str(uuid.uuid4())})
                values.append({ 'timeline_ts':fs['mtime'],'timeline_value':fs['path'],'timeline_type':'mtime','id':str(uuid.uuid4())})
        case 'tasks':
            for task in res:
                values.append({ 'timeline_ts':task['date'],'timeline_value':task['taskpath'],'timeline_type':params['task_subtype'],'id':str(uuid.uuid4())})
        case 'browser.history':
            for event in res:
                values.append({ 'timeline_ts':event['ts'],'timeline_value':f"url: {event['url']} ; user:{event['username']}",'timeline_type':params['task_subtype'],'id':str(uuid.uuid4())})
        case 'shellbags':
            for event in res:
                values.append({ 'timeline_ts':event['regfmtime'],'timeline_value':f"url: {event['path']} ; user:{event['username']}",'timeline_type':params['task_subtype'],'id':str(uuid.uuid4())})
        case 'sam':
            for event in res:
                values.append({ 'timeline_ts':event['lastlogin'],'timeline_value':event['username'],'timeline_type':'lastlogin','id':str(uuid.uuid4())})
                values.append({ 'timeline_ts':event['lastpasswordset'],'timeline_value':event['username'],'timeline_type':'lastpasswordset','id':str(uuid.uuid4())})
                values.append({ 'timeline_ts':event['lastincorrectlogin'],'timeline_value':event['username'],'timeline_type':'lastincorrectlogin','id':str(uuid.uuid4())})
    for value in values:
        timeline_params = {
            'timeline_type':value['timeline_type'],
            'timeline_ts':value['timeline_ts'],
            'timeline_source':task_src,
            'timeline_case':task_case,
            'timeline_value':value['timeline_value'],
        }
        add_timeline(timeline_params)
    return self.request.id

def remove_last_segment(path):
    # Diviser le chemin en segments
    segments = path.split('\\')

    # Supprimer le dernier segment s'il n'est pas vide
    if segments[-1]:
        segments = segments[:-1]

    # Rejoindre les segments restants avec '/'
    new_path = '\\'.join(segments)

    return new_path

@shared_task(bind=True,base=CustomTask)
def source_regf(self,params):
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    disk = DissectEngine(task_src)
    regf_res = disk.run_plugin('regf','')

    for reg in regf_res:
        path = reg['path']
        key = reg['key']
        parent = path.split(key)[0]
        try:
            regf_params = {
                'reg_source':task_src,
                'reg_key':key,
                'reg_path':path,
                'reg_parent':remove_last_segment(path),
                'reg_value':reg['value'],
                'reg_ts':reg['ts'],
            }
        except:
             regf_params = {
                'reg_source':task_src,
                'reg_key':key,
                'reg_path':path,
                'reg_parent':remove_last_segment(path),
                'reg_ts':reg['ts'],
                'reg_value':'-',
            }
        add_registry(regf_params)
    return self.request.id

@shared_task(bind=True,base=CustomTask)
def source_plugin(self,params):
    """Permet d'éxécuter un plugin sur le prelevement de stocker dans la table Artefacts le résultat du plugin.

    Args:
        params (json): les parmétres de la tache: 
            task_src: L'id du prelevement, 
            task_case: L'id du cas,
            task_type: le nom du plugin à executer, 

    Returns:
        UUID: L'id de la tache
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    disk = DissectEngine(task_src)
    res = disk.run_plugin({'name':params['task_type'],'params':params['params']})

    artefact_params = {
        'artefact_type':params['task_type'],
        'artefact_ts':datetime.datetime.now(),
        'artefact_case':task_case,
        'artefact_src':task_src,
        'artefact_values':res
    }
    add_artefact(artefact_params)
    return self.request.id


@shared_task(bind=True,base=CustomTask)
def source_yara(self,params):
    """Permet d'éxécuter un fichier de régle yara sur le prelevement.

    Args:
        params (json): les parmétres de la tache: 
            task_src: L'id du prelevement, 
            task_case: L'id du cas,
            task_type: le nom du plugin à executer, 
            yara_rule: l'id de la regle yara,

    Returns:
        UUID: L'id de la tache
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])
    task_yara = YaraRule.objects.get(id_yararule=params['yara_rule'])

    disk = DissectEngine(task_src)
    res = disk.run_plugin({'name':'yara','params':['-r',task_yara.yararule_path,'-m','9999999999999']})
    artefact_params = {
        'artefact_type':'yara_'+params['task_subtype'],
        'artefact_ts':datetime.datetime.now(),
        'artefact_case':task_case,
        'artefact_src':task_src,
        'artefact_values':res
    }
    add_artefact(artefact_params)
    return self.request.id
 

@shared_task(bind=True,base=CustomTask)
def source_directory(self,params):
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    directory = params['directory']
    volume = params['volume']
    disk = DissectEngine(task_src)
    try:
        Artefact.objects.get(artefact_type=params['task_type'], artefact_src=task_src, artefact_case=task_case)
    except Artefact.DoesNotExist:
        directoryContent = disk.get_directory_content(directory,volume)
        artefact_params = {
            'artefact_type':params['task_type'],
            'artefact_ts':datetime.datetime.now(),
            'artefact_case':task_case,
            'artefact_src':task_src,
            'artefact_values':directoryContent
        }
        add_artefact(artefact_params)
    return self.request.id
