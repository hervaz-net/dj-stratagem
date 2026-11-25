from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("An email address is required.")
        email = self.normalize_email(email).lower()
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
    )
    signup_ip = models.GenericIPAddressField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "account"
        verbose_name_plural = "accounts"

    def __str__(self):
        return self.email
