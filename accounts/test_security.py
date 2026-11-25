import os
import subprocess
import sys
from pathlib import Path
from unittest.mock import patch
from urllib.parse import urlsplit

from django.core.exceptions import ImproperlyConfigured
from django.db import IntegrityError, transaction
from django.test import RequestFactory, SimpleTestCase, TestCase, override_settings
from django.urls import reverse

from accounts.models import AuthAttempt, User
from accounts.net import client_ip
from accounts.throttle import LOGIN_LIMIT_MESSAGE
from accounts.views import approve_user, suspend_user
from config.settings.base import env_int

ROOT = Path(__file__).resolve().parents[1]
PASSWORD = "correct-horse-battery"


def join_payload(**overrides):
    data = {
        "full_name": "Ada Lovelace",
        "company": "Analytical Engines",
        "email": "new-member@example.com",
        "phone": "",
        "password": PASSWORD,
        "confirm": PASSWORD,
    }
    data.update(overrides)
    return data


class ClientIpTests(SimpleTestCase):
    def test_forwarded_header_is_ignored_unless_a_proxy_is_configured(self):
        request = RequestFactory().get(
            "/",
            HTTP_X_FORWARDED_FOR="9.9.9.9, 2.2.2.2",
            REMOTE_ADDR="10.0.0.8",
        )
        with override_settings(DJANGO_BEHIND_PROXY=False):
            self.assertEqual(client_ip(request), "10.0.0.8")

    def test_trusted_proxy_uses_the_appended_address(self):
        request = RequestFactory().get(
            "/",
            HTTP_X_FORWARDED_FOR="9.9.9.9, not-an-ip, 2.2.2.2",
            REMOTE_ADDR="10.0.0.8",
        )
        with override_settings(DJANGO_BEHIND_PROXY=True, DJANGO_TRUSTED_PROXY_COUNT=1):
            self.assertEqual(client_ip(request), "2.2.2.2")

    def test_invalid_forwarded_address_falls_back_to_the_socket(self):
        request = RequestFactory().get(
            "/",
            HTTP_X_FORWARDED_FOR="9.9.9.9, definitely-not-an-ip",
            REMOTE_ADDR="10.0.0.8",
        )
        with override_settings(DJANGO_BEHIND_PROXY=True, DJANGO_TRUSTED_PROXY_COUNT=1):
            self.assertEqual(client_ip(request), "10.0.0.8")

    def test_env_int_rejects_a_non_integer(self):
        with patch.dict(os.environ, {"LOGIN_RATE_WINDOW": "soon"}):
            with self.assertRaises(ImproperlyConfigured):
                env_int("LOGIN_RATE_WINDOW", 900)


class ProdSettingsTests(SimpleTestCase):
    def boot(self, **env):
        child = os.environ.copy()
        child["DJANGO_SETTINGS_MODULE"] = "config.settings.prod"
        child["PYTHONPATH"] = str(ROOT) + os.pathsep + child.get("PYTHONPATH", "")
        child.update(env)
        code = """
import django
django.setup()
from django.conf import settings
print("secure", int(settings.SESSION_COOKIE_SECURE), int(settings.CSRF_COOKIE_SECURE), int(settings.CSRF_COOKIE_HTTPONLY))
print("debug", int(settings.DEBUG))
print("frame", settings.X_FRAME_OPTIONS)
"""
        return subprocess.run(
            [sys.executable, "-c", code],
            cwd=ROOT,
            env=child,
            capture_output=True,
            text=True,
            timeout=60,
            check=False,
        )

    def test_production_requires_a_long_secret_and_hosts(self):
        short = self.boot(DJANGO_SECRET_KEY="short", DJANGO_ALLOWED_HOSTS="djstratageminc.com")
        self.assertNotEqual(short.returncode, 0)
        self.assertIn("DJANGO_SECRET_KEY", short.stderr)

        missing_hosts = self.boot(DJANGO_SECRET_KEY="k" * 48, DJANGO_ALLOWED_HOSTS="")
        self.assertNotEqual(missing_hosts.returncode, 0)
        self.assertIn("DJANGO_ALLOWED_HOSTS", missing_hosts.stderr)

    def test_production_rejects_tls_and_ssl_together(self):
        result = self.boot(
            DJANGO_SECRET_KEY="k" * 48,
            DJANGO_ALLOWED_HOSTS="djstratageminc.com",
            EMAIL_USE_TLS="true",
            EMAIL_USE_SSL="true",
        )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("EMAIL_USE_TLS", result.stderr)

    def test_production_sets_secure_cookies_without_the_ssl_redirect_flag(self):
        result = self.boot(
            DJANGO_SECRET_KEY="k" * 48,
            DJANGO_ALLOWED_HOSTS="djstratageminc.com",
            DJANGO_SECURE_SSL="0",
            EMAIL_USE_SSL="false",
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("secure 1 1 1", result.stdout)
        self.assertIn("debug 0", result.stdout)
        self.assertIn("frame DENY", result.stdout)

    def test_dev_settings_keep_local_cookies(self):
        from django.conf import settings

        self.assertFalse(settings.SESSION_COOKIE_SECURE)
        self.assertTrue(settings.CSRF_COOKIE_HTTPONLY)
        self.assertEqual(settings.X_FRAME_OPTIONS, "DENY")
        self.assertIn("accounts.backends.StatusBackend", settings.AUTHENTICATION_BACKENDS)


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class MembershipSecurityTests(TestCase):
    def test_email_is_stored_lowercase_and_signs_in_either_way(self):
        User.objects.create_user(email="Ada@Example.com", password=PASSWORD, is_active=True, status=User.Status.ACTIVE)
        self.assertEqual(User.objects.get().email, "ada@example.com")
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                User.objects.create_user(email="ADA@example.com", password=PASSWORD)
        response = self.client.post(reverse("login"), {"username": "Ada@Example.com", "password": PASSWORD})
        self.assertRedirects(response, reverse("dashboard"))

    def test_login_next_cannot_leave_the_site(self):
        User.objects.create_user(email="ada@example.com", password=PASSWORD, is_active=True, status=User.Status.ACTIVE)
        response = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": PASSWORD, "next": "https://evil.example/phish"},
        )
        self.assertRedirects(response, reverse("dashboard"))

    def test_suspended_account_cannot_sign_in_or_keep_a_session(self):
        user = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            is_active=True,
            status=User.Status.ACTIVE,
        )
        self.client.login(username="ada@example.com", password=PASSWORD)
        self.assertContains(self.client.get(reverse("dashboard")), "Signed in as")
        suspend_user(user)
        page = self.client.get(reverse("dashboard"))
        self.assertNotContains(page, "Signed in as")
        self.assertContains(page, "Sign in")
        denied = self.client.post(reverse("login"), {"username": "ada@example.com", "password": PASSWORD})
        self.assertContains(denied, "don’t match an active account")

    def test_pending_and_suspended_cannot_be_marked_active_in_the_database(self):
        user = User.objects.create_user(email="ada@example.com", password=PASSWORD, is_active=True, status=User.Status.ACTIVE)
        with self.assertRaises(IntegrityError):
            User.objects.filter(pk=user.pk).update(status=User.Status.SUSPENDED, is_active=True)

    def test_logout_requires_post(self):
        User.objects.create_user(email="ada@example.com", password=PASSWORD, is_active=True, status=User.Status.ACTIVE)
        self.client.login(username="ada@example.com", password=PASSWORD)
        self.assertEqual(self.client.get(reverse("logout")).status_code, 405)
        response = self.client.post(reverse("logout"))
        self.assertRedirects(response, reverse("home"))

    @override_settings(LOGIN_ACCOUNT_LIMIT=2, LOGIN_IP_LIMIT=5)
    def test_sign_in_rate_limit_stops_password_guessing(self):
        User.objects.create_user(email="ada@example.com", password=PASSWORD, is_active=True, status=User.Status.ACTIVE)
        for _ in range(2):
            self.client.post(reverse("login"), {"username": "ada@example.com", "password": "wrong-password-value"})
        blocked = self.client.post(reverse("login"), {"username": "ada@example.com", "password": PASSWORD})
        self.assertContains(blocked, LOGIN_LIMIT_MESSAGE)
        self.assertNotIn("_auth_user_id", self.client.session)
        attempts = AuthAttempt.objects.filter(kind=AuthAttempt.Kind.LOGIN)
        self.assertEqual(attempts.count(), 2)
        self.assertTrue(all("ada@example.com" not in item.identifier and len(item.identifier) == 64 for item in attempts))

    @override_settings(LOGIN_IP_LIMIT=2, LOGIN_ACCOUNT_LIMIT=10)
    def test_admin_sign_in_uses_the_same_limit(self):
        User.objects.create_superuser(email="owner@example.com", password=PASSWORD)
        for _ in range(2):
            self.client.post(reverse("admin:login"), {"username": "owner@example.com", "password": "wrong-password-value"})
        blocked = self.client.post(
            reverse("admin:login"),
            {"username": "owner@example.com", "password": PASSWORD},
        )
        self.assertEqual(blocked.status_code, 429)
        self.assertContains(blocked, LOGIN_LIMIT_MESSAGE, status_code=429)

    @override_settings(SITE_URL="https://desk.example", PASSWORD_RESET_RATE_LIMIT=3)
    def test_password_reset_uses_the_site_url_and_stops_after_the_limit(self):
        from django.core import mail

        User.objects.create_user(email="ada@example.com", password=PASSWORD, is_active=True, status=User.Status.ACTIVE)
        pending = User.objects.create_user(
            email="pending@example.com",
            password=PASSWORD,
            is_active=False,
            status=User.Status.PENDING,
        )
        self.assertFalse(pending.is_active)
        quiet = self.client.post(reverse("password_reset"), {"email": "pending@example.com"})
        self.assertRedirects(quiet, reverse("password_reset_done"))
        self.assertEqual(len(mail.outbox), 0)

        for _ in range(2):
            response = self.client.post(reverse("password_reset"), {"email": "ada@example.com"})
            self.assertRedirects(response, reverse("password_reset_done"))
        self.assertEqual(len(mail.outbox), 2)
        link = mail.outbox[0].body.split("https://", 1)[1].split()[0]
        self.assertEqual(urlsplit("https://" + link).netloc, "desk.example")
        extra = self.client.post(reverse("password_reset"), {"email": "ada@example.com"})
        self.assertRedirects(extra, reverse("password_reset_done"))
        self.assertEqual(len(mail.outbox), 2)

    @override_settings(JOIN_RATE_LIMIT=1, DJANGO_BEHIND_PROXY=True)
    def test_join_rate_limit_uses_the_proxy_appended_ip(self):
        User.objects.create_user(
            email="existing@example.com",
            password=PASSWORD,
            is_active=False,
            status=User.Status.PENDING,
            signup_ip="2.2.2.2",
        )
        response = self.client.post(
            reverse("join"),
            join_payload(email="new-member@example.com"),
            HTTP_X_FORWARDED_FOR="9.9.9.9, 2.2.2.2",
            REMOTE_ADDR="10.0.0.8",
        )
        self.assertRedirects(response, reverse("join"))
        self.assertFalse(User.objects.filter(email="new-member@example.com").exists())

    def test_join_race_does_not_error(self):
        with patch.object(User.objects, "create_user", side_effect=IntegrityError):
            response = self.client.post(reverse("join"), join_payload())
        self.assertRedirects(response, reverse("join"))
        self.assertFalse(User.objects.filter(email="new-member@example.com").exists())

    def test_approval_sends_one_email_and_suspending_yourself_is_ignored(self):
        from django.core import mail

        staff = User.objects.create_superuser(email="owner@example.com", password=PASSWORD)
        member = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            is_active=False,
            status=User.Status.PENDING,
        )
        self.client.force_login(staff)
        response = self.client.post(
            reverse("admin:accounts_user_changelist"),
            {"action": "approve_accounts", "_selected_action": [str(member.pk)]},
            follow=True,
        )
        self.assertContains(response, "Approved 1 account(s).")
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["ada@example.com"])
        self.assertIn("https://djstratageminc.com/login/", mail.outbox[0].body)
        again = approve_user(member)
        self.assertEqual(again, "unchanged")
        self.assertEqual(len(mail.outbox), 1)

        skipped = self.client.post(
            reverse("admin:accounts_user_changelist"),
            {"action": "suspend_accounts", "_selected_action": [str(staff.pk)]},
            follow=True,
        )
        self.assertContains(skipped, "left unchanged")
        staff.refresh_from_db()
        self.assertTrue(staff.is_active)
        self.assertEqual(staff.status, User.Status.ACTIVE)
