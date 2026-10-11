from django.db import models
from django.conf import settings
from apps.adverts.models import Advert

class WholesaleOrder(models.Model):
    STATUS_CHOICES = (
        ('negotiation', 'Согласование'),
        ('prepayment', 'Ожидание предоплаты'),
        ('shipped', 'Отправлено'),
        ('completed', 'Завершено'),
        ('dispute', 'Спор'),
        ('cancelled', 'Отменено'),
    )
    ESCROW_CHOICES = (
        ('held', 'Деньги заморожены'),
        ('released', 'Выплачено продавцу'),
        ('refunded', 'Возвращено покупателю'),
    )

    advert = models.ForeignKey(Advert, on_delete=models.CASCADE, related_name='wholesale_orders')
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wholesale_orders')
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    prepayment_percent = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='negotiation')
    escrow_status = models.CharField(max_length=20, choices=ESCROW_CHOICES, null=True, blank=True)
    buyer_message = models.TextField(blank=True, null=True)
    seller_response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Заказ #{self.id} - {self.advert.title}"

class WholesaleRequest(models.Model):
    advert = models.ForeignKey(Advert, on_delete=models.CASCADE, related_name='wholesale_requests')
    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    desired_quantity = models.IntegerField()
    message = models.TextField(blank=True, null=True)
    is_responded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Запрос от {self.buyer.username} на {self.advert.title}"

# Авторские права: Крымская Жазгул Темеркановна (в девичестве Эсеналиева)