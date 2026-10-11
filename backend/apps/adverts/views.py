from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Advert, Category
from .serializers import AdvertSerializer, CategorySerializer

class AdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.filter(status='active')
    serializer_class = AdvertSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('category', 'is_wholesale')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return (permissions.IsAuthenticated(),)
        return (permissions.AllowAny(),)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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