import logging

from django.conf import settings
from django.core.mail import send_mail

from config.mail import delivers_mail

logger = logging.getLogger(__name__)


def send_approval_notice(user):
    """Tell a newly approved member they can sign in.

    Returns "sent", "unconfigured", or "failed". The account change is already
    saved; a mail problem must not undo the approval.
    """

    login_url = f"{settings.SITE_URL}/login/"
    body = "\n".join(
        [
            f"Your D&J Stratagem account for {user.email} is approved.",
            "",
            f"Sign in: {login_url}",
            "",
            "If you did not request this account, you can ignore this message.",
        ]
    )
    try:
        send_mail(
            subject="Your D&J Stratagem account is approved",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception:
        logger.exception("Approval email failed for account %s", user.pk)
        return "failed"
    if delivers_mail():
        return "sent"
    logger.info("Approval for account %s was not delivered to a mailbox", user.pk)
    return "unconfigured"
