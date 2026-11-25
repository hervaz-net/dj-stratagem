from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.db.models import F, Q
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods, require_POST

from accounts.models import User
from wholesale.forms import (
    AccountForm,
    CheckoutForm,
    CreditApplyForm,
    CreditDecisionForm,
    InviteForm,
    PaymentForm,
    QuickOrderForm,
    StaffRoleForm,
    StockForm,
)
from wholesale.models import (
    Company,
    CreditApplication,
    Invoice,
    Membership,
    Order,
    Product,
)
from wholesale.roles import STAFF_GROUP, ensure_groups
from wholesale.services import (
    OrderError,
    activate_company,
    add_to_cart,
    apply_for_credit,
    cancel_order,
    copy_order_to_cart,
    decide_credit,
    get_cart,
    parse_quick_lines,
    place_order,
    record_payment,
    set_line_quantity,
)

PAGE = {
    "robots": "index, follow",
}


def _page(**extra):
    data = dict(PAGE)
    data.update(extra)
    return data


def _denied(request):
    return render(
        request,
        "wholesale/denied.html",
        {"page_title": "Not available", "robots": "noindex, nofollow"},
        status=403,
    )


def _needs(perm):
    def wrap(view):
        @login_required
        def inner(request, *args, **kwargs):
            if not request.user.has_perm(f"wholesale.{perm}"):
                return _denied(request)
            return view(request, *args, **kwargs)

        return inner

    return wrap


def _company(request):
    membership = getattr(request.user, "membership", None)
    if membership is None:
        return None
    return membership.company


def catalog(request):
    products = Product.objects.filter(active=True).select_related("category", "inventory")
    category = request.GET.get("category", "").strip()
    query = request.GET.get("q", "").strip()
    if category:
        products = products.filter(category__slug=category)
    if query:
        products = products.filter(
            Q(sku__icontains=query) | Q(name__icontains=query) | Q(summary__icontains=query)
        )
    return render(
        request,
        "wholesale/catalog.html",
        _page(
            page_title="Catalog",
            page_description="Wholesale anchors, fasteners, abrasives, and site safety for commercial contractors.",
            canonical_path="/catalog/",
            products=products,
            query=query,
            category=category,
        ),
    )


def product_detail(request, sku):
    item = get_object_or_404(
        Product.objects.select_related("category", "inventory"),
        sku=sku,
        active=True,
    )
    error = ""
    if request.method == "POST":
        if not request.user.is_authenticated:
            return redirect("login")
        if not request.user.has_perm("wholesale.place_orders"):
            return _denied(request)
        try:
            quantity = int(request.POST.get("quantity", "1"))
            add_to_cart(request.user, item, quantity)
        except (OrderError, ValueError) as exc:
            error = str(exc) if isinstance(exc, OrderError) else "Enter a whole number."
        else:
            return redirect("cart")
    return render(
        request,
        "wholesale/product.html",
        _page(
            page_title=item.name,
            page_description=item.summary,
            canonical_path=item.get_absolute_url(),
            item=item,
            error=error,
        ),
    )


def shipping(request):
    return render(
        request,
        "wholesale/shipping.html",
        _page(
            page_title="Shipping",
            page_description="Same-day cutoff at 2 p.m. for commercial jobsites. Deep stock in Los Angeles.",
            canonical_path="/shipping/",
        ),
    )


def credit(request):
    error = ""
    form = CreditApplyForm()
    company = _company(request) if request.user.is_authenticated else None
    if request.method == "POST":
        if not request.user.is_authenticated:
            return redirect("login")
        if company is None or not request.user.has_perm("wholesale.view_billing"):
            return _denied(request)
        form = CreditApplyForm(request.POST)
        if form.is_valid():
            try:
                apply_for_credit(company, request.user, **_credit_kwargs(form))
            except OrderError as exc:
                error = str(exc)
            else:
                return redirect("app_credit")
    return render(
        request,
        "wholesale/credit.html",
        _page(
            page_title="Net 30",
            page_description="Apply for a Net 30 trade account. Terms open after a person reviews the company.",
            canonical_path="/credit/",
            form=form,
            error=error,
            company=company,
        ),
    )


def _credit_kwargs(form):
    return {
        "requested": form.cleaned_data["requested_limit"],
        "years": form.cleaned_data["years_in_business"],
        "purchases": form.cleaned_data["annual_purchases"],
        "reference": form.cleaned_data["trade_reference"],
    }


@login_required
def app_home(request):
    return redirect("dashboard")


@_needs("place_orders")
def cart(request):
    error = ""
    try:
        current = get_cart(request.user)
    except OrderError as exc:
        return render(
            request,
            "wholesale/cart.html",
            {"page_title": "Cart", "robots": "noindex", "error": str(exc), "lines": [], "form": CheckoutForm()},
        )
    if request.method == "POST" and request.POST.get("action") == "qty":
        try:
            set_line_quantity(request.user, int(request.POST.get("line")), int(request.POST.get("quantity", "0")))
        except (OrderError, ValueError, current.lines.model.DoesNotExist):
            error = "That line could not be updated."
        else:
            return redirect("cart")
    form = CheckoutForm(request.POST or None)
    if request.method == "POST" and request.POST.get("action") == "checkout" and form.is_valid():
        try:
            order = place_order(request.user, form.cleaned_data["po_number"])
        except OrderError as exc:
            error = str(exc)
        else:
            return redirect(order.get_absolute_url())
    lines = current.lines.select_related("product", "product__inventory")
    total = sum((line.extended for line in lines), start=0)
    return render(
        request,
        "wholesale/cart.html",
        {
            "page_title": "Cart",
            "robots": "noindex, nofollow",
            "lines": lines,
            "total": total,
            "form": form,
            "error": error,
        },
    )


@_needs("place_orders")
def quick_order(request):
    form = QuickOrderForm(request.POST or None)
    errors = []
    if request.method == "POST" and request.POST.get("action") == "reorder":
        order = get_object_or_404(Order, number=request.POST.get("order"), company=_company(request))
        try:
            copy_order_to_cart(request.user, order)
        except OrderError as exc:
            errors = [str(exc)]
        else:
            return redirect("cart")
    elif request.method == "POST" and form.is_valid():
        found, errors = parse_quick_lines(form.cleaned_data["bulk"])
        for product, quantity in found:
            add_to_cart(request.user, product, quantity)
        if found and not errors and request.POST.get("action") == "place":
            try:
                order = place_order(request.user, form.cleaned_data["po_number"])
            except OrderError as exc:
                errors = [str(exc)]
            else:
                return redirect(order.get_absolute_url())
        elif found and not errors:
            return redirect("cart")
    return render(
        request,
        "wholesale/quick.html",
        {"page_title": "Quick order", "robots": "noindex, nofollow", "form": form, "errors": errors},
    )


def _scoped(model, request):
    company = _company(request)
    if company is None:
        return model.objects.none()
    return model.objects.filter(company=company)


@_needs("place_orders")
def orders(request):
    return render(
        request,
        "wholesale/orders.html",
        {
            "page_title": "Orders",
            "robots": "noindex, nofollow",
            "orders": _scoped(Order, request).prefetch_related("lines"),
        },
    )


@login_required
def order_detail(request, number):
    if not (
        request.user.has_perm("wholesale.place_orders")
        or request.user.has_perm("wholesale.view_billing")
        or request.user.has_perm("wholesale.view_desk")
    ):
        return _denied(request)
    if request.user.has_perm("wholesale.view_desk") and not getattr(request.user, "membership", None):
        order = get_object_or_404(Order.objects.prefetch_related("lines"), number=number)
    else:
        order = get_object_or_404(_scoped(Order, request).prefetch_related("lines"), number=number)
    return render(
        request,
        "wholesale/order.html",
        {"page_title": order.number, "robots": "noindex, nofollow", "order": order},
    )


@_needs("view_billing")
def invoices(request):
    return render(
        request,
        "wholesale/invoices.html",
        {
            "page_title": "Invoices",
            "robots": "noindex, nofollow",
            "invoices": _scoped(Invoice, request).select_related("order"),
        },
    )


@_needs("view_billing")
def app_credit(request):
    company = _company(request)
    return render(
        request,
        "wholesale/app_credit.html",
        {
            "page_title": "Credit",
            "robots": "noindex, nofollow",
            "company": company,
            "applications": company.applications.all() if company else [],
        },
    )


@_needs("view_billing")
@require_http_methods(["GET", "POST"])
def account(request):
    company = _company(request)
    form = AccountForm(
        request.POST or None,
        initial={"phone": company.phone, "city": company.city, "state": company.state} if company else None,
    )
    if request.method == "POST" and company and form.is_valid() and request.user.membership.role == Membership.Role.OWNER:
        company.phone = form.cleaned_data["phone"]
        company.city = form.cleaned_data["city"]
        company.state = form.cleaned_data["state"]
        company.save(update_fields=["phone", "city", "state"])
        return redirect("account")
    return render(
        request,
        "wholesale/account.html",
        {"page_title": "Account", "robots": "noindex, nofollow", "company": company, "form": form},
    )


@_needs("manage_company_users")
def users(request):
    company = _company(request)
    if company is None:
        return _denied(request)
    form = InviteForm(request.POST or None)
    error = ""
    if request.method == "POST" and request.POST.get("action") == "role":
        member = get_object_or_404(Membership, pk=request.POST.get("member"), company=company)
        role = request.POST.get("role")
        owners = company.memberships.filter(role=Membership.Role.OWNER)
        if member.role == Membership.Role.OWNER and role != Membership.Role.OWNER and owners.count() == 1:
            error = "Keep at least one account owner."
        elif role in Membership.Role.values:
            member.role = role
            member.save(update_fields=["role"])
            return redirect("company_users")
    elif request.method == "POST" and form.is_valid():
        email = form.cleaned_data["email"].lower()
        if User.objects.filter(email=email).exists():
            error = "That email already has a login."
        else:
            user = User.objects.create_user(
                email=email,
                password=form.cleaned_data["password"],
                first_name=form.cleaned_data["full_name"],
                is_active=True,
                status=User.Status.ACTIVE,
            )
            Membership.objects.create(user=user, company=company, role=form.cleaned_data["role"])
            return redirect("company_users")
    return render(
        request,
        "wholesale/users.html",
        {
            "page_title": "Users",
            "robots": "noindex, nofollow",
            "members": company.memberships.select_related("user") if company else [],
            "form": form,
            "error": error,
            "roles": Membership.Role.choices,
        },
    )


@_needs("view_billing")
def billing(request):
    company = _company(request)
    error = ""
    form = PaymentForm()
    if request.method == "POST":
        form = PaymentForm(request.POST)
        invoice = get_object_or_404(Invoice, number=request.POST.get("invoice"), company=company)
        if form.is_valid():
            try:
                record_payment(
                    invoice,
                    form.cleaned_data["amount"],
                    request.user,
                    form.cleaned_data["method"],
                    form.cleaned_data["reference"],
                )
            except OrderError as exc:
                error = str(exc)
            else:
                return redirect("billing")
    return render(
        request,
        "wholesale/billing.html",
        {
            "page_title": "Billing",
            "robots": "noindex, nofollow",
            "company": company,
            "invoices": _scoped(Invoice, request).select_related("order"),
            "form": form,
            "error": error,
        },
    )


@_needs("view_desk")
def desk(request):
    return render(
        request,
        "wholesale/desk_home.html",
        {
            "page_title": "Desk",
            "robots": "noindex, nofollow",
            "companies": Company.objects.count(),
            "open_orders": Order.objects.exclude(
                status__in=[Order.Status.SHIPPED, Order.Status.CANCELLED]
            ).count(),
            "open_invoices": Invoice.objects.filter(status=Invoice.Status.OPEN).count(),
            "pending_credit": CreditApplication.objects.filter(
                status=CreditApplication.Status.PENDING
            ).count(),
            "recent_orders": Order.objects.select_related("company")[:6],
            "applications": CreditApplication.objects.filter(
                status=CreditApplication.Status.PENDING
            ).select_related("company")[:6],
            "low_stock": Product.objects.filter(
                inventory__on_hand__lte=F("inventory__reorder_point")
            ).select_related("inventory")[:6],
        },
    )


@_needs("view_desk")
def desk_customers(request):
    return render(
        request,
        "wholesale/desk_customers.html",
        {
            "page_title": "Customers",
            "robots": "noindex, nofollow",
            "companies": Company.objects.select_related("credit").prefetch_related("memberships"),
        },
    )


@_needs("view_desk")
def desk_customer(request, slug):
    company = get_object_or_404(Company.objects.select_related("credit"), slug=slug)
    if request.method == "POST" and request.POST.get("action") == "activate":
        activate_company(company)
        return redirect("desk_customer", slug=slug)
    return render(
        request,
        "wholesale/desk_customer.html",
        {
            "page_title": company.name,
            "robots": "noindex, nofollow",
            "company": company,
            "orders": company.orders.all()[:12],
            "invoices": company.invoices.all()[:12],
        },
    )


@_needs("approve_credit")
def desk_credit(request):
    error = ""
    applications = CreditApplication.objects.select_related("company", "company__credit", "submitted_by")
    if request.method == "POST":
        application = get_object_or_404(CreditApplication, pk=request.POST.get("application"))
        form = CreditDecisionForm(request.POST)
        if form.is_valid():
            try:
                decide_credit(
                    application,
                    request.user,
                    request.POST.get("decision") == "approve",
                    form.cleaned_data["limit_amount"],
                    form.cleaned_data["note"],
                )
            except OrderError as exc:
                error = str(exc)
            else:
                return redirect("desk_credit")
        else:
            error = "Enter a limit before you approve."
    return render(
        request,
        "wholesale/desk_credit.html",
        {"page_title": "Credit", "robots": "noindex, nofollow", "applications": applications, "error": error},
    )


@_needs("view_desk")
def desk_products(request):
    return render(
        request,
        "wholesale/desk_products.html",
        {
            "page_title": "Inventory",
            "robots": "noindex, nofollow",
            "products": Product.objects.select_related("category", "inventory"),
        },
    )


@_needs("view_desk")
def desk_product(request, sku):
    item = get_object_or_404(Product.objects.select_related("inventory"), sku=sku)
    form = StockForm(request.POST or None, initial={"on_hand": item.inventory.on_hand})
    if request.method == "POST" and form.is_valid():
        item.inventory.on_hand = form.cleaned_data["on_hand"]
        item.inventory.save(update_fields=["on_hand"])
        return redirect("desk_product", sku=sku)
    return render(
        request,
        "wholesale/desk_product.html",
        {"page_title": item.sku, "robots": "noindex, nofollow", "item": item, "form": form},
    )


@_needs("view_desk")
def desk_orders(request):
    return render(
        request,
        "wholesale/desk_orders.html",
        {
            "page_title": "Orders",
            "robots": "noindex, nofollow",
            "orders": Order.objects.select_related("company").prefetch_related("lines"),
        },
    )


@_needs("view_desk")
@require_POST
def desk_order_status(request, number):
    order = get_object_or_404(Order, number=number)
    status = request.POST.get("status")
    try:
        if status == Order.Status.CANCELLED:
            cancel_order(order)
        elif status in {Order.Status.PICKING, Order.Status.SHIPPED, Order.Status.SUBMITTED}:
            order.status = status
            order.save(update_fields=["status"])
    except OrderError:
        pass
    return redirect("desk_orders")


@_needs("view_desk")
def desk_invoices(request):
    return render(
        request,
        "wholesale/desk_invoices.html",
        {
            "page_title": "Invoices",
            "robots": "noindex, nofollow",
            "invoices": Invoice.objects.select_related("company", "order"),
        },
    )


@_needs("view_desk")
def desk_invoice(request, number):
    invoice = get_object_or_404(Invoice.objects.select_related("company", "order"), number=number)
    error = ""
    form = PaymentForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        try:
            record_payment(
                invoice,
                form.cleaned_data["amount"],
                request.user,
                form.cleaned_data["method"],
                form.cleaned_data["reference"],
            )
        except OrderError as exc:
            error = str(exc)
        else:
            return redirect("desk_invoice", number=number)
    return render(
        request,
        "wholesale/desk_invoice.html",
        {
            "page_title": invoice.number,
            "robots": "noindex, nofollow",
            "invoice": invoice,
            "payments": invoice.payments.all(),
            "form": form,
            "error": error,
        },
    )


@_needs("manage_roles")
def desk_roles(request):
    ensure_groups()
    error = ""
    form = StaffRoleForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        email = form.cleaned_data["email"].lower()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            error = "No account uses that email."
        else:
            user.is_staff = True
            if user.status != User.Status.ACTIVE:
                user.status = User.Status.ACTIVE
                user.is_active = True
            user.save()
            user.groups.add(Group.objects.get(name=STAFF_GROUP))
            return redirect("desk_roles")
    staff = User.objects.filter(is_staff=True).order_by("email")
    return render(
        request,
        "wholesale/desk_roles.html",
        {
            "page_title": "Roles",
            "robots": "noindex, nofollow",
            "staff": staff,
            "form": form,
            "error": error,
            "groups": Group.objects.all(),
        },
    )
