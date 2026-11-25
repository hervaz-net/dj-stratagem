"""QA coverage for the contact form, inquiry view, and inquiry admin."""

from unittest import mock

from django.core.exceptions import ValidationError
from django.test import Client, TestCase, override_settings
from django.urls import reverse

from accounts.models import User
from inquiries.forms import ACCESS_TOPICS, ROLES, InquiryForm
from inquiries.models import Inquiry

PASSWORD = "correct-horse-battery"


def payload(**overrides):
    data = {
        "name": "Ada Lovelace",
        "company": "Analytical Engines",
        "email": "ada@example.com",
        "phone": "",
        "role": "General contractor",
        "topic": "partnership",
        "message": "We want to talk through the desk.",
        "context_topic": "",
        "bot-field": "",
    }
    data.update(overrides)
    return data


class InquiryFormTests(TestCase):
    def test_valid_unicode_and_access_topic_note(self):
        form = InquiryForm(
            data=payload(
                name="José García",
                company="Construcción Ñoño",
                email=" jose@example.com ",
                phone="(213) 555-0100",
                topic="other",
                context_topic="Growth access",
                message="Llame cuando puedan.",
            )
        )
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data["name"], "José García")
        self.assertEqual(form.cleaned_data["email"], "jose@example.com")
        self.assertEqual(form.cleaned_data["topic_label"], "Growth access")
        self.assertIn("Interested in: Growth access", form.cleaned_data["message"])
        self.assertIn("Llame cuando puedan.", form.cleaned_data["message"])

    def test_required_fields_empty_and_invalid_choices(self):
        empty = InquiryForm(data={})
        self.assertFalse(empty.is_valid())
        for name in ("name", "company", "email", "role", "topic"):
            self.assertIn(name, empty.errors, name)
        self.assertNotIn("phone", empty.errors)
        self.assertNotIn("message", empty.errors)

        bad = InquiryForm(
            data=payload(
                name=" ",
                company="A",
                email="not-an-email",
                role="Not a role",
                topic="nope",
                phone="call-me",
            )
        )
        self.assertFalse(bad.is_valid())
        self.assertIn("name", bad.errors)
        self.assertIn("company", bad.errors)
        self.assertIn("email", bad.errors)
        self.assertIn("role", bad.errors)
        self.assertIn("topic", bad.errors)
        self.assertIn("phone", bad.errors)

    def test_length_and_phone_boundaries(self):
        self.assertTrue(InquiryForm(data=payload(name="A" * 120, company="B" * 160, message="M" * 1000)).is_valid())
        self.assertIn("name", InquiryForm(data=payload(name="A" * 121)).errors)
        self.assertIn("company", InquiryForm(data=payload(company="B" * 161)).errors)
        self.assertIn("message", InquiryForm(data=payload(message="M" * 1001)).errors)
        self.assertTrue(InquiryForm(data=payload(phone="1234567")).is_valid())
        self.assertIn("phone", InquiryForm(data=payload(phone="123456")).errors)
        self.assertIn("phone", InquiryForm(data=payload(phone="1" * 41)).errors)
        self.assertIn("phone", InquiryForm(data=payload(phone="213.555.0100 ext 9")).errors)

    def test_unknown_context_topic_uses_the_selected_label(self):
        form = InquiryForm(data=payload(topic="buying", context_topic="<script>alert(1)</script>"))
        self.assertTrue(form.is_valid(), form.errors)
        self.assertEqual(form.cleaned_data["topic_label"], "Finding or sourcing materials")
        self.assertNotIn("<script>", form.cleaned_data["message"])

    def test_clean_methods_reject_values_outside_the_choices(self):
        form = InquiryForm()
        form.cleaned_data = {"company": "A", "phone": "abc", "role": "Nope"}
        with self.assertRaises(ValidationError):
            form.clean_company()
        with self.assertRaises(ValidationError):
            form.clean_phone()
        with self.assertRaises(ValidationError):
            form.clean_role()
        self.assertEqual(set(ACCESS_TOPICS), {"Professional access", "Growth access", "Enterprise access"})
        self.assertIn("General contractor", ROLES)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    CONTACT_TO_EMAIL="hello@djstratageminc.com",
)
class ContactViewTests(TestCase):
    def test_get_contract_and_disallowed_methods(self):
        response = self.client.get(reverse("contact"))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/contact.html")
        self.assertEqual(response.context["page_title"], "Talk to a person")
        self.assertFalse(response.context["received"])
        self.assertEqual(response.context["context_topic"], "")
        self.assertEqual(response.context["canonical_path"], "/contact/")
        self.assertContains(response, "Let’s talk about the work.")

        rejected = self.client.put(reverse("contact"))
        self.assertEqual(rejected.status_code, 405)

    def test_unknown_and_markup_topics_are_not_reflected(self):
        unknown = self.client.get(reverse("contact") + "?topic=Starter%20access")
        self.assertNotContains(unknown, "This note is about")
        hostile = self.client.get(reverse("contact") + "?topic=%3Cscript%3Ealert(1)%3C/script%3E")
        self.assertNotContains(hostile, "<script>alert(1)</script>")
        self.assertNotContains(hostile, "This note is about")
        for topic in ("Professional access", "Growth access", "Enterprise access"):
            page = self.client.get(reverse("contact") + f"?topic={topic.replace(' ', '%20')}")
            self.assertContains(page, f"This note is about {topic}")
            self.assertEqual(page.context["context_topic"], topic)

    def test_invalid_post_escapes_markup_and_stores_nothing(self):
        response = self.client.post(
            reverse("contact"),
            payload(
                name="<script>alert(1)</script>",
                email="not-an-email",
                message="<img src=x onerror=alert(1)>",
            ),
        )
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "pages/contact.html")
        self.assertFalse(Inquiry.objects.exists())
        self.assertNotContains(response, "<script>alert(1)</script>")
        self.assertNotContains(response, "<img src=x onerror=alert(1)>")
        self.assertContains(response, "&lt;script&gt;alert(1)&lt;/script&gt;")
        self.assertContains(response, "Enter a valid email")

    def test_unicode_inquiry_is_stored(self):
        response = self.client.post(
            reverse("contact"),
            payload(name="José García", company="Construcción Ñoño", message="Necesitamos materiales."),
        )
        self.assertRedirects(response, reverse("contact"), fetch_redirect_response=False)
        inquiry = Inquiry.objects.get()
        self.assertEqual(inquiry.name, "José García")
        self.assertEqual(inquiry.company, "Construcción Ñoño")
        self.assertEqual(inquiry.message, "Necesitamos materiales.")
        self.assertEqual(str(inquiry), "José García · Construcción Ñoño")
        self.assertEqual(inquiry.ip_address, "127.0.0.1")

    def test_forwarded_for_is_ignored_until_the_proxy_flag_is_on(self):
        self.client.post(
            reverse("contact"),
            payload(),
            HTTP_X_FORWARDED_FOR="203.0.113.9",
        )
        self.assertEqual(Inquiry.objects.get().ip_address, "127.0.0.1")

    @override_settings(DJANGO_BEHIND_PROXY=True)
    def test_proxy_records_the_first_forwarded_address(self):
        self.client.post(
            reverse("contact"),
            payload(),
            HTTP_X_FORWARDED_FOR="203.0.113.9, 10.0.0.8",
        )
        self.assertEqual(Inquiry.objects.get().ip_address, "203.0.113.9")

    def test_mail_failure_keeps_the_inquiry(self):
        with mock.patch("inquiries.mail.send_mail", side_effect=OSError("smtp down")):
            response = self.client.post(reverse("contact"), payload())
        self.assertRedirects(response, reverse("contact"), fetch_redirect_response=False)
        inquiry = Inquiry.objects.get()
        self.assertFalse(inquiry.emailed)
        self.assertContains(self.client.get(reverse("contact")), "Message received")

    def test_post_without_csrf_is_rejected(self):
        client = Client(enforce_csrf_checks=True)
        response = client.post(reverse("contact"), payload())
        self.assertEqual(response.status_code, 403)
        self.assertFalse(Inquiry.objects.exists())

    def test_empty_optional_message_is_allowed(self):
        response = self.client.post(reverse("contact"), payload(message="", phone=""))
        self.assertRedirects(response, reverse("contact"), fetch_redirect_response=False)
        inquiry = Inquiry.objects.get()
        self.assertEqual(inquiry.message, "")
        self.assertEqual(inquiry.phone, "")


class InquiryAdminTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_superuser(email="owner@example.com", password=PASSWORD)
        self.inquiry = Inquiry.objects.create(
            name="<script>alert(1)</script>",
            company="Analytical Engines",
            email="ada@example.com",
            role="General contractor",
            topic="Partnership",
            message="Call me.",
        )

    def test_non_staff_cannot_open_inquiry_admin(self):
        anonymous = self.client.get(reverse("admin:inquiries_inquiry_changelist"))
        self.assertEqual(anonymous.status_code, 302)
        self.assertIn("/admin/login/", anonymous.url)

        member = User.objects.create_user(
            email="ada@example.com",
            password=PASSWORD,
            is_active=True,
            status=User.Status.ACTIVE,
        )
        self.client.force_login(member)
        blocked = self.client.get(reverse("admin:inquiries_inquiry_add"))
        self.assertEqual(blocked.status_code, 302)

    def test_superuser_list_add_and_change_escape_markup(self):
        self.client.force_login(self.staff)
        changelist = self.client.get(reverse("admin:inquiries_inquiry_changelist"))
        self.assertEqual(changelist.status_code, 200)
        self.assertNotContains(changelist, "<script>alert(1)</script>")
        self.assertContains(changelist, "&lt;script&gt;alert(1)&lt;/script&gt;")

        add = self.client.get(reverse("admin:inquiries_inquiry_add"))
        self.assertEqual(add.status_code, 200)
        self.assertContains(add, "name")

        change = self.client.get(reverse("admin:inquiries_inquiry_change", args=[self.inquiry.pk]))
        self.assertEqual(change.status_code, 200)
        self.assertContains(change, "Call me.")
        self.assertNotContains(change, "<script>alert(1)</script>")

        missing = self.client.get(reverse("admin:inquiries_inquiry_change", args=[999999]))
        self.assertRedirects(missing, reverse("admin:index"))
        followed = self.client.get(
            reverse("admin:inquiries_inquiry_change", args=[999999]),
            follow=True,
        )
        self.assertContains(followed, "doesn’t exist")
