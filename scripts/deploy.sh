#!/usr/bin/env bash
#
# Build the site, refresh the `deploy` branch, and trigger a cPanel deployment
# over the cPanel UAPI — no browser, no cPanel login.
#
# Requires a cPanel API token stored at ~/.cpanel_token (chmod 600).
# The token is read from disk at call time and never printed.
#
# Usage:
#   ./scripts/deploy.sh              # build + push + deploy
#   ./scripts/deploy.sh --no-build   # skip npm run build (use existing dist/)
#   ./scripts/deploy.sh --status     # just show last deployment info
#
set -euo pipefail

CPANEL_HOST="server247.web-hosting.com:2083"
CPANEL_USER="djstlime"
TOKEN_FILE="${CPANEL_TOKEN_FILE:-$HOME/.cpanel_token}"
REPO_ROOT_REL="repositories/dj-stratagem"
BRANCH="deploy"
GIT_REMOTE="https://github.com/hervaz-net/dj-stratagem.git"

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_URL="http://djstratageminc.com"

die() { printf '\033[31merror:\033[0m %s\n' "$*" >&2; exit 1; }
step() { printf '\n\033[36m==>\033[0m %s\n' "$*"; }

[[ -f "$TOKEN_FILE" ]] || die "no token file at $TOKEN_FILE
Create one in cPanel (Manage API Tokens), then:
  printf '%s' 'YOUR_TOKEN' > $TOKEN_FILE && chmod 600 $TOKEN_FILE"

# Read token into a variable; never echo it.
TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"
[[ -n "$TOKEN" ]] || die "$TOKEN_FILE is empty"

uapi() {
  # uapi <Module> <function> [curl args...]
  local module="$1" func="$2"; shift 2
  curl -sS --max-time 60 \
    -H "Authorization: cpanel ${CPANEL_USER}:${TOKEN}" \
    "https://${CPANEL_HOST}/execute/${module}/${func}" "$@"
}

show_status() {
  step "Last deployment"
  uapi VersionControlDeployment retrieve \
    --get --data-urlencode "repository_root=${REPO_ROOT_REL}" \
    | python3 -c '
import json,sys
try:
    d = json.load(sys.stdin)
except Exception:
    print(sys.stdin.read()); sys.exit()
if d.get("errors"):
    print("errors:", d["errors"]); sys.exit(1)
for r in (d.get("data") or []):
    print(f'"'"'  {r.get("deploy_state","?"):<12} {(r.get("sha") or "")[:8]}  {r.get("log_path","")}'"'"')
' || true
}

if [[ "${1:-}" == "--status" ]]; then
  show_status
  exit 0
fi

# ---------------------------------------------------------------- build
if [[ "${1:-}" != "--no-build" ]]; then
  step "Building"
  ( cd "$REPO_DIR" && npm run build )
else
  step "Skipping build (--no-build)"
fi

[[ -d "$REPO_DIR/dist" ]] || die "no dist/ directory — run a build first"

# ------------------------------------------------- refresh deploy branch
step "Refreshing '$BRANCH' branch with dist/"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

git clone --quiet --branch "$BRANCH" --single-branch "$GIT_REMOTE" "$WORK/repo"
cd "$WORK/repo"
find . -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R "$REPO_DIR/dist/." .

# NOTE ON PERMISSIONS — do not "simplify" this back to `rsync -a`.
#
# `-a` implies `-p` (preserve permissions), which copies the SOURCE directory's
# mode onto public_html. cPanel creates the git repo dir as 0700, so `-a` silently
# chmods public_html to 0700. The web server can then no longer traverse it: the
# directory index still renders, but every static file GET returns 404. This is
# subtle and looks exactly like "the deploy wiped the site".
#
# So: sync WITHOUT -p/-o/-g (`-rltD`), then set modes explicitly.
cat > .cpanel.yml <<'YML'
---
deployment:
  tasks:
    - /usr/bin/rsync -rltD --delete --exclude='.git' --exclude='.cpanel.yml' ./ /home/djstlime/public_html/
    - /usr/bin/find /home/djstlime/public_html -type d -exec /bin/chmod 0755 {} +
    - /usr/bin/find /home/djstlime/public_html -type f -exec /bin/chmod 0644 {} +
    - /bin/chmod 0750 /home/djstlime/public_html
YML

git add -A
if git diff --cached --quiet; then
  echo "  no changes to deploy branch"
else
  git commit --quiet -m "Deploy $(cd "$REPO_DIR" && git rev-parse --short HEAD)"
  git push --quiet origin "$BRANCH"
  echo "  pushed $(git rev-parse --short HEAD)"
fi
cd "$REPO_DIR"

# ------------------------------------------------ pull on server + deploy
step "Pulling '$BRANCH' on the server"
uapi VersionControl update \
  --get \
  --data-urlencode "repository_root=${REPO_ROOT_REL}" \
  --data-urlencode "branch=${BRANCH}" >/dev/null || true

step "Triggering deployment"
DEPLOY_OUT="$(uapi VersionControlDeployment create \
  --data-urlencode "repository_root=${REPO_ROOT_REL}")"

echo "$DEPLOY_OUT" | python3 -c '
import json,sys
raw = sys.stdin.read()
try:
    d = json.loads(raw)
except Exception:
    print(raw); sys.exit(1)
if d.get("errors"):
    print("  FAILED:", "; ".join(d["errors"])); sys.exit(1)
print("  deployment queued")
'

# ------------------------------------------------------------- verify
step "Verifying live site"
sleep 12
EXPECTED="$(grep -o 'assets/index-[A-Za-z0-9_-]*\.js' "$REPO_DIR/dist/index.html" | head -1)"
LIVE="$(curl -sS --max-time 30 "$SITE_URL/" | grep -o 'assets/index-[A-Za-z0-9_-]*\.js' | head -1 || true)"

printf '  expected: %s\n  live:     %s\n' "$EXPECTED" "${LIVE:-<none>}"
if [[ "$EXPECTED" == "$LIVE" ]]; then
  printf '\n\033[32m✓ deployed\033[0m %s\n' "$SITE_URL"
else
  printf '\n\033[33m!\033[0m live bundle does not match yet — rsync may still be running.\n'
  printf '  Re-check in ~15s:  curl -s %s/ | grep -o "assets/index-[^\"]*\\.js"\n' "$SITE_URL"
fi
