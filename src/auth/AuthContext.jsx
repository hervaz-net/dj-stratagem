import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import AuthError from "./AuthError";

const AuthContext = createContext(null);

const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL ?? "/api";

async function call(path, { method = "POST", body, csrf, signal } = {}) {
  let res;
  try {
    res = await fetch(`${AUTH_BASE}/${path}`, {
      method,
      signal,
      credentials: "include", // session cookie
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

  // A misconfigured host can return an HTML error page; don't let JSON.parse
  // throw an opaque SyntaxError at the UI.
  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    throw new AuthError(
      data?.message ?? "Something went wrong. Please try again.",
      { code: data?.error ?? "server_error", fields: data?.fields, status: res.status },
    );
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [csrf, setCsrf] = useState(null);
  // `loading` gates route guards — without it every refresh would bounce a
  // signed-in user to /login before the session check comes back.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await call("me.php", { method: "GET", signal: controller.signal });
        setUser(data.user);
        setCsrf(data.csrf);
      } catch (err) {
        if (err?.name !== "AbortError") setUser(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await call("login.php", { body: { email, password }, csrf });
      setUser(data.user);
      if (data.csrf) setCsrf(data.csrf);
      return data.user;
    },
    [csrf],
  );

  const register = useCallback(
    async (payload) => call("register.php", { body: payload, csrf }),
    [csrf],
  );

  const logout = useCallback(async () => {
    try {
      await call("logout.php", { csrf });
    } finally {
      // Clear locally even if the request failed — the user asked to be out.
      setUser(null);
      // The old token died with the session. Without a fresh one, the next
      // login or register from this same page instance would post a stale
      // token and be rejected with 403.
      setCsrf(null);
      try {
        const fresh = await call("me.php", { method: "GET" });
        setCsrf(fresh.csrf);
      } catch {
        // Offline or server down — the next page load re-mints one.
      }
    }
  }, [csrf]);

  const value = useMemo(
    // `csrf` is exposed so admin endpoints can post with the same token this
    // provider already owns, rather than minting a second one.
    () => ({ user, loading, csrf, login, register, logout, authBase: AUTH_BASE }),
    [user, loading, csrf, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
