from django.urls import path,include
from django.views.decorators.csrf import csrf_exempt


from . import views

urlpatterns = [
    path("cases/",csrf_exempt(views.CasesViews.as_view()),name="get_create_cases"),
    path("cases/<uuid:id_case>/",csrf_exempt(views.CaseView.as_view()),name="get_delete_case"),
    path("cases/<uuid:id_case>/task",views.CaseTaskView.as_view(),name="get_case_task"),
    path("cases/<uuid:id_case>/ioc",views.CaseIOCView.as_view(),name="get_case_ioc"),
    path("cases/<uuid:id_case>/meili",views.CaseIndexSettingsView.as_view(),name="get_case_meili_settings"),
    path("cases/<uuid:id_case>/sources",views.CaseSourceView.as_view(),name="get_case_source"),
    path("cases/<uuid:id_case>/sources/add",views.CaseSourceNonLierView.as_view(),name="get_case_source_non_lier"), 
    path("cases/<uuid:id_case>/timeline",views.CaseTimeline.as_view(),name='get_case_timeline'),
    path("cases/<uuid:id_case>/timeline/<int:start>/<int:end>",views.CaseTimelineStartEnd.as_view(),name='get_case_artefacts'),
    path("cases/<uuid:id_case>/timeline/size",views.CaseTimelineSize.as_view(),name='get_case_artefacts'),
    path("cases/<uuid:id_case>/timeline/timestamp/",views.CaseTimelineViewYears.as_view(),name='get_case_timeline_years'),
    path("cases/<uuid:id_case>/timeline/timestamp/<timestamp>",views.CaseTimelineCountView.as_view(),name='get_case_timeline_years')
]
