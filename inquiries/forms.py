from django import forms

INPUT = "input h-12 min-h-12 w-full rounded-none border-base-content/25 bg-base-100 text-base"
SELECT = "select h-12 min-h-12 w-full rounded-none border-base-content/25 bg-base-100 text-base"

ROLES = [
    "General contractor",
    "Subcontractor",
    "Supplier or distributor",
    "Other construction professional",
]

TOPICS = [
    ("buying", "Finding or sourcing materials"),
    ("selling", "Listing materials or services"),
    ("partnership", "Partnership"),
    ("support", "Platform or account question"),
    ("other", "Pricing or another question"),
]

ACCESS_TOPICS = {"Professional access", "Growth access", "Enterprise access"}


class InquiryForm(forms.Form):
    name = forms.CharField(
        label="Name",
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
            attrs={"class": INPUT, "autocomplete": "email", "autocapitalize": "none", "spellcheck": "false"}
        ),
    )
    phone = forms.CharField(
        label="Phone",
        required=False,
        widget=forms.TextInput(attrs={"class": INPUT, "autocomplete": "tel", "inputmode": "tel", "maxlength": "40"}),
    )
    role = forms.ChoiceField(
        label="I’m a",
        choices=[("", "Choose one")] + [(role, role) for role in ROLES],
        widget=forms.Select(attrs={"class": SELECT}),
    )
    topic = forms.ChoiceField(
        label="What can we help with?",
        choices=[("", "Choose a topic")] + TOPICS,
        widget=forms.Select(attrs={"class": SELECT}),
    )
    context_topic = forms.CharField(required=False, widget=forms.HiddenInput)
    message = forms.CharField(
        label="Anything we should know?",
        required=False,
        max_length=1000,
        widget=forms.Textarea(attrs={"class": "textarea min-h-32 w-full rounded-none border-base-content/25 bg-base-100 text-base", "rows": 4, "maxlength": "1000"}),
    )

    def clean_name(self):
        name = " ".join(self.cleaned_data["name"].split())
        if len(name) < 2:
            raise forms.ValidationError("Enter your name.")
        return name

    def clean_company(self):
        company = " ".join(self.cleaned_data["company"].split())
        if len(company) < 2:
            raise forms.ValidationError("Enter your company name.")
        return company

    def clean_phone(self):
        phone = self.cleaned_data.get("phone", "").strip()
        if not phone:
            return ""
        allowed = set("0123456789+().- ")
        if len(phone) < 7 or len(phone) > 40 or any(char not in allowed for char in phone):
            raise forms.ValidationError("Use digits and standard phone punctuation.")
        return phone

    def clean_role(self):
        role = self.cleaned_data["role"]
        if role not in ROLES:
            raise forms.ValidationError("Choose a role.")
        return role

    def clean(self):
        cleaned = super().clean()
        topic = cleaned.get("topic")
        context = (cleaned.get("context_topic") or "").strip()
        labels = dict(TOPICS)
        if topic == "other" and context in ACCESS_TOPICS:
            cleaned["topic_label"] = context
            note = f"Interested in: {context}"
            message = (cleaned.get("message") or "").strip()
            cleaned["message"] = f"{note}\n\n{message}".strip()
        elif topic:
            cleaned["topic_label"] = labels.get(topic, topic)
        return cleaned
