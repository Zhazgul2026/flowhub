from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models  # ← добавить, если нет
from django_filters.rest_framework import DjangoFilterBackend
from .models import Advert, Category
from .serializers import AdvertSerializer, CategorySerializer
from rest_framework.exceptions import PermissionDenied

class AdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.all()
    serializer_class = AdvertSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('category', 'is_wholesale')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return (permissions.IsAuthenticated(),)
        return (permissions.AllowAny(),)

    def get_queryset(self):
        user = self.request.user
        # Авторизованный пользователь видит свои объявления (все статусы) + все активные
        if user.is_authenticated:
            return Advert.objects.filter(
                models.Q(status='active') | models.Q(user=user)
            ).distinct()
        return Advert.objects.filter(status='active')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # При редактировании — снова на модерацию
        serializer.save(status='moderation')

    def perform_destroy(self, instance):
        # Удалять может только владелец
        if instance.user != self.request.user:
            raise PermissionDenied('Вы не владелец этого объявления')
        instance.delete()

    @action(detail=True, methods=['post'])
    def boost(self, request, pk=None):
        advert = self.get_object()
        if advert.user != request.user:
            return Response({'error': 'Не ваше объявление'}, status=403)
        from django.utils import timezone
        advert.auto_boost_at = timezone.now()
        advert.save()
        return Response({'message': 'Объявление поднято!'})

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)