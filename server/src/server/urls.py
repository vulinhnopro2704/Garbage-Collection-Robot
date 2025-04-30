# iot_server/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('src.apps.detector.urls')),  # Endpoint gốc "/" sẽ trả về hello world
]

# Thêm cấu hình để phục vụ media files trong môi trường development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
