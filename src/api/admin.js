import AuthError from "../auth/AuthError";

const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL ?? "/api";

/**
 * Admin endpoints. These share the auth session cookie rather than the
 * dashboard's configurable data API, so they always live under AUTH_BASE.
 */
async function call(path, { method = "GET", body, csrf, signal } = {}) {
  let res;
  try {
    res = await fetch(`${AUTH_BASE}/${path}`, {
      method,
      signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new AuthError("Couldn't reach the server. Check your connection and try again.", {
      code: "network_error",
    });
  }

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    throw new AuthError(data?.message ?? "Something went wrong. Please try again.", {
      code: data?.error ?? "server_error",
      fields: data?.fields,
      status: res.status,
    });
  }

  return data;
}

export function fetchAdminUsers({ status = "all", signal } = {}) {
  const query = status === "all" ? "" : `?status=${encodeURIComponent(status)}`;
  return call(`admin-users.php${query}`, { signal });
}

export function setUserStatus({ id, status, csrf }) {
  return call("admin-user-status.php", { method: "POST", body: { id, status }, csrf });
}

/* ---- Admin control panel (/admin) ---- */

export function fetchAdminOverview({ signal } = {}) {
  return call("admin-overview.php", { signal });
}

export function fetchMembers({ q = "", status = "all", role = "all", signal } = {}) {
  const p = new URLSearchParams();
  if (q.trim()) p.set("q", q.trim());
  if (status !== "all") p.set("status", status);
  if (role !== "all") p.set("role", role);
  const s = p.toString();
  return call(`admin-members.php${s ? `?${s}` : ""}`, { signal });
}

export function fetchMember(id, { signal } = {}) {
  return call(`admin-members.php?id=${encodeURIComponent(id)}`, { signal });
}

export function memberAction(action, payload, { csrf }) {
  return call("admin-members.php", { method: "POST", body: { action, ...payload }, csrf });
}

export function fetchAllListings({ q = "", owner = "", status = "all", signal } = {}) {
  const p = new URLSearchParams();
  if (q.trim()) p.set("q", q.trim());
  if (owner) p.set("owner", owner);
  if (status !== "all") p.set("status", status);
  const s = p.toString();
  return call(`admin-catalog.php${s ? `?${s}` : ""}`, { signal });
}

export function saveListing(listing, { csrf }) {
  return call("admin-catalog.php", { method: "POST", body: { action: "save", ...listing }, csrf });
}

export function deleteListing(id, { csrf }) {
  return call("admin-catalog.php", { method: "POST", body: { action: "delete", id }, csrf });
}
