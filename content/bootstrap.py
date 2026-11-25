"""Load the public-site copy and the real photographs into an empty database."""

from pathlib import Path

from django.conf import settings
from django.core.files import File
from PIL import Image

from content.seed_data import ARTICLES, FAQS, GUIDES, MODES, PHOTOS, PIPELINE, PLANS, PRINCIPLES, SECTIONS, UPDATES


def load(apps):
    Mode = apps.get_model("content", "Mode")
    if Mode.objects.exists():
        return

    Capability = apps.get_model("content", "ModeCapability")
    Step = apps.get_model("content", "PipelineStep")
    Faq = apps.get_model("content", "Faq")
    Plan = apps.get_model("content", "Plan")
    Feature = apps.get_model("content", "PlanFeature")
    Principle = apps.get_model("content", "Principle")
    Section = apps.get_model("content", "ResourceSection")
    Article = apps.get_model("content", "Article")
    Update = apps.get_model("content", "UpdateEntry")
    Guide = apps.get_model("content", "Guide")
    Photo = apps.get_model("content", "GalleryImage")

    modes = {}
    for position, item in enumerate(MODES, start=1):
        capabilities = item["capabilities"]
        payload = {key: value for key, value in item.items() if key != "capabilities"}
        mode = Mode.objects.create(position=position, published=True, **payload)
        modes[mode.slug] = mode
        for index, text in enumerate(capabilities, start=1):
            Capability.objects.create(mode=mode, text=text, position=index)

    for position, item in enumerate(PIPELINE, start=1):
        Step.objects.create(position=position, **item)
    for position, item in enumerate(FAQS, start=1):
        Faq.objects.create(position=position, published=True, **item)
    for position, item in enumerate(PLANS, start=1):
        features = item["features"]
        payload = {key: value for key, value in item.items() if key != "features"}
        plan = Plan.objects.create(position=position, published=True, **payload)
        for index, text in enumerate(features, start=1):
            Feature.objects.create(plan=plan, text=text, position=index)
    for position, item in enumerate(PRINCIPLES, start=1):
        Principle.objects.create(position=position, **item)

    sections = {}
    for position, item in enumerate(SECTIONS, start=1):
        sections[item["slug"]] = Section.objects.create(position=position, published=True, **item)
    for position, item in enumerate(ARTICLES, start=1):
        Article.objects.create(
            position=position,
            published=True,
            section=sections[item["section"]],
            related_mode=modes[item["mode"]],
            slug=item["slug"],
            title=item["title"],
            summary=item["summary"],
            intro=item["intro"],
            body="\n\n".join(item["paragraphs"]),
        )
    for position, item in enumerate(UPDATES, start=1):
        Update.objects.create(position=position, published=True, **item)
    for position, item in enumerate(GUIDES, start=1):
        Guide.objects.create(position=position, published=True, **item)

    for position, item in enumerate(PHOTOS, start=1):
        src = Path(settings.BASE_DIR) / item["src"]
        if not src.is_file():
            continue
        with Image.open(src) as image:
            width, height = image.size
        photo = Photo(
            kind=item["kind"],
            alt=item["alt"],
            caption=item["caption"],
            credit=item["credit"],
            featured=item["featured"],
            published=True,
            position=position,
            width=width,
            height=height,
        )
        with src.open("rb") as handle:
            photo.image.save(src.name, File(handle), save=True)
