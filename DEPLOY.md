# Deploying djstratageminc.com on Fly.io

The site runs as the Docker image in this repo: Gunicorn, WhiteNoise, and
SQLite on a Fly volume. Nothing here creates the Fly app or changes DNS.
Jesse does those steps once, from a machine that is logged into Fly.

Do not scale past one Machine. The database file and the volume attach to a
single Machine. A second Machine would boot onto an empty disk.

## Cost

Prices are Fly's published rates (shared-cpu, lax at a 1.20 region multiplier).
A `shared-cpu-1x` Machine with 512 MB in Los Angeles is about **$4.43 per 30
days** if it runs the whole time, plus **$0.15** for the 1 GB volume. Outbound
traffic in North America is $0.02 per GB. Shared IPv4 and IPv6 are included.

`auto_stop_machines` / `auto_start_machines` stop the Machine after it goes
idle and start it on the next request. Stopped compute is not billed; the
volume still is. A quiet month is about **$1** (volume, plus a small rootfs
charge while stopped, plus whatever time the Machine actually ran). A month
where it never sleeps is about **$5** before tax. A 256 MB Machine would be
about $2.63 of compute in lax and is below what this process needs.

## One-time setup

Install [flyctl](https://fly.io/docs/flyctl/install/) and run `fly auth login`.

```bash
fly launch --no-deploy --copy-config --name djstratagem --region lax
fly volumes create djs_data --region lax --size 1 --yes
```

`fly.toml` already names the volume `djs_data`. `initial_size` also asks
`fly deploy` to create it on the first release if it is missing. App names are
global: if `djstratagem` is taken, pick another, and change `app` plus the
`djstratagem.fly.dev` host in `fly.toml` to match.

Generate a secret and store it on Fly. Do not put it in `fly.toml` or git.

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(48))"
fly secrets set DJANGO_SECRET_KEY='the-value-you-just-generated'
```

Non-secret settings (hosts, CSRF origins, the data directory, one Gunicorn
worker and two threads) are already in `fly.toml`.

Mail is optional. Inquiries are saved either way. To send them, and to send
password resets:

```bash
fly secrets set \
  EMAIL_HOST='smtp.example.com' \
  EMAIL_PORT='587' \
  EMAIL_HOST_USER='hello@djstratageminc.com' \
  EMAIL_HOST_PASSWORD='mailbox-password' \
  EMAIL_USE_TLS='true' \
  DEFAULT_FROM_EMAIL='hello@djstratageminc.com' \
  CONTACT_TO_EMAIL='hello@djstratageminc.com'
```

Leave `EMAIL_BACKEND` unset. Production uses SMTP when `EMAIL_HOST` is set,
and the console backend when it is not.

Postgres is optional. Without `DATABASE_URL`, the app uses SQLite at
`/data/db.sqlite3` and stores uploads in `/data/media` on the volume.

```bash
fly secrets set DATABASE_URL='postgres://USER:PASSWORD@HOST:5432/djstratagem' DATABASE_SSL_REQUIRE='true'
```

Certificates, still before any DNS change:

```bash
fly certs add djstratageminc.com
fly certs add www.djstratageminc.com
```

## Required environment

| Variable | Where | Notes |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | `fly secrets` | Required. 50+ random characters. The image refuses to boot without it. |
| `DJANGO_ALLOWED_HOSTS` | `fly.toml` | Comma-separated. `*` is rejected. |
| `CSRF_TRUSTED_ORIGINS` | `fly.toml` | Full `https://` origins, comma-separated. |
| `DJANGO_SETTINGS_MODULE` | `fly.toml` | `config.settings.prod` |
| `DJANGO_BEHIND_PROXY` | `fly.toml` | `1`. Trusts `X-Forwarded-Proto` from Fly's proxy. |
| `DJANGO_SECURE_SSL` | `fly.toml` | `1`. Redirect to HTTPS, secure cookies, HSTS for 7 days, no preload. |
| `SITE_URL` | `fly.toml` | `https://djstratageminc.com` |
| `DJANGO_DATA_DIR` | `fly.toml` | `/data` (the volume). |
| `DJANGO_MEDIA_ROOT` | `fly.toml` | `/data/media` |
| `DATABASE_URL` | secret, optional | Postgres. Unset means SQLite on the volume. |
| `EMAIL_HOST` and the mailbox variables | secrets, optional | Needed for outbound mail. |

`WEB_CONCURRENCY` defaults to 1 and `GUNICORN_THREADS` to 2, which fits the
512 MB Machine. Raise them only after raising the Machine memory.

## First deploy and the admin user

```bash
./deploy.sh
```

The script checks that `flyctl` is installed, runs `manage.py check --deploy`,
then `flyctl deploy --remote-only`. It does not read the Fly secret. When
`DJANGO_SECRET_KEY` is unset locally it uses a placeholder for that check
only. It is safe to run again.

On boot the container migrates the database on the volume. Fly's release
command also runs `manage.py migrate`, in a temporary Machine that does not
mount the volume. That catches a bad migration before traffic moves, and it
migrates Postgres when `DATABASE_URL` is set. The copy that matters for SQLite
is the one on boot.

Check `https://djstratagem.fly.dev/health/` returns `{"ok": true, "service": "django"}`
before changing DNS.

## Bring the cPanel database across

Do this before `createsuperuser` and before the DNS change, when the cPanel
app has already stored anything. The cPanel deploy keeps the database and
uploads outside the git tree, at:

- `/home/djstlime/djstratagem/data/db.sqlite3`
- `/home/djstlime/djstratagem/media/`

If `db.sqlite3` is not there, the cPanel app was never used. Skip this section.
The Fly volume is seeded by migrations on first boot, and that empty site is
the one to cut over.

If the file is there, copy it onto the volume before creating a new staff
user. Replacing the file later would throw away that user. On the cPanel host:

```bash
mkdir -p /tmp/djs-export/media
cp /home/djstlime/djstratagem/data/db.sqlite3 /tmp/djs-export/db.sqlite3
cp -a /home/djstlime/djstratagem/media/. /tmp/djs-export/media/
tar czf /tmp/djs-cutover.tgz -C /tmp/djs-export db.sqlite3 media
```

Download that archive, then put it on the Machine and unpack it at `/data`
(the database at `/data/db.sqlite3`, uploads at `/data/media`). Restart
afterwards so the entrypoint gives those files to the `app` user:

```bash
fly ssh sftp put djs-cutover.tgz /tmp/djs-cutover.tgz
fly ssh console -C "tar xzf /tmp/djs-cutover.tgz -C /data && rm /tmp/djs-cutover.tgz"
fly apps restart
```

Confirm an account from the old database can sign in on the `fly.dev` hostname
before changing DNS. Create a staff user only when the restored database does
not already have one:

```bash
fly ssh console -C "python manage.py createsuperuser"
```

Approve member accounts at `/admin/`.

## GitHub

A push to `main` runs Django CI. `.github/workflows/fly-deploy.yml` deploys
with `flyctl deploy --remote-only` only after that run succeeds. A failing
lint, test, deploy check, or image build does not deploy. The workflow can
also be started by hand from the Actions tab. Add this repository secret first:

```bash
fly tokens create deploy -x 999999h
```

Put the token in GitHub as `FLY_API_TOKEN`. Until that secret exists, the
deploy workflow fails and the site is unchanged. Pull requests run lint,
`manage.py check --deploy`, tests, and `docker build`. They do not deploy.

## DNS cutover

Do this only after the `fly.dev` hostname serves the new site, and only after
the cPanel database and media have been restored or confirmed absent. The
records come from Fly, not from this file:

```bash
fly certs show djstratageminc.com
fly certs show www.djstratageminc.com
fly certs check djstratageminc.com
```

`fly certs` prints the A, AAAA, or CNAME values to set. At the DNS host
(Namecheap Advanced DNS for this domain):

1. Lower the TTL on the existing records a day ahead, if the panel allows it.
2. Replace the apex A and AAAA records with the addresses `fly certs` shows.
   If it asks for a CNAME or ALIAS on the apex instead, use that.
3. Point `www` at the CNAME `fly certs` shows (usually `djstratagem.fly.dev`).
4. Remove the old cPanel / parking records for `@` and `www` so only the Fly
   addresses remain. Leave mail records (MX, and the SPF TXT) as they are.
5. Run `fly certs check djstratageminc.com` and the same command for `www`
   until both certificates are issued.

Then open `https://djstratageminc.com/health/` and the homepage. To move back,
restore the previous A record. HSTS is one week and is not on the preload
list, so browsers drop it after that window.
