import logging

from django.conf import settings
from django.contrib.auth.views import (
    LoginView,
    PasswordResetCompleteView,
    PasswordResetConfirmView,
    PasswordResetDoneView,
    PasswordResetView,
)
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.utils import timezone
from django.views import View
from django.views.decorators.http import require_GET

from accounts.forms import JoinForm, SignInForm, StyledPasswordResetForm, StyledSetPasswordForm
from accounts.models import User

logger = logging.getLogger(__name__)


def client_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded and getattr(settings, "DJANGO_BEHIND_PROXY", False):
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


class SignInView(LoginView):
    template_name = "accounts/login.html"
    authentication_form = SignInForm
    redirect_authenticated_user = True


class JoinView(View):
    template_name = "accounts/join.html"

    def get(self, request):
        if request.user.is_authenticated:
            return redirect("dashboard")
        return render(
            request,
            self.template_name,
            {"form": JoinForm(), "received": request.session.pop("join_received", False)},
        )

    def post(self, request):
        if request.user.is_authenticated:
            return redirect("dashboard")
        form = JoinForm(request.POST)
        if not form.is_valid():
            return render(request, self.template_name, {"form": form, "received": False})

        ip = client_ip(request)
        since = timezone.now() - timezone.timedelta(hours=1)
        recent = User.objects.filter(signup_ip=ip, date_joined__gte=since).count() if ip else 0
        email = form.cleaned_data["email"]
        if recent < settings.JOIN_RATE_LIMIT and not User.objects.filter(email=email).exists():
            user = User.objects.create_user(
                email=email,
                password=form.cleaned_data["password"],
                first_name=form.cleaned_data["full_name"],
                company=form.cleaned_data["company"],
                phone=form.cleaned_data["phone"],
                is_active=False,
                status=User.Status.PENDING,
                signup_ip=ip,
            )
            logger.info("Account request %s stored for review", user.pk)
        request.session["join_received"] = True
        return redirect("join")


class ForgotPasswordView(PasswordResetView):
    template_name = "accounts/forgot.html"
    form_class = StyledPasswordResetForm
    email_template_name = "registration/password_reset_email.txt"
    subject_template_name = "registration/password_reset_subject.txt"
    success_url = reverse_lazy("password_reset_done")

    def form_valid(self, form):
        try:
            return super().form_valid(form)
        except Exception:
            logger.exception("Password reset email failed")
            return redirect(self.success_url)


class ResetDoneView(PasswordResetDoneView):
    template_name = "accounts/forgot_done.html"


class ResetConfirmView(PasswordResetConfirmView):
    template_name = "accounts/reset.html"
    form_class = StyledSetPasswordForm
    success_url = reverse_lazy("password_reset_complete")


class ResetCompleteView(PasswordResetCompleteView):
    template_name = "accounts/reset_done.html"


@require_GET
def reset_missing(request):
    return render(request, "accounts/reset_missing.html")


def approve_user(user):
    user.status = User.Status.ACTIVE
    user.is_active = True
    user.save(update_fields=["status", "is_active"])


def suspend_user(user):
    user.status = User.Status.SUSPENDED
    user.is_active = False
    user.save(update_fields=["status", "is_active"])
