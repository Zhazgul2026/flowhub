"""
Автоматическое создание суперпользователя при деплое.
Запускается один раз — если пользователя ещё нет, создаёт.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'flowhub.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'jenny.esenalieva@icloud.com')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD', '')

if not password:
    print('SUPERUSER_PASSWORD не задан. Пропускаем создание.')
    exit(0)

if User.objects.filter(username=username).exists():
    print(f'Суперпользователь {username} уже существует.')
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'Суперпользователь {username} создан!')