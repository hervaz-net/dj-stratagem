#!/usr/bin/env python3
"""API test for the AI subagents, run against a dev server wired to the mock
Claude (scripts/mock-claude.py). Covers: approval starts the run, every
subagent sees the earlier work, call-backs recurse to depth 3 and no further,
the per-job task cap, retry on overload, a bad API key blocking with
retry/skip, cancel, edit-and-resubmit, and the emails each step sends.

Usage:
  python3 scripts/test-ai-subagents.py http://127.0.0.1:8081 MAIL_LOG MOCK_LOG \
      [--admin-email E --admin-password P]
The server config needs 'mail_hook' writing JSON lines to MAIL_LOG, and the
mock started with MOCK_CLAUDE_LOG=MOCK_LOG. Creates rows; use a dev database.
"""
import json
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
import http.cookiejar

BASE, MAIL_LOG, MOCK_LOG = sys.argv[1].rstrip("/"), sys.argv[2], sys.argv[3]
args = dict(zip(sys.argv[4::2], sys.argv[5::2]))
ADMIN_EMAIL = args.get("--admin-email", "admin@djs.local")
ADMIN_PW = args.get("--admin-password", "admin-password-123")
ALL = ["projects", "exchange", "platform", "solutions", "supply", "capital", "workforce", "fleet", "studio"]
failures = []


def check(label, cond, detail=""):
    print(("PASS " if cond else "FAIL ") + label + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        failures.append(label)


class Client:
    def __init__(self):
        self.op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        self.csrf = None

    def call(self, method, path, body=None):
        req = urllib.request.Request(BASE + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                     headers={"Content-Type": "application/json", **({"X-CSRF-Token": self.csrf} if self.csrf else {})})
        try:
            with self.op.open(req, timeout=60) as r:
                return r.status, json.loads(r.read() or b"{}")
        except urllib.error.HTTPError as e:
            return e.code, json.loads(e.read() or b"{}")

    def refresh(self):
        s, d = self.call("GET", "/api/me.php")
        self.csrf = d.get("csrf")
        return d

    def login(self, email, pw):
        self.refresh()
        s, d = self.call("POST", "/api/login.php", {"email": email, "password": pw})
        assert s == 200, (s, d)
        self.refresh()


def mails():
    try:
        return [json.loads(l) for l in open(MAIL_LOG)]
    except FileNotFoundError:
        return []


def wait_job(c, ref, until, timeout=90):
    end = time.time() + timeout
    job = None
    while time.time() < end:
        job = c.call("GET", f"/api/jobs.php?id={ref}")[1]["job"]
        if until(job):
            return job
        time.sleep(0.5)
    return job


stamp = str(int(time.time()))
admin = Client(); admin.login(ADMIN_EMAIL, ADMIN_PW)

# --- New member: register, approval email, sign in
member = Client(); member.refresh()
email, pw = f"ai{stamp}@djs.local", "ai-password-12345"
n0 = len(mails())
s, d = member.call("POST", "/api/register.php", {"fullName": "Ana Test", "company": "AI Builders", "email": email, "password": pw})
check("register", s == 200, d)
check("admins get the new-account notice even with admin_email blank",
      any(m["to"] == ADMIN_EMAIL and "awaiting approval" in m["subject"] and email in m["body"] for m in mails()[n0:]))
uid = int(subprocess.check_output(["mysql", "-uroot", "djs", "-N", "-e", f"SELECT id FROM users WHERE email='{email}'"]).strip())
n0 = len(mails())
s, d = admin.call("POST", "/api/admin-members.php", {"action": "status", "id": uid, "status": "active"})
check("admin approves account", s == 200, d)
time.sleep(0.5)
check("member gets an 'account approved' email", any(m["to"] == email and "approved" in m["subject"] for m in mails()[n0:]))
member.login(email, pw)


def create(title, notes="", subs=ALL):
    s, d = member.call("POST", "/api/jobs.php", {"action": "create", "title": title, "location": "Riverside, CA", "trade": "Electrical",
                                                 "value": "250,000", "notes": notes, "subagents": subs})
    assert s == 201, (s, d)
    return d["job"]["ref"]


# --- Full run: approval starts it, chain recurses to depth 3
ref = create(f"Clinic TI {stamp}")
job = member.call("GET", f"/api/jobs.php?id={ref}")[1]["job"]
check("new job waits for approval, nothing runs", job["status"] == "pending_approval" and all(t["status"] == "queued" for t in job["tasks"]))
n0 = len(mails())
s, d = admin.call("POST", "/api/jobs.php", {"action": "approve", "id": ref})
check("approve returns at once and starts the job", s == 200 and d["job"]["status"] == "in_progress", d.get("job", {}).get("status"))
job = wait_job(member, ref, lambda j: j["status"] == "completed")
check("job completes with no one clicking anything", job["status"] == "completed", job["status"])
tasks = job["tasks"]
depths = sorted(t["depth"] for t in tasks)
check("9 picked subagents + 3 call-backs ran", len(tasks) == 12 and depths.count(0) == 9, depths)
check("call-backs went 3 levels deep", max(depths) == 3, depths)
by_id = {t["id"]: t for t in tasks}
chain = [t for t in tasks if t["depth"] > 0]
check("call-back chain is Supply → Exchange → Capital → Fleet",
      [by_id[t["parentId"]]["subagent"] + ">" + t["subagent"] for t in sorted(chain, key=lambda t: t["depth"])]
      == ["supply>exchange", "exchange>capital", "capital>fleet"], [(t["subagent"], t["depth"]) for t in chain])
check("every task saved real output", all(t["status"] == "done" and t["output"].startswith("## ") for t in tasks))
log = [json.loads(l) for l in open(MOCK_LOG) if ref in l]
check("Claude got the API key, version header and forced tool", all(r["headers_ok"] and r["forced_tool"] for r in log))
order = [(r["subagent"], r["called_back"]) for r in log]
check("call-backs ran depth-first, before the pipeline moved on",
      order[4:9] == [("supply", False), ("exchange", True), ("capital", True), ("fleet", True), ("capital", False)], order)
check("each subagent saw all earlier work", [r["saw_earlier"] for r in log] == list(range(len(log))), [r["saw_earlier"] for r in log])
check("depth-3 call-back was offered no further handoffs", [r["handoffs_offered"] for r in log if r["subagent"] == "fleet" and r["called_back"]] == [False])
time.sleep(0.5)
subj = [m["subject"] for m in mails()[n0:] if m["to"] == email]
check("owner emailed on approval and on completion", any("approved" in x for x in subj) and any("done" in x for x in subj), subj)
events = " | ".join(e["message"] for e in job["events"])
check("timeline shows call-backs", "called Exchange back in" in events)

# --- Loop guard: every subagent asks for two call-backs
ref2 = create(f"Loop {stamp}", "MOCK_LOOP")
admin.call("POST", "/api/jobs.php", {"action": "approve", "id": ref2})
job = wait_job(member, ref2, lambda j: j["status"] == "completed", 120)
check("runaway call-backs are capped at 24 tasks and the job still finishes",
      job["status"] == "completed" and len(job["tasks"]) == 24 and max(t["depth"] for t in job["tasks"]) <= 3,
      (job["status"], len(job["tasks"])))

# --- Overload: retried automatically
ref3 = create(f"Overload {stamp}", "MOCK_OVERLOAD_ONCE", ["projects", "platform"])
admin.call("POST", "/api/jobs.php", {"action": "approve", "id": ref3})
job = wait_job(member, ref3, lambda j: j["status"] == "completed", 60)
check("overloaded API is retried and the job completes", job["status"] == "completed" and job["tasks"][0]["attempts"] == 2,
      (job["status"], [t["attempts"] for t in job["tasks"]]))

# --- Bad key: blocks, stops the chain, emails the owner; retry and skip work
ref4 = create(f"BadKey {stamp}", "MOCK_BAD_KEY", ["projects", "platform", "studio"])
n0 = len(mails())
admin.call("POST", "/api/jobs.php", {"action": "approve", "id": ref4})
job = wait_job(member, ref4, lambda j: any(t["status"] == "blocked" for t in j["tasks"]), 30)
st = [t["status"] for t in job["tasks"]]
check("rejected key blocks the first subagent and stops the chain", st == ["blocked", "queued", "queued"], st)
check("blocked note explains it", "API key" in job["tasks"][0]["note"], job["tasks"][0]["note"])
time.sleep(0.5)
check("owner emailed that the job needs attention", any(m["to"] == email and "attention" in m["subject"] for m in mails()[n0:]))
s, d = member.call("POST", "/api/jobs.php", {"action": "retry", "id": ref4, "taskId": job["tasks"][0]["id"]})
check("owner can retry a blocked subagent", s == 200, d)
job = wait_job(member, ref4, lambda j: j["tasks"][0]["status"] == "blocked", 20)
s, d = member.call("POST", "/api/jobs.php", {"action": "skip", "id": ref4, "taskId": job["tasks"][0]["id"]})
check("owner can skip a blocked subagent", s == 200 and d["job"]["tasks"][0]["status"] == "skipped", d)
s, d = member.call("POST", "/api/jobs.php", {"action": "cancel", "id": ref4})
check("cancel closes a running job", s == 200 and d["job"]["status"] == "cancelled")

# --- Cancel while a subagent is mid-call: its result must not overwrite the cancel
for notes, label in (("MOCK_SLOW", "succeeds"), ("MOCK_SLOW MOCK_BAD_KEY", "fails")):
    r = create(f"Slow {label} {stamp}", notes, ["projects", "studio"])
    n0 = len(mails())
    admin.call("POST", "/api/jobs.php", {"action": "approve", "id": r})
    wait_job(member, r, lambda j: j["tasks"][0]["status"] == "running", 10)
    member.call("POST", "/api/jobs.php", {"action": "cancel", "id": r})
    time.sleep(6)
    j = member.call("GET", f"/api/jobs.php?id={r}")[1]["job"]
    check(f"cancel mid-call holds when the call {label}",
          j["status"] == "cancelled" and [t["status"] for t in j["tasks"]] == ["skipped", "skipped"] and not j["tasks"][0]["output"],
          (j["status"], [(t["status"], bool(t["output"])) for t in j["tasks"]]))
    check(f"no 'needs attention' email after cancel ({label})", not any("attention" in m["subject"] for m in mails()[n0:]))

# --- Reject → email → edit & resubmit
ref5 = create(f"Reject {stamp}", "", ["projects"])
n0 = len(mails())
admin.call("POST", "/api/jobs.php", {"action": "reject", "id": ref5, "note": "Add the site address."})
time.sleep(0.5)
check("owner emailed the rejection reason", any(m["to"] == email and "needs changes" in m["subject"] and "site address" in m["body"] for m in mails()[n0:]))
s, d = member.call("POST", "/api/jobs.php", {"action": "resubmit", "id": ref5, "title": f"Reject {stamp} v2", "location": "1 Main St, Riverside, CA",
                                             "subagents": ["projects", "studio"]})
check("rejected job can be edited and resubmitted",
      s == 200 and d["job"]["status"] == "pending_approval" and d["job"]["subagents"] == ["projects", "studio"] and not d["job"]["decisionNote"], d)
s, d = admin.call("POST", "/api/jobs.php", {"action": "resubmit", "id": ref5, "title": "x", "subagents": ["projects"]})
check("only the owner can resubmit", s in (403, 409), s)

# --- A model the account can't use: clear, fixable message
ref6 = create(f"BadModel {stamp}", "MOCK_BAD_MODEL", ["projects"])
admin.call("POST", "/api/jobs.php", {"action": "approve", "id": ref6})
job = wait_job(member, ref6, lambda j: j["tasks"][0]["status"] == "blocked", 20)
check("unavailable model blocks with a message naming ai.model", "ai.model" in job["tasks"][0]["note"], job["tasks"][0]["note"])
member.call("POST", "/api/jobs.php", {"action": "cancel", "id": ref6})

# --- Kicks can't be forged
s, d = Client().call("POST", "/api/jobs-run.php", {"id": 1, "kick": {"ts": int(time.time()), "sig": "0" * 64}})
check("forged kick is refused", s == 403, s)
s, d = Client().call("POST", "/api/jobs-run.php", {"id": 1})
check("anonymous nudge is refused", s in (401, 403), s)

# --- Password reset
# Dev database: earlier runs from this IP count toward the 5-per-window limit.
subprocess.run(["mysql", "-uroot", "djs", "-e", "DELETE FROM login_attempts WHERE email = '@reset request'"], check=True)
anon = Client(); anon.refresh()
n0 = len(mails())
s, d = anon.call("POST", "/api/password-reset.php", {"action": "request", "email": email})
s2, d2 = anon.call("POST", "/api/password-reset.php", {"action": "request", "email": f"nobody{stamp}@djs.local"})
check("reset request answers the same for unknown emails", s == s2 == 200 and d["message"] == d2["message"], (s, s2))
time.sleep(0.5)
reset = [m for m in mails()[n0:] if m["to"] == email and "Reset" in m["subject"]]
check("reset email sent to the real account only", len(reset) == 1 and len(mails()[n0:]) == 1)
token = reset[0]["body"].split("token=")[1].split()[0] if reset else ""
s, d = anon.call("POST", "/api/password-reset.php", {"action": "reset", "token": token, "password": "short"})
check("weak new password refused", s == 422)
new_pw = "brand-new-password-987"
s, d = anon.call("POST", "/api/password-reset.php", {"action": "reset", "token": token, "password": new_pw})
check("password reset with the emailed link", s == 200, d)
s, d = anon.call("POST", "/api/password-reset.php", {"action": "reset", "token": token, "password": new_pw + "x"})
check("reset link works only once", s == 400)
# Two submits of one link at the same moment: exactly one may win.
n0 = len(mails())
anon.call("POST", "/api/password-reset.php", {"action": "request", "email": email})
time.sleep(0.5)
token2 = [m for m in mails()[n0:] if m["to"] == email][-1]["body"].split("token=")[1].split()[0]
results = []
racers = [Client() for _ in range(4)]
for r in racers:
    r.csrf = anon.csrf
    r.op = anon.op
threads = [threading.Thread(target=lambda r=r, i=i: results.append(
    r.call("POST", "/api/password-reset.php", {"action": "reset", "token": token2, "password": f"race-password-{i}-abcdef"})[0]))
    for i, r in enumerate(racers)]
[t.start() for t in threads]
[t.join() for t in threads]
check("simultaneous submits of one reset link: exactly one succeeds", sorted(results) == [200, 400, 400, 400], results)
def can_login(pw_try):
    c = Client(); c.refresh()
    return c.call("POST", "/api/login.php", {"email": email, "password": pw_try})[0] == 200
winners = [f"race-password-{i}-abcdef" for i in range(4) if can_login(f"race-password-{i}-abcdef")]
check("only the winning password works", len(winners) == 1, winners)
new_pw = winners[0] if winners else new_pw
c = Client(); c.refresh()
s, d = c.call("POST", "/api/login.php", {"email": email, "password": new_pw})
check("sign in with the new password", s == 200, d)
for _ in range(4):
    s, d = anon.call("POST", "/api/password-reset.php", {"action": "request", "email": email})
check("reset requests are rate limited per IP", s == 429, s)

# --- Admin overview shows AI status
s, d = admin.call("GET", "/api/admin-overview.php")
check("admin overview reports the AI engine and usage", s == 200 and d["ai"]["configured"] and d["ai"]["runs"] > 0 and d["ai"]["tokensOut"] > 0, d.get("ai"))

print("\nAll checks passed." if not failures else f"\n{len(failures)} FAILED: " + ", ".join(failures))
sys.exit(1 if failures else 0)
