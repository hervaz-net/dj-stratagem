"""Cloudflare R2 backend for public preview videos.

Imported only when the R2 environment variables are set. Objects are public
through the custom domain, so generated URLs are unsigned
(``querystring_auth`` is false) and carry a long immutable cache lifetime.

R2 and the Cloudflare cache in front of the custom domain honor HTTP Range
requests and answer ``206 Partial Content``. Seeking in a video element is
served from R2. The application does not proxy the file.

Boto3's default is to attach a full-object CRC32 checksum. R2 accepts CRC32
only as a composite (multipart) checksum and rejects that default on
PutObject, including files at the documented 5 MB preview size. This client
calculates a request checksum only when the operation requires one. That is
the same policy ``scripts/upload_media.sh`` sets for the AWS CLI.
"""

from botocore.config import Config
from storages.backends.s3 import S3Storage

from config.storage import VIDEO_CACHE_CONTROL, content_type_for


def _r2_client_config(provided, *, signature_version, addressing_style):
    """Botocore config for R2. Checksum policy wins over a caller-supplied config."""
    checksums = Config(
        request_checksum_calculation="when_required",
        response_checksum_validation="when_required",
    )
    if provided is None:
        provided = Config(
            signature_version=signature_version,
            s3={"addressing_style": addressing_style},
        )
    return provided.merge(checksums)


class R2VideoStorage(S3Storage):
    """Public video objects with an explicit Content-Type and no canned ACL."""

    def __init__(self, **kwargs):
        kwargs["client_config"] = _r2_client_config(
            kwargs.get("client_config"),
            signature_version=kwargs.get("signature_version") or "s3v4",
            addressing_style=kwargs.get("addressing_style") or "path",
        )
        super().__init__(**kwargs)

    def get_object_parameters(self, name):
        params = super().get_object_parameters(name)
        content_type = content_type_for(name)
        if content_type:
            params["ContentType"] = content_type
        params["CacheControl"] = VIDEO_CACHE_CONTROL
        # R2 rejects S3 canned ACLs. Public read is the bucket custom domain.
        params.pop("ACL", None)
        return params
