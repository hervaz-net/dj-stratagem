from django.test import TestCase
from django.urls import reverse

from accounts.models import User
from content.models import Mode


class PublicPageTests(TestCase):
    def test_primary_pages_render_real_copy(self):
        pages = [
            ("home", "Find the work."),
            ("pricing", "Start free."),
            ("about", "Built around the people"),
            ("contact", "Let’s talk"),
            ("resources", "Field notes"),
            ("privacy", "506 S Spring St"),
            ("terms", "506 S Spring St"),
            ("dashboard", "workspace is being prepared"),
        ]
        for name, copy in pages:
            response = self.client.get(reverse(name))
            self.assertEqual(response.status_code, 200, name)
            self.assertContains(response, copy)
            self.assertContains(response, "Stratagem")

    def test_every_mode_and_resource_route(self):
        for slug in Mode.objects.values_list("slug", flat=True):
            response = self.client.get(reverse("mode", args=[slug]))
            self.assertEqual(response.status_code, 200, slug)
            self.assertContains(response, "Join free")
        for section in ("blog", "changelog", "guides"):
            self.assertEqual(self.client.get(reverse("resource_section", args=[section])).status_code, 200)
        for slug in (
            "a-better-view-of-the-next-job",
            "keep-the-supply-conversation-close",
            "one-job-one-shared-context",
        ):
            self.assertEqual(self.client.get(reverse("article", args=[slug])).status_code, 200)

    def test_auth_pages_are_noindex(self):
        for name in ("login", "join", "password_reset", "reset_missing"):
            response = self.client.get(reverse(name))
            self.assertEqual(response.status_code, 200, name)
            self.assertContains(response, "noindex")

    def test_legacy_redirects(self):
        cases = {
            "/blog/": "/resources/blog/",
            "/changelog/": "/resources/changelog/",
            "/signup/": "/join/",
            "/register/": "/join/",
            "/signin/": "/login/",
            "/services/": "/platform/",
            "/contact-us/": "/contact/",
            "/privacy-policy/": "/privacy/",
            "/companies/": "/",
            "/marketplace/": "/exchange/",
            "/help/": "/resources/guides/",
            "/projects/example-job/": "/projects/",
            "/companies/fleet/": "/fleet/",
            "/credit/": "/capital/",
        }
        for source, target in cases.items():
            response = self.client.get(source)
            self.assertRedirects(response, target, status_code=301, fetch_redirect_response=False)

    def test_preview_prefix_reaches_health(self):
        response = self.client.get("/djs-preview/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["service"], "django")

    def test_health_sitemap_and_robots(self):
        health = self.client.get("/health/")
        self.assertEqual(health.json()["ok"], True)
        self.assertEqual(self.client.get("/health.php").json()["ok"], True)
        sitemap = self.client.get("/sitemap.xml")
        self.assertContains(sitemap, "https://djstratageminc.com/projects/")
        robots = self.client.get("/robots.txt")
        self.assertContains(robots, "Disallow: /admin/")
        self.assertContains(robots, "Sitemap:")

    def test_unknown_mode_is_404(self):
        response = self.client.get("/not-a-mode/")
        self.assertEqual(response.status_code, 404)
        self.assertContains(response, "isn’t on this site", status_code=404)

    def test_published_mode_edit_shows_on_the_page(self):
        mode = Mode.objects.get(slug="projects")
        mode.headline = "A pipeline you can actually see."
        mode.save(update_fields=["headline"])
        response = self.client.get(reverse("mode", args=["projects"]))
        self.assertContains(response, "A pipeline you can actually see.")

    def test_staff_can_open_the_content_admin(self):
        staff = User.objects.create_superuser(email="owner@example.com", password="correct-horse-battery")
        self.client.force_login(staff)
        response = self.client.get(reverse("admin:content_mode_changelist"))
        self.assertContains(response, "Projects")
        self.assertContains(response, "Studio")

    def test_jobsite_photos_are_on_the_homepage(self):
        response = self.client.get(reverse("home"))
        self.assertContains(response, "conduit laid out")
        self.assertContains(response, "/media/gallery/")
        self.assertContains(response, 'loading="lazy"')
        self.assertContains(response, 'fetchpriority="high"')

    def test_public_pages_have_document_metadata(self):
        home = self.client.get(reverse("home"))
        self.assertContains(home, 'rel="canonical" href="https://djstratageminc.com/"')
        self.assertContains(home, 'name="twitter:card" content="summary_large_image"')
        self.assertContains(home, 'property="og:image"')
        self.assertContains(home, "application/ld+json")
        self.assertContains(home, "D&J Stratagem, Inc.")
        self.assertNotContains(home, "D&amp;amp;J")
        self.assertContains(home, 'href="#main"')
        self.assertContains(home, "Skip to content")
        pricing = self.client.get(reverse("pricing"))
        self.assertContains(pricing, "Explore Professional, Growth, and Enterprise")
        self.assertContains(pricing, "FAQPage")
        article = self.client.get(reverse("article", args=["a-better-view-of-the-next-job"]))
        self.assertContains(article, 'property="og:type" content="article"')
        self.assertContains(article, "BlogPosting")
        missing = self.client.get("/not-a-page/")
        self.assertContains(missing, 'rel="canonical" href="https://djstratageminc.com/"', status_code=404)
        self.assertContains(missing, "noindex", status_code=404)

    def test_sign_in_has_its_own_title_and_description(self):
        response = self.client.get(reverse("login"))
        self.assertContains(response, "<title>Sign in | D&amp;J Stratagem</title>")
        self.assertContains(response, "Sign in to the D&J Stratagem desk")

    def test_mobile_nav_includes_resources(self):
        response = self.client.get(reverse("home"))
        self.assertContains(response, 'aria-label="Mobile"')
        self.assertContains(response, "Field notes")
        self.assertContains(response, 'aria-controls="mobile-nav"')
