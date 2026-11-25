from django.contrib import admin

from content.models import (
    Article,
    Faq,
    GalleryImage,
    Guide,
    Mode,
    ModeCapability,
    PipelineStep,
    Plan,
    PlanFeature,
    Principle,
    ResourceSection,
    UpdateEntry,
)


class CapabilityInline(admin.TabularInline):
    model = ModeCapability
    extra = 1


class FeatureInline(admin.TabularInline):
    model = PlanFeature
    extra = 1


@admin.register(Mode)
class ModeAdmin(admin.ModelAdmin):
    list_display = ("position", "name", "stage", "published")
    list_display_links = ("name",)
    list_editable = ("position", "published")
    list_filter = ("stage", "published")
    search_fields = ("name", "summary", "headline")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CapabilityInline]


@admin.register(PipelineStep)
class PipelineStepAdmin(admin.ModelAdmin):
    list_display = ("position", "number", "title", "modes_label")
    list_display_links = ("title",)
    list_editable = ("position",)


@admin.register(Faq)
class FaqAdmin(admin.ModelAdmin):
    list_display = ("position", "question", "published")
    list_display_links = ("question",)
    list_editable = ("position", "published")
    search_fields = ("question", "answer")


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("position", "name", "price_label", "featured", "published")
    list_display_links = ("name",)
    list_editable = ("position", "featured", "published")
    inlines = [FeatureInline]


@admin.register(Principle)
class PrincipleAdmin(admin.ModelAdmin):
    list_display = ("position", "number", "title")
    list_display_links = ("title",)
    list_editable = ("position",)


@admin.register(ResourceSection)
class ResourceSectionAdmin(admin.ModelAdmin):
    list_display = ("position", "title", "slug", "published")
    list_display_links = ("title",)
    list_editable = ("position", "published")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("position", "title", "section", "published")
    list_display_links = ("title",)
    list_editable = ("position", "published")
    list_filter = ("section", "published")
    search_fields = ("title", "summary", "body")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(UpdateEntry)
class UpdateEntryAdmin(admin.ModelAdmin):
    list_display = ("position", "label", "title", "published")
    list_display_links = ("title",)
    list_editable = ("position", "published")


@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    list_display = ("position", "title", "published")
    list_display_links = ("title",)
    list_editable = ("position", "published")


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("position", "kind", "alt", "featured", "published")
    list_display_links = ("alt",)
    list_editable = ("position", "featured", "published")
    list_filter = ("kind", "published", "featured")
    search_fields = ("alt", "caption", "credit")
