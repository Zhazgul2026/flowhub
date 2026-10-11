from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .filters import moderate_text
from .models import ModerationLog, BlacklistedUser
from .serializers import ModerationLogSerializer, BlacklistedUserSerializer
from apps.adverts.models import Advert

class CheckTextView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'Текст не предоставлен'}, status=status.HTTP_400_BAD_REQUEST)
        errors = moderate_text(text)
        if errors:
            return Response({'is_clean': False, 'errors': errors})
        return Response({'is_clean': True, 'message': 'Текст прошёл проверку'})

class ModerationQueueView(generics.ListAPIView):
    serializer_class = ModerationLogSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get_queryset(self):
        return ModerationLog.objects.filter(action='flagged')

class ModerationActionView(generics.GenericAPIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, pk):
        advert = get_object_or_404(Advert, id=pk)
        action = request.data.get('action')
        reason = request.data.get('reason', '')
        if action not in ['approved', 'rejected']:
            return Response({'error': 'Неверное действие'}, status=status.HTTP_400_BAD_REQUEST)
        advert.status = 'active' if action == 'approved' else 'blocked'
        advert.save()
        ModerationLog.objects.create(
            advert=advert,
            moderator_type='manual',
            action=action,
            reason=reason
        )
        return Response({'message': f'Объявление {action}', 'status': advert.status})

class BlacklistView(generics.ListCreateAPIView):
    queryset = BlacklistedUser.objects.all()
    serializer_class = BlacklistedUserSerializer
    permission_classes = (permissions.IsAdminUser,)