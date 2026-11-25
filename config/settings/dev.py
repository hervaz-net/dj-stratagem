"""Local development. SQLite, debug, console email unless overridden."""

import os

from config.storage import build_storages

from .base import *  # noqa: F403
from .base import BASE_DIR, MEDIA_ROOT, MEDIA_URL, SECRET_KEY

DEBUG = True
if not SECRET_KEY:
    SECRET_KEY = "dev-only-not-for-production"

(BASE_DIR / "data").mkdir(exist_ok=True)
(BASE_DIR / "media").mkdir(exist_ok=True)
(BASE_DIR / "staticfiles").mkdir(exist_ok=True)

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "testserver", "[::1]"]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "data" / "db.sqlite3",
    }
}

EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND",
    "django.core.mail.backends.console.EmailBackend",
)

STORAGES = build_storages(
    staticfiles_backend="django.contrib.staticfiles.storage.StaticFilesStorage",
    media_root=MEDIA_ROOT,
    media_url=MEDIA_URL,
)
