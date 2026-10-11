from rest_framework import permissions

class IsWholesaleAllowed(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False
        return user.user_type in ['verified_private', 'entrepreneur', 'legal_entity']