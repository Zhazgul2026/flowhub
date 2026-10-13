from django.utils import timezone
from .models import Advert


def expire_old_adverts():
    now = timezone.now()
    expired_count = Advert.objects.filter(
        status='active',
        expires_at__lt=now,
    ).update(status='expired')
    print(f'Истекло объявлений: {expired_count}')
    return expired_count