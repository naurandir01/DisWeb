from celery import Celery
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back.settings")

app = Celery("back")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.conf.task_track_started = True

# Periodic tasks (sprint 3): evidence integrity dispatcher.
# Runs every 15 minutes; the dispatcher itself decides which sources
# are stale according to the admin-configured interval.
app.conf.beat_schedule = {
    "integrity-dispatcher": {
        "task": "task.integrity_tasks.integrity_dispatcher",
        "schedule": 15 * 60,  # seconds
    },
}
app.autodiscover_tasks()
