from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from content.views import mode

admin.site.site_header = "D&J Stratagem"
admin.site.site_title = "D&J admin"
admin.site.index_title = "Editable site content"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("accounts.urls")),
    path("", include("inquiries.urls")),
    path("", include("content.urls")),
    path("", include("wholesale.urls")),
    path("", include("config.redirects")),
    path("<slug:slug>/", mode, name="mode"),
]

if settings.SERVE_MEDIA:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = "content.views.not_found"
