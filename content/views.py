from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_GET

from content.models import (
    Article,
    Faq,
    GalleryImage,
    Guide,
    Mode,
    PipelineStep,
    Plan,
    Principle,
    ResourceSection,
    UpdateEntry,
)

STATIC_PAGES = [
    ("home", "/"),
    ("pricing", "/pricing/"),
    ("about", "/about/"),
    ("contact", "/contact/"),
    ("resources", "/resources/"),
    ("privacy", "/privacy/"),
    ("terms", "/terms/"),
]


def home(request):
    photos = list(GalleryImage.objects.filter(published=True, kind=GalleryImage.Kind.JOBSITE))
    hero = next((photo for photo in photos if photo.featured), photos[0] if photos else None)
    rest = [photo for photo in photos if hero is None or photo.pk != hero.pk]
    return render(
        request,
        "pages/home.html",
        {
            "page_title": "Find the work. Price it. Build it.",
            "page_description": "D&J Stratagem connects nine parts of the construction job lifecycle in one account—for contractors, subcontractors, and suppliers across Southern California.",
            "canonical_path": "/",
            "modes": Mode.objects.filter(published=True),
            "steps": PipelineStep.objects.all(),
            "hero": hero,
            "photos": rest[:3],
        },
    )


def mode(request, slug):
    current = get_object_or_404(Mode.objects.prefetch_related("capabilities"), slug=slug, published=True)
    modes = list(Mode.objects.filter(published=True))
    index = next(i for i, item in enumerate(modes) if item.pk == current.pk)
    kind = GalleryImage.Kind.VEHICLE if slug == "fleet" else GalleryImage.Kind.JOBSITE if slug == "studio" else None
    photos = GalleryImage.objects.filter(published=True, kind=kind) if kind else GalleryImage.objects.none()
    return render(
        request,
        "pages/mode.html",
        {
            "mode": current,
            "mode_number": f"{index + 1:02d}",
            "stage_modes": [item for item in modes if item.stage == current.stage],
            "next_mode": modes[(index + 1) % len(modes)],
            "photos": photos,
            "page_title": current.name,
            "page_description": current.description,
            "canonical_path": current.get_absolute_url(),
        },
    )


def pricing(request):
    return render(
        request,
        "pages/pricing.html",
        {
            "plans": Plan.objects.filter(published=True).prefetch_related("features"),
            "faqs": Faq.objects.filter(published=True),
            "page_title": "Pricing",
            "page_description": "Start free with D&J Stratagem. Explore Professional, Growth, and Enterprise access with a clear, person-to-person plan review.",
            "canonical_path": "/pricing/",
        },
    )


def about(request):
    return render(
        request,
        "pages/about.html",
        {
            "principles": Principle.objects.all(),
            "photo": GalleryImage.objects.filter(published=True, kind=GalleryImage.Kind.JOBSITE).first(),
            "page_title": "About D&J",
            "page_description": "D&J Stratagem is a Los Angeles-based construction platform built to connect the work, people, and tools that move a job forward.",
            "canonical_path": "/about/",
        },
    )


def resources(request):
    return render(
        request,
        "pages/resources.html",
        {
            "sections": ResourceSection.objects.filter(published=True),
            "page_title": "Resources",
            "page_description": "Field notes, product updates, and practical guides for construction businesses.",
            "canonical_path": "/resources/",
        },
    )


def resource_section(request, section):
    item = get_object_or_404(ResourceSection, slug=section, published=True)
    return render(
        request,
        "pages/resource_section.html",
        {
            "section": item,
            "sections": ResourceSection.objects.filter(published=True),
            "articles": Article.objects.filter(section=item, published=True),
            "updates": UpdateEntry.objects.filter(published=True) if section == "changelog" else [],
            "guides": Guide.objects.filter(published=True) if section == "guides" else [],
            "page_title": item.title,
            "page_description": item.description,
            "canonical_path": item.get_absolute_url(),
        },
    )


def article(request, slug):
    item = get_object_or_404(Article.objects.select_related("related_mode", "section"), slug=slug, published=True)
    return render(
        request,
        "pages/article.html",
        {
            "article": item,
            "page_title": item.title,
            "page_description": item.intro,
            "canonical_path": item.get_absolute_url(),
        },
    )


def privacy(request):
    return render(
        request,
        "pages/privacy.html",
        {
            "page_title": "Privacy policy",
            "page_description": "How D&J Stratagem, Inc. collects, uses, and shares information across its website and services.",
            "canonical_path": "/privacy/",
        },
    )


def terms(request):
    return render(
        request,
        "pages/terms.html",
        {
            "page_title": "Terms and conditions",
            "page_description": "Terms for the websites, applications, and services of D&J Stratagem, Inc.",
            "canonical_path": "/terms/",
        },
    )


def dashboard(request):
    return render(
        request,
        "pages/dashboard.html",
        {
            "page_title": "Your desk",
            "page_description": "The signed-in workspace for D&J Stratagem.",
            "robots": "noindex, nofollow",
            "canonical_path": "/dashboard/",
        },
    )


def not_found(request, exception):
    return render(
        request,
        "pages/404.html",
        {
            "page_title": "Page not found",
            "page_description": "That page is not on djstratageminc.com.",
            "robots": "noindex, nofollow",
        },
        status=404,
    )


@require_GET
def health(request):
    return JsonResponse({"ok": True, "service": "django"})


@require_GET
def robots(request):
    return render(request, "robots.txt", content_type="text/plain")


@require_GET
def sitemap(request):
    paths = [path for _name, path in STATIC_PAGES]
    paths += [mode.get_absolute_url() for mode in Mode.objects.filter(published=True)]
    paths += [section.get_absolute_url() for section in ResourceSection.objects.filter(published=True)]
    paths += [item.get_absolute_url() for item in Article.objects.filter(published=True)]
    return render(
        request,
        "sitemap.xml",
        {"paths": paths, "site_url": settings.SITE_URL},
        content_type="application/xml",
    )


@require_GET
def manifest(request):
    return JsonResponse(
        {
            "name": "D&J Stratagem, Inc.",
            "short_name": "D&J Stratagem",
            "description": "One account for the construction job lifecycle.",
            "start_url": "/",
            "scope": "/",
            "display": "standalone",
            "background_color": "#f4f5f1",
            "theme_color": "#17181b",
            "icons": [{"src": "/static/favicon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any"}],
        }
    )


LEGACY_FILES = {
    "fleet-cards.html": "fleet-cards.html",
    "signage.html": "signage.html",
    "receipts.html": "receipts.html",
    "support.js": "support.js",
    "doc-page.js": "doc-page.js",
}


def legacy_file(request, name):
    relative = LEGACY_FILES.get(name)
    if not relative:
        raise Http404()
    path = Path(settings.LEGACY_PUBLIC) / relative
    if not path.is_file():
        raise Http404()
    content_type = "text/javascript" if name.endswith(".js") else "text/html"
    return FileResponse(path.open("rb"), content_type=content_type)


def company_redirect(request, slug):
    if slug in {"capital", "studio", "workforce", "fleet"}:
        return redirect(f"/{slug}/", permanent=True)
    return redirect("/", permanent=True)
