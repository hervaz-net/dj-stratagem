import { useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import JobDrawer from "../../components/dashboard/JobDrawer";
import Seo from "../../components/Seo";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import usePolledResource from "../../api/usePolledResource";
import { SUBAGENTS, fetchJobs, jobAction } from "../../api/jobs";
import { StageChip } from "../../components/dashboard/jobUi";
import { formatValue, formatWhen } from "../../components/dashboard/jobFormat";

const STAGE_OF = Object.fromEntries(SUBAGENTS.map((s) => [s.key, s]));

/** Admin queue: every job waiting for a decision. Nothing runs until approved here. */
export default function Approvals() {
  const { user, csrf } = useAuth();
  const { toast } = useToast();
  const [openId, setOpenId] = useState(null);
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(null);

  const fetcher = useCallback(({ signal }) => fetchJobs({ scope: "all", status: "pending_approval", signal }), []);
  const pending = usePolledResource(fetcher, { intervalMs: 15000, initialData: { jobs: [], counts: {} } });
  const refresh = pending.refresh;
  const closeDrawer = useCallback(() => setOpenId(null), []);

  if (user && user.role !== "admin") {
    return <Navigate to="/dashboard/jobs" replace />;
  }

  const decide = async (job, action) => {
    const note = (notes[job.id] ?? "").trim();
    if (action === "reject" && !note) {
      toast("Add a reason so the requester knows what to change.", { type: "warning" });
      return;
    }
    setBusy(`${action}-${job.id}`);
    try {
      await jobAction(action, { id: job.id, note }, { csrf });
      toast(`${job.ref} ${action === "approve" ? "approved — the requester can start it now" : "rejected"}.`, { type: "success" });
      setNotes((n) => ({ ...n, [job.id]: "" }));
      refresh();
    } catch (err) {
      toast(err.message ?? "That didn't work.", { type: "error" });
      refresh();
    } finally {
      setBusy(null);
    }
  };

  const list = pending.data?.jobs ?? [];
  const counts = pending.data?.counts ?? {};

  return (
    <>
      <Seo title="Approvals" description="Approve jobs before subagents start." noindex />
      <DashboardLayout
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Admin", to: "/dashboard/admin" }, { label: "Approvals" }]}
        title="Job approvals"
        subtitle="Every job waits here until you approve it. Subagents never start on an unapproved job."
      >
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Waiting", counts.pending_approval, true],
            ["In progress", counts.in_progress],
            ["Completed", counts.completed],
            ["Rejected", counts.rejected],
          ].map(([label, value, hi]) => (
            <GlassCard key={label} className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">{label}</p>
              <p className={`mt-1 text-2xl font-semibold tabular-nums ${hi && value > 0 ? "text-amber" : "text-paper"}`}>{value ?? "—"}</p>
            </GlassCard>
          ))}
        </div>

        {pending.error && <GlassCard className="mb-4 px-5 py-3"><p className="text-sm text-danger">{pending.error.message}</p></GlassCard>}

        <div className="space-y-4">
          {list.map((job) => (
            <GlassCard key={job.id} as="article" className="px-5 py-4" aria-labelledby={`job-${job.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-steel">{job.ref} · submitted {formatWhen(job.createdAt)}</p>
                  <h2 id={`job-${job.id}`} className="mt-0.5 text-base font-semibold text-paper">
                    <button type="button" onClick={() => setOpenId(job.id)} className="text-left hover:text-amber">{job.title}</button>
                  </h2>
                  <p className="text-sm text-steel">
                    {job.owner.name} · {job.owner.company}
                    {job.location && ` · ${job.location}`}
                    {job.trade && ` · ${job.trade}`}
                    {job.value !== null && ` · ${formatValue(job.value)}`}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.subagents.map((k) => (
                  <span key={k} className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-paper">
                    {STAGE_OF[k]?.name ?? k}
                    <StageChip stage={STAGE_OF[k]?.stage} />
                  </span>
                ))}
              </div>

              {job.notes && <p className="mt-3 whitespace-pre-line text-sm text-paper">{job.notes}</p>}

              <div className="mt-4 flex flex-wrap items-end gap-3">
                <label className="min-w-[16rem] flex-1">
                  <span className="text-xs font-medium text-steel">Note to requester (required to reject)</span>
                  <input
                    value={notes[job.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [job.id]: e.target.value }))}
                    maxLength={600}
                    className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-amber"
                  />
                </label>
                <button type="button" disabled={!!busy} onClick={() => decide(job, "approve")} className="min-h-11 rounded-full bg-cta px-5 py-2 text-sm font-semibold text-white hover:bg-cta-hover disabled:opacity-60">
                  {busy === `approve-${job.id}` ? "Approving…" : "Approve"}
                </button>
                <button type="button" disabled={!!busy} onClick={() => decide(job, "reject")} className="min-h-11 rounded-full border border-line px-5 py-2 text-sm font-semibold text-steel hover:border-danger/50 hover:text-danger disabled:opacity-60">
                  {busy === `reject-${job.id}` ? "Rejecting…" : "Reject"}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        {!list.length && (
          <GlassCard className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-paper">{pending.loading ? "Loading…" : "Nothing waiting for approval."}</p>
          </GlassCard>
        )}
      </DashboardLayout>

      <JobDrawer jobId={openId} onClose={closeDrawer} onChanged={refresh} />
    </>
  );
}
