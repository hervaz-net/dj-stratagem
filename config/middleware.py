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
        return response
