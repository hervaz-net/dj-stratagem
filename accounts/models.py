from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def normalize_email(self, email):
        return super().normalize_email(email or "").strip().lower()

    def get_by_natural_key(self, username):
        return self.get(email=self.normalize_email(username))

    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("An email address is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("is_active", True)
        extra.setdefault("status", User.Status.ACTIVE)
        if extra.get("is_staff") is not True or extra.get("is_superuser") is not True:
            raise ValueError("Superusers must have is_staff and is_superuser set.")
        return self.create_user(email, password, **extra)


class User(AbstractUser):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending review"
        ACTIVE = "active", "Active"
        SUSPENDED = "suspended", "Suspended"

    username = None
    email = models.EmailField("work email", unique=True)
    company = models.CharField(max_length=160, blank=True)
    phone = models.CharField(max_length=40, blank=True)
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.ACTIVE,
        help_text="Pending and suspended accounts are signed out and cannot sign in.",
    )
    signup_ip = models.GenericIPAddressField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "account"
        verbose_name_plural = "accounts"
        indexes = [
            models.Index(fields=["status"], name="accounts_user_status_idx"),
            models.Index(fields=["signup_ip", "date_joined"], name="accounts_user_signup_idx"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status="active") | models.Q(is_active=False),
                name="accounts_user_status_matches_active",
                violation_error_message="Pending and suspended accounts cannot stay signed in.",
            ),
        ]

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        self.email = type(self).objects.normalize_email(self.email)
        update_fields = kwargs.get("update_fields")
        fields = set(update_fields) if update_fields is not None else None
        if self.status != self.Status.ACTIVE and self.is_active:
            self.is_active = False
            if fields is not None:
                fields.add("is_active")
        if fields is not None:
            fields.add("email")
            kwargs["update_fields"] = list(fields)
        super().save(*args, **kwargs)


class AuthAttempt(models.Model):
    """Short-lived counters for sign-in, password reset, and join posts."""

    class Kind(models.TextChoices):
        LOGIN = "login", "Sign in"
        RESET = "reset", "Password reset"
        JOIN = "join", "Join"

    kind = models.CharField(max_length=16, choices=Kind.choices)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    identifier = models.CharField(max_length=254, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["kind", "ip_address", "created_at"], name="auth_attempt_ip_idx"),
            models.Index(
                fields=["kind", "ip_address", "identifier", "created_at"],
                name="auth_attempt_ident_idx",
            ),
            models.Index(fields=["kind", "identifier", "created_at"], name="auth_attempt_account_idx"),
        ]

    def __str__(self):
        return f"{self.kind} {self.ip_address or 'unknown'}"
