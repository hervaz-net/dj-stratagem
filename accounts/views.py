import logging

from django.contrib.auth.views import (
    LoginView,
    PasswordResetCompleteView,
    PasswordResetConfirmView,
    PasswordResetDoneView,
    PasswordResetView,
)
from django.db import IntegrityError, transaction
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from django.views import View
from django.views.decorators.http import require_GET

from accounts.forms import JoinForm, SignInForm, StyledPasswordResetForm, StyledSetPasswordForm
from accounts.mail import send_approval_notice
from accounts.models import User
from accounts.net import client_ip
from accounts.throttle import join_blocked, login_blocked, record_join, record_login_failure, record_reset, reset_blocked

logger = logging.getLogger(__name__)


class SignInView(LoginView):
    template_name = "accounts/login.html"
    authentication_form = SignInForm
    redirect_authenticated_user = True

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        form.rate_limited = login_blocked(request)
        if form.is_valid():
            return self.form_valid(form)
        if not form.rate_limited:
            record_login_failure(request)
        return self.form_invalid(form)


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
        email = form.cleaned_data["email"]
        limited = join_blocked(ip)
        if not limited:
            record_join(ip)
        if not limited and not User.objects.filter(email__iexact=email).exists():
            try:
                with transaction.atomic():
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
            except IntegrityError:
                logger.info("Join request matched an existing account")
            else:
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
        if reset_blocked(self.request):
            logger.info("Dropped a password reset because the rate limit was reached")
            return redirect(self.success_url)
        record_reset(self.request)
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
    """Activate a member. Return "sent", "unconfigured", "failed", or "unchanged"."""

    already = User.objects.filter(pk=user.pk, status=User.Status.ACTIVE, is_active=True).exists()
    user.status = User.Status.ACTIVE
    user.is_active = True
    user.save(update_fields=["status", "is_active", "email"])
    if already:
        return "unchanged"
    return send_approval_notice(user)


def suspend_user(user):
    user.status = User.Status.SUSPENDED
    user.is_active = False
    user.save(update_fields=["status", "is_active"])
