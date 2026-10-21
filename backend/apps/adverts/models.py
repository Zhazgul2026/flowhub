from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    icon = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name


class Advert(models.Model):
    STATUS_CHOICES = (
        ('active', 'Активно'),
        ('moderation', 'На модерации'),
        ('rejected', 'Отклонено'),
        ('sold', 'Продано'),
        ('expired', 'Истекло'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='adverts')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='adverts')
    
    city = models.CharField(max_length=100, default='Москва', db_index=True)
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    
    image = models.ImageField(upload_to='adverts/', null=True, blank=True)
    
    is_wholesale = models.BooleanField(default=False)
    wholesale_conditions = models.JSONField(default=dict)
    category_fields = models.JSONField(default=dict, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='moderation')
    views_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Объявление'
        verbose_name_plural = 'Объявления'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Favorite(models.Model):
    # Вот тут очень важно, чтобы у полей был отступ (4 пробела)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    advert = models.ForeignKey(Advert, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'advert') 
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранные'

    def __str__(self):
        return f'{self.user.username} - {self.advert.title}'