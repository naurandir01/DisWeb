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
        # Effective role: superusers (e.g. the account created by `initadmin`,
        # which knows nothing about Profiles) are ADMIN regardless of what a
        # lazily-created default Profile says.
        role = "ADMIN" if request.user.is_superuser else profile.role
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "role": role,
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


class UserManagementView(BaseApiView):
    """GET: list all users with their roles and groups (ADMIN only).
    POST: create a user (ADMIN only)."""
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def _serialize(self, u: User):
        profile = getattr(u, "profile", None)
        return {
            "username": u.username,
            "email": u.email,
            "is_active": u.is_active,
            "is_superuser": u.is_superuser,
            "last_login": u.last_login.isoformat() if u.last_login else None,
            "role": profile.role if profile else "ANALYST",
            "organisation": profile.organisation if profile else "",
            "groups": sorted(g.name for g in u.groups.all()),
        }

    def get(self, request):
        return Response([self._serialize(u) for u in User.objects.all()])

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or ""
        email = (request.data.get("email") or "").strip()
        role = request.data.get("role") or "ANALYST"

        if not username or not password:
            return self.bad_request("username and password are required")
        if len(password) < 8:
            return self.bad_request("Password must be at least 8 characters")
        if role not in ("ADMIN", "ANALYST", "VIEWER"):
            return self.bad_request("Invalid role")
        if User.objects.filter(username=username).exists():
            return self.bad_request("This username already exists")

        user = User.objects.create_user(
            username=username, email=email, password=password
        )
        Profile.objects.get_or_create(user=user, defaults={"role": role})

        AuditLog.log(
            action="USER_CREATE",
            target=username,
            user=request.user,
            ip_address=request.META.get("REMOTE_ADDR"),
            detail={"role": role},
        )
        return Response(self._serialize(user), status=status.HTTP_201_CREATED)


class UserDetailView(BaseApiView):
    """PATCH: update role / groups / active / password (ADMIN only).
    DELETE: remove a user (ADMIN only, cannot delete self or a superuser)."""
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def patch(self, request, username):
        user = User.objects.filter(username=username).first()
        if not user:
            return self.not_found("Unknown user")

        detail_changes = {}

        if "role" in request.data:
            new_role = request.data.get("role")
            if new_role not in ("ADMIN", "ANALYST", "VIEWER"):
                return self.bad_request("Invalid role")
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.role = new_role
            profile.save()
            detail_changes["role"] = new_role

        if "groups" in request.data:
            groups = request.data.get("groups")
            if not isinstance(groups, list):
                return self.bad_request("'groups' must be a list of group names")
            from django.contrib.auth.models import Group
            unknown = [g for g in groups if not Group.objects.filter(name=g).exists()]
            if unknown:
                return self.bad_request("Unknown groups: " + ", ".join(unknown))
            user.groups.set(Group.objects.filter(name__in=groups))
            detail_changes["groups"] = sorted(groups)

        if "is_active" in request.data:
            if user == request.user:
                return self.bad_request("You cannot deactivate your own account")
            user.is_active = bool(request.data.get("is_active"))
            detail_changes["is_active"] = user.is_active

        if "password" in request.data:
            new_password = request.data.get("password") or ""
            if len(new_password) < 8:
                return self.bad_request("Password must be at least 8 characters")
            user.set_password(new_password)
            detail_changes["password"] = "changed"

        if not detail_changes:
            return self.bad_request("Nothing to update")

        user.save()
        AuditLog.log(
            action="USER_UPDATE",
            target=username,
            user=request.user,
            ip_address=request.META.get("REMOTE_ADDR"),
            detail=detail_changes,
        )
        response_view = UserManagementView()
        response_view.request = request
        return Response(response_view._serialize(user))

    def delete(self, request, username):
        user = User.objects.filter(username=username).first()
        if not user:
            return self.not_found("Unknown user")
        if user == request.user:
            return self.bad_request("You cannot delete your own account")
        if user.is_superuser and not request.user.is_superuser:
            return self.bad_request("Only a superuser can delete a superuser")

        username_deleted = user.username
        user.delete()
        AuditLog.log(
            action="USER_DELETE",
            target=username_deleted,
            user=request.user,
            ip_address=request.META.get("REMOTE_ADDR"),
            detail={},
        )
        return Response({"detail": f"User {username_deleted} deleted"})


class GroupListView(BaseApiView):
    """GET: all Django groups with member counts (ADMIN only).
    POST: create a group (ADMIN only)."""
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request):
        from django.contrib.auth.models import Group
        return Response([
            {
                "name": g.name,
                "members": sorted(u.username for u in g.user_set.all()),
            }
            for g in Group.objects.all().order_by("name")
        ])

    def post(self, request):
        from django.contrib.auth.models import Group
        name = (request.data.get("name") or "").strip()
        if not name:
            return self.bad_request("Group name is required")
        if Group.objects.filter(name=name).exists():
            return self.bad_request("This group already exists")
        Group.objects.create(name=name)
        AuditLog.log(
            action="GROUP_CREATE",
            target=name,
            user=request.user,
            ip_address=request.META.get("REMOTE_ADDR"),
            detail={},
        )
        return Response({"name": name, "members": []}, status=status.HTTP_201_CREATED)


class GroupDetailView(BaseApiView):
    """DELETE: remove a group (ADMIN only)."""
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def delete(self, request, name):
        from django.contrib.auth.models import Group
        group = Group.objects.filter(name=name).first()
        if not group:
            return self.not_found("Unknown group")
        group.delete()
        AuditLog.log(
            action="GROUP_DELETE",
            target=name,
            user=request.user,
            ip_address=request.META.get("REMOTE_ADDR"),
            detail={},
        )
        return Response({"detail": f"Group {name} deleted"})


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
