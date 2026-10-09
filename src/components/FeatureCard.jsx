export default function FeatureCard({ icon, title, children, className = "" }) {
  return (
    <div className={`slab group p-7 transition-transform duration-500 hover:-translate-y-1 ${className}`}>
      {/* Molten edge that sweeps in on hover. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-gradient-to-b from-cta via-brand to-transparent transition-transform duration-700 group-hover:scale-y-100"
      />
      {icon && <div className="mb-8 text-brand transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">{icon}</div>}
      <h3 className="font-display text-3xl text-paper">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-steel">{children}</p>
    </div>
  );
}
