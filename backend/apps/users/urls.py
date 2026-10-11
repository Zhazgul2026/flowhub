from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserDetailView, VerifyPassportView, VerifyBusinessView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('verify-passport/', VerifyPassportView.as_view(), name='verify_passport'),
    path('verify-business/', VerifyBusinessView.as_view(), name='verify_business'),
]