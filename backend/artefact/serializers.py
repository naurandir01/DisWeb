from rest_framework.serializers import ModelSerializer

from artefact.models import Registry

class RegistrySerializer(ModelSerializer):
    class Meta:
        model = Registry
        fields = '__all__'