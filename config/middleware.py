class AdminLoginRateLimitMiddleware:
    """Slow password guessing on the Django admin sign-in form.

    The public sign-in view applies the same counters and renders its own form.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method != "POST" or request.path_info != "/admin/login/":
            return self.get_response(request)
        from django.conf import settings
        from django.http import HttpResponse

        from accounts.throttle import LOGIN_LIMIT_MESSAGE, login_blocked, record_login_failure

        if login_blocked(request):
            response = HttpResponse(LOGIN_LIMIT_MESSAGE, status=429, content_type="text/plain; charset=utf-8")
            response["Retry-After"] = str(settings.LOGIN_RATE_WINDOW)
            return response
        response = self.get_response(request)
        if response.status_code == 200:
            record_login_failure(request)
        return response


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
