from rest_framework import serializers
from .models import Chat, Message
from apps.users.models import User


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.ReadOnlyField(source='sender.username')
    image_url = serializers.SerializerMethodField() # <-- ДОБАВИЛИ

    class Meta:
        model = Message
        fields = ('id', 'sender', 'sender_username', 'text', 'image', 'image_url', 'created_at')
        read_only_fields = ('sender', 'created_at')

    def get_image_url(self, obj): # <-- ДОБАВИЛИ
        if obj.image:
            return obj.image.url
        return None


class ChatSerializer(serializers.ModelSerializer):
    advert_title = serializers.ReadOnlyField(source='advert.title')
    buyer_username = serializers.ReadOnlyField(source='buyer.username')
    seller_username = serializers.ReadOnlyField(source='seller.username')
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = (
            'id', 'advert', 'advert_title',
            'buyer', 'buyer_username',
            'seller', 'seller_username',
            'last_message', 'unread_count',
            'created_at', 'updated_at',
        )
        read_only_fields = ('buyer', 'seller')

    def get_last_message(self, obj):
        msg = obj.messages.order_by('-created_at').first()
        if not msg:
            return None
        return {
            'text': msg.text,
            'sender_username': msg.sender.username,
            'created_at': msg.created_at,
        }

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        return obj.messages.filter(is_read=False).exclude(sender=request.user).count()