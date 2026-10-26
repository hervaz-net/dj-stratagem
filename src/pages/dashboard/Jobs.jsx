import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import NewJobDialog from "../../components/dashboard/NewJobDialog";
import JobDrawer from "../../components/dashboard/JobDrawer";
import Seo from "../../components/Seo";
import useAuth from "../../auth/useAuth";
import usePolledResource from "../../api/usePolledResource";
import { JOB_STATUS_LABEL, SUBAGENTS, fetchJobs, fetchSubagents } from "../../api/jobs";
import { JobStatusBadge, ProgressBar, StageChip } from "../../components/dashboard/jobUi";
import SubagentMark from "../../shared/SubagentMark";
import { formatValue, formatWhen } from "../../components/dashboard/jobFormat";

const FILTERS = ["all", "pending_approval", "approved", "in_progress", "completed", "rejected", "cancelled"];
const STATE_DOT = { running: "active", blocked: "at-risk", idle: "idle" };

export default function Jobs() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [filter, setFilter] = useState("all");
  const [scope, setScope] = useState("mine");
  const [params, setParams] = useSearchParams();
  // Emails link to /dashboard/jobs?job=JOB-12345.
  const [openId, setOpenId] = useState(() => params.get("job"));
  // Subagent pages link to /dashboard/jobs?new=fleet: open New job with it picked.
  const [preset] = useState(() => {
    const keys = (params.get("new") ?? "").split(",").filter((k) => SUBAGENTS.some((s) => s.key === k));
    return keys.length ? keys : null;
  });
  useEffect(() => {
    if (!params.has("new")) return;
    setParams((p) => {
      const next = new URLSearchParams(p);
      next.delete("new");
      return next;
    }, { replace: true });
  }, [params, setParams]);

  const jobsFetcher = useCallback(
    ({ signal }) => fetchJobs({ status: filter, scope: isAdmin && scope === "all" ? "all" : undefined, signal }),
    [filter, scope, isAdmin],
  );
  const jobs = usePolledResource(jobsFetcher, { intervalMs: 15000, initialData: { jobs: [], counts: {} } });
  const agents = usePolledResource(fetchSubagents, { intervalMs: 15000, initialData: { subagents: [] } });
  const refreshJobs = jobs.refresh;

  // The hook only re-reads its fetcher on the next poll; reload as soon as
  // the filter or scope changes so the list never shows the old tab. On mount
  // this repeats the first load, which the hook aborts — harmless.
  useEffect(() => {
    refreshJobs();
  }, [jobsFetcher, refreshJobs]);

  const refreshAgents = agents.refresh;
  const refreshAll = useCallback(() => {
    refreshJobs();
    refreshAgents();
  }, [refreshJobs, refreshAgents]);

  const counts = jobs.data?.counts ?? {};
  const list = jobs.data?.jobs ?? [];
  const closeDrawer = useCallback(() => {
    setOpenId(null);
    setParams((p) => {
      if (!p.has("job")) return p;
      const next = new URLSearchParams(p);
      next.delete("job");
      return next;
    }, { replace: true });
  }, [setParams]);

  return (
    <>
      <Seo title="Jobs" description="Jobs and the subagents working them." noindex />
      <DashboardLayout
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Dashboard", to: "/dashboard/overview" }, { label: "Jobs" }]}
        title="Jobs"
        subtitle="Submit a job and pick its subagents. Once an administrator approves it, they run on their own, one building on the next, and we email you the results."
        actions={<NewJobDialog preset={preset} onCreated={(job) => { refreshAll(); setOpenId(job.id); }} />}
      >
        {/* Subagent board */}
        <section aria-labelledby="subagents-heading">
          <h2 id="subagents-heading" className="sr-only">Subagents</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-9">
            {(agents.data?.subagents ?? []).map((a) => (
              <GlassCard key={a.key} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <SubagentMark id={a.key} size={22} />
                    <span className="truncate text-sm font-semibold text-fg">{a.name}</span>
                  </span>
                  <StatusDot status={STATE_DOT[a.state]} size={8} pulse={a.state === "running"} />
                </div>
                <div className="mt-1.5"><StageChip stage={a.stage} /></div>
                <p className="mt-2 text-xs tabular-nums text-fg-muted">
                  <span className="font-semibold text-fg">{a.queue.running}</span> working
                  {a.queue.blocked > 0 && <span className="text-danger"> · {a.queue.blocked} blocked</span>}
                  <span> · {a.queue.queued} waiting</span>
                </p>
              </GlassCard>
            ))}
          </div>
          {agents.error && <p className="mt-2 text-sm text-danger">{agents.error.message}</p>}
        </section>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {FILTERS.map((key) => {
            const active = filter === key;
            const count = counts[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`lift inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                  active ? "border-brand/60 bg-brand/12 text-brand" : "border-line bg-canvas/50 text-fg-muted hover:border-brand/35 hover:text-fg"
                }`}
              >
                {key === "all" ? "All" : JOB_STATUS_LABEL[key]}
                {count !== undefined && <span className="rounded-full bg-canvas px-1.5 py-0.5 tabular-nums">{count}</span>}
              </button>
            );
          })}
          {isAdmin && (
            <label className="ml-auto inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-fg-muted">
              <input type="checkbox" checked={scope === "all"} onChange={(e) => setScope(e.target.checked ? "all" : "mine")} className="accent-brand" />
              Everyone's jobs
            </label>
          )}
        </div>

        {jobs.error && (
          <GlassCard className="mt-4 px-5 py-3"><p className="text-sm text-danger">{jobs.error.message}</p></GlassCard>
        )}

        <GlassCard className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <caption className="sr-only">Jobs with status, subagent progress and value</caption>
              <thead>
                <tr className="border-b border-line">
                  {["Job", "Status", "Subagents", "Value", "Updated"].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((j) => (
                  <tr key={j.id} className="border-b border-line/60 transition-colors last:border-0 hover:bg-subtle/60">
                    <th scope="row" className="px-4 py-3.5 text-left font-normal">
                      <button type="button" onClick={() => setOpenId(j.id)} className="min-h-11 text-left">
                        <span className="block font-semibold text-fg hover:text-brand">{j.title}</span>
                        <span className="block text-xs text-fg-muted">
                          <span className="font-mono">{j.ref}</span>
                          {j.location && ` · ${j.location}`}
                          {isAdmin && scope === "all" && ` · ${j.owner.company}`}
                        </span>
                      </button>
                    </th>
                    <td className="px-4 py-3.5"><JobStatusBadge status={j.status} /></td>
                    <td className="px-4 py-3.5"><ProgressBar done={j.progress.done} total={j.progress.total} label={`${j.title} progress`} /></td>
                    <td className="px-4 py-3.5 tabular-nums text-fg">{formatValue(j.value)}</td>
                    <td className="px-4 py-3.5 text-fg-muted">{formatWhen(j.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!list.length && (
            <div className="px-6 py-14 text-center">
              <p className="text-sm font-medium text-fg">
                {jobs.loading ? "Loading jobs…" : filter === "all" ? "No jobs yet." : `No ${JOB_STATUS_LABEL[filter].toLowerCase()} jobs.`}
              </p>
              {!jobs.loading && filter === "all" && (
                <p className="mt-1 text-sm text-fg-muted">Create one with New job. It goes to an administrator for approval first.</p>
              )}
            </div>
          )}
        </GlassCard>
      </DashboardLayout>

      <JobDrawer jobId={openId} onClose={closeDrawer} onChanged={refreshAll} />
    </>
  );
}
