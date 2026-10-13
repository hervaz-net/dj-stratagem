# D&J Stratagem, Inc. — marketing site

Marketing site for D&J Stratagem: **the operating system for construction growth**.
Helps contractors win more work, market their business, source materials, and manage the
entire bidding pipeline from opportunity to award.

Tagline: **Win More Projects. Build Bigger Business.**

Built with React, Vite, React Router, and Tailwind CSS v4. Live at
[djstratageminc.com](https://djstratageminc.com).

## Outstanding

- **Namecheap account is live again.** Re-checked 12 Oct 2026:
  apex `https://djstratageminc.com/` returns 200 (not the suspended CGI).
  `/api/health.php` and `/api/me.php` return JSON. Do not treat a 302 to
  `/cgi-sys/suspendedpage.cgi` as current.
- **cPanel public_html lags GitHub `deploy`.** Rechecked 12 Oct 2026 17:20 PDT:
  live homepage is `assets/index-DeFnHBC-.js`.
  GitHub `deploy` tip advertises `assets/index-C0-tB-nW.js`.
  `/api/health.php`, `/health.php`, and `/api/me.php` return healthy JSON.
  Marketing routes serve the SPA.
  Actions builds and pushes `deploy`, then Pull and deploy fails because repo secret
  `CPANEL_TOKEN` is empty. After `main` updates:
  `./deploy.sh` on a machine with `~/.cpanel_token`, or cPanel → Git Version
  Control → `dj-stratagem` → Update from Remote → Deploy HEAD Commit. Confirm
  `public_html` is `djstlime:nobody` mode `0750`. Do not rsync with `-a`.
  Do not point cPanel at `main`.

See full documentation in prior commits for complete site details, deployment, dashboard, and auth.
