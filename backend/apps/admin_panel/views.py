from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Count
from apps.users.models import User
from apps.adverts.models import Advert
from apps.wholesale.models import WholesaleOrder
from apps.users.serializers import UserSerializer

class AdminStatsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        total_users = User.objects.count()
        total_adverts = Advert.objects.count()
        total_orders = WholesaleOrder.objects.count()
        active_adverts = Advert.objects.filter(status='active').count()
        blocked_users = User.objects.filter(is_blocked=True).count()

        stats = {
            'total_users': total_users,
            'total_adverts': total_adverts,
            'total_orders': total_orders,
            'active_adverts': active_adverts,
            'blocked_users': blocked_users,
            'users_by_type': list(User.objects.values('user_type').annotate(count=Count('id'))),
            'adverts_by_category': list(Advert.objects.values('category__name').annotate(count=Count('id'))),
            'orders_by_status': list(WholesaleOrder.objects.values('status').annotate(count=Count('id'))),
        }
        return Response(stats)

class AdminSettingsView(generics.GenericAPIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        settings_data = {
            'private_wholesale_limit': 100000,
            'private_orders_per_month': 3,
            'prepayment_required': False,
            'guest_can_see_wholesale': True,
        }
        return Response(settings_data)

    def post(self, request):
        return Response({'message': 'Настройки обновлены'})

class AdminUserListView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')

# Авторские права: Крымская Жазгул Темеркановна (в девичестве Эсеналиева)