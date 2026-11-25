#!/usr/bin/env python3
"""
Fill missing product image URLs by reading og:image from product pages.

Used for Global Industrial (and best-effort MyFBM) after import-catalog-xlsx.py.
Rewrites GI pdp/ URLs to the 1000x1000 HD path when that asset exists.

Usage:
  python3 scripts/enrich-catalog-images.py
  python3 scripts/enrich-catalog-images.py --sources gi,myfbm --workers 24
"""

from __future__ import annotations

import argparse
import gzip
import json
import pathlib
import re
import sqlite3
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "data" / "catalog"
UA = "Mozilla/5.0 (compatible; StratagemCatalogBot/1.0; +https://djstratageminc.com)"

OG_RE = re.compile(
    r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']|'
    r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
    re.I,
)
CLOUDINARY_RE = re.compile(r"https://res\.cloudinary\.com/[^\"'\\s]+", re.I)
GI_PDP_RE = re.compile(r"https://images\.globalindustrial\.com/images/pdp/([^/?#]+)", re.I)


def fetch(url: str, timeout: float = 18.0) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "ignore") if e.fp else ""
        return e.code, body
    except Exception:
        return 0, ""


def head_ok(url: str, timeout: float = 10.0) -> bool:
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            chunk = resp.read(32)
            return resp.status == 200 and (chunk.startswith(b"RIFF") or chunk.startswith(b"\xff\xd8") or chunk.startswith(b"\x89PNG"))
    except Exception:
        return False


def gi_hd_from_og(og: str) -> tuple[str, str]:
    """Prefer 1000x1000 when present; fall back to the og/pdp asset."""
    m = GI_PDP_RE.search(og)
    if not m:
        return og, og
    file_name = m.group(1)
    hd = f"https://images.globalindustrial.com/images/1000x1000/{file_name}"
    if head_ok(hd):
        thumb = f"https://images.globalindustrial.com/images/800x800/{file_name}"
        if not head_ok(thumb):
            thumb = hd
        return thumb, hd
    return og, og


def extract_image(source: str, html: str) -> tuple[str, str]:
    if not html:
        return "", ""
    m = OG_RE.search(html)
    og = (m.group(1) or m.group(2) or "").strip() if m else ""
    if source == "gi" and og and "globalindustrial.com/images/" in og and "logo" not in og.lower():
        return gi_hd_from_og(og)
    if source == "myfbm":
        # Prefer a real product asset over the site logo.
        for cand in CLOUDINARY_RE.findall(html):
            if any(x in cand.lower() for x in ("logo", "icon", "sprite")):
                continue
            # Ask Cloudinary for a wide render.
            if "/upload/" in cand and "/w_" not in cand:
                cand = cand.replace("/upload/", "/upload/w_1600,c_limit,q_auto,f_auto/")
            return cand, cand
        if og and "logo" not in og.lower() and og.endswith((".jpg", ".jpeg", ".png", ".webp")):
            return og, og
    if og and "logo" not in og.lower():
        return og, og
    return "", ""


def enrich_row(source: str, row: dict) -> dict:
    if row.get("image") and row.get("imageHd"):
        return row
    page = (row.get("url") or "").strip()
    if not page:
        return row
    code, html = fetch(page)
    if code != 200:
        return row
    image, image_hd = extract_image(source, html)
    if image:
        row["image"] = image[:400]
        row["imageHd"] = (image_hd or image)[:400]
    return row


def rebuild_sqlite(manifest: list[dict]) -> None:
    # Reuse import builder by shelling logic inline (keep schema in sync).
    from importlib.machinery import SourceFileLoader

    mod = SourceFileLoader("import_catalog_xlsx", str(ROOT / "scripts" / "import-catalog-xlsx.py")).load_module()
    mod.build_sqlite(manifest)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--sources", default="gi,myfbm", help="comma list: gi,myfbm")
    ap.add_argument("--workers", type=int, default=20)
    ap.add_argument("--limit", type=int, default=0, help="optional cap per source (0 = all)")
    args = ap.parse_args()
    sources = [s.strip() for s in args.sources.split(",") if s.strip()]

    manifest_path = OUT / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    t0 = time.time()

    for source in sources:
        path = OUT / f"{source}.jsonl.gz"
        if not path.exists():
            print(f"skip {source}: missing {path}", file=sys.stderr)
            continue
        rows = [json.loads(line) for line in gzip.open(path, "rt", encoding="utf-8")]
        need = [i for i, r in enumerate(rows) if not r.get("image")]
        if args.limit:
            need = need[: args.limit]
        print(f"{source}: enriching {len(need)} / {len(rows)}", file=sys.stderr)
        filled = 0
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futs = {pool.submit(enrich_row, source, dict(rows[i])): i for i in need}
            done = 0
            for fut in as_completed(futs):
                i = futs[fut]
                rows[i] = fut.result()
                if rows[i].get("image"):
                    filled += 1
                done += 1
                if done % 200 == 0 or done == len(need):
                    print(f"  {source} {done}/{len(need)} filled={filled}", file=sys.stderr)
        with gzip.open(path, "wt", encoding="utf-8") as f:
            for r in rows:
                f.write(json.dumps(r, separators=(",", ":")) + "\n")
        for m in manifest:
            if m.get("source") == source or m.get("sellerKey") == source:
                m["bytes"] = path.stat().st_size
                m["images"] = sum(1 for r in rows if r.get("image"))
        print(f"{source}: wrote images for {filled}", file=sys.stderr)

    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    rebuild_sqlite(manifest)
    print(f"done in {time.time() - t0:.1f}s", file=sys.stderr)


if __name__ == "__main__":
    main()
