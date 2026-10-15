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

    MONTHLY_LIMITS = {
        'registered': 1,
        'verified_private': 2,
        'entrepreneur': 5,
        'legal_entity': 5,
    }

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'renew', 'my']:
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
        user = self.request.user
        limit = self.MONTHLY_LIMITS.get(user.user_type, 1)
        first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        count_this_month = Advert.objects.filter(
            user=user,
            created_at__gte=first_day_of_month,
        ).count()
        if count_this_month >= limit:
            raise PermissionDenied(
                f'Лимит бесплатных объявлений исчерпан ({limit} в месяц). '
                f'Купите пакет для публикации дополнительных объявлений.'
            )
        expires_at = timezone.now() + timedelta(days=30)
        serializer.save(user=user, expires_at=expires_at)

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

    @action(detail=False, methods=['get'])
    def my(self, request):
        """Мои объявления — все статусы."""
        if not request.user.is_authenticated:
            return Response({'error': 'Требуется авторизация'}, status=401)
        adverts = Advert.objects.filter(user=request.user).order_by('-created_at')
        serializer = self.get_serializer(adverts, many=True)
        return Response(serializer.data)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)