"""Preview-video storage.

Product videos and their posters live in the ``videos`` storage. With the R2
variables set, that storage is Cloudflare R2 behind the public media hostname.
Without them, files stay on the local media directory (the Fly volume in
production). Gallery uploads keep using the default filesystem storage either
way.

R2 answers ``Range`` on the custom domain with ``206 Partial Content``. A
``<video>`` element seeks there. Those requests never reach the Fly app.
"""

import mimetypes
import os
from pathlib import Path
from urllib.parse import urlsplit

from django.core.exceptions import ImproperlyConfigured

VIDEO_CACHE_CONTROL = "public, max-age=31536000, immutable"
VIDEO_KEY_PREFIX = "videos"

# Extensions browsers will not play if R2 stores them as octet-stream.
CONTENT_TYPES = {
    ".mp4": "video/mp4",
    ".m4v": "video/mp4",
    ".webm": "video/webm",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".gif": "image/gif",
}

# Names that mean "turn R2 on". A leftover AWS_ACCESS_KEY_ID from another
# tool must not count, and must not make a half-configured boot fail.
_INTENT_NAMES = (
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "R2_BUCKET_NAME",
    "R2_ENDPOINT_URL",
    "AWS_S3_CUSTOM_DOMAIN",
    "R2_CUSTOM_DOMAIN",
    "AWS_STORAGE_BUCKET_NAME",
    "AWS_S3_ENDPOINT_URL",
    "AWS_S3_ACCESS_KEY_ID",
    "AWS_S3_SECRET_ACCESS_KEY",
)


def ensure_media_mimetypes():
    """Force video and poster types, including on hosts with a thin mime db."""
    for suffix, content_type in CONTENT_TYPES.items():
        mimetypes.add_type(content_type, suffix, strict=True)


def content_type_for(name):
    return CONTENT_TYPES.get(Path(str(name)).suffix.lower(), "")


def _env(*names):
    for name in names:
        value = os.getenv(name, "").strip()
        if value:
            return value
    return ""


def _normalize_custom_domain(value):
    raw = value.strip()
    lowered = raw.lower()
    for prefix in ("https://", "http://"):
        if lowered.startswith(prefix):
            raw = raw[len(prefix):]
            break
    if "/" in raw:
        raise ImproperlyConfigured(
            "AWS_S3_CUSTOM_DOMAIN must be a hostname such as media.djstratageminc.com, "
            "with no path. Video keys already live under /videos/."
        )
    host = raw.strip().strip(".").lower()
    if not host or any(char in host for char in " :?#"):
        raise ImproperlyConfigured(
            "AWS_S3_CUSTOM_DOMAIN must be a hostname such as media.djstratageminc.com."
        )
    return host


def _normalize_endpoint(value):
    raw = value.strip().rstrip("/")
    if not raw.lower().startswith("https://"):
        raise ImproperlyConfigured(
            "R2_ENDPOINT_URL must be the https S3 API endpoint, "
            "for example https://<accountid>.r2.cloudflarestorage.com."
        )
    parts = urlsplit(raw)
    if parts.path not in ("", "/"):
        raise ImproperlyConfigured(
            "R2_ENDPOINT_URL must not include the bucket path. "
            "Use https://<accountid>.r2.cloudflarestorage.com."
        )
    return raw


def resolve_r2_media():
    """Return the public R2 config, or None when videos stay on disk.

    Every intent variable must be set together. None of them set means the
    Fly volume (or local ``media/``). A partial set refuses to boot.
    """
    if not any(os.getenv(name, "").strip() for name in _INTENT_NAMES):
        return None

    access_key = _env("R2_ACCESS_KEY_ID", "AWS_S3_ACCESS_KEY_ID", "AWS_ACCESS_KEY_ID")
    secret_key = _env(
        "R2_SECRET_ACCESS_KEY",
        "AWS_S3_SECRET_ACCESS_KEY",
        "AWS_SECRET_ACCESS_KEY",
    )
    bucket_name = _env("R2_BUCKET_NAME", "AWS_STORAGE_BUCKET_NAME")
    endpoint_url = _env("R2_ENDPOINT_URL", "AWS_S3_ENDPOINT_URL")
    custom_domain = _env("AWS_S3_CUSTOM_DOMAIN", "R2_CUSTOM_DOMAIN")

    missing = [
        label
        for label, value in (
            ("R2_ACCESS_KEY_ID", access_key),
            ("R2_SECRET_ACCESS_KEY", secret_key),
            ("R2_BUCKET_NAME", bucket_name),
            ("R2_ENDPOINT_URL", endpoint_url),
            ("AWS_S3_CUSTOM_DOMAIN", custom_domain),
        )
        if not value
    ]
    if missing:
        raise ImproperlyConfigured(
            "R2 media storage needs all of R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, "
            "R2_BUCKET_NAME, R2_ENDPOINT_URL, and AWS_S3_CUSTOM_DOMAIN. "
            f"Missing: {', '.join(missing)}. "
            "Unset every one of them to keep preview videos on the local media directory."
        )

    return {
        "access_key": access_key,
        "secret_key": secret_key,
        "bucket_name": bucket_name,
        "endpoint_url": _normalize_endpoint(endpoint_url),
        "custom_domain": _normalize_custom_domain(custom_domain),
    }


def videos_storage(*, media_root, media_url):
    """Storage entry for ``STORAGES['videos']``."""
    r2 = resolve_r2_media()
    if r2 is None:
        base = media_url if str(media_url).endswith("/") else f"{media_url}/"
        return {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
            "OPTIONS": {
                "location": str(Path(media_root) / VIDEO_KEY_PREFIX),
                "base_url": f"{base}{VIDEO_KEY_PREFIX}/",
            },
        }

    # Import only when R2 is configured, so a host without django-storages
    # still boots on the volume.
    try:
        from config.r2_storage import R2VideoStorage
    except ImportError as exc:
        raise ImproperlyConfigured(
            "R2 media storage is configured but django-storages[s3] is not installed."
        ) from exc

    backend = f"{R2VideoStorage.__module__}.{R2VideoStorage.__name__}"
    return {
        "BACKEND": backend,
        "OPTIONS": {
            "bucket_name": r2["bucket_name"],
            "access_key": r2["access_key"],
            "secret_key": r2["secret_key"],
            "endpoint_url": r2["endpoint_url"],
            "custom_domain": r2["custom_domain"],
            "region_name": "auto",
            "signature_version": "s3v4",
            "addressing_style": "path",
            "querystring_auth": False,
            "default_acl": None,
            "file_overwrite": True,
            "gzip": False,
            "location": VIDEO_KEY_PREFIX,
            "object_parameters": {"CacheControl": VIDEO_CACHE_CONTROL},
        },
    }


def build_storages(*, staticfiles_backend, media_root, media_url):
    return {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": staticfiles_backend},
        "videos": videos_storage(media_root=media_root, media_url=media_url),
    }


def allow_media_cdn(policy, origin):
    """Add the media hostname to media-src and img-src on an existing policy.

    Returns the policy unchanged when it is empty, when ``origin`` is empty,
    or when those directives already allow the host. Does not invent a policy
    for a response that has none: a missing media-src is only restricted when
    default-src is set, and in that case the new directive keeps the
    default-src sources and adds the media host.
    """
    origin = (origin or "").strip()
    if not policy or not origin:
        return policy

    directives = []
    index = {}
    for part in policy.split(";"):
        part = part.strip()
        if not part:
            continue
        tokens = part.split()
        name = tokens[0].lower()
        index[name] = len(directives)
        directives.append([name, tokens[1:]])

    def include_origin(sources):
        # 'none' has to be the only source. Drop it when the media host is allowed.
        if "*" in sources:
            return list(sources)
        cleaned = [source for source in sources if source != "'none'"]
        if origin not in cleaned:
            cleaned.append(origin)
        return cleaned or [origin]

    def ensure(name):
        if name in index:
            directives[index[name]][1] = include_origin(directives[index[name]][1])
            return
        if "default-src" not in index:
            return
        directives.append([name, include_origin(directives[index["default-src"]][1])])
        index[name] = len(directives) - 1

    ensure("media-src")
    ensure("img-src")

    rendered = "; ".join(
        name if not sources else f"{name} {' '.join(sources)}"
        for name, sources in directives
    )
    return rendered


def r2_django_settings():
    """Settings that describe the public media host. Empty when R2 is off."""
    r2 = resolve_r2_media()
    if r2 is None:
        return {
            "enabled": False,
            "custom_domain": "",
            "media_cdn_origin": "",
        }
    return {
        "enabled": True,
        "custom_domain": r2["custom_domain"],
        "media_cdn_origin": f"https://{r2['custom_domain']}",
        "endpoint_url": r2["endpoint_url"],
        "bucket_name": r2["bucket_name"],
    }
