from django.conf import settings

from config.storage import allow_media_cdn


class StripPreviewPrefixMiddleware:
    """Passenger mounts the first check at /djs-preview/ before the domain root."""

    prefix = "/djs-preview"

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path_info or "/"
        if path == self.prefix or path.startswith(self.prefix + "/"):
            trimmed = path[len(self.prefix):] or "/"
            request.path_info = trimmed
            request.path = trimmed
            request.META["SCRIPT_NAME"] = self.prefix
        return self.get_response(request)


class SecurityHeadersMiddleware:
    """Headers the previous host set in .htaccess, applied on every response."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        response.setdefault("X-Content-Type-Options", "nosniff")
        response.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        _allow_media_cdn(response)
        return response


def _allow_media_cdn(response):
    """If a CSP header is already set, let the media hostname load video and posters.

    This app does not send Content-Security-Policy on its own. When some other
    layer has set one, media-src and img-src need the R2 custom domain or the
    browser will block preview videos and poster images.
    """
    policy = response.get("Content-Security-Policy")
    if not policy:
        return
    origin = getattr(settings, "MEDIA_CDN_ORIGIN", "")
    updated = allow_media_cdn(policy, origin)
    if updated != policy:
        response["Content-Security-Policy"] = updated
