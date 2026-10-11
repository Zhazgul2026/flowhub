from django.urls import path
from .views import (
    ChatListCreateView, ChatDetailView, SendMessageView, UnreadCountView,
)

urlpatterns = [
    path('', ChatListCreateView.as_view(), name='chat_list_create'),
    path('<int:pk>/', ChatDetailView.as_view(), name='chat_detail'),
    path('<int:chat_id>/send/', SendMessageView.as_view(), name='send_message'),
    path('unread/', UnreadCountView.as_view(), name='unread_count'),
]