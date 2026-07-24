export default function FeatureCard({ icon, title, children, className = "" }) {
  return (
    <div className={`rounded-xl border border-line bg-ink-2 p-6 transition-colors hover:border-steel/60 ${className}`}>
      {icon && (
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-paper">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-steel">{children}</p>
    </div>
  );
}
