/**
 * Thin fetch wrapper for the dashboard API.
 *
 * The base URL comes from `VITE_API_BASE_URL`. When it is unset the client
 * reports `configured === false` and callers fall back to local fixtures, so
 * the dashboard renders during development without a backend. Point the env
 * var at a real host and every screen switches to live data with no other
 * change.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
export const isConfigured = API_BASE !== "";

export class ApiError extends Error {
  constructor(message, { status, url } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
  }
}

/**
 * GET a JSON resource.
 *
 * @param {string} path      Path appended to API_BASE, e.g. "/suppliers".
 * @param {object} options
 * @param {AbortSignal} [options.signal]
 * @param {number} [options.timeout=15000] Milliseconds before the request aborts.
 * @param {Record<string, string|number>} [options.params] Query string values.
 */
export async function getJson(path, { signal, timeout = 15000, params } = {}) {
  if (!isConfigured) {
    throw new ApiError("API base URL is not configured", { url: path });
  }

  const url = new URL(path.replace(/^\//, ""), API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }

  // Caller-supplied aborts and the timeout both need to cancel the request.
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      // Cookie-based sessions are the likely auth model once /login is real.
      credentials: "include",
    });

    if (!res.ok) {
      throw new ApiError(`Request failed (${res.status})`, { status: res.status, url: url.href });
    }

    return await res.json();
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}
