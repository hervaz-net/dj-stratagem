"""Shelf loaded by migration so a fresh database can take orders."""

from decimal import Decimal

CATEGORIES = (
    ("anchors", "Anchors & fasteners", "Wedge anchors, screws, and the hardware that holds them."),
    ("abrasives", "Abrasives & cutting", "Wheels and discs the crew burns through."),
    ("safety", "Site safety", "Hard hats, vests, glasses, and lanyards."),
    ("layout", "Layout & marking", "Keel, paint, and chalk that stay on the slab."),
)

SHELF = (
    ("anchors", "wa-1255", "Wedge anchor 1/2 x 5-1/2", "Zinc, box of 25.", "box", "48.00", 240, 40, "A-12"),
    ("anchors", "wa-3830", "Wedge anchor 3/8 x 3", "Zinc, box of 50.", "box", "36.50", 180, 30, "A-14"),
    ("anchors", "cs-14275", "Concrete screw 1/4 x 2-3/4", "Box of 100.", "box", "29.00", 90, 24, "A-18"),
    ("abrasives", "gw-45", "4-1/2 in grinding wheel", "25 pack.", "pack", "42.00", 64, 12, "B-02"),
    ("abrasives", "fd-4540", "4-1/2 in flap disc, 40 grit", "10 pack.", "pack", "38.75", 8, 10, "B-06"),
    ("safety", "hh-2y", "Type II hard hat, yellow", "6-point suspension.", "each", "18.40", 150, 24, "C-01"),
    ("safety", "hv-2lx", "Class 2 vest, L/XL", "Zip front.", "each", "9.80", 200, 40, "C-04"),
    ("safety", "la-6", "6 ft shock-absorbing lanyard", "Single leg.", "each", "27.25", 70, 12, "C-11"),
    ("layout", "mp-or", "Inverted marking paint, orange", "Case of 12.", "case", "54.00", 36, 8, "D-03"),
)


def load(category_model, product_model, inventory_model, sequence_model):
    sequence_model.objects.get_or_create(name="order", defaults={"last": 1040})
    sequence_model.objects.get_or_create(name="invoice", defaults={"last": 1040})
    if category_model.objects.exists():
        return
    categories = {}
    for position, (slug, name, blurb) in enumerate(CATEGORIES):
        categories[slug] = category_model.objects.create(
            slug=slug, name=name, blurb=blurb, position=position
        )
    for category, sku, name, summary, unit, price, on_hand, reorder, location in SHELF:
        product = product_model.objects.create(
            category=categories[category],
            sku=sku,
            name=name,
            summary=summary,
            unit=unit,
            price=Decimal(price),
        )
        inventory_model.objects.create(
            product=product, on_hand=on_hand, reorder_point=reorder, location=location
        )


def seed(apps, schema_editor):
    load(
        apps.get_model("wholesale", "Category"),
        apps.get_model("wholesale", "Product"),
        apps.get_model("wholesale", "Inventory"),
        apps.get_model("wholesale", "NumberSequence"),
    )
