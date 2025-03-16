from django.db import models
from django.conf import settings

class Land(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Foreign Key from User model
    land_id = models.AutoField(primary_key=True)  # Auto-incremented Land ID
    location = models.CharField(max_length=255)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    area = models.FloatField(help_text="Area in acres or sq. meters")
    land_type = models.CharField(max_length=100, choices=[('Agricultural', 'Agricultural'), ('Commercial', 'Commercial'), ('Residential', 'Residential')])
    utilities_available = models.TextField(help_text="Electricity, Water, etc.")
    soil_quality = models.CharField(max_length=255, help_text="Soil fertility & type")
    land_access = models.CharField(max_length=255, help_text="Road access, transportation")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    land_status = models.CharField(max_length=50, choices=[('Available', 'Available'), ('Rented', 'Rented'), ('Sold', 'Sold')],default="Available")
    status = models.CharField(
        max_length=20,
        choices=[("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected")],
        default="Pending"
    )
    available_from = models.DateField()
    available_to = models.DateField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    seven_twelve_doc = models.FileField(upload_to="land_documents/", blank=True, null=True, help_text="Upload 7/12 land document")

    def __str__(self):
        return f"{self.location} - {self.owner.username}"


class LandImage(models.Model):
    land = models.ForeignKey(Land, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="land_images/")

class RentRequest(models.Model):
    renter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rent_requests")
    land = models.ForeignKey("lands.Land", on_delete=models.CASCADE, related_name="rent_requests")
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="land_requests")
    status = models.CharField(
        max_length=20,
        choices=[("Pending", "Pending"), ("Accepted", "Accepted"), ("Rejected", "Rejected")],
        default="Pending"
    )
    request_date = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"Image for {self.land.location}"
