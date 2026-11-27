# backend/user/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("users/me/", views.MyProfileView.as_view(), name="my_profile"),
    path("users/", views.UserManagementView.as_view(), name="user_management"),
    path("users/<slug:username>/role/", views.ProfileRoleView.as_view(), name="profile_role"),
    path("users/<slug:username>/", views.UserDetailView.as_view(), name="user_detail"),
    path("groups/", views.GroupListView.as_view(), name="group_list"),
    path("groups/<slug:name>/", views.GroupDetailView.as_view(), name="group_detail"),
    path("audit/", views.AuditLogView.as_view(), name="audit_log"),
    path("settings/integrity/", views.IntegritySettingView.as_view(), name="integrity_setting"),
    path("sources/<uuid:id_source>/integrity/", views.SourceIntegrityCheckView.as_view(), name="source_integrity"),
]
