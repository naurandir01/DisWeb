# backend/yaras/views.py
import os
import re

from rest_framework.response import Response

from back.apibase import BaseApiView
from back.roles import IsAdminRole
from user.models import AuditLog, audit_from_request
from .models import YaraRule

# Déplacer vers keyconfig/settings en production
YARA_RULES_DIR = "/backend/external/yara"

# Validation stricte du nom : bloque "../", chemins absolus, espaces, unicode
YARA_NAME_RE = re.compile(r"^[a-zA-Z0-9_.\-]{1,100}$")


def validate_yara_name(name):
    """Return a safe rule name or None if it contains traversal characters.

    Blocks '../', absolute paths, spaces and unicode tricks (path traversal).
    """
    if not name or not YARA_NAME_RE.fullmatch(name):
        return None
    if ".." in name or name.startswith("."):
        return None
    return name


class YaraRulesView(BaseApiView):
    # Managing the rule catalogue is administrative (GET stays open)
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request):
        return Response(list(YaraRule.objects.all().values()))

    def post(self, request):
        name = validate_yara_name(request.POST.get("yararule_name", ""))
        content = request.POST.get("yararule_content", "")
        description = request.POST.get("yararule_description", "")

        if not name or not content:
            return self.bad_request("Invalid yara rule name or empty content")

        # FIX: 'w' (truncate) instead of 'a' to avoid duplicated content on
        # recreation, and mkdir to avoid crashing if the dir does not exist.
        yararule_path = os.path.join(YARA_RULES_DIR, f"{name}.yar")
        os.makedirs(YARA_RULES_DIR, exist_ok=True)
        with open(yararule_path, "w") as f:
            f.write(content)

        yararule = YaraRule(
            yararule_path=yararule_path,
            yararule_name=name,
            yararule_description=description,
        )
        yararule.save()
        audit_from_request(
            AuditLog.Action.YARA_CREATE, request,
            target=str(yararule.id_yararule),
            detail={"name": name},
        )
        return Response({"id_yararule": str(yararule.id_yararule)}, status=201)


class YaraRuleView(BaseApiView):
    # Editing/deleting rule files on disk is administrative
    permission_classes = BaseApiView.permission_classes + [IsAdminRole]

    def get(self, request, id_yararule):
        try:
            yararule = YaraRule.objects.get(id_yararule=id_yararule)
        except YaraRule.DoesNotExist:
            return self.not_found()
        try:
            with open(yararule.yararule_path, "r") as f:
                yararule_content = f.read()
        except OSError:
            return self.not_found("Yara rule file missing on disk")
        return Response({"yararule_content": yararule_content})

    def delete(self, request, id_yararule):
        try:
            yararule = YaraRule.objects.get(id_yararule=id_yararule)
        except YaraRule.DoesNotExist:
            return self.not_found()
        # FIX: also remove the file on disk (was leaving orphans behind)
        try:
            os.remove(yararule.yararule_path)
        except OSError:
            pass
        audit_from_request(
            AuditLog.Action.YARA_DELETE, request,
            target=str(id_yararule),
            detail={"name": yararule.yararule_name},
        )
        yararule.delete()
        return Response({"detail": "Yara rule deleted"})

    def post(self, request, id_yararule):
        try:
            yararule = YaraRule.objects.get(id_yararule=id_yararule)
        except YaraRule.DoesNotExist:
            return self.not_found()
        if request.POST.get("yararule_name"):
            # Renaming would orphan the file on disk — forbidden for now
            return self.bad_request("Renaming a rule is not supported")
        content = request.POST.get("yararule_content", "")
        if not content:
            return self.bad_request("Empty yara rule content")
        with open(yararule.yararule_path, "w") as f:
            f.write(content)
        return Response({"detail": "Yara rule updated"})
