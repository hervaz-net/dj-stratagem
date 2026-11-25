"""Database-backed rate limits that roll back with tests and survive multiple workers."""

import hashlib

from django.conf import settings
from django.utils import timezone

from accounts.models import AuthAttempt, User
from accounts.net import client_ip

LOGIN_LIMIT_MESSAGE = "Too many sign-in attempts. Wait a few minutes and try again."


def _since(seconds):
    return timezone.now() - timezone.timedelta(seconds=seconds)


def _bucket(kind, ip):
    attempts = AuthAttempt.objects.filter(kind=kind)
    if ip:
        return attempts.filter(ip_address=ip)
    return attempts.filter(ip_address__isnull=True)


def _identifier(value):
    """Store a hash so failed sign-in rows are not a list of email addresses."""

    text = (value or "").strip().lower()
    if not text:
        return ""
    return hashlib.sha256(text.encode()).hexdigest()


def _count(kind, ip, *, seconds, identifier=None):
    attempts = _bucket(kind, ip).filter(created_at__gte=_since(seconds))
    if identifier is not None:
        attempts = attempts.filter(identifier=_identifier(identifier))
    return attempts.count()


def _record(kind, ip, identifier=""):
    cutoff = timezone.now() - timezone.timedelta(hours=24)
    AuthAttempt.objects.filter(created_at__lt=cutoff).delete()
    AuthAttempt.objects.create(
        kind=kind,
        ip_address=ip,
        identifier=_identifier(identifier),
    )


def _posted(request, *keys):
    for key in keys:
        value = (request.POST.get(key) or "").strip().lower()
        if value:
            return value[:254]
    return ""


def login_blocked(request):
    ip = client_ip(request)
    email = _posted(request, "username")
    window = settings.LOGIN_RATE_WINDOW
    if _count(AuthAttempt.Kind.LOGIN, ip, seconds=window) >= settings.LOGIN_IP_LIMIT:
        return True
    if email and _count(
        AuthAttempt.Kind.LOGIN,
        ip,
        seconds=window,
        identifier=email,
    ) >= settings.LOGIN_ACCOUNT_LIMIT:
        return True
    return False


def record_login_failure(request):
    _record(AuthAttempt.Kind.LOGIN, client_ip(request), _posted(request, "username"))


def reset_blocked(request):
    return _count(
        AuthAttempt.Kind.RESET,
        client_ip(request),
        seconds=settings.PASSWORD_RESET_WINDOW,
    ) >= settings.PASSWORD_RESET_RATE_LIMIT


def record_reset(request):
    _record(AuthAttempt.Kind.RESET, client_ip(request), _posted(request, "email"))


def join_blocked(ip):
    since = timezone.now() - timezone.timedelta(seconds=settings.JOIN_POST_WINDOW)
    posts = _bucket(AuthAttempt.Kind.JOIN, ip).filter(created_at__gte=since)
    if posts.count() >= settings.JOIN_POST_LIMIT:
        return True
    accounts = User.objects.filter(date_joined__gte=since)
    if ip:
        accounts = accounts.filter(signup_ip=ip)
    else:
        accounts = accounts.filter(signup_ip__isnull=True)
    return accounts.count() >= settings.JOIN_RATE_LIMIT


def record_join(ip):
    _record(AuthAttempt.Kind.JOIN, ip)
