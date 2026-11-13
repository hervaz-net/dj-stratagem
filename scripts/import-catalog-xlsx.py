#!/usr/bin/env python3
"""
Convert supplier spreadsheets into the bundled marketplace catalog.

Reads .xlsx files (Uline / Global Industrial / MyFBM shaped columns), writes:
  public/data/catalog/{uline,gi,myfbm}.jsonl.gz
  public/data/catalog/products.sqlite
  public/data/catalog/manifest.json
  public/data/catalog/sellers.json

Demo seller names stay generic on purpose (PROOF.md): these are sample catalogs
for browse, not live storefronts or affiliations with the source retailers.

Usage:
  python3 scripts/import-catalog-xlsx.py path/to/uline.xlsx path/to/gi.xlsx path/to/myfbm.xlsx
  # or with defaults from an uploads folder:
  python3 scripts/import-catalog-xlsx.py --from-dir /path/to/uploads
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

try:
    import openpyxl
except ImportError:
    sys.stderr.write("install openpyxl: pip install openpyxl\n")
    sys.exit(1)

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "data" / "catalog"

SELLERS = {
    "uline": ("Demo Packaging & Shipping Catalog", "distributor", "Uline"),
    "gi": ("Demo Industrial Supplies Catalog", "distributor", "Global Industrial"),
    "myfbm": ("Demo Building Materials Catalog", "distributor", "MyFBM"),
}


def detect_source(path: pathlib.Path) -> str:
    name = path.name.lower()
    if "uline" in name:
        return "uline"
    if "gi_" in name or "global" in name or "building_supplies" in name:
        return "gi"
    if "myfbm" in name or "fbm" in name:
        return "myfbm"
    raise SystemExit(f"cannot detect source from filename: {path}")


def clean_sku(sku: object) -> str:
    s = re.sub(r"[^A-Za-z0-9._/#-]+", "-", str(sku or "").strip())
    s = re.sub(r"-+", "-", s).strip("-")
    if not s or not re.match(r"^[A-Za-z0-9]", s):
        s = "X" + s
    return s[:40]


def clean_unit(u: object) -> str:
    u = str(u or "each").strip().lower()
    if u in ("1", "1.0"):
        return "each"
    u = re.sub(r"[^a-z0-9]+", "", u)[:16] or "each"
    return u


def parse_stock(v: object) -> int:
    s = str(v or "").lower()
    if any(x in s for x in ("instock", "available", "in stock", "ships")):
        return 100
    if any(x in s for x in ("out", "unavailable", "backorder")):
        return 0
    try:
        return max(0, int(float(v)))  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return 0


def parse_lead(v: object) -> int:
    s = str(v or "").lower()
    m = re.search(r"(\d+)\s*business\s*day", s)
    if m:
        return min(365, int(m.group(1)))
    if "same day" in s:
        return 0
    if "next day" in s or "1 business" in s:
        return 1
    return 3 if parse_stock(v) > 0 else 14


def parse_price(v: object) -> float | None:
    try:
        p = float(v)  # type: ignore[arg-type]
        return p if p > 0 else None
    except (TypeError, ValueError):
        return None


def truncate(s: object, n: int) -> str:
    return " ".join(str(s or "").split())[:n]


def convert_sheet(path: pathlib.Path, source: str) -> tuple[pathlib.Path, int, int]:
    seller_name, role, source_label = SELLERS[source]
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb[wb.sheetnames[0]]
    headers = [c.value for c in next(ws.iter_rows(max_row=1))]
    out_path = OUT / f"{source}.jsonl.gz"
    kept = 0
    skipped = 0
    seen: set[str] = set()
    with gzip.open(out_path, "wt", encoding="utf-8") as f:
        for row in ws.iter_rows(min_row=2, values_only=True):
            if not row or not any(row):
                continue
            d = dict(zip(headers, row))
            price = parse_price(d.get("price") if d.get("price") not in (None, "") else d.get("unit_price"))
            name = truncate(d.get("name"), 160)
            sku = clean_sku(d.get("sku"))
            if not price or not name or not sku:
                skipped += 1
                continue
            if sku in seen:
                sku = (sku[:36] + "-" + str(kept % 10000))[:40]
            seen.add(sku)
            cat = truncate(d.get("category") or d.get("subcategory") or "General", 80) or "General"
            unit = clean_unit(d.get("unit"))
            try:
                min_order = max(1, int(float(d.get("min_qty") or d.get("minOrder") or 1)))
            except (TypeError, ValueError):
                min_order = 1
            rec = {
                "sku": sku,
                "name": name,
                "category": cat,
                "unit": unit,
                "price": round(price, 2),
                "stock": parse_stock(d.get("stock")),
                "minOrder": min_order,
                "leadTimeDays": parse_lead(d.get("stock")),
                "brand": truncate(d.get("brand") or source_label, 80),
                "mfg": truncate(d.get("mfg") or d.get("mpn") or "", 80),
                "description": truncate(d.get("description") or "", 500),
                "url": truncate(d.get("url") or "", 300),
                "source": source,
                "sellerKey": source,
            }
            f.write(json.dumps(rec, separators=(",", ":")) + "\n")
            kept += 1
    wb.close()
    return out_path, kept, skipped


def build_sqlite(manifest: list[dict]) -> None:
    db_path = OUT / "products.sqlite"
    if db_path.exists():
        db_path.unlink()
    con = sqlite3.connect(db_path)
    con.execute("PRAGMA journal_mode=OFF")
    con.execute("PRAGMA synchronous=OFF")
    con.execute(
        """CREATE TABLE products (
      id INTEGER PRIMARY KEY,
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      unit TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      min_order INTEGER NOT NULL,
      lead_time_days INTEGER NOT NULL,
      brand TEXT,
      mfg TEXT,
      description TEXT,
      url TEXT,
      source TEXT NOT NULL,
      seller_key TEXT NOT NULL,
      seller_name TEXT NOT NULL,
      seller_role TEXT NOT NULL
    )"""
    )
    con.execute("CREATE INDEX idx_cat ON products(category)")
    con.execute("CREATE INDEX idx_seller ON products(seller_key)")
    con.execute("CREATE INDEX idx_stock ON products(stock)")
    con.execute("CREATE INDEX idx_price ON products(price)")
    con.execute("CREATE INDEX idx_sku ON products(sku)")
    con.execute(
        'CREATE VIRTUAL TABLE products_fts USING fts5(sku, name, brand, category, seller_name, content="products", content_rowid="id")'
    )

    i = 0
    for m in manifest:
        seller_name, role, _ = SELLERS[m["sellerKey"]]
        batch = []
        with gzip.open(OUT / m["file"], "rt", encoding="utf-8") as f:
            for line in f:
                r = json.loads(line)
                i += 1
                batch.append(
                    (
                        i,
                        r["sku"],
                        r["name"],
                        r["category"],
                        r["unit"],
                        r["price"],
                        r["stock"],
                        r["minOrder"],
                        r["leadTimeDays"],
                        r.get("brand") or "",
                        r.get("mfg") or "",
                        r.get("description") or "",
                        r.get("url") or "",
                        r["source"],
                        r["sellerKey"],
                        seller_name,
                        role,
                    )
                )
                if len(batch) >= 2000:
                    con.executemany("INSERT INTO products VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", batch)
                    con.executemany(
                        "INSERT INTO products_fts(rowid,sku,name,brand,category,seller_name) VALUES (?,?,?,?,?,?)",
                        [(b[0], b[1], b[2], b[9], b[3], b[15]) for b in batch],
                    )
                    batch.clear()
        if batch:
            con.executemany("INSERT INTO products VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", batch)
            con.executemany(
                "INSERT INTO products_fts(rowid,sku,name,brand,category,seller_name) VALUES (?,?,?,?,?,?)",
                [(b[0], b[1], b[2], b[9], b[3], b[15]) for b in batch],
            )
    con.commit()
    con.close()
    print(f"sqlite rows {i} size {db_path.stat().st_size}", file=sys.stderr)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("files", nargs="*", type=pathlib.Path, help="xlsx files to import")
    ap.add_argument("--from-dir", type=pathlib.Path, help="directory containing *uline*, *gi*, *myfbm* xlsx")
    args = ap.parse_args()
    files = list(args.files)
    if args.from_dir:
        files.extend(sorted(args.from_dir.glob("*.xlsx")))
    if not files:
        ap.error("pass xlsx paths or --from-dir")

    OUT.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    manifest = []
    for path in files:
        source = detect_source(path)
        out_path, kept, skipped = convert_sheet(path, source)
        seller_name, role, source_label = SELLERS[source]
        manifest.append(
            {
                "source": source,
                "sourceLabel": source_label,
                "sellerKey": source,
                "sellerName": seller_name,
                "sellerRole": role,
                "file": out_path.name,
                "count": kept,
                "skipped": skipped,
                "bytes": out_path.stat().st_size,
                "sample": True,
            }
        )
        print(f"{source}: kept {kept} skipped {skipped}", file=sys.stderr)

    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    sellers = {
        "sample": True,
        "note": "Demo catalogs for marketplace browse. Not live seller storefronts and not an affiliation with the source retailers.",
        "sellers": [
            {
                "key": m["sellerKey"],
                "name": m["sellerName"],
                "role": m["sellerRole"],
                "sourceLabel": m["sourceLabel"],
                "count": m["count"],
            }
            for m in manifest
        ],
    }
    (OUT / "sellers.json").write_text(json.dumps(sellers, indent=2) + "\n")
    build_sqlite(manifest)
    print(f"done in {time.time() - t0:.1f}s → {OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
