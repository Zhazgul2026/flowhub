from django.db import models
from django.conf import settings

class ServicePackage(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    features = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.name} - {self.price} ₽"

class UserSubscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    package = models.ForeignKey(ServicePackage, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    purchased_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.package.name}"

# Авторские права: Крымская Жазгул Темеркановна (в девичестве Эсеналиева)