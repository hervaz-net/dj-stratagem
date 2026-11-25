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

Preview videos are not part of that bill once they move to R2. Playback is
served from the media hostname below, so those bytes are not Fly egress
($0.02 per GB in North America). The R2 section has the storage estimate.

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
`/data/db.sqlite3` and stores gallery uploads in `/data/media` on the volume.
Preview videos stay on that volume until the R2 variables below are set.

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
| `R2_ACCESS_KEY_ID` | `fly secrets`, with the four below | R2 API token. Unset, together with the rest, keeps videos on the volume. |
| `R2_SECRET_ACCESS_KEY` | `fly secrets` | Secret half of that token. |
| `R2_BUCKET_NAME` | `fly secrets` | Bucket name, for example `djstratagem-media`. |
| `R2_ENDPOINT_URL` | `fly secrets` | `https://<accountid>.r2.cloudflarestorage.com`, no bucket path. |
| `AWS_S3_CUSTOM_DOMAIN` | `fly secrets` | Public hostname only, `media.djstratageminc.com`. |

The five R2 variables are all set or all unset. A partial set makes production
refuse to boot. Gallery uploads are not part of this and stay on the volume.

`WEB_CONCURRENCY` defaults to 1 and `GUNICORN_THREADS` to 2, which fits the
512 MB Machine. Raise them only after raising the Machine memory.

## Preview videos on Cloudflare R2

Product preview videos and their posters are served from a Cloudflare R2
bucket on a public hostname such as `media.djstratageminc.com`. The Fly app
does not proxy those files. With the five variables unset, `STORAGES["videos"]`
is a directory on the volume (`/data/media/videos`, URLs under `/media/videos/`)
and nothing else changes. Gallery uploads always use the volume.

The Fly image installs `django-storages[s3]`. The cPanel requirements file
does not. Leave the R2 variables unset on that host.

### Bucket and custom domain

1. In the Cloudflare dashboard, create an R2 bucket. `djstratagem-media` is a
   fine name. Leave the storage class on Standard.
2. Create an R2 API token with Object Read and Write on that bucket only.
   Copy the access key id and the secret once. The S3 endpoint on the same
   screen looks like `https://<accountid>.r2.cloudflarestorage.com`. Use that
   value with no bucket name on the end.
3. Attach a custom domain, `media.djstratageminc.com`. The zone
   `djstratageminc.com` has to be on the same Cloudflare account as the
   bucket. The apex and `www` can keep pointing at Fly. Cloudflare creates
   the `media` record and proxies it. Public reads go through that hostname.
   Leave the `r2.dev` public URL disabled so there is one public name.
4. Paste the CORS policy under the bucket CORS settings. A plain `<video>`
   element does not send an `Origin` header, so it plays without CORS.
   The policy covers a `crossorigin` video, a poster drawn to a canvas, and
   the `Range` header the browser sends when it seeks.

```json
[
  {
    "AllowedOrigins": [
      "https://djstratageminc.com",
      "https://www.djstratageminc.com",
      "https://djstratagem.fly.dev"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["Range", "If-Range", "Content-Type"],
    "ExposeHeaders": [
      "Accept-Ranges",
      "Content-Range",
      "Content-Length",
      "Content-Type",
      "ETag"
    ],
    "MaxAgeSeconds": 86400
  }
]
```

After changing CORS on a hostname that is already cached, purge the cache for
`media.djstratageminc.com`. Cached objects keep the old response headers
until then.

### Range requests and cache

R2, and the Cloudflare cache in front of the custom domain, honor `Range`.
The response is `206 Partial Content` with `Accept-Ranges: bytes`. Seeking
in a video is a request to the media hostname, not to the Fly Machine.

URLs are unsigned (`AWS_QUERYSTRING_AUTH` is false). A signed query string
would miss the cache and can expire while someone is still watching. Objects
are stored with:

```text
Cache-Control: public, max-age=31536000, immutable
```

Treat the file name as immutable. When the picture changes, use a new name
and upload that. Reusing a name serves the old file until the cache entry
expires or you purge the hostname. R2 does not use S3 canned ACLs. Public
read is the custom domain, not `public-read`.

Content-Type is `video/mp4` for `.mp4`, `video/webm` for `.webm`, and the
matching image type for a poster. A browser will not play a file stored as
`application/octet-stream`. The upload script sets the type. Saving through
the `videos` storage sets it again. Disk serving registers the same types,
so a host with a thin mime database still sends `video/mp4` and `video/webm`.

The app does not send a Content-Security-Policy header. If a response
already has one, `media-src` and `img-src` gain `https://media.djstratageminc.com`
(the value of `AWS_S3_CUSTOM_DOMAIN`). Posters are images, so `img-src` is
included. A response with no policy is left alone.

A stored object is `https://media.djstratageminc.com/videos/<file>`.

### Secrets

Set all five, from a machine that is logged into Fly. Do not put them in
`fly.toml` or git.

```bash
fly secrets set \
  R2_ACCESS_KEY_ID='the-access-key-id' \
  R2_SECRET_ACCESS_KEY='the-secret' \
  R2_BUCKET_NAME='djstratagem-media' \
  R2_ENDPOINT_URL='https://ACCOUNT_ID.r2.cloudflarestorage.com' \
  AWS_S3_CUSTOM_DOMAIN='media.djstratageminc.com'
```

To move videos back to the volume, unset all five. Unsetting one of them
makes the next boot fail.

```bash
fly secrets unset \
  R2_ACCESS_KEY_ID \
  R2_SECRET_ACCESS_KEY \
  R2_BUCKET_NAME \
  R2_ENDPOINT_URL \
  AWS_S3_CUSTOM_DOMAIN
```

### Upload

Encode the files first (next section), into `media/videos/` in a checkout.
Then, on a machine with the AWS CLI v2 or rclone, from the repo root:

```bash
./scripts/upload_media.sh
```

The script reads the four credentials from the environment or from `.env`.
It syncs `media/videos/` to `videos/` in the bucket and sets the cache
header and content type. It does not delete remote objects that you removed
locally. `--dry-run` lists the work. `--reupload` sends every matching file
again so a corrected Content-Type replaces metadata on an object that was
already the same size. The AWS CLI is used when `aws` is on PATH, otherwise
rclone. Neither tool is installed in the Fly image. Run this from your
machine, not on the Machine.

### Encoding

Ship two files and a poster for each preview. Keep each video at or under
5 MB. The mp4 is H.264 with the `moov` atom at the front (`+faststart`), so
playback can start before the file has finished downloading and later seeks
are range requests. `yuv420p` is what current browsers decode.

```bash
ffmpeg -i source.mov -an -c:v libx264 -profile:v high -level 4.0 \
  -pix_fmt yuv420p -movflags +faststart -crf 28 -preset slow \
  -vf "scale='min(1280,iw)':-2" media/videos/projects.mp4

ffmpeg -i source.mov -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
  -vf "scale='min(1280,iw)':-2" media/videos/projects.webm

ffmpeg -ss 1 -i media/videos/projects.mp4 -frames:v 1 -q:v 3 \
  media/videos/projects.jpg
```

Drop `-an` if the preview has to keep sound. If a file is over 5 MB, raise
the CRF or cut the clip shorter, then run the same commands again. Use a
new file name when you replace a video that is already cached.

### What it costs

R2 Standard, at Cloudflare's published rates: storage is $0.015 per
GB-month, writes (Class A) are $4.50 per million, reads (Class B) are $0.36
per million, and egress is free. Each month includes 10 GB-month, 1 million
Class A operations, and 10 million Class B operations. The free tier does
not apply to Infrequent Access, which this bucket should not use.

Nine previews, each an mp4 and a webm at or under 5 MB, plus a poster, is
well under 1 GB. That sits inside the free tier, so the expected bill is
**$0**. Past the free storage, the next gigabytes are $0.015 each per month.
Egress stays $0 either way. The same views served by Fly would be the
North America egress rate above, $0.02 per GB, on every play.

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
