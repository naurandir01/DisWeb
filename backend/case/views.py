from django.core.cache import cache
from django.http import HttpResponse,JsonResponse
from django.views.generic import TemplateView
from .models import Case
from source.models import Source
from artefact.models import Timeline
from django.core import serializers
from back.settings import CASE_DIRECTORY
from rest_framework.views import APIView
from .serializers import CaseSerializer
from back.database import convertOperator
from django.db.models.functions import ExtractYear,ExtractMonth,ExtractDay,ExtractHour,ExtractMinute,ExtractSecond
from django.db.models import Count
import os
import re
import meilisearch

operator_mapping = {
    'startsWith': 'startswith',
    'endsWith': 'endswith',
    'equals': 'exact',
    'notEquals': 'iexact',
    'contains': 'contains',
    'notContains': 'icontains',  
    'greaterThan': 'gt',
    'lessThan': 'lt',
    'before': 'lt',
    'after': 'gt',
}

class CasesViews(APIView):
    """
    Permet de recuperer tous les cas ou de créer un cas :model:`case.Case`,
    
    **GET**
    
    Renvoie la liste des cas
    
    **POST**
    
    Créer un cas,  une instance de :model:`case.Case`
    """
    def get(self,request):
        cases = Case.objects.all()
        serailers = CaseSerializer(cases,many=True)
        return JsonResponse(serailers.data,safe=False)
    
    def post(self,request):
        case = Case(
            case_name=request.POST['case_name'],
            )
        case.save()
        cache.delete(f'cases')
        return HttpResponse("Creation du cas")

class CaseView(TemplateView):
    """
    Permet de recuperer un cas ou de le supprimer
    
    **GET**
    
    Recupere le cas à partir de son id, renvoie une instance :model:`case.Case`
    
    **DELETE**
    
    Supprime le cas à partir de son id
    
    """
    def get(self,request,id_case):
        query = Case.objects.all().filter(id_case=id_case)
        case = list(query.values())
        return JsonResponse(case,safe=False)
    
    def delete(self,request,id_case):
        case = Case.objects.get(id_case=id_case)
        
        meili_client = meilisearch.Client('http://disweb_meilisearch:7700', '2HMCrPPjfhtm8U0aqRcJhCAe52L28n5VM5CfVzfz330')
        artefacts_index = meili_client.index(case.case_name+'_artefacts')
        artefacts_index.delete()
        
        Case.objects.all().filter(id_case=id_case).delete()
        return HttpResponse("Supprésion du cas: %s." % id_case)

class CaseTaskView(TemplateView):
    def get(self,request,id_case):
        return HttpResponse("Voici toutes les taches du cas %s" % id_case)

class CaseSourceView(TemplateView):
    """
    Recupere la liste des prelevements d'un artefact
    """
    def get(self,request,id_case):
        query = Source.objects.all().filter(source_case=id_case)
        return JsonResponse(list(query.values()),safe=False)


class CaseSourceNonLierView(TemplateView):
    def get(self,request,id_case):
        case = Case.objects.all().filter(id_case=id_case).values()[0]
        case_path = CASE_DIRECTORY +'/'+case['case_name']
        case_dir = os.listdir(case_path)
        list_file = []
        list_finale = []
        for dir in case_dir:
            if os.path.isdir(case_path+'/'+dir):
                for file in os.listdir(case_path+'/'+dir):
                    if os.path.isfile(case_path+'/'+dir+'/'+file):
                        list_file.append(case_path+'/'+dir+'/'+file)
        print(list_file)
        for file in list_file:
            try:
                inside = Source.objects.get(source_case=id_case,source_path=file)
            except Source.DoesNotExist:
                list_finale.append(file)
        return JsonResponse(list_finale,safe=False)

class CaseIOCView(TemplateView):
    def get(self,request,id_case):
        return HttpResponse("Voici tous les IOC du cas %s" %id_case)

class CaseTimeline(TemplateView):
    def get(self, request, id_case):
        case = Case.objects.get(id_case=id_case)
        events  = list(Timeline.objects.all().filter(timeline_case=case).values())
        return JsonResponse(events,safe=False)
        
class CaseTimelineStartEnd(TemplateView):
    def get(self, request, id_case,start,end):
        case = Case.objects.get(id_case=id_case)

        filter_field = request.GET.get('filtermodel[0][field]')
        filter_operator = request.GET.get('filtermodel[0][operator]')
        filter_value = request.GET.get('filtermodel[0][value]')

        sort_field = request.GET.get('sortingmodel[0][field]')
        sort_order = request.GET.get('sortingmodel[0][sort]')

        queryset = Timeline.objects.filter(timeline_case=case)

        timerange = request.GET.get('timerange')
        if timerange != '':
            queryset = self.time_range(timerange,queryset)

        if filter_value:
            kwargs = {'{0}{1}'.format(filter_field,convertOperator(filter_operator)): filter_value}
            queryset = queryset.filter(**kwargs)
        
        if sort_field:
            if sort_order == 'asc':
                queryset = queryset.order_by(sort_field)
            else:
                queryset = queryset.order_by(f'-{sort_field}')

        queryset  = queryset[start:end]
        data = list(queryset.values())
        return JsonResponse(data,safe=False)
    
    def time_range(self,timerange,queryset):
        if re.match(r'^\d{4}$',timerange):
            return queryset.filter(timeline_ts__year=timerange)
        elif re.match(r'^\d{4}-\d{2}$',timerange):
            year,month = timerange.split('-')
            return queryset.filter(timeline_ts__year=year,timeline_ts__month=month)
        elif re.match(r'^\d{4}-\d{2}-\d{2}$',timerange):
            year,month,day = timerange.split('-')
            return queryset.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day)
        elif re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}$',timerange):
            datetime, hour = timerange.split('T')
            year,month,day = datetime.split('-')
            return queryset.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day,timeline_ts__hour=hour)
        elif re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$',timerange):
            datetime, hour = timerange.split('T')
            year,month,day = datetime.split('-')
            hour,minute = hour.split(':')
            return queryset.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day,timeline_ts__hour=hour,timeline_ts__minute=minute)

class CaseTimelineSize(TemplateView):
    def get(self, request, id_case):
        case = Case.objects.get(id_case=id_case)

        filter_field = request.GET.get('filtermodel[0][field]')
        filter_operator = request.GET.get('filtermodel[0][operator]')
        filter_value = request.GET.get('filtermodel[0][value]')

        queryset = Timeline.objects.filter(timeline_case=case)

        timerange = request.GET.get('timerange')

        if timerange != '':
            queryset = self.time_range(timerange,queryset)
        
        if filter_value:
            kwargs = {'{0}{1}'.format(filter_field,convertOperator(filter_operator)): filter_value}
            queryset = queryset.filter(**kwargs)
        
        size = len(list(queryset.values()))
        return JsonResponse({'size':size},safe=False)
    
    def time_range(self,timerange,queryset):
        if re.match(r'^\d{4}$',timerange):
            return queryset.filter(timeline_ts__year=timerange)
        elif re.match(r'^\d{4}-\d{2}$',timerange):
            year,month = timerange.split('-')
            return queryset.filter(timeline_ts__year=year,timeline_ts__month=month)
        elif re.match(r'^\d{4}-\d{2}-\d{2}$',timerange):
            year,month,day = timerange.split('-')
            return queryset.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day)
        elif re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}$',timerange):
            datetime, hour = timerange.split('T')
            year,month,day = datetime.split('-')
            return queryset.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day,timeline_ts__hour=hour)
        elif re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$',timerange):
            datetime, hour = timerange.split('T')
            year,month,day = datetime.split('-')
            hour,minute = hour.split(':')
            return queryset.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day,timeline_ts__hour=hour,timeline_ts__minute=minute)


class CaseTimelineViewMinMax(TemplateView):
    def get(self,request,id_case):
        case = Case.objects.get(id_case=id_case)
        min_max = (
            Timeline.objects.filter(timeline_case=case)
            .aggregate(min=ExtractYear('timeline_ts'),max=ExtractYear('timeline_ts'))
        )
        return JsonResponse(min_max,safe=False)

class CaseTimelineViewYears(TemplateView):
    def get(self,request,id_case):
        case = Case.objects.get(id_case=id_case)
        event_by_year = (Timeline.objects.filter(timeline_case=case)
                         .annotate(ts=ExtractYear('timeline_ts'))
                         .values('ts')
                         .annotate(count=Count('ts'))
                         .order_by('ts')
                         .values('ts','count'))
        return JsonResponse(list(event_by_year),safe=False)

class CaseTimelineCountView(TemplateView):
    def get(self,request,id_case,timestamp):
        case = Case.objects.get(id_case=id_case)
        if re.match(r'^\d{4}$',timestamp):
            count = self.get_event_by_year(timestamp,case)
        elif re.match(r'^\d{4}-\d{2}$',timestamp):
            year,month = timestamp.split('-')
            count = self.get_event_by_month(year,month,case)
        elif re.match(r'^\d{4}-\d{2}-\d{2}$',timestamp):
            year,month,day = timestamp.split('-')
            count = self.get_event_by_day(year,month,day,case)
        elif re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}$',timestamp):
            datetime, hour = timestamp.split('T')
            year,month,day = datetime.split('-')
            #year,month,day,hour = timestamp.split('-')
            count = self.get_event_by_hour(year,month,day,hour,case)
        elif re.match(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$',timestamp):
            datetime, hour = timestamp.split('T')
            year,month,day = datetime.split('-')
            hour,minute = hour.split(':')
            count = self.get_event_by_minute(year,month,day,hour,minute,case)
        else:
            count = []
        
        return JsonResponse(count,safe=False)
    
    def get_event_by_year(self,year,case):
        event_by_year = (
            Timeline.objects.filter(timeline_ts__year=year,timeline_case=case)
            .annotate(ts=ExtractMonth('timeline_ts'))
            .values('ts')
            .annotate(count=Count('ts'))
            .order_by('ts')
            .values('ts','count')
        )
        events_final= []
        for event in event_by_year:
            if event['ts'] < 10:
                event['ts'] = f"0{event['ts']}"
            event['ts'] = f"{year}-{event['ts']}"
            events_final.append(event)
        return events_final
    
    def get_event_by_month(self,year,month,case):
        event_by_month = (
            Timeline.objects.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_case=case)
            .annotate(ts=ExtractDay('timeline_ts'))
            .values('ts')
            .annotate(count=Count('id'))
            .order_by('ts')
            .values('ts','count')
        )
        events_final= []
        for event in event_by_month:
            if event['ts'] < 10:
                event['ts'] = f"0{event['ts']}"
            event['ts'] = f"{year}-{month}-{event['ts']}"
            events_final.append(event)
        return events_final
    
    def get_event_by_day(self,year,month,day,case):
        event_by_day = (
            Timeline.objects.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day,timeline_case=case)
            .annotate(ts=ExtractHour('timeline_ts'))
            .values('ts')
            .annotate(count=Count('id'))
            .order_by('ts')
            .values('ts','count')
        )
        events_final= []
        for event in event_by_day:
            if event['ts'] < 10:
                event['ts'] = f"0{event['ts']}"
            event['ts'] = f"{year}-{month}-{day}T{event['ts']}"
            events_final.append(event)
        return events_final
    
    def get_event_by_hour(self,year,month,day,hour,case):
        event_by_hour = (
            Timeline.objects.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day,timeline_ts__hour=hour,timeline_case=case)
            .annotate(ts=ExtractMinute('timeline_ts'))
            .values('ts')
            .annotate(count=Count('id'))
            .order_by('ts')
            .values('ts','count')
        )
        events_final= []
        for event in event_by_hour:
            if event['ts'] < 10:
                event['ts'] = f"0{event['ts']}"
            event['ts'] = f"{year}-{month}-{day}T{hour}:{event['ts']}"
            events_final.append(event)
        return list(event_by_hour)
    
    def get_event_by_minute(self,year,month,day,hour,minute,case):
        event_by_minute = (
            Timeline.objects.filter(timeline_ts__year=year,timeline_ts__month=month,timeline_ts__day=day,timeline_ts__hour=hour,timeline_ts__minute=minute,timeline_case=case)
            .annotate(ts=ExtractSecond('timeline_ts'))
            .values('ts')
            .annotate(count=Count('id'))
            .order_by('ts')
            .values('ts','count')
        )
        events_final= []
        for event in event_by_minute:
            if event['ts'] < 10:
                event['ts'] = f"0{event['ts']}"
            event['ts'] = f"{year}-{month}-{day}T{hour}:{minute}:{event['ts']}"
            events_final.append(event)
        return list(event_by_minute)