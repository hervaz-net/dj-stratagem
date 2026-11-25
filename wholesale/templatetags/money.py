from decimal import Decimal

from django import template

register = template.Library()


@register.filter
def money(value):
    if value is None or value == "":
        return "—"
    return f"${Decimal(value):,.2f}"
