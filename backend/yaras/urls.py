from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path("yara/",csrf_exempt(views.YaraRulesView.as_view()),name="get_all_yararules"),
    path("yara/<uuid:id_yararule>",csrf_exempt(views.YaraRuleView.as_view()),name="get_delete_yararule"),
]
