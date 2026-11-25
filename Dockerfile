# Assets, then a dependency venv, then a slim runtime. Dev packages stay out
# of the runtime image. The server process runs as user `app` (see entrypoint).

FROM node:22.23.4-bookworm-slim AS assets
WORKDIR /src/theme
COPY theme/package.json theme/package-lock.json ./
RUN npm ci
COPY theme/ ./
RUN npm run css

FROM python:3.12.16-slim-bookworm AS python-deps
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12.16-slim-bookworm AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DJANGO_SETTINGS_MODULE=config.settings.prod \
    PORT=8000 \
    WEB_CONCURRENCY=1 \
    GUNICORN_THREADS=2 \
    GUNICORN_TIMEOUT=30 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gosu \
    && rm -rf /var/lib/apt/lists/* \
    && adduser --disabled-password --gecos "" app

COPY --from=python-deps /opt/venv /opt/venv
COPY manage.py ./
COPY config ./config
COPY accounts ./accounts
COPY content ./content
COPY inquiries ./inquiries
COPY templates ./templates
COPY static ./static
COPY public/media ./public/media
COPY public/fleet-cards.html public/signage.html public/receipts.html public/support.js public/doc-page.js ./public/
COPY --from=assets /src/static/css ./static/css
COPY --from=assets /src/static/fonts ./static/fonts
COPY docker/entrypoint.sh /entrypoint.sh

RUN mkdir -p /app/data /app/media /app/staticfiles /data/media \
    && DJANGO_COLLECTSTATIC_BUILD=1 \
       DJANGO_SECRET_KEY=build-only-placeholder-not-a-runtime-secret-do-not-use \
       DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1 \
       CSRF_TRUSTED_ORIGINS=https://djstratageminc.com \
       python manage.py collectstatic --noinput \
    && chown -R app:app /app /data \
    && chmod 755 /entrypoint.sh

EXPOSE 8000

# Sends X-Forwarded-Proto so the check still passes when SSL redirect is on.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD python -c "import os,urllib.request; urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:'+os.environ.get('PORT','8000')+'/health/', headers={'X-Forwarded-Proto':'https'}), timeout=4)"

ENTRYPOINT ["/entrypoint.sh"]
