export default function Section({ id, className = "", children, ...rest }) {
  return (
    <section id={id} className={`px-6 py-20 md:py-28 ${className}`} {...rest}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber/25 bg-amber/8 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber">
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {children}
    </div>
  );
}
