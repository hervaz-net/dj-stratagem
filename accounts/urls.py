from django.contrib.auth.views import LogoutView
from django.urls import path

from accounts import views

urlpatterns = [
    path("login/", views.SignInView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("join/", views.JoinView.as_view(), name="join"),
    path("forgot-password/", views.ForgotPasswordView.as_view(), name="password_reset"),
    path("forgot-password/sent/", views.ResetDoneView.as_view(), name="password_reset_done"),
    path("reset-password/", views.reset_missing, name="reset_missing"),
    path(
        "reset-password/<uidb64>/<token>/",
        views.ResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path("reset-password/done/", views.ResetCompleteView.as_view(), name="password_reset_complete"),
]
