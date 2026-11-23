# backend/artefact/views.py
import logging

from rest_framework.response import Response

from back.apibase import BaseApiView
from .models import Artefact, Timeline, Registry

logger = logging.getLogger(__name__)


class ArtefactsView(BaseApiView):
    def get(self, request):  # FIX (bug #9): was missing `self` -> systematic 500
        return Response(list(Artefact.objects.all().values()))


def add_artefact(params):
    artefact = Artefact(
        artefact_type=params["artefact_type"],
        artefact_case=params["artefact_case"],
        artefact_src=params["artefact_src"],
        artefact_values=params["artefact_values"],
    )
    try:
        artefact.save()
    except Exception:
        logger.exception("Error saving artefact type: %s", artefact.artefact_type)
        raise  # do not swallow: Celery must mark the task as FAILED


def add_registry(params):
    registry = Registry(
        reg_source=params["reg_source"],
        reg_key=params["reg_key"],
        reg_value=params["reg_value"],
        reg_parent=params["reg_parent"],
        reg_ts=params["reg_ts"],
        reg_path=params["reg_path"],
    )
    try:
        registry.save()
    except Exception:
        # FIX: was silently swallowing the error (`return True`) —
        # errors must be visible so Celery marks the task as FAILED.
        logger.exception("Error saving registry key: %s", params.get("reg_key"))
        raise


def add_timeline(params):
    timeline = Timeline(
        timeline_src=params["timeline_src"],
        timeline_ts=params["timeline_ts"],
        timeline_value=params["timeline_value"],
        timeline_type=params["timeline_type"],
        timeline_case=params["timeline_case"],
    )
    try:
        timeline.save()
    except Exception:
        logger.exception(
            "Error saving timeline value: %s", params.get("timeline_value")
        )
        raise
