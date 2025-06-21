from django.contrib import admin
from .models import Artefact,Registry,Timeline
# Register your models here.

admin.site.register(Artefact)
admin.site.register(Registry)
admin.site.register(Timeline)