# backend/back/apibase.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


class BaseApiView(APIView):
    """Base class for all DisWeb API views.

    - Enforces JWT authentication (configured in settings via
      DEFAULT_AUTHENTICATION_CLASSES).
    - Applies IsAuthenticated to every subclass unless overridden.
    - Provides a consistent 404/400 error shape for the frontend.
    """
    permission_classes = [IsAuthenticated]

    def not_found(self, message: str = "Not Found"):
        return Response({"detail": message}, status=status.HTTP_404_NOT_FOUND)

    def bad_request(self, message: str = "Bad Request"):
        return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)
