from django.contrib import admin

# Register your models here.

from .models import Case

class CaseAdmin(admin.ModelAdmin):
    list_display = ('id_case', 'case_name', 'case_description', 'case_create')
    search_fields = ('case_name', 'case_description','case_create')
    list_filter = ('case_create',)


admin.site.register(Case)