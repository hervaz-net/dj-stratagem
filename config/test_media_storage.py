"""Preview videos stay on disk until R2 is fully configured."""

import mimetypes
import os
from pathlib import Path
from unittest.mock import patch

from botocore.config import Config
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.files.storage import storages
from django.http import HttpResponse
from django.test import RequestFactory, SimpleTestCase, override_settings

from config.middleware import SecurityHeadersMiddleware
from config.r2_storage import R2VideoStorage
from config.storage import (
    VIDEO_CACHE_CONTROL,
    allow_media_cdn,
    build_storages,
    content_type_for,
    resolve_r2_media,
    videos_storage,
)

INTENT = (
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

R2_ENV = {
    "R2_ACCESS_KEY_ID": "access-key",
    "R2_SECRET_ACCESS_KEY": "secret-key",
    "R2_BUCKET_NAME": "djstratagem-media",
    "R2_ENDPOINT_URL": "https://account.r2.cloudflarestorage.com",
    "AWS_S3_CUSTOM_DOMAIN": "https://media.djstratageminc.com",
}


def _cleared_env(**updates):
    env = {name: "" for name in INTENT}
    env.update(updates)
    return patch.dict(os.environ, env, clear=False)


class LocalVideoStorageTests(SimpleTestCase):
    def test_running_site_keeps_videos_on_disk(self):
        self.assertFalse(settings.AWS_QUERYSTRING_AUTH)
        self.assertEqual(settings.AWS_S3_CUSTOM_DOMAIN, "")
        self.assertEqual(settings.MEDIA_CDN_ORIGIN, "")
        self.assertEqual(
            settings.AWS_S3_OBJECT_PARAMETERS["CacheControl"],
            VIDEO_CACHE_CONTROL,
        )
        self.assertEqual(
            storages["default"].__class__.__name__,
            "FileSystemStorage",
        )
        videos = storages["videos"]
        self.assertEqual(videos.__class__.__name__, "FileSystemStorage")
        self.assertEqual(videos.url("clip.mp4"), "/media/videos/clip.mp4")
        self.assertEqual(Path(videos.location), Path(settings.MEDIA_ROOT) / "videos")

    def test_stray_aws_keys_do_not_enable_r2(self):
        with _cleared_env(AWS_ACCESS_KEY_ID="AKIATEST", AWS_SECRET_ACCESS_KEY="secret"):
            entry = videos_storage(media_root="/data/media", media_url="/media/")
        self.assertEqual(entry["BACKEND"], "django.core.files.storage.FileSystemStorage")
        with _cleared_env(AWS_ACCESS_KEY_ID="AKIATEST", AWS_SECRET_ACCESS_KEY="secret"):
            self.assertIsNone(resolve_r2_media())

    def test_partial_r2_config_refuses_to_boot(self):
        with _cleared_env(R2_BUCKET_NAME="djstratagem-media"):
            with self.assertRaises(ImproperlyConfigured):
                resolve_r2_media()

    def test_endpoint_must_be_the_account_host(self):
        env = dict(R2_ENV)
        env["R2_ENDPOINT_URL"] = "https://account.r2.cloudflarestorage.com/djstratagem-media"
        with _cleared_env(**env):
            with self.assertRaises(ImproperlyConfigured):
                resolve_r2_media()

    def test_r2_storage_is_public_and_cached(self):
        with _cleared_env(**R2_ENV):
            built = build_storages(
                staticfiles_backend="django.contrib.staticfiles.storage.StaticFilesStorage",
                media_root="/data/media",
                media_url="/media/",
            )
        self.assertEqual(
            built["default"]["BACKEND"],
            "django.core.files.storage.FileSystemStorage",
        )
        videos = built["videos"]
        self.assertEqual(videos["BACKEND"], "config.r2_storage.R2VideoStorage")
        options = videos["OPTIONS"]
        self.assertEqual(options["custom_domain"], "media.djstratageminc.com")
        self.assertEqual(options["endpoint_url"], "https://account.r2.cloudflarestorage.com")
        self.assertFalse(options["querystring_auth"])
        self.assertIsNone(options["default_acl"])
        self.assertFalse(options["gzip"])
        self.assertEqual(options["object_parameters"]["CacheControl"], VIDEO_CACHE_CONTROL)
        self.assertEqual(options["region_name"], "auto")
        self.assertEqual(options["addressing_style"], "path")


class R2ObjectTests(SimpleTestCase):
    def setUp(self):
        self.storage = R2VideoStorage(
            bucket_name="djstratagem-media",
            access_key="access-key",
            secret_key="secret-key",
            endpoint_url="https://account.r2.cloudflarestorage.com",
            custom_domain="media.djstratageminc.com",
            region_name="auto",
            signature_version="s3v4",
            addressing_style="path",
            querystring_auth=False,
            default_acl=None,
            gzip=False,
            location="videos",
            object_parameters={"CacheControl": VIDEO_CACHE_CONTROL},
        )

    def test_checksums_are_sent_only_when_required(self):
        config = self.storage.client_config
        self.assertEqual(config.request_checksum_calculation, "when_required")
        self.assertEqual(config.response_checksum_validation, "when_required")
        self.assertEqual(config.signature_version, "s3v4")
        self.assertEqual(config.s3["addressing_style"], "path")

    def test_caller_client_config_keeps_its_own_settings(self):
        storage = R2VideoStorage(
            bucket_name="djstratagem-media",
            access_key="access-key",
            secret_key="secret-key",
            endpoint_url="https://account.r2.cloudflarestorage.com",
            custom_domain="media.djstratageminc.com",
            region_name="auto",
            signature_version="s3v4",
            addressing_style="path",
            querystring_auth=False,
            client_config=Config(
                max_pool_connections=3,
                signature_version="s3v4",
                s3={"addressing_style": "virtual"},
                request_checksum_calculation="when_supported",
            ),
        )
        config = storage.client_config
        self.assertEqual(config.max_pool_connections, 3)
        self.assertEqual(config.s3["addressing_style"], "virtual")
        self.assertEqual(config.request_checksum_calculation, "when_required")
        self.assertEqual(config.response_checksum_validation, "when_required")

    def test_public_url_has_no_signature(self):
        url = self.storage.url("clip.mp4")
        self.assertEqual(url, "https://media.djstratageminc.com/videos/clip.mp4")
        self.assertNotIn("?", url)
        self.assertFalse(self.storage.querystring_auth)

    def test_content_types_for_mp4_webm_and_poster(self):
        self.assertEqual(content_type_for("clip.mp4"), "video/mp4")
        self.assertEqual(content_type_for("CLIP.WEBM"), "video/webm")
        self.assertEqual(mimetypes.guess_type("clip.mp4")[0], "video/mp4")
        self.assertEqual(mimetypes.guess_type("clip.webm")[0], "video/webm")
        mp4 = self.storage.get_object_parameters("videos/clip.mp4")
        webm = self.storage.get_object_parameters("videos/clip.webm")
        poster = self.storage.get_object_parameters("videos/clip.jpg")
        self.assertEqual(mp4["ContentType"], "video/mp4")
        self.assertEqual(webm["ContentType"], "video/webm")
        self.assertEqual(poster["ContentType"], "image/jpeg")
        for params in (mp4, webm, poster):
            self.assertEqual(params["CacheControl"], VIDEO_CACHE_CONTROL)
            self.assertNotIn("ACL", params)


class MediaCspTests(SimpleTestCase):
    def test_existing_policy_gains_media_and_img_sources(self):
        updated = allow_media_cdn(
            "default-src 'self'",
            "https://media.djstratageminc.com",
        )
        self.assertIn("media-src 'self' https://media.djstratageminc.com", updated)
        self.assertIn("img-src 'self' https://media.djstratageminc.com", updated)

    def test_none_source_becomes_the_media_host(self):
        updated = allow_media_cdn(
            "default-src 'none'",
            "https://media.djstratageminc.com",
        )
        self.assertIn("default-src 'none'", updated)
        self.assertIn("media-src https://media.djstratageminc.com", updated)
        self.assertNotIn("'none' https://media.djstratageminc.com", updated)

    def test_star_source_is_left_alone(self):
        policy = "media-src *; img-src *"
        self.assertEqual(
            allow_media_cdn(policy, "https://media.djstratageminc.com"),
            policy,
        )

    def test_empty_origin_does_not_rewrite(self):
        policy = "default-src 'self'"
        self.assertEqual(allow_media_cdn(policy, ""), policy)

    def test_middleware_leaves_responses_without_csp_alone(self):
        def get_response(request):
            return HttpResponse("ok")

        with override_settings(MEDIA_CDN_ORIGIN="https://media.djstratageminc.com"):
            response = SecurityHeadersMiddleware(get_response)(RequestFactory().get("/"))
        self.assertNotIn("Content-Security-Policy", response)
        self.assertEqual(response["X-Content-Type-Options"], "nosniff")

    def test_middleware_extends_an_existing_csp(self):
        def get_response(request):
            response = HttpResponse("ok")
            response["Content-Security-Policy"] = "default-src 'self'; media-src 'self'"
            return response

        with override_settings(MEDIA_CDN_ORIGIN="https://media.djstratageminc.com"):
            response = SecurityHeadersMiddleware(get_response)(RequestFactory().get("/"))
        policy = response["Content-Security-Policy"]
        self.assertIn("media-src 'self' https://media.djstratageminc.com", policy)
        self.assertIn("img-src 'self' https://media.djstratageminc.com", policy)
