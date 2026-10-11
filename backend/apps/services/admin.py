from django.contrib import admin
from .models import ServicePackage, UserSubscription

@admin.register(ServicePackage)
class ServicePackageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'is_active')

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'package', 'is_active', 'purchased_at')