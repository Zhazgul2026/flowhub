from django.urls import path
from .views import (
    ChatListCreateView, ChatDetailView, SendMessageView, 
    UnreadCountView, DeleteMessageView
)

urlpatterns = [
    path('unread/', UnreadCountView.as_view(), name='unread-count'),
    path('messages/<int:message_id>/delete/', DeleteMessageView.as_view(), name='delete-message'),
    path('', ChatListCreateView.as_view(), name='chat-list'),
    path('<int:pk>/', ChatDetailView.as_view(), name='chat-detail'),
    path('<int:chat_id>/send/', SendMessageView.as_view(), name='send-message'),
]