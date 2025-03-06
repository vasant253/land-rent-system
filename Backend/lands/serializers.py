from rest_framework import serializers
from .models import Land, LandImage

class LandImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandImage
        fields = ['id', 'image']

class LandSerializer(serializers.ModelSerializer):
    images = LandImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True
    )

    class Meta:
        model = Land
        fields = '__all__' 

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images')
        land = Land.objects.create(**validated_data)

        for image in uploaded_images:
            LandImage.objects.create(land=land, image=image)

        return land
