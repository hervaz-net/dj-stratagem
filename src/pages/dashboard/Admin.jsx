import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Seo from "../../components/Seo";
import useAuth from "../../auth/useAuth";
import { fetchAdminUsers, setUserStatus } from "../../api/admin";

const FILTERS = [
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "all", label: "All" },
];

/** Maps account status onto the dashboard's shared indicator vocabulary. */
const DOT = { pending: "watch", active: "active", suspended: "at-risk" };

function formatDate(value) {
  if (!value) return "—";
  // The API returns UTC without a zone marker; make that explicit so the
  // browser doesn't read it as local time.
  const d = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminUsers() {
  const { user, csrf } = useAuth();
  const [filter, setFilter] = useState("pending");
  const [data, setData] = useState({ users: [], counts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      try {
        const res = await fetchAdminUsers({ status: filter, signal });
        setData({ users: res.users, counts: res.counts });
        setError("");
      } catch (err) {
        if (err?.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function change(target, status) {
    setBusyId(target.id);
    setError("");
    setNotice("");
    try {
      await setUserStatus({ id: target.id, status, csrf });
      setNotice(
        status === "active"
          ? `${target.name} approved — they can sign in now.`
          : `${target.name} set to ${status}.`,
      );
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const counts = data.counts ?? {};

  return (
    <>
      <Seo title="Accounts" description="Approve and manage platform accounts." noindex />

      <DashboardLayout
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Admin", to: "/dashboard/admin" },
          { label: "Accounts" },
        ]}
        title="Accounts"
        subtitle="Approve new access requests and manage existing accounts."
      >
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count = f.key === "all" ? undefined : counts[f.key];
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`lift inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                  active
                    ? "border-amber/60 bg-amber/12 text-amber"
                    : "border-line bg-ink/50 text-steel hover:border-amber/35 hover:text-paper"
                }`}
              >
                {f.label}
                {count !== undefined && (
                  <span className="rounded-full bg-ink px-1.5 py-0.5 tabular-nums">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="mt-4 empty:mt-0">
          {error && (
            <GlassCard className="mb-4 px-5 py-3">
              <p className="text-sm text-danger">{error}</p>
            </GlassCard>
          )}
          {notice && (
            <GlassCard className="mb-4 px-5 py-3">
              <p className="text-sm text-success">{notice}</p>
            </GlassCard>
          )}
        </div>

        <GlassCard className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-sm">
              <caption className="sr-only">Accounts with status and available actions</caption>
              <thead>
                <tr className="border-b border-line">
                  {["Person", "Status", "Requested", "Last sign-in", "Actions"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-steel ${
                        h === "Actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => {
                  const isSelf = u.id === user?.id;
                  const busy = busyId === u.id;
                  return (
                    <tr key={u.id} className="border-b border-line/60 last:border-0">
                      <th scope="row" className="px-4 py-3.5 text-left font-normal">
                        <div className="flex items-center gap-3">
                          <StatusDot status={DOT[u.status]} pulse={u.status === "pending"} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-paper">
                              {u.name}
                              {isSelf && <span className="ml-2 text-xs text-steel">(you)</span>}
                            </p>
                            <p className="truncate text-xs text-steel">
                              {u.email} &middot; {u.company}
                            </p>
                          </div>
                        </div>
                      </th>
                      <td className="px-4 py-3.5 capitalize text-paper">{u.status}</td>
                      <td className="px-4 py-3.5 text-steel">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3.5 text-steel">{formatDate(u.lastLoginAt)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-2">
                          {u.status !== "active" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => change(u, "active")}
                              className="lift rounded-full bg-gradient-to-br from-brand to-amber-2 px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                            >
                              {busy ? "Working…" : u.status === "pending" ? "Approve" : "Reinstate"}
                            </button>
                          )}
                          {u.status !== "suspended" && !isSelf && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => change(u, "suspended")}
                              className="lift rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-steel hover:border-danger/50 hover:text-danger disabled:opacity-60"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!data.users.length && (
            <div className="px-6 py-14 text-center">
              <p className="text-sm font-medium text-paper">
                {loading
                  ? "Loading accounts…"
                  : filter === "pending"
                    ? "Nothing waiting for approval."
                    : "No accounts with this status."}
              </p>
            </div>
          )}
        </GlassCard>
      </DashboardLayout>
    </>
  );
}
