# D&J Stratagem, Inc. — marketing site

Marketing site for D&J Stratagem's construction bidding, procurement, and project
coordination platform. Built with React, Vite, React Router, and Tailwind CSS v4.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs to `dist/`. That folder is a complete static site: HTML/CSS/JS plus
two files copied straight from `public/`:

- **`.htaccess`** — Apache rewrite rules so client-side routes like `/platform`
  or `/contact` load correctly on direct visit/refresh, and sets long cache
  lifetimes for assets.
- **`contact.php`** — server-side handler for the contact form (see below).

## Deploying on Namecheap (domain + shared hosting)

1. **Buy the right hosting plan.** Use a **Shared Hosting** plan (Stellar,
   Stellar Plus, or Stellar Business) — these give you cPanel, PHP, and file
   access. Do **not** use EasyWP; that's managed WordPress hosting and won't
   run this site or `contact.php` properly.
2. If the domain and hosting are bought together, Namecheap links them
   automatically. If the domain was registered separately, point its
   nameservers at the hosting account from the domain's **Domain List →
   Manage → Nameservers** page (Namecheap's hosting welcome email has the
   exact nameserver values). DNS changes can take up to a few hours to
   propagate, occasionally longer.
3. In **cPanel → MultiPHP Manager**, make sure the domain is set to a current
   PHP version (8.1+ is fine).
4. Run `npm run build` locally, then upload the **contents** of `dist/`
   (not the folder itself) into `public_html/` (or the subfolder for that
   domain, if it's an addon domain) using cPanel's **File Manager** or an FTP
   client such as FileZilla. Your FTP/cPanel credentials come from the
   hosting welcome email — I can't log in on your behalf, since entering
   passwords for you isn't something I'll do, but I'm glad to walk through
   any step.
5. In **cPanel → SSL/TLS Status**, run **AutoSSL** if the domain doesn't
   already show a valid free SSL certificate, so the site serves over
   `https://`.
6. Visit the domain and click through all five pages, then submit the
   contact form to confirm mail delivery (see below).

### Contact form

The Contact page posts to `/contact.php`, a same-origin PHP script that
validates the fields and sends the submission via PHP's `mail()` to
**yeheca@icloud.com**, with the submitter's address set as `Reply-To` so you
can respond directly. It also checks a hidden honeypot field (`bot-field`)
and silently discards anything that fills it in, as basic bot filtering.

This only works once uploaded to real PHP hosting — running `npm run dev`
locally has no PHP runtime, so local submissions will fail with a fetch
error (expected; the error state in the UI is what you'll see).

**Deliverability note:** shared-hosting `mail()` sends are sometimes flagged
as spam depending on the host's reputation and whether SPF/DKIM are set up
for the domain. If demo requests aren't arriving, check the destination
inbox's spam folder first. If it's unreliable, the fix is to send through an
authenticated mailbox on the domain (e.g. create `noreply@yourdomain.com` in
cPanel and switch `contact.php` from `mail()` to SMTP via that mailbox) —
happy to wire that up once the domain is live.
