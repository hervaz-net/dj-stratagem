import AuthError from "../auth/AuthError";

const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL ?? "/api";

/**
 * Jobs + subagent queue. Same-origin PHP with the session cookie, like the
 * admin endpoints. No fixture fallback on purpose: jobs are real records and
 * an approval screen must never show sample data as if it were live.
 */
async function call(path, { method = "GET", body, csrf, signal } = {}) {
  let res;
  try {
    res = await fetch(`${AUTH_BASE}/${path}`, {
      method,
      signal,
      credentials: "include",
      headers: {
        Accept: "application/json",
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

export const SUBAGENTS = [
  { key: "projects", name: "Projects", stage: "find" },
  { key: "exchange", name: "Exchange", stage: "find" },
  { key: "platform", name: "Platform", stage: "win" },
  { key: "solutions", name: "Solutions", stage: "win" },
  { key: "supply", name: "Supply", stage: "build" },
  { key: "capital", name: "Capital", stage: "build" },
  { key: "workforce", name: "Workforce", stage: "build" },
  { key: "fleet", name: "Fleet", stage: "build" },
  { key: "studio", name: "Studio", stage: "keep" },
];

export const JOB_STATUS_LABEL = {
  pending_approval: "Awaiting approval",
  approved: "Approved",
  rejected: "Rejected",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const TASK_STATUS_LABEL = {
  queued: "Queued",
  running: "Running",
  done: "Done",
  blocked: "Blocked",
  skipped: "Skipped",
};

export function fetchJobs({ scope, status, signal } = {}) {
  const params = new URLSearchParams();
  if (scope) params.set("scope", scope);
  if (status && status !== "all") params.set("status", status);
  const q = params.toString();
  return call(`jobs.php${q ? `?${q}` : ""}`, { signal });
}

export function fetchJob(id, { signal } = {}) {
  return call(`jobs.php?id=${encodeURIComponent(id)}`, { signal });
}

export function fetchSubagents({ signal } = {}) {
  return call("subagents.php", { signal });
}

export function jobAction(action, payload, { csrf }) {
  return call("jobs.php", { method: "POST", body: { action, ...payload }, csrf });
}
