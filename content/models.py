import logging
from io import BytesIO
from urllib.parse import urlsplit

from django.core.exceptions import ValidationError
from django.db import models
from django.urls import reverse
from PIL import Image

MAX_GALLERY_BYTES = 8 * 1024 * 1024
logger = logging.getLogger(__name__)


def validate_public_url(value):
    """Allow a same-site path or an http(s) URL. Reject scriptable schemes."""

    candidate = (value or "").strip()
    if not candidate or any(ord(char) < 32 for char in candidate):
        raise ValidationError("Enter a path starting with / or an http(s) URL.")
    if candidate.startswith("/") and not candidate.startswith("//") and "\\" not in candidate:
        return candidate
    parsed = urlsplit(candidate)
    if parsed.scheme in {"http", "https"} and parsed.netloc:
        return candidate
    raise ValidationError("Enter a path starting with / or an http(s) URL.")


def validate_gallery_upload(image):
    size = getattr(image, "size", None)
    if not size:
        source = getattr(image, "file", None)
        size = getattr(source, "size", 0) if source is not None else 0
    if size and size > MAX_GALLERY_BYTES:
        raise ValidationError("Images must be 8 MB or smaller.")


class Mode(models.Model):
    class Stage(models.TextChoices):
        FIND = "Find", "Find"
        WIN = "Win", "Win"
        BUILD = "Build", "Build"
        KEEP = "Keep", "Keep"

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=40)
    stage = models.CharField(max_length=12, choices=Stage.choices)
    summary = models.CharField(max_length=180)
    detail = models.TextField()
    headline = models.CharField(max_length=180)
    description = models.TextField()
    outcome = models.CharField(max_length=180)
    published = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "name"]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("mode", args=[self.slug])


class ModeCapability(models.Model):
    mode = models.ForeignKey(Mode, related_name="capabilities", on_delete=models.CASCADE)
    text = models.CharField(max_length=180)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "pk"]
        verbose_name_plural = "capabilities"

    def __str__(self):
        return self.text


class PipelineStep(models.Model):
    number = models.CharField(max_length=4)
    title = models.CharField(max_length=80)
    text = models.TextField()
    modes_label = models.CharField(max_length=160, help_text="Comma-separated mode names.")
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "number"]

    def __str__(self):
        return self.title

    def mode_names(self):
        return [name.strip() for name in self.modes_label.split(",") if name.strip()]


class Faq(models.Model):
    question = models.CharField(max_length=200)
    answer = models.TextField()
    published = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "pk"]
        verbose_name = "FAQ"

    def __str__(self):
        return self.question


class Plan(models.Model):
    name = models.CharField(max_length=40)
    description = models.CharField(max_length=180)
    price_label = models.CharField(max_length=40, help_text="Use “Free” or “Request access”. Do not invent a dollar price.")
    qualifier = models.CharField(max_length=80)
    action_label = models.CharField(max_length=40)
    action_url = models.CharField(max_length=200)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "name"]

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        self.action_url = validate_public_url(self.action_url)

    def save(self, *args, **kwargs):
        self.action_url = validate_public_url(self.action_url)
        super().save(*args, **kwargs)


class PlanFeature(models.Model):
    plan = models.ForeignKey(Plan, related_name="features", on_delete=models.CASCADE)
    text = models.CharField(max_length=180)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "pk"]

    def __str__(self):
        return self.text


class Principle(models.Model):
    number = models.CharField(max_length=4)
    title = models.CharField(max_length=80)
    text = models.TextField()
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "number"]

    def __str__(self):
        return self.title


class ResourceSection(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=80)
    description = models.CharField(max_length=200)
    position = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=True)

    class Meta:
        ordering = ["position", "title"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("resource_section", args=[self.slug])


class Article(models.Model):
    section = models.ForeignKey(ResourceSection, related_name="articles", on_delete=models.PROTECT)
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=160)
    summary = models.TextField()
    intro = models.TextField()
    body = models.TextField(help_text="Separate paragraphs with a blank line.")
    related_mode = models.ForeignKey(Mode, null=True, blank=True, on_delete=models.SET_NULL)
    published = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "title"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("article", args=[self.slug])

    def paragraphs(self):
        return [part.strip() for part in self.body.split("\n\n") if part.strip()]


class UpdateEntry(models.Model):
    label = models.CharField(max_length=80)
    title = models.CharField(max_length=160)
    text = models.TextField()
    published = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "pk"]
        verbose_name = "product update"
        verbose_name_plural = "product updates"

    def __str__(self):
        return self.title


class Guide(models.Model):
    title = models.CharField(max_length=160)
    text = models.TextField()
    tags = models.CharField(max_length=200, help_text="Comma-separated labels.")
    published = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "title"]

    def __str__(self):
        return self.title

    def tag_list(self):
        return [tag.strip() for tag in self.tags.split(",") if tag.strip()]


class GalleryImage(models.Model):
    class Kind(models.TextChoices):
        JOBSITE = "jobsite", "Jobsite"
        VEHICLE = "vehicle", "Vehicle reference"

    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.JOBSITE)
    alt = models.CharField(max_length=240)
    caption = models.CharField(max_length=180, blank=True)
    credit = models.CharField(max_length=180, blank=True)
    image = models.ImageField(upload_to="gallery/")
    width = models.PositiveIntegerField(default=0)
    height = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    published = models.BooleanField(default=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "pk"]
        indexes = [
            models.Index(fields=["published", "kind", "position"], name="gallery_listing_idx"),
        ]

    def __str__(self):
        return self.alt

    def clean(self):
        super().clean()
        if self.image:
            validate_gallery_upload(self.image)

    def populate_dimensions(self):
        if not self.image:
            return False
        source = None
        try:
            if getattr(self.image, "_committed", False) and self.image.name:
                with self.image.storage.open(self.image.name, "rb") as handle:
                    payload = handle.read()
            else:
                source = self.image.file
                source.seek(0)
                payload = source.read()
            with Image.open(BytesIO(payload)) as image:
                self.width, self.height = image.size
            return True
        except Exception:
            logger.warning("Could not read dimensions for gallery image %s", getattr(self.image, "name", ""))
            return False
        finally:
            if source is not None:
                try:
                    source.seek(0)
                except Exception:
                    pass

    def save(self, *args, **kwargs):
        update_fields = kwargs.get("update_fields")
        fields = set(update_fields) if update_fields is not None else None
        if self.image:
            validate_gallery_upload(self.image)
            if self.populate_dimensions() and fields is not None:
                fields.update({"width", "height"})
        if fields is not None:
            kwargs["update_fields"] = list(fields)
        super().save(*args, **kwargs)
