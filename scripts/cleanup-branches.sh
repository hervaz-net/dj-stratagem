#!/usr/bin/env bash
# Delete every remote branch except main and deploy, after saving each one.
#
# Each branch head is first pushed to refs/archive/<branch>. Those refs are
# hidden from GitHub's branch list but keep the commits, so any branch can be
# brought back with:
#   git fetch origin refs/archive/<branch>:refs/heads/<branch>
#   git push origin <branch>
#
# Usage:
#   scripts/cleanup-branches.sh           # dry run: list what would go
#   scripts/cleanup-branches.sh --apply   # archive, tag the baseline, delete
set -euo pipefail

KEEP='^(main|deploy)$'
REMOTE=origin

git fetch --prune "$REMOTE" '+refs/heads/*:refs/remotes/origin/*'
mapfile -t branches < <(git for-each-ref --format='%(refname:lstrip=3)' "refs/remotes/$REMOTE" | grep -v -E "$KEEP|^HEAD$")

echo "${#branches[@]} branches to remove (keeping main and deploy)."
if [ "${1:-}" != "--apply" ]; then
  printf '  %s\n' "${branches[@]}"
  echo "Dry run. Re-run with --apply to archive and delete."
  exit 0
fi

git tag -a baseline-2026-10-26 "$REMOTE/main" -m "Clean baseline after branch cleanup" 2>/dev/null || true
git push "$REMOTE" baseline-2026-10-26

for b in "${branches[@]}"; do
  git push -q "$REMOTE" "refs/remotes/$REMOTE/$b:refs/archive/$b"
done
echo "Archived ${#branches[@]} branches under refs/archive/."

for b in "${branches[@]}"; do
  git push -q "$REMOTE" --delete "$b"
done
echo "Deleted ${#branches[@]} branches."
