# D&J Stratagem, Inc. — construction platform

The public website for D&J Stratagem, a Los Angeles-based construction platform:
**Find the work. Price it. Build it.** One account connects contractors,
subcontractors, and suppliers across the job lifecycle.

Built with Next.js 15 App Router, TypeScript, Tailwind CSS v4, Framer Motion,
and Lucide React. Live at [djstratageminc.com](https://djstratageminc.com).

## Pages

| Route | Purpose |
| --- | --- |
| `/` | One account, nine modes, and the full job lifecycle |
| `/projects`, `/exchange`, `/platform`, `/solutions`, `/supply`, `/capital`, `/workforce`, `/fleet`, `/studio` | Product pages for all nine modes |
| `/pricing` | Starter, Professional, Growth, and Enterprise access |
| `/about` | Company, principles, and Los Angeles roots |
| `/resources`, `/resources/blog`, `/resources/changelog`, `/resources/guides` | Field notes, product updates, and guides |
| `/contact` | Person-to-person inquiry form |
| `/join`, `/login`, `/forgot-password`, `/reset-password` | Account request and sign-in flows (`noindex`) |
| `/dashboard` | Separate app-area entry point for the future workspace |

Page metadata and canonicals are defined in the App Router. The homepage emits
Organization structured data; `src/app/opengraph-image.tsx` generates a branded
social preview. `public/sitemap.xml` and `public/robots.txt` remain the public SEO
entry points.

### Nine modes. One desk.

The mode content and job stages are maintained in `lib/site-data.ts`; the
dynamic mode route at `src/app/(marketing)/[slug]/page.tsx` generates the nine
product pages. Shared layout and navigation live in the marketing route group.
Authentication and the future dashboard use separate route groups so app
chrome can evolve independently of the public site.

Projects and Exchange help find work. Platform and Solutions support pursuit.
Supply, Capital, Workforce, and Fleet help build the job. Studio turns finished
work into the next customer conversation. AI subagents can prepare work across
the pipeline, but a person approves before anything runs.

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

The global tokens and responsive system live in `src/app/globals.css`. Colors
use OKLCH custom properties; the site defaults to a dark construction-tech
palette with a refined orange accent and supports system appearance plus a
manual theme cycle. Typography uses local Bricolage Grotesque and JetBrains
Mono variable fonts. Shared button primitives are in `components/ui`.

Framer Motion is limited to viewport reveals and honors
`prefers-reduced-motion`. Construction photography is stored locally under
`public/media` and rendered through `next/image` for responsive optimization.

## Development

```bash
npm install
npm run dev
```

Lint with `npm run lint` (oxlint) and check types with `npm run typecheck`.

The optional API base URLs are documented in `.env.example`. The contact and
account forms use the existing PHP handlers; local Next.js development does not
execute PHP.

## Build

```bash
npm run build
npm run start
```

`next build` exports the pre-rendered App Router pages to `out/`. `npm run start`
serves that export through PHP locally, matching the Namecheap host and allowing
the existing PHP endpoints to run. The export can be published to cPanel without
a Node.js runtime.

## Deployment

The cPanel workflow publishes the Next.js static export and retains the PHP
handlers on the same origin. Merging to `main` builds and verifies `out/`, then
updates the `deploy` branch and asks cPanel to publish it. The verification
script checks the exported routes, assets, and backend endpoints before it can
ship. `./deploy.sh` is the local fallback and requires a cPanel API token at
`~/.cpanel_token`.

### Contact form

The Contact page posts to the configured PHP contact handler (defaults to
`/contact.php`), which validates fields and sends via PHP `mail()` to the
configured destination address. A honeypot field (`bot-field`) filters
automated submissions.

This only works on PHP hosting—`npm run dev` has no PHP runtime, so local
submissions show an explicit error and offer direct email as an alternative.
The sign-in and account-request forms use `/api/me.php`, `/api/login.php`,
`/api/register.php`, and `/api/password-reset.php` with the existing CSRF flow.

**Deliverability:** shared-hosting `mail()` is sometimes spam-filtered. If demo requests aren't
arriving, check spam first. The durable fix is sending through an authenticated mailbox on the
domain (create one in cPanel, switch `contact.php` from `mail()` to SMTP).

## Outstanding

The notes below describe the existing PHP services and legacy SPA. They are
not deployment instructions for the new Next.js website.

- **Stratagem AI needs its API key and cron job on the server** before
  approved jobs can run. See "Jobs and subagents (Stratagem AI)" below.
- HTTPS is live (AutoSSL). Auth endpoints stay HTTPS-only via `require_https`.
  Do not disable that flag to "get it working" on plaintext.
- Paid-plan prices are intentionally not invented; the new pricing page offers
  a person-reviewed access request for paid tiers.
- Screenshots/mock panels throughout the site are illustrative, not live product.

## Operations dashboard

The Next route group `src/app/(app)` is reserved for the signed-in workspace.
`/dashboard` is currently an explicit entry page, not the legacy operations UI.
The existing PHP APIs and Vite dashboard components remain in the repository
but are not rendered by the new Next website yet. Keep the API authorization
checks as the security boundary when migrating those screens.

The older SPA included **Overview**, **Suppliers**, **Bids**, **Orders**,
**Analytics**, **Alerts**, **Settings**, and admin **Accounts** screens. Those
screens have not yet been migrated into the Next.js dashboard.

### Jobs and subagents (Stratagem AI)

The PHP job API previously let members submit a job at `/dashboard/jobs` and pick which of the nine
subagents (Projects, Exchange, Platform, Solutions, Supply, Capital,
Workforce, Fleet, Studio) should work it. Every job lands in
`pending_approval`; **nothing runs until an admin approves it**. Approval
starts the run, and the subagents work on their own on the Claude API
(`public/api/ai-lib.php`):

- **Chained.** Subagents run one after another in pipeline order. Each one
  gets the job details, its own brief, and a short summary of every earlier
  subagent. Full write-ups are saved for the contractor and are not replayed
  into later calls, so a long job does not resend the same deliverables.
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

### Testing the existing PHP services against a real database

```bash
# PHP + MySQL running, public/api/config.php pointing at a dev database,
# an admin account created (see "Creating the first admin").
# For the AI tests, point the dev config at the mock Claude:
#   'ai' => ['api_key' => 'test', 'base_url' => 'http://127.0.0.1:8765'],
#   'site_url' => 'http://127.0.0.1:8080',
#   'mail_hook' => fn ($to, $subject, $body) => file_put_contents('/tmp/mail.log', json_encode(compact('to','subject','body'))."\n", FILE_APPEND),
MOCK_CLAUDE_LOG=/tmp/mock.log python3 scripts/mock-claude.py 8765 &
php -S 127.0.0.1:8080 -t public
python3 scripts/smoke-api.py http://127.0.0.1:8080 --admin-email you@example.com --admin-password '…'
python3 scripts/test-ai-subagents.py http://127.0.0.1:8080 /tmp/mail.log /tmp/mock.log --admin-email you@example.com --admin-password '…'
```

`smoke-api.py` calls every endpoint signed out, as a member and as an admin.
`test-ai-subagents.py` checks the AI run end to end: approval starts it,
each subagent sees earlier work, call-backs recurse 3 deep and no further,
the task cap, retry on overload, a bad key blocking with retry/skip, cancel
mid-call, edit and resubmit, every email, and password reset.
The former `e2e-jobs.py` and `e2e-admin.py` scripts target the legacy SPA and
must be updated before they can exercise the new Next.js pages. These tests
create database rows; never point them at production.

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

`/login` and `/join` are backed by PHP endpoints under `public/api/`,
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

### Admin control panel (`/admin`)

Admins sign in at `/login` like everyone else and land on **`/admin`**, a
separate control panel with its own sidebar:

| Screen | What it does |
|---|---|
| **Overview** `/admin` | Members and jobs waiting on you, totals, newest sign-ups, jobs and listings |
| **Members** `/admin/members` | Search everyone who signed up; approve, decline, suspend, reinstate; make or remove admins. Click a name for their jobs and catalog |
| **Job postings** `/admin/jobs` | Every job by status; approve or reject (a reason is required to reject); open any job's detail |
| **Catalog** `/admin/catalog` | Every seller's listings; filter by seller or status; create a listing for any active member, edit or delete any listing |

Endpoints (admin only, 403 for anyone else; POSTs need the CSRF header):

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/admin-overview.php` | GET | Counts and newest items for the overview |
| `/api/admin-members.php` | GET `?q=&status=&role=` / `?id=` | Member list with job and listing counts, or one member with their jobs and listings |
| `/api/admin-members.php` | POST `{action:"status"\|"role", id, ...}` | Approve/suspend/reinstate, make/remove admin. You can't suspend or demote yourself |
| `/api/admin-catalog.php` | GET `?q=&owner=&status=` | All listings with their seller, plus the seller list |
| `/api/admin-catalog.php` | POST `{action:"save"\|"delete", ...}` | Create (needs `ownerId`), edit, or delete any listing. Same validation as a seller's own catalog (`catalog-lib.php`) |

`scripts/e2e-admin.py` runs the whole panel in a browser.

### Creating the first admin

The admin screen is gated on `role = 'admin'`, and registration always creates
`role = 'member'`. Promote the first one by hand, once:

```sql
UPDATE users SET role = 'admin', status = 'active', approved_at = UTC_TIMESTAMP()
 WHERE email = 'you@example.com';
```

After that, everything happens in the admin control panel at `/admin`. The **Accounts** item only appears in
The sidebar for admins, but that is presentation — `admin-users.php` and
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

Email verification of the registrant's own address, and "remember me".
Password reset is self-serve at `/forgot-password` (one-hour, single-use
links; only a hash of each token is stored).
