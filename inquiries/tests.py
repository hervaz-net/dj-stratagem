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
        self.assertIn("Analytical Engines", mail.outbox[0].body)
        page = self.client.get(reverse("contact"))
        self.assertContains(page, "Message received")

    def test_invalid_inquiry_is_not_stored(self):
        response = self.client.post(reverse("contact"), payload(email="not-an-email", name="A"))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Inquiry.objects.exists())
        self.assertEqual(len(mail.outbox), 0)
        self.assertContains(response, "Enter your name")

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


@override_settings(CONTACT_TO_EMAIL="")
class InquiryWithoutMailboxTests(TestCase):
    def test_inquiry_is_kept_when_email_is_not_configured(self):
        self.client.post(reverse("contact"), payload())
        inquiry = Inquiry.objects.get()
        self.assertFalse(inquiry.emailed)
        self.assertEqual(len(mail.outbox), 0)
