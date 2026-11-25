#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/out}"

die() { printf 'verify-export: %s\n' "$*" >&2; exit 1; }

[[ -d "$OUT" ]] || die "no export at $OUT — run npm run build"

need_files=(
  index.html
  404.html
  .htaccess
  opengraph-image
  contact.php
  send-demo.php
  health.php
  manifest.webmanifest
  manifest.json
  api/credit.php
  robots.txt
  sitemap.xml
  favicon.svg
  api/.htaccess
  api/health.php
  api/me.php
  api/index.php
  api/not-found.php
  api/login.php
  api/register.php
  api/bootstrap.php
  api/logout.php
  api/alerts.php
  api/bids.php
  api/analytics.php
  api/orders.php
  api/settings.php
  api/metrics.php
  api/overview.php
  api/suppliers.php
  api/ops.php
  api/ops-schema.php
  api/ops-seed.php
  api/ops-view.php
  api/market.php
  api/requests.php
  api/catalog.php
  api/sample-data.php
  api/market-ticker.php
  api/config.example.php
  api/jobs.php
  api/jobs-lib.php
  api/jobs-run.php
  api/subagents.php
  api/ai-lib.php
  api/ai-worker.php
  api/mail-lib.php
  api/password-reset.php
  api/admin-overview.php
  api/admin-members.php
  api/admin-users.php
  api/admin-user-status.php
  api/admin-catalog.php
  api/catalog-lib.php
  api/products.php
  data/catalog/products.sqlite
  data/catalog/manifest.json
  data/catalog/sellers.json
  privacy.html
  terms.html
  fleet-cards.html
  signage.html
  receipts.html
)

for rel in "${need_files[@]}"; do
  [[ -f "$OUT/$rel" ]] || die "missing $rel"
done

routes=(
  about capital contact dashboard exchange fleet forgot-password join login
  platform pricing privacy projects reset-password solutions studio supply terms
  workforce resources resources/blog resources/changelog resources/guides
  resources/blog/a-better-view-of-the-next-job
  resources/blog/keep-the-supply-conversation-close
  resources/blog/one-job-one-shared-context
)
for route in "${routes[@]}"; do
  [[ -f "$OUT/$route/index.html" ]] || die "missing static route $route/"
done

python3 - "$OUT" <<'PY'
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

root = Path(sys.argv[1])
namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
locations = [
    element.text
    for element in ET.parse(root / "sitemap.xml").getroot().findall(
        f"{namespace}url/{namespace}loc"
    )
]
if not locations or len(locations) != len(set(locations)):
    raise SystemExit("verify-export: sitemap is empty or contains duplicate URLs")

for location in locations:
    parsed = urlsplit(location)
    if parsed.scheme != "https" or parsed.netloc != "djstratageminc.com":
        raise SystemExit(f"verify-export: unexpected sitemap URL {location}")
    path = parsed.path.strip("/")
    page = root / path / "index.html" if path else root / "index.html"
    if not page.is_file():
        raise SystemExit(f"verify-export: sitemap URL has no exported page: {location}")
PY

htaccess="$OUT/.htaccess"
grep -Fq 'application/x-httpd-alt-php81___lsphp' "$htaccess" \
  || die ".htaccess is missing the CloudLinux alt-php81 handler"
grep -Fq 'RewriteRule ^api/health' "$htaccess" \
  || die ".htaccess is missing the /api/health.php alias"
grep -Fq 'ErrorDocument 404 /404.html' "$htaccess" \
  || die ".htaccess is missing the static 404 document"
grep -Fq 'ForceType image/png' "$htaccess" \
  || die ".htaccess is missing the Open Graph image content type"
if grep -Eq 'RewriteRule \^ spa[.]php \[L\]' "$htaccess"; then
  die ".htaccess still routes missing URLs through the legacy SPA"
fi

api_htaccess="$OUT/api/.htaccess"
grep -Fq 'RewriteRule ^health' "$api_htaccess" \
  || die "api/.htaccess must alias health.php to /health.php"
for lib in ai-lib ai-worker mail-lib jobs-lib bootstrap; do
  grep -Fq "${lib}\\.php" "$api_htaccess" \
    || die "api/.htaccess must deny ${lib}.php over the web"
done

bundle="$(grep -oE '/_next/static/[^" ]+[.]js' "$OUT/index.html" | head -1 | sed 's#^/##' || true)"
[[ -n "$bundle" ]] || die "index.html has no Next.js JavaScript bundle"
[[ -f "$OUT/$bundle" ]] || die "Next.js bundle $bundle is not in the export"
[[ -d "$OUT/_next/static/css" ]] || die "Next.js stylesheets are missing"

printf 'verify-export: ok (%s)\n' "$bundle"
