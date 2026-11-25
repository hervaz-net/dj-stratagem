"""Client address helpers. Only trust forwarded headers behind our own proxy."""

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import validate_ipv46_address


def valid_ip(value):
    if not value:
        return None
    candidate = str(value).strip()
    if candidate.startswith("[") and "]" in candidate:
        candidate = candidate[1 : candidate.index("]")]
    try:
        validate_ipv46_address(candidate)
    except ValidationError:
        return None
    return candidate


def client_ip(request):
    """Return the caller address, or None when it is missing or not an IP.

    A client can put anything in X-Forwarded-For. When a reverse proxy is in
    front of the app, the address that proxy appended is the rightmost one
    (or DJANGO_TRUSTED_PROXY_COUNT hops from the right when several proxies
    append). The left side of the header is not used for rate limits.
    """

    remote = valid_ip(request.META.get("REMOTE_ADDR"))
    if not getattr(settings, "DJANGO_BEHIND_PROXY", False):
        return remote
    hops = int(getattr(settings, "DJANGO_TRUSTED_PROXY_COUNT", 1) or 0)
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    parts = [part.strip() for part in forwarded.split(",") if part.strip()]
    if hops <= 0 or not parts:
        return remote
    index = max(len(parts) - hops, 0)
    return valid_ip(parts[index]) or remote
