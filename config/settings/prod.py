"""Production settings. Requires a secret and an explicit host list."""

import os

import dj_database_url
from django.core.exceptions import ImproperlyConfigured

from .base import *  # noqa: F403
from .base import BASE_DIR, EMAIL_USE_SSL, EMAIL_USE_TLS, SECRET_KEY, env_int, env_list

DEBUG = False
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

if EMAIL_USE_TLS and EMAIL_USE_SSL:
    raise ImproperlyConfigured("Set only one of EMAIL_USE_TLS and EMAIL_USE_SSL.")

if not SECRET_KEY or SECRET_KEY.startswith("dev-only") or len(SECRET_KEY) < 32:
    raise ImproperlyConfigured(
        "Set DJANGO_SECRET_KEY to a long random value before running production."
    )

hosts = env_list("DJANGO_ALLOWED_HOSTS", "")
if not hosts:
    raise ImproperlyConfigured("Set DJANGO_ALLOWED_HOSTS for production.")
ALLOWED_HOSTS = hosts

database_url = os.getenv("DATABASE_URL", "").strip()
if database_url:
    DATABASES = {
        "default": dj_database_url.parse(
            database_url,
            conn_max_age=env_int("DATABASE_CONN_MAX_AGE", 60, minimum=0),
            ssl_require=os.getenv("DATABASE_SSL_REQUIRE", "").lower() in {"1", "true", "yes"},
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "data" / "db.sqlite3",
        }
    }

if not os.getenv("EMAIL_BACKEND"):
    if os.getenv("EMAIL_HOST"):
        EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
    else:
        EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Hash and compress static files. Dev settings keep unhashed files so {% static %} works without collectstatic.
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
