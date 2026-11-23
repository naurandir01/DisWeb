# backend/case/views.py
import os
import re

from django.db.models import Count, Min, Max
from django.db.models.functions import (
    ExtractYear, ExtractMonth, ExtractDay, ExtractHour, ExtractMinute, ExtractSecond,
)
from rest_framework.response import Response

from back.apibase import BaseApiView
from back.filters import apply_grid_filters
from back.roles import IsAdminRole
from back.meilisearch_engine import MeiliSearchClient
from back.settings import CASE_DIRECTORY
from user.models import AuditLog, audit_from_request
from .models import Case
from source.models import Source
from artefact.models import Timeline


class CasesViews(BaseApiView):
    """Permet de recuperer tous les cas ou de créer un cas :model:`case.Case`,

    **GET** : Renvoie la liste des cas (any authenticated user)
    **POST** : Créer un cas — ADMIN role required (administrative action)
    """
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request):
        from .serializers import CaseSerializer
        cases = Case.objects.all()
        return Response(CaseSerializer(cases, many=True).data)

    def post(self, request):
        case = Case(case_name=request.POST["case_name"])
        case.save()
        audit_from_request(
            AuditLog.Action.CASE_CREATE, request,
            target=str(case.id_case),
            detail={"name": case.case_name},
        )
        meili_client = MeiliSearchClient.client
        meili_client.create_index(case.case_name + "_artefacts", {"primaryKey": "id"})
        artefacts_index = meili_client.index(case.case_name + "_artefacts")
        artefacts_index.update_settings({
            "sortableAttributes": ["ts"],
            "filterableAttributes": [
                "*",
                {
                    "attributePatterns": ["*"],
                    "features": {
                        "facetSearch": True,
                        "filter": {"equality": True, "comparison": True},
                    },
                },
            ],
        })
        return Response(artefacts_index.get_settings())


class CaseView(BaseApiView):
    """Permet de recuperer un cas ou de le supprimer

    **GET** : Recupere le cas à partir de son id (any authenticated user)
    **DELETE** : Supprime le cas — ADMIN role required
    """
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request, id_case):
        return Response(list(Case.objects.filter(id_case=id_case).values()))

    def delete(self, request, id_case):
        try:
            case = Case.objects.get(id_case=id_case)
        except Case.DoesNotExist:
            return self.not_found()
        # PROTECT FKs will refuse deletion if evidence is still linked:
        # surface that clearly to the frontend instead of a raw 500.
        from django.db.models import ProtectedError
        meili_client = MeiliSearchClient.client
        artefacts_index = meili_client.index(case.case_name + "_artefacts")
        try:
            audit_from_request(
                AuditLog.Action.CASE_DELETE, request,
                target=str(id_case),
                detail={"name": case.case_name},
            )
            artefacts_index.delete()
            case.delete()
        except ProtectedError:
            return Response(
                {"detail": "Case still has linked evidence (sources/artefacts/IOC). "
                           "Delete or reassign them first."},
                status=409,
            )
        return Response({"detail": f"Case {id_case} deleted"})


class CaseTaskView(BaseApiView):
    def get(self, request, id_case):
        return Response({"detail": f"All tasks of case {id_case}"})


class CaseSourceView(BaseApiView):
    """Recupere la liste des prelevements d'un cas"""
    def get(self, request, id_case):
        return Response(list(Source.objects.filter(source_case=id_case).values()))


class CaseIndexSettingsView(BaseApiView):
    def get(self, request, id_case):
        case = Case.objects.get(id_case=id_case)
        meili_client = MeiliSearchClient.client
        artefacts_index = meili_client.index(case.case_name + "_artefacts")
        return Response(artefacts_index.get_stats())


class CaseSourceNotLink(BaseApiView):
    def get(self, request, id_case):
        try:
            case = Case.objects.filter(id_case=id_case).values()[0]
        except IndexError:
            return self.not_found()
        case_path = CASE_DIRECTORY + "/" + case["case_name"]
        list_file = []
        for dir in os.listdir(case_path):
            if os.path.isdir(case_path + "/" + dir):
                for file in os.listdir(case_path + "/" + dir):
                    if os.path.isfile(case_path + "/" + dir + "/" + file):
                        list_file.append(case_path + "/" + dir + "/" + file)
        # FIX: single query instead of one query per file
        linked = set(
            Source.objects.filter(source_case=id_case)
            .values_list("source_path", flat=True)
        )
        return Response([f for f in list_file if f not in linked])


class CaseIOCView(BaseApiView):
    def get(self, request, id_case):
        return Response({"detail": f"All IOCs of case {id_case}"})


class CaseTimeline(BaseApiView):
    def get(self, request, id_case):
        case = Case.objects.get(id_case=id_case)
        events = list(Timeline.objects.filter(timeline_case=case).values())
        return Response(events)


TIMELINE_ALLOWED_FIELDS = {
    "ts": "timeline_ts",
    "value": "timeline_value",
    "type": "timeline_type",
}


def _apply_timerange(queryset, timerange):
    """Parse YYYY / YYYY-MM / YYYY-MM-DD / ...T HH [: MM] range filters.

    FIX: rewritten with named groups instead of chained split() calls —
    same behaviour, no crash on unexpected input.
    """
    m = re.match(r"^(\d{4})$", timerange)
    if m:
        return queryset.filter(timeline_ts__year=m.group(1))
    m = re.match(r"^(\d{4})-(\d{2})$", timerange)
    if m:
        return queryset.filter(timeline_ts__year=m.group(1), timeline_ts__month=m.group(2))
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})$", timerange)
    if m:
        return queryset.filter(
            timeline_ts__year=m.group(1), timeline_ts__month=m.group(2),
            timeline_ts__day=m.group(3),
        )
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})T(\d{2})$", timerange)
    if m:
        return queryset.filter(
            timeline_ts__year=m.group(1), timeline_ts__month=m.group(2),
            timeline_ts__day=m.group(3), timeline_ts__hour=m.group(4),
        )
    m = re.match(r"^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$", timerange)
    if m:
        return queryset.filter(
            timeline_ts__year=m.group(1), timeline_ts__month=m.group(2),
            timeline_ts__day=m.group(3), timeline_ts__hour=m.group(4),
            timeline_ts__minute=m.group(5),
        )
    return queryset


class CaseTimelineStartEnd(BaseApiView):
    def get(self, request, id_case, start, end):
        case = Case.objects.get(id_case=id_case)
        queryset = Timeline.objects.filter(timeline_case=case)

        timerange = request.query_params.get("timerange", "")
        if timerange:
            queryset = _apply_timerange(queryset, timerange)

        # FIX (bug #11): whitelisted fields, negated operators via exclude()
        queryset = apply_grid_filters(queryset, request, TIMELINE_ALLOWED_FIELDS)
        return Response(list(queryset[int(start):int(end)].values()))


class CaseTimelineSize(BaseApiView):
    def get(self, request, id_case):
        case = Case.objects.get(id_case=id_case)
        queryset = Timeline.objects.filter(timeline_case=case)

        timerange = request.query_params.get("timerange", "")
        if timerange:
            queryset = _apply_timerange(queryset, timerange)

        queryset = apply_grid_filters(queryset, request, TIMELINE_ALLOWED_FIELDS)
        # FIX: was len(list(queryset.values())) -> loaded all rows in memory
        return Response({"size": queryset.count()})


class CaseTimelineViewMinMax(BaseApiView):
    def get(self, request, id_case):
        case = Case.objects.get(id_case=id_case)
        # FIX (bug #7): aggregate(ExtractYear(...)) is invalid —
        # use Min/Max on the timestamp field directly.
        min_max = Timeline.objects.filter(timeline_case=case).aggregate(
            min=Min("timeline_ts"), max=Max("timeline_ts")
        )
        return Response({
            "min": str(min_max["min"]),
            "max": str(min_max["max"]),
        })


class CaseTimelineViewYears(BaseApiView):
    def get(self, request, id_case):
        case = Case.objects.get(id_case=id_case)
        event_by_year = (
            Timeline.objects.filter(timeline_case=case)
            .annotate(ts=ExtractYear("timeline_ts"))
            .values("ts")
            .annotate(count=Count("ts"))
            .order_by("ts")
            .values("ts", "count")
        )
        return Response(list(event_by_year))


class CaseTimelineCountView(BaseApiView):
    def get(self, request, id_case, timestamp):
        case = Case.objects.get(id_case=id_case)

        m = re.match(r"^(\d{4})$", timestamp)
        if m:
            return Response(self.get_event_by_year(m.group(1), case))
        m = re.match(r"^(\d{4})-(\d{2})$", timestamp)
        if m:
            return Response(self.get_event_by_month(m.group(1), m.group(2), case))
        m = re.match(r"^(\d{4})-(\d{2})-(\d{2})$", timestamp)
        if m:
            return Response(self.get_event_by_day(m.group(1), m.group(2), m.group(3), case))
        m = re.match(r"^(\d{4})-(\d{2})-(\d{2})T(\d{2})$", timestamp)
        if m:
            return Response(self.get_event_by_hour(
                m.group(1), m.group(2), m.group(3), m.group(4), case))
        m = re.match(r"^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$", timestamp)
        if m:
            return Response(self.get_event_by_minute(
                m.group(1), m.group(2), m.group(3), m.group(4), m.group(5), case))
        return Response([])

    def _grouped(self, queryset, extract_fn, prefix, suffix=""):
        """Group timeline events by an extracted date part.

        FIX (bug #8): the original get_event_by_hour/get_event_by_minute
        returned the raw queryset BEFORE the formatting loop. Everything
        now goes through this single helper, formatted.
        """
        events = []
        for event in (
            queryset.annotate(ts=extract_fn("timeline_ts"))
            .values("ts")
            .annotate(count=Count("ts"))
            .order_by("ts")
        ):
            ts = event["ts"]
            if ts < 10:
                ts = f"0{ts}"
            events.append({"ts": f"{prefix}{ts}{suffix}", "count": event["count"]})
        return events

    def get_event_by_year(self, year, case):
        qs = Timeline.objects.filter(timeline_ts__year=year, timeline_case=case)
        return self._grouped(qs, ExtractMonth, f"{year}-")

    def get_event_by_month(self, year, month, case):
        qs = Timeline.objects.filter(
            timeline_ts__year=year, timeline_ts__month=month, timeline_case=case
        )
        return self._grouped(qs, ExtractDay, f"{year}-{month}-")

    def get_event_by_day(self, year, month, day, case):
        qs = Timeline.objects.filter(
            timeline_ts__year=year, timeline_ts__month=month,
            timeline_ts__day=day, timeline_case=case,
        )
        return self._grouped(qs, ExtractHour, f"{year}-{month}-{day}T")

    def get_event_by_hour(self, year, month, day, hour, case):
        qs = Timeline.objects.filter(
            timeline_ts__year=year, timeline_ts__month=month,
            timeline_ts__day=day, timeline_ts__hour=hour, timeline_case=case,
        )
        return self._grouped(qs, ExtractMinute, f"{year}-{month}-{day}T{hour}:")

    def get_event_by_minute(self, year, month, day, hour, minute, case):
        qs = Timeline.objects.filter(
            timeline_ts__year=year, timeline_ts__month=month,
            timeline_ts__day=day, timeline_ts__hour=hour,
            timeline_ts__minute=minute, timeline_case=case,
        )
        return self._grouped(qs, ExtractSecond, f"{year}-{month}-{day}T{hour}:{minute}:")


class CaseTimelineView(BaseApiView):
    def get(self, request, id_case):
        case = Case.objects.get(id_case=id_case)
        filter_param = request.query_params.get("filter")
        offset = request.query_params.get("offset", "0")
        limit = request.query_params.get("limit", "100")
        sort = request.query_params.get("sort", "")

        meili_client = MeiliSearchClient.client
        index = meili_client.index(case.case_name + "_artefacts")

        params = {"filter": filter_param, "offset": int(offset), "limit": int(limit)}
        if sort:
            params["sort"] = [sort]

        query = index.get_documents(params)
        return Response({
            "total": query.total,
            "hits": [vars(res) for res in query.results],
        })
