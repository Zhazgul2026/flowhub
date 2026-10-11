from django.urls import path
from .views import ServicePackageListView, SubscribeView, MySubscriptionsView

urlpatterns = [
    path('packages/', ServicePackageListView.as_view(), name='service_packages'),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('my/', MySubscriptionsView.as_view(), name='my_subscriptions'),
]