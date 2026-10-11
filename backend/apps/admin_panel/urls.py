from django.urls import path
from .views import AdminStatsView, AdminSettingsView, AdminUserListView

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('settings/', AdminSettingsView.as_view(), name='admin_settings'),
    path('users/', AdminUserListView.as_view(), name='admin_users'),
]