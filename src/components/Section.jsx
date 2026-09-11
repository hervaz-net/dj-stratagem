/**
 * `tint` gives a section a full-bleed raised background, breaking the page
 * into alternating bands instead of one flat surface with hairlines
 * between every section — the rhythm most B2B SaaS marketing pages use to
 * separate content into visually distinct blocks while scrolling.
 */
export default function Section({ id, className = "", tint = false, children, ...rest }) {
  return (
    <section
      id={id}
      className={`px-6 py-10 md:py-14 ${tint ? "bg-ink-3" : ""} ${className}`}
      {...rest}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="badge badge-brand mb-3 uppercase tracking-wider">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </div>
  );
}
