"""Production settings. Secrets and hosts come from the environment."""

import json
import logging
import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured

from config.storage import build_storages

from .base import *  # noqa: F403
from .base import BASE_DIR, MEDIA_URL, SECRET_KEY, env_bool, env_list

DEBUG = False

_secret = SECRET_KEY or ""
_collectstatic_build = os.getenv("DJANGO_COLLECTSTATIC_BUILD") == "1"
if _collectstatic_build:
    if len(_secret) < 32:
        raise ImproperlyConfigured("Collectstatic needs DJANGO_SECRET_KEY set.")
elif (
    len(_secret) < 50
    or len(set(_secret)) < 5
    or _secret.startswith(("dev-only", "django-insecure-", "build-only"))
):
    raise ImproperlyConfigured(
        "Set DJANGO_SECRET_KEY to a long random value before running production."
    )

hosts = env_list("DJANGO_ALLOWED_HOSTS", "")
if not hosts or any(host == "*" for host in hosts):
    raise ImproperlyConfigured(
        "Set DJANGO_ALLOWED_HOSTS to a comma-separated host list. Do not use '*'."
    )
ALLOWED_HOSTS = hosts

origins = env_list("CSRF_TRUSTED_ORIGINS", "")
if not origins:
    raise ImproperlyConfigured(
        "Set CSRF_TRUSTED_ORIGINS to the https origins that submit forms."
    )
CSRF_TRUSTED_ORIGINS = origins

database_url = os.getenv("DATABASE_URL", "").strip()
if database_url:
    DATABASES = {
        "default": dj_database_url.parse(
            database_url,
            conn_max_age=int(os.getenv("DATABASE_CONN_MAX_AGE", "60")),
            conn_health_checks=True,
            ssl_require=env_bool("DATABASE_SSL_REQUIRE", False),
        )
    }
else:
    data_dir = Path(os.environ.get("DJANGO_DATA_DIR", BASE_DIR / "data"))
    sqlite_path = Path(os.environ.get("DJANGO_SQLITE_PATH", data_dir / "db.sqlite3"))
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": sqlite_path,
            "OPTIONS": {
                "timeout": int(os.getenv("SQLITE_TIMEOUT", "20")),
                "transaction_mode": "IMMEDIATE",
                "init_command": "PRAGMA journal_mode=WAL;",
            },
        }
    }

media_root = os.getenv("DJANGO_MEDIA_ROOT", "").strip()
if media_root:
    MEDIA_ROOT = Path(media_root)

# Fly's proxy (and any other TLS terminator) sends X-Forwarded-Proto.
if env_bool("DJANGO_BEHIND_PROXY", True):
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    USE_X_FORWARDED_HOST = True

if env_bool("DJANGO_SECURE_SSL", True):
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    # One week. Long enough to matter, short enough to undo without a year of waiting.
    SECURE_HSTS_SECONDS = int(os.getenv("DJANGO_HSTS_SECONDS", "604800"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = env_bool("DJANGO_HSTS_INCLUDE_SUBDOMAINS", True)
    SECURE_HSTS_PRELOAD = False

SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"

# security.W021 wants HSTS preload. Preload is off on purpose: it cannot be undone.
SILENCED_SYSTEM_CHECKS = ["security.W021"]

# ``videos`` is R2 when the media secrets are set, and MEDIA_ROOT/videos on
# this volume when they are not. The default storage stays the volume so
# gallery uploads are unchanged.
STORAGES = build_storages(
    staticfiles_backend="whitenoise.storage.CompressedManifestStaticFilesStorage",
    media_root=MEDIA_ROOT,
    media_url=MEDIA_URL,
)


class MediaServeMiddleware:
    """Serve uploaded files from MEDIA_ROOT.

    django.conf.urls.static.static() adds no routes when DEBUG is false, and
    gallery uploads are created at runtime so they are not in the WhiteNoise
    manifest. safe_join inside django.views.static.serve blocks path traversal.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        from django.conf import settings
        from django.views.static import serve

        prefix = settings.MEDIA_URL
        path = request.path_info or "/"
        if (
            settings.SERVE_MEDIA
            and request.method in ("GET", "HEAD")
            and prefix.startswith("/")
            and path.startswith(prefix)
        ):
            from django.core.exceptions import SuspiciousFileOperation
            from django.http import Http404, HttpResponseNotFound

            try:
                return serve(request, path[len(prefix):], document_root=settings.MEDIA_ROOT)
            except (Http404, SuspiciousFileOperation):
                return HttpResponseNotFound()
        return self.get_response(request)


MIDDLEWARE = [*MIDDLEWARE, "config.settings.prod.MediaServeMiddleware"]

if not os.getenv("EMAIL_BACKEND"):
    if os.getenv("EMAIL_HOST"):
        EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    else:
        EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


class JsonLineFormatter(logging.Formatter):
    """One JSON object per line, written to stdout for the platform log drain."""

    def format(self, record):
        payload = {
            "ts": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            payload["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=True)


_log_level = os.getenv("DJANGO_LOG_LEVEL", "INFO").upper()

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {"()": "config.settings.prod.JsonLineFormatter"},
    },
    "handlers": {
        "stdout": {
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
            "formatter": "json",
        },
    },
    "root": {"handlers": ["stdout"], "level": _log_level},
    "loggers": {
        "django": {"handlers": ["stdout"], "level": _log_level, "propagate": False},
        "django.request": {
            "handlers": ["stdout"],
            "level": "WARNING",
            "propagate": False,
        },
        "django.security": {
            "handlers": ["stdout"],
            "level": "WARNING",
            "propagate": False,
        },
        "django.server": {"handlers": ["stdout"], "level": _log_level, "propagate": False},
    },
}
