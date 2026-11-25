import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def notify_inquiry(inquiry):
    """Email the inquiry if CONTACT_TO_EMAIL and a mail backend are configured.

    Storage is the source of record. A missing mailbox must not lose the inquiry.
    """

    recipient = (settings.CONTACT_TO_EMAIL or "").strip()
    if not recipient:
        logger.info("CONTACT_TO_EMAIL is unset; inquiry %s was stored only", inquiry.pk)
        return False
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
    try:
        send_mail(
            subject=f"D&J Stratagem inquiry from {inquiry.name}",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Inquiry %s was stored but the notification email failed", inquiry.pk)
        return False
    inquiry.emailed = True
    inquiry.save(update_fields=["emailed"])
    return True
