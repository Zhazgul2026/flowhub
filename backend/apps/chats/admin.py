from django.contrib import admin
from .models import Chat, Message

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'advert', 'buyer', 'seller', 'created_at', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('buyer__username', 'seller__username', 'advert__title')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'chat', 'sender', 'text_short', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('text',)

    def text_short(self, obj):
        return obj.text[:50] + ('...' if len(obj.text) > 50 else '')
    text_short.short_description = 'Текст'