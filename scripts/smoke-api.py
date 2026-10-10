#!/usr/bin/env python3
"""End-to-end API smoke test against a running PHP + MySQL host.

Usage:
  python3 scripts/smoke-api.py http://127.0.0.1:8080 [--admin-email EMAIL --admin-password PW]

Creates a fresh member account, approves it with the admin account, signs in,
and calls every dashboard endpoint (GET and POST). Exits non-zero on the first
unexpected response. Never run against production with real data you care
about: it creates rows.
"""
import json
import sys
import time
import urllib.request
import urllib.error
import http.cookiejar

BASE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:8080"
args = dict(zip(sys.argv[2::2], sys.argv[3::2]))
ADMIN_EMAIL = args.get("--admin-email", "admin@djs.local")
ADMIN_PW = args.get("--admin-password", "admin-password-123")

failures = []


class Client:
    def __init__(self):
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))
        self.csrf = None

    def call(self, method, path, body=None):
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(BASE + path, data=data, method=method)
        req.add_header("Accept", "application/json")
        if data is not None:
            req.add_header("Content-Type", "application/json")
        if self.csrf:
            req.add_header("X-CSRF-Token", self.csrf)
        try:
            with self.opener.open(req, timeout=20) as res:
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

    def refresh(self):
        return self.call("GET", "/api/me.php")


def check(label, result, want_status=200, want_ok=True):
    status, payload = result
    ok_flag = payload.get("ok") if isinstance(payload, dict) else None
    good = status == want_status and (want_ok is None or ok_flag == want_ok)
    mark = "PASS" if good else "FAIL"
    print(f"{mark} {status} {label}" + ("" if good else f"  -> {json.dumps(payload)[:300]}"))
    if not good:
        failures.append(label)
    return payload


stamp = str(int(time.time()))
member_email = f"member{stamp}@djs.local"
member_pw = "member-password-123"

anon = Client()
check("GET /api/ index", anon.call("GET", "/api/"))
check("GET missing endpoint is 404", anon.call("GET", "/api/does-not-exist.php"), 404, False)
check("GET helper library is denied", anon.call("GET", "/api/market.php"), 403, None)
check("GET health", anon.call("GET", "/api/health.php"))
check("GET me (anon)", anon.refresh())
check("GET overview (anon) is 401", anon.call("GET", "/api/overview.php"), 401, False)
check("POST register without csrf is 403", Client().call("POST", "/api/register.php", {}), 403, False)
check("POST register invalid", anon.call("POST", "/api/register.php", {"email": "x"}), 422, False)
check("POST register member", anon.call("POST", "/api/register.php", {
    "fullName": "Smoke Member", "company": "Smoke Builders", "email": member_email,
    "phone": "(555) 010-2000", "password": member_pw}))
check("POST login pending is 403", anon.call("POST", "/api/login.php", {"email": member_email, "password": member_pw}), 403, False)
check("POST login wrong pw is 401", anon.call("POST", "/api/login.php", {"email": member_email, "password": "nope-nope-nope"}), 401, False)

admin = Client()
admin.refresh()
check("POST login admin", admin.call("POST", "/api/login.php", {"email": ADMIN_EMAIL, "password": ADMIN_PW}))
users = check("GET admin-users", admin.call("GET", "/api/admin-users.php"))
member_id = next((u["id"] for u in users.get("users", []) if u.get("email") == member_email), None)
if member_id is None:
    print("FAIL could not find new member in admin list")
    failures.append("admin list member")
else:
    check("POST approve member", admin.call("POST", "/api/admin-user-status.php", {"id": member_id, "status": "active"}))

m = Client()
m.refresh()
check("POST login member", m.call("POST", "/api/login.php", {"email": member_email, "password": member_pw}))
check("GET me (member)", m.refresh())
check("GET admin-users as member is 403", m.call("GET", "/api/admin-users.php"), 403, False)

for path in [
    "/api/overview.php", "/api/suppliers.php", "/api/metrics.php", "/api/market-ticker.php",
    "/api/bids.php", "/api/orders.php", "/api/analytics.php?range=7d", "/api/analytics.php?range=30d",
    "/api/analytics.php?range=90d", "/api/alerts.php", "/api/settings.php", "/api/catalog.php",
    "/api/requests.php", "/api/credit.php",
]:
    check(f"GET {path}", m.call("GET", path))

check("POST suppliers create", m.call("POST", "/api/suppliers.php", {"name": "Smoke Supply Co", "category": "Electrical", "region": "Los Angeles, CA"}))
bid = check("POST bids create", m.call("POST", "/api/bids.php", {"action": "create", "project": "Smoke Test Clinic", "gc": "Smoke GC", "trade": "Electrical", "value": 125000, "due": "2026-12-01"}))
bid_id = (bid.get("bid") or {}).get("id")
if bid_id:
    check("POST bids status", m.call("POST", "/api/bids.php", {"action": "status", "id": bid_id, "status": "submitted"}))
orders = m.call("GET", "/api/orders.php")[1]
order_rows = orders.get("orders") or orders.get("items") or []
open_ids = [o["id"] for o in order_rows if isinstance(o, dict) and o.get("status") not in ("cancelled", "delivered")][:1]
if open_ids:
    check("POST orders cancel", m.call("POST", "/api/orders.php", {"action": "cancel", "ids": open_ids}))
check("POST alerts read_all", m.call("POST", "/api/alerts.php", {"action": "read_all"}))
check("POST settings notifications", m.call("POST", "/api/settings.php", {"action": "notifications", "email": True}))
check("POST settings profile", m.call("POST", "/api/settings.php", {"action": "profile", "name": "Smoke Member", "email": member_email, "company": "Smoke Builders", "phone": "(555) 010-2000", "title": "Owner"}))
check("POST catalog save", want_status=201, result=m.call("POST", "/api/catalog.php", {"action": "save", "sku": f"SMK-{stamp}", "name": "12 AWG THHN 500ft", "category": "Electrical", "unit": "reel", "price": 96.4, "moq": 1, "leadTimeDays": 2}))
req = check("POST requests create", want_status=201, result=m.call("POST", "/api/requests.php", {"action": "create", "title": "Smoke THHN request", "category": "Electrical", "items": [{"description": "12 AWG THHN", "qty": 4000, "unit": "ft"}], "neededBy": "2026-12-15", "sendTo": ["distributor"]}))

# Jobs + subagent queue (added with the subagent build)
job = check("POST jobs create", want_status=201, result=m.call("POST", "/api/jobs.php", {"action": "create", "title": "Smoke Medical Office TI", "location": "Pasadena, CA", "trade": "Electrical", "value": 240000, "subagents": ["projects", "exchange", "capital", "workforce"]}))
job_id = (job.get("job") or {}).get("id")
if not job_id or (job.get("job") or {}).get("status") != "pending_approval":
    print("FAIL new job is not pending_approval"); failures.append("job pending")
check("GET jobs (member)", m.call("GET", "/api/jobs.php"))
check("GET subagents", m.call("GET", "/api/subagents.php"))
if job_id:
    check("POST jobs start before approval is 409", m.call("POST", "/api/jobs.php", {"action": "start", "id": job_id}), 409, False)
    check("POST jobs approve as member is 403", m.call("POST", "/api/jobs.php", {"action": "approve", "id": job_id}), 403, False)
    check("GET jobs (admin pending)", admin.call("GET", "/api/jobs.php?scope=all&status=pending_approval"))
    check("POST jobs approve as admin", admin.call("POST", "/api/jobs.php", {"action": "approve", "id": job_id, "note": "Looks good"}))
    check("POST jobs start", m.call("POST", "/api/jobs.php", {"action": "start", "id": job_id}))
    detail = check("GET job detail", m.call("GET", f"/api/jobs.php?id={job_id}"))
    tasks = (detail.get("job") or {}).get("tasks") or []
    if len(tasks) != 4 or any(t["status"] != "running" for t in tasks):
        print("FAIL start did not set all 4 tasks running"); failures.append("tasks running")
    other = Client(); other.refresh()
    if tasks:
        check("POST task advance", m.call("POST", "/api/jobs.php", {"action": "task", "id": job_id, "taskId": tasks[0]["id"], "status": "done"}))
    for t in tasks[1:]:
        check(f"POST task {t['subagent']} done", m.call("POST", "/api/jobs.php", {"action": "task", "id": job_id, "taskId": t["id"], "status": "done"}))
    final = m.call("GET", f"/api/jobs.php?id={job_id}")[1]
    if (final.get("job") or {}).get("status") != "completed":
        print("FAIL job did not auto-complete"); failures.append("auto-complete")
    check("POST cancel completed job is 409", m.call("POST", "/api/jobs.php", {"action": "cancel", "id": job_id}), 409, False)
    check("GET another member cannot see job (anon 401)", other.call("GET", f"/api/jobs.php?id={job_id}"), 401, False)
    q = check("GET subagents (admin)", admin.call("GET", "/api/subagents.php"))
    if len(q.get("subagents", [])) != 9:
        print("FAIL subagents list is not 9"); failures.append("nine subagents")
    rej = check("POST jobs create #2", want_status=201, result=m.call("POST", "/api/jobs.php", {"action": "create", "title": "Smoke reject", "trade": "Roofing", "subagents": ["projects"]}))
    rid = (rej.get("job") or {}).get("id")
    if rid:
        check("POST jobs reject needs note", admin.call("POST", "/api/jobs.php", {"action": "reject", "id": rid}), 422, False)
        check("POST jobs reject", admin.call("POST", "/api/jobs.php", {"action": "reject", "id": rid, "note": "Out of service area"}))
check("POST jobs create invalid", m.call("POST", "/api/jobs.php", {"action": "create", "title": "", "subagents": ["nope"]}), 422, False)

check("POST logout", m.call("POST", "/api/logout.php", {}))
check("GET overview after logout is 401", m.call("GET", "/api/overview.php"), 401, False)

print()
if failures:
    print(f"{len(failures)} FAILED: " + ", ".join(failures))
    sys.exit(1)
print("All checks passed.")
