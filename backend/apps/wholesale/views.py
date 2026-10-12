from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db import models
from django.shortcuts import get_object_or_404
from .models import WholesaleOrder, WholesaleRequest
from .serializers import WholesaleOrderSerializer, WholesaleRequestSerializer
from .permissions import IsWholesaleAllowed
from apps.adverts.models import Advert

class WholesaleOrderListCreateView(generics.ListCreateAPIView):
    serializer_class = WholesaleOrderSerializer
    permission_classes = (permissions.IsAuthenticated, IsWholesaleAllowed)

    def get_queryset(self):
        user = self.request.user
        return WholesaleOrder.objects.filter(
            models.Q(buyer=user) | models.Q(advert__user=user)
        ).distinct()

    def create(self, request, *args, **kwargs):
        # Проверка лимита для частников
        user = request.user
        if user.user_type == 'verified_private':
            total_price = request.data.get('total_price', 0)
            try:
                total_price = float(total_price)
            except (ValueError, TypeError):
                total_price = 0
            if total_price > 100000:
                return Response(
                    {'error': 'Для частников лимит оптовой сделки — 100 000 ₽. Пройдите верификацию как ИП или юрлицо.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        return super().create(request, *args, **kwargs)

class WholesaleOrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = WholesaleOrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return WholesaleOrder.objects.filter(
            models.Q(buyer=user) | models.Q(advert__user=user)
        )

class WholesaleRequestCreateView(generics.CreateAPIView):
    serializer_class = WholesaleRequestSerializer
    permission_classes = (permissions.IsAuthenticated, IsWholesaleAllowed)

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

class WholesaleRequestListView(generics.ListAPIView):
    serializer_class = WholesaleRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return WholesaleRequest.objects.filter(
            models.Q(buyer=user) | models.Q(advert__user=user)
        )

class EscrowDepositView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, order_id):
        order = get_object_or_404(WholesaleOrder, id=order_id, buyer=request.user)
        if order.status != 'negotiation':
            return Response({'error': 'Заказ не на стадии согласования'}, status=status.HTTP_400_BAD_REQUEST)
        order.escrow_status = 'held'
        order.status = 'prepayment'
        order.save()
        return Response({'message': 'Средства заморожены на эскроу-счёте', 'escrow_status': order.escrow_status})

class EscrowConfirmView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, order_id):
        order = get_object_or_404(WholesaleOrder, id=order_id, advert__user=request.user)
        if order.status != 'prepayment':
            return Response({'error': 'Нет замороженных средств'}, status=status.HTTP_400_BAD_REQUEST)
        order.escrow_status = 'released'
        order.status = 'completed'
        order.save()
        return Response({'message': 'Средства перечислены продавцу', 'escrow_status': order.escrow_status})

class EscrowDisputeView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, order_id):
        order = get_object_or_404(WholesaleOrder, id=order_id)
        if request.user not in [order.buyer, order.advert.user]:
            return Response({'error': 'Вы не участник сделки'}, status=status.HTTP_403_FORBIDDEN)
        order.status = 'dispute'
        order.save()
        return Response({'message': 'Открыт спор. Администратор свяжется с вами'})