import { JOB_STATUS_LABEL, TASK_STATUS_LABEL } from "../../api/jobs";

/** Shared bits for the Jobs and Approvals screens. */

const STAGE_STYLE = {
  find: "bg-[var(--viz-gold)]/15 text-[var(--viz-gold)]",
  win: "bg-[var(--viz-blue)]/15 text-[var(--viz-blue)]",
  build: "bg-[var(--viz-green)]/15 text-[var(--viz-green)]",
  keep: "bg-[var(--viz-cyan)]/15 text-[var(--viz-cyan)]",
};

const JOB_STYLE = {
  pending_approval: "bg-warning/12 text-warning",
  approved: "bg-[var(--viz-blue)]/12 text-[var(--viz-blue)]",
  in_progress: "bg-amber/12 text-amber",
  completed: "bg-success/12 text-success",
  rejected: "bg-danger/12 text-danger",
  cancelled: "bg-ink-3 text-steel",
};

const TASK_STYLE = {
  queued: "bg-ink-3 text-steel",
  running: "bg-amber/12 text-amber",
  done: "bg-success/12 text-success",
  blocked: "bg-danger/12 text-danger",
  skipped: "bg-ink-3 text-steel",
};

export function StageChip({ stage }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STAGE_STYLE[stage] ?? ""}`}>
      {stage}
    </span>
  );
}

export function JobStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${JOB_STYLE[status] ?? ""}`}>
      {status === "in_progress" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current motion-reduce:animate-none" aria-hidden="true" />}
      {JOB_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function TaskStatusBadge({ status }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${TASK_STYLE[status] ?? ""}`}>
      {TASK_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function ProgressBar({ done, total, label }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1.5 w-24 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label={label ?? "Subagent progress"}
      >
        <div className="h-full rounded-full bg-amber transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-steel">{done}/{total}</span>
    </div>
  );
}
