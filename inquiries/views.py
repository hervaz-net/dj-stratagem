import logging

from django.conf import settings
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.http import require_http_methods

from accounts.net import client_ip
from inquiries.forms import ACCESS_TOPICS, InquiryForm
from inquiries.mail import notify_inquiry
from inquiries.models import Inquiry

logger = logging.getLogger(__name__)


def _initial(request):
    topic = request.GET.get("topic", "")
    if topic in ACCESS_TOPICS:
        return {"topic": "other", "context_topic": topic}
    return {}


@require_http_methods(["GET", "POST"])
def contact(request):
    received = request.session.pop("inquiry_received", False)
    if request.method == "POST":
        if (request.POST.get("bot-field") or "").strip():
            request.session["inquiry_received"] = True
            return redirect("contact")
        form = InquiryForm(request.POST)
        if form.is_valid():
            ip = client_ip(request)
            since = timezone.now() - timezone.timedelta(hours=1)
            recent_from = Inquiry.objects.filter(created_at__gte=since)
            if ip:
                recent_from = recent_from.filter(ip_address=ip)
            else:
                recent_from = recent_from.filter(ip_address__isnull=True)
            recent = recent_from.count()
            if recent >= settings.INQUIRY_RATE_LIMIT:
                form.add_error(None, "That’s a lot of messages from this network. Email hello@djstratageminc.com and we’ll help.")
            else:
                inquiry = Inquiry.objects.create(
                    name=form.cleaned_data["name"],
                    company=form.cleaned_data["company"],
                    email=form.cleaned_data["email"],
                    phone=form.cleaned_data["phone"],
                    role=form.cleaned_data["role"],
                    topic=form.cleaned_data["topic_label"],
                    message=form.cleaned_data["message"],
                    ip_address=ip,
                )
                notify_inquiry(inquiry)
                request.session["inquiry_received"] = True
                return redirect("contact")
    else:
        form = InquiryForm(initial=_initial(request))
    context_topic = form["context_topic"].value() or ""
    return render(
        request,
        "pages/contact.html",
        {
            "form": form,
            "received": received,
            "context_topic": context_topic if context_topic in ACCESS_TOPICS else "",
            "page_title": "Talk to a person",
            "page_description": "Talk with D&J Stratagem about your construction business, account, or the right plan for your team.",
            "canonical_path": "/contact/",
        },
    )
