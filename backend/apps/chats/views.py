from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from apps.adverts.models import Advert


class ChatListCreateView(generics.ListCreateAPIView):
    """Список моих чатов + создание нового."""
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(Q(buyer=user) | Q(seller=user))

    def create(self, request, *args, **kwargs):
        advert_id = request.data.get('advert')
        advert = get_object_or_404(Advert, id=advert_id)

        if advert.user == request.user:
            return Response(
                {'error': 'Нельзя писать самому себе'},
                status=status.HTTP_400_BAD_REQUEST
            )

        chat, created = Chat.objects.get_or_create(
            advert=advert,
            buyer=request.user,
            seller=advert.user,
        )

        serializer = self.get_serializer(chat)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class ChatDetailView(generics.RetrieveAPIView):
    """Один чат с историей сообщений."""
    serializer_class = ChatSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Chat.objects.filter(Q(buyer=user) | Q(seller=user))

    def retrieve(self, request, *args, **kwargs):
        chat = self.get_object()
        chat.messages.filter(is_read=False).exclude(sender=request.user).update(is_read=True)

        serializer = self.get_serializer(chat)
        messages = chat.messages.all()
        return Response({
            'chat': serializer.data,
            'messages': MessageSerializer(messages, many=True).data,
        })


class SendMessageView(APIView):
    """Отправить сообщение в чат (с поддержкой фото)."""
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, chat_id):
        user = request.user
        chat = get_object_or_404(Chat, id=chat_id)

        if user not in [chat.buyer, chat.seller]:
            return Response({'error': 'Вы не участник этого чата'}, status=status.HTTP_403_FORBIDDEN)

        text = request.data.get('text', '').strip()
        image = request.FILES.get('image')

        if not text and not image:
            return Response({'error': 'Сообщение не может быть пустым'}, status=status.HTTP_400_BAD_REQUEST)

        message = Message.objects.create(
            chat=chat,
            sender=user,
            text=text,
            image=image
        )
        chat.save()

        return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)


class UnreadCountView(APIView):
    """Общее количество непрочитанных сообщений."""
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        count = Message.objects.filter(
            is_read=False,
            chat__in=Chat.objects.filter(Q(buyer=user) | Q(seller=user))
        ).exclude(sender=user).count()
        return Response({'unread': count})


# ВОТ ЗДЕСЬ ОН ДОЛЖЕН БЫТЬ (на одном уровне с остальными)
class DeleteMessageView(APIView):
    """Удалить свое сообщение."""
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, message_id):
        message = get_object_or_404(Message, id=message_id)
        
        if message.sender != request.user:
            return Response({'error': 'Вы можете удалять только свои сообщения'}, status=status.HTTP_403_FORBIDDEN)

        message.delete()
        return Response({'message': 'Сообщение удалено'}, status=status.HTTP_200_OK)