#!/bin/bash
# Runs on the Namecheap server from .cpanel.yml after the deploy branch is pulled.
# The public site is left on public_html until a preview URL answers as Django.
set -euo pipefail

echo "deploy start $(date -u +%Y-%m-%dT%H:%M:%SZ)"
REPO="/home/djstlime/repositories/dj-stratagem"
APP="/home/djstlime/djstratagem"
ENV_FILE="/home/djstlime/djs-django.env"
HOLD="/home/djstlime/djs-static-hold"
DOMAIN="djstratageminc.com"
PREVIEW_URI="djs-preview"
LOG="/home/djstlime/logs/djs-passenger.log"

mkdir -p /home/djstlime/logs "$APP" "$HOLD"

if [[ -x /usr/sbin/cloudlinux-selector ]]; then
  SELECTOR=/usr/sbin/cloudlinux-selector
elif [[ -x /usr/bin/cloudlinux-selector ]]; then
  SELECTOR=/usr/bin/cloudlinux-selector
else
  echo "cloudlinux-selector is not on this host. public_html was not changed."
  exit 1
fi

selector_json() {
  local out
  out=$("$SELECTOR" "$@" 2>&1) || true
  printf '%s\n' "$out" >&2
  SELECTOR_OUT="$out"
  python3 - "$out" <<'PY'
import json, sys
raw = sys.argv[1]
start = raw.find("{")
if start < 0:
    sys.exit(1)
try:
    data = json.loads(raw[start:])
except json.JSONDecodeError:
    sys.exit(1)
if data.get("result") not in (None, "success"):
    sys.exit(1)
PY
}

echo "==> Sync application files (keep data/ and media/)"
/usr/bin/rsync -a --delete \
  --exclude '.git/' \
  --exclude '.cpanel.yml' \
  --exclude 'data/' \
  --exclude 'media/' \
  --exclude 'public/data/' \
  "$REPO/" "$APP/"
mkdir -p "$APP/data" "$APP/media"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "==> Writing $ENV_FILE"
  umask 077
  secret=$(python3 -c 'import secrets; print(secrets.token_urlsafe(48))')
  cat > "$ENV_FILE" <<EOF
DJANGO_SETTINGS_MODULE=config.settings.prod
DJANGO_SECRET_KEY=${secret}
DJANGO_ALLOWED_HOSTS=${DOMAIN},www.${DOMAIN}
SITE_URL=https://${DOMAIN}
DJANGO_BEHIND_PROXY=1
DJANGO_SECURE_SSL=0
CSRF_TRUSTED_ORIGINS=https://${DOMAIN},https://www.${DOMAIN}
CONTACT_TO_EMAIL=hello@djstratageminc.com
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EOF
  chmod 600 "$ENV_FILE"
fi

echo "==> Choose a Python >= 3.12"
version=$(
  "$SELECTOR" get --json --interpreter python | python3 -c '
import json, sys
data = json.load(sys.stdin)
versions = data.get("available_versions") or {}
good = []
for name, info in versions.items():
    if isinstance(info, dict) and info.get("status") != "enabled":
        continue
    parts = name.split(".")
    try:
        major, minor = int(parts[0]), int(parts[1])
    except (ValueError, IndexError):
        continue
    if (major, minor) >= (3, 12):
        good.append((major, minor, name))
good.sort()
print(good[-1][2] if good else "")
'
)
if [[ -z "$version" ]]; then
  echo "No enabled Python 3.12+ in the selector. public_html was not changed."
  exit 1
fi
echo "Using Python ${version}"

app_exists=$("$SELECTOR" get --json --interpreter python | python3 -c '
import json, sys
data = json.load(sys.stdin)
found = False
for info in (data.get("available_versions") or {}).values():
    apps = ((info or {}).get("users") or {}).get("djstlime", {}).get("applications") or {}
    if "djstratagem" in apps:
        found = True
print("yes" if found else "no")
' || echo no)

if [[ "$app_exists" != "yes" ]]; then
  echo "==> Create preview application at /${PREVIEW_URI}/"
  if ! selector_json create --json --interpreter python \
    --domain "$DOMAIN" \
    --app-root djstratagem \
    --app-uri "$PREVIEW_URI" \
    --version "$version" \
    --startup-file passenger_wsgi.py \
    --entry-point application \
    --passenger-log-file "$LOG"; then
    if printf '%s' "$SELECTOR_OUT" | grep -qi 'exist'; then
      echo "Application already exists; continuing."
    else
      echo "Could not create the Python app. public_html was not changed."
      exit 1
    fi
  fi
fi

# create can drop a sample startup file; put ours back without deleting data.
/usr/bin/rsync -a --exclude 'data/' --exclude 'media/' "$REPO/" "$APP/"

echo "==> Install Python packages"
selector_json install-modules --json --interpreter python \
  --app-root djstratagem \
  --requirements-file "$APP/requirements-shared.txt"

echo "==> Virtualenv layout"
find /home/djstlime/virtualenv -maxdepth 4 \( -type d -o -type f -name 'python*' \) 2>/dev/null | head -80 || true
venv_python=$(find /home/djstlime/virtualenv -type f -name 'python3*' ! -name '*config' 2>/dev/null | sort | tail -1)
if [[ -z "${venv_python}" ]]; then
  echo "Selector virtualenv python was not found."
  exit 1
fi
echo "Using ${venv_python}"

echo "==> Migrate and collect static files"
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a
(
  cd "$APP"
  "$venv_python" manage.py migrate --noinput
  "$venv_python" manage.py collectstatic --noinput
)

selector_json restart --json --interpreter python --app-root djstratagem

echo "==> Preview health"
preview_ok=0
for _ in $(seq 1 24); do
  body=$(curl -fsS --max-time 20 "https://${DOMAIN}/${PREVIEW_URI}/health/" || true)
  if printf '%s' "$body" | grep -q '"service": "django"'; then
    preview_ok=1
    break
  fi
  echo "preview: ${body:-<none>}"
  sleep 5
done
if [[ "$preview_ok" != "1" ]]; then
  echo "Preview did not become Django. Removing the app. public_html stays as it was."
  "$SELECTOR" destroy --json --interpreter python --app-root djstratagem || true
  exit 1
fi

echo "==> Point ${DOMAIN} at Django"
selector_json set --json --interpreter python \
  --app-root djstratagem \
  --new-app-uri / \
  --startup-file passenger_wsgi.py \
  --entry-point application
selector_json restart --json --interpreter python --app-root djstratagem

hold_static() {
  for name in index.html .htaccess; do
    if [[ -f "/home/djstlime/public_html/${name}" && ! -f "${HOLD}/${name}" ]]; then
      cp -a "/home/djstlime/public_html/${name}" "${HOLD}/${name}"
    fi
    if [[ -f "/home/djstlime/public_html/${name}" ]]; then
      mv "/home/djstlime/public_html/${name}" "/home/djstlime/public_html/${name}.djs-held"
    fi
  done
}
restore_static() {
  for name in index.html .htaccess; do
    if [[ -f "/home/djstlime/public_html/${name}.djs-held" ]]; then
      mv "/home/djstlime/public_html/${name}.djs-held" "/home/djstlime/public_html/${name}"
    elif [[ -f "${HOLD}/${name}" && ! -f "/home/djstlime/public_html/${name}" ]]; then
      cp -a "${HOLD}/${name}" "/home/djstlime/public_html/${name}"
    fi
  done
}

live_ok=0
for attempt in 1 2 3 4 5 6; do
  if [[ "$attempt" == "3" ]]; then
    echo "Homepage still looks static; holding index.html and .htaccess aside"
    hold_static
    selector_json restart --json --interpreter python --app-root djstratagem || true
  fi
  home=$(curl -fsS --max-time 20 "https://${DOMAIN}/" || true)
  health=$(curl -fsS --max-time 20 "https://${DOMAIN}/health/" || true)
  if printf '%s' "$health" | grep -q '"service": "django"' && printf '%s' "$home" | grep -q 'Find the work'; then
    live_ok=1
    break
  fi
  echo "live attempt ${attempt}: health=${health:-<none>}"
  sleep 5
done

if [[ "$live_ok" != "1" ]]; then
  echo "Root did not switch cleanly. Restoring the static homepage."
  restore_static
  "$SELECTOR" set --json --interpreter python --app-root djstratagem --new-app-uri "$PREVIEW_URI" || \
    "$SELECTOR" destroy --json --interpreter python --app-root djstratagem || true
  exit 1
fi

echo "Django is live at https://${DOMAIN}/"
