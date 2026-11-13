/**
 * Public marketplace catalog (`/api/products.php`).
 * Demo catalogs are always sample-labelled; see PROOF.md.
 */

export async function fetchProducts({
  q = "",
  category = "",
  seller = "",
  inStock = false,
  sort = "relevance",
  page = 1,
  limit = 24,
  signal,
} = {}) {
  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (category) params.set("category", category);
  if (seller && seller !== "all") params.set("seller", seller);
  if (inStock) params.set("inStock", "1");
  if (sort) params.set("sort", sort);
  params.set("page", String(page));
  params.set("limit", String(limit));

  const res = await fetch(`/api/products.php?${params}`, {
    method: "GET",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.ok) {
    const err = new Error(data?.message || data?.error || "Could not load products.");
    err.status = res.status;
    err.code = data?.error;
    throw err;
  }
  return data;
}
