from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/adverts/', include('apps.adverts.urls')),
    path('api/wholesale/', include('apps.wholesale.urls')),
    path('api/moderation/', include('apps.moderation.urls')),
    path('api/services/', include('apps.services.urls')),
    path('api/admin/', include('apps.admin_panel.urls')),
    path('api/chats/', include('apps.chats.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)