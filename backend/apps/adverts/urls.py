from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdvertViewSet, CategoryListView

router = DefaultRouter()
router.register(r'', AdvertViewSet, basename='advert')

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('', include(router.urls)),
]