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

See the rest of this file on `main` for design system, dashboard APIs, and authentication.
