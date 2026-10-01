export default function Section({ id, className = "", children, ...rest }) {
  return (
    <section id={id} className={`px-6 py-20 md:py-28 ${className}`} {...rest}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-brand">
      <span className="h-0.5 w-6 rounded-full bg-cta" />
      {children}
    </div>
  );
}
