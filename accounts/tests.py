from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse

from accounts.models import User


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class AccountFlowTests(TestCase):
    def test_join_creates_inactive_pending_account(self):
        response = self.client.post(
            reverse("join"),
            {
                "full_name": "Ada Lovelace",
                "company": "Analytical Engines",
                "email": "Ada@Example.com",
                "phone": "(213) 555-0100",
                "password": "correct-horse-battery",
                "confirm": "correct-horse-battery",
            },
        )
        self.assertRedirects(response, reverse("join"), fetch_redirect_response=False)
        user = User.objects.get(email="ada@example.com")
        self.assertFalse(user.is_active)
        self.assertEqual(user.status, User.Status.PENDING)
        self.assertEqual(user.company, "Analytical Engines")
        follow = self.client.get(reverse("join"))
        self.assertContains(follow, "Request received")

    def test_duplicate_join_does_not_reveal_the_account(self):
        User.objects.create_user(email="ada@example.com", password="correct-horse-battery", is_active=True)
        response = self.client.post(
            reverse("join"),
            {
                "full_name": "Ada Lovelace",
                "company": "Analytical Engines",
                "email": "ada@example.com",
                "phone": "",
                "password": "another-long-password",
                "confirm": "another-long-password",
            },
        )
        self.assertRedirects(response, reverse("join"))
        self.assertEqual(User.objects.filter(email="ada@example.com").count(), 1)

    def test_pending_account_cannot_sign_in(self):
        User.objects.create_user(
            email="ada@example.com",
            password="correct-horse-battery",
            is_active=False,
            status=User.Status.PENDING,
        )
        response = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": "correct-horse-battery"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "don’t match an active account")

    def test_active_account_reaches_the_dashboard(self):
        User.objects.create_user(
            email="ada@example.com",
            password="correct-horse-battery",
            first_name="Ada Lovelace",
            company="Analytical Engines",
            is_active=True,
            status=User.Status.ACTIVE,
        )
        response = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": "correct-horse-battery"},
        )
        self.assertRedirects(response, reverse("dashboard"))
        page = self.client.get(reverse("dashboard"))
        self.assertContains(page, "Ada Lovelace")
        self.assertContains(page, "Analytical Engines")

    def test_password_reset_does_not_enumerate(self):
        missing = self.client.post(reverse("password_reset"), {"email": "missing@example.com"})
        self.assertRedirects(missing, reverse("password_reset_done"))
        self.assertEqual(len(mail.outbox), 0)

        User.objects.create_user(
            email="ada@example.com",
            password="correct-horse-battery",
            is_active=True,
            status=User.Status.ACTIVE,
        )
        found = self.client.post(reverse("password_reset"), {"email": "ada@example.com"})
        self.assertRedirects(found, reverse("password_reset_done"))
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("ada@example.com", mail.outbox[0].to)
        done = self.client.get(reverse("password_reset_done"))
        self.assertContains(done, "If an approved account uses that email")

    def test_short_password_is_rejected(self):
        response = self.client.post(
            reverse("join"),
            {
                "full_name": "Ada Lovelace",
                "company": "Analytical Engines",
                "email": "ada@example.com",
                "phone": "",
                "password": "short",
                "confirm": "short",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.exists())

    def test_admin_approve_activates_account(self):
        staff = User.objects.create_superuser(email="owner@example.com", password="correct-horse-battery")
        member = User.objects.create_user(
            email="ada@example.com",
            password="correct-horse-battery",
            is_active=False,
            status=User.Status.PENDING,
        )
        self.client.force_login(staff)
        response = self.client.post(
            reverse("admin:accounts_user_changelist"),
            {"action": "approve_accounts", "_selected_action": [str(member.pk)]},
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        member.refresh_from_db()
        self.assertTrue(member.is_active)
        self.assertEqual(member.status, User.Status.ACTIVE)
