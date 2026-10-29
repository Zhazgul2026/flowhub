from django.db import models
from django.conf import settings
from apps.adverts.models import Advert
import os
import uuid

def rename_file(instance, filename):
    # Берем расширение (например, .jpg)
    ext = filename.split('.')[-1]
    # Генерируем случайное имя (uuid) и добавляем расширение
    new_filename = f"{uuid.uuid4().hex}.{ext}"
    # Сохраняем в папку chat_images
    return os.path.join('chat_images', new_filename)

class Chat(models.Model):
    """Диалог между покупателем и продавцом по конкретному объявлению."""
    advert = models.ForeignKey(Advert, on_delete=models.CASCADE, related_name='chats')
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chats_as_buyer'
    )
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chats_as_seller'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('advert', 'buyer', 'seller')
        ordering = ['-updated_at']

    def __str__(self):
        return f"Чат #{self.id}: {self.buyer.username} → {self.seller.username}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(blank=True) # Разрешаем пустой текст, если есть фото
    image = models.ImageField(upload_to=rename_file, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.username}: {self.text[:50]}"

# Авторские права: Крымская Жазгул Темеркановна (в девичестве Эсеналиева)