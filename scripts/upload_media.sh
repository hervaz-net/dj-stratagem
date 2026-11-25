#!/usr/bin/env bash
# Upload media/videos to Cloudflare R2.
#
# Objects are public through the custom domain. Each object is stored with
# Cache-Control: public, max-age=31536000, immutable
# and a Content-Type taken from its extension (video/mp4, video/webm, and
# image types for posters). R2 answers HTTP Range itself; this script only
# uploads. See DEPLOY.md.
#
# Uses the AWS CLI when `aws` is on PATH, otherwise rclone. Credentials come
# from the environment or from .env in the repo root. They are not printed.
#
#   ./scripts/upload_media.sh
#   ./scripts/upload_media.sh --dry-run
#   ./scripts/upload_media.sh --reupload /path/to/videos
#
# Unchanged files are skipped. --reupload sends them again so a corrected
# Content-Type or Cache-Control replaces the metadata already on the object.
# Remote objects that were removed locally are left in place.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

usage() {
  cat <<'TXT'
Usage: scripts/upload_media.sh [--dry-run] [--reupload] [videos-dir]

Syncs the videos directory to s3://$R2_BUCKET_NAME/videos/ with a one-year
immutable Cache-Control and a Content-Type per extension.

Requires R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and
R2_ENDPOINT_URL. AWS_S3_CUSTOM_DOMAIN is not used here; it only affects
the URLs Django builds.
TXT
}

DRY_RUN=0
REUPLOAD=0
SRC=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    --dry-run)
      DRY_RUN=1
      ;;
    --reupload)
      REUPLOAD=1
      ;;
    -*)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [[ -n "$SRC" ]]; then
        echo "Unexpected argument: $1" >&2
        exit 2
      fi
      SRC="$1"
      ;;
  esac
  shift
done

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

access_key="${R2_ACCESS_KEY_ID:-${AWS_S3_ACCESS_KEY_ID:-${AWS_ACCESS_KEY_ID:-}}}"
secret_key="${R2_SECRET_ACCESS_KEY:-${AWS_S3_SECRET_ACCESS_KEY:-${AWS_SECRET_ACCESS_KEY:-}}}"
bucket="${R2_BUCKET_NAME:-${AWS_STORAGE_BUCKET_NAME:-}}"
endpoint="${R2_ENDPOINT_URL:-${AWS_S3_ENDPOINT_URL:-}}"

missing=()
[[ -n "$access_key" ]] || missing+=("R2_ACCESS_KEY_ID")
[[ -n "$secret_key" ]] || missing+=("R2_SECRET_ACCESS_KEY")
[[ -n "$bucket" ]] || missing+=("R2_BUCKET_NAME")
[[ -n "$endpoint" ]] || missing+=("R2_ENDPOINT_URL")
if [[ ${#missing[@]} -gt 0 ]]; then
  echo "Missing ${missing[*]}. See DEPLOY.md." >&2
  exit 1
fi

SRC="${SRC:-${MEDIA_VIDEOS_DIR:-$ROOT/media/videos}}"
if [[ ! -d "$SRC" ]]; then
  echo "No video directory at ${SRC}." >&2
  echo "Encode previews into media/videos/ first. See DEPLOY.md." >&2
  exit 1
fi
if [[ -z "$(find "$SRC" -type f -print -quit)" ]]; then
  echo "No files in ${SRC}. Nothing to upload."
  exit 0
fi

export AWS_ACCESS_KEY_ID="$access_key"
export AWS_SECRET_ACCESS_KEY="$secret_key"
export AWS_DEFAULT_REGION=auto
export AWS_EC2_METADATA_DISABLED=true
# Recent AWS CLI releases send flexible checksums that R2 rejects.
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required

CACHE="public, max-age=31536000, immutable"
PREFIX="videos"

content_type() {
  case "$1" in
    mp4|m4v) printf '%s\n' "video/mp4" ;;
    webm) printf '%s\n' "video/webm" ;;
    jpg|jpeg) printf '%s\n' "image/jpeg" ;;
    png) printf '%s\n' "image/png" ;;
    webp) printf '%s\n' "image/webp" ;;
    avif) printf '%s\n' "image/avif" ;;
    gif) printf '%s\n' "image/gif" ;;
    *) return 1 ;;
  esac
}

upload_aws() {
  local ext="$1"
  local ctype="$2"
  local -a cmd
  if [[ "$REUPLOAD" -eq 1 ]]; then
    cmd=(aws s3 cp "$SRC" "s3://${bucket}/${PREFIX}" --recursive --metadata-directive REPLACE)
  else
    cmd=(aws s3 sync "$SRC" "s3://${bucket}/${PREFIX}")
  fi
  cmd+=(
    --endpoint-url "$endpoint"
    --region auto
    --exclude "*"
    --include "*.${ext}"
    --include "*.${ext^^}"
    --content-type "$ctype"
    --cache-control "$CACHE"
    --no-progress
  )
  if [[ "$DRY_RUN" -eq 1 ]]; then
    cmd+=(--dry-run)
  fi
  "${cmd[@]}"
}

upload_rclone() {
  local ext="$1"
  local ctype="$2"
  export RCLONE_CONFIG_R2_TYPE=s3
  export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
  export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
  export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
  export RCLONE_CONFIG_R2_ENDPOINT="$endpoint"
  export RCLONE_CONFIG_R2_REGION=auto
  export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true
  local -a cmd
  cmd=(
    rclone copy "$SRC" "r2:${bucket}/${PREFIX}"
    --include "*.${ext}"
    --include "*.${ext^^}"
    --header-upload "Cache-Control: ${CACHE}"
    --header-upload "Content-Type: ${ctype}"
    --s3-no-check-bucket
  )
  if [[ "$REUPLOAD" -eq 1 ]]; then
    cmd+=(--ignore-times)
  fi
  if [[ "$DRY_RUN" -eq 1 ]]; then
    cmd+=(--dry-run)
  fi
  "${cmd[@]}"
}

if command -v aws >/dev/null 2>&1; then
  tool="aws"
  uploader=upload_aws
elif command -v rclone >/dev/null 2>&1; then
  tool="rclone"
  uploader=upload_rclone
else
  echo "Install the AWS CLI v2 or rclone, then re-run. Neither is on PATH." >&2
  exit 1
fi

exts=(mp4 m4v webm jpg jpeg png webp avif gif)
for ext in "${exts[@]}"; do
  if [[ -z "$(find "$SRC" -type f -iname "*.${ext}" -print -quit)" ]]; then
    continue
  fi
  "$uploader" "$ext" "$(content_type "$ext")"
done

echo "Uploaded ${SRC} to r2://${bucket}/${PREFIX} with ${tool}."
