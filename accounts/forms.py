from django import forms
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm, SetPasswordForm
from django.contrib.auth.password_validation import validate_password

from accounts.models import User

INPUT = "input h-12 min-h-12 w-full rounded-none border-base-content/25 bg-base-100 text-base"
SELECT = "select h-12 min-h-12 w-full rounded-none border-base-content/25 bg-base-100 text-base"

INACTIVE = (
    "Those details don’t match an active account. "
    "If you just requested access, a person still needs to approve it."
)


class SignInForm(AuthenticationForm):
    error_messages = {
        "invalid_login": INACTIVE,
        "inactive": INACTIVE,
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].label = "Work email"
        self.fields["username"].widget = forms.EmailInput(
            attrs={
                "class": INPUT,
                "autocomplete": "username",
                "autocapitalize": "none",
                "spellcheck": "false",
                "required": True,
            }
        )
        self.fields["password"].widget.attrs.update(
            {
                "class": INPUT,
                "autocomplete": "current-password",
            }
        )


class JoinForm(forms.Form):
    full_name = forms.CharField(
        label="Full name",
        max_length=120,
        widget=forms.TextInput(attrs={"class": INPUT, "autocomplete": "name", "maxlength": "120"}),
    )
    company = forms.CharField(
        label="Company",
        max_length=160,
        widget=forms.TextInput(attrs={"class": INPUT, "autocomplete": "organization", "maxlength": "160"}),
    )
    email = forms.EmailField(
        label="Work email",
        widget=forms.EmailInput(
            attrs={
                "class": INPUT,
                "autocomplete": "email",
                "autocapitalize": "none",
                "spellcheck": "false",
            }
        ),
    )
    phone = forms.CharField(
        label="Phone",
        required=False,
        widget=forms.TextInput(attrs={"class": INPUT, "autocomplete": "tel", "inputmode": "tel", "maxlength": "40"}),
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={"class": INPUT, "autocomplete": "new-password", "minlength": "12"}),
    )
    confirm = forms.CharField(
        label="Confirm password",
        widget=forms.PasswordInput(attrs={"class": INPUT, "autocomplete": "new-password", "minlength": "12"}),
    )

    def clean_full_name(self):
        name = " ".join(self.cleaned_data["full_name"].split())
        if len(name) < 2:
            raise forms.ValidationError("Enter the name we should use.")
        return name

    def clean_company(self):
        company = " ".join(self.cleaned_data["company"].split())
        if len(company) < 2:
            raise forms.ValidationError("Enter your company name.")
        return company

    def clean_email(self):
        return self.cleaned_data["email"].strip().lower()

    def clean_phone(self):
        phone = self.cleaned_data.get("phone", "").strip()
        if not phone:
            return ""
        allowed = set("0123456789+().- ")
        if len(phone) < 7 or len(phone) > 40 or any(char not in allowed for char in phone):
            raise forms.ValidationError("Use digits and standard phone punctuation.")
        return phone

    def clean(self):
        cleaned = super().clean()
        password = cleaned.get("password")
        confirm = cleaned.get("confirm")
        if password and confirm and password != confirm:
            self.add_error("confirm", "Those passwords don’t match.")
        if password:
            candidate = User(email=cleaned.get("email", ""), first_name=cleaned.get("full_name", ""))
            try:
                validate_password(password, user=candidate)
            except forms.ValidationError as exc:
                self.add_error("password", exc)
        return cleaned


class StyledPasswordResetForm(PasswordResetForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"].label = "Work email"
        self.fields["email"].widget.attrs.update(
            {
                "class": INPUT,
                "autocomplete": "email",
                "autocapitalize": "none",
                "spellcheck": "false",
            }
        )


class StyledSetPasswordForm(SetPasswordForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["new_password1"].label = "New password"
        self.fields["new_password2"].label = "Confirm password"
        for name in ("new_password1", "new_password2"):
            self.fields[name].widget.attrs.update(
                {"class": INPUT, "autocomplete": "new-password", "minlength": "12"}
            )
