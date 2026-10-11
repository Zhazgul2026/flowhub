from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ServicePackage, UserSubscription
from .serializers import ServicePackageSerializer, UserSubscriptionSerializer

class ServicePackageListView(generics.ListAPIView):
    queryset = ServicePackage.objects.filter(is_active=True)
    serializer_class = ServicePackageSerializer
    permission_classes = (permissions.AllowAny,)

class SubscribeView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        package_id = request.data.get('package_id')
        if not package_id:
            return Response({'error': 'Выберите пакет'}, status=status.HTTP_400_BAD_REQUEST)
        package = get_object_or_404(ServicePackage, id=package_id)
        if UserSubscription.objects.filter(user=request.user, package=package, is_active=True).exists():
            return Response({'error': 'Этот пакет уже активен'}, status=status.HTTP_400_BAD_REQUEST)
        subscription = UserSubscription.objects.create(
            user=request.user,
            package=package
        )
        return Response(UserSubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)

class MySubscriptionsView(generics.ListAPIView):
    serializer_class = UserSubscriptionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return UserSubscription.objects.filter(user=self.request.user, is_active=True)