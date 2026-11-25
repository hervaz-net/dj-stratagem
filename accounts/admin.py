from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from accounts.mail import send_approval_notice
from accounts.models import User
from accounts.views import approve_user, suspend_user

OWN_ACCOUNT_MESSAGE = "Your own account was left active so you are not locked out."


@admin.action(description="Approve selected accounts")
def approve_accounts(modeladmin, request, queryset):
    sent = failed = unconfigured = 0
    for user in queryset:
        result = approve_user(user)
        if result == "sent":
            sent += 1
        elif result == "failed":
            failed += 1
        elif result == "unconfigured":
            unconfigured += 1
    modeladmin.message_user(request, f"Approved {queryset.count()} account(s).", messages.SUCCESS)
    if sent:
        modeladmin.message_user(request, f"Sent {sent} approval email(s).", messages.SUCCESS)
    if unconfigured:
        modeladmin.message_user(
            request,
            "No delivery mailbox is configured, so approval email was not marked sent.",
            messages.INFO,
        )
    if failed:
        modeladmin.message_user(
            request,
            f"{failed} approval email(s) could not be sent. The accounts are still approved.",
            messages.WARNING,
        )


@admin.action(description="Suspend selected accounts")
def suspend_accounts(modeladmin, request, queryset):
    count = 0
    skipped = 0
    for user in queryset:
        if user.pk == request.user.pk:
            skipped += 1
            continue
        suspend_user(user)
        count += 1
    if skipped:
        modeladmin.message_user(
            request,
            "Your own account was left unchanged so you are not locked out.",
            messages.WARNING,
        )
    modeladmin.message_user(request, f"Suspended {count} account(s).", messages.SUCCESS)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("-date_joined",)
    list_display = ("email", "first_name", "company", "status", "is_active", "is_staff", "date_joined")
    list_filter = ("status", "is_active", "is_staff")
    search_fields = ("email", "first_name", "company")
    actions = (approve_accounts, suspend_accounts)
    readonly_fields = ("last_login", "date_joined", "signup_ip")
    filter_horizontal = ("groups", "user_permissions")

    def get_readonly_fields(self, request, obj=None):
        fields = list(super().get_readonly_fields(request, obj))
        if obj is not None and obj.pk == getattr(request.user, "pk", None):
            for name in ("status", "is_active"):
                if name not in fields:
                    fields.append(name)
        return fields

    def save_model(self, request, obj, form, change):
        previous = None
        if change and obj.pk:
            previous = User.objects.filter(pk=obj.pk).values("status", "is_active").first()
        if change and getattr(request.user, "pk", None) == obj.pk:
            if obj.status != User.Status.ACTIVE or not obj.is_active:
                obj.status = User.Status.ACTIVE
                obj.is_active = True
                messages.warning(request, OWN_ACCOUNT_MESSAGE)
        super().save_model(request, obj, form, change)
        if previous is None:
            return
        was_active = previous["status"] == User.Status.ACTIVE and previous["is_active"]
        now_active = obj.status == User.Status.ACTIVE and obj.is_active
        if was_active or not now_active:
            return
        result = send_approval_notice(obj)
        if result == "sent":
            messages.success(request, "Sent the approval email.")
        elif result == "failed":
            messages.warning(request, "The account is approved, but the approval email could not be sent.")
        elif result == "unconfigured":
            messages.info(request, "The account is approved. No delivery mailbox is configured, so no email was sent.")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Company", {"fields": ("first_name", "last_name", "company", "phone", "status", "signup_ip")}),
        (
            "Access",
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("Dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "company", "is_staff", "is_superuser"),
            },
        ),
    )
