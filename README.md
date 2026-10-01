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

## Deployment

Hosted on **Namecheap Stellar shared hosting** (cPanel + LiteSpeed), deployed via cPanel's
Git Version Control.

Two branches:

- **`main`** — source of truth. Full source tree.
- **`deploy`** — build output only (the contents of `dist/`) plus `.cpanel.yml`. This is the
  branch cPanel checks out, so the server never needs Node or a build step.

Preferred path, from a machine that has Node, git, curl, and `~/.cpanel_token`:

```bash
git checkout main && git pull origin main
./deploy.sh
```

If you cannot run `deploy.sh`, after someone has already pushed a fresh `deploy` tip:
cPanel → **Git™ Version Control** → `dj-stratagem` → **Update from Remote** →
**Deploy HEAD Commit**.

Do **not** rsync with `-a`. Confirm `public_html` is `djstlime:nobody` mode `0750`.

## Outstanding

- **Host is unsuspended but public_html is stale (audit 1.80).**
  Re-checked 30 Sep 2026 17:15 PDT: apex serves the marketing SPA
  (`Last-Modified: Thu, 24 Sep 2026 17:44:15 GMT`). www 301s to apex.
  Live bundle is still `assets/index-CkD4vCPa.js` +
  `assets/index-Bq1iR03t.css`. GitHub `main` `de37cea` and `deploy`
  `a0236fe` advertise `assets/index-BVUa50KV.js` +
  `assets/index-Bm8WIB0C.css`. This is a cPanel pull lag, not a
  React-tree defect.
- **Live API failures that the current `deploy` tree already fixes:**
  `/api/health.php` LiteSpeed HTML 404; `/api/index.php`, `/api/metrics.php`,
  `/api/alerts.php`, `/api/bids.php`, `/api/settings.php` Namecheap HTML 500.
  Working JSON: `/health.php`, `/api/me.php`, `/contact.php` GET
  `method_not_allowed`. Source already aliases `/api/health.php`
  → `/health.php` `[L,PT]`, ships `public/api/health.php`, stops the
  `api/index.php` ErrorDocument loop, and guards `require_signin`.
- **cPanel cannot be pulled from GitHub Actions.** Repo secret
  `CPANEL_TOKEN` is empty. Run `./deploy.sh` on a token machine, or
  cPanel → Git Version Control → Update from Remote → Deploy HEAD.
  Success: live script src is `assets/index-BVUa50KV.js` and
  `/api/health.php` returns JSON ok.
- HTTPS is live (AutoSSL). Do not disable `require_https`.
- Pricing figures are placeholders pending a real pricing decision.
- Screenshots/mock panels throughout the site are illustrative, not live product.

See prior README revisions for the full product, auth, and dashboard notes.
