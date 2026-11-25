from django import forms

from wholesale.models import Membership, Payment

INPUT = "input h-12 min-h-12 w-full rounded-none border-base-content/25 bg-base-100 text-base"
SELECT = "select h-12 min-h-12 w-full rounded-none border-base-content/25 bg-base-100 text-base"


class QuickOrderForm(forms.Form):
    bulk = forms.CharField(
        label="SKU and quantity",
        widget=forms.Textarea(
            attrs={
                "class": "textarea min-h-40 w-full rounded-none border-base-content/25 bg-base-100 font-mono text-sm",
                "rows": 8,
                "placeholder": "WA-1255, 4\nHH-2Y 12",
            }
        ),
    )
    po_number = forms.CharField(
        label="PO number",
        required=False,
        max_length=40,
        widget=forms.TextInput(attrs={"class": INPUT, "maxlength": "40"}),
    )


class CheckoutForm(forms.Form):
    po_number = forms.CharField(
        label="PO number",
        required=False,
        max_length=40,
        widget=forms.TextInput(attrs={"class": INPUT, "maxlength": "40"}),
    )


class CreditApplyForm(forms.Form):
    requested_limit = forms.DecimalField(
        label="Requested limit",
        min_value=500,
        max_value=500000,
        decimal_places=2,
        widget=forms.NumberInput(attrs={"class": INPUT, "min": "500", "step": "100"}),
    )
    years_in_business = forms.IntegerField(
        label="Years in business",
        min_value=0,
        max_value=150,
        widget=forms.NumberInput(attrs={"class": INPUT, "min": "0"}),
    )
    annual_purchases = forms.DecimalField(
        label="Materials you buy in a year",
        min_value=0,
        decimal_places=2,
        widget=forms.NumberInput(attrs={"class": INPUT, "min": "0", "step": "1000"}),
    )
    trade_reference = forms.CharField(
        label="Trade reference",
        max_length=240,
        widget=forms.TextInput(attrs={"class": INPUT, "maxlength": "240"}),
    )


class InviteForm(forms.Form):
    full_name = forms.CharField(
        label="Name",
        max_length=120,
        widget=forms.TextInput(attrs={"class": INPUT, "autocomplete": "name"}),
    )
    email = forms.EmailField(
        label="Work email",
        widget=forms.EmailInput(attrs={"class": INPUT, "autocomplete": "email"}),
    )
    role = forms.ChoiceField(
        label="Role",
        choices=[
            (Membership.Role.BUYER, "Buyer"),
            (Membership.Role.AP, "Accounts payable"),
            (Membership.Role.OWNER, "Account owner"),
        ],
        widget=forms.Select(attrs={"class": SELECT}),
    )
    password = forms.CharField(
        label="Temporary password",
        min_length=12,
        widget=forms.PasswordInput(attrs={"class": INPUT, "autocomplete": "new-password", "minlength": "12"}),
    )


class PaymentForm(forms.Form):
    amount = forms.DecimalField(
        label="Amount",
        min_value=0.01,
        decimal_places=2,
        widget=forms.NumberInput(attrs={"class": INPUT, "min": "0.01", "step": "0.01"}),
    )
    method = forms.ChoiceField(
        label="Method",
        choices=Payment.Method.choices,
        widget=forms.Select(attrs={"class": SELECT}),
    )
    reference = forms.CharField(
        label="Reference",
        required=False,
        max_length=80,
        widget=forms.TextInput(attrs={"class": INPUT, "maxlength": "80"}),
    )


class CreditDecisionForm(forms.Form):
    limit_amount = forms.DecimalField(
        label="Approved limit",
        min_value=0,
        decimal_places=2,
        widget=forms.NumberInput(attrs={"class": INPUT, "min": "0", "step": "100"}),
    )
    note = forms.CharField(
        label="Note",
        required=False,
        max_length=240,
        widget=forms.TextInput(attrs={"class": INPUT}),
    )


class StockForm(forms.Form):
    on_hand = forms.IntegerField(
        label="On hand",
        min_value=0,
        widget=forms.NumberInput(attrs={"class": INPUT, "min": "0"}),
    )


class AccountForm(forms.Form):
    phone = forms.CharField(
        label="Phone",
        required=False,
        max_length=40,
        widget=forms.TextInput(attrs={"class": INPUT, "autocomplete": "tel"}),
    )
    city = forms.CharField(
        label="City",
        required=False,
        max_length=80,
        widget=forms.TextInput(attrs={"class": INPUT}),
    )
    state = forms.CharField(
        label="State",
        required=False,
        max_length=40,
        widget=forms.TextInput(attrs={"class": INPUT}),
    )


class StaffRoleForm(forms.Form):
    email = forms.EmailField(
        label="Work email",
        widget=forms.EmailInput(attrs={"class": INPUT}),
    )
