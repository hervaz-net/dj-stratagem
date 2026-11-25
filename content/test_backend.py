import tempfile
from io import BytesIO

from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.db import connection
from django.test import TestCase, override_settings
from django.test.utils import CaptureQueriesContext
from django.urls import reverse
from PIL import Image

from content.models import GalleryImage, Plan, validate_gallery_upload, validate_public_url


class PlanUrlTests(TestCase):
    def test_script_urls_are_rejected_and_site_paths_are_kept(self):
        plan = Plan.objects.get(name="Starter")
        plan.action_url = "javascript:alert(1)"
        with self.assertRaises(ValidationError):
            plan.save()
        plan.refresh_from_db()
        self.assertEqual(plan.action_url, "/join/")

        plan.action_url = "//evil.example/phish"
        with self.assertRaises(ValidationError):
            plan.full_clean()

        self.assertEqual(validate_public_url("/contact/?topic=Growth%20access"), "/contact/?topic=Growth%20access")
        plan.action_url = "https://djstratageminc.com/contact/"
        plan.save()
        plan.refresh_from_db()
        self.assertEqual(plan.action_url, "https://djstratageminc.com/contact/")


class GalleryImageTests(TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.settings_override = override_settings(MEDIA_ROOT=self.tmp.name)
        self.settings_override.enable()

    def tearDown(self):
        self.settings_override.disable()
        self.tmp.cleanup()

    def test_upload_stores_pixel_size_and_rejects_a_large_file(self):
        buffer = BytesIO()
        Image.new("RGB", (12, 8), "red").save(buffer, format="PNG")
        photo = GalleryImage(alt="Color swatch", kind=GalleryImage.Kind.JOBSITE, published=False)
        photo.image.save("swatch.png", ContentFile(buffer.getvalue(), name="swatch.png"), save=True)
        photo.refresh_from_db()
        self.assertEqual((photo.width, photo.height), (12, 8))

        class Oversized:
            size = 8 * 1024 * 1024 + 1

        with self.assertRaises(ValidationError):
            validate_gallery_upload(Oversized())


class QueryTests(TestCase):
    def test_homepage_does_not_query_once_per_card(self):
        with CaptureQueriesContext(connection) as captured:
            response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertLessEqual(len(captured), 10)
        self.assertContains(response, "conduit laid out")
