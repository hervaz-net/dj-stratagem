#!/usr/bin/env python3
"""Browser end-to-end test for the admin control panel at /admin.

Signs a new member up, then as admin: approves them, makes and unmakes them an
admin, approves a job they post, and creates, edits and deletes a catalog
listing on their behalf. Also checks a member can't open /admin.

Usage: python3 scripts/e2e-admin.py http://127.0.0.1:8080 [admin_email admin_password] [screenshot_dir]
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
EMAIL = f"panel{stamp}@djs.local"
NAME = f"Panel Tester {stamp}"
PW = "panel-password-12345"
TITLE = f"Panel Job {stamp}"
SKU = f"PNL-{stamp}"
errors = []


def shot(page, name):
    if SHOTS:
        page.screenshot(path=f"{SHOTS}/{name}.png", full_page=False)


def watch(page, who):
    page.on("console", lambda m: m.type == "error" and errors.append(f"{who}: {m.text}"))
    page.on("pageerror", lambda e: errors.append(f"{who} pageerror: {e}"))


def sign_in(page, email, pw):
    page.goto(f"{BASE}/login")
    page.locator("#email").fill(email)
    page.get_by_label("Password", exact=True).fill(pw)
    page.get_by_role("button", name=re.compile("sign in", re.I)).click()


with sync_playwright() as p:
    browser = p.chromium.launch()
    a = browser.new_context(viewport={"width": 1440, "height": 950}).new_page()
    m = browser.new_context(viewport={"width": 1440, "height": 950}).new_page()
    watch(a, "admin")
    watch(m, "member")

    # A new member signs up.
    m.goto(f"{BASE}/register")
    m.get_by_label("Full name").fill(NAME)
    m.get_by_label("Company").fill("Panel Supply Co")
    m.get_by_label("Work email").fill(EMAIL)
    m.get_by_label("Password", exact=True).fill(PW)
    m.get_by_label("Confirm password").fill(PW)
    m.get_by_role("button", name="Request access", exact=True).click()
    expect(m.get_by_text(re.compile("approv", re.I)).first).to_be_visible(timeout=10000)

    # Admin signs in and lands on the control panel.
    sign_in(a, ADMIN_EMAIL, ADMIN_PW)
    a.wait_for_url(re.compile(r"/admin$"), timeout=15000)
    expect(a.get_by_role("heading", name="Overview")).to_be_visible()
    expect(a.get_by_text("Members waiting")).to_be_visible()
    shot(a, "01-overview")
    print("PASS admin lands on /admin overview")

    # Members: approve, make admin, remove admin.
    a.get_by_role("link", name="Members", exact=True).first.click()
    a.get_by_role("tab", name=re.compile("^Waiting")).click()
    a.get_by_label("Search members").fill(EMAIL)
    row = a.locator("li").filter(has_text=EMAIL)
    expect(row).to_have_count(1, timeout=10000)
    shot(a, "02-members")
    row.get_by_role("button", name="Approve").click()
    expect(a.get_by_text(re.compile("can sign in now"))).to_be_visible(timeout=10000)
    a.get_by_role("tab", name=re.compile("^Active")).click()
    row = a.locator("li").filter(has_text=EMAIL)
    row.get_by_role("button", name="Make admin").click()
    expect(row.get_by_text("Admin", exact=True)).to_be_visible(timeout=10000)
    row.get_by_role("button", name="Remove admin").click()
    expect(row.get_by_role("button", name="Make admin")).to_be_visible(timeout=10000)
    print("PASS approve, make admin, remove admin")

    # The member signs in, can't open /admin, and posts a job.
    sign_in(m, EMAIL, PW)
    m.wait_for_url(re.compile(r"/dashboard"), timeout=15000)
    m.goto(f"{BASE}/admin")
    m.wait_for_url(re.compile(r"/dashboard/overview"), timeout=10000)
    print("PASS member is sent away from /admin")
    m.goto(f"{BASE}/dashboard/jobs")
    m.get_by_role("button", name="New job").click()
    dlg = m.get_by_role("dialog", name="New job")
    dlg.get_by_label("Job title").fill(TITLE)
    dlg.get_by_label("Location").fill("Irvine, CA")
    dlg.get_by_role("button", name="Submit for approval").click()
    expect(m.get_by_role("dialog", name=re.compile(TITLE))).to_be_visible(timeout=10000)

    # Admin approves it from the job queue.
    a.get_by_role("link", name="Job postings").first.click()
    card = a.get_by_role("article").filter(has_text=TITLE)
    expect(card).to_be_visible(timeout=10000)
    shot(a, "03-jobs")
    card.get_by_role("button", name="Approve").click()
    expect(a.get_by_role("article").filter(has_text=TITLE)).to_have_count(0, timeout=10000)
    print("PASS job approved from /admin/jobs")

    # Catalog: create for the member, edit, delete.
    a.get_by_role("link", name="Catalog").first.click()
    a.get_by_role("button", name="+ New listing").click()
    dlg = a.get_by_role("dialog", name="New catalog listing")
    dlg.get_by_label("Seller").select_option(label=f"Panel Supply Co ({NAME}) · 0 listings")
    dlg.get_by_label("SKU").fill(SKU)
    dlg.get_by_label("Category").fill("Electrical")
    dlg.get_by_label("Product name").fill("12 AWG THHN copper, 500 ft")
    dlg.get_by_label("Price (USD)").fill("96.40")
    dlg.get_by_label("Unit").fill("reel")
    dlg.get_by_label("In stock").fill("40")
    shot(a, "04-new-listing")
    dlg.get_by_role("button", name="Add listing").click()
    row = a.locator("tr").filter(has_text=SKU)
    expect(row).to_have_count(1, timeout=10000)
    row.get_by_role("button", name="Edit").click()
    dlg = a.get_by_role("dialog", name=f"Edit {SKU}")
    dlg.get_by_label("Price (USD)").fill("101.25")
    dlg.get_by_role("button", name="Save changes").click()
    expect(row.get_by_text("$101.25")).to_be_visible(timeout=10000)
    shot(a, "05-catalog")
    row.get_by_role("button", name=f"Delete {SKU}").click()
    row.get_by_role("button", name=f"Delete {SKU}").click()
    expect(a.locator("tr").filter(has_text=SKU)).to_have_count(0, timeout=10000)
    print("PASS catalog create, edit, delete for a member")

    # The member's detail page shows their job.
    a.get_by_role("link", name="Members", exact=True).first.click()
    a.get_by_label("Search members").fill(EMAIL)
    a.get_by_role("link", name=NAME).click()
    expect(a.get_by_text(TITLE)).to_be_visible(timeout=10000)
    shot(a, "06-member")
    print("PASS member detail lists their job")

    browser.close()

if errors:
    print("Console errors:")
    for e in errors:
        print("  " + e)
    sys.exit(1)
print("Admin panel E2E passed with no console errors.")
