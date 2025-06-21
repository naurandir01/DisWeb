from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import YaraRule
from django.views.generic import TemplateView
# Create your views here.

class YaraRulesView(TemplateView):
    def get(self,request):
        query = YaraRule.objects.all().values()
        return JsonResponse(list(query),safe=False)
    
    def post(self,request):
        yara_content = request.POST['yararule_content']
        yararule_path = '/backend/external/yara/' + request.POST['yararule_name'] + '.yar'
        with open(yararule_path, 'a') as f:
            f.write(yara_content)
        yararule = YaraRule(
            yararule_path = yararule_path,
            yararule_name = request.POST['yararule_name'],
            yararule_description = request.POST['yararule_description'],
        )
        yararule.save()
        return HttpResponse("Yara rule created successfully")

class YaraRuleView(TemplateView):
    def get(self,request,id_yararule):
        yararule = YaraRule.objects.get(id_yararule=id_yararule)
        yararule_content = open(yararule.yararule_path, 'r').read()
        return JsonResponse({'yararule_content':yararule_content},safe=False)
    
    def delete(self,request,id_yararule):
        YaraRule.objects.all().filter(id_yararule=id_yararule).delete()
        return HttpResponse("Suppresion de la règle YARA")
    
    def post(self,request,id_yararule):
        yararule = YaraRule.objects.get(id_yararule=id_yararule)
        new_yara_content = request.POST['yararule_content']
        with open(yararule.yararule_path, 'w') as f:
            f.write(new_yara_content)
        return HttpResponse("YARA rule updated successfully")
