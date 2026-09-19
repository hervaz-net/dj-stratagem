#!/usr/bin/env bash
# Fail a production build that would ship a stripped public_html tree.
# Live broke on 19 Sep 2026 when `deploy` was refreshed from a partial
# dist (tiny .htaccess, no /api, no health.php). LiteSpeed then SPA-fell
# every PHP probe and static doc back to index.html.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="${1:-$ROOT/dist}"

die() { printf 'verify-dist: %s\n' "$*" >&2; exit 1; }

[[ -d "$DIST" ]] || die "no dist at $DIST — run npm run build"

need_files=(
  index.html
  .htaccess
  contact.php
  send-demo.php
  health.php
  manifest.webmanifest
  robots.txt
  sitemap.xml
  favicon.svg
  api/.htaccess
  api/health.php
  api/me.php
  api/index.php
  api/login.php
  api/register.php
)

missing=0
for rel in "${need_files[@]}"; do
  if [[ ! -f "$DIST/$rel" ]]; then
    printf 'verify-dist: missing %s\n' "$rel" >&2
    missing=1
  fi
done
[[ "$missing" -eq 0 ]] || die "dist is incomplete; refusing to ship"

htaccess="$DIST/.htaccess"
grep -q 'application/x-httpd-alt-php81___lsphp' "$htaccess" \
  || die ".htaccess is missing the CloudLinux alt-php81 handler"
grep -q 'RewriteRule \^api/' "$htaccess" \
  || die ".htaccess is missing the /api/ passthrough"

bundle="$(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' "$DIST/index.html" | head -1 || true)"
[[ -n "$bundle" ]] || die "index.html has no hashed JS bundle"
[[ -f "$DIST/$bundle" ]] || die "hashed bundle $bundle is not in dist/"

printf 'verify-dist: ok (%s)\n' "$bundle"
