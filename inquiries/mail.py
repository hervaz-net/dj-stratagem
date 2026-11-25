import logging

from django.conf import settings
from django.core.mail import EmailMessage

from config.mail import delivers_mail

logger = logging.getLogger(__name__)


def notify_inquiry(inquiry):
    """Email the inquiry when a mailbox is configured.

    Storage is the source of record. A missing mailbox or a failed send must
    not lose the inquiry, and the console backend must not count as delivered.
    """

    recipient = (settings.CONTACT_TO_EMAIL or "").strip()
    if not recipient:
        logger.info("CONTACT_TO_EMAIL is unset; inquiry %s was stored only", inquiry.pk)
        return False
    subject = " ".join(f"D&J Stratagem inquiry from {inquiry.name}".split()) or "D&J Stratagem inquiry"
    body = "\n".join(
        [
            f"Name: {inquiry.name}",
            f"Company: {inquiry.company}",
            f"Email: {inquiry.email}",
            f"Phone: {inquiry.phone or '—'}",
            f"Role: {inquiry.role}",
            f"Topic: {inquiry.topic}",
            "",
            inquiry.message or "(No extra message)",
        ]
    )
    message = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
        reply_to=[inquiry.email] if inquiry.email else None,
    )
    try:
        message.send(fail_silently=False)
    except Exception:
        logger.exception("Inquiry %s was stored but the notification email failed", inquiry.pk)
        return False
    if not delivers_mail():
        logger.info("Inquiry %s was written to a non-delivering mail backend", inquiry.pk)
        return False
    inquiry.emailed = True
    inquiry.save(update_fields=["emailed"])
    return True
