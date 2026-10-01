import SampleLabel from "../SampleLabel";

/**
 * Frame for a sample product screen on marketing pages. Always carries a
 * SampleLabel: the contents are illustrative (PROOF.md).
 */
export default function MockWindow({ title, meta, children, className = "" }) {
  return (
    <figure className={`overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-pop)] ${className}`}>
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">{title}</p>
          {meta && <p className="mt-0.5 truncate text-xs text-fg-muted">{meta}</p>}
        </div>
        <SampleLabel className="shrink-0">Sample view</SampleLabel>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  );
}
