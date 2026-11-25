from django.apps import AppConfig


class WholesaleConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "wholesale"
    verbose_name = "Wholesale"

    def ready(self):
        from . import signals  # noqa: F401
