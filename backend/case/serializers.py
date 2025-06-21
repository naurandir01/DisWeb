from rest_framework.serializers import ModelSerializer

from case.models import Case

class CaseSerializer(ModelSerializer):
    class Meta:
        model = Case
        fields = '__all__'