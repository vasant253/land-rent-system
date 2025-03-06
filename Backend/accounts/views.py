from django.contrib.auth import login, logout
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_user_details(request):
#     auth_header = request.headers.get('Authorization')
#     print("Received Authorization Header:", auth_header)  # Debugging log

#     if not auth_header or not auth_header.startswith("Token "):
#         return Response({"detail": "Invalid or missing token"}, status=401)

#     return Response({
#         "id": request.user.id,
#         "username": request.user.username,
#         "email": request.user.email
#     })


from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    auth_header = request.headers.get('Authorization')
    print("Received Authorization Header:", auth_header)  # Debugging log

    if not auth_header or not auth_header.startswith("Token "):
        return Response({"detail": "Invalid or missing token"}, status=401)

    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email
    })


class RegisterUser(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Registration successful!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(username=email, password=password)
    if user:
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)  # Start session
        return Response({"token": token.key, "user": {"username": user.username, "email": user.email}}, status=200)
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.auth.delete()  # Delete token
    logout(request)
    return Response({"message": "Logged out successfully"}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_authentication(request):
    return Response({"isAuthenticated": True, "user": {"username": request.user.username, "email": request.user.email}})
