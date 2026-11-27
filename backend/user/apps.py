# backend/user/apps.py
from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "user"

    def ready(self):
        # Guarantee: any superuser (initadmin, createsuperuser, shells…) has
        # an ADMIN Profile. Keeps the role system consistent without having
        # to modify legacy management commands that know nothing about it.
        from django.db.models.signals import post_save
        from django.contrib.auth.models import User

        from .models import Profile

        def ensure_superuser_profile(sender, instance, **kwargs):
            if instance.is_superuser:
                Profile.objects.get_or_create(
                    user=instance, defaults={"role": "ADMIN"}
                )

        post_save.connect(ensure_superuser_profile, sender=User, weak=False)
from django.apps import AppConfig


class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user'
