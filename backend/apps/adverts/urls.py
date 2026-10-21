from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdvertViewSet, CategoryListView, FavoriteViewSet

router = DefaultRouter()
router.register(r'favorites', FavoriteViewSet, basename='favorites')
router.register(r'', AdvertViewSet, basename='adverts')

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('', include(router.urls)),
]