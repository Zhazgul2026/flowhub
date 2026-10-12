from rest_framework import permissions

class IsWholesaleAllowed(permissions.BasePermission):
    """
    Разрешает работу с оптом только верифицированным пользователям.
    Частники — до 100 000 ₽.
    Бизнес — без ограничений.
    """
    message = 'Требуется верификация для работы с оптом. Пройдите верификацию в профиле.'

    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False
        return user.user_type in ['verified_private', 'entrepreneur', 'legal_entity']