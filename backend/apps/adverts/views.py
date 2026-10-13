from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend
from .models import Advert, Category
from .serializers import AdvertSerializer, CategorySerializer


class AdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.all()
    serializer_class = AdvertSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('category', 'is_wholesale')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'renew']:
            return (permissions.IsAuthenticated(),)
        return (permissions.AllowAny(),)

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Advert.objects.filter(
                models.Q(status='active') | models.Q(user=user)
            ).distinct()
        return Advert.objects.filter(status='active')

    def perform_create(self, serializer):
        expires_at = timezone.now() + timedelta(days=30)
        serializer.save(user=self.request.user, expires_at=expires_at)

    def perform_update(self, serializer):
        serializer.save(status='moderation')

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied('Вы не владелец этого объявления')
        instance.delete()

    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        advert = self.get_object()
        if advert.user != request.user:
            return Response({'error': 'Не ваше объявление'}, status=403)
        advert.expires_at = timezone.now() + timedelta(days=30)
        advert.status = 'moderation'
        advert.save()
        return Response({'message': 'Объявление продлено на 30 дней'})


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)