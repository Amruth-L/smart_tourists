from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.contrib.staticfiles.views import serve
from django.views.static import serve as static_serve
from api.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve static files in development (must be before catch-all route)
if settings.DEBUG:
    # Serve static files from STATICFILES_DIRS
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve),
    ]
    # Serve media files
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Serve React app for all other routes (must be last)
urlpatterns += [
    re_path(r'^(?!api|admin|static|media).*$', index, name='index'),
]