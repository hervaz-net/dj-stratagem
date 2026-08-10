#!/usr/bin/env bash
#
# D&J Stratagem deployment tool.
#
# Default: fully automated deploy to Namecheap cPanel over the cPanel UAPI —
# build, refresh the `deploy` branch, pull on the server, run the deployment,
# and verify the live bundle. No browser, no cPanel login.
#
# Requires a cPanel API token at ~/.cpanel_token (chmod 600).
# The token is read from disk at call time and never printed or logged.
#
# Usage:
#   ./deploy.sh                # build + push + deploy + verify
#   ./deploy.sh --no-build     # reuse existing dist/
#   ./deploy.sh --status       # last deployment info
#   ./deploy.sh --manual       # instructions for other hosts (FTP/S3/Vercel/Netlify)
#
set -euo pipefail

CPANEL_HOST="server247.web-hosting.com:2083"
CPANEL_USER="djstlime"
TOKEN_FILE="${CPANEL_TOKEN_FILE:-$HOME/.cpanel_token}"
# Must be ABSOLUTE — the UAPI rejects a home-relative repository_root.
REPO_ROOT="/home/djstlime/repositories/dj-stratagem"
DOCROOT="/home/djstlime/public_html"
BRANCH="deploy"
GIT_REMOTE="https://github.com/hervaz-net/dj-stratagem.git"
SITE_URL="https://djstratageminc.com"

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GREEN='\033[0;32m'; BLUE='\033[0;36m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
die()  { printf "${RED}error:${NC} %s\n" "$*" >&2; exit 1; }
step() { printf "\n${BLUE}==>${NC} %s\n" "$*"; }

# ---------------------------------------------------------------- manual mode
if [[ "${1:-}" == "--manual" || "${1:-}" == "--instructions" ]]; then
  printf "${BLUE}Manual deployment targets${NC}\n"
  echo "----------------------------------------"
  echo "Contents of dist/ to upload:"
  ls -la dist/ 2>/dev/null || echo "  (no dist/ — run npm run build)"
  cat <<'TXT'

• Namecheap cPanel (manual): upload dist/ contents into public_html/
    IMPORTANT: public_html must end up djstlime:nobody mode 0750.
    Uploading with a tool that preserves source perms/group will break it.
• AWS S3:  aws s3 sync dist/ s3://bucket-name/
• Vercel:  npx vercel --prod
• Netlify: drop dist/ into the Netlify UI
TXT
  exit 0
fi

[[ -f "$TOKEN_FILE" ]] || die "no token file at $TOKEN_FILE
Create one in cPanel → Manage API Tokens, then save it without echoing:
  (umask 077; cat > $TOKEN_FILE)"

TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"
[[ -n "$TOKEN" ]] || die "$TOKEN_FILE is empty"

uapi() {
  local module="$1" func="$2"; shift 2
  curl -sS --max-time 90 \
    -H "Authorization: cpanel ${CPANEL_USER}:${TOKEN}" \
    "https://${CPANEL_HOST}/execute/${module}/${func}" "$@"
}

api_check() {
  python3 -c '
import json,sys
raw=sys.stdin.read()
try: d=json.loads(raw)
except Exception: print("  non-JSON response:", raw[:300]); sys.exit(1)
if d.get("errors"): print("  FAILED:", "; ".join(map(str,d["errors"]))); sys.exit(1)
print("  ok")
'
}

# -------------------------------------------------------------- status mode
if [[ "${1:-}" == "--status" ]]; then
  step "Last deployment"
  uapi VersionControl retrieve --get --data-urlencode "fields=last_deployment,last_update" \
    | python3 -c '
import json,sys
d=json.load(sys.stdin)
for r in (d.get("data") or []):
    lu=r.get("last_update") or {}; ld=r.get("last_deployment") or {}
    print("  server HEAD :", (lu.get("identifier") or "?")[:8], "|", (lu.get("message") or "").strip()[:60])
    rs=ld.get("repository_state") or {}
    print("  deployed    :", (rs.get("identifier") or "?")[:8], "| deploy_id", ld.get("deploy_id"))
'
  exit 0
fi

# ------------------------------------------------------------------- build
if [[ "${1:-}" != "--no-build" ]]; then
  step "Building"
  ( cd "$REPO_DIR" && npm run build )
else
  step "Skipping build (--no-build)"
fi
[[ -d "$REPO_DIR/dist" ]] || die "no dist/ — run a build first"

# --------------------------------------------------- refresh deploy branch
step "Refreshing '$BRANCH' branch from dist/"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
git clone --quiet --branch "$BRANCH" --single-branch "$GIT_REMOTE" "$WORK/repo"
cd "$WORK/repo"
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R "$REPO_DIR/dist/." .

# PERMISSIONS — do NOT change these rsync flags back to `-a`.
#
# `-a` implies -p (perms) and -g (group). The rsync source is the cPanel git
# repo dir, owned djstlime:djstlime mode 0700, so `-a` silently chmods
# public_html to 0700 AND chgrps it to djstlime. cPanel needs djstlime:nobody
# 0750 because the web server runs as `nobody`. Get it wrong and the directory
# index still renders while every static file GET returns 404 — which looks
# exactly like the deploy wiped the site. This cost hours to track down once.
cat > .cpanel.yml <<YML
---
deployment:
  tasks:
    - /usr/bin/rsync -rltD --delete --exclude='.git' --exclude='.cpanel.yml' ./ ${DOCROOT}/
    - /usr/bin/find ${DOCROOT} -type d -exec /bin/chmod 0755 {} +
    - /usr/bin/find ${DOCROOT} -type f -exec /bin/chmod 0644 {} +
    - /bin/chgrp nobody ${DOCROOT}
    - /bin/chmod 0750 ${DOCROOT}
YML

git add -A
if git diff --cached --quiet; then
  echo "  no changes"
else
  git commit --quiet -m "Deploy $(cd "$REPO_DIR" && git rev-parse --short HEAD)"
  git push --quiet origin "$BRANCH"
  echo "  pushed $(git rev-parse --short HEAD)"
fi
cd "$REPO_DIR"

# ------------------------------------------------- pull on server + deploy
step "Pulling '$BRANCH' on the server"
uapi VersionControl update --get \
  --data-urlencode "repository_root=${REPO_ROOT}" \
  --data-urlencode "branch=${BRANCH}" | api_check

step "Triggering deployment"
uapi VersionControlDeployment create -X POST \
  --data-urlencode "repository_root=${REPO_ROOT}" | api_check

# ------------------------------------------------------------------ verify
step "Verifying live site"
EXPECTED="$(grep -o 'assets/index-[A-Za-z0-9_-]*\.js' "$REPO_DIR/dist/index.html" | head -1)"
for i in 1 2 3 4 5 6; do
  sleep 5
  LIVE="$(curl -sS --max-time 30 "$SITE_URL/" 2>/dev/null | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1 || true)"
  [[ "$LIVE" == "$EXPECTED" ]] && break
  printf '  attempt %d: waiting for rsync…\n' "$i"
done

printf '  expected: %s\n  live:     %s\n' "$EXPECTED" "${LIVE:-<none>}"
if [[ "$LIVE" == "$EXPECTED" ]]; then
  printf "\n${GREEN}✓ deployed${NC} %s\n" "$SITE_URL"
else
  printf "\n${YELLOW}!${NC} live bundle still not matching.\n"
  printf "  Check perms:  ./deploy.sh --status\n"
  printf "  public_html must be djstlime:nobody 0750.\n"
  exit 1
fi
