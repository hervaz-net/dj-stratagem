"""Django groups for the trade-account roles."""

from django.contrib.auth.models import Group, Permission

ROLE_GROUP = {
    "owner": "Account owner",
    "buyer": "Buyer",
    "ap": "Accounts payable",
}

STAFF_GROUP = "Staff"
ADMIN_GROUP = "Admin"

ROLE_PERMS = {
    "owner": ["place_orders", "view_billing", "manage_company_users"],
    "buyer": ["place_orders"],
    "ap": ["view_billing"],
}

STAFF_PERMS = [
    "view_desk",
    "approve_credit",
    "manage_roles",
    "view_billing",
    "manage_company_users",
]


def ensure_groups():
    catalog = Permission.objects.filter(content_type__app_label="wholesale")
    by_code = {item.codename: item for item in catalog}

    def grant(name, codes):
        group, _created = Group.objects.get_or_create(name=name)
        wanted = [by_code[code] for code in codes if code in by_code]
        group.permissions.set(wanted)
        return group

    groups = {role: grant(name, ROLE_PERMS[role]) for role, name in ROLE_GROUP.items()}
    groups["staff"] = grant(STAFF_GROUP, STAFF_PERMS)
    groups["admin"] = grant(ADMIN_GROUP, list(by_code))
    return groups


def sync_membership(membership):
    groups = ensure_groups()
    user = membership.user
    role_groups = [groups[role] for role in ("owner", "buyer", "ap")]
    user.groups.remove(*role_groups)
    user.groups.add(groups[membership.role])
