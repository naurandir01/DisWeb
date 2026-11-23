# backend/ioc/views.py
from rest_framework.response import Response

from back.apibase import BaseApiView
from back.roles import IsAdminRole, IsAdminOrAnalyst
from user.models import AuditLog, audit_from_request
from .models import IOC, IOCType
from case.models import Case
from source.models import Source


class IocsView(BaseApiView):
    # Analysts can record IOCs on evidence; only VIEWER is read-only
    permission_classes = BaseApiView.permission_classes + [IsAdminOrAnalyst]

    def get(self, request):
        return Response(list(IOC.objects.all().values()))

    def post(self, request):
        try:
            ioc_type = IOCType.objects.get(ioctype_value=request.POST["ioc_type"])
            ioc_case = Case.objects.get(id_case=request.POST["ioc_case"])
            ioc_src = Source.objects.get(id_source=request.POST["ioc_src"])
            ioc_value = request.POST["ioc_value"]
        except (KeyError, IOCType.DoesNotExist, Case.DoesNotExist, Source.DoesNotExist):
            return self.bad_request("Invalid IOC payload")

        ioc = IOC(
            ioc_case=ioc_case,
            ioc_src=ioc_src,
            ioc_type=ioc_type,
            ioc_value=ioc_value,
        )
        ioc.save()
        audit_from_request(
            AuditLog.Action.IOC_CREATE, request,
            target=str(ioc.id_ioc),
            detail={"case": str(ioc_case.id_case), "type": ioc_type.ioctype_value},
        )
        return Response({"id_ioc": str(ioc.id_ioc)}, status=201)


class IocCaseView(BaseApiView):
    def get(self, request, id_case):
        query = (
            IOC.objects.filter(ioc_case=id_case)
            .select_related("ioc_type")
            .values(
                "id_ioc", "ioc_value", "ioc_type__ioctype_value",
                "ioc_src", "ioc_case", "ioc_type",
            )
        )
        return Response(list(query))


class IocView(BaseApiView):
    # Deleting evidence-linked records is administrative
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request, id_ioc):
        return Response(list(IOC.objects.filter(id_ioc=id_ioc).values()))

    def delete(self, request, id_ioc):
        IOC.objects.filter(id_ioc=id_ioc).delete()
        return Response({"detail": "IOC deleted"})


class IocTypesView(BaseApiView):
    # Administering the IOC type catalogue is administrative
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request):
        return Response(list(IOCType.objects.all().values()))

    def post(self, request):
        try:
            ioctype = IOCType(
                ioctype_value=request.POST["ioc_type_value"],
                ioctype_description=request.POST["ioc_type_description"],
            )
        except KeyError:
            return self.bad_request("Invalid IOC type payload")
        ioctype.save()
        return Response(list(IOCType.objects.all().values()))


class IocTypeView(BaseApiView):
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request, id_ioctype):
        return Response(list(IOCType.objects.filter(id_ioctype=id_ioctype).values()))

    def delete(self, request, id_ioctype):
        IOCType.objects.filter(id_ioctype=id_ioctype).delete()
        return Response({"detail": "IOC type deleted"})


class IocOpenCTI(BaseApiView):
    """Permet de recuperer le détail d'un IOC contenue dans une instance OPENCTI

    TODO: à implémenter. Répond explicitement "Not implemented" au lieu
    de renvoyer des données internes non pertinentes.
    """
    def get(self, request, ioc):
        return Response({"detail": "Not implemented yet"}, status=501)


class IocIRISWEB(BaseApiView):
    """Permet d'envoyer un IOC vers une instance IRISWEB

    TODO: à implémenter. Répond explicitement "Not implemented" au lieu
    de renvoyer des données internes non pertinentes.
    """
    def post(self, request, ioc):
        return Response({"detail": "Not implemented yet"}, status=501)
