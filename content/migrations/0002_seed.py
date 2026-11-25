from django.db import migrations


def forwards(apps, schema_editor):
    from content.bootstrap import load

    load(apps)


def backwards(apps, schema_editor):
    for name in (
        "GalleryImage",
        "Guide",
        "UpdateEntry",
        "Article",
        "ResourceSection",
        "Principle",
        "PlanFeature",
        "Plan",
        "Faq",
        "PipelineStep",
        "ModeCapability",
        "Mode",
    ):
        apps.get_model("content", name).objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
