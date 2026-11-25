"""Cloudflare R2 backend for public preview videos.

Imported only when the R2 environment variables are set. Objects are public
through the custom domain, so generated URLs are unsigned
(``querystring_auth`` is false) and carry a long immutable cache lifetime.

R2 and the Cloudflare cache in front of the custom domain honor HTTP Range
requests and answer ``206 Partial Content``. Seeking in a video element is
served from R2. The application does not proxy the file.
"""

from storages.backends.s3 import S3Storage

from config.storage import VIDEO_CACHE_CONTROL, content_type_for


class R2VideoStorage(S3Storage):
    """Public video objects with an explicit Content-Type and no canned ACL."""

    def get_object_parameters(self, name):
        params = super().get_object_parameters(name)
        content_type = content_type_for(name)
        if content_type:
            params["ContentType"] = content_type
        params["CacheControl"] = VIDEO_CACHE_CONTROL
        # R2 rejects S3 canned ACLs. Public read is the bucket custom domain.
        params.pop("ACL", None)
        return params
