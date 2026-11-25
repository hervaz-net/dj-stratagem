#!/usr/bin/env bash
# Build and check the Django app. This script does not publish to cPanel.
#
# The live site is still the previous static export until DNS moves to a host
# that runs the container. Do not rsync this tree into public_html.
#
#   ./deploy.sh            # CSS, tests, docker image
#   ./deploy.sh --no-docker
#   ./deploy.sh --manual   # host, secrets, and DNS notes
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [[ "${1:-}" == "--manual" || "${1:-}" == "--instructions" ]]; then
  cat <<'TXT'
D&J Stratagem now runs as Django (gunicorn + WhiteNoise) in the Dockerfile.

This script does not update Namecheap cPanel. The previous workflow pushed a
static Next.js export to the `deploy` branch and asked cPanel to rsync it into
public_html. A Django process cannot run that way on this shared host.

Before the new site can replace https://djstratageminc.com:

1. Provision a host that can run the container (a small VPS, or any registry
   plus a platform that runs Docker). cPanel on server247.web-hosting.com is
   not that host.
2. Create a long DJANGO_SECRET_KEY and set DJANGO_ALLOWED_HOSTS to the
   hostname you will serve (djstratageminc.com,www.djstratageminc.com).
3. Set SITE_URL=https://djstratageminc.com.
4. Set DATABASE_URL for Postgres, or accept the SQLite file on a persistent
   volume. Put the volume on /app/data and /app/media.
5. Set EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, EMAIL_USE_TLS,
   DEFAULT_FROM_EMAIL, and CONTACT_TO_EMAIL so inquiry mail and password
   resets leave the server. Use a mailbox on the domain.
6. Put TLS in front of the container. Set DJANGO_BEHIND_PROXY=1 and
   DJANGO_SECURE_SSL=1 when the proxy sends X-Forwarded-Proto.
7. Set CSRF_TRUSTED_ORIGINS=https://djstratageminc.com,https://www.djstratageminc.com.
8. Create the first admin: docker compose exec web python manage.py createsuperuser
   Then approve member accounts at /admin/.
9. Point DNS only after /health/ returns {"ok": true} on the new host:
   Namecheap → Advanced DNS → A @ to the new host, CNAME www to the apex.
   Lower the TTL before the cutover.
10. Optional image push: set the repository variable DJANGO_DEPLOY_ENABLED=true
    plus DJANGO_REGISTRY, DJANGO_IMAGE, and the registry secrets. The workflow
    still does not restart a server and still does not call cPanel.

Until that cutover, the current public_html site keeps serving the last
static deploy. Merging this branch stops new cPanel publishes so the live
files are not replaced with a Django tree the shared host cannot run.
TXT
  exit 0
fi

step() { printf '\n==> %s\n' "$*"; }

step "CSS"
( cd theme && npm install && npm run css )

step "Tests"
if [[ ! -d .venv ]]; then
  python3 -m venv .venv
  .venv/bin/pip install -r requirements.txt
fi
DJANGO_SETTINGS_MODULE=config.settings.dev .venv/bin/python manage.py test --verbosity 1

if [[ "${1:-}" == "--no-docker" ]]; then
  echo "Skipped docker build."
  exit 0
fi

step "Docker image"
docker build -t djstratagem:local .
echo "Image djstratagem:local is local only. Nothing was published."
