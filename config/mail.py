from django.conf import settings


def delivers_mail():
    """True when the configured backend hands mail to a real mailbox.

    The console backend is useful in development and still "sends", but it
    must not be recorded as delivered. Tests use the locmem backend.
    """

    backend = settings.EMAIL_BACKEND or ""
    if backend.endswith("smtp.EmailBackend"):
        return bool((getattr(settings, "EMAIL_HOST", "") or "").strip())
    return backend.endswith("locmem.EmailBackend") or backend.endswith("filebased.EmailBackend")
