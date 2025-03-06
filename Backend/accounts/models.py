from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, unique=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)

    REQUIRED_FIELDS = ['phone','full_name']

    def __str__(self):
        return self.username
