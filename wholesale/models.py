from decimal import Decimal

from django.conf import settings
from django.db import models
from django.urls import reverse

from wholesale.roles import sync_membership


class NumberSequence(models.Model):
    name = models.CharField(max_length=20, unique=True)
    last = models.PositiveIntegerField(default=1040)

    def __str__(self):
        return f"{self.name}-{self.last}"


class Company(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending review"
        ACTIVE = "active", "Active"
        SUSPENDED = "suspended", "Suspended"

    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=80, unique=True)
    trade = models.CharField(max_length=80, default="General contractor")
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    phone = models.CharField(max_length=40, blank=True)
    email = models.EmailField(blank=True)
    city = models.CharField(max_length=80, blank=True)
    state = models.CharField(max_length=40, blank=True, default="CA")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        permissions = [
            ("view_desk", "Can open the staff desk"),
            ("approve_credit", "Can decide credit applications"),
            ("manage_company_users", "Can manage company users"),
            ("place_orders", "Can place wholesale orders"),
            ("view_billing", "Can view billing and credit"),
            ("manage_roles", "Can assign staff roles"),
        ]

    def __str__(self):
        return self.name


class Membership(models.Model):
    class Role(models.TextChoices):
        OWNER = "owner", "Account owner"
        BUYER = "buyer", "Buyer"
        AP = "ap", "Accounts payable"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="membership",
    )
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=16, choices=Role.choices)
    title = models.CharField(max_length=80, blank=True)

    def __str__(self):
        return f"{self.user.email} · {self.get_role_display()}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        sync_membership(self)


class Category(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(unique=True)
    blurb = models.CharField(max_length=180)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "name"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("catalog") + f"?category={self.slug}"


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    sku = models.SlugField(max_length=40, unique=True)
    name = models.CharField(max_length=160)
    summary = models.CharField(max_length=220)
    unit = models.CharField(max_length=24, default="each")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sku"]

    def __str__(self):
        return f"{self.sku} {self.name}"

    def get_absolute_url(self):
        return reverse("product", args=[self.sku])


class Inventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="inventory")
    on_hand = models.PositiveIntegerField(default=0)
    reorder_point = models.PositiveIntegerField(default=0)
    location = models.CharField(max_length=40, blank=True)

    class Meta:
        verbose_name_plural = "inventory"

    def __str__(self):
        return f"{self.product.sku} · {self.on_hand}"

    @property
    def stock_label(self):
        if self.on_hand <= 0:
            return "Out"
        if self.on_hand <= self.reorder_point:
            return "Low"
        return "In stock"


class Cart(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="carts")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="carts",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["company", "user"], name="wholesale_one_cart"),
        ]


class CartLine(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="lines")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["cart", "product"], name="wholesale_cart_sku"),
        ]

    @property
    def extended(self):
        return (self.product.price * self.quantity).quantize(Decimal("0.01"))


class Order(models.Model):
    class Status(models.TextChoices):
        SUBMITTED = "submitted", "Submitted"
        PICKING = "picking", "Picking"
        SHIPPED = "shipped", "Shipped"
        CANCELLED = "cancelled", "Cancelled"

    number = models.CharField(max_length=20, unique=True)
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="orders")
    placed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="orders_placed",
    )
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.SUBMITTED)
    po_number = models.CharField(max_length=40, blank=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.number

    def get_absolute_url(self):
        return reverse("order_detail", args=[self.number])


class OrderLine(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="lines")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    sku = models.CharField(max_length=40)
    name = models.CharField(max_length=160)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField()
    line_total = models.DecimalField(max_digits=12, decimal_places=2)


class Invoice(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        PAID = "paid", "Paid"
        VOID = "void", "Void"

    number = models.CharField(max_length=20, unique=True)
    order = models.OneToOneField(Order, on_delete=models.PROTECT, related_name="invoice")
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="invoices")
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.OPEN)
    on_terms = models.BooleanField(default=False)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    issued_on = models.DateField()
    due_on = models.DateField()

    class Meta:
        ordering = ["-issued_on", "-id"]

    def __str__(self):
        return self.number

    @property
    def balance(self):
        return (self.total - self.amount_paid).quantize(Decimal("0.01"))


class Payment(models.Model):
    class Method(models.TextChoices):
        ACH = "ach", "ACH"
        CHECK = "check", "Check"
        CARD = "card", "Card"

    invoice = models.ForeignKey(Invoice, on_delete=models.PROTECT, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=16, choices=Method.choices)
    reference = models.CharField(max_length=80, blank=True)
    recorded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)


class CreditAccount(models.Model):
    class Status(models.TextChoices):
        NONE = "none", "No terms"
        PENDING = "pending", "Application in review"
        APPROVED = "approved", "Net 30"
        DECLINED = "declined", "Declined"
        SUSPENDED = "suspended", "Suspended"

    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name="credit")
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NONE)
    limit_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    balance_used = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    terms_days = models.PositiveIntegerField(default=30)

    def __str__(self):
        return f"{self.company.name} credit"

    @property
    def available(self):
        return (self.limit_amount - self.balance_used).quantize(Decimal("0.01"))


class CreditApplication(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        DECLINED = "declined", "Declined"

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="applications")
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    requested_limit = models.DecimalField(max_digits=12, decimal_places=2)
    years_in_business = models.PositiveIntegerField(default=0)
    annual_purchases = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    trade_reference = models.CharField(max_length=240)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="credit_reviews",
    )
    review_note = models.CharField(max_length=240, blank=True)
    decided_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
