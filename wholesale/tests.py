from decimal import Decimal

from django.test import TestCase
from django.urls import reverse

from accounts.models import User
from wholesale.models import (
    Category,
    Company,
    CreditAccount,
    CreditApplication,
    Inventory,
    Invoice,
    Membership,
    Order,
    Product,
)
from wholesale.services import add_to_cart, apply_for_credit

PASSWORD = "correct-horse-battery"


def make_product(sku="t-anchor", price="25.00", stock=10):
    category, _created = Category.objects.get_or_create(
        slug="anchors",
        defaults={"name": "Anchors", "blurb": "Anchors and fasteners.", "position": 1},
    )
    product = Product.objects.create(
        category=category,
        sku=sku,
        name="Wedge anchor",
        summary="Box of anchors.",
        unit="box",
        price=Decimal(price),
    )
    Inventory.objects.create(product=product, on_hand=stock, reorder_point=2, location="A-1")
    return product


def make_owner(email="owner@example.com", company_name="Harbor Pine"):
    user = User.objects.create_user(
        email=email,
        password=PASSWORD,
        first_name="Ada Lovelace",
        company=company_name,
        is_active=True,
        status=User.Status.ACTIVE,
    )
    company = user.membership.company
    company.status = Company.Status.ACTIVE
    company.save(update_fields=["status"])
    return user


def add_member(company, role, email):
    user = User.objects.create_user(
        email=email,
        password=PASSWORD,
        first_name="Jordan Hale",
        is_active=True,
        status=User.Status.ACTIVE,
    )
    Membership.objects.create(user=user, company=company, role=role)
    return user


class CreditApprovalTests(TestCase):
    def test_staff_approval_sets_the_limit_the_owner_can_see(self):
        owner = make_owner()
        buyer = add_member(owner.membership.company, Membership.Role.BUYER, "buyer@example.com")
        staff = User.objects.create_superuser(email="staff@example.com", password=PASSWORD)
        apply_for_credit(
            owner.membership.company,
            owner,
            requested=Decimal("8000.00"),
            years=6,
            purchases=Decimal("50000.00"),
            reference="Pacific Rebar",
        )
        self.client.force_login(buyer)
        denied = self.client.post(
            reverse("desk_credit"),
            {"application": "1", "decision": "approve", "limit_amount": "8000", "note": "no"},
        )
        self.assertEqual(denied.status_code, 403)

        self.client.force_login(staff)
        application = CreditApplication.objects.get()
        approved = self.client.post(
            reverse("desk_credit"),
            {
                "application": str(application.pk),
                "decision": "approve",
                "limit_amount": "7500.00",
                "note": "Open a starter limit.",
            },
        )
        self.assertRedirects(approved, reverse("desk_credit"))
        account = CreditAccount.objects.get(company=owner.membership.company)
        self.assertEqual(account.status, CreditAccount.Status.APPROVED)
        self.assertEqual(account.limit_amount, Decimal("7500.00"))
        self.assertEqual(account.available, Decimal("7500.00"))

        self.client.force_login(owner)
        page = self.client.get(reverse("app_credit"))
        self.assertContains(page, "$7,500.00")
        self.assertContains(page, "Net 30")
        desk = self.client.get(reverse("desk_customer", args=[owner.membership.company.slug]))
        self.assertEqual(desk.status_code, 403)


class QuickOrderTests(TestCase):
    def test_paste_adds_known_skus_and_reports_the_unknown_one(self):
        owner = make_owner()
        make_product("t-anchor")
        make_product("t-hat", price="10.00", stock=4)
        self.client.force_login(owner)
        response = self.client.post(
            reverse("quick_order"),
            {"action": "add", "bulk": "t-anchor, 2\nNO-SUCH 3\nt-hat 1\n", "po_number": ""},
        )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "NO-SUCH")
        cart = self.client.get(reverse("cart"))
        self.assertContains(cart, "t-anchor")
        self.assertContains(cart, "t-hat")
        self.assertNotContains(cart, "NO-SUCH")


class OrderInvoiceCreditTests(TestCase):
    def test_order_draws_stock_and_credit_and_payment_puts_it_back(self):
        owner = make_owner()
        company = owner.membership.company
        account = company.credit
        account.status = CreditAccount.Status.APPROVED
        account.limit_amount = Decimal("1000.00")
        account.save()
        product = make_product(price="25.00", stock=10)
        add_to_cart(owner, product, 2)
        self.client.force_login(owner)
        placed = self.client.post(reverse("cart"), {"action": "checkout", "po_number": "PO-9"})
        order = Order.objects.get()
        self.assertRedirects(placed, order.get_absolute_url())
        product.inventory.refresh_from_db()
        account.refresh_from_db()
        invoice = Invoice.objects.get()
        self.assertEqual(product.inventory.on_hand, 8)
        self.assertEqual(order.subtotal, Decimal("50.00"))
        self.assertTrue(invoice.on_terms)
        self.assertEqual(invoice.status, Invoice.Status.OPEN)
        self.assertEqual(account.balance_used, Decimal("50.00"))
        self.assertEqual(account.available, Decimal("950.00"))

        customer = self.client.get(reverse("dashboard"))
        self.assertContains(customer, "$950.00")
        self.assertContains(customer, invoice.number)

        staff = User.objects.create_superuser(email="staff@example.com", password=PASSWORD)
        self.client.force_login(staff)
        paid = self.client.post(
            reverse("desk_invoice", args=[invoice.number]),
            {"amount": "50.00", "method": "ach", "reference": "ACH-1"},
        )
        self.assertRedirects(paid, reverse("desk_invoice", args=[invoice.number]))
        account.refresh_from_db()
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, Invoice.Status.PAID)
        self.assertEqual(account.balance_used, Decimal("0.00"))
        desk = self.client.get(reverse("desk_invoice", args=[invoice.number]))
        self.assertContains(desk, "$0.00")
        self.client.force_login(owner)
        again = self.client.get(reverse("dashboard"))
        self.assertContains(again, "$1,000.00")
        self.assertContains(again, "Paid")


class PermissionTests(TestCase):
    def test_roles_stop_at_their_jobs(self):
        owner = make_owner()
        buyer = add_member(owner.membership.company, Membership.Role.BUYER, "buyer@example.com")
        ap = add_member(owner.membership.company, Membership.Role.AP, "ap@example.com")
        anonymous = self.client.get(reverse("cart"))
        self.assertRedirects(anonymous, f"{reverse('login')}?next={reverse('cart')}")

        self.client.force_login(buyer)
        self.assertEqual(self.client.get(reverse("company_users")).status_code, 403)
        self.assertEqual(self.client.get(reverse("quick_order")).status_code, 200)
        self.assertEqual(self.client.get(reverse("desk")).status_code, 403)

        self.client.force_login(ap)
        self.assertEqual(self.client.get(reverse("quick_order")).status_code, 403)
        self.assertEqual(self.client.get(reverse("invoices")).status_code, 200)
        self.assertEqual(self.client.get(reverse("billing")).status_code, 200)

        self.client.force_login(owner)
        self.assertEqual(self.client.get(reverse("company_users")).status_code, 200)
        self.assertContains(self.client.get(reverse("company_users")), "buyer@example.com")


class ReviewFixTests(TestCase):
    def test_catalog_is_provisioned_by_migration(self):
        self.assertGreater(Product.objects.filter(sku="wa-1255").count(), 0)
        page = self.client.get(reverse("catalog"))
        self.assertContains(page, "wa-1255")

    def test_a_closed_order_cannot_be_reopened_or_restocked_again(self):
        owner = make_owner()
        account = owner.membership.company.credit
        account.status = CreditAccount.Status.APPROVED
        account.limit_amount = Decimal("1000.00")
        account.save()
        product = make_product(stock=10)
        add_to_cart(owner, product, 2)
        self.client.force_login(owner)
        self.client.post(reverse("cart"), {"action": "checkout", "po_number": "PO-1"})
        order = Order.objects.get()
        staff = User.objects.create_superuser(email="staff@example.com", password=PASSWORD)
        self.client.force_login(staff)
        self.client.post(reverse("desk_order_status", args=[order.number]), {"status": "cancelled"})
        product.inventory.refresh_from_db()
        self.assertEqual(product.inventory.on_hand, 10)
        self.client.post(reverse("desk_order_status", args=[order.number]), {"status": "picking"})
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.CANCELLED)
        self.client.post(reverse("desk_order_status", args=[order.number]), {"status": "cancelled"})
        product.inventory.refresh_from_db()
        self.assertEqual(product.inventory.on_hand, 10)

    def test_a_customer_post_does_not_release_credit(self):
        owner = make_owner()
        account = owner.membership.company.credit
        account.status = CreditAccount.Status.APPROVED
        account.limit_amount = Decimal("1000.00")
        account.save()
        product = make_product(price="25.00", stock=10)
        add_to_cart(owner, product, 2)
        self.client.force_login(owner)
        self.client.post(reverse("cart"), {"action": "checkout", "po_number": "PO-2"})
        invoice = Invoice.objects.get()
        reported = self.client.post(
            reverse("billing"),
            {"invoice": invoice.number, "amount": "50.00", "method": "ach", "reference": "claimed"},
        )
        self.assertEqual(reported.status_code, 200)
        account.refresh_from_db()
        invoice.refresh_from_db()
        self.assertEqual(account.balance_used, Decimal("50.00"))
        self.assertEqual(invoice.status, Invoice.Status.OPEN)

    def test_company_approval_does_not_restore_a_suspended_user(self):
        owner = make_owner()
        company = owner.membership.company
        company.status = Company.Status.PENDING
        company.save(update_fields=["status"])
        buyer = add_member(company, Membership.Role.BUYER, "held@example.com")
        buyer.status = User.Status.SUSPENDED
        buyer.is_active = False
        buyer.save(update_fields=["status", "is_active", "email"])
        staff = User.objects.create_superuser(email="staff@example.com", password=PASSWORD)
        self.client.force_login(staff)
        self.client.post(reverse("desk_customer", args=[company.slug]), {"action": "activate"})
        buyer.refresh_from_db()
        company.refresh_from_db()
        self.assertEqual(company.status, Company.Status.ACTIVE)
        self.assertEqual(buyer.status, User.Status.SUSPENDED)
        self.assertFalse(buyer.is_active)
