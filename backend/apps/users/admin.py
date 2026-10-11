from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'user_type', 'trust_score', 'is_blocked')
    list_filter = ('user_type', 'is_blocked')
    search_fields = ('username', 'email')