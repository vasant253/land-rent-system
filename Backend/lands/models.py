from django.db import models
from django.conf import settings

class Land(models.Model):
    LAND_TYPES = [
        ('Agricultural', 'Agricultural'),
        ('Residential', 'Residential'),
        ('Commercial', 'Commercial'),
        ('Industrial', 'Industrial'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    landType = models.CharField(max_length=50, choices=LAND_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class LandImage(models.Model):
    land = models.ForeignKey(Land, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="land_images/")
