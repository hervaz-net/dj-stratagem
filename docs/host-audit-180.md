# Live host audit 1.80 — 30 Sep 2026 17:15 PDT

Namecheap lock is gone. `public_html` is still the 24 Sep tree.

| Ref | Value |
|---|---|
| Live | `https://djstratageminc.com` |
| Live bundle | `assets/index-CkD4vCPa.js` + `assets/index-Bq1iR03t.css` |
| Live Last-Modified | Thu, 24 Sep 2026 17:44:15 GMT |
| `www` | 301 → apex |
| GitHub `main` | `de37cea` |
| GitHub `deploy` | `a0236fe` (`Deploy de37cea`) |
| Expected bundle | `assets/index-BVUa50KV.js` + `assets/index-Bm8WIB0C.css` |

## Live failures already fixed on `deploy`

- `/api/health.php` — LiteSpeed HTML 404
- `/api/`, `/api/index.php`, `/api/metrics.php`, `/api/alerts.php`, `/api/bids.php`, `/api/settings.php` — HTML 500
- `/api/not-found.php` — LiteSpeed HTML 404
- `/login` shows marketing navbar (old bundle; `hideMarketingChrome` is already on `main`)

## Working

- `/`, `/platform`, `/pricing`, `/contact`, `/projects`, `/changelog` — SPA 200
- `/health.php` — `{"ok":true,"php":"8.1.34"}`
- `/api/me.php` — session JSON
- `/contact.php` GET — `method_not_allowed`
- `/api/login.php` GET — `{"error":"method"}`
- `/api/overview.php` — 401 JSON

## Ship step

GitHub Actions cannot pull cPanel (`CPANEL_TOKEN` empty).

```text
git checkout main && git pull && ./deploy.sh
```

Or cPanel → Git Version Control → `dj-stratagem` → Update from Remote → Deploy HEAD Commit.
Confirm `public_html` is `djstlime:nobody` mode `0750`.
Success: live script src is `assets/index-BVUa50KV.js` and `/api/health.php` is JSON ok.

Do not rsync with `-a`. Do not point cPanel at `main`.
