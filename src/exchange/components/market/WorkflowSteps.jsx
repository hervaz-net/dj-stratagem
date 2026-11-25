import { toneFor } from "./roleTone";

/** Numbered how-it-works list. `steps` = [{ title, text }]. */
export default function WorkflowSteps({ steps, role, className = "" }) {
  const tone = role ? toneFor(role) : null;
  return (
    <ol className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {steps.map((s, i) => (
        <li key={s.title} className="relative rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold tabular-nums ${
              tone ? `${tone.soft} ${tone.text}` : "bg-brand-soft text-brand-fg"
            }`}
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <h3 className="mt-4 text-base font-semibold text-fg">
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
