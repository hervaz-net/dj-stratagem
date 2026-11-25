#!/usr/bin/env bash
# Manual Fly deploy. Safe to re-run.
# One-time app, secret, certificate, and DNS steps live in DEPLOY.md.
# This script does not create the Fly app and does not change DNS.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  cat <<'TXT'
Usage: ./deploy.sh [extra flyctl deploy options]

Loads .env when that file exists, runs manage.py check --deploy against the
production settings, then runs: flyctl deploy --remote-only
The Fly secret is not required on this machine. An unset DJANGO_SECRET_KEY
is replaced with a local placeholder for the check only.

Setup (once): DEPLOY.md
TXT
  exit 0
fi

if ! command -v flyctl >/dev/null 2>&1; then
  echo "flyctl is not on PATH. Install it from https://fly.io/docs/flyctl/install/ and then run fly auth login. See DEPLOY.md." >&2
  exit 1
fi

if [[ ! -f fly.toml ]]; then
  echo "fly.toml is missing. Run this script from the repository root." >&2
  exit 1
fi

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

# The real DJANGO_SECRET_KEY stays in Fly secrets. This value only lets the
# local deploy check import production settings. It is not sent to Fly.
if [[ -z "${DJANGO_SECRET_KEY:-}" || "${DJANGO_SECRET_KEY}" == dev-only* ]]; then
  export DJANGO_SECRET_KEY="local-deploy-check-only-0123456789abcdef-not-a-fly-secret"
  echo "Using a local placeholder for the deploy check. The app reads DJANGO_SECRET_KEY from Fly secrets."
fi
export DJANGO_ALLOWED_HOSTS="${DJANGO_ALLOWED_HOSTS:-djstratageminc.com,www.djstratageminc.com}"
export CSRF_TRUSTED_ORIGINS="${CSRF_TRUSTED_ORIGINS:-https://djstratageminc.com,https://www.djstratageminc.com}"
export DJANGO_SETTINGS_MODULE=config.settings.prod
export DJANGO_BEHIND_PROXY=1
export DJANGO_SECURE_SSL=1

if [[ -x .venv/bin/python ]]; then
  PY=".venv/bin/python"
else
  PY="${PYTHON:-python3}"
fi

if ! "$PY" -c "import django" >/dev/null 2>&1; then
  echo "Django is not installed for ${PY}. Create a venv and pip install -r requirements.txt." >&2
  exit 1
fi

echo "==> manage.py check --deploy"
"$PY" manage.py check --deploy

echo "==> flyctl deploy --remote-only"
flyctl deploy --remote-only "$@"
