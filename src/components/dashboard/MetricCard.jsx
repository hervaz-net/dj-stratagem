import GlassCard from "./GlassCard";
import Sparkline from "./Sparkline";
import ProgressRing from "./ProgressRing";
import StatusDot from "./StatusDot";

const ACCENT_TEXT = {
  blue: "text-[var(--viz-blue)]",
  cyan: "text-[var(--viz-cyan)]",
  red: "text-[var(--viz-red)]",
  gold: "text-[var(--viz-gold)]",
};

export default function MetricCard({ metric, live = false }) {
  const { label, value, unit = "", prefix = "", delta, accent = "blue", ring, series = [] } = metric;
  const up = delta >= 0;

  // For "at-risk suppliers", fewer is better — the arrow direction and the
  // good/bad colour part ways, so colour follows meaning, not direction.
  const goodWhenDown = metric.id === "at-risk";
  const positive = goodWhenDown ? !up : up;

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {live && <StatusDot status="active" size={6} />}
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-steel">
              {label}
            </p>
          </div>
          <p className="mt-2 flex items-baseline gap-1 text-3xl font-semibold tracking-tight text-paper">
            <span className="tabular-nums">
              {prefix}
              {value}
            </span>
            {unit && <span className="text-lg text-steel">{unit}</span>}
          </p>
        </div>

        {ring !== undefined && (
          <ProgressRing value={ring} accent={accent} size={58} label={`${label}: ${ring}%`} />
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums"
          style={{ color: positive ? "var(--viz-green)" : "var(--viz-red)" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d={up ? "M5 1L9 8H1z" : "M5 9L1 2h8z"} fill="currentColor" />
          </svg>
          {Math.abs(delta).toFixed(1)}%
          <span className="font-normal text-steel">vs last month</span>
        </span>

        <Sparkline data={series} accent={accent} width={112} height={34} className={ACCENT_TEXT[accent]} />
      </div>
    </GlassCard>
  );
}
