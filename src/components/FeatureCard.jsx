export default function FeatureCard({ icon, title, children, className = "" }) {
  return (
    <div
      className={`lift group relative overflow-hidden rounded-xl border border-line bg-ink-2 p-6 hover:border-amber/45 hover:shadow-lg hover:shadow-brand/8 ${className}`}
    >
      {/* Accent wash that fades in on hover. */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      {icon && (
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-paper">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-steel">{children}</p>
    </div>
  );
}
