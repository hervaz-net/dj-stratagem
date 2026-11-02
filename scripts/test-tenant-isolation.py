#!/usr/bin/env python3
"""Cross-company privacy test: two companies must not see or change each
other's suppliers, quotes (bids), purchase orders, activity, or alert state.

Usage (local dev host, see README -> Testing against a real database):
  python3 scripts/test-tenant-isolation.py http://127.0.0.1:8080 \
      --admin-email admin@djs.local --admin-password '...' [--mysql djs]

  Registers two fresh companies and approves them with the admin account.
  --mysql DB also inserts a purchase order owned by company A straight into
  that local database (via `mysql -uroot DB`), because no API creates one;
  without it the order checks only cover the shared sample orders.

Usage (production, two test accounts that an admin already approved):
  python3 scripts/test-tenant-isolation.py https://djstratageminc.com \
      --a-email qa-a@example.com --a-password '...' \
      --b-email qa-b@example.com --b-password '...'

  Only ever signs in as the two test accounts. It adds one supplier and two
  quotes to company A (named "Isolation test ..."), changes one of A's own
  quotes, and marks one alert read for A. Nothing is written for any other
  account, and the rows it adds are visible only to company A.

Exits 0 when every check passes, 1 otherwise.
"""
import http.cookiejar
import json
import subprocess
import sys
import time
import urllib.error
import urllib.request

if len(sys.argv) < 2 or sys.argv[1].startswith("-"):
    print(__doc__)
    sys.exit(2)

BASE = sys.argv[1].rstrip("/")
args = dict(zip(sys.argv[2::2], sys.argv[3::2]))
STAMP = str(int(time.time()))
MARK = f"Isolation test {STAMP}"

failures = []


class Client:
    def __init__(self, label):
        self.label = label
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))
        self.csrf = None

    def call(self, method, path, body=None):
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(BASE + path, data=data, method=method)
        req.add_header("Accept", "application/json")
        req.add_header("User-Agent", "djs-tenant-isolation-test")
        if data is not None:
            req.add_header("Content-Type", "application/json")
        if self.csrf:
            req.add_header("X-CSRF-Token", self.csrf)
        try:
            with self.opener.open(req, timeout=30) as res:
                status, raw = res.status, res.read()
        except urllib.error.HTTPError as e:
            status, raw = e.code, e.read()
        try:
            payload = json.loads(raw)
        except Exception:
            payload = {"_raw": raw[:300].decode(errors="replace")}
        if isinstance(payload, dict) and payload.get("csrf"):
            self.csrf = payload["csrf"]
        return status, payload

    def get(self, path):
        return self.call("GET", path)

    def post(self, path, body):
        return self.call("POST", path, body)

    def sign_in(self, email, password):
        self.get("/api/me.php")
        status, payload = self.post("/api/login.php", {"email": email, "password": password})
        if status != 200 or not payload.get("ok"):
            print(f"ABORT cannot sign in as {self.label} ({email}): {status} {json.dumps(payload)[:200]}")
            sys.exit(1)
        self.get("/api/me.php")
        return payload.get("user") or {}


def check(label, good, detail=""):
    print(("PASS " if good else "FAIL ") + label + ("" if good or not detail else f"  -> {detail}"))
    if not good:
        failures.append(label)
    return good


def expect(label, result, want_status=200):
    status, payload = result
    ok = status == want_status
    check(f"{label} ({want_status})", ok, f"{status} {json.dumps(payload)[:300]}")
    return payload if isinstance(payload, dict) else {}


def blob(payload):
    return json.dumps(payload, sort_keys=True)


def stable(payload):
    """Response with clock-dependent fields removed, for before/after compares."""
    if isinstance(payload, dict):
        return {k: stable(v) for k, v in payload.items() if k not in ("time", "csrf", "generatedAt", "asOf")}
    if isinstance(payload, list):
        return [stable(v) for v in payload]
    return payload


def own(rows):
    return [r for r in rows if isinstance(r, dict) and not r.get("sample")]


# ---------------------------------------------------------------- accounts
A, B = Client("company A"), Client("company B")

if "--a-email" in args:
    for k in ("--a-password", "--b-email", "--b-password"):
        if k not in args:
            print(f"ABORT {k} is required with --a-email")
            sys.exit(2)
    a_user = A.sign_in(args["--a-email"], args["--a-password"])
    b_user = B.sign_in(args["--b-email"], args["--b-password"])
else:
    admin = Client("admin")
    admin.sign_in(args.get("--admin-email", "admin@djs.local"), args.get("--admin-password", "admin-password-123"))
    pw = "isolation-password-123"
    creds = {}
    for c, tag in ((A, "a"), (B, "b")):
        email = f"iso-{tag}-{STAMP}@djs.local"
        reg = Client("anon")
        reg.get("/api/me.php")
        expect(f"register {c.label}", reg.post("/api/register.php", {
            "fullName": f"Isolation {tag.upper()}", "company": f"Isolation Co {tag.upper()} {STAMP}",
            "email": email, "phone": "(555) 010-3000", "password": pw}))
        users = admin.get("/api/admin-users.php")[1].get("users", [])
        uid = next((u["id"] for u in users if u.get("email") == email), None)
        if uid is None:
            print(f"ABORT {email} missing from admin list")
            sys.exit(1)
        expect(f"approve {c.label}", admin.post("/api/admin-user-status.php", {"id": uid, "status": "active"}))
        creds[tag] = email
    a_user = A.sign_in(creds["a"], pw)
    b_user = B.sign_in(creds["b"], pw)

if not check("the two accounts are different users", a_user.get("id") != b_user.get("id"), f"{a_user} {b_user}"):
    sys.exit(1)

# ---------------------------------------------------------------- signed out
anon = Client("anon")
for path in ("/api/bids.php", "/api/suppliers.php", "/api/orders.php", "/api/overview.php"):
    expect(f"signed out GET {path}", anon.get(path), 401)

# ---------------------------------------------------------------- B baseline
SNAP_PATHS = ["/api/suppliers.php", "/api/bids.php", "/api/orders.php", "/api/overview.php",
              "/api/metrics.php", "/api/analytics.php?range=30d", "/api/analytics.php?range=90d"]
before = {p: stable(expect(f"B GET {p} before", B.get(p))) for p in SNAP_PATHS}

# ---------------------------------------------------------------- A writes
sup = expect("A creates a supplier", A.post("/api/suppliers.php", {
    "name": f"{MARK} Supply", "category": "Electrical", "region": "Isolation, CA"})).get("supplier") or {}
bid1 = expect("A creates a quote", A.post("/api/bids.php", {
    "action": "create", "project": f"{MARK} Clinic", "gc": f"{MARK} GC", "trade": "Electrical",
    "value": 98765, "due": "2030-01-15", "status": "draft"})).get("bid") or {}
bid2 = expect("A creates a second quote", A.post("/api/bids.php", {
    "action": "create", "project": f"{MARK} Depot", "gc": f"{MARK} GC", "trade": "Electrical",
    "value": 4321, "due": "2030-02-01", "status": "submitted"})).get("bid") or {}
expect("A changes its own quote", A.post("/api/bids.php", {"action": "status", "id": bid2.get("id"), "status": "review"}))

order_id = None
if "--mysql" in args:
    order_id = f"PO-ISO-{STAMP}"
    sql = ("INSERT INTO purchase_orders (id, supplier_name, items, category, qty, value, status, ordered_at, eta, owner_id, is_seed) "
           f"VALUES ('{order_id}', '{MARK} Supply', '{MARK} wire', 'Electrical', 10, 5555, 'pending', CURDATE(), CURDATE(), "
           f"{int(a_user['id'])}, 0)")
    subprocess.run(["mysql", "-uroot", args["--mysql"], "-e", sql], check=True)

check("A got ids back for its new rows", bool(sup.get("id") and bid1.get("id") and bid2.get("id")), f"{sup} {bid1} {bid2}")

# A must still see everything it made.
a_sup = blob(A.get("/api/suppliers.php")[1])
a_bids = blob(A.get("/api/bids.php")[1])
a_over = blob(A.get("/api/overview.php")[1])
check("A sees its own supplier", f"{MARK} Supply" in a_sup)
check("A sees its own quotes", f"{MARK} Clinic" in a_bids and f"{MARK} Depot" in a_bids)
check("A sees its own activity", MARK in a_over)
if order_id:
    check("A sees its own purchase order", order_id in blob(A.get("/api/orders.php")[1]))

# ---------------------------------------------------------------- B reads
after = {}
for p in SNAP_PATHS:
    payload = expect(f"B GET {p} after", B.get(p))
    after[p] = stable(payload)
    text = blob(payload)
    check(f"B's {p} has no trace of A's rows", MARK not in text and (not order_id or order_id not in text))
for p in SNAP_PATHS:
    check(f"B's {p} is unchanged by A's writes (counts, totals, activity)", before[p] == after[p],
          "response differs; diff the two snapshots to see which field moved")

b_bids = B.get("/api/bids.php")[1].get("bids", [])
b_sups = B.get("/api/suppliers.php")[1].get("suppliers", [])
b_orders = B.get("/api/orders.php")[1].get("orders", [])
check("B has no non-sample quotes", own(b_bids) == [], blob(own(b_bids))[:300])
check("B has no non-sample suppliers", own(b_sups) == [], blob(own(b_sups))[:300])
check("B has no non-sample orders", own(b_orders) == [], blob(own(b_orders))[:300])

# ---------------------------------------------------------------- B writes
for bid in (bid1, bid2):
    if bid.get("id"):
        expect(f"B cannot change A's quote #{bid['id']}",
               B.post("/api/bids.php", {"action": "status", "id": bid["id"], "status": "lost"}), 404)

seed_bid = next((r for r in b_bids if r.get("sample")), None)
if seed_bid:
    expect(f"B cannot change shared sample quote #{seed_bid['id']}",
           B.post("/api/bids.php", {"action": "status", "id": seed_bid["id"], "status": "lost"}), 409)
else:
    print("SKIP no sample quotes on this host")

seed_order_ids = [o["id"] for o in b_orders if o.get("sample") and o.get("status") in ("pending", "confirmed", "shipped")]
target_orders = ([order_id] if order_id else []) + seed_order_ids[:2]
if target_orders:
    res = expect("B cancel request on A's / sample orders", B.post("/api/orders.php", {"action": "cancel", "ids": target_orders}))
    check("B cancelled none of them", res.get("cancelled") == 0, blob(res)[:300])
else:
    print("SKIP no open orders to try cancelling (pass --mysql on a local host)")

# A's rows are untouched by B's attempts.
a_bid_rows = {r["id"]: r for r in A.get("/api/bids.php")[1].get("bids", [])}
check("A's first quote is still draft", (a_bid_rows.get(bid1.get("id")) or {}).get("status") == "draft",
      blob(a_bid_rows.get(bid1.get("id"))))
check("A's second quote is still review", (a_bid_rows.get(bid2.get("id")) or {}).get("status") == "review",
      blob(a_bid_rows.get(bid2.get("id"))))
if order_id:
    a_orders = {o["id"]: o for o in A.get("/api/orders.php")[1].get("orders", [])}
    check("A's purchase order is still pending", (a_orders.get(order_id) or {}).get("status") == "pending",
          blob(a_orders.get(order_id)))
if seed_order_ids:
    still = {o["id"]: o["status"] for o in A.get("/api/orders.php")[1].get("orders", [])}
    check("sample orders were not cancelled for anyone",
          all(still.get(i) not in (None, "cancelled") for i in seed_order_ids[:2]), blob(still)[:300])

# ---------------------------------------------------------------- alerts
# Alerts are shared market notices; read/dismiss state is per user.
a_alerts = A.get("/api/alerts.php")[1].get("alerts", [])
b_alerts = {x["id"]: x for x in B.get("/api/alerts.php")[1].get("alerts", [])}
target = next((x for x in a_alerts if not x.get("read") and x["id"] in b_alerts and not b_alerts[x["id"]].get("read")), None)
if target:
    expect(f"A marks alert {target['id']} read", A.post("/api/alerts.php", {"action": "read", "id": target["id"]}))
    b_now = {x["id"]: x for x in B.get("/api/alerts.php")[1].get("alerts", [])}
    check("A reading an alert leaves it unread for B", b_now.get(target["id"], {}).get("read") is False,
          blob(b_now.get(target["id"])))
else:
    print("SKIP no alert unread for both companies")

# ---------------------------------------------------------------- result
print()
if failures:
    print(f"{len(failures)} FAILED:")
    for f in failures:
        print(f"  - {f}")
    sys.exit(1)
print(f"ALL PASSED: companies {a_user.get('id')} and {b_user.get('id')} are isolated")
