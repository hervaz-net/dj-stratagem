"""Orders, inventory, and Net 30. One transaction keeps the desks in sync."""

from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify

from wholesale.models import (
    Cart,
    CartLine,
    Company,
    CreditAccount,
    CreditApplication,
    Inventory,
    Invoice,
    Membership,
    NumberSequence,
    Order,
    OrderLine,
    Payment,
    Product,
)

MONEY = Decimal("0.01")


class OrderError(Exception):
    pass


def _money(value):
    return Decimal(value).quantize(MONEY)


def unique_slug(name):
    base = (slugify(name) or "account")[:60]
    slug = base
    number = 2
    while Company.objects.filter(slug=slug).exists():
        slug = f"{base}-{number}"
        number += 1
    return slug


def open_trade_account(user):
    if Membership.objects.filter(user=user).exists():
        return user.membership.company
    company = Company.objects.create(
        name=user.company or "Pending account",
        slug=unique_slug(user.company or user.email.split("@")[0]),
        status=Company.Status.PENDING,
        phone=user.phone,
        email=user.email,
    )
    CreditAccount.objects.create(company=company)
    Membership.objects.create(user=user, company=company, role=Membership.Role.OWNER)
    return company


def activate_company(company):
    if company.status != Company.Status.PENDING:
        return company
    company.status = Company.Status.ACTIVE
    company.save(update_fields=["status"])
    for membership in company.memberships.select_related("user"):
        user = membership.user
        if user.status != user.Status.PENDING:
            continue
        user.status = user.Status.ACTIVE
        user.is_active = True
        user.save(update_fields=["status", "is_active", "email"])
    return company


def sync_company_from_user(user):
    membership = Membership.objects.filter(user=user).select_related("company").first()
    if membership is None:
        return
    company = membership.company
    if user.status == user.Status.ACTIVE and user.is_active and company.status == Company.Status.PENDING:
        company.status = Company.Status.ACTIVE
        company.save(update_fields=["status"])


def get_cart(user):
    membership = getattr(user, "membership", None)
    if membership is None:
        raise OrderError("This login is not on a trade account yet.")
    cart, _created = Cart.objects.get_or_create(user=user, company=membership.company)
    return cart


def add_to_cart(user, product, quantity):
    if quantity < 1:
        raise OrderError("Quantity has to be at least 1.")
    cart = get_cart(user)
    line, created = CartLine.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={"quantity": quantity},
    )
    if not created:
        line.quantity += quantity
        line.save(update_fields=["quantity"])
    return cart


def set_line_quantity(user, line_id, quantity):
    cart = get_cart(user)
    line = cart.lines.get(pk=line_id)
    if quantity < 1:
        line.delete()
        return
    line.quantity = quantity
    line.save(update_fields=["quantity"])


def parse_quick_lines(text):
    found = []
    errors = []
    for number, raw in enumerate(text.splitlines(), start=1):
        line = raw.strip()
        if not line or line.lower().startswith("sku"):
            continue
        parts = [part.strip() for part in line.split(",")] if "," in line else line.split()
        if len(parts) < 2:
            errors.append(f"Line {number} needs a SKU and a quantity.")
            continue
        try:
            quantity = int(parts[1])
        except ValueError:
            errors.append(f"Line {number}: quantity has to be a whole number.")
            continue
        if quantity < 1:
            errors.append(f"Line {number}: quantity has to be at least 1.")
            continue
        product = Product.objects.filter(sku__iexact=parts[0], active=True).first()
        if product is None:
            errors.append(f"Line {number}: {parts[0]} is not in the catalog.")
            continue
        found.append((product, quantity))
    return found, errors


def _next_number(prefix, name):
    sequence, _created = NumberSequence.objects.get_or_create(name=name, defaults={"last": 1040})
    sequence = NumberSequence.objects.select_for_update().get(pk=sequence.pk)
    sequence.last += 1
    sequence.save(update_fields=["last"])
    return f"{prefix}-{sequence.last}"


def place_order(user, po_number=""):
    with transaction.atomic():
        membership = user.membership
        company = Company.objects.select_for_update().get(pk=membership.company_id)
        if company.status != Company.Status.ACTIVE:
            raise OrderError("This trade account is not approved to order yet.")
        cart = Cart.objects.select_for_update().get(user=user, company=company)
        lines = list(cart.lines.select_related("product").order_by("product_id"))
        if not lines:
            raise OrderError("The cart is empty.")
        credit = CreditAccount.objects.select_for_update().get(company=company)
        prepared = []
        total = Decimal("0.00")
        for line in lines:
            inventory = Inventory.objects.select_for_update().get(product=line.product)
            if not line.product.active:
                raise OrderError(f"{line.product.sku} is not for sale.")
            if inventory.on_hand < line.quantity:
                raise OrderError(
                    f"{line.product.sku} has {inventory.on_hand} on hand, not {line.quantity}."
                )
            extended = _money(line.product.price * line.quantity)
            prepared.append((line, inventory, extended))
            total += extended
        on_terms = credit.status == CreditAccount.Status.APPROVED
        if on_terms and credit.available < total:
            raise OrderError(
                f"This order is ${total} and ${credit.available} of Net 30 is still open."
            )
        order = Order.objects.create(
            number=_next_number("DJS", "order"),
            company=company,
            placed_by=user,
            po_number=po_number.strip(),
            subtotal=total,
        )
        for line, inventory, extended in prepared:
            inventory.on_hand -= line.quantity
            inventory.save(update_fields=["on_hand"])
            OrderLine.objects.create(
                order=order,
                product=line.product,
                sku=line.product.sku,
                name=line.product.name,
                unit_price=line.product.price,
                quantity=line.quantity,
                line_total=extended,
            )
        if on_terms:
            credit.balance_used = _money(credit.balance_used + total)
            credit.save(update_fields=["balance_used"])
        today = timezone.localdate()
        Invoice.objects.create(
            number=_next_number("INV", "invoice"),
            order=order,
            company=company,
            on_terms=on_terms,
            total=total,
            issued_on=today,
            due_on=today + timedelta(days=credit.terms_days if on_terms else 0),
        )
        cart.lines.all().delete()
        return order


def record_payment(invoice, amount, user, method, reference):
    amount = _money(amount)
    with transaction.atomic():
        credit = CreditAccount.objects.select_for_update().get(company_id=invoice.company_id)
        invoice = Invoice.objects.select_for_update().get(pk=invoice.pk)
        if invoice.status != Invoice.Status.OPEN:
            raise OrderError("That invoice is not open.")
        if amount <= 0 or amount > invoice.balance:
            raise OrderError("Enter an amount up to the open balance.")
        Payment.objects.create(
            invoice=invoice,
            amount=amount,
            method=method,
            reference=reference.strip(),
            recorded_by=user,
        )
        invoice.amount_paid = _money(invoice.amount_paid + amount)
        if invoice.amount_paid >= invoice.total:
            invoice.status = Invoice.Status.PAID
        invoice.save(update_fields=["amount_paid", "status"])
        if invoice.on_terms:
            credit.balance_used = max(Decimal("0.00"), _money(credit.balance_used - amount))
            credit.save(update_fields=["balance_used"])
        return invoice


TRANSITIONS = {
    Order.Status.SUBMITTED: {Order.Status.PICKING, Order.Status.SHIPPED, Order.Status.CANCELLED},
    Order.Status.PICKING: {Order.Status.SHIPPED, Order.Status.CANCELLED},
}


def set_order_status(order, status):
    with transaction.atomic():
        order = Order.objects.select_for_update().get(pk=order.pk)
        if status == Order.Status.CANCELLED:
            return cancel_order(order)
        if status not in TRANSITIONS.get(order.status, set()):
            raise OrderError("That status change is not allowed.")
        order.status = status
        order.save(update_fields=["status"])
        return order


def cancel_order(order):
    with transaction.atomic():
        order = Order.objects.select_for_update().get(pk=order.pk)
        if order.status not in {Order.Status.SUBMITTED, Order.Status.PICKING}:
            raise OrderError("Only open orders can be cancelled.")
        company = Company.objects.select_for_update().get(pk=order.company_id)
        credit = CreditAccount.objects.select_for_update().get(company=company)
        lines = list(order.lines.select_related("product").order_by("product_id"))
        for line in lines:
            inventory = Inventory.objects.select_for_update().get(product_id=line.product_id)
            inventory.on_hand += line.quantity
            inventory.save(update_fields=["on_hand"])
        invoice = Invoice.objects.select_for_update().get(order=order)
        if invoice.on_terms and invoice.status == Invoice.Status.OPEN:
            credit.balance_used = max(
                Decimal("0.00"),
                _money(credit.balance_used - invoice.balance),
            )
            credit.save(update_fields=["balance_used"])
        invoice.status = Invoice.Status.VOID
        invoice.save(update_fields=["status"])
        order.status = Order.Status.CANCELLED
        order.save(update_fields=["status"])
        return order


def apply_for_credit(company, user, requested, years, purchases, reference):
    account = company.credit
    if account.status == CreditAccount.Status.APPROVED:
        raise OrderError("This account already has Net 30.")
    if company.applications.filter(status=CreditApplication.Status.PENDING).exists():
        raise OrderError("A credit application is already in review.")
    application = CreditApplication.objects.create(
        company=company,
        submitted_by=user,
        requested_limit=_money(requested),
        years_in_business=years,
        annual_purchases=_money(purchases),
        trade_reference=reference.strip(),
    )
    account.status = CreditAccount.Status.PENDING
    account.save(update_fields=["status"])
    return application


def decide_credit(application, reviewer, approved, limit, note):
    with transaction.atomic():
        application = CreditApplication.objects.select_for_update().get(pk=application.pk)
        if application.status != CreditApplication.Status.PENDING:
            raise OrderError("That application is already decided.")
        account = CreditAccount.objects.select_for_update().get(company=application.company)
        application.reviewer = reviewer
        application.review_note = note.strip()
        application.decided_at = timezone.now()
        if approved:
            if company_is_inactive(application.company):
                raise OrderError("Approve the trade account before opening terms.")
            application.status = CreditApplication.Status.APPROVED
            account.status = CreditAccount.Status.APPROVED
            account.limit_amount = _money(limit)
            account.terms_days = 30
        else:
            application.status = CreditApplication.Status.DECLINED
            account.status = CreditAccount.Status.DECLINED
        application.save()
        account.save(update_fields=["status", "limit_amount", "terms_days"])
        return application


def company_is_inactive(company):
    return company.status != Company.Status.ACTIVE


def copy_order_to_cart(user, order):
    if order.company_id != user.membership.company_id:
        raise OrderError("That order is on another account.")
    for line in order.lines.all():
        add_to_cart(user, line.product, line.quantity)
    return get_cart(user)
