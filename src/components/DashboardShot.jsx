/**
 * Real dashboard screenshot framed in the same window chrome as
 * HeroPanel/OpportunityPreview, so every product mockup on the site reads
 * as one consistent UI rather than illustration vs. screenshot.
 */
export default function DashboardShot({ src, alt, label, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-md border border-line bg-ink-2 shadow-2xl ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-ink px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-2 text-xs text-steel">{label}</span>
      </div>
      <img src={src} alt={alt} className="w-full" loading="lazy" />
    </div>
  );
}
