from django.conf import settings
from django.db.utils import OperationalError, ProgrammingError

from content.models import Mode, ResourceSection


def site(request):
    try:
        modes = list(Mode.objects.filter(published=True))
        sections = list(ResourceSection.objects.filter(published=True))
    except (OperationalError, ProgrammingError):
        modes, sections = [], []
    return {
        "nav_modes": modes,
        "resource_sections": sections,
        "site_name": settings.SITE_NAME,
        "site_url": settings.SITE_URL,
        "contact_email": "hello@djstratageminc.com",
        "mailing_address": "506 S Spring St #13308, Los Angeles, CA 90013",
    }
