"""QA coverage for public pages, legacy redirects, 404s, admin, and settings."""

import importlib
import os
from unittest import mock

from django.apps import apps
from django.contrib import admin
from django.contrib.auth.models import Group
from django.core.exceptions import ImproperlyConfigured
from django.db.utils import OperationalError
from django.test import RequestFactory, SimpleTestCase, TestCase, override_settings
from django.urls import reverse

from accounts.models import User
from config.redirects import EXACT
from content.bootstrap import load
from content.models import (
    Article,
    Faq,
    GalleryImage,
    Guide,
    Mode,
    PipelineStep,
    Plan,
    Principle,
    ResourceSection,
    UpdateEntry,
)
from content.views import legacy_file
from inquiries.models import Inquiry

PASSWORD = "correct-horse-battery"

PUBLIC_PAGES = [
    ("home", "pages/home.html", "Find the work. Price it. Build it.", ("modes", "steps", "hero", "photos")),
    ("pricing", "pages/pricing.html", "Pricing", ("plans", "faqs")),
    ("about", "pages/about.html", "About D&J", ("principles", "photo")),
    ("resources", "pages/resources.html", "Resources", ("sections",)),
    ("privacy", "pages/privacy.html", "Privacy policy", ()),
    ("terms", "pages/terms.html", "Terms and conditions", ()),
    ("dashboard", "pages/dashboard.html", "Your desk", ()),
    ("contact", "pages/contact.html", "Talk to a person", ("form", "received", "context_topic")),
]

PATTERN_REDIRECTS = [
    ("/blog/a-better-view/", "/resources/blog/"),
    ("/changelog/2024/may/", "/resources/changelog/"),
    ("/projects/example-job/", "/projects/"),
    ("/construction-projects/los-angeles/electrical/", "/projects/"),
    ("/companies/capital/", "/capital/"),
    ("/companies/studio/", "/studio/"),
    ("/companies/workforce/", "/workforce/"),
    ("/companies/fleet/", "/fleet/"),
    ("/companies/acme-builders/", "/"),
    ("/dashboard/jobs/", "/dashboard/"),
    ("/exchange/projects/example-job/", "/projects/"),
    ("/exchange/construction-projects/los-angeles/electrical/", "/projects/"),
    ("/exchange/dashboard/jobs/", "/login/"),
    ("/sitemap/", "/sitemap.xml"),
    ("/fleet-cards/", "/fleet-cards.html"),
    ("/signage/", "/signage.html"),
    ("/receipts/", "/receipts.html"),
    ("/marketing/fleet-cards/", "/fleet-cards.html"),
    ("/marketing/signage/", "/signage.html"),
    ("/marketing/receipts/", "/receipts.html"),
]


class PublicPageContractTests(TestCase):
    def test_each_public_page_status_template_and_context(self):
        for name, template, title, keys in PUBLIC_PAGES:
            with self.subTest(name=name):
                response = self.client.get(reverse(name))
                self.assertEqual(response.status_code, 200)
                self.assertTemplateUsed(response, template)
                self.assertEqual(response.context["page_title"], title)
                for key in keys:
                    self.assertIn(key, response.context)
                self.assertContains(response, "Stratagem")

    def test_home_post_renders_the_same_page(self):
        response = self.client.post(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/home.html")
        self.assertContains(response, "Find the work.")

    def test_mode_pages_expose_neighbors_and_the_right_photos(self):
        modes = list(Mode.objects.filter(published=True))
        self.assertEqual(len(modes), 9)
        for index, mode in enumerate(modes):
            with self.subTest(slug=mode.slug):
                response = self.client.get(reverse("mode", args=[mode.slug]))
                self.assertEqual(response.status_code, 200)
                self.assertTemplateUsed(response, "pages/mode.html")
                self.assertEqual(response.context["mode"], mode)
                self.assertEqual(response.context["mode_number"], f"{index + 1:02d}")
                self.assertEqual(response.context["page_title"], mode.name)
                self.assertEqual(response.context["canonical_path"], mode.get_absolute_url())
                self.assertEqual(response.context["next_mode"], modes[(index + 1) % len(modes)])
                self.assertContains(response, mode.headline)

        fleet = self.client.get(reverse("mode", args=["fleet"]))
        self.assertContains(fleet, "White Ram 2500 crew-cab pickup")
        studio = self.client.get(reverse("mode", args=["studio"]))
        self.assertContains(studio, "conduit laid out")
        projects = self.client.get(reverse("mode", args=["projects"]))
        self.assertEqual(list(projects.context["photos"]), [])

    def test_resource_and_article_pages(self):
        for slug in ("blog", "changelog", "guides"):
            with self.subTest(section=slug):
                response = self.client.get(reverse("resource_section", args=[slug]))
                self.assertEqual(response.status_code, 200)
                self.assertTemplateUsed(response, "pages/resource_section.html")
                self.assertEqual(response.context["section"].slug, slug)
                self.assertIn("articles", response.context)
                self.assertIn("updates", response.context)
                self.assertIn("guides", response.context)

        article = Article.objects.get(slug="a-better-view-of-the-next-job")
        response = self.client.get(article.get_absolute_url())
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/article.html")
        self.assertEqual(response.context["article"], article)
        self.assertContains(response, article.paragraphs()[0][:40])

    def test_unpublished_objects_are_hidden(self):
        mode = Mode.objects.get(slug="studio")
        mode.published = False
        mode.save(update_fields=["published"])
        home = self.client.get(reverse("home"))
        self.assertNotIn(mode, list(home.context["modes"]))
        hidden = self.client.get(reverse("mode", args=["studio"]))
        self.assertEqual(hidden.status_code, 404)
        self.assertTemplateUsed(hidden, "pages/404.html")

        plan = Plan.objects.filter(published=True).first()
        plan.published = False
        plan.save(update_fields=["published"])
        pricing = self.client.get(reverse("pricing"))
        self.assertNotIn(plan, list(pricing.context["plans"]))

        faq = Faq.objects.filter(published=True).first()
        faq.published = False
        faq.save(update_fields=["published"])
        self.assertNotIn(faq, list(self.client.get(reverse("pricing")).context["faqs"]))

        guide = Guide.objects.filter(published=True).first()
        guide.published = False
        guide.save(update_fields=["published"])
        guides = self.client.get(reverse("resource_section", args=["guides"]))
        self.assertNotIn(guide, list(guides.context["guides"]))

        update = UpdateEntry.objects.filter(published=True).first()
        update.published = False
        update.save(update_fields=["published"])
        changelog = self.client.get(reverse("resource_section", args=["changelog"]))
        self.assertNotIn(update, list(changelog.context["updates"]))

        article = Article.objects.get(slug="keep-the-supply-conversation-close")
        article.published = False
        article.save(update_fields=["published"])
        missing = self.client.get(article.get_absolute_url())
        self.assertEqual(missing.status_code, 404)
        self.assertContains(missing, "isn’t on this site", status_code=404)
        blog = self.client.get(reverse("resource_section", args=["blog"]))
        self.assertNotContains(blog, article.title)

    def test_dashboard_is_a_public_entry_until_someone_signs_in(self):
        anonymous = self.client.get(reverse("dashboard"))
        self.assertEqual(anonymous.status_code, 200)
        self.assertContains(anonymous, "Sign in")
        self.assertNotContains(anonymous, "Signed in as")
        self.assertContains(anonymous, "noindex")

        user = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            first_name="Ada Lovelace",
            company="Analytical Engines",
            is_active=True,
            status=User.Status.ACTIVE,
        )
        self.client.force_login(user)
        signed_in = self.client.get(reverse("dashboard"))
        self.assertContains(signed_in, "Signed in as")
        self.assertContains(signed_in, "Ada Lovelace")
        self.assertContains(signed_in, user.get_status_display())


class LegacyRedirectTests(TestCase):
    def test_every_exact_legacy_url_is_a_permanent_redirect(self):
        self.assertGreater(len(EXACT), 100)
        for source, target in EXACT.items():
            with self.subTest(source=source):
                response = self.client.get("/" + source)
                self.assertRedirects(
                    response,
                    target,
                    status_code=301,
                    fetch_redirect_response=False,
                )

    def test_pattern_and_marketing_redirects(self):
        for source, target in PATTERN_REDIRECTS:
            with self.subTest(source=source):
                response = self.client.get(source)
                self.assertRedirects(
                    response,
                    target,
                    status_code=301,
                    fetch_redirect_response=False,
                )

    def test_query_string_is_kept_on_permanent_redirects(self):
        response = self.client.get("/signup/?plan=pro")
        self.assertRedirects(
            response,
            "/join/?plan=pro",
            status_code=301,
            fetch_redirect_response=False,
        )
        nested = self.client.get("/blog/some-note/?utm=1")
        self.assertRedirects(
            nested,
            "/resources/blog/?utm=1",
            status_code=301,
            fetch_redirect_response=False,
        )

    def test_company_redirect_keeps_the_query_string(self):
        """Bug: /companies/<slug>/ drops the query string.

        config/redirects.py Permanent sets query_string = True, and the exact
        map keeps ?plan=pro. content/views.py company_redirect (lines 257-260)
        calls redirect() without the query. Expected: 301 to /fleet/?plan=pro.
        Actual: 301 to /fleet/.
        """
        company = self.client.get("/companies/fleet/?plan=pro")
        self.assertRedirects(
            company,
            "/fleet/?plan=pro",
            status_code=301,
            fetch_redirect_response=False,
        )

    def test_slashless_legacy_url_gains_a_slash_first(self):
        response = self.client.get("/signup")
        self.assertRedirects(response, "/signup/", status_code=301, fetch_redirect_response=False)


class NotFoundAndMachineTests(TestCase):
    def test_unknown_urls_and_missing_objects_use_the_custom_404(self):
        cases = [
            "/this-page-does-not-exist/",
            "/not-a-mode/",
            "/resources/not-a-section/",
            "/resources/blog/not-a-note/",
            "/nope.html",
        ]
        for path in cases:
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 404)
                self.assertTemplateUsed(response, "pages/404.html")
                self.assertContains(response, "isn’t on this site", status_code=404)
                self.assertContains(response, "noindex", status_code=404)

    def test_machine_endpoints_and_preview_prefix(self):
        health = self.client.get("/health/")
        self.assertEqual(health.status_code, 200)
        self.assertEqual(health.json(), {"ok": True, "service": "django"})
        self.assertEqual(health["X-Content-Type-Options"], "nosniff")
        self.assertEqual(health["Referrer-Policy"], "strict-origin-when-cross-origin")
        self.assertIn("camera=()", health["Permissions-Policy"])
        self.assertEqual(self.client.post("/health/").status_code, 405)
        self.assertEqual(self.client.post("/robots.txt").status_code, 405)
        self.assertEqual(self.client.post("/sitemap.xml").status_code, 405)

        for path in ("/manifest.webmanifest", "/manifest.json"):
            manifest = self.client.get(path)
            self.assertEqual(manifest.status_code, 200, path)
            body = manifest.json()
            self.assertEqual(body["short_name"], "D&J Stratagem")
            self.assertEqual(body["start_url"], "/")
            self.assertEqual(self.client.post(path).status_code, 405)

        robots = self.client.get("/robots.txt")
        self.assertEqual(robots["Content-Type"].split(";")[0], "text/plain")
        self.assertContains(robots, "Disallow: /admin/")
        self.assertContains(robots, "Disallow: /dashboard")

        sitemap = self.client.get("/sitemap.xml")
        self.assertEqual(sitemap["Content-Type"].split(";")[0], "application/xml")
        self.assertContains(sitemap, "https://djstratageminc.com/projects/")
        self.assertContains(sitemap, "/resources/blog/a-better-view-of-the-next-job/")

        preview = self.client.get("/djs-preview/pricing/")
        self.assertEqual(preview.status_code, 200)
        self.assertContains(preview, "Start free.")
        root = self.client.get("/djs-preview")
        self.assertEqual(root.status_code, 200)
        self.assertContains(root, "Find the work.")

    def test_unpublished_mode_and_article_leave_the_sitemap(self):
        mode = Mode.objects.get(slug="fleet")
        mode.published = False
        mode.save(update_fields=["published"])
        article = Article.objects.get(slug="one-job-one-shared-context")
        article.published = False
        article.save(update_fields=["published"])
        section = ResourceSection.objects.get(slug="guides")
        section.published = False
        section.save(update_fields=["published"])
        sitemap = self.client.get("/sitemap.xml")
        self.assertNotContains(sitemap, "/fleet/")
        self.assertNotContains(sitemap, article.get_absolute_url())
        self.assertNotContains(sitemap, section.get_absolute_url())
        self.assertContains(sitemap, "/projects/")

    def test_legacy_files_are_served_and_missing_ones_404(self):
        html = self.client.get("/fleet-cards.html")
        self.assertEqual(html.status_code, 200)
        self.assertIn("text/html", html["Content-Type"])
        self.assertContains(html, "Fleet")
        script = self.client.get("/support.js")
        self.assertEqual(script.status_code, 200)
        self.assertIn("javascript", script["Content-Type"])
        self.assertEqual(self.client.get("/doc-page.js").status_code, 200)
        self.assertEqual(self.client.get("/signage.html").status_code, 200)
        self.assertEqual(self.client.get("/receipts.html").status_code, 200)

        from django.http import Http404

        request = RequestFactory().get("/support.js")
        with self.assertRaises(Http404):
            legacy_file(request, "missing.html")
        with mock.patch("content.views.Path.is_file", return_value=False):
            with self.assertRaises(Http404):
                legacy_file(request, "support.js")


class ContentModelTests(TestCase):
    def test_string_labels_and_helpers(self):
        mode = Mode.objects.get(slug="projects")
        self.assertEqual(str(mode), mode.name)
        self.assertEqual(str(mode.capabilities.first()), mode.capabilities.first().text)
        step = PipelineStep.objects.get(number="01")
        self.assertEqual(str(step), "Find the work")
        self.assertEqual(step.mode_names(), ["Projects", "Exchange"])
        self.assertEqual(PipelineStep(modes_label=" , , ").mode_names(), [])
        faq = Faq.objects.first()
        self.assertEqual(str(faq), faq.question)
        plan = Plan.objects.first()
        self.assertEqual(str(plan), plan.name)
        self.assertEqual(str(plan.features.first()), plan.features.first().text)
        principle = Principle.objects.first()
        self.assertEqual(str(principle), principle.title)
        section = ResourceSection.objects.get(slug="blog")
        self.assertEqual(str(section), section.title)
        article = Article.objects.first()
        self.assertEqual(str(article), article.title)
        self.assertTrue(article.paragraphs())
        update = UpdateEntry.objects.first()
        self.assertEqual(str(update), update.title)
        guide = Guide.objects.first()
        self.assertEqual(str(guide), guide.title)
        self.assertTrue(guide.tag_list())
        self.assertEqual(Guide(tags=" , , ").tag_list(), [])
        photo = GalleryImage.objects.first()
        self.assertEqual(str(photo), photo.alt)

    def test_article_back_link_follows_its_section(self):
        """Bug: every article links back to the blog.

        templates/pages/article.html line 6 hardcodes resource_section 'blog'
        and the label "All field notes". An article whose section is changelog
        still renders that blog link. Expected: the back link href is the
        article's own section (/resources/changelog/). Actual: href is
        /resources/blog/.
        """
        section = ResourceSection.objects.get(slug="changelog")
        article = Article.objects.create(
            section=section,
            slug="a-note-outside-the-blog",
            title="A note outside the blog",
            summary="Summary of the note.",
            intro="Intro of the note.",
            body="One paragraph.\n\nAnother paragraph.",
            published=True,
        )
        response = self.client.get(article.get_absolute_url())
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Another paragraph.")
        self.assertContains(response, f'href="{section.get_absolute_url()}">All field notes')

    def test_unpublished_section_removes_article_urls_and_sitemap_entries(self):
        """Bug: unpublishing a section leaves its articles on the site.

        content/views.py article() (line 133) filters published=True on the
        article only, and sitemap() (lines 209-211) does the same. The section
        page 404s, but the article URL stays 200 and the sitemap still lists it.
        Expected: 404 and no sitemap entry. Actual: 200 and the URL is listed.
        """
        article = Article.objects.get(slug="a-better-view-of-the-next-job")
        article.section.published = False
        article.section.save(update_fields=["published"])
        self.assertEqual(self.client.get(article.section.get_absolute_url()).status_code, 404)
        self.assertEqual(self.client.get(article.get_absolute_url()).status_code, 404)
        self.assertNotContains(self.client.get("/sitemap.xml"), article.get_absolute_url())


class BootstrapAndContextTests(TestCase):
    def test_bootstrap_skips_a_database_that_already_has_modes(self):
        before = Mode.objects.count()
        load(apps)
        self.assertEqual(Mode.objects.count(), before)

    def test_bootstrap_skips_a_photo_that_is_not_on_disk(self):
        Article.objects.all().delete()
        Mode.objects.all().delete()
        Plan.objects.all().delete()
        ResourceSection.objects.all().delete()
        for model in (GalleryImage, Guide, UpdateEntry, Faq, Principle, PipelineStep):
            model.objects.all().delete()
        with mock.patch("content.bootstrap.Path.is_file", return_value=False):
            load(apps)
        self.assertEqual(Mode.objects.count(), 9)
        self.assertEqual(GalleryImage.objects.count(), 0)

    def test_navigation_is_empty_when_content_tables_cannot_be_read(self):
        request = RequestFactory().get("/")
        with mock.patch("content.context.Mode.objects.filter", side_effect=OperationalError("down")):
            from content.context import site

            context = site(request)
        self.assertEqual(context["nav_modes"], [])
        self.assertEqual(context["resource_sections"], [])
        self.assertEqual(context["site_name"], "D&J Stratagem")


class ContentAdminTests(TestCase):
    expected = {
        "accounts.user",
        "auth.group",
        "inquiries.inquiry",
        "content.mode",
        "content.pipelinestep",
        "content.faq",
        "content.plan",
        "content.principle",
        "content.resourcesection",
        "content.article",
        "content.updateentry",
        "content.guide",
        "content.galleryimage",
    }

    def setUp(self):
        self.staff = User.objects.create_superuser(email="owner@example.com", password=PASSWORD)
        Group.objects.create(name="Estimators")
        Inquiry.objects.create(
            name="Ada Lovelace",
            company="Analytical Engines",
            email="ada@example.com",
            role="General contractor",
            topic="Partnership",
        )

    def test_registered_models_match_the_editable_site(self):
        registered = {f"{model._meta.app_label}.{model._meta.model_name}" for model in admin.site._registry}
        self.assertEqual(registered, self.expected)

    def test_superuser_can_open_changelist_add_and_change_for_every_model(self):
        self.client.force_login(self.staff)
        index = self.client.get(reverse("admin:index"))
        self.assertEqual(index.status_code, 200)
        self.assertContains(index, "D&amp;J Stratagem")
        for model in admin.site._registry:
            label = f"{model._meta.app_label}.{model._meta.model_name}"
            obj = model.objects.order_by("pk").first()
            self.assertIsNotNone(obj, label)
            app = model._meta.app_label
            name = model._meta.model_name
            with self.subTest(model=label):
                changelist = self.client.get(reverse(f"admin:{app}_{name}_changelist"))
                self.assertEqual(changelist.status_code, 200, label)
                add = self.client.get(reverse(f"admin:{app}_{name}_add"))
                change = self.client.get(reverse(f"admin:{app}_{name}_change", args=[obj.pk]))
                if label == "inquiries.inquiry":
                    self.assertEqual(add.status_code, 403, label)
                    self.assertEqual(change.status_code, 403, label)
                    continue
                self.assertEqual(add.status_code, 200, label)
                self.assertEqual(change.status_code, 200, label)
                missing = self.client.get(reverse(f"admin:{app}_{name}_change", args=[999999]))
                self.assertRedirects(missing, reverse("admin:index"))
                followed = self.client.get(
                    reverse(f"admin:{app}_{name}_change", args=[999999]),
                    follow=True,
                )
                self.assertContains(followed, "doesn’t exist")

        mode = Mode.objects.get(slug="projects")
        mode_change = self.client.get(reverse("admin:content_mode_change", args=[mode.pk]))
        self.assertContains(mode_change, mode.capabilities.first().text)
        plan = Plan.objects.first()
        plan_change = self.client.get(reverse("admin:content_plan_change", args=[plan.pk]))
        self.assertContains(plan_change, plan.features.first().text)

    def test_anonymous_and_non_staff_are_blocked_from_every_changelist(self):
        for model in admin.site._registry:
            url = reverse(f"admin:{model._meta.app_label}_{model._meta.model_name}_changelist")
            with self.subTest(url=url):
                anonymous = self.client.get(url)
                self.assertEqual(anonymous.status_code, 302)
                self.assertIn("/admin/login/", anonymous.url)

        member = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            is_active=True,
            status=User.Status.ACTIVE,
        )
        self.client.force_login(member)
        for model in admin.site._registry:
            url = reverse(f"admin:{model._meta.app_label}_{model._meta.model_name}_changelist")
            with self.subTest(user="member", url=url):
                response = self.client.get(url)
                self.assertEqual(response.status_code, 302)
                self.assertIn("/admin/login/", response.url)


class ProductionSettingsTests(SimpleTestCase):
    def setUp(self):
        self._env = os.environ.copy()

    def tearDown(self):
        os.environ.clear()
        os.environ.update(self._env)
        importlib.reload(importlib.import_module("config.settings.base"))

    def _reload_prod(self, **env):
        for key, value in env.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value
        base = importlib.reload(importlib.import_module("config.settings.base"))
        prod = importlib.reload(importlib.import_module("config.settings.prod"))
        return base, prod

    def test_production_rejects_a_weak_secret_or_an_empty_host_list(self):
        with self.assertRaises(ImproperlyConfigured):
            self._reload_prod(DJANGO_SECRET_KEY="short", DJANGO_ALLOWED_HOSTS="djstratageminc.com")
        with self.assertRaises(ImproperlyConfigured):
            self._reload_prod(
                DJANGO_SECRET_KEY="dev-only-not-for-production-but-long-enough",
                DJANGO_ALLOWED_HOSTS="djstratageminc.com",
            )
        with self.assertRaises(ImproperlyConfigured):
            self._reload_prod(
                DJANGO_SECRET_KEY="ci-only-deploy-check-0123456789abcdefABCDEF-not-a-secret",
                DJANGO_ALLOWED_HOSTS="",
            )

    def test_production_sqlite_smtp_and_proxy_flags(self):
        secret = "ci-only-deploy-check-0123456789abcdefABCDEF-not-a-secret"
        base, prod = self._reload_prod(
            DJANGO_SECRET_KEY=secret,
            DJANGO_ALLOWED_HOSTS="djstratageminc.com,www.djstratageminc.com",
            DATABASE_URL=None,
            EMAIL_BACKEND=None,
            EMAIL_HOST="smtp.example.com",
            DJANGO_BEHIND_PROXY="yes",
            DJANGO_SECURE_SSL="1",
        )
        self.assertFalse(prod.DEBUG)
        self.assertEqual(prod.ALLOWED_HOSTS, ["djstratageminc.com", "www.djstratageminc.com"])
        self.assertEqual(prod.DATABASES["default"]["ENGINE"], "django.db.backends.sqlite3")
        self.assertEqual(prod.EMAIL_BACKEND, "django.core.mail.backends.smtp.EmailBackend")
        self.assertEqual(base.SECURE_PROXY_SSL_HEADER, ("HTTP_X_FORWARDED_PROTO", "https"))
        self.assertTrue(base.SECURE_SSL_REDIRECT)
        self.assertEqual(base.SECURE_HSTS_SECONDS, 31_536_000)

        _base, with_url = self._reload_prod(
            DJANGO_SECRET_KEY=secret,
            DJANGO_ALLOWED_HOSTS="djstratageminc.com",
            DATABASE_URL="postgres://user:pass@db.example.com:5432/djs",
            EMAIL_BACKEND=None,
            EMAIL_HOST=None,
            DJANGO_BEHIND_PROXY="off",
            DJANGO_SECURE_SSL="off",
        )
        self.assertEqual(with_url.DATABASES["default"]["ENGINE"], "django.db.backends.postgresql")
        self.assertEqual(with_url.DATABASES["default"]["NAME"], "djs")
        self.assertEqual(with_url.EMAIL_BACKEND, "django.core.mail.backends.console.EmailBackend")
