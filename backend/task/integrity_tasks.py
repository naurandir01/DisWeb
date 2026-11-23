# backend/task/integrity_tasks.py
"""Periodic evidence integrity verification (sprint 3).

A Celery Beat dispatcher runs every 15 minutes. It selects every source
whose last verification is older than the admin-configured interval
(IntegritySetting.interval_minutes, default 1440 = daily) and launches
one verification sub-task per source.

Results land in AuditLog (action SOURCE_HASH_VERIFY) and backend logs;
nothing is pushed to Meilisearch.
"""
import logging

from celery import shared_task
from django.utils import timezone
from datetime import timedelta

from source.models import Source
from user.models import AuditLog, IntegritySetting

logger = logging.getLogger(__name__)


def _verify_source(source_id: str) -> str:
    """Core check shared by the periodic task and the manual API view.

    Returns the status: 'OK', 'MISMATCH', 'NO_BASELINE' or 'ERROR'.
    Persists an AuditLog entry and the `source_hash_verified_at` timestamp.
    """
    from source.views import compute_source_sha256
    from django.utils import timezone as tz

    try:
        src = Source.objects.get(id_source=source_id)
    except Source.DoesNotExist:
        return "ERROR"

    if not src.source_hash_sha256:
        logger.info("Integrity: source %s has no baseline hash (legacy)", source_id)
        return "NO_BASELINE"

    try:
        current = compute_source_sha256(src.source_path)
    except OSError as e:
        logger.error("Integrity: source %s evidence unreadable: %s", source_id, e)
        return "ERROR"

    src.source_hash_verified_at = tz.now()
    src.save(update_fields=["source_hash_verified_at"])

    status = "OK" if current == src.source_hash_sha256 else "MISMATCH"

    if status == "MISMATCH":
        logger.critical(
            "INTEGRITY ALERT: source %s hash mismatch! recorded=%s current=%s "
            "— evidence may have been altered.",
            source_id, src.source_hash_sha256, current,
        )
    else:
        logger.info("Integrity verified for source %s (sha256 ok).", source_id)

    AuditLog.log(
        action=AuditLog.Action.SOURCE_HASH_VERIFY,
        target=str(source_id),
        detail={"status": status, "recorded": src.source_hash_sha256, "current": current},
    )
    return status


@shared_task
def verify_source_integrity(source_id: str):
    """Verify a single source's evidence hash (launched by the dispatcher
    or manually through the API)."""
    return _verify_source(str(source_id))


@shared_task
def integrity_dispatcher():
    """Periodic entry point (Celery Beat, every 15 minutes).

    Honours the admin configuration: disabled, or stale beyond the
    configured interval, sources are (re)verified in parallel sub-tasks.
    """
    setting = IntegritySetting.get()
    if not setting.enabled:
        logger.debug("Integrity dispatcher: disabled by admin.")
        return

    threshold = timezone.now() - timedelta(minutes=setting.interval_minutes)

    # Sources never verified yet, or verified too long ago (baseline required)
    to_verify = [
        str(s.id_source)
        for s in Source.objects.filter(source_hash_sha256__isnull=False)
        if s.source_hash_verified_at is None or s.source_hash_verified_at <= threshold
    ]

    if not to_verify:
        logger.debug("Integrity dispatcher: nothing stale.")
        return

    logger.info("Integrity dispatcher: verifying %d source(s).", len(to_verify))
    for source_id in to_verify:
        verify_source_integrity.delay(source_id)
