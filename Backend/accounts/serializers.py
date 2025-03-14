from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'phone', 'password', 'profile_photo']
        extra_kwargs = {'password': {'write_only': True},'username': {'read_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # ✅ Ensure password is hashed if being updated
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])

        # ✅ Update fields dynamically (partial update)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        instance.save()
        return instance