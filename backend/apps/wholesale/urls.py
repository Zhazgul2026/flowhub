from django.urls import path
from .views import (
    WholesaleOrderListCreateView, WholesaleOrderDetailView,
    WholesaleRequestCreateView, WholesaleRequestListView,
    EscrowDepositView, EscrowConfirmView, EscrowDisputeView
)

urlpatterns = [
    path('orders/', WholesaleOrderListCreateView.as_view(), name='wholesale_orders'),
    path('orders/<int:pk>/', WholesaleOrderDetailView.as_view(), name='wholesale_order_detail'),
    path('requests/', WholesaleRequestCreateView.as_view(), name='wholesale_request_create'),
    path('requests/list/', WholesaleRequestListView.as_view(), name='wholesale_requests_list'),
    path('escrow/deposit/<int:order_id>/', EscrowDepositView.as_view(), name='escrow_deposit'),
    path('escrow/confirm/<int:order_id>/', EscrowConfirmView.as_view(), name='escrow_confirm'),
    path('escrow/dispute/<int:order_id>/', EscrowDisputeView.as_view(), name='escrow_dispute'),
]