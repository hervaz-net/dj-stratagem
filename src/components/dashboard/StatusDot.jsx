const STATUS = {
  active: { color: "var(--viz-green)", pulse: "rgba(34, 197, 94, 0.55)", label: "Active" },
  watch: { color: "var(--viz-gold)", pulse: "rgba(234, 179, 8, 0.5)", label: "Watch" },
  "at-risk": { color: "var(--viz-red)", pulse: "rgba(244, 63, 94, 0.5)", label: "At risk" },
  idle: { color: "var(--text-muted)", pulse: "rgba(148, 163, 184, 0.4)", label: "Idle" },
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
