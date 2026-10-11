from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPES = (
        ('registered', 'Зарегистрированный'),
        ('verified_private', 'Верифицированный частник'),
        ('entrepreneur', 'ИП/Самозанятый'),
        ('legal_entity', 'Юридическое лицо'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='registered')
    phone = models.CharField(max_length=20, blank=True, null=True)
    passport_data = models.JSONField(null=True, blank=True)
    business_docs = models.FileField(upload_to='business_docs/', null=True, blank=True)
    trust_score = models.IntegerField(default=0)
    is_blocked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

# Авторские права: Крымская Жазгул Темеркановна (в девичестве Эсеналиева)