from django.contrib import admin
from .models import ModerationLog, BlacklistedUser

@admin.register(ModerationLog)
class ModerationLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'advert', 'moderator_type', 'action', 'created_at')

@admin.register(BlacklistedUser)
class BlacklistedUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'reason', 'created_at')