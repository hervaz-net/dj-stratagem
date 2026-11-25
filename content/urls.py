from django.urls import path
from django.views.generic import RedirectView

from content import views

urlpatterns = [
    path("", views.home, name="home"),
    path("pricing/", views.pricing, name="pricing"),
    path("about/", views.about, name="about"),
    path("resources/", views.resources, name="resources"),
    path("resources/blog/<slug:slug>/", views.article, name="article"),
    path("resources/<slug:section>/", views.resource_section, name="resource_section"),
    path("privacy/", views.privacy, name="privacy"),
    path("terms/", views.terms, name="terms"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("health/", views.health, name="health"),
    path("health.php", views.health),
    path("api/health/", views.health),
    path("api/health.php", views.health),
    path("robots.txt", views.robots, name="robots"),
    path("sitemap.xml", views.sitemap, name="sitemap"),
    path("sitemap/", RedirectView.as_view(url="/sitemap.xml", permanent=True)),
    path("manifest.webmanifest", views.manifest, name="manifest"),
    path("manifest.json", views.manifest),
    path("fleet-cards.html", views.legacy_file, {"name": "fleet-cards.html"}),
    path("signage.html", views.legacy_file, {"name": "signage.html"}),
    path("receipts.html", views.legacy_file, {"name": "receipts.html"}),
    path("support.js", views.legacy_file, {"name": "support.js"}),
    path("doc-page.js", views.legacy_file, {"name": "doc-page.js"}),
    path("fleet-cards/", RedirectView.as_view(url="/fleet-cards.html", permanent=True)),
    path("signage/", RedirectView.as_view(url="/signage.html", permanent=True)),
    path("receipts/", RedirectView.as_view(url="/receipts.html", permanent=True)),
    path("marketing/fleet-cards/", RedirectView.as_view(url="/fleet-cards.html", permanent=True)),
    path("marketing/signage/", RedirectView.as_view(url="/signage.html", permanent=True)),
    path("marketing/receipts/", RedirectView.as_view(url="/receipts.html", permanent=True)),
]
