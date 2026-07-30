import { Fragment, useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Seo from "../../components/Seo";
import useAuth from "../../auth/useAuth";
import { fetchAdminUsers, setUserStatus } from "../../api/admin";
import { IconSearch } from "../../components/icons";

const FILTERS = [
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "all", label: "All" },
];

const DOT = { pending: "watch", active: "active", suspended: "at-risk" };

const AVATAR_COLORS = [
  "bg-[var(--viz-blue)]/20 text-[var(--viz-blue)]",
  "bg-[var(--viz-cyan)]/20 text-[var(--viz-cyan)]",
  "bg-[var(--viz-green)]/20 text-[var(--viz-green)]",
  "bg-[var(--color-brand)]/15 text-[var(--color-brand)]",
  "bg-[var(--viz-gold)]/20 text-[var(--viz-gold)]",
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UserAvatar({ name, id, status }) {
  const color = AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];
  return (
    <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}>
      {getInitials(name)}
      <span className="absolute -bottom-0.5 -right-0.5">
        <StatusDot status={DOT[status]} size={8} pulse={status === "pending"} />
      </span>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function StatCard({ label, value, highlight }) {
  return (
    <GlassCard className="px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-steel">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${highlight ? "text-amber" : "text-paper"}`}>
        {value ?? "—"}
      </p>
    </GlassCard>
  );
}

export default function AdminUsers() {
  const { user, csrf } = useAuth();
  const [filter, setFilter] = useState("pending");
  const [data, setData] = useState({ users: [], counts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [bulkSelected, setBulkSelected] = useState(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      try {
        const res = await fetchAdminUsers({ status: filter, signal });
        setData({ users: res.users, counts: res.counts });
        setError("");
        setBulkSelected(new Set());
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

  async function bulkApprove() {
    setBulkBusy(true);
    setError("");
    setNotice("");
    try {
      for (const id of bulkSelected) {
        const target = data.users.find((u) => u.id === id);
        if (target) await setUserStatus({ id, status: "active", csrf });
      }
      setNotice(`${bulkSelected.size} account${bulkSelected.size !== 1 ? "s" : ""} approved.`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBulkBusy(false);
    }
  }

  const counts = data.counts ?? {};

  const displayed = data.users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return [u.name, u.email, u.company].some((f) => f?.toLowerCase().includes(q));
  });

  const approvable = displayed.filter((u) => u.status === "pending" && bulkSelected.has(u.id));

  const allPendingChecked =
    displayed.filter((u) => u.status === "pending").length > 0 &&
    displayed.filter((u) => u.status === "pending").every((u) => bulkSelected.has(u.id));

  function toggleBulk(id) {
    setBulkSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAllPending() {
    const pending = displayed.filter((u) => u.status === "pending").map((u) => u.id);
    if (allPendingChecked) {
      setBulkSelected((prev) => {
        const next = new Set(prev);
        pending.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setBulkSelected((prev) => new Set([...prev, ...pending]));
    }
  }

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
        {/* Stats cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total" value={counts.all ?? (counts.pending ?? 0) + (counts.active ?? 0) + (counts.suspended ?? 0)} />
          <StatCard label="Pending" value={counts.pending} highlight={counts.pending > 0} />
          <StatCard label="Active" value={counts.active} />
          <StatCard label="Suspended" value={counts.suspended} />
        </div>

        {/* Filter toggles */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count = f.key === "all" ? undefined : counts[f.key];
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => { setFilter(f.key); setSearch(""); }}
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

        {/* Search */}
        <div className="relative mt-4 max-w-sm">
          <IconSearch
            width={14}
            height={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, email, or company"
            className="w-full rounded-lg border border-line bg-ink py-2 pl-8 pr-3.5 text-sm text-paper outline-hidden placeholder:text-steel/70 focus:border-amber"
          />
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

        {/* Bulk action bar */}
        {approvable.length > 0 && (
          <GlassCard className="mt-4 flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <p className="text-sm text-steel">
              <span className="font-semibold text-paper">{approvable.length}</span>{" "}
              pending {approvable.length === 1 ? "account" : "accounts"} selected
            </p>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={bulkApprove}
              className="lift rounded-full bg-gradient-to-br from-brand to-amber-2 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {bulkBusy ? "Approving…" : `Approve ${approvable.length}`}
            </button>
          </GlassCard>
        )}

        <GlassCard className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-sm">
              <caption className="sr-only">Accounts with status and available actions</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-10 px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={allPendingChecked}
                      onChange={toggleAllPending}
                      aria-label="Select all pending"
                      className="accent-amber"
                    />
                  </th>
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
                {displayed.map((u) => {
                  const isSelf = u.id === user?.id;
                  const busy = busyId === u.id;
                  const expanded = expandedId === u.id;
                  return (
                    <Fragment key={u.id}>
                      <tr
                        className={`border-b border-line/60 transition-colors last:border-0 hover:bg-ink-3/60 ${expanded ? "bg-ink-3/40" : ""}`}
                      >
                        <td
                          className="w-10 px-4 py-3.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={bulkSelected.has(u.id)}
                            onChange={() => toggleBulk(u.id)}
                            aria-label={`Select ${u.name}`}
                            className="accent-amber"
                          />
                        </td>
                        <th
                          scope="row"
                          className="cursor-pointer px-4 py-3.5 text-left font-normal"
                          onClick={() => setExpandedId(expanded ? null : u.id)}
                        >
                          <div className="flex items-center gap-3">
                            <UserAvatar name={u.name} id={u.id} status={u.status} />
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

                      {expanded && (
                        <tr className="border-b border-line/40 bg-ink/60">
                          <td colSpan={6} className="px-8 py-4">
                            <dl className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:grid-cols-4">
                              {[
                                { label: "Phone", value: u.phone || "—" },
                                { label: "Role", value: u.role || "—" },
                                { label: "Approved", value: formatDate(u.approvedAt) },
                                { label: "User ID", value: `#${u.id}` },
                              ].map(({ label, value }) => (
                                <div key={label}>
                                  <dt className="font-semibold uppercase tracking-wider text-steel">{label}</dt>
                                  <dd className="mt-0.5 text-paper">{value}</dd>
                                </div>
                              ))}
                            </dl>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!displayed.length && (
            <div className="px-6 py-14 text-center">
              <p className="text-sm font-medium text-paper">
                {loading
                  ? "Loading accounts…"
                  : search
                    ? "No accounts match that search."
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
