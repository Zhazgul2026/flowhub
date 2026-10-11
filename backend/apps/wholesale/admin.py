from django.contrib import admin
from .models import WholesaleOrder, WholesaleRequest

@admin.register(WholesaleOrder)
class WholesaleOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'advert', 'buyer', 'quantity', 'total_price', 'status', 'escrow_status')

@admin.register(WholesaleRequest)
class WholesaleRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'advert', 'buyer', 'desired_quantity', 'is_responded')