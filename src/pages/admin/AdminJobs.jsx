import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout, { Panel, Pill, Tabs } from "./AdminLayout";
import { btn, input } from "./adminStyles";
import useAdminData from "./useAdminData";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import JobDrawer from "../../components/dashboard/JobDrawer";
import { ProgressBar } from "../../components/dashboard/jobUi";
import { JOB_STATUS_LABEL, SUBAGENTS, fetchJobs, jobAction } from "../../api/jobs";
import { formatValue, formatWhen } from "../../components/dashboard/jobFormat";
import SubagentMark from "../../shared/SubagentMark";

const NAME = Object.fromEntries(SUBAGENTS.map((s) => [s.key, s.name]));
const TONE = { pending_approval: "warning", approved: "neutral", in_progress: "neutral", completed: "success", rejected: "danger", cancelled: "neutral" };

export default function AdminJobs() {
  const { csrf } = useAuth();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "pending_approval";
  const openId = params.get("open");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [notes, setNotes] = useState({});
  const [busy, setBusy] = useState(null);

  const { data, error, loading, reload } = useAdminData(
    ({ signal }) => fetchJobs({ scope: "all", status, signal }),
    status,
  );
  const counts = data?.counts ?? {};

  const jobs = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = data?.jobs ?? [];
    if (!needle) return list;
    return list.filter((j) =>
      [j.title, j.ref, j.owner?.name, j.owner?.company, j.location, j.trade].some((v) => (v ?? "").toLowerCase().includes(needle)),
    );
  }, [data, q]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const closeDrawer = useCallback(() => {
    const next = new URLSearchParams(window.location.search);
    next.delete("open");
    setParams(next, { replace: true });
  }, [setParams]);

  const decide = async (job, action) => {
    const note = (notes[job.id] ?? "").trim();
    if (action === "reject" && !note) {
      toast("Add a reason so the person who posted it knows what to change.", { type: "warning" });
      document.getElementById(`note-${job.id}`)?.focus();
      return;
    }
    setBusy(`${action}-${job.id}`);
    try {
      await jobAction(action, { id: job.id, note }, { csrf });
      toast(`${job.ref} ${action === "approve" ? "approved. Its subagents are running." : "rejected."}`, { type: "success" });
      setNotes((n) => ({ ...n, [job.id]: "" }));
      reload();
    } catch (err) {
      toast(err.message ?? "That didn't work.", { type: "error" });
      reload();
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminLayout title="Job postings" subtitle="Every job members post waits here until you approve it. Subagents never start on an unapproved job.">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          label="Filter by status"
          value={status}
          onChange={(v) => setParam("status", v === "pending_approval" ? null : v)}
          options={[
            ["pending_approval", "Waiting", counts.pending_approval],
            ["in_progress", "In progress", counts.in_progress],
            ["approved", "Approved", counts.approved],
            ["completed", "Completed", counts.completed],
            ["rejected", "Rejected", counts.rejected],
            ["all", "All", counts.all],
          ]}
        />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, ref, member, or trade" aria-label="Search jobs" className={`${input} w-72 max-w-full`} />
      </div>

      {error && <Panel className="mt-4 px-5 py-3"><p className="text-sm text-danger">{error.message}</p></Panel>}

      <div className="mt-5 space-y-3">
        {jobs.map((job) => (
          <Panel key={job.id} as="article" className="p-5" aria-labelledby={`job-${job.id}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs text-steel">{job.ref} · posted {formatWhen(job.createdAt)}</p>
                <h2 id={`job-${job.id}`} className="mt-0.5 text-base font-semibold text-paper">
                  <button type="button" onClick={() => setParam("open", String(job.id))} className="text-left hover:underline">{job.title}</button>
                </h2>
                <p className="text-sm text-steel">
                  <Link to={`/admin/members/${job.owner.id}`} className="font-medium text-paper hover:underline">{job.owner.name}</Link>
                  {job.owner.company && ` · ${job.owner.company}`}
                  {job.location && ` · ${job.location}`}
                  {job.trade && ` · ${job.trade}`}
                  {job.value !== null && ` · ${formatValue(job.value)}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {job.status !== "pending_approval" && <ProgressBar done={job.progress.done} total={job.progress.total} label={`${job.ref} progress`} />}
                <Pill tone={TONE[job.status]}>{JOB_STATUS_LABEL[job.status]}</Pill>
              </div>
            </div>

            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Subagents">
              {job.subagents.map((k) => (
                <li key={k} className="inline-flex items-center gap-1.5 rounded-full border border-line py-1 pl-1 pr-2.5 text-xs font-semibold text-paper">
                  <SubagentMark id={k} size={18} />
                  {NAME[k] ?? k}
                </li>
              ))}
            </ul>
            {job.notes && <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-paper">{job.notes}</p>}
            {job.decisionNote && <p className="mt-2 text-sm text-steel">Decision note: {job.decisionNote}</p>}

            {job.status === "pending_approval" && (
              <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-4">
                <label className="min-w-[16rem] flex-1">
                  <span className="text-xs font-medium text-steel">Note to the member (required to reject)</span>
                  <input
                    id={`note-${job.id}`}
                    value={notes[job.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [job.id]: e.target.value }))}
                    maxLength={600}
                    className={`${input} mt-1`}
                  />
                </label>
                <button type="button" disabled={!!busy} onClick={() => decide(job, "approve")} className={btn.dark}>
                  {busy === `approve-${job.id}` ? "Approving…" : "Approve and start"}
                </button>
                <button type="button" disabled={!!busy} onClick={() => decide(job, "reject")} className={btn.danger}>
                  {busy === `reject-${job.id}` ? "Rejecting…" : "Reject"}
                </button>
              </div>
            )}
          </Panel>
        ))}
      </div>

      {!jobs.length && (
        <Panel className="mt-5 px-6 py-14 text-center">
          <p className="text-sm text-steel">
            {loading ? "Loading…" : status === "pending_approval" ? "Nothing is waiting for approval." : "No jobs match."}
          </p>
        </Panel>
      )}

      <JobDrawer jobId={openId ? Number(openId) : null} onClose={closeDrawer} onChanged={reload} />
    </AdminLayout>
  );
}
