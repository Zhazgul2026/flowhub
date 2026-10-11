from rest_framework import serializers
from .models import ModerationLog, BlacklistedUser

class ModerationLogSerializer(serializers.ModelSerializer):
    advert_title = serializers.ReadOnlyField(source='advert.title')

    class Meta:
        model = ModerationLog
        fields = ('id', 'advert', 'advert_title', 'moderator_type', 'action', 'reason', 'created_at')

class BlacklistedUserSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = BlacklistedUser
        fields = ('id', 'user', 'username', 'reason', 'created_at')