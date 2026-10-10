import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { fetchJob, jobAction } from "../../api/jobs";
import { IconX } from "../icons";
import { JobStatusBadge, ProgressBar, StageChip, TaskStatusBadge } from "./jobUi";
import { formatValue, formatWhen } from "./jobFormat";

/**
 * Side panel for one job: details, every subagent task with controls, the
 * approve / reject / start / cancel actions the viewer is allowed, and the
 * event log. Reloads itself after each action and calls onChanged so the
 * list behind it stays in sync.
 */
export default function JobDrawer({ jobId, onClose, onChanged }) {
  const { user, csrf } = useAuth();
  const { toast } = useToast();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");
  const closeRef = useRef(null);
  const isAdmin = user?.role === "admin";

  const load = useCallback(async (signal) => {
    try {
      const res = await fetchJob(jobId, { signal });
      setJob(res.job);
      setError("");
    } catch (err) {
      if (err?.name !== "AbortError") setError(err.message);
    }
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return undefined;
    setJob(null);
    setNote("");
    const controller = new AbortController();
    load(controller.signal);
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      controller.abort();
      document.removeEventListener("keydown", onKey);
    };
  }, [jobId, load, onClose]);

  if (!jobId) return null;

  const act = async (action, payload = {}, success) => {
    setBusy(action + (payload.taskId ?? ""));
    try {
      const res = await jobAction(action, { id: jobId, ...payload }, { csrf });
      setJob(res.job);
      setNote("");
      if (success) toast(success, { type: "success" });
      onChanged?.(res.job);
    } catch (err) {
      toast(err.message ?? "That didn't work. Try again.", { type: "error" });
    } finally {
      setBusy("");
    }
  };

  const canWork = job && job.status === "in_progress";
  const isOpen = job && !["completed", "cancelled", "rejected"].includes(job.status);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={job ? `${job.ref} ${job.title}` : "Job details"}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-xl flex-col overflow-y-auto bg-ink-2 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <p className="font-mono text-xs text-steel">{job?.ref ?? "Loading…"}</p>
            <h2 className="mt-0.5 text-lg font-semibold text-paper">{job?.title ?? ""}</h2>
            {job && (
              <p className="mt-0.5 text-sm text-steel">
                {[job.trade, job.location, formatValue(job.value)].filter((v) => v && v !== "—").join(" · ") || "No details"}
              </p>
            )}
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close job details" className="min-h-11 min-w-11 rounded-md p-2 text-steel hover:text-paper">
            <IconX width={20} height={20} />
          </button>
        </div>

        {error && <p className="px-6 py-4 text-sm text-danger">{error}</p>}

        {job && (
          <>
            <div className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
              <JobStatusBadge status={job.status} />
              <ProgressBar done={job.progress.done} total={job.progress.total} />
              {isAdmin && (
                <span className="text-xs text-steel">
                  {job.owner.name} · {job.owner.company}
                </span>
              )}
            </div>

            {job.decisionNote && (
              <div className="border-b border-line px-6 py-3 text-sm">
                <span className="font-semibold text-paper">{job.status === "rejected" ? "Reason: " : "Approver note: "}</span>
                <span className="text-steel">{job.decisionNote}</span>
              </div>
            )}

            {/* Actions */}
            {isOpen && (
              <div className="space-y-3 border-b border-line px-6 py-4">
                {job.status === "pending_approval" && !isAdmin && (
                  <p className="text-sm text-steel">Waiting for an administrator to approve this job. Subagents start after approval.</p>
                )}
                {(isAdmin && job.status === "pending_approval") && (
                  <label className="block">
                    <span className="text-xs font-medium text-steel">Note to the requester (required to reject)</span>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={600} className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-amber" />
                  </label>
                )}
                <div className="flex flex-wrap gap-2">
                  {isAdmin && job.status === "pending_approval" && (
                    <>
                      <button type="button" disabled={!!busy} onClick={() => act("approve", { note }, `${job.ref} approved.`)} className="min-h-11 rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-hover disabled:opacity-60">
                        {busy === "approve" ? "Approving…" : "Approve job"}
                      </button>
                      <button
                        type="button"
                        disabled={!!busy}
                        onClick={() => (note.trim() ? act("reject", { note }, `${job.ref} rejected.`) : toast("Add a reason before rejecting.", { type: "warning" }))}
                        className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-semibold text-steel hover:border-danger/50 hover:text-danger disabled:opacity-60"
                      >
                        {busy === "reject" ? "Rejecting…" : "Reject"}
                      </button>
                    </>
                  )}
                  {job.status === "approved" && (
                    <button type="button" disabled={!!busy} onClick={() => act("start", {}, "Subagents started.")} className="min-h-11 rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-hover disabled:opacity-60">
                      {busy === "start" ? "Starting…" : `Start all ${job.progress.total} subagents`}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={!!busy}
                    onClick={() => { if (window.confirm(`Cancel ${job.ref}? Running subagents will stop.`)) act("cancel", {}, `${job.ref} cancelled.`); }}
                    className="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-semibold text-steel hover:border-danger/50 hover:text-danger disabled:opacity-60"
                  >
                    {busy === "cancel" ? "Cancelling…" : "Cancel job"}
                  </button>
                </div>
              </div>
            )}

            {/* Tasks */}
            <div className="border-b border-line px-6 py-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-steel">Subagents</h3>
              <ul className="mt-3 space-y-2">
                {job.tasks.map((t) => (
                  <li key={t.id} className="rounded-xl border border-line bg-ink/50 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-paper">{t.name}</span>
                      <StageChip stage={t.stage} />
                      <span className="ml-auto"><TaskStatusBadge status={t.status} /></span>
                    </div>
                    <p className="mt-1 text-xs text-steel">{t.label}</p>
                    {t.note && <p className="mt-1 text-xs text-paper">Note: {t.note}</p>}
                    {canWork && ["running", "blocked"].includes(t.status) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" disabled={!!busy} onClick={() => act("task", { taskId: t.id, status: "done" }, `${t.name} done.`)} className="min-h-9 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success hover:bg-success/25 disabled:opacity-60">
                          Mark done
                        </button>
                        {t.status === "running" ? (
                          <button type="button" disabled={!!busy} onClick={() => act("task", { taskId: t.id, status: "blocked" })} className="min-h-9 rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger hover:bg-danger/20 disabled:opacity-60">
                            Blocked
                          </button>
                        ) : (
                          <button type="button" disabled={!!busy} onClick={() => act("task", { taskId: t.id, status: "running" })} className="min-h-9 rounded-full bg-amber/12 px-3 py-1 text-xs font-semibold text-amber hover:bg-amber/20 disabled:opacity-60">
                            Resume
                          </button>
                        )}
                        <button type="button" disabled={!!busy} onClick={() => act("task", { taskId: t.id, status: "skipped" })} className="min-h-9 rounded-full px-3 py-1 text-xs font-semibold text-steel hover:text-paper disabled:opacity-60">
                          Skip
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {job.notes && (
              <div className="border-b border-line px-6 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-steel">Notes</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-paper">{job.notes}</p>
              </div>
            )}

            <div className="px-6 py-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-steel">Activity</h3>
              <ol className="mt-3 space-y-3">
                {job.events.map((e, i) => (
                  <li key={i} className="text-sm">
                    <p className="text-paper">{e.message}</p>
                    <p className="text-xs text-steel">{e.by} · {formatWhen(e.createdAt)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </>
  );
}
