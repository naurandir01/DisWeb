# backend/source/views.py
import hashlib
import json
import uuid

from django.http import FileResponse
from django.utils import timezone
from rest_framework.response import Response

from back.apibase import BaseApiView
from back.filters import apply_grid_filters
from back.roles import IsAdminRole, IsAdminOrAnalyst
from back.meilisearch_engine import MeiliSearchClient
from case.models import Case
from source.models import Source
from source.dissect_engine import DissectEngine
from artefact.models import Artefact, Registry, Timeline
from task.models import Task
from task.tasks import (
    source_directory, source_hayabusa, source_timeline_fs,
    source_plugin, source_regf, source_timeline, source_yara,
)
from user.models import AuditLog, audit_from_request
from yaras.models import YaraRule


def compute_source_sha256(path: str, chunk_size: int = 8 * 1024 * 1024) -> str:
    """Stream-hash the evidence image (never loads it fully in memory)."""
    sha = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            sha.update(chunk)
    return sha.hexdigest()


def get_task_or_launch(delay_fn, params, src):
    """FIX (bug #5): compare the FK to the Source *object*, not the raw UUID.

    Returns the task if it exists, otherwise launches `delay_fn` and
    returns the newly PENDING task.
    """
    try:
        return Task.objects.get(task_src=src, task_type=params["task_type"])
    except Task.DoesNotExist:
        delay_fn.delay(params)
        task = Task(
            id_task=uuid.uuid4(),
            task_src=src,
            task_case=params["task_case"],
            task_type=params["task_type"],
            task_status="PENDING",
        )
        task.save()
        return task


def meili_records_to_dicts(query):
    """Helper: convert MeiliSearch results to plain dicts (was duplicated 6x)."""
    return [vars(res) for res in query.results]


class SourcesView(BaseApiView):
    def get(self, request):
        return Response(list(Source.objects.all().values()))

    def post(self, request):
        try:
            case_payload = json.loads(request.POST["src_case"])
            src_case = Case.objects.get(id_case=case_payload["id_case"])
            src_path = request.POST["src_path"]
        except (KeyError, json.JSONDecodeError, Case.DoesNotExist):
            return self.bad_request("Invalid case or path")

        crypt_params = {"key_type": None, "value": None}
        try:
            crypt_params["key_type"] = request.POST["crypt_key_type"]
            crypt_params["value"] = request.POST["crypt_key_value"]
            disk = DissectEngine(
                path=src_path,
                key_type=crypt_params["key_type"],
                key_value=crypt_params["value"],
            )
        except Exception:
            disk = DissectEngine(path=src_path)

        source = Source(
            source_name=disk.target.name,
            source_path=src_path,
            source_type=src_path.split(".")[-1],
            source_version=disk.target.version,
            source_os=disk.target.os,
            source_case=src_case,
            source_plugins=disk.get_plugins(),
            source_key=crypt_params,
        )
        # Integrity (sprint 3): hash the evidence at ingestion. A failure
        # must not block the ingestion but must leave a visible trace.
        try:
            source.source_hash_sha256 = compute_source_sha256(src_path)
        except Exception:
            source.source_hash_sha256 = None
        source.save()

        audit_from_request(
            AuditLog.Action.SOURCE_CREATE, request,
            target=str(source.id_source),
            detail={
                "case": str(src_case.id_case),
                "path": src_path,
                "sha256": source.source_hash_sha256,
            },
        )
        return Response({"id_source": str(source.id_source)}, status=201)


class SourceView(BaseApiView):
    # Deleting a source destroys indexed evidence: administrative
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        return Response(dict(src.__dict__))

    def delete(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        case = Case.objects.get(id_case=src.source_case.id_case)
        meili_client = MeiliSearchClient.client
        artefacts_index = meili_client.index(case.case_name + "_artefacts")
        artefacts_index.delete_documents(filter='source="' + str(src.id_source) + '"')

        # Tasks are operational job records (Celery), NOT evidence: they must
        # not block source deletion. Delete them explicitly BEFORE the source
        # (their FK is PROTECT to prevent accidental orphan deletions), and
        # keep a trace of what was removed in the audit entry.
        task_types = list(Task.objects.filter(task_src=src).values_list(
            "task_type", flat=True
        ))
        deleted_tasks = Task.objects.filter(task_src=src).delete()

        # Artefacts / Registry / Timeline rows are derived analysis data,
        # not the evidence image itself: they follow the source deletion.
        # (Kept minimal here — Meili docs are already purged above.)
        Registry.objects.filter(reg_source=src).delete()
        Timeline.objects.filter(timeline_src=src).delete()
        Artefact.objects.filter(artefact_src=src).delete()

        # Audit BEFORE deletion (sprint 3): who destroyed evidence and what it was
        audit_from_request(
            AuditLog.Action.SOURCE_DELETE, request,
            target=str(id_source),
            detail={"case": str(case.id_case), "path": src.source_path,
                    "name": src.source_name,
                    "purged_tasks": task_types,
                    "task_rows_deleted": deleted_tasks[0] if deleted_tasks else 0},
        )
        src.delete()
        return Response({"detail": "Source deleted successfully"})


class SourceArtefactMeiliSearch(BaseApiView):
    """Get the content of an artefact from an index in MeiliSearch.

    :param params filter: The filter to apply on the artefacts
    :param params offset: The offset to apply on the results
    :param params limit: The limit of results to return
    :param id_source: The id of the Source
    :param plugin: The name of the plugin to filter the artefacts
    :return: A Response with the artefacts
    """
    def get(self, request, id_source, plugin):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        filter_param = request.query_params.get("filter")
        offset = request.query_params.get("offset", "0")
        limit = request.query_params.get("limit", "100")
        sort = request.query_params.get("sort", "")

        meili_client = MeiliSearchClient.client
        case = Case.objects.get(id_case=src.source_case.id_case)
        index = meili_client.index(case.case_name + "_artefacts")

        params = {
            "filter": filter_param,
            "offset": int(offset),
            "limit": int(limit),
        }
        if sort:
            params["sort"] = [sort]

        query = index.get_documents(params)
        return Response({"total": query.total, "hits": meili_records_to_dicts(query)})


class SourceDirectoryContent(BaseApiView):
    def get(self, request, id_source):
        """Get the content of a directory in a source"""
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        directory = request.query_params.get("directory")
        filter_param = request.query_params.get("filter")

        meili_client = MeiliSearchClient.client
        case = Case.objects.get(id_case=src.source_case.id_case)
        index = meili_client.index(case.case_name + "_artefacts")

        task_params = {
            "directory": directory,
            "task_source": str(src.id_source),
            "task_case": str(src.source_case.id_case),
            "task_type": "directory_" + str(directory),
            "task_status": "PENDING",
            "task_values": [],
        }

        params = {"filter": filter_param}
        try:
            task = Task.objects.get(task_src=src, task_type=task_params["task_type"])
            if task.task_status == "SUCCESS":
                query = index.get_documents(params)
                new_params = {"filter": filter_param, "offset": 0, "limit": query.total}
                query = index.get_documents(new_params)
                return Response({
                    "pending": False,
                    "values": meili_records_to_dicts(query),
                    "total": query.total,
                })
        except Task.DoesNotExist:
            source_directory.delay(task_params)
        return Response({"pending": True, "values": []})


class SourceFile(BaseApiView):
    def get(self, request, id_source):
        """Get the content of a file"""
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        file_path = request.query_params.get("file_path")
        if not file_path:
            return self.bad_request("file_path is required")

        disk = DissectEngine(source=src)
        file = disk.get_file(file_path)
        if file != "404":
            # Chain of custody: every evidence file consultation is traced
            audit_from_request(
                AuditLog.Action.FILE_ACCESS, request,
                target=f"source={id_source};file={file_path}",
            )
            return FileResponse(file, filename=file_path.split("/")[-1])
        return self.not_found()


class SourceFileContent(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        file_path = request.query_params.get("file_path")
        if not file_path:
            return self.bad_request("file_path is required")

        disk = DissectEngine(src)
        file = disk.get_file(file_path)
        if file != "404":
            audit_from_request(
                AuditLog.Action.FILE_ACCESS, request,
                target=f"source={id_source};file={file_path}",
                detail={"mode": "attachment"},
            )
            return FileResponse(file, filename=file_path.split("/")[-1], as_attachment=True)
        return self.not_found()


class SourceFileHexDump(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        file_path = request.query_params.get("file_path")
        if not file_path:
            return self.bad_request("file_path is required")

        disk = DissectEngine(src)
        file = disk.get_file_hexdump(file_path)
        if file != "404":
            audit_from_request(
                AuditLog.Action.HEXDUMP_ACCESS, request,
                target=f"source={id_source};file={file_path}",
            )
            return Response(file)
        return self.not_found()


class SourceHayabusa(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        if src.source_os != "windows":
            return self.bad_request("Hayabusa is only available for Windows sources")

        try:
            artefact = Artefact.objects.get(artefact_src=src, artefact_type="hayabusa")
            return Response(artefact.artefact_values)
        except Artefact.DoesNotExist:
            params = {
                "task_source": str(src.id_source),
                "task_case": str(src.source_case.id_case),
                "task_type": "hayabusa",
                "task_status": "PENDING",
            }
            task = get_task_or_launch(source_hayabusa, params, src)  # FIX bug #5
            return Response({"pending": task.task_status == "PENDING"})


class SourceTimeline(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        params = {
            "task_source": str(src.id_source),
            "task_case": str(src.source_case.id_case),
            "task_type": "timeline/",
            "task_status": "PENDING",
            "task_path": "/",
        }
        get_task_or_launch(source_timeline_fs, params, src)  # FIX bug #5
        return Response({"detail": "Task launched"})


class SourceYara(BaseApiView):
    def get(self, request, id_source, rules, size):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        case = Case.objects.get(id_case=src.source_case.id_case)
        task_yara = YaraRule.objects.get(id_yararule=rules)
        meili_client = MeiliSearchClient.client
        index = meili_client.index(case.case_name + "_artefacts")

        params = {
            "task_source": str(src.id_source),
            "task_case": str(src.source_case.id_case),
            "task_type": "yara_" + task_yara.yararule_name,
            "task_status": "PENDING",
            "yara_size": size,
            "yara_rule": str(rules),
        }
        try:
            task = Task.objects.get(task_src=src, task_type=params["task_type"])  # FIX bug #5
            if task.task_status == "SUCCESS":
                filter_expr = (
                    f"source ='{src.id_source}' AND plugin = 'yara' "
                    f"AND rule = '{task_yara.yararule_name}'"
                )
                query = index.get_documents({"filter": filter_expr})
                query = index.get_documents(
                    {"filter": filter_expr, "offset": 0, "limit": query.total}
                )
                return Response({
                    "pending": False,
                    "values": meili_records_to_dicts(query),
                    "total": query.total,
                })
            if task.task_status == "PENDING":
                return Response({"pending": True, "values": []})
            # FAILED or unknown -> explicit response (was returning None)
            return Response({"pending": False, "values": [], "status": task.task_status})
        except Task.DoesNotExist:
            source_yara.delay(params)
            return Response({"pending": True, "values": []})


class SourceYaras(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        artefacts = Artefact.objects.all().filter(
            artefact_src=src, artefact_type="yara"
        ).values("artefact_values")
        list_yara_output = []
        for yara in artefacts:
            list_yara_output = list_yara_output + yara["artefact_values"]
        return Response(list_yara_output)


class SourceRegistryRun(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        params = {
            "task_source": str(src.id_source),
            "task_case": str(src.source_case.id_case),
            "task_type": "regf",
            "task_status": "PENDING",
        }
        task = get_task_or_launch(source_regf, params, src)  # FIX bug #5
        return Response([{"id": 1, "value": task.task_status}])


class SourceArtefact(BaseApiView):
    def get(self, request, id_source, plugin):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        try:
            artefacts = Artefact.objects.get(artefact_src=src, artefact_type=plugin)
            return Response({
                "pending": False,
                "values": artefacts.artefact_values,
                "status": "SUCCESS",
            })
        except Artefact.DoesNotExist:
            if plugin != "yara":
                params = {
                    "task_source": str(src.id_source),
                    "task_case": str(src.source_case.id_case),
                    "task_type": plugin,
                    "task_status": "PENDING",
                    "params": [""],
                }
                task = get_task_or_launch(source_plugin, params, src)  # FIX bug #5
                # Analysis launch traced (sprint 3): plugin, source, case
                audit_from_request(
                    AuditLog.Action.TASK_LAUNCH, request,
                    target=f"source={id_source};plugin={plugin}",
                    detail={"case": str(src.source_case.id_case)},
                )
                return Response({
                    "pending": task.task_status == "PENDING",
                    "values": [],
                    "status": task.task_status,
                })


class SourcePluginsList(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        source_disk = DissectEngine(src)
        return Response(source_disk.get_plugins())


class SourceRegistry(BaseApiView):
    # Whitelist : seuls ces champs peuvent être filtrés/triés (anti-injection ORM)
    ALLOWED_FIELDS = {
        "key": "reg_key",
        "value": "reg_value",
        "parent": "reg_parent",
        "path": "reg_path",
        "ts": "reg_ts",
    }

    def get(self, request, id_source, start, end):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        queryset = apply_grid_filters(
            Registry.objects.filter(reg_source=src), request, self.ALLOWED_FIELDS
        )
        return Response(list(queryset[int(start):int(end)].values()))


class SourceRegistrySize(BaseApiView):
    ALLOWED_FIELDS = SourceRegistry.ALLOWED_FIELDS

    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        queryset = apply_grid_filters(
            Registry.objects.filter(reg_source=src), request, self.ALLOWED_FIELDS
        )
        return Response({"size": queryset.count()})


class SourceRegistryKeys(BaseApiView):
    def get(self, request, id_source):
        """Get the subkeys of a registry key"""
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        path = request.query_params.get("path")
        if not path:
            return self.bad_request("path is required")
        source = DissectEngine(src)
        return Response(source.get_registry_subkeys(path))


class SourceRegistryValues(BaseApiView):
    def get(self, request, id_source):
        """Get the values of a registry key"""
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        path = request.query_params.get("path")
        if not path:
            return self.bad_request("path is required")
        source = DissectEngine(src)
        return Response(source.get_registry_values(path))


class SourceRegistryPathDataGrid(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        path = request.query_params.get("path")
        if not path:
            return self.bad_request("path is required")
        queryset = Registry.objects.filter(reg_source=src, reg_parent=path)
        return Response(list(queryset.values()))


class SourceTasks(BaseApiView):
    def get(self, request, id_source):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        tasks = Task.objects.filter(task_src=src)
        return Response(list(tasks.values()))


class SourceTasksStatus(BaseApiView):
    def get(self, request, id_source, task_status):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        tasks = Task.objects.filter(task_src=src, task_status=task_status)
        return Response(list(tasks.values()))


class SourceTask(BaseApiView):
    def get(self, request, id_source, task_type):
        try:
            src = Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()
        try:
            task = Task.objects.get(task_src=src, task_type=task_type)
            return Response({"task_status": task.task_status})
        except Task.DoesNotExist:
            return Response({"task_status": "NOT FOUND"})
