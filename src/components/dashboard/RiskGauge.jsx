/**
 * Horizontal risk meter, 0-100 where higher is worse.
 *
 * Colour alone never carries the meaning — the number and a band word
 * ("Low"/"Elevated"/"High") sit alongside it.
 */

function riskBand(score) {
  if (score < 25) return { label: "Low", color: "var(--viz-green)" };
  if (score < 50) return { label: "Moderate", color: "var(--viz-gold)" };
  if (score < 70) return { label: "Elevated", color: "#ea580c" };
  return { label: "High", color: "var(--viz-red)" };
}

export default function RiskGauge({ score = 0, className = "" }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const { label, color } = riskBand(value);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-steel/20"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Risk score ${value} of 100, ${label}`}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${color} 55%, transparent), ${color})`,
            transition: "width 700ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
      <span className="w-7 shrink-0 text-sm font-semibold tabular-nums text-paper">{value}</span>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
