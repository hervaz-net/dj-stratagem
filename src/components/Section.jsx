// Sections have no ruled dividers: space and the background bands carry the
// rhythm. Border utilities passed by older pages are dropped here.
const RULES = /\b(border-[tb]|border-y|border-line|border-brand\/\d+)\b/g;

export default function Section({ id, className = "", children, ...rest }) {
  const cls = className.replace(RULES, "").replace(/\s+/g, " ").trim();
  return (
    <section id={id} className={`relative px-6 py-10 md:py-16 ${cls}`} {...rest}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="mono-label mb-6 inline-flex items-center gap-3 text-fg-muted">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand/60 motion-reduce:animate-none" />
        <span className="relative h-2 w-2 rounded-full bg-brand" />
      </span>
      {children}
    </div>
  );
}
