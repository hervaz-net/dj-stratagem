// Nocturne has no ruled section dividers: space and the background carry the
// rhythm. Border utilities passed by older pages are dropped here.
const RULES = /\b(border-[tb]|border-y|border-line|border-amber\/\d+)\b/g;

export default function Section({ id, className = "", children, ...rest }) {
  const cls = className.replace(RULES, "").replace(/\s+/g, " ").trim();
  return (
    <section id={id} className={`relative px-6 py-20 md:py-28 ${cls}`} {...rest}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="mono-label mb-6 inline-flex items-center gap-3 text-steel">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inset-0 animate-ping rounded-full bg-cta/60 motion-reduce:animate-none" />
        <span className="relative h-2 w-2 rounded-full bg-cta" />
      </span>
      {children}
    </div>
  );
}
