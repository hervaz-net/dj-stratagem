from decimal import Decimal

from django.core.management.base import BaseCommand

from accounts.models import User
from wholesale.models import Category, CreditApplication, Inventory, Membership, Product
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
        categories = {}
        for position, (slug, name, blurb) in enumerate(
            [
                ("anchors", "Anchors & fasteners", "Wedge anchors, screws, and the hardware that holds them."),
                ("abrasives", "Abrasives & cutting", "Wheels and discs the crew burns through."),
                ("safety", "Site safety", "Hard hats, vests, glasses, and lanyards."),
                ("layout", "Layout & marking", "Keel, paint, and chalk that stay on the slab."),
            ]
        ):
            categories[slug] = Category.objects.create(
                slug=slug, name=name, blurb=blurb, position=position
            )
        shelf = [
            ("anchors", "wa-1255", "Wedge anchor 1/2 x 5-1/2", "Zinc, box of 25.", "box", "48.00", 240, 40, "A-12"),
            ("anchors", "wa-3830", "Wedge anchor 3/8 x 3", "Zinc, box of 50.", "box", "36.50", 180, 30, "A-14"),
            ("anchors", "cs-14275", "Concrete screw 1/4 x 2-3/4", "Box of 100.", "box", "29.00", 90, 24, "A-18"),
            ("abrasives", "gw-45", "4-1/2 in grinding wheel", "25 pack.", "pack", "42.00", 64, 12, "B-02"),
            ("abrasives", "fd-4540", "4-1/2 in flap disc, 40 grit", "10 pack.", "pack", "38.75", 8, 10, "B-06"),
            ("safety", "hh-2y", "Type II hard hat, yellow", "6-point suspension.", "each", "18.40", 150, 24, "C-01"),
            ("safety", "hv-2lx", "Class 2 vest, L/XL", "Zip front.", "each", "9.80", 200, 40, "C-04"),
            ("safety", "la-6", "6 ft shock-absorbing lanyard", "Single leg.", "each", "27.25", 70, 12, "C-11"),
            ("layout", "mp-or", "Inverted marking paint, orange", "Case of 12.", "case", "54.00", 36, 8, "D-03"),
        ]
        products = {}
        for category, sku, name, summary, unit, price, on_hand, reorder, location in shelf:
            product = Product.objects.create(
                category=categories[category],
                sku=sku,
                name=name,
                summary=summary,
                unit=unit,
                price=Decimal(price),
            )
            Inventory.objects.create(
                product=product, on_hand=on_hand, reorder_point=reorder, location=location
            )
            products[sku] = product

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
