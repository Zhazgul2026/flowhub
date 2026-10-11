from django.db import models
from django.conf import settings
from apps.adverts.models import Advert

class ModerationLog(models.Model):
    MODERATOR_TYPES = (
        ('auto_ai', 'Автоматическая (ИИ)'),
        ('manual', 'Ручная проверка'),
    )
    ACTION_CHOICES = (
        ('approved', 'Одобрено'),
        ('rejected', 'Отклонено'),
        ('flagged', 'Отмечено как подозрительное'),
    )
    advert = models.ForeignKey(Advert, on_delete=models.CASCADE, related_name='moderation_logs')
    moderator_type = models.CharField(max_length=20, choices=MODERATOR_TYPES)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.advert.title} - {self.action}"

class BlacklistedUser(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reason = models.TextField()
    blocked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='blocked_users')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - заблокирован"

# Авторские права: Крымская Жазгул Темеркановна (в девичестве Эсеналиева)