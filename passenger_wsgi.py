"""LiteSpeed / Passenger entry point for Namecheap's Setup Python App."""

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

ENV_FILE = Path.home() / "djs-django.env"
if ENV_FILE.is_file():
    for raw in ENV_FILE.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.prod")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
