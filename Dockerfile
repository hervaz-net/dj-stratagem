# Build Tailwind, then run Django under gunicorn. No CDN assets.
FROM node:22-bookworm-slim AS assets
WORKDIR /src/theme
COPY theme/package.json theme/package-lock.json ./
RUN npm ci
COPY theme/ ./
RUN npm run css

FROM python:3.12-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings.prod \
    PORT=8000
WORKDIR /app

RUN adduser --disabled-password --gecos "" app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py .
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

RUN mkdir -p /app/data /app/media /app/staticfiles \
    && DJANGO_SECRET_KEY=build-only-placeholder-not-a-runtime-secret \
       DJANGO_ALLOWED_HOSTS=localhost \
       python manage.py collectstatic --noinput \
    && chown -R app:app /app \
    && chmod +x /entrypoint.sh
USER app
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health/')"
ENTRYPOINT ["/entrypoint.sh"]
