# backend/back/roles.py
"""Role-based DRF permissions (sprint 3).

Roles live on the Profile model (user.Profile, OneToOne to auth.User).
Legacy users without a Profile are treated as ANALYST (can analyse, not
administer) — except superusers, who are always ADMIN.
"""
from rest_framework.permissions import BasePermission, SAFE_METHODS

from user.models import Profile


def _role_of(user) -> str:
    if user.is_superuser:
        return "ADMIN"
    profile = getattr(user, "profile", None)
    return profile.role if profile is not None else "ANALYST"


class IsAdminRole(BasePermission):
    """Write access (non-safe methods) requires the ADMIN role.
    Read access (GET/HEAD/OPTIONS) is open to any authenticated user."""

    message = "Administrator role required."

    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        return _role_of(request.user) == "ADMIN"


class IsAdminOrAnalyst(BasePermission):
    """Write access requires ADMIN or ANALYST (i.e. only VIEWER is read-only).
    Read access is open to any authenticated user."""

    message = "Read-only role cannot perform this action."

    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        return _role_of(request.user) != "VIEWER"
