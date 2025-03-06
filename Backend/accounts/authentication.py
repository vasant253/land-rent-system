from django.contrib.auth.backends import ModelBackend
from .models import CustomUser

class EmailAuthBackend(ModelBackend):
    """Authenticate using email instead of username."""
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = CustomUser.objects.get(email=username)  # Use email for lookup
            if user.check_password(password):  # Check hashed password
                return user
        except CustomUser.DoesNotExist:
            return None
