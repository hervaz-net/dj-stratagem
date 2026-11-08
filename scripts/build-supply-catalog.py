#!/usr/bin/env python3
"""
Turns supplier product spreadsheets into public/api/data/supply-products.tsv.gz,
the file supply-catalog.php imports into MySQL on its next request.

    python3 scripts/build-supply-catalog.py \
        --uline uline_products.xlsx --gi gi_building_supplies.xlsx --fbm myfbm_products.xlsx

Any spreadsheet left out keeps nothing: the output holds only what you pass.
Needs openpyxl (pip install openpyxl).
"""
import argparse, csv, datetime, gzip, io, os, re, sys

import openpyxl

COLS = ["supplier", "sku", "name", "brand", "mpn", "category", "subcategory",
        "unit", "min_qty", "price", "availability", "url"]
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "api", "data", "supply-products.tsv.gz")


def rows(path):
    ws = openpyxl.load_workbook(path, read_only=True).active
    it = ws.iter_rows(values_only=True)
    head = [str(h).strip() if h is not None else "" for h in next(it)]
    for r in it:
        yield dict(zip(head, r))


def s(v, n):
    v = "" if v is None else re.sub(r"\s+", " ", str(v)).strip()
    return v[:n]


def money(v):
    try:
        p = round(float(v), 2)
    except (TypeError, ValueError):
        return None
    return p if p > 0 else None


def uline(path):
    for r in rows(path):
        yield {"supplier": "uline", "sku": r.get("sku"), "name": r.get("name"), "brand": "Uline",
               "mpn": r.get("mpn"), "category": r.get("category"), "subcategory": "",
               "unit": "Each", "min_qty": r.get("min_qty") or 1, "price": r.get("price"),
               "availability": "In stock" if r.get("stock") == "InStock" else "",
               "url": r.get("url")}


def gi(path):
    for r in rows(path):
        stock = str(r.get("stock") or "").split("|")
        if stock[0] == "OutOfStock":
            avail = "Out of stock"
        else:
            avail = stock[1] if len(stock) > 1 and stock[1] else ("In stock" if stock[0] == "InStock" else "")
        pack = r.get("unit")
        unit = f"Pack of {pack}" if isinstance(pack, (int, float)) and pack > 1 else "Each"
        yield {"supplier": "gi", "sku": r.get("sku"), "name": r.get("name"), "brand": r.get("brand"),
               "mpn": r.get("mfg"), "category": r.get("category"), "subcategory": r.get("subcategory"),
               "unit": unit, "min_qty": 1, "price": r.get("price"), "availability": avail, "url": r.get("url")}


def fbm(path):
    for r in rows(path):
        yield {"supplier": "fbm", "sku": r.get("sku"), "name": r.get("name"), "brand": r.get("brand"),
               "mpn": r.get("mfg"), "category": r.get("category"), "subcategory": r.get("subcategory"),
               "unit": r.get("unit"), "min_qty": 1, "price": r.get("price"),
               "availability": r.get("stock"), "url": r.get("url")}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--uline"); ap.add_argument("--gi"); ap.add_argument("--fbm")
    ap.add_argument("--as-of", default=datetime.date.today().isoformat(),
                    help="date the prices were captured (YYYY-MM-DD), shown on the site")
    a = ap.parse_args()
    sources = [(f, p) for f, p in ((uline, a.uline), (gi, a.gi), (fbm, a.fbm)) if p]
    if not sources:
        ap.error("pass at least one spreadsheet")

    seen, kept, skipped = set(), [], 0
    for fn, path in sources:
        for r in fn(path):
            price = money(r["price"])
            sku, name, url = s(r["sku"], 40), s(r["name"], 255), s(r["url"], 500)
            if not price or not sku or not name or not url.startswith("https://") or (r["supplier"], sku) in seen:
                skipped += 1
                continue
            seen.add((r["supplier"], sku))
            try:
                min_qty = max(1, int(r["min_qty"]))
            except (TypeError, ValueError):
                min_qty = 1
            kept.append([r["supplier"], sku, name, s(r["brand"], 80), s(r["mpn"], 60),
                         s(r["category"], 120), s(r["subcategory"], 120), s(r["unit"], 24) or "Each",
                         str(min_qty), f"{price:.2f}", s(r["availability"], 60), url])

    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", a.as_of):
        ap.error("--as-of must be YYYY-MM-DD")
    buf = io.StringIO()
    buf.write(f"# as_of {a.as_of}\n")
    w = csv.writer(buf, delimiter="\t", quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
    w.writerow(COLS)
    w.writerows(kept)
    # mtime=0 keeps the file byte-identical across rebuilds of the same data.
    with open(OUT, "wb") as f, gzip.GzipFile(fileobj=f, mode="wb", mtime=0) as gz:
        gz.write(buf.getvalue().encode("utf-8"))
    print(f"wrote {len(kept)} products ({skipped} skipped) to {os.path.normpath(OUT)}", file=sys.stderr)


if __name__ == "__main__":
    main()
