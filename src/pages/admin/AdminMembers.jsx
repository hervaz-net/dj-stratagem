import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout, { Panel, Pill, Tabs } from "./AdminLayout";
import { MEMBER_LABEL, MEMBER_TONE, btn, input } from "./adminStyles";
import useAdminData, { useDebounced } from "./useAdminData";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { fetchMembers, memberAction } from "../../api/admin";
import { formatWhen } from "../../components/dashboard/jobFormat";

/** The status and role buttons for one member. Shared with the detail page. */
export function MemberActions({ member, onChanged, size = "row" }) {
  const { user, csrf } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState(null);
  const self = member.id === user?.id;

  const run = async (action, payload, done) => {
    setBusy(`${action}-${Object.values(payload)[0]}`);
    try {
      const res = await memberAction(action, { id: member.id, ...payload }, { csrf });
      toast(done, { type: "success" });
      onChanged?.(res.member);
    } catch (err) {
      toast(err.message ?? "That didn't work.", { type: "error" });
    } finally {
      setBusy(null);
    }
  };

  const name = member.name || member.email;
  const status = (s, label, done, cls = btn.ghost) => (
    <button type="button" disabled={!!busy} className={cls} onClick={() => run("status", { status: s }, done)}>
      {busy === `status-${s}` ? "Saving…" : label}
    </button>
  );

  return (
    <div className={`flex flex-wrap gap-2 ${size === "row" ? "justify-end" : ""}`}>
      {member.status === "pending" && status("active", "Approve", `${name} can sign in now.`, btn.dark)}
      {member.status === "pending" && !self && status("suspended", "Decline", `${name} was declined.`, btn.danger)}
      {member.status === "active" && !self && status("suspended", "Suspend", `${name} is suspended.`, btn.danger)}
      {member.status === "suspended" && status("active", "Reinstate", `${name} is active again.`)}
      {member.status === "active" && member.role === "member" && (
        <button type="button" disabled={!!busy} className={btn.ghost} onClick={() => run("role", { role: "admin" }, `${name} is now an admin.`)}>
          {busy === "role-admin" ? "Saving…" : "Make admin"}
        </button>
      )}
      {member.role === "admin" && !self && (
        <button type="button" disabled={!!busy} className={btn.ghost} onClick={() => run("role", { role: "member" }, `${name} is no longer an admin.`)}>
          {busy === "role-member" ? "Saving…" : "Remove admin"}
        </button>
      )}
    </div>
  );
}

export default function AdminMembers() {
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "all";
  const role = params.get("role") ?? "all";
  const [q, setQ] = useState(params.get("q") ?? "");
  const query = useDebounced(q);

  const { data, error, loading, setData } = useAdminData(
    ({ signal }) => fetchMembers({ q: query, status, role, signal }),
    `${query}|${status}|${role}`,
  );
  const counts = data?.counts ?? {};
  const members = data?.members ?? [];

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  // Update one row in place, and drop it if it no longer matches the filter.
  const changed = (m) =>
    setData((d) => ({
      ...d,
      members: d.members
        .map((x) => (x.id === m.id ? { ...x, ...m } : x))
        .filter((x) => (status === "all" || x.status === status) && (role === "all" || x.role === role)),
    }));

  const total = (counts.pending ?? 0) + (counts.active ?? 0) + (counts.suspended ?? 0);

  return (
    <AdminLayout title="Members" subtitle="Everyone who signed up. Approve new sign-ups, suspend accounts, and choose who else is an admin.">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          label="Filter by status"
          value={status}
          onChange={(v) => setFilter("status", v)}
          options={[
            ["all", "All", total],
            ["pending", "Waiting", counts.pending],
            ["active", "Active", counts.active],
            ["suspended", "Suspended", counts.suspended],
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input type="checkbox" checked={role === "admin"} onChange={(e) => setFilter("role", e.target.checked ? "admin" : "all")} className="h-4 w-4" />
            Admins only ({counts.admins ?? 0})
          </label>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, or company"
            aria-label="Search members"
            className={`${input} w-72 max-w-full`}
          />
        </div>
      </div>

      {error && <Panel className="mt-4 px-5 py-3"><p className="text-sm text-danger">{error.message}</p></Panel>}

      <Panel className="mt-5 overflow-hidden">
        <div className="hidden grid-cols-[1.6fr_1fr_0.7fr_0.6fr_1.5fr] gap-4 border-b border-line bg-black/[0.02] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted lg:grid">
          <span>Member</span>
          <span>Signed up</span>
          <span>Status</span>
          <span>Activity</span>
          <span className="text-right">Actions</span>
        </div>
        <ul className="divide-y divide-line">
          {members.map((m) => (
            <li key={m.id} className="grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[1.6fr_1fr_0.7fr_0.6fr_1.5fr] lg:items-center lg:gap-4">
              <div className="min-w-0">
                <Link to={`/admin/members/${m.id}`} className="block truncate font-semibold text-fg hover:underline">
                  {m.name || m.email}
                  {m.role === "admin" && <span className="ml-2 align-middle"><Pill tone="brand">Admin</Pill></span>}
                </Link>
                <p className="truncate text-sm text-fg-muted">{m.email}{m.company && ` · ${m.company}`}</p>
              </div>
              <p className="text-sm text-fg-muted">
                {formatWhen(m.createdAt, { withTime: false })}
                <span className="block text-xs">Last sign-in {m.lastLoginAt ? formatWhen(m.lastLoginAt, { withTime: false }) : "never"}</span>
              </p>
              <div><Pill tone={MEMBER_TONE[m.status]}>{MEMBER_LABEL[m.status]}</Pill></div>
              <p className="text-sm text-fg-muted">{m.jobs} jobs · {m.listings} listings</p>
              <MemberActions member={m} onChanged={changed} />
            </li>
          ))}
        </ul>
        {!members.length && (
          <p className="px-5 py-14 text-center text-sm text-fg-muted">{loading ? "Loading…" : "No members match."}</p>
        )}
      </Panel>
    </AdminLayout>
  );
}
