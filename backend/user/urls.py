# backend/user/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("users/me/", views.MyProfileView.as_view(), name="my_profile"),
    path("users/", views.ProfileListView.as_view(), name="profile_list"),
    path("users/<slug:username>/role/", views.ProfileRoleView.as_view(), name="profile_role"),
    path("audit/", views.AuditLogView.as_view(), name="audit_log"),
    path("settings/integrity/", views.IntegritySettingView.as_view(), name="integrity_setting"),
    path("sources/<uuid:id_source>/integrity/", views.SourceIntegrityCheckView.as_view(), name="source_integrity"),
]
