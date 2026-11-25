import json

from django import template
from django.templatetags.static import static
from django.utils.safestring import mark_safe

register = template.Library()


def _script(data):
    payload = json.dumps(data, ensure_ascii=False)
    payload = payload.replace("<", "\\u003c").replace(">", "\\u003e").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    return mark_safe(f'<script type="application/ld+json">{payload}</script>')


def _assign(context, key, value):
    # {% block %} pushes a context layer that disappears when the block ends.
    # Write one layer down so the rest of base.html can read the value.
    context.dicts[-2][key] = value


@register.simple_tag(takes_context=True)
def seo_defaults(context, title="", description="", og_type="", canonical=""):
    if title:
        _assign(context, "page_title", title)
    if description:
        _assign(context, "page_description", description)
    if og_type:
        _assign(context, "og_type", og_type)
    if canonical:
        _assign(context, "canonical_path", canonical)
    return ""


@register.simple_tag
def form_widget(field, hint_id=""):
    attrs = {}
    described = []
    if hint_id:
        described.append(hint_id)
    if field.errors:
        attrs["aria-invalid"] = "true"
        described.append(f"{field.id_for_label}-error")
    if described:
        attrs["aria-describedby"] = " ".join(described)
    return field.as_widget(attrs=attrs)


@register.simple_tag(takes_context=True)
def json_ld_organization(context):
    site_url = context["site_url"]
    return _script(
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": f"{site_url}/#organization",
            "name": "D&J Stratagem, Inc.",
            "url": site_url,
            "email": context["contact_email"],
            "logo": f"{site_url}{static('favicon.svg')}",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "506 S Spring St #13308",
                "addressLocality": "Los Angeles",
                "addressRegion": "CA",
                "postalCode": "90013",
                "addressCountry": "US",
            },
            "description": "A construction platform connecting contractors, subcontractors, and suppliers across the job lifecycle.",
        }
    )


@register.simple_tag(takes_context=True)
def json_ld_website(context):
    site_url = context["site_url"]
    return _script(
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "D&J Stratagem",
            "url": site_url,
            "publisher": {"@id": f"{site_url}/#organization"},
            "description": context.get("page_description") or "",
        }
    )


@register.simple_tag
def json_ld_faq(faqs):
    return _script(
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {"@type": "Answer", "text": faq.answer},
                }
                for faq in faqs
            ],
        }
    )


@register.simple_tag(takes_context=True)
def json_ld_article(context, article):
    site_url = context["site_url"]
    url = f"{site_url}{article.get_absolute_url()}"
    return _script(
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "description": article.intro,
            "url": url,
            "mainEntityOfPage": url,
            "author": {"@type": "Organization", "name": "D&J Stratagem, Inc."},
            "publisher": {"@id": f"{site_url}/#organization"},
        }
    )


@register.simple_tag(takes_context=True)
def json_ld_breadcrumbs(context, *parts):
    site_url = context["site_url"]
    items = []
    for index in range(0, len(parts), 2):
        name, path = parts[index], parts[index + 1]
        items.append(
            {
                "@type": "ListItem",
                "position": index // 2 + 1,
                "name": name,
                "item": f"{site_url}{path}",
            }
        )
    return _script(
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items,
        }
    )
