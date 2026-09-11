export default function Section({ id, className = "", children, ...rest }) {
  return (
    <section id={id} className={`px-6 py-10 md:py-14 ${className}`} {...rest}>
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
