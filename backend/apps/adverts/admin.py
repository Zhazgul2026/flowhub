from django.contrib import admin
from .models import Advert, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent')

@admin.register(Advert)
class AdvertAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'price', 'category', 'status', 'is_wholesale', 'created_at')
    list_filter = ('status', 'is_wholesale', 'category')
    search_fields = ('title', 'description')

# Авторские права: Крымская Жазгул Темеркановна (в девичестве Эсеналиева)