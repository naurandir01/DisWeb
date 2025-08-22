from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path("sources/",csrf_exempt(views.SourcesView.as_view()),name="get_add_sources"),
    path("sources/<uuid:id_source>/",csrf_exempt(views.SourceView.as_view()),name="get_delete_source"),
    path("sources/<uuid:id_source>/fs/volumes",csrf_exempt(views.SourceVolumes.as_view()),name="get_source_volumes"),
    path("sources/<uuid:id_source>/fs/get_directory",csrf_exempt(views.SourceDirectoryContent.as_view()),name="get_source_directory"),
    path("sources/<uuid:id_source>/fs/get_file",csrf_exempt(views.SourceFile.as_view()),name="get_source_file"),
    path("sources/<uuid:id_source>/fs/get_file_content",csrf_exempt(views.SourceFileContent.as_view()),name="get_source_file_content"),
    path("sources/<uuid:id_source>/fs/get_file_hexdump",csrf_exempt(views.SourceFileHexDump.as_view()),name="get_source_file_hexdump"),
    path("sources/<uuid:id_source>/artefacts/<plugin>",csrf_exempt(views.SourceArtefact.as_view()),name="get_source_artefact"),
    path("sources/<uuid:id_source>/artefacts/<plugin>/meilisearch",csrf_exempt(views.SourceArtefactMeiliSearch.as_view()),name="get_source_artefact_meilisearch"),
    path("sources/<uuid:id_source>/list_artefeacts/",csrf_exempt(views.SourcePluginsList.as_view()),name="get_source_list_artefact"),
    path('sources/<uuid:id_source>/regf',csrf_exempt(views.SourceRegistryRun.as_view()),name="get_source_registry_run"),
    path("sources/<uuid:id_source>/registry/<int:start>/<int:end>",csrf_exempt(views.SourceRegistry.as_view()),name="get_source_registry"),
    path("sources/<uuid:id_source>/registry/size",csrf_exempt(views.SourceRegistrySize.as_view()),name="get_source_registry_size"),
    path("sources/<uuid:id_source>/registry/parent/",csrf_exempt(views.SourceRegistryPath.as_view()),name="get_source_registry_parent"),
    path("sources/<uuid:id_source>/registry/getdatagrid/",csrf_exempt(views.SourceRegistryPathDataGrid.as_view()),name="get_source_registry_datagrid"),
    path('sources/<uuid:id_source>/tasks',csrf_exempt(views.SourceTasks.as_view()),name="get_source_tasks"),
    path('sources/<uuid:id_source>/tasks/<task_type>',csrf_exempt(views.SourceTask.as_view()),name="get_source_task"),
    path('sources/<uuid:id_source>/yara',csrf_exempt(views.SourceYaras.as_view()),name="get_source_yaras"),
    path('sources/<uuid:id_source>/yara/<uuid:rules>/size/<int:size>',csrf_exempt(views.SourceYara.as_view()),name="get_source_yara"),
    path('sources/<uuid:id_source>/hayabusa',csrf_exempt(views.SourceHayabusa.as_view()),name="get_source_hayabusa"),
    path('sources/<uuid:id_source>/timeline',csrf_exempt(views.SourceTimeline.as_view()),name="get_source_timeline")
]
