from unittest.mock import patch

from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse

from accounts.models import User
from inquiries.models import Inquiry


def payload(**overrides):
    data = {
        "name": "Ada Lovelace",
        "company": "Analytical Engines",
        "email": "ada@example.com",
        "phone": "",
        "role": "General contractor",
        "topic": "support",
        "message": "We want to talk through the desk.",
        "context_topic": "",
        "bot-field": "",
    }
    data.update(overrides)
    return data


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    CONTACT_TO_EMAIL="hello@djstratageminc.com",
)
class InquiryTests(TestCase):
    def test_valid_inquiry_is_stored_and_emailed(self):
        response = self.client.post(reverse("contact"), payload())
        self.assertRedirects(response, reverse("contact"), fetch_redirect_response=False)
        inquiry = Inquiry.objects.get()
        self.assertEqual(inquiry.email, "ada@example.com")
        self.assertEqual(inquiry.topic, "Platform or account question")
        self.assertTrue(inquiry.emailed)
        self.assertEqual(mail.outbox[0].to, ["hello@djstratageminc.com"])
        self.assertEqual(mail.outbox[0].reply_to, ["ada@example.com"])
        self.assertIn("Analytical Engines", mail.outbox[0].body)
        page = self.client.get(reverse("contact"))
        self.assertContains(page, "Message received")

    def test_invalid_inquiry_is_not_stored(self):
        response = self.client.post(reverse("contact"), payload(email="not-an-email", name="A"))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Inquiry.objects.exists())
        self.assertEqual(len(mail.outbox), 0)
        self.assertContains(response, "Enter your name")
        self.assertContains(response, 'aria-invalid="true"')
        self.assertContains(response, 'id="id_name-error"')

    def test_honeypot_is_dropped(self):
        response = self.client.post(reverse("contact"), payload(**{"bot-field": "spam"}))
        self.assertRedirects(response, reverse("contact"))
        self.assertFalse(Inquiry.objects.exists())
        self.assertEqual(len(mail.outbox), 0)

    def test_access_topic_is_kept_on_the_inquiry(self):
        response = self.client.get(reverse("contact") + "?topic=Professional%20access")
        self.assertContains(response, "Professional access")
        self.client.post(
            reverse("contact"),
            payload(topic="other", context_topic="Professional access", message="Call me."),
        )
        inquiry = Inquiry.objects.get()
        self.assertEqual(inquiry.topic, "Professional access")
        self.assertIn("Interested in: Professional access", inquiry.message)

    def test_rate_limit(self):
        Inquiry.objects.bulk_create(
            [
                Inquiry(
                    name="Ada",
                    company="Co",
                    email="ada@example.com",
                    role="General contractor",
                    topic="Partnership",
                    ip_address="127.0.0.1",
                )
                for _ in range(8)
            ]
        )
        response = self.client.post(reverse("contact"), payload())
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "a lot of messages")
        self.assertEqual(Inquiry.objects.count(), 8)

    def test_subject_newlines_cannot_inject_headers(self):
        from inquiries.mail import notify_inquiry

        inquiry = Inquiry.objects.create(
            name="Ada\nBcc: spam@example.net",
            company="Analytical Engines",
            email="ada@example.com",
            role="General contractor",
            topic="Partnership",
        )
        self.assertTrue(notify_inquiry(inquiry))
        self.assertNotIn("\n", mail.outbox[0].subject)
        self.assertNotIn("\r", mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].bcc, [])

    def test_failed_send_leaves_the_inquiry_unsent(self):
        from inquiries.mail import notify_inquiry

        inquiry = Inquiry.objects.create(
            name="Ada Lovelace",
            company="Analytical Engines",
            email="ada@example.com",
            role="General contractor",
            topic="Partnership",
        )
        with patch("inquiries.mail.EmailMessage.send", side_effect=OSError("down")):
            self.assertFalse(notify_inquiry(inquiry))
        inquiry.refresh_from_db()
        self.assertFalse(inquiry.emailed)
        self.assertEqual(len(mail.outbox), 0)

    @override_settings(INQUIRY_RATE_LIMIT=1)
    def test_missing_ip_shares_one_bucket(self):
        first = self.client.post(reverse("contact"), payload(), REMOTE_ADDR="")
        self.assertRedirects(first, reverse("contact"))
        second = self.client.post(reverse("contact"), payload(email="other@example.com"), REMOTE_ADDR="")
        self.assertEqual(second.status_code, 200)
        self.assertContains(second, "a lot of messages")
        self.assertEqual(Inquiry.objects.count(), 1)

    def test_admin_lists_the_inquiry(self):
        Inquiry.objects.create(
            name="Ada Lovelace",
            company="Analytical Engines",
            email="ada@example.com",
            role="General contractor",
            topic="Partnership",
        )
        staff = User.objects.create_superuser(email="owner@example.com", password="correct-horse-battery")
        self.client.force_login(staff)
        response = self.client.get(reverse("admin:inquiries_inquiry_changelist"))
        self.assertContains(response, "Ada Lovelace")
        inquiry = Inquiry.objects.get()
        change = reverse("admin:inquiries_inquiry_change", args=[inquiry.pk])
        self.assertEqual(self.client.get(reverse("admin:inquiries_inquiry_add")).status_code, 403)
        self.assertEqual(self.client.get(change).status_code, 200)
        edited = self.client.post(change, {"name": "Hacked"})
        self.assertEqual(edited.status_code, 403)
        inquiry.refresh_from_db()
        self.assertEqual(inquiry.name, "Ada Lovelace")


@override_settings(
    CONTACT_TO_EMAIL="hello@djstratageminc.com",
    EMAIL_BACKEND="django.core.mail.backends.console.EmailBackend",
)
class InquiryConsoleBackendTests(TestCase):
    def test_console_backend_does_not_count_as_delivered(self):
        self.client.post(reverse("contact"), payload())
        inquiry = Inquiry.objects.get()
        self.assertFalse(inquiry.emailed)


@override_settings(CONTACT_TO_EMAIL="")
class InquiryWithoutMailboxTests(TestCase):
    def test_inquiry_is_kept_when_email_is_not_configured(self):
        self.client.post(reverse("contact"), payload())
        inquiry = Inquiry.objects.get()
        self.assertFalse(inquiry.emailed)
        self.assertEqual(len(mail.outbox), 0)
