export default function FeatureCard({ icon, title, children, className = "" }) {
  return (
    <div className={`card-corp card-corp-hover rounded-lg p-5 ${className}`}>
      {icon && (
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-sm bg-amber/10 text-amber">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-paper">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-steel">{children}</p>
    </div>
  );
}
