from rest_framework import serializers
from .models import Land, LandImage, RentRequest
from accounts.models import CustomUser  # Import CustomUser from accounts app

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "full_name", "email", "phone", "profile_photo"]

class LandImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandImage
        fields = ["id", "image"]

class UserVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['aadhaar_pan_doc', 'is_verified']
        read_only_fields = ['is_verified'] 

class LandSerializer(serializers.ModelSerializer):
    images = LandImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    owner = OwnerSerializer(read_only=True)

    class Meta:
        model = Land
        fields = [
            "land_id", "owner", "location", "state","status", "district", "area", "land_type",
            "utilities_available", "soil_quality", "land_access", "price", "land_status",
            "available_from", "available_to", "description", "created_at", "updated_at",
            "images", "uploaded_images"
        ]
        read_only_fields = ["owner", "created_at", "updated_at"]

    def create(self, validated_data):
        request = self.context.get("request")  # Get request from context
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError({"error": "User must be authenticated"})

        validated_data["owner"] = request.user  # Assign the owner from the request
        uploaded_images = validated_data.pop("uploaded_images", [])  
        land = Land.objects.create(**validated_data)

        # Save multiple images
        for image in uploaded_images:
            LandImage.objects.create(land=land, image=image)

        return land

class RentRequestSerializer(serializers.ModelSerializer):
    renter_name = serializers.CharField(source="renter.username", read_only=True)
    owner_name = serializers.CharField(source="owner.username", read_only=True)
    land_name = serializers.CharField(source="land.name", read_only=True)

    class Meta:
        model = RentRequest
        fields = ["id", "renter", "renter_name", "owner", "owner_name", "land", "land_name", "status", "request_date"]
