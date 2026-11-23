from django.urls import path

from . import views

urlpatterns = [
    path("artefacts/",views.ArtefactsView.as_view(),name="get_all_artefeact"),
]
