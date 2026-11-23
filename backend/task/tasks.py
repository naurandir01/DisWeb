# backend/task/tasks.py
import logging

from celery import shared_task
from celery import Task as CeleryTask
from case.models import Case
from source.dissect_engine import DissectEngine
from artefact.models import Artefact
from yaras.models import YaraRule
from source.models import Source
from .models import Task
from artefact.views import add_artefact, add_timeline, add_registry
from django.core.exceptions import ObjectDoesNotExist
from celery.exceptions import Ignore
from back.meilisearch_engine import MeiliSearchClient
from back.meili_bulk import add_documents_chunked
import json
import uuid

logger = logging.getLogger(__name__)


class CustomTask(CeleryTask):
    def before_start(self, task_id, args, kwargs):
        """Check if the task already exists before starting it.
        If it exists, raise an Ignore exception to prevent the task from running again.
        Args:
            task_id (str): The ID of the task.
            args (tuple): The positional arguments passed to the task.
            kwargs (dict): The keyword arguments passed to the task.
        """
        params = args[0]
        task_src = Source.objects.get(id_source=params['task_source'])
        task_case = Case.objects.get(id_case=params['task_case'])
        # Check if a task with the same parameters already exists
        try:
            Task.objects.get(
                task_src=task_src,
                task_case=task_case,
                task_type=params['task_type'],
            )
            raise Ignore(f"Task with ID {task_id} already exists.")
        except Task.DoesNotExist:
            Task(
                id_task=task_id,
                task_src=task_src,
                task_case=task_case,
                task_type=params['task_type'],
                task_status="PENDING",  # Set the initial status to PENDING
            ).save()
            return super().before_start(task_id, args, kwargs)

    def on_success(self, retval, task_id, args, kwargs):
        try:
            # Update the task status in the database
            task_instance = Task.objects.get(id_task=task_id)  # Get the Task instance using the Celery task ID
            task_instance.task_status = "SUCCESS"  # Update the status
            task_instance.save()
        except ObjectDoesNotExist:
            logger.warning("Task with ID %s does not exist (on_success).", task_id)
        return super().on_success(retval, task_id, args, kwargs)

    def on_failure(self, exc, task_id, args, kwargs, einfo):
        try:
            # Update the task status in the database
            task_instance = Task.objects.get(id_task=task_id)
            task_instance.task_status = "FAILED"  # Update the status
            task_instance.save()
            # Forensic relevance: task failures must be clearly visible in
            # logs (investigator needs to know which analysis could not run)
            logger.error(
                "Task %s (id=%s) FAILED on source %s: %s",
                task_instance.task_type, task_id, task_instance.task_src_id, exc,
            )
        except ObjectDoesNotExist:
            logger.warning("Task with ID %s does not exist (on_failure).", task_id)
        return super().on_failure(exc, task_id, args, kwargs, einfo)


def _artefact_index(task_case):
    """Resolve the Meilisearch artefacts index of a case."""
    meili_client = MeiliSearchClient.client
    return meili_client.index(task_case.case_name + '_artefacts')


@shared_task(bind=True, base=CustomTask)
def source_hayabusa(self, params):
    """Run the hayabusa tool on the event logs of the image.

    Args:
        params (json): the parameters of the task.

    Returns:
        UUID: id of the task
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    # FIX (sprint 2): run_hayabusa now returns parsed dicts
    # (each JSONL line is json.loads-ed inside the engine).
    disk = DissectEngine(task_src)
    hayabusa_res = disk.run_hayabusa()

    for art in hayabusa_res:
        art['plugin'] = 'hayabusa'
        art['source'] = str(task_src.id_source)
        art['case'] = str(task_case.id_case)
        art['id'] = str(uuid.uuid4())

    # FIX (sprint 2): bulk indexing instead of one HTTP call per document
    add_documents_chunked(_artefact_index(task_case), hayabusa_res)
    return self.request.id


@shared_task(bind=True, base=CustomTask)
def source_photorec(self, params):
    return self.request.id


def create_timeline_values(type, values):
    values = []
    match type:
        case 'usb':
            for usb in values:
                values.append({'timeline_ts': usb['firstinsert'], 'timeline_value': f"Serie: {usb['serial']}; Produit: {usb['product']}", 'timeline_type': 'usb_firstinsert', 'id': str(uuid.uuid4())})
                values.append({'timeline_ts': usb['lastinsert'], 'timeline_value': f"Serie: {usb['serial']}; Produit: {usb['product']}", 'timeline_type': 'usb_lastinsert', 'id': str(uuid.uuid4())})
        case 'walkfs':
            for fs in values:
                values.append({'timeline_ts': fs['atime'], 'timeline_value': fs['path'], 'timeline_type': 'atime', 'id': str(uuid.uuid4())})
                values.append({'timeline_ts': fs['btime'], 'timeline_value': fs['path'], 'timeline_type': 'btime', 'id': str(uuid.uuid4())})
                values.append({'timeline_ts': fs['ctime'], 'timeline_value': fs['path'], 'timeline_type': 'ctime', 'id': str(uuid.uuid4())})
                values.append({'timeline_ts': fs['mtime'], 'timeline_value': fs['path'], 'timeline_type': 'mtime', 'id': str(uuid.uuid4())})
        case 'tasks':
            for task in values:
                values.append({'timeline_ts': task['date'], 'timeline_value': task['taskpath'], 'timeline_type': params['task_subtype'], 'id': str(uuid.uuid4())})
        case 'browser.history':
            for event in values:
                values.append({'timeline_ts': event['ts'], 'timeline_value': f"url: {event['url']} ; user:{event['username']}", 'timeline_type': params['task_subtype'], 'id': str(uuid.uuid4())})
        case 'shellbags':
            for event in values:
                values.append({'timeline_ts': event['regfmtime'], 'timeline_value': f"url: {event['path']} ; user:{event['username']}", 'timeline_type': params['task_subtype'], 'id': str(uuid.uuid4())})
        case 'sam':
            for event in values:
                values.append({'timeline_ts': event['lastlogin'], 'timeline_value': event['username'], 'timeline_type': 'lastlogin', 'id': str(uuid.uuid4())})
                values.append({'timeline_ts': event['lastpasswordset'], 'timeline_value': event['username'], 'timeline_type': 'lastpasswordset', 'id': str(uuid.uuid4())})
                values.append({'timeline_ts': event['lastincorrectlogin'], 'timeline_value': event['username'], 'timeline_type': 'lastincorrectlogin', 'id': str(uuid.uuid4())})
    return values


@shared_task(bind=True, base=CustomTask)
def source_timeline(self, params):
    """Run a plugin to create the timeline.

    Args:
        params (json): the parameters of the task:
            task_source: id of the source,
            task_case: id of the case,
            task_type: the plugin name to execute,

    Returns:
        UUID: id of the task
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    disk = DissectEngine(task_src)
    artefact = disk.run_plugin({'name': params['plugin'], 'params': ''})
    values = create_timeline_values(params['plugin'], artefact)

    for value in values:
        timeline_params = {
            'timeline_type': value['timeline_type'],
            'timeline_ts': value['timeline_ts'],
            'timeline_src': task_src,
            'timeline_case': task_case,
            'timeline_value': value['timeline_value'],
        }
        add_timeline(timeline_params)
    return self.request.id


@shared_task(bind=True, base=CustomTask)
def source_regf(self, params):
    """
    Run the regf plugin on a disk and store the result in the table Registry.

    Args:
        params (json): the parameters of the task:
            task_source: id of the source,

    Returns:
        UUID: id of the task
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    disk = DissectEngine(task_src)
    registry_content = disk.run_plugin_generator(
        {'name': 'regf', 'params': [''], 'case': task_case, 'source': task_src}
    )

    index = _artefact_index(task_case)

    def regf_documents():
        for reg in registry_content:
            try:
                yield {
                    'source': str(task_src.id_source),
                    'case': str(task_case.id_case),
                    'key': reg['key'],
                    'path': reg['path'],
                    'parent': '\\'.join(reg['path'].split('\\')[:-1]),
                    'plugin': 'regf',
                    'value': reg['value'],
                    'name': reg['name'],
                    'datatype': reg['datatype'],
                    'ts': reg['ts'],
                    'id': str(uuid.uuid4()),
                }
            except KeyError:
                yield {
                    'source': str(task_src.id_source),
                    'case': str(task_case.id_case),
                    'key': reg['key'],
                    'path': reg['path'],
                    'plugin': 'regf',
                    'parent': '\\'.join(reg['path'].split('\\')[:-1]),
                    'value': '-',
                    'name': '-',
                    'datatype': '-',
                    'ts': reg['ts'],
                    'id': str(uuid.uuid4()),
                }

    # FIX (sprint 2): chunked bulk push — registry dumps easily reach
    # hundreds of thousands of values
    add_documents_chunked(index, regf_documents())
    return self.request.id


@shared_task(bind=True, base=CustomTask)
def source_plugin(self, params):
    """Run a plugin on a disk and store the result in the index <case_name>_artefact
    of the meilisearch instance.

    Args:
        params (json): the parameters of the task:
            task_source: id of the source,
            task_case: id of the case,
            task_type: the plugin name to execute,

    Returns:
        UUID: id of the task
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    disk = DissectEngine(task_src)
    plugin_resultat = disk.run_plugin_generator(
        {
            'name': params['task_type'],
            'params': params['params'],
            'case': task_case.id_case,
            'source': task_src.id_source,
        }
    )

    # FIX (sprint 2): chunked bulk push (works with generators too, so
    # memory stays bounded for plugins yielding millions of records)
    add_documents_chunked(_artefact_index(task_case), plugin_resultat)
    return self.request.id


@shared_task(bind=True, base=CustomTask)
def source_yara(self, params):
    """Run a yara rule on a disk.

    Args:
        params (json): the parameters of the task:
            task_source: id of the source,
            task_case: id of the case,
            task_type: the name of the task,
            yara_rule: id of the yara rule to execute,
            yara_size: size of the files to scan in bytes

    Returns:
        UUID: id of the task
    """
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])
    task_yara = YaraRule.objects.get(id_yararule=params['yara_rule'])
    size = params['yara_size']

    disk = DissectEngine(source=task_src)
    res = disk.run_plugin(
        {
            'name': 'yara',
            'params': ['-r', task_yara.yararule_path, '-m', str(size)],
            'case': task_case.id_case,
            'source': task_src.id_source,
        }
    )

    # FIX (sprint 2): chunked bulk push
    add_documents_chunked(_artefact_index(task_case), res)
    return self.request.id


@shared_task(bind=True, base=CustomTask)
def source_directory(self, params):
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])

    directory = params['directory']

    disk = DissectEngine(task_src)
    directory_content = disk.get_directory_content(
        path=directory, case=task_case.id_case, source=task_src.id_source
    )

    # FIX (sprint 2): chunked bulk push
    add_documents_chunked(_artefact_index(task_case), directory_content)
    return self.request.id


@shared_task(bind=True, base=CustomTask)
def source_timeline_fs(self, params):
    task_src = Source.objects.get(id_source=params['task_source'])
    task_case = Case.objects.get(id_case=params['task_case'])
    disk = DissectEngine(task_src)

    path = params['task_path']
    fs = disk.get_directory_content(path=path, case=task_case.id_case, source=task_src.id_source)

    index = _artefact_index(task_case)
    subdirs = []

    # FIX (sprint 2): all A/B/C/M entries are accumulated in one list and
    # pushed in chunks — was one HTTP call per 4-document group before
    documents = []
    for entry in fs:
        for prefix, ts_key in (('A', 'atime'), ('B', 'btime'), ('C', 'ctime'), ('M', 'mtime')):
            documents.append({
                'plugin': prefix,
                'ts': entry[ts_key],
                'source': str(task_src.id_source),
                'case': str(task_case.id_case),
                'path': entry['path'],
                'id': str(uuid.uuid4()),
            })
        if entry['type'] == 'drc':
            subdirs.append(entry['path'])

    add_documents_chunked(index, documents)

    # Recurse AFTER the bulk push: previously the recursion happened inside
    # the loop, interleaving sibling iterations
    for subdir in subdirs:
        dir_params = {
            'task_path': subdir,
            'task_source': task_src.id_source,
            'task_case': task_case.id_case,
            'task_type': 'timeline_' + subdir,
        }
        source_timeline_fs.delay(dir_params)

    return self.request.id
