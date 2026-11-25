from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from accounts.models import User
from accounts.views import approve_user, suspend_user


@admin.action(description="Approve selected accounts")
def approve_accounts(modeladmin, request, queryset):
    count = 0
    for user in queryset:
        approve_user(user)
        count += 1
    modeladmin.message_user(request, f"Approved {count} account(s).", messages.SUCCESS)


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
