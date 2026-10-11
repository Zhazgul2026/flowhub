from rest_framework import serializers
from .models import ServicePackage, UserSubscription

class ServicePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicePackage
        fields = ('id', 'name', 'description', 'price', 'features')

class UserSubscriptionSerializer(serializers.ModelSerializer):
    package_name = serializers.ReadOnlyField(source='package.name')

    class Meta:
        model = UserSubscription
        fields = ('id', 'package', 'package_name', 'is_active', 'purchased_at', 'expires_at')