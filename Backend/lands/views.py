from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Land
from .serializers import LandSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class LandUploadView(APIView):
    authentication_classes = [TokenAuthentication]  # Authenticate via token
    permission_classes = [IsAuthenticated]  # Require user authentication

    def post(self, request, format=None):
        serializer = LandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            serializer.save()
            return Response({"message": "Land uploaded successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
