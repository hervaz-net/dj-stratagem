# D&J Stratagem, Inc. — marketing site

Marketing site for D&J Stratagem: **the operating system for construction growth**.
Helps contractors win more work, market their business, source materials, and manage the
entire bidding pipeline from opportunity to award.

Tagline: **Win More Projects. Build Bigger Business.**

Built with React, Vite, React Router, and Tailwind CSS v4. Live at
[djstratageminc.com](https://djstratageminc.com).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Positioning, the six platform pillars, competitive framing |
| `/platform` | Deep dive on all six suites |
| `/solutions` | Tabbed by audience: general contractors, subcontractors, suppliers |
| `/supply` | Supply Exchange — B2B materials sourcing and its bidding model |
| `/pricing` | Starter / Professional / Growth / Enterprise, plus add-ons |
| `/about` | Mission and positioning vs. PlanHub, Dodge, BuildingConnected, ConstructConnect |
| `/contact` | Demo request form (see below) |
| `/login` | Sign-in portal (placeholder auth — see below). `noindex` |
| `*` | 404 page |

Each route sets its own `<title>`, description, canonical URL, and Open Graph tags
via the `Seo` component; `index.html` only supplies the defaults.

### The six platform suites

1. **For general contractors** — post projects, invite subs, compare bids, manage RFIs and
   addenda, track deadlines, award contracts, rate vendor performance.
2. **For subcontractors** — trade-matched projects, digital bids, profile and portfolio,
   license/insurance verification, bid analytics, follow-up CRM.
3. **Marketing suite** — SEO profiles, lead gen, AI proposals, email/SMS campaigns, Google
   Business Profile, reviews and reputation, social content.
4. **Supply Exchange** — sourcing for always-in-demand materials (see below).
5. **Business tools** — CRM, estimating, invoicing, change orders, document management,
   e-signatures, team collaboration, mobile app with field notifications.
6. **AI features** — project matching, bid competitiveness prediction, proposal drafts,
   plan/spec analysis, missing-document detection, pipeline forecasting.

## Supply Exchange: the bidding model

Supply Exchange sources commodity construction materials — fasteners and hardware, power
tools, electrical, lumber and slabs, metal plate/rod/structural, plumbing PVC and fittings,
plumbing hardware, safety consumables.

It deliberately **avoids a conventional open reverse auction**. Multi-round bid wars destroy
supplier margin, which comes back as substitutions, short shipments, and slipped dates — and
iterative bidding takes days that a materials order doesn't have.

Instead, four mechanisms:

- **Sealed single-round quotes.** Suppliers can't see competitors' numbers and can't re-bid,
  so there's no undercutting spiral.
- **Multi-factor scored awards.** The buyer sets weights across price, lead time, fill rate,
  delivery, and past performance. Best total score wins, not the lowest line.
- **Auto-award at deadline.** A fixed bid window (hours, not days) closes and the system
  awards automatically.
- **Line-item split awards.** Award different lines to different suppliers to get a 100% fill
  instead of a partial fill from the cheapest bidder.

Two mechanisms take repeat volume off the bidding table entirely:

- **Standing price books** — tiered contract pricing that stays live for frequently reordered
  SKUs; bidding happens on the price book periodically, not per purchase order.
- **Pooled demand** — same-SKU demand aggregated across contractors to reach volume tiers a
  small shop couldn't reach alone, while the supplier gets one large committed block.

Supplier-side protections: per-SKU floor pricing, non-price win paths, larger committed POs,
and performance ratings that compound into better future matching.

## Design system

Colors are semantic tokens, not literal names — `ink` is the recessed surface,
`ink-2` the raised card surface, `paper` the text color, `steel` muted text
(chroma-free, so it never reads as a link), `line` borders, and `amber` the
accent text. Each Tailwind token in `src/index.css` is declared inside
`@theme inline` and resolves through a second variable (`--surface`, `--text`,
`--accent`, …), so `[data-theme="dark"]` swaps the whole palette without
touching a single component.

Chromatic tokens have one job each: `amber` is contrast-tuned electric-blue
text and selected chrome; `brand` is the `#001cf7` identity fill; `cta` is
coral primary buttons (white-on-cta ≥ 4.5:1); `warning` is watch/caution
gold; `danger` and `success` are status. CTA is never the same hex as danger.

The theme follows the OS by default and remembers an explicit choice in
`localStorage` under `djs-theme`. A small inline script in `index.html` applies
it before first paint so dark-theme visitors never see a white flash.

Motion is opt-in via the `lift` class and the `Reveal` component rather than
blanket `transition: all` rules, and everything collapses under
`prefers-reduced-motion: reduce`.

## Development

```bash
npm install
npm run dev
```

Lint with `npm run lint` (oxlint).

## Build

```bash
npm run build
```

Outputs to `dist/`. That folder is a complete static site: HTML/CSS/JS plus three files copied
straight from `public/`:

- **`.htaccess`** — Apache/LiteSpeed rewrite rules so client-side routes load correctly on
  direct visit or refresh, plus long cache lifetimes for hashed assets.
- **`contact.php`** — server-side handler for the contact form.
- **`robots.txt`** / **`sitemap.xml`** — kept in sync with the routes above.

## Deployment

Hosted on **Namecheap Stellar shared hosting** (cPanel + LiteSpeed), deployed via cPanel's
Git Version Control.

Two branches:

- **`main`** — source of truth. Full source tree.
- **`deploy`** — build output only (the contents of `dist/`) plus `.cpanel.yml`. This is the
  branch cPanel checks out, so the server never needs Node or a build step.

### Shipping a change

Preferred path, from a machine that has Node, git, curl, and `~/.cpanel_token`:

```bash
git checkout main && git pull origin main
./deploy.sh
```

That script builds `dist/`, replaces the `deploy` branch, asks cPanel to pull, runs
`.cpanel.yml`, and checks that the live homepage JS hash matches the build.

Do **not** copy the old one-liner `rsync -a` into `.cpanel.yml`. `-a` copies perms and
group from the git checkout (`djstlime:djstlime` mode `0700`). The web server runs as
`nobody`, so every `/assets/*` GET 404s while the directory index can still render.
`deploy.sh` writes `-rltD` plus chmod/chgrp tasks so `public_html` ends as
`djstlime:nobody` mode `0750`.

If you cannot run `deploy.sh`, after someone has already pushed a fresh `deploy` tip:
cPanel → **Git™ Version Control** → `dj-stratagem` → **Update from Remote** →
**Deploy HEAD Commit**.

> Note: `rsync --delete` briefly empties `public_html` mid-sync. A request during that window
> can return a directory listing or 404s. Re-check ~10 seconds after deploying before
> concluding something broke.

> Namecheap account suspension (`/cgi-sys/suspendedpage.cgi`) is a billing/host lock,
> not a git failure. Unsuspend the Stellar account before any cPanel pull will go live.

### Contact form

The Contact page posts to `/contact.php`, a same-origin PHP script that validates fields and
sends via PHP `mail()` to the configured destination address, with the submitter as `Reply-To`.
A hidden honeypot field (`bot-field`) silently discards bot submissions.

This only works on real PHP hosting — `npm run dev` has no PHP runtime, so local submissions
fail with a fetch error and surface the form's error state. That's expected.

**Deliverability:** shared-hosting `mail()` is sometimes spam-filtered. If demo requests aren't
arriving, check spam first. The durable fix is sending through an authenticated mailbox on the
domain (create one in cPanel, switch `contact.php` from `mail()` to SMTP).

## Outstanding

- **SSL is not yet issued.** `https://` fails; the site currently serves over HTTP only.
  Namecheap Stellar includes free AutoSSL, which validates over port 80 — that was broken
  during initial setup, so issuance kept failing. It should provision on a subsequent AutoSSL
  run now that HTTP works; if not, ask Namecheap support to trigger AutoSSL for the account.
  Once issued, add an HTTPS redirect to `.htaccess`.
- **Auth is built but must stay off until SSL is issued.** See Authentication
  below — `require_https` refuses to serve the endpoints over plaintext HTTP,
  which is correct and deliberate. Do not disable it to "get it working".
- Pricing figures are placeholders pending a real pricing decision. The annual
  toggle derives its numbers from a flat 20% discount constant in `Pricing.jsx`.
- Screenshots/mock panels throughout the site are illustrative, not live product.

## Operations dashboard

`/dashboard/*` is session-gated (`noindex`). `/dashboard` redirects to
`/dashboard/overview`. The route guard is a convenience — the PHP APIs
are the real boundary.

Screens: **Overview**, **Suppliers**, **Bids**, **Orders**, **Analytics**,
**Alerts**, **Settings**, plus **Accounts** for admins.

### Dashboard APIs

Every dashboard screen talks to same-origin `/api/*.php` (session cookie
`djs_session`). POSTs send `X-CSRF-Token`. Tables are created and seeded
automatically on the first authenticated request (`ops.php`).

`npm run dev` has no PHP runtime, so fetchers fall back to fixtures in
`src/api/fixtures.js`. Mutations (add supplier, new bid, cancel order,
alert actions, settings saves) toast an error locally — that is expected.
Set `VITE_API_BASE_URL` only if the PHP host is on another origin.

| Endpoint | Methods | Used by |
| --- | --- | --- |
| `/api/suppliers.php` | GET list, POST create (`name`, `category`, `region`) | Suppliers |
| `/api/metrics.php` | GET (computed from suppliers) | Suppliers |
| `/api/market-ticker.php` | GET | Suppliers ticker |
| `/api/overview.php` | GET KPIs, activity, deadlines, alerts, health | Overview |
| `/api/bids.php` | GET list; POST `{action:"create"}` or `{action:"status", id, status}` | Bids |
| `/api/orders.php` | GET list; POST `{action:"cancel", ids}` | Orders |
| `/api/analytics.php?range=7d\|30d\|90d` | GET live aggregates | Analytics |
| `/api/alerts.php` | GET list; POST `{action: read\|read_all\|dismiss\|snooze, id?}` | Alerts |
| `/api/settings.php` | GET; POST `{action: profile\|notifications\|twofa\|billing\|account_type\|fund}` | Settings |

All of the above require a signed-in `active` session. A 401 is never
swallowed as sample data.

```
Supplier   { id, name, category, region, riskScore (0-100, higher = worse),
             deliveryRate (0-100), fillRate, leadTimeDays,
             status: "active"|"watch"|"at-risk", openOrders, spendYtd,
             trend: number[] }
Bid        { id, project, gc, trade, value, status, due, submitted }
             status: "draft"|"submitted"|"review"|"awarded"|"lost"
Order      { id, supplier, items, category, qty, value, status, ordered, eta }
             status: "pending"|"confirmed"|"shipped"|"delivered"|"cancelled"
Alert      { id, type, title, detail, supplier, time, group, read }
             type: "risk"|"delivery"|"price"|"bid"|"system"
```

Suppliers/metrics poll every 30s, the ticker every 15s; polling pauses
on a hidden tab. On a failed poll the last good data stays on screen
with a retry prompt.

Exact shapes live in `src/api/dashboard.js` and `src/api/fixtures.js`.

## Authentication

`/login` and `/register` are backed by PHP endpoints under `public/api/`,
matching the existing `contact.php` pattern. Accounts are **approval-gated**:
registering creates a `pending` row that cannot sign in until an admin activates
it.

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/me.php` | GET | Current user (or `null`) + a CSRF token |
| `/api/register.php` | POST | Creates a `pending` account |
| `/api/login.php` | POST | Authenticates an `active` account, starts a session |
| `/api/logout.php` | POST | Destroys the session |
| `/api/admin-users.php` | GET | Lists accounts + per-status counts (admin only) |
| `/api/admin-user-status.php` | POST | Approve / suspend / reinstate (admin only) |

### ⚠️ Do not enable before HTTPS

`require_https` is `true` by default and the endpoints return `403
https_required` over plaintext. This is deliberate: passwords and session
cookies sent over HTTP are readable by anyone on the network path, and the
session cookie's `Secure` flag means it won't be sent at all. **Get AutoSSL
issued first** (see Outstanding), then this starts working on its own.

Set `require_https` to `false` only for local development against
`http://localhost`.

### Server setup

1. **Create the database** — cPanel → MySQL® Databases. Create a database and a
   user, and grant the user all privileges on it. cPanel prefixes both with your
   account name (e.g. `djstlime_djs`).

2. **Import the schema** — phpMyAdmin → your database → Import →
   `public_html/api/schema.sql`.

3. **Create the config above the docroot:**

   ```bash
   cp public_html/api/config.example.php ~/djs-config.php
   chmod 600 ~/djs-config.php
   ```

   Fill in the database credentials. It lives outside `public_html` on purpose:
   nothing there is web-reachable even if PHP breaks, and the deploy's
   `rsync --delete` can't wipe it. `bootstrap.php` also accepts a `DJS_CONFIG`
   env var, or `api/config.php` for local development (gitignored).

### Approving an account

Registration emails the address in `admin_email`. Approve or decline at
**`/dashboard/admin`** — no SQL required.

`status` is `pending` | `active` | `suspended`. Only `active` can sign in;
suspending takes effect on the user's *next request*, not their next login, so
a suspended user is cut off mid-session.

An admin cannot suspend their own account — doing so would lock them out of the
only screen that could undo it.

### Creating the first admin

The admin screen is gated on `role = 'admin'`, and registration always creates
`role = 'member'`. Promote the first one by hand, once:

```sql
UPDATE users SET role = 'admin', status = 'active', approved_at = UTC_TIMESTAMP()
 WHERE email = 'you@example.com';
```

After that, approvals happen in the UI. The **Accounts** item only appears in
the sidebar for admins, but that is presentation — `admin-users.php` and
`admin-user-status.php` reject non-admins with 403 regardless of what the
client renders.

### Security properties

- Passwords hashed with `password_hash()` (bcrypt by default), rehashed on
  login when the algorithm default moves.
- **No user enumeration.** Login returns one message for unknown-email and
  wrong-password, and always runs a hash comparison so response time doesn't
  differ. Register returns the same response whether or not the address exists.
- **Throttled** on two axes — failures per email and per IP, default 5 and 20 in
  a 15-minute window. Only failures count.
- Session cookie is `HttpOnly`, `SameSite=Lax`, and `Secure` under HTTPS. The ID
  is regenerated on login to defeat fixation.
- CSRF token required on every state-changing request.
- `api/.htaccess` denies direct access to `config.php`, `bootstrap.php`, and
  `schema.sql`, so a broken PHP handler can't serve credentials as plaintext.
- DB errors are logged server-side and returned to the client as a generic
  `server_error` — no driver messages or SQL reach the browser.

### Not built yet

Password reset, email verification of the registrant's own address, and
"remember me".
