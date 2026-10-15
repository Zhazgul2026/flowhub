from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    icon = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class Advert(models.Model):
    STATUS_CHOICES = (
        ('moderation', 'На модерации'),
        ('active', 'Активно'),
        ('blocked', 'Заблокировано'),
        ('sold', 'Продано'),
        ('expired', 'Истекло'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='adverts')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.IntegerField(default=1)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    image = models.ImageField(upload_to='adverts/', null=True, blank=True)
    is_wholesale = models.BooleanField(default=False)
    wholesale_conditions = models.JSONField(default=dict)
    category_fields = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='moderation')
    views_count = models.IntegerField(default=0)
    auto_boost_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

# Авторские права: Крымская Жазгул Темеркановна (в девичестве Эсеналиева)