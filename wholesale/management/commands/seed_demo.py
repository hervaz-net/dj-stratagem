from decimal import Decimal

from django.core.management.base import BaseCommand

from accounts.models import User
from wholesale.catalog_seed import load
from wholesale.models import Category, CreditApplication, Inventory, Membership, NumberSequence, Product
from wholesale.roles import STAFF_GROUP, ensure_groups
from wholesale.services import add_to_cart, place_order, record_payment

OWNER_EMAIL = "morgan@harborpine.example"
BUYER_EMAIL = "jordan@harborpine.example"
AP_EMAIL = "riley@harborpine.example"
STAFF_EMAIL = "desk@djstratagem.example"
OWNER_PASSWORD = "Harbor-pine-demo-1"
STAFF_PASSWORD = "Desk-access-demo-1"


class Command(BaseCommand):
    help = "Load a demo trade account, shelf, order, and open Net 30 invoice."

    def handle(self, *args, **options):
        if User.objects.filter(email=OWNER_EMAIL).exists():
            self.stdout.write("Demo data is already loaded.")
            return
        groups = ensure_groups()
        load(Category, Product, Inventory, NumberSequence)
        products = {sku: Product.objects.get(sku=sku) for sku in ("wa-1255", "hh-2y", "gw-45", "la-6")}

        staff = User.objects.create_user(
            email=STAFF_EMAIL,
            password=STAFF_PASSWORD,
            first_name="Casey Diaz",
            is_staff=True,
            is_active=True,
            status=User.Status.ACTIVE,
        )
        staff.groups.add(groups["staff"])

        owner = User.objects.create_user(
            email=OWNER_EMAIL,
            password=OWNER_PASSWORD,
            first_name="Morgan Hale",
            company="Harbor & Pine Commercial",
            phone="(213) 555-0148",
            is_active=True,
            status=User.Status.ACTIVE,
        )
        company = owner.membership.company
        company.trade = "Commercial general contractor"
        company.city = "Los Angeles"
        company.state = "CA"
        company.status = company.Status.ACTIVE
        company.save()
        credit = company.credit
        credit.status = credit.Status.APPROVED
        credit.limit_amount = Decimal("40000.00")
        credit.terms_days = 30
        credit.save()

        buyer = User.objects.create_user(
            email=BUYER_EMAIL,
            password=OWNER_PASSWORD,
            first_name="Jordan Hale",
            is_active=True,
            status=User.Status.ACTIVE,
        )
        ap = User.objects.create_user(
            email=AP_EMAIL,
            password=OWNER_PASSWORD,
            first_name="Riley Cho",
            is_active=True,
            status=User.Status.ACTIVE,
        )
        Membership.objects.create(user=buyer, company=company, role=Membership.Role.BUYER)
        Membership.objects.create(user=ap, company=company, role=Membership.Role.AP)

        add_to_cart(buyer, products["wa-1255"], 4)
        add_to_cart(buyer, products["hh-2y"], 12)
        paid = place_order(buyer, "HP-441")
        paid.status = paid.Status.SHIPPED
        paid.save(update_fields=["status"])
        record_payment(paid.invoice, paid.invoice.total, ap, "ach", "ACH-88421")

        add_to_cart(buyer, products["gw-45"], 6)
        add_to_cart(buyer, products["la-6"], 10)
        place_order(buyer, "HP-458")

        pending_user = User.objects.create_user(
            email="sam@northline.example",
            password=OWNER_PASSWORD,
            first_name="Sam Ortiz",
            company="Northline Concrete",
            is_active=False,
            status=User.Status.PENDING,
        )
        CreditApplication.objects.create(
            company=pending_user.membership.company,
            submitted_by=pending_user,
            requested_limit=Decimal("15000.00"),
            years_in_business=8,
            annual_purchases=Decimal("220000.00"),
            trade_reference="Pacific Rebar, Long Beach — account 4419",
        )
        pending_credit = pending_user.membership.company.credit
        pending_credit.status = pending_credit.Status.PENDING
        pending_credit.save(update_fields=["status"])

        self.stdout.write("Owner %s / %s" % (OWNER_EMAIL, OWNER_PASSWORD))
        self.stdout.write("Buyer %s / %s" % (BUYER_EMAIL, OWNER_PASSWORD))
        self.stdout.write("AP %s / %s" % (AP_EMAIL, OWNER_PASSWORD))
        self.stdout.write("Desk %s / %s" % (STAFF_EMAIL, STAFF_PASSWORD))
        self.stdout.write("Staff group: %s" % STAFF_GROUP)
