#!/bin/sh
# Starts as root so a Fly volume (mounted root-owned) can be chowned, then
# re-execs this script as the unprivileged user `app`. With no arguments the
# process migrates and serves. Arguments replace the server command, which is
# how `fly deploy` runs the release command (ENTRYPOINT is not replaced).
set -eu

mkdir -p /data/media /app/data /app/media

if [ "$(id -u)" -eq 0 ]; then
  chown -R app:app /data /app/data /app/media
  exec gosu app "$0" "$@"
fi

if [ "$#" -gt 0 ]; then
  if [ "$#" -eq 1 ]; then
    case "$1" in
      *" "*) exec sh -c "$1" ;;
    esac
  fi
  exec "$@"
fi

echo "Applying database migrations"
python manage.py migrate --noinput

exec gunicorn config.wsgi:application \
  --bind "0.0.0.0:${PORT:-8000}" \
  --workers "${WEB_CONCURRENCY:-1}" \
  --threads "${GUNICORN_THREADS:-2}" \
  --worker-class "${GUNICORN_WORKER_CLASS:-gthread}" \
  --timeout "${GUNICORN_TIMEOUT:-30}" \
  --graceful-timeout "${GUNICORN_GRACEFUL_TIMEOUT:-20}" \
  --keep-alive "${GUNICORN_KEEPALIVE:-5}" \
  --access-logfile - \
  --error-logfile - \
  --access-logformat '{"ts":"%(t)s","level":"INFO","logger":"gunicorn.access","ip":"%(h)s","method":"%(m)s","path":"%(U)s","status":"%(s)s","bytes":"%(B)s","duration_ms":%(M)s}'
