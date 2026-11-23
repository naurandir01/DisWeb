# backend/user/views.py
from rest_framework import status
from rest_framework.response import Response

from back.apibase import BaseApiView
from back.roles import IsAdminRole
from user.models import AuditLog, Profile, IntegritySetting
from django.contrib.auth.models import User
from django.db.models import Q


class MyProfileView(BaseApiView):
    """GET: current user's profile (role, organisation)."""

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "role": profile.role,
            "organisation": profile.organisation,
        })


class ProfileListView(BaseApiView):
    """GET: all profiles (ADMIN only — even read access)."""

    def get(self, request):
        me, _ = Profile.objects.get_or_create(user=request.user)
        if not me.is_admin:
            return Response({"detail": "Admin role required"}, status=403)

        return Response([
            {
                "username": p.user.username,
                "email": p.user.email,
                "role": p.role,
                "organisation": p.organisation,
            }
            for p in Profile.objects.select_related("user").all()
        ])


class ProfileRoleView(BaseApiView):
    """PATCH: change a user's role (ADMIN only)."""
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def patch(self, request, username):
        new_role = request.data.get("role")
        if new_role not in ("ADMIN", "ANALYST", "VIEWER"):
            return self.bad_request("Invalid role")

        user = User.objects.filter(username=username).first()
        if not user:
            return self.not_found("Unknown user")

        profile, _ = Profile.objects.get_or_create(user=user)
        profile.role = new_role
        profile.save()
        AuditLog.log(
            action="PROFILE_ROLE_CHANGE",
            target=username,
            user=request.user,
            ip_address=request.META.get("REMOTE_ADDR"),
            detail={"new_role": new_role},
        )
        return Response({"detail": f"Role of {username} set to {new_role}"})


class AuditLogView(BaseApiView):
    """GET: query the audit trail.

    Query params:
      action  — filter by action (e.g. FILE_ACCESS)
      user    — filter by username
      target  — substring match on target
      limit   — max entries (default 200, max 1000)
    ADMIN sees everything; others only their own entries.
    """

    def get(self, request):
        me, _ = Profile.objects.get_or_create(user=request.user)

        qs = AuditLog.objects.all()
        if not me.is_admin:
            qs = qs.filter(user=request.user)

        action = request.query_params.get("action")
        if action:
            qs = qs.filter(action=action)

        username = request.query_params.get("user")
        if username and me.is_admin:
            qs = qs.filter(user__username=username)

        target = request.query_params.get("target")
        if target:
            qs = qs.filter(target__icontains=target)

        try:
            limit = min(int(request.query_params.get("limit", "200")), 1000)
        except ValueError:
            limit = 200

        return Response([
            {
                "timestamp": entry.timestamp.isoformat(),
                "user": entry.user.username if entry.user_id else "system",
                "ip": entry.ip_address,
                "action": entry.action,
                "target": entry.target,
                "detail": entry.detail,
            }
            for entry in qs[:limit]
        ])


class IntegritySettingView(BaseApiView):
    """GET: anyone; PUT: ADMIN only (changing the integrity regime is
    an administrative action, audited)."""
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request):
        setting = IntegritySetting.get()
        return Response({
            "enabled": setting.enabled,
            "interval_minutes": setting.interval_minutes,
            "updated_at": setting.updated_at.isoformat(),
        })

    def put(self, request):
        setting = IntegritySetting.get()
        enabled = request.data.get("enabled")
        interval = request.data.get("interval_minutes")

        if enabled is None or interval is None:
            return self.bad_request("Both 'enabled' and 'interval_minutes' are required")

        try:
            interval = int(interval)
            if interval < 15:
                return self.bad_request("Interval must be >= 15 minutes")
        except (TypeError, ValueError):
            return self.bad_request("interval_minutes must be an integer")

        setting.enabled = bool(enabled)
        setting.interval_minutes = interval
        setting.updated_by = request.user
        setting.save()

        AuditLog.log(
            action="INTEGRITY_SETTING_CHANGE",
            target="integrity_setting",
            user=request.user,
            ip_address=request.META.get("REMOTE_ADDR"),
            detail={"enabled": setting.enabled, "interval_minutes": interval},
        )
        return Response({
            "enabled": setting.enabled,
            "interval_minutes": setting.interval_minutes,
            "updated_at": setting.updated_at.isoformat(),
        })


class SourceIntegrityCheckView(BaseApiView):
    """GET: force an immediate hash verification of a source's evidence file.

    Runs the SAME core check as the periodic dispatcher (synchronous:
    hashing can take minutes on large images — intended for on-demand use).
    """

    def get(self, request, id_source):
        from source.models import Source
        from task.integrity_tasks import _verify_source

        try:
            Source.objects.get(id_source=id_source)
        except Source.DoesNotExist:
            return self.not_found()

        status = _verify_source(str(id_source))
        return Response({
            "id_source": str(id_source),
            "status": status,
        })
