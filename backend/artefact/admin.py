from django.contrib import admin
from .models import Artefact,Registry,Timeline
# Register your models here.

class ArtefactAdmin(admin.ModelAdmin):
    list_display = ('id_artefact', 'artefact_type', 'artefact_src__source_name', 'artefact_case__case_name')
    search_fields = ('artefact_type', 'artefact_src__source_name')

admin.site.register(Artefact,ArtefactAdmin)
admin.site.register(Registry)
admin.site.register(Timeline)