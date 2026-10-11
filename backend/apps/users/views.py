from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class VerifyPassportView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        passport = request.data.get('passport_data')
        if not passport:
            return Response({'error': 'Паспортные данные обязательны'}, status=status.HTTP_400_BAD_REQUEST)
        user.passport_data = passport
        user.user_type = 'verified_private'
        user.save()
        return Response({'message': 'Верификация пройдена!', 'user_type': user.user_type})

class VerifyBusinessView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        user = request.user
        docs = request.FILES.get('business_docs')
        if not docs:
            return Response({'error': 'Загрузите документы'}, status=status.HTTP_400_BAD_REQUEST)
        user.business_docs = docs
        user.user_type = 'entrepreneur'
        user.save()
        return Response({'message': 'Бизнес-аккаунт подтверждён!', 'user_type': user.user_type})