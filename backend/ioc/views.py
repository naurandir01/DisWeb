from django.shortcuts import render
from .models import IOC,IOCType
from case.models import Case
from source.models import Source
from django.views.generic import TemplateView
from django.http import HttpResponse,JsonResponse

class IocsView(TemplateView):
    def get(self,request):
        query = IOC.objects.all().values()
        return JsonResponse(list(query),safe=False)
    
    def post(self,request):
        ioc_type = IOCType.objects.get(ioctype_value=request.POST['ioc_type'])
        ioc_case = Case.objects.get(id_case=request.POST['ioc_case'])
        ioc_src = Source.objects.get(id_source=request.POST['ioc_src'])
        ioc = IOC(
            ioc_case = ioc_case,
            ioc_src = ioc_src,
            ioc_type = ioc_type,
            ioc_value = request.POST['ioc_value'],
        )
        ioc.save()
        return HttpResponse("Création de l'IOC")

class IocCaseView(TemplateView):
    def get(self,request,id_case):
        #query = IOC.objects.all().filter(ioc_case=id_case).values()
        query = IOC.objects.filter(ioc_case=id_case).select_related('ioc_type').all().values('id_ioc', 'ioc_value', 'ioc_type__ioctype_value', 'ioc_src', 'ioc_case','ioc_type')
        return JsonResponse(list(query),safe=False)

class IocView(TemplateView):
    def get(self,request,id_ioc):
        query = IOC.objects.all().filter(id_ioc=id_ioc).values()
        return JsonResponse(list(query),safe=False)
    def delete(self,request,id_ioc):
        IOC.objects.all().filter(id_ioc=id_ioc).delete()
        return HttpResponse("Suppresion de l'IOC")

class IocTypesView(TemplateView):
    def get(self,request):
        query = IOCType.objects.all().values()
        return JsonResponse(list(query),safe=False)
    def post(self,request):
        ioctype = IOCType(
            ioctype_value = request.POST['ioc_type_value'],
            ioctype_description = request.POST['ioc_type_description'],
        )
        ioctype.save()
        query = IOCType.objects.all().values()
        return JsonResponse(list(query),safe=False)

class IocTypeView(TemplateView):
    def get(self,request,id_ioctype):
        query = IOCType.objects.all().filter(id_ioctype=id_ioctype).values()
        return JsonResponse(list(query),safe=False)
    def delete(self,request,id_ioctype):
        IOCType.objects.all().filter(id_ioctype=id_ioctype).delete()
        return HttpResponse("Suppresion du type d'IOC")

class IocOpenCTI(TemplateView):
    """
    Permet de recuperer le détail d'un IOC contenue dans une instance OPENCTI
    """
    def get(self,request,ioc):
        """
        Récupère le détail d'un IOC contenu dans une instance OPENCTI

        :param request: Requête HTTP
        :param ioc: Identifiant de l'IOC

        :return: Détail de l'IOC au format JSON
        """
        query = IOC.objects.all().values()
        return JsonResponse(list(query),safe=False)

class IocIRISWEB(TemplateView):
    """
    Permet de recuperer le détail d'un IOC contenue dans une instance IRISWEB
    """
    def post(self,request,ioc):
        """
        Envoie un ioc vers une instance IRISWEB

        :param request: Requête HTTP
        :param ioc: Identifiant de l'IOC

        :return: Détail de l'IOC au format JSON
        """
        query = IOC.objects.all().values()
        return JsonResponse(list(query),safe=False)
    