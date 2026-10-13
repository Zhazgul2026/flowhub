from django.core.management.base import BaseCommand
from apps.adverts.tasks import expire_old_adverts


class Command(BaseCommand):
    help = 'Помечает истёкшие объявления как expired'

    def handle(self, *args, **options):
        count = expire_old_adverts()
        self.stdout.write(self.style.SUCCESS(f'Готово. Истекло: {count}'))