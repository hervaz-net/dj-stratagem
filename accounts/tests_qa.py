"""QA coverage for accounts: forms, sign-in, join approval, password reset, admin."""

import re
from unittest import mock

from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.test import Client, TestCase, override_settings
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from accounts.forms import JoinForm, StyledSetPasswordForm
from accounts.models import User
from accounts.views import approve_user, suspend_user

PASSWORD = "correct-horse-battery"
NEW_PASSWORD = "another-correct-horse"


def join_payload(**overrides):
    data = {
        "full_name": "Ada Lovelace",
        "company": "Analytical Engines",
        "email": "ada@example.com",
        "phone": "(213) 555-0100",
        "password": PASSWORD,
        "confirm": PASSWORD,
    }
    data.update(overrides)
    return data


class JoinFormTests(TestCase):
    def test_valid_unicode_name_and_optional_phone(self):
        form = JoinForm(
            data=join_payload(
                full_name="José García",
                company="Construcción Ñoño",
                email=" jose@example.com ",
                phone="",
            )
        )
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data["email"], "jose@example.com")
        self.assertEqual(form.cleaned_data["full_name"], "José García")
        self.assertEqual(form.cleaned_data["phone"], "")

    def test_required_fields_and_blank_strings(self):
        form = JoinForm(data={})
        self.assertFalse(form.is_valid())
        for name in ("full_name", "company", "email", "password", "confirm"):
            self.assertIn(name, form.errors, name)
        self.assertNotIn("phone", form.errors)

        blank = JoinForm(data=join_payload(full_name="   ", company=" x ", email="not-an-email"))
        self.assertFalse(blank.is_valid())
        self.assertIn("full_name", blank.errors)
        self.assertIn("company", blank.errors)
        self.assertIn("email", blank.errors)

    def test_length_phone_and_password_edges(self):
        long_name = JoinForm(data=join_payload(full_name="A" * 121))
        self.assertFalse(long_name.is_valid())
        self.assertIn("full_name", long_name.errors)

        max_name = JoinForm(data=join_payload(full_name="A" * 120, company="B" * 160))
        self.assertTrue(max_name.is_valid(), max_name.errors)

        long_company = JoinForm(data=join_payload(company="B" * 161))
        self.assertIn("company", long_company.errors)

        short_phone = JoinForm(data=join_payload(phone="123456"))
        self.assertIn("phone", short_phone.errors)
        self.assertTrue(JoinForm(data=join_payload(phone="1234567")).is_valid())
        self.assertFalse(JoinForm(data=join_payload(phone="1" * 41)).is_valid())
        self.assertIn("phone", JoinForm(data=join_payload(phone="213-555-HELP")).errors)
        self.assertIn("phone", JoinForm(data=join_payload(phone="213\n5550100")).errors)

        mismatch = JoinForm(data=join_payload(confirm="different-correct-horse"))
        self.assertIn("confirm", mismatch.errors)
        self.assertIn("don’t match", mismatch.errors["confirm"][0])

        numeric = JoinForm(data=join_payload(password="123456789012", confirm="123456789012"))
        self.assertIn("password", numeric.errors)

        similar = JoinForm(
            data=join_payload(
                full_name="Ada Lovelace",
                email="ada@example.com",
                password="ada@example.com",
                confirm="ada@example.com",
            )
        )
        self.assertIn("password", similar.errors)

    def test_set_password_form_labels(self):
        user = User.objects.create_user(email="ada@example.com", password=PASSWORD, is_active=True)
        form = StyledSetPasswordForm(user=user)
        self.assertEqual(form.fields["new_password1"].label, "New password")
        self.assertEqual(form.fields["new_password2"].label, "Confirm password")
        self.assertIn("minlength", form.fields["new_password1"].widget.attrs)


class JoinViewTests(TestCase):
    def test_get_uses_template_and_authenticated_visitors_go_to_the_dashboard(self):
        page = self.client.get(reverse("join"))
        self.assertEqual(page.status_code, 200)
        self.assertTemplateUsed(page, "accounts/join.html")
        self.assertIn("form", page.context)
        self.assertFalse(page.context["received"])

        User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            is_active=True,
            status=User.Status.ACTIVE,
        )
        self.client.login(username="ada@example.com", password=PASSWORD)
        for method in ("get", "post"):
            response = getattr(self.client, method)(reverse("join"), data=join_payload())
            self.assertRedirects(response, reverse("dashboard"))

    def test_invalid_post_redisplays_and_escapes_markup(self):
        payload = join_payload(
            full_name='<script>alert(1)</script>',
            email="not-an-email",
            company="Analytical Engines",
        )
        response = self.client.post(reverse("join"), payload)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/join.html")
        self.assertFalse(User.objects.exists())
        self.assertNotContains(response, "<script>alert(1)</script>")
        self.assertContains(response, "&lt;script&gt;alert(1)&lt;/script&gt;")
        self.assertContains(response, "Enter a valid email")

    def test_unicode_join_is_stored_pending_and_the_banner_is_one_time(self):
        response = self.client.post(
            reverse("join"),
            join_payload(full_name="José García", company="Construcción Ñoño", email="Jose@Example.com"),
        )
        self.assertRedirects(response, reverse("join"), fetch_redirect_response=False)
        user = User.objects.get()
        self.assertEqual(user.email, "jose@example.com")
        self.assertEqual(user.first_name, "José García")
        self.assertEqual(user.company, "Construcción Ñoño")
        self.assertEqual(user.signup_ip, "127.0.0.1")
        self.assertFalse(user.is_active)
        first = self.client.get(reverse("join"))
        self.assertContains(first, "Request received")
        second = self.client.get(reverse("join"))
        self.assertNotContains(second, "Request received")
        self.assertContains(second, "Get your company on the desk")

    def test_spoofed_forwarded_for_is_ignored_unless_the_proxy_flag_is_on(self):
        self.client.post(
            reverse("join"),
            join_payload(email="ada@example.com"),
            HTTP_X_FORWARDED_FOR="203.0.113.9",
        )
        self.assertEqual(User.objects.get().signup_ip, "127.0.0.1")

    @override_settings(DJANGO_BEHIND_PROXY=True)
    def test_proxy_uses_the_first_forwarded_address(self):
        self.client.post(
            reverse("join"),
            join_payload(email="ada@example.com"),
            HTTP_X_FORWARDED_FOR="203.0.113.9, 10.0.0.8",
        )
        self.assertEqual(User.objects.get().signup_ip, "10.0.0.8")

    @override_settings(JOIN_RATE_LIMIT=2)
    def test_rate_limit_still_acknowledges_without_creating_another_account(self):
        for index in range(2):
            User.objects.create_user(
                email=f"existing-{index}@example.com",
                password=PASSWORD,
                signup_ip="127.0.0.1",
                is_active=False,
                status=User.Status.PENDING,
            )
        response = self.client.post(reverse("join"), join_payload(email="ada@example.com"))
        self.assertRedirects(response, reverse("join"), fetch_redirect_response=False)
        self.assertFalse(User.objects.filter(email="ada@example.com").exists())
        self.assertContains(self.client.get(reverse("join")), "Request received")

    def test_post_without_csrf_is_rejected(self):
        client = Client(enforce_csrf_checks=True)
        response = client.post(reverse("join"), join_payload())
        self.assertEqual(response.status_code, 403)
        self.assertFalse(User.objects.exists())


class SignInAndLogoutTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            first_name="Ada Lovelace",
            company="Analytical Engines",
            is_active=True,
            status=User.Status.ACTIVE,
        )

    def test_login_page_contract(self):
        response = self.client.get(reverse("login"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/login.html")
        self.assertIn("form", response.context)
        self.assertContains(response, "Work email")

    def test_empty_and_wrong_password_stay_on_the_form(self):
        empty = self.client.post(reverse("login"), {})
        self.assertEqual(empty.status_code, 200)
        self.assertTemplateUsed(empty, "accounts/login.html")
        self.assertFalse(empty.context["user"].is_authenticated)

        wrong = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": "not-the-password"},
        )
        self.assertEqual(wrong.status_code, 200)
        self.assertContains(wrong, "don’t match an active account")

    def test_safe_next_is_honored_and_external_next_is_dropped(self):
        safe = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": PASSWORD, "next": "/pricing/"},
        )
        self.assertRedirects(safe, "/pricing/")
        self.client.logout()

        external = self.client.post(
            reverse("login") + "?next=https://evil.example/phish",
            {"username": "ada@example.com", "password": PASSWORD},
        )
        self.assertRedirects(external, reverse("dashboard"))

    def test_mixed_case_email_can_sign_in(self):
        response = self.client.post(
            reverse("login"),
            {"username": "Ada@Example.com", "password": PASSWORD},
        )
        self.assertRedirects(response, reverse("dashboard"))

    def test_authenticated_visitor_is_sent_onward(self):
        self.client.login(username="ada@example.com", password=PASSWORD)
        home = self.client.get(reverse("login"))
        self.assertRedirects(home, reverse("dashboard"))
        pricing = self.client.get(reverse("login") + "?next=/pricing/")
        self.assertRedirects(pricing, "/pricing/")
        evil = self.client.get(reverse("login") + "?next=https://evil.example/phish")
        self.assertRedirects(evil, reverse("dashboard"))

    def test_logout_post_clears_the_session_and_get_is_rejected(self):
        self.client.login(username="ada@example.com", password=PASSWORD)
        rejected = self.client.get(reverse("logout"))
        self.assertEqual(rejected.status_code, 405)
        self.assertTrue(self.client.session.get("_auth_user_id"))

        response = self.client.post(reverse("logout"))
        self.assertRedirects(response, reverse("home"))
        page = self.client.get(reverse("dashboard"))
        self.assertNotContains(page, "Signed in as")
        self.assertContains(page, "Sign in")

    def test_suspended_session_loses_member_access(self):
        self.client.login(username="ada@example.com", password=PASSWORD)
        suspend_user(self.user)
        page = self.client.get(reverse("dashboard"))
        self.assertNotContains(page, "Signed in as")
        admin = self.client.get(reverse("admin:index"))
        self.assertEqual(admin.status_code, 302)
        self.assertIn("/admin/login/", admin.url)


class ApprovalFlowTests(TestCase):
    def test_pending_user_cannot_reach_member_areas_until_approved(self):
        joined = self.client.post(reverse("join"), join_payload())
        self.assertRedirects(joined, reverse("join"), fetch_redirect_response=False)
        user = User.objects.get(email="ada@example.com")

        denied = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": PASSWORD},
        )
        self.assertEqual(denied.status_code, 200)
        self.assertContains(denied, "don’t match an active account")
        desk = self.client.get(reverse("dashboard"))
        self.assertNotContains(desk, "Signed in as")
        self.assertNotContains(desk, "Ada Lovelace")

        self.client.force_login(user)
        still_out = self.client.get(reverse("dashboard"))
        self.assertNotContains(still_out, "Signed in as")
        blocked = self.client.get(reverse("admin:index"))
        self.assertNotEqual(blocked.status_code, 200)

        approve_user(user)
        user.refresh_from_db()
        self.assertTrue(user.is_active)
        self.assertEqual(user.status, User.Status.ACTIVE)
        signed_in = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": PASSWORD},
        )
        self.assertRedirects(signed_in, reverse("dashboard"))
        page = self.client.get(reverse("dashboard"))
        self.assertContains(page, "Signed in as")
        self.assertContains(page, "Ada Lovelace")
        self.assertContains(page, "Analytical Engines")
        self.assertContains(page, "Active")

    def test_admin_suspend_is_the_denial_path_and_skips_the_acting_staff_user(self):
        staff = User.objects.create_superuser(email="owner@example.com", password=PASSWORD)
        pending = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            first_name="Ada Lovelace",
            is_active=False,
            status=User.Status.PENDING,
        )
        self.client.force_login(staff)
        response = self.client.post(
            reverse("admin:accounts_user_changelist"),
            {"action": "suspend_accounts", "_selected_action": [str(staff.pk), str(pending.pk)]},
            follow=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "left unchanged")
        self.assertContains(response, "Suspended 1 account")
        staff.refresh_from_db()
        pending.refresh_from_db()
        self.assertTrue(staff.is_active)
        self.assertEqual(staff.status, User.Status.ACTIVE)
        self.assertFalse(pending.is_active)
        self.assertEqual(pending.status, User.Status.SUSPENDED)

        self.client.logout()
        denied = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": PASSWORD},
        )
        self.assertContains(denied, "don’t match an active account")
        self.assertNotContains(self.client.get(reverse("dashboard")), "Signed in as")


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class PasswordResetFlowTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            is_active=True,
            status=User.Status.ACTIVE,
        )

    def test_pages_templates_and_bad_email_shape(self):
        form = self.client.get(reverse("password_reset"))
        self.assertEqual(form.status_code, 200)
        self.assertTemplateUsed(form, "accounts/forgot.html")
        self.assertContains(form, "Work email")

        invalid = self.client.post(reverse("password_reset"), {"email": "not-an-email"})
        self.assertEqual(invalid.status_code, 200)
        self.assertContains(invalid, "Enter a valid email")

        missing = self.client.get(reverse("reset_missing"))
        self.assertTemplateUsed(missing, "accounts/reset_missing.html")
        self.assertContains(missing, "Use the link in your email")

        done = self.client.get(reverse("password_reset_done"))
        self.assertTemplateUsed(done, "accounts/forgot_done.html")
        complete = self.client.get(reverse("password_reset_complete"))
        self.assertTemplateUsed(complete, "accounts/reset_done.html")
        self.assertContains(complete, "password has been updated")

    def test_inactive_accounts_do_not_receive_mail(self):
        self.user.is_active = False
        self.user.status = User.Status.PENDING
        self.user.save(update_fields=["is_active", "status"])
        response = self.client.post(reverse("password_reset"), {"email": "ada@example.com"})
        self.assertRedirects(response, reverse("password_reset_done"))
        from django.core import mail

        self.assertEqual(len(mail.outbox), 0)

    def test_reset_link_sets_a_new_password_and_then_expires(self):
        from django.core import mail

        requested = self.client.post(reverse("password_reset"), {"email": "Ada@Example.com"})
        self.assertRedirects(requested, reverse("password_reset_done"))
        self.assertEqual(len(mail.outbox), 1)
        match = re.search(r"https?://[^/\s]+(/reset-password/\S+)", mail.outbox[0].body)
        self.assertIsNotNone(match)
        url = match.group(1)

        # Django stashes the token and redirects to .../set-password/ so the
        # mail client does not leak it in Referer.
        form = self.client.get(url, follow=True)
        self.assertEqual(form.status_code, 200)
        self.assertTemplateUsed(form, "accounts/reset.html")
        self.assertContains(form, "Choose a new password")
        set_url = form.request["PATH_INFO"]
        self.assertIn("/set-password/", set_url)

        mismatch = self.client.post(
            set_url,
            {"new_password1": NEW_PASSWORD, "new_password2": "not-the-same-horse"},
        )
        self.assertEqual(mismatch.status_code, 200)
        self.assertContains(mismatch, "didn’t match")

        short = self.client.post(set_url, {"new_password1": "short", "new_password2": "short"})
        self.assertEqual(short.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(PASSWORD))

        updated = self.client.post(
            set_url,
            {"new_password1": NEW_PASSWORD, "new_password2": NEW_PASSWORD},
        )
        self.assertRedirects(updated, reverse("password_reset_complete"))
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(NEW_PASSWORD))
        self.assertFalse(self.user.check_password(PASSWORD))

        expired = self.client.get(url, follow=True)
        self.assertContains(expired, "That link has expired")
        old = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": PASSWORD},
        )
        self.assertEqual(old.status_code, 200)
        new = self.client.post(
            reverse("login"),
            {"username": "ada@example.com", "password": NEW_PASSWORD},
        )
        self.assertRedirects(new, reverse("dashboard"))

    def test_bad_token_renders_the_expired_state(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.get(reverse("password_reset_confirm", args=[uid, "bad-token"]))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "accounts/reset.html")
        self.assertContains(response, "That link has expired")
        self.assertFalse(default_token_generator.check_token(self.user, "bad-token"))

    def test_mail_failure_still_acknowledges_the_request(self):
        with mock.patch(
            "django.contrib.auth.forms.PasswordResetForm.send_mail",
            side_effect=OSError("smtp down"),
        ):
            response = self.client.post(reverse("password_reset"), {"email": "ada@example.com"})
        self.assertRedirects(response, reverse("password_reset_done"))


class UserManagerTests(TestCase):
    def test_email_is_required_and_normalized(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password=PASSWORD)
        with self.assertRaises(ValueError):
            User.objects.create_user(email=None, password=PASSWORD)
        user = User.objects.create_user(email="Ada@Example.com", password=PASSWORD)
        self.assertEqual(user.email, "ada@example.com")
        self.assertEqual(str(user), "ada@example.com")

    def test_superuser_flags_are_required(self):
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="owner@example.com",
                password=PASSWORD,
                is_staff=False,
            )
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="owner@example.com",
                password=PASSWORD,
                is_superuser=False,
            )
        staff = User.objects.create_superuser(email="owner@example.com", password=PASSWORD)
        self.assertTrue(staff.is_staff)
        self.assertTrue(staff.is_active)
        self.assertEqual(staff.status, User.Status.ACTIVE)


class AccountAdminTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_superuser(email="owner@example.com", password=PASSWORD)
        self.member = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            first_name="Ada Lovelace",
            company="Analytical Engines",
            is_active=True,
            status=User.Status.ACTIVE,
        )

    def test_anonymous_and_non_staff_and_pending_are_blocked(self):
        anonymous = self.client.get(reverse("admin:accounts_user_changelist"))
        self.assertEqual(anonymous.status_code, 302)
        self.assertIn("/admin/login/", anonymous.url)

        member_client = Client()
        member_client.force_login(self.member)
        blocked = member_client.get(reverse("admin:index"))
        self.assertEqual(blocked.status_code, 302)
        self.assertIn("/admin/login/", blocked.url)
        followed = member_client.get(reverse("admin:accounts_user_changelist"), follow=True)
        self.assertNotContains(followed, "Select account to change")

        pending = User.objects.create_user(
            email="pending@example.com",
            password=PASSWORD,
            is_active=False,
            status=User.Status.PENDING,
        )
        pending_client = Client()
        pending_client.force_login(pending)
        pending_admin = pending_client.get(reverse("admin:accounts_user_change", args=[pending.pk]))
        self.assertEqual(pending_admin.status_code, 302)

    def test_superuser_changelist_add_and_change_load(self):
        self.client.force_login(self.staff)
        changelist = self.client.get(reverse("admin:accounts_user_changelist"))
        self.assertEqual(changelist.status_code, 200)
        self.assertContains(changelist, "ada@example.com")
        self.assertContains(changelist, "owner@example.com")

        add = self.client.get(reverse("admin:accounts_user_add"))
        self.assertEqual(add.status_code, 200)
        self.assertContains(add, "email")

        change = self.client.get(reverse("admin:accounts_user_change", args=[self.member.pk]))
        self.assertEqual(change.status_code, 200)
        self.assertContains(change, "ada@example.com")
        self.assertContains(change, "Analytical Engines")

        password = self.client.get(f"/admin/accounts/user/{self.member.pk}/password/")
        self.assertEqual(password.status_code, 200)
        self.assertContains(password, "Change password")

        missing = self.client.get(reverse("admin:accounts_user_change", args=[999999]))
        self.assertRedirects(missing, reverse("admin:index"))
        followed = self.client.get(reverse("admin:accounts_user_change", args=[999999]), follow=True)
        self.assertContains(followed, "doesn’t exist")

    def test_join_form_clean_methods_reject_short_values(self):
        form = JoinForm()
        form.cleaned_data = {"full_name": "A", "company": "B", "phone": "12-34"}
        with self.assertRaises(ValidationError):
            form.clean_full_name()
        with self.assertRaises(ValidationError):
            form.clean_company()
        with self.assertRaises(ValidationError):
            form.clean_phone()
