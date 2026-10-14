import { useEffect, useRef, useState } from "react";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { SUBAGENTS, jobAction } from "../../api/jobs";
import SubagentMark from "../../shared/SubagentMark";
import { StageChip } from "./jobUi";

const EMPTY = { title: "", location: "", trade: "", value: "", notes: "" };

const fromJob = (job) => ({
  title: job.title ?? "",
  location: job.location ?? "",
  trade: job.trade ?? "",
  value: job.value === null || job.value === undefined ? "" : String(job.value),
  notes: job.notes ?? "",
});

/**
 * "New job" button + dialog. The job lands in pending_approval.
 * Pass `job` (a rejected job) to edit it and resubmit it for approval instead.
 */
export default function NewJobDialog({ onCreated, job = null }) {
  const editing = !!job;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => (editing ? fromJob(job) : EMPTY));
  const [picked, setPicked] = useState(() => new Set(editing ? job.subagents : SUBAGENTS.map((s) => s.key)));
  const [errors, setErrors] = useState({});
  const { csrf } = useAuth();
  const { toast } = useToast();
  const firstField = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    firstField.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    opener.current?.focus();
  };

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const toggle = (key) => setPicked((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const allPicked = picked.size === SUBAGENTS.length;

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Give the job a title.";
    if (form.value !== "" && !(Number(form.value.replace(/[$,\s]/g, "")) >= 0)) nextErrors.value = "Enter a number.";
    if (picked.size === 0) nextErrors.subagents = "Pick at least one subagent.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    try {
      const res = await jobAction(editing ? "resubmit" : "create", {
        ...(editing ? { id: job.id } : {}),
        ...form,
        value: form.value === "" ? null : form.value,
        subagents: SUBAGENTS.filter((s) => picked.has(s.key)).map((s) => s.key),
      }, { csrf });
      toast(
        editing
          ? `${res.job.ref} resubmitted. An administrator will review it again.`
          : `${res.job.ref} submitted. Once an administrator approves it, the subagents run on their own.`,
        { type: "success", duration: 5000 },
      );
      if (!editing) {
        setForm(EMPTY);
        setPicked(new Set(SUBAGENTS.map((s) => s.key)));
      }
      setErrors({});
      close();
      onCreated?.(res.job);
    } catch (err) {
      if (err.fields && typeof err.fields === "object" && !Array.isArray(err.fields)) setErrors(err.fields);
      toast(err.message ?? (editing ? "Couldn't resubmit that job." : "Couldn't create that job."), { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (key) =>
    `mt-1 w-full rounded-md border bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-amber ${errors[key] ? "border-danger" : "border-line"}`;

  return (
    <>
      <button
        ref={opener}
        type="button"
        onClick={() => {
          if (editing) setForm(fromJob(job));
          setOpen(true);
        }}
        className={editing
          ? "min-h-11 rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white hover:bg-cta-hover"
          : "lift glow-brand inline-flex min-h-11 items-center gap-2 rounded-full bg-cta px-5 py-3 text-sm font-semibold text-white hover:bg-cta-hover"}
      >
        {!editing && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
        {editing ? "Edit and resubmit" : "New job"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10" onClick={close}>
          <form
            onSubmit={submit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-job-title"
            noValidate
            className="w-full max-w-xl rounded-2xl border border-line bg-ink-2 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="new-job-title" className="text-lg font-semibold text-paper">{editing ? `Edit ${job.ref}` : "New job"}</h2>
            <p className="mt-1 text-sm text-steel">
              {editing
                ? `Fix what the approver asked for${job.decisionNote ? ` (“${job.decisionNote}”)` : ""}, then resubmit.`
                : "Pick the subagents to run on it. Nothing starts until an administrator approves the job; then each subagent runs on its own and builds on the work before it."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-steel">Job title</span>
                <input ref={firstField} value={form.title} onChange={set("title")} maxLength={160} placeholder="Medical office TI" className={fieldClass("title")} aria-invalid={!!errors.title} aria-describedby={errors.title ? "err-title" : undefined} />
                {errors.title && <span id="err-title" className="mt-1 block text-xs text-danger">{errors.title}</span>}
              </label>
              <label className="block">
                <span className="text-xs font-medium text-steel">Location</span>
                <input value={form.location} onChange={set("location")} maxLength={160} placeholder="Pasadena, CA" className={fieldClass("location")} />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-steel">Trade</span>
                <input value={form.trade} onChange={set("trade")} maxLength={80} placeholder="Electrical" className={fieldClass("trade")} />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-steel">Job value (USD, optional)</span>
                <input value={form.value} onChange={set("value")} inputMode="decimal" placeholder="240000" className={fieldClass("value")} aria-invalid={!!errors.value} />
                {errors.value && <span className="mt-1 block text-xs text-danger">{errors.value}</span>}
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-steel">Notes for the approver (optional)</span>
                <textarea value={form.notes} onChange={set("notes")} maxLength={2000} rows={3} className={fieldClass("notes")} />
              </label>
            </div>

            <fieldset className="mt-5">
              <div className="flex items-center justify-between">
                <legend className="text-xs font-medium text-steel">Subagents ({picked.size} of {SUBAGENTS.length})</legend>
                <button
                  type="button"
                  onClick={() => setPicked(allPicked ? new Set() : new Set(SUBAGENTS.map((s) => s.key)))}
                  className="min-h-11 px-2 text-xs font-semibold text-amber hover:text-amber-2"
                >
                  {allPicked ? "Clear all" : "Select all nine"}
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {SUBAGENTS.map((s) => (
                  <label
                    key={s.key}
                    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      picked.has(s.key) ? "border-amber/60 bg-amber/10 text-paper" : "border-line text-steel hover:border-amber/35"
                    }`}
                  >
                    <input type="checkbox" checked={picked.has(s.key)} onChange={() => toggle(s.key)} className="accent-amber" />
                    <SubagentMark id={s.key} size={20} />
                    <span className="flex-1 font-semibold">{s.name}</span>
                    <StageChip stage={s.stage} />
                  </label>
                ))}
              </div>
              {errors.subagents && <p className="mt-2 text-xs text-danger">{errors.subagents}</p>}
            </fieldset>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={close} className="min-h-11 px-4 py-2 text-sm font-semibold text-steel hover:text-paper">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="min-h-11 rounded-full bg-cta px-5 py-2 text-sm font-semibold text-white hover:bg-cta-hover disabled:opacity-60">
                {saving ? "Submitting…" : editing ? "Resubmit for approval" : "Submit for approval"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
