from django.urls import path
from .views import CheckTextView, ModerationQueueView, ModerationActionView, BlacklistView

urlpatterns = [
    path('check-text/', CheckTextView.as_view(), name='check_text'),
    path('queue/', ModerationQueueView.as_view(), name='moderation_queue'),
    path('action/<int:pk>/', ModerationActionView.as_view(), name='moderation_action'),
    path('blacklist/', BlacklistView.as_view(), name='blacklist'),
]