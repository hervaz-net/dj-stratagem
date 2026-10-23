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
`--accent`, …).

Chromatic tokens have one job each: `amber` is contrast-tuned electric-blue
text and selected chrome; `brand` is the `#001cf7` identity fill; `cta` is
coral primary buttons (white-on-cta ≥ 4.5:1); `warning` is watch/caution
gold; `danger` and `success` are status. CTA is never the same hex as danger.

The site is light-only. An inline script in `index.html` sets `data-theme="light"`
before first paint and clears any previously saved dark preference from
`localStorage`. There is no theme toggle.

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

> If the account is ever locked again (`/cgi-sys/suspendedpage.cgi`), that is a
> Namecheap billing/host lock, not a git or Vite failure. Unsuspend the Stellar
> account before any cPanel pull will go live.

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

- **Namecheap account is live again.** Re-checked 1 Oct 2026 09:54 PDT:
  apex `https://djstratageminc.com/` returns 200 (not the suspended CGI).
  `/api/health.php` and `/api/me.php` return JSON. Do not treat a 302 to
  `/cgi-sys/suspendedpage.cgi` as current.
- **Stratagem AI needs its API key and cron job on the server** before
  approved jobs can run. See "Jobs and subagents (Stratagem AI)" below.
- **cPanel can lag GitHub `deploy`.** On 13 Oct 2026 live matched `main`.
  Actions builds and pushes `deploy`, then Pull and deploy fails while repo
  secret `CPANEL_TOKEN` is empty. After `main` updates:
  `./deploy.sh` on a machine with `~/.cpanel_token`, or cPanel → Git Version
  Control → `dj-stratagem` → Update from Remote → Deploy HEAD Commit. Confirm
  `public_html` is `djstlime:nobody` mode `0750`. Do not rsync with `-a`.
  Do not point cPanel at `main`.
- **`/changelog` was broken on `main` and restored in 1.78.** Audit 1.77
  (`0f51e8c`) replaced `src/pages/Changelog.jsx` with `PLACEHOLDER_REVERT`.
  Restored in 1.78 (`da55f5d`). Do not overwrite that file with a host-audit
  placeholder again.
- HTTPS is live (AutoSSL). Auth endpoints stay HTTPS-only via `require_https`.
  Do not disable that flag to "get it working" on plaintext.
- Pricing figures are placeholders pending a real pricing decision. The annual
  toggle derives its numbers from a flat 20% discount constant in `Pricing.jsx`.
- Screenshots/mock panels throughout the site are illustrative, not live product.

## Operations dashboard

`/dashboard/*` is session-gated (`noindex`). `/dashboard` redirects to
`/dashboard/overview`. The route guard is a convenience — the PHP APIs
are the real boundary.

Screens: **Overview**, **Suppliers**, **Bids**, **Orders**, **Analytics**,
**Alerts**, **Settings**, plus **Accounts** for admins.

### Jobs and subagents (Stratagem AI)

Members submit a job at `/dashboard/jobs` and pick which of the nine
subagents (Projects, Exchange, Platform, Solutions, Supply, Capital,
Workforce, Fleet, Studio) should work it. Every job lands in
`pending_approval`; **nothing runs until an admin approves it**. Approval
starts the run, and the subagents work on their own on the Claude API
(`public/api/ai-lib.php`):

- **Chained.** Subagents run one after another in pipeline order. Each one
  gets the job details, its own brief, and every earlier subagent's work.
- **Recursive call-backs.** A subagent can call up to two others back in
  for follow-up work. A call-back runs next, one level deeper, and can make
  its own call-backs (depth-first), up to 3 levels. A job is capped at 24
  tasks so it can't run away on cost.
- **Failures.** Rate limits, overloads and network errors retry (3 attempts,
  with backoff). Anything else, including a missing or rejected API key,
  blocks that subagent, pauses the chain, and emails the owner, who can
  **Retry** or **Skip** it. A cancel always wins over a call still in flight.
- **Output.** Each subagent's Markdown write-up shows in the job panel and
  downloads as one `.md` file. It's AI-generated planning and drafting; the
  subagents don't book, buy, fund or submit anything themselves.
- **Emails.** Owner: approved (running), rejected (with reason, then
  **Edit and resubmit**), needs attention, completed. Admins: new and
  resubmitted jobs (to `admin_email`, or every active admin if it's blank).

**Turning it on (one time):**

1. Add an Anthropic API key to `~/djs-config.php` under
   `'ai' => ['api_key' => '…', 'model' => 'claude-sonnet-5-5']` (see
   `config.example.php`). Usage is billed to that Anthropic account; the
   `/admin` overview shows the engine status and tokens used.
2. Add the worker in cPanel → Cron Jobs, every minute:
   `/usr/local/bin/php /home/djstlime/public_html/api/ai-worker.php >/dev/null 2>&1`
   Jobs also advance without it (each finished task triggers the next over
   a signed loopback request, and an open job panel nudges it along), but
   the cron job is the guarantee if the host blocks loopback requests.

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/jobs.php` | GET | Own jobs + counts (`scope=all` for admins, `status=` filter) |
| `/api/jobs.php?id=` | GET | One job with tasks, each subagent's output, and activity |
| `/api/jobs.php` | POST `{action}` | `create`, `resubmit` (owner, rejected jobs), `approve` (admin; starts the run), `reject` (admin; needs `note`), `retry`/`skip` `{taskId}`, `cancel`, `start` (jobs approved before auto-start) |
| `/api/jobs-run.php` | POST `{id}` | Nudges a running job (owner/admin, or a signed internal kick) |
| `/api/subagents.php` | GET | The nine subagents with live waiting/working/blocked/done counts |
| `/api/password-reset.php` | POST | `request {email}` emails a one-hour link; `reset {token, password}` |

Tables `jobs`, `job_tasks`, `job_events` and `password_resets` are created
and upgraded automatically on first use, so an existing database needs no
manual migration. Members only ever see their own jobs (someone else's id
returns 404); admins see everything. The nine subagents are listed in three
files (`src/data/subagents.js`, `src/api/jobs.js`, `public/api/jobs-lib.php`);
`scripts/check-subagents.mjs` fails the build if they ever disagree.

### Testing against a real database

```bash
# PHP + MySQL running, public/api/config.php pointing at a dev database,
# an admin account created (see "Creating the first admin").
# For the AI tests, point the dev config at the mock Claude:
#   'ai' => ['api_key' => 'test', 'base_url' => 'http://127.0.0.1:8765'],
#   'site_url' => 'http://127.0.0.1:8080',
#   'mail_hook' => fn ($to, $subject, $body) => file_put_contents('/tmp/mail.log', json_encode(compact('to','subject','body'))."\n", FILE_APPEND),
MOCK_CLAUDE_LOG=/tmp/mock.log python3 scripts/mock-claude.py 8765 &
npm run build && php -S 127.0.0.1:8080 -t dist <router.php>
python3 scripts/smoke-api.py http://127.0.0.1:8080 --admin-email you@example.com --admin-password '…'
python3 scripts/test-ai-subagents.py http://127.0.0.1:8080 /tmp/mail.log /tmp/mock.log --admin-email you@example.com --admin-password '…'
python3 scripts/e2e-jobs.py  http://127.0.0.1:8080 you@example.com '…'   # needs Python Playwright
python3 scripts/e2e-admin.py http://127.0.0.1:8080 you@example.com '…'
```

`smoke-api.py` calls every endpoint signed out, as a member and as an admin.
`test-ai-subagents.py` checks the AI run end to end: approval starts it,
each subagent sees earlier work, call-backs recurse 3 deep and no further,
the task cap, retry on overload, a bad key blocking with retry/skip, cancel
mid-call, edit and resubmit, every email, and password reset.
`e2e-jobs.py` drives a real browser through register → account approval →
new job → approval → the subagents finishing on their own → reading the
output → reject and resubmit. All of them create rows, so never point them
at production.

### Dashboard APIs

Every dashboard screen talks to same-origin `/api/*.php` (session cookie
`djs_session`). POSTs send `X-CSRF-Token`. Tables are created and seeded
automatically on the first authenticated request (`ops.php`).

`npm run dev` has no PHP runtime, so fetchers fall back to fixtures in
`src/api/fixtures.js`. Mutations (add supplier, new bid, cancel order,
alert actions, settings saves) toast an error locally — that is expected.
Set `VITE_API_BASE_URL` only if the PHP host is on another origin.

| Endpoint | Methods | Used by |
| --- | --- |
| `/api/suppliers.php` | GET list, POST create (`name`, `category`, `region`) | Suppliers |
| `/api/metrics.php` | GET (computed from suppliers) | Suppliers |
| `/api/market-ticker.php` | GET | Suppliers ticker |
| `/api/overview.php` | GET KPIs, activity, deadlines, alerts, health | Overview |
| `/api/bids.php` | GET list; POST `{action:"create"}` or `{action:"status", id, status}` | Bids |
| `/api/orders.php` | GET list; POST `{action:"cancel", ids}` | Orders |
| `/api/analytics.php?range=7d\\|30d\\|90d` | GET live aggregates | Analytics |
| `/api/alerts.php` | GET list; POST `{action: read\\|read_all\\|dismiss\\|snooze, id?}` | Alerts |
| `/api/settings.php` | GET; POST `{action: profile\\|notifications\\|twofa\\|billing\\|account_type\\|,"` | Settings |

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
registering creates a `pending` account that cannot sign in until an admin activates
it.

| Endpoint | Method | Purpose |
| --- | --- |
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
session cookie's `Secure` flag means it won't be sent at all. AutoSSL is
already terminating HTTPS on the live host, so these endpoints work over
`https://djstratageminc.com` without changing `require_https`.

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
   nothing there is web-reachable even if PHP breaks, and the deploy
