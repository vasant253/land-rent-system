from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "phone":user.phone,
        "full_name":user.full_name,
        "profile_photo": request.build_absolute_uri(user.profile_photo.url) if user.profile_photo else None,
    })

# User Registration View
class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Real-time Validation View
@api_view(["GET"])
@permission_classes([AllowAny])  # ✅ Allow unauthenticated users
def check_availability(request):
    """ ✅ Check if username, email, or phone is already taken """
    username = request.GET.get("username")
    email = request.GET.get("email")
    phone = request.GET.get("phone")

    response_data = {}

    if username and User.objects.filter(username=username).exists():
        response_data["username"] = "Username is already taken."

    if email and User.objects.filter(email=email).exists():
        response_data["email"] = "Email is already registered."

    if phone and User.objects.filter(phone=phone).exists():
        response_data["phone"] = "Phone number is already in use."

    if not response_data:
        return Response({"message": "Available"}, status=status.HTTP_200_OK)
    
    return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [AllowAny]  # ✅ Allow login without authentication

    def post(self, request):
        identifier = request.data.get("identifier")  # Can be email or username
        password = request.data.get("password")

        if not identifier or not password:
            return Response({"error": "Username/Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Try to identify if the input is an email or username
        user = None
        if "@" in identifier:  # ✅ Check if it's an email
            try:
                user = User.objects.get(email=identifier)  
            except ObjectDoesNotExist:
                return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)
        else:  # ✅ If not an email, assume it's a username
            user = authenticate(username=identifier, password=password)

        # Authenticate user
        if user and check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "role": user.role,
                "message": "Login successful"
            })
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class ProtectedView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You have accessed a protected route!"}, status=200)

from .permissions import IsCustomAdmin  # Import the custom permission

class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsCustomAdmin]  # Use custom permission

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsCustomAdmin]  # Use custom permission

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user  # Get the logged-in user

    # ✅ Use serializer for validation
    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "Profile updated successfully!", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    return Response(
        {"error": "Invalid data", "details": serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )