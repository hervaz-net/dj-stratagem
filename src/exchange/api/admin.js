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
