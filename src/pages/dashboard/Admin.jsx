import { Fragment, useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, FilterChips, StatTile, StatusPill, inputCls } from "../../components/dashboard/ui";
import { PRODUCT } from "../../brand";
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
  "bg-brand-soft text-brand-fg",
  "bg-role-distributor-soft text-role-distributor",
  "bg-role-contractor-soft text-role-contractor",
  "bg-accent-soft text-accent",
];

const STATUS_TONE = { pending: "warning", active: "success", suspended: "danger" };

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function UserAvatar({ name, id, status }) {
  const color = AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];
  return (
    <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}>
      {getInitials(name)}
      <span className="absolute -bottom-0.5 -right-0.5">
        <StatusDot status={DOT[status]} size={8} pulse={false} />
      </span>
    </span>
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
  return <StatTile label={label} value={value ?? "—"} valueClassName={highlight ? "text-brand" : ""} />;
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

  if (user && user.role !== "admin") {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return (
    <>
      <Seo title="Accounts" description={`Approve and manage ${PRODUCT} accounts.`} noindex />

      <DashboardLayout
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard/overview" },
          { label: "Accounts" },
        ]}
        title="Accounts"
        subtitle="Approve new companies joining the marketplace and manage existing accounts."
      >
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <StatCard label="Total" value={counts.all ?? (counts.pending ?? 0) + (counts.active ?? 0) + (counts.suspended ?? 0)} />
          <StatCard label="Pending" value={counts.pending} highlight={counts.pending > 0} />
          <StatCard label="Active" value={counts.active} />
          <StatCard label="Suspended" value={counts.suspended} />
        </div>

        <FilterChips
          label="Account status"
          value={filter}
          onChange={(key) => {
            setFilter(key);
            setSearch("");
          }}
          options={FILTERS.map((f) => ({ ...f, count: f.key === "all" ? undefined : counts[f.key] }))}
        />

        <div className="relative mt-4 max-w-sm">
          <label htmlFor="account-search" className="sr-only">Filter accounts</label>
          <IconSearch
            width={16}
            height={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted"
          />
          <input
            id="account-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, email, or company"
            className={`${inputCls} pl-10`}
          />
        </div>

        <div aria-live="polite" className="mt-4 empty:mt-0">
          {error && (
            <p className="mb-4 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">{error}</p>
          )}
          {notice && (
            <p className="mb-4 rounded-2xl border border-success/30 bg-success-soft px-4 py-3 text-sm text-success">{notice}</p>
          )}
        </div>

        {approvable.length > 0 && (
          <Card className="mt-4 flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <p className="text-sm text-fg-muted">
              <span className="font-semibold text-fg">{approvable.length}</span>{" "}
              pending {approvable.length === 1 ? "account" : "accounts"} selected
            </p>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={bulkApprove}
              className="inline-flex h-9 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
            >
              {bulkBusy ? "Approving…" : `Approve ${approvable.length}`}
            </button>
          </Card>
        )}

        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-sm">
              <caption className="sr-only">Accounts with status and available actions</caption>
              <thead>
                <tr className="border-b border-line bg-subtle">
                  <th scope="col" className="w-10 px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={allPendingChecked}
                      onChange={toggleAllPending}
                      aria-label="Select all pending"
                      className="h-4 w-4 accent-[var(--brand)]"
                    />
                  </th>
                  {["Person", "Status", "Requested", "Last sign-in", "Actions"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className={`px-4 py-3 text-xs font-semibold text-fg ${
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
                        className={`border-b border-line transition-colors last:border-0 hover:bg-subtle ${expanded ? "bg-subtle" : ""}`}
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
                            className="h-4 w-4 accent-[var(--brand)]"
                          />
                        </td>
                        <th scope="row" className="px-4 py-3.5 text-left font-normal">
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : u.id)}
                            aria-expanded={expanded}
                            className="flex w-full items-center gap-3 rounded-xl text-left"
                          >
                            <UserAvatar name={u.name} id={u.id} status={u.status} />
                            <span className="min-w-0">
                              <span className="block truncate font-semibold text-fg">
                                {u.name}
                                {isSelf && <span className="ml-2 text-xs font-normal text-fg-muted">(you)</span>}
                              </span>
                              <span className="block truncate text-xs text-fg-muted">
                                {u.email} &middot; {u.company}
                              </span>
                            </span>
                          </button>
                        </th>
                        <td className="px-4 py-3.5"><StatusPill tone={STATUS_TONE[u.status] ?? "neutral"} className="capitalize">{u.status}</StatusPill></td>
                        <td className="px-4 py-3.5 text-fg-muted">{formatDate(u.createdAt)}</td>
                        <td className="px-4 py-3.5 text-fg-muted">{formatDate(u.lastLoginAt)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex justify-end gap-2">
                            {u.status !== "active" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => change(u, "active")}
                                className="inline-flex h-8 items-center rounded-full bg-brand px-3.5 text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
                              >
                                {busy ? "Working…" : u.status === "pending" ? "Approve" : "Reinstate"}
                              </button>
                            )}
                            {u.status !== "suspended" && !isSelf && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => change(u, "suspended")}
                                className="inline-flex h-8 items-center rounded-full border border-line px-3.5 text-xs font-semibold text-fg-muted hover:border-danger hover:text-danger disabled:opacity-60"
                              >
                                Suspend
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {expanded && (
                        <tr className="border-b border-line bg-canvas">
                          <td colSpan={6} className="px-8 py-4">
                            <dl className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:grid-cols-4">
                              {[
                                { label: "Phone", value: u.phone || "—" },
                                { label: "Access", value: u.role || "—" },
                                { label: "Approved", value: formatDate(u.approvedAt) },
                                { label: "User ID", value: `#${u.id}` },
                              ].map(({ label, value }) => (
                                <div key={label}>
                                  <dt className="font-semibold text-fg-muted">{label}</dt>
                                  <dd className="mt-0.5 text-fg">{value}</dd>
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
              <p className="text-sm font-medium text-fg">
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
        </Card>
      </DashboardLayout>
    </>
  );
}
