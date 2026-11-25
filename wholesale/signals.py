from django.db.models.signals import post_save
from django.db.utils import OperationalError, ProgrammingError
from django.dispatch import receiver

from accounts.models import User
from wholesale.models import Membership
from wholesale.services import open_trade_account, sync_company_from_user


@receiver(post_save, sender=User)
def provision_trade_account(sender, instance, created, **kwargs):
    try:
        exists = Membership.objects.filter(user=instance).exists()
    except (OperationalError, ProgrammingError):
        return
    if exists:
        if not created:
            sync_company_from_user(instance)
        return
    if created and instance.company:
        open_trade_account(instance)
