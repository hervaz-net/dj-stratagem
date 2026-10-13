import { useCallback } from "react";
import { Link } from "react-router-dom";
import AdminLayout, { Panel, Pill } from "./AdminLayout";
import { MEMBER_LABEL, MEMBER_TONE } from "./adminStyles";
import usePolledResource from "../../api/usePolledResource";
import { fetchAdminOverview } from "../../api/admin";
import { JOB_STATUS_LABEL } from "../../api/jobs";
import { formatWhen } from "../../components/dashboard/jobFormat";

const JOB_TONE = { pending_approval: "warning", approved: "neutral", in_progress: "neutral", completed: "success", rejected: "danger", cancelled: "neutral" };

function Stat({ label, value, note, to, alert }) {
  return (
    <Link to={to} className="group rounded-2xl border border-line bg-white p-5 transition-colors hover:border-paper/30">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-steel">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${alert ? "text-warning" : "text-paper"}`}>{value ?? "—"}</p>
      <p className="mt-1 text-sm text-steel">{note}</p>
      <p className="mt-3 text-sm font-semibold text-paper opacity-70 group-hover:opacity-100">Open →</p>
    </Link>
  );
}

function Recent({ title, to, empty, rows }) {
  return (
    <Panel className="flex flex-col">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold text-paper">{title}</h2>
        <Link to={to} className="text-sm font-semibold text-steel hover:text-paper">View all</Link>
      </div>
      {rows.length ? (
        <ul className="divide-y divide-line">{rows}</ul>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-steel">{empty}</p>
      )}
    </Panel>
  );
}

const fmt = (n) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n ?? 0);

/** Whether Stratagem AI can run, and how much it has used. */
function AiEngine({ ai }) {
  return (
    <Panel className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4" data-testid="ai-engine">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${ai.configured ? "bg-success" : "bg-danger"}`} aria-hidden="true" />
        <p className="text-sm font-semibold text-paper">
          AI engine {ai.configured ? `on · ${ai.model}` : "not set up"}
        </p>
      </div>
      {ai.configured ? (
        <p className="text-sm text-steel">
          {fmt(ai.runs)} subagent runs · {fmt(ai.tokensIn)} tokens in · {fmt(ai.tokensOut)} out
          {ai.waiting > 0 && ` · ${ai.waiting} waiting`}
          {ai.blocked > 0 && <span className="text-danger"> · {ai.blocked} blocked</span>}
        </p>
      ) : (
        <p className="text-sm text-danger">
          Approved jobs can't run. Add an Anthropic API key under <code>ai.api_key</code> in the server config (~/djs-config.php).
        </p>
      )}
    </Panel>
  );
}

export default function AdminOverview() {
  const fetcher = useCallback(({ signal }) => fetchAdminOverview({ signal }), []);
  const { data, error, loading } = usePolledResource(fetcher, { intervalMs: 30000, initialData: null });
  const m = data?.members ?? {};
  const j = data?.jobs ?? {};
  const c = data?.catalog ?? {};
  const r = data?.recent ?? { members: [], jobs: [], listings: [] };

  return (
    <AdminLayout title="Overview" subtitle="Who signed up, what's waiting on you, and what sellers are listing.">
      {error && <Panel className="mb-6 px-5 py-3"><p className="text-sm text-danger">{error.message}</p></Panel>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Members waiting" value={m.pending} alert={m.pending > 0} note="Sign-ups to approve" to="/admin/members?status=pending" />
        <Stat label="Jobs waiting" value={j.pending_approval} alert={j.pending_approval > 0} note="Postings to approve" to="/admin/jobs" />
        <Stat label="Members" value={m.total} note={`${m.active ?? 0} active · ${m.newThisWeek ?? 0} new this week`} to="/admin/members" />
        <Stat label="Catalog listings" value={c.total} note={`${c.sellers ?? 0} sellers · ${c.draft ?? 0} drafts`} to="/admin/catalog" />
      </div>

      {data?.ai && <AiEngine ai={data.ai} />}

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Recent
          title="Newest sign-ups"
          to="/admin/members"
          empty={loading ? "Loading…" : "No one has signed up yet."}
          rows={r.members.map((u) => (
            <li key={u.id}>
              <Link to={`/admin/members/${u.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-black/[0.02]">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-paper">{u.name || u.email}</span>
                  <span className="block truncate text-xs text-steel">{u.company} · {formatWhen(u.createdAt)}</span>
                </span>
                <Pill tone={MEMBER_TONE[u.status]}>{MEMBER_LABEL[u.status]}</Pill>
              </Link>
            </li>
          ))}
        />
        <Recent
          title="Newest job postings"
          to="/admin/jobs"
          empty={loading ? "Loading…" : "No jobs posted yet."}
          rows={r.jobs.map((x) => (
            <li key={x.id}>
              <Link to={`/admin/jobs?open=${x.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-black/[0.02]">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-paper">{x.title}</span>
                  <span className="block truncate text-xs text-steel">{x.ref} · {x.owner} · {formatWhen(x.createdAt)}</span>
                </span>
                <Pill tone={JOB_TONE[x.status]}>{JOB_STATUS_LABEL[x.status]}</Pill>
              </Link>
            </li>
          ))}
        />
        <Recent
          title="Newest listings"
          to="/admin/catalog"
          empty={loading ? "Loading…" : "No catalog listings yet."}
          rows={r.listings.map((l) => (
            <li key={l.id}>
              <Link to={`/admin/catalog?q=${encodeURIComponent(l.sku)}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-black/[0.02]">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-paper">{l.name}</span>
                  <span className="block truncate text-xs text-steel">{l.sku} · {l.owner} · {formatWhen(l.createdAt)}</span>
                </span>
                <Pill tone={l.status === "active" ? "success" : "neutral"}>{l.status === "active" ? "Active" : "Draft"}</Pill>
              </Link>
            </li>
          ))}
        />
      </div>
    </AdminLayout>
  );
}
