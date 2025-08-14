from django.shortcuts import render
from .models import Artefact,Timeline,Registry
# Create your views here.
from django.http import HttpResponse,JsonResponse
from django.db.models.functions import ExtractYear,ExtractMonth,ExtractDay,ExtractHour,ExtractMinute
from django.db.models import Count
from django.views.generic import TemplateView
from back.meilisearch_engine import MeiliSearchClient

class ArtefactsView(TemplateView):
    def get(request):
        query = Artefact.objects.all().values()
        return JsonResponse(list(query),safe=False)

def add_artefact(params):
    artefact = Artefact(
        artefact_type = params['artefact_type'],
        artefact_case = params['artefact_case'],
        artefact_src = params['artefact_src'],
        artefact_values = params['artefact_values'],
    )
    try:
        artefact.save()
    except Exception as e:
        print(f"Error saving artefact type: {artefact.artefact_type}")
        print(f"Error saving artefact value: {artefact.artefact_values}")
        raise e
        
    

def add_registry(params):
    registry = Registry(
        reg_source = params['reg_source'],
        reg_key = params['reg_key'],
        reg_value = params['reg_value'],
        reg_parent = params['reg_parent'],
        reg_ts = params['reg_ts'],
        reg_path = params['reg_path'],
    )
    try:
        registry.save()
    except Exception as e:
        return True

def add_timeline(params):
    timeline = Timeline(
        timeline_src = params['timeline_src'],
        timeline_ts = params['timeline_ts'],
        timeline_value = params['timeline_value'],
        timeline_type = params['timeline_type'],
        timeline_case = params['timeline_case'],
    )
    timeline.save()
