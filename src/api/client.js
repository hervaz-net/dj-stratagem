/**
 * Same-origin dashboard + auth API (`/api/*.php`).
 *
 * On Namecheap the PHP files are real. `npm run dev` has no PHP runtime, so
 * fetchers fall back to fixtures when a request fails with a transport /
 * HTML / 404 error. 401 still surfaces so a signed-out session isn't papered
 * over with sample data.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

/** True after the last successful live response. Live-binding — pages re-read it. */
export let isConfigured = false;

export function markConfigured(value) {
  isConfigured = value;
}

export class ApiError extends Error {
  constructor(message, { status, url, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.code = code;
  }
}

function resolveUrl(path, params) {
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const base = API_BASE.startsWith("http")
    ? (API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`)
    : `${origin}${API_BASE.startsWith("/") ? API_BASE : `/${API_BASE}`}${API_BASE.endsWith("/") ? "" : "/"}`;
  const url = new URL(String(path).replace(/^\//, ""), base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url;
}

async function parseBody(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError("API returned a non-JSON response", { status: res.status, url: res.url });
  }
}

export async function apiGet(path, { signal, timeout = 15000, params } = {}) {
  const url = resolveUrl(path, params);
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    const data = await parseBody(res);
    if (!res.ok || data?.ok === false) {
      throw new ApiError(data?.message ?? `Request failed (${res.status})`, {
        status: res.status,
        url: url.href,
        code: data?.error,
      });
    }
    markConfigured(true);
    return data;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

export async function apiPost(path, body, { csrf, signal, timeout = 15000 } = {}) {
  const url = resolveUrl(path);
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      },
      body: JSON.stringify(body ?? {}),
    });
    const data = await parseBody(res);
    if (!res.ok || data?.ok === false) {
      throw new ApiError(data?.message ?? `Request failed (${res.status})`, {
        status: res.status,
        url: url.href,
        code: data?.error,
      });
    }
    markConfigured(true);
    return data;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

/** Use live PHP when it's up; otherwise the local fixture. Never swallow 401. */
export async function liveOrFixture(loader, fallback) {
  try {
    return await loader();
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    if (err?.status === 401) throw err;
    markConfigured(false);
    return typeof fallback === "function" ? fallback() : fallback;
  }
}

/** @deprecated use apiGet */
export const getJson = apiGet;
