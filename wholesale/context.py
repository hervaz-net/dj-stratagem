from django.db.utils import OperationalError, ProgrammingError

from wholesale.models import CartLine, Category, Membership, Product


def trade(request):
    categories = []
    shelf = []
    membership = None
    cart_count = 0
    try:
        categories = list(Category.objects.all())
        shelf = list(
            Product.objects.filter(active=True, inventory__on_hand__gt=0).select_related(
                "category", "inventory"
            )[:8]
        )
        user = getattr(request, "user", None)
        if user is not None and user.is_authenticated:
            membership = (
                Membership.objects.select_related("company", "company__credit")
                .filter(user=user)
                .first()
            )
            if membership is not None:
                cart_count = CartLine.objects.filter(cart__user=user).count()
    except (OperationalError, ProgrammingError):
        categories, shelf, membership, cart_count = [], [], None, 0
    return {
        "catalog_categories": categories,
        "shelf": shelf,
        "trade": membership,
        "cart_count": cart_count,
    }
