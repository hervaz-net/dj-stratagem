export default function FeatureCard({ icon, title, children, className = "", tone = "brand" }) {
  const iconTone = {
    brand: "bg-brand-soft text-brand-fg",
    supplier: "bg-role-supplier-soft text-role-supplier",
    distributor: "bg-role-distributor-soft text-role-distributor",
    contractor: "bg-role-contractor-soft text-role-contractor",
  }[tone] ?? "bg-brand-soft text-brand-fg";

  return (
    <div
      className={`rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)] ${className}`}
    >
      {icon && (
        <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${iconTone}`}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      <div className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{children}</div>
    </div>
  );
}
