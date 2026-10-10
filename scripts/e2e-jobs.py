#!/usr/bin/env python3
"""Browser end-to-end test: register → admin approves account → sign in →
create job → admin approves job → start → finish every task → completed.

Usage: python3 scripts/e2e-jobs.py http://127.0.0.1:8080 [admin_email admin_password] [screenshot_dir]
Needs Python Playwright with Chromium. Creates real rows; use a dev database.
"""
import re
import sys
import time
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:8080"
ADMIN_EMAIL = sys.argv[2] if len(sys.argv) > 2 else "admin@djs.local"
ADMIN_PW = sys.argv[3] if len(sys.argv) > 3 else "admin-password-123"
SHOTS = sys.argv[4] if len(sys.argv) > 4 else None

stamp = str(int(time.time()))
EMAIL = f"e2e{stamp}@djs.local"
PW = "e2e-password-12345"
TITLE = f"E2E Clinic TI {stamp}"
console_errors = []


def shot(page, name):
    if SHOTS:
        page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


def watch(page, who):
    page.on("console", lambda m: m.type == "error" and console_errors.append(f"{who}: {m.text}"))
    page.on("pageerror", lambda e: console_errors.append(f"{who} pageerror: {e}"))


def sign_in(page, email, pw):
    page.goto(f"{BASE}/login")
    page.locator("#email").fill(email)
    page.get_by_label("Password", exact=True).fill(pw)
    page.get_by_role("button", name=re.compile("sign in", re.I)).click()
    page.wait_for_url(re.compile(r"/dashboard"), timeout=15000)


with sync_playwright() as p:
    browser = p.chromium.launch()
    member_ctx = browser.new_context(viewport={"width": 1440, "height": 1000})
    admin_ctx = browser.new_context(viewport={"width": 1440, "height": 1000})
    m = member_ctx.new_page(); watch(m, "member")
    a = admin_ctx.new_page(); watch(a, "admin")

    # 1. Register
    m.goto(f"{BASE}/register")
    m.get_by_label("Full name").fill("E2E Member")
    m.get_by_label("Company").fill("E2E Builders")
    m.get_by_label("Work email").fill(EMAIL)
    m.get_by_label("Password", exact=True).fill(PW)
    m.get_by_label("Confirm password").fill(PW)
    m.get_by_role("button", name="Request access", exact=True).click()
    expect(m.get_by_text(re.compile("approv", re.I)).first).to_be_visible(timeout=10000)
    print("PASS register shows pending message")

    # 2. Admin approves the account
    sign_in(a, ADMIN_EMAIL, ADMIN_PW)
    a.goto(f"{BASE}/dashboard/admin")
    row = a.get_by_role("row").filter(has_text=EMAIL)
    row.get_by_role("button", name="Approve").click()
    expect(a.get_by_text(re.compile("approved", re.I)).first).to_be_visible(timeout=10000)
    print("PASS admin approved account")

    # 3. Member signs in and creates a job
    sign_in(m, EMAIL, PW)
    m.goto(f"{BASE}/dashboard/jobs")
    expect(m.get_by_role("heading", name="Jobs", exact=True)).to_be_visible()
    shot(m, "01-jobs-empty")
    m.get_by_role("button", name="New job").click()
    dlg = m.get_by_role("dialog", name="New job")
    dlg.get_by_label("Job title").fill(TITLE)
    dlg.get_by_label("Location").fill("Pasadena, CA")
    dlg.get_by_label("Trade").fill("Electrical")
    dlg.get_by_label(re.compile("Job value")).fill("240000")
    shot(m, "02-new-job")
    dlg.get_by_role("button", name="Submit for approval").click()
    drawer = m.get_by_role("dialog", name=re.compile(TITLE))
    expect(drawer.get_by_text("Awaiting approval").first).to_be_visible(timeout=10000)
    expect(drawer.get_by_role("button", name=re.compile("Start all"))).to_have_count(0)
    print("PASS job created, awaiting approval, no start button")
    drawer.get_by_role("button", name="Close job details").click()

    # 4. Admin approves the job on the Approvals screen
    a.goto(f"{BASE}/dashboard/approvals")
    card = a.get_by_role("article").filter(has_text=TITLE)
    expect(card).to_be_visible(timeout=15000)
    shot(a, "03-approvals")
    card.get_by_role("button", name="Approve").click()
    expect(a.get_by_role("article").filter(has_text=TITLE)).to_have_count(0, timeout=10000)
    print("PASS admin approved job")

    # 5. Member starts it: all nine subagents run at once
    m.reload()
    m.get_by_role("button", name=re.compile(TITLE)).click()
    drawer = m.get_by_role("dialog", name=re.compile(TITLE))
    drawer.get_by_role("button", name="Start all 9 subagents").click()
    expect(drawer.get_by_text("Running", exact=True)).to_have_count(9, timeout=10000)
    shot(m, "04-running")
    print("PASS all 9 subagents running")

    # 6. Finish every task → job completes
    for _ in range(9):
        drawer.get_by_role("button", name="Mark done").first.click()
        m.wait_for_timeout(300)
    expect(drawer.get_by_text("Completed").first).to_be_visible(timeout=10000)
    expect(drawer.get_by_text("9/9")).to_be_visible()
    shot(m, "05-completed")
    print("PASS job completed 9/9")

    # 7. Member cannot reach the admin screens
    m.goto(f"{BASE}/dashboard/approvals")
    m.wait_for_url(re.compile(r"/dashboard/jobs"), timeout=10000)
    print("PASS member redirected away from approvals")

    browser.close()

if console_errors:
    print("Console errors:")
    for e in console_errors:
        print("  " + e)
    sys.exit(1)
print("E2E passed with no console errors.")
