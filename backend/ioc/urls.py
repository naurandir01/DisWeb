from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views


urlpatterns = [
    path("iocs/",csrf_exempt(views.IocsView.as_view()),name="get_all_ioc"),
    path("iocs/<uuid:id_ioc>",csrf_exempt(views.IocView.as_view()),name="get_delete_ioc"),
    path("iocs_types/",csrf_exempt(views.IocTypesView.as_view()),name="get_all_ioc_type"),
    path("iocs_types/<uuid:id_ioctype>",csrf_exempt(views.IocTypeView.as_view()),name="get_delete_ioc_type"),
    path("cases/<uuid:id_case>/iocs",csrf_exempt(views.IocCaseView.as_view()),name="get_ioc_case"),
]
