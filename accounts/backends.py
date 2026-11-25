from django.contrib.auth.backends import ModelBackend

from accounts.models import User


class StatusBackend(ModelBackend):
    """Sign-in and existing sessions both require an active membership.

    Django already rejects is_active=False. Pending and suspended accounts
    stay signed out even if that flag was flipped without the status field.
    """

    def user_can_authenticate(self, user):
        if not super().user_can_authenticate(user):
            return False
        return getattr(user, "status", None) == User.Status.ACTIVE
