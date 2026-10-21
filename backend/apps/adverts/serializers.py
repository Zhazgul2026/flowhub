from rest_framework import serializers
from .models import Advert, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'parent', 'icon')

class AdvertSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    category_name = serializers.ReadOnlyField(source='category.name')
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Advert
        fields = ('id', 'user', 'user_username', 'title', 'description', 'price', 'quantity',
                  'category', 'category_name', 'city', 'image', 'image_url', 'is_wholesale',
                  'wholesale_conditions', 'category_fields', 'status', 'views_count', 'created_at',
                  'expires_at')
        read_only_fields = ('user', 'status', 'views_count')

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)