# backend/user/models.py
from django.conf import settings
from django.db import models
import uuid


class Profile(models.Model):
    """Extra attributes attached to the Django auth user (OneToOne).

    Kept separate from AbstractUser on purpose: SimpleJWT and the
    `initadmin` command keep working unchanged, and roles evolve here.
    """

    ROLE_CHOICES = [
        ("ADMIN", "Administrator"),
        ("ANALYST", "Analyst"),
        ("VIEWER", "Read-only"),
    ]

    id_profile = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="ANALYST")
    # Optional: organisation/lab name of the examiner, useful in reports
    organisation = models.CharField(max_length=250, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

    @property
    def is_admin(self) -> bool:
        return self.role == "ADMIN"

    @property
    def is_viewer(self) -> bool:
        return self.role == "VIEWER"


class AuditLog(models.Model):
    """Immutable trail of every action touching evidence (chain of custody).

    Entries are append-only: no update/delete through the API, and the
    `log()` classmethod is the only way to create rows.
    """

    # Action vocabulary (keep exhaustive and stable for reporting)
    class Action(models.TextChoices):
        CASE_CREATE = "CASE_CREATE"
        CASE_DELETE = "CASE_DELETE"
        SOURCE_CREATE = "SOURCE_CREATE"
        SOURCE_DELETE = "SOURCE_DELETE"
        SOURCE_HASH_VERIFY = "SOURCE_HASH_VERIFY"
        FILE_ACCESS = "FILE_ACCESS"          # reading a file from evidence
        HEXDUMP_ACCESS = "HEXDUMP_ACCESS"
        REGISTRY_ACCESS = "REGISTRY_ACCESS"
        TASK_LAUNCH = "TASK_LAUNCH"          # analysis started
        IOC_CREATE = "IOC_CREATE"
        IOC_DELETE = "IOC_DELETE"
        YARA_CREATE = "YARA_CREATE"
        YARA_DELETE = "YARA_DELETE"

    id_auditlog = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    # Who (nullable: system/celery actions have no request user)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="audit_entries",
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    # What
    action = models.CharField(max_length=32, choices=Action.choices, db_index=True)
    # Target: free-form reference, e.g. "<case_uuid>", "<source_uuid>",
    # or "source=<uuid>;file=<path>" for FILE_ACCESS entries.
    target = models.CharField(max_length=1000, db_index=True)

    # Structured details (JSONB on PostgreSQL): sizes, hashes, plugin names…
    detail = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["action", "timestamp"]),
            models.Index(fields=["user", "timestamp"]),
        ]

    def __str__(self):
        actor = self.user.username if self.user_id else "system"
        return f"{self.timestamp:%Y-%m-%d %H:%M:%S} {actor} {self.action} {self.target}"

    @classmethod
    def log(cls, *, action, target, user=None, ip_address=None, detail=None):
        """Single entry point for appending audit rows. Never raises."""
        try:
            cls.objects.create(
                action=action,
                target=str(target)[:1000],
                user=user,
                ip_address=ip_address,
                detail=detail,
            )
        except Exception:
            # An audit failure must not break the forensic operation, but it
            # must be loud in logs — an investigation depends on this trail.
            import logging

            logging.getLogger(__name__).exception(
                "AUDIT FAILURE: could not persist action=%s target=%s", action, target
            )


def audit_from_request(action, request, target, detail=None):
    """Convenience helper for API views: extracts user + client IP."""
    AuditLog.log(
        action=action,
        target=target,
        user=getattr(request, "user", None) if getattr(request, "user", None) and request.user.is_authenticated else None,
        ip_address=request.META.get("REMOTE_ADDR"),
        detail=detail,
    )


class IntegritySetting(models.Model):
    """Admin-configurable periodic evidence integrity verification.

    Singleton model (one row). The dispatcher task runs every
    15 minutes and verifies every source whose `source_hash_verified_at`
    is older than `interval_minutes`.
    """

    # Deterministic singleton id: always the same row, whatever the process.
    SINGLETON_ID = "00000000-0000-0000-0000-000000000001"
    id_setting = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enabled = models.BooleanField(default=True)
    interval_minutes = models.PositiveIntegerField(
        default=1440,  # daily by default
        help_text="Maximum age (minutes) of the last verification before "
                  "a source hash is recomputed.",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="integrity_setting_changes",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Integrity verification setting"

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(id_setting=cls.SINGLETON_ID)
        return obj
