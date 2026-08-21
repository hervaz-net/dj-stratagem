const STATUS = {
  active: { color: "var(--viz-green)", pulse: "color-mix(in srgb, var(--viz-green) 55%, transparent)", label: "Active" },
  watch: { color: "var(--viz-gold)", pulse: "color-mix(in srgb, var(--viz-gold) 50%, transparent)", label: "Watch" },
  "at-risk": { color: "var(--viz-red)", pulse: "color-mix(in srgb, var(--viz-red) 50%, transparent)", label: "At risk" },
  idle: { color: "var(--text-muted)", pulse: "color-mix(in srgb, var(--text-muted) 40%, transparent)", label: "Idle" },
};

/**
 * Live status indicator. `pulse` drives the expanding ring — switch it off for
 * dense lists where a dozen pulsing dots would be noise rather than signal.
 * The animation is disabled entirely under prefers-reduced-motion (index.css).
 */
export default function StatusDot({ status = "active", pulse = true, size = 8, className = "" }) {
  const s = STATUS[status] ?? STATUS.idle;

  return (
    <span
      className={`relative inline-flex shrink-0 rounded-full ${pulse ? "pulse-dot" : ""} ${className}`}
      style={{ width: size, height: size, background: s.color, "--pulse-color": s.pulse }}
      role="img"
      aria-label={s.label}
      title={s.label}
    />
  );
}
