import { Card } from "./ui";
import Sparkline from "./Sparkline";
import ProgressRing from "./ProgressRing";

export default function MetricCard({ metric }) {
  const { label, value, unit = "", prefix = "", delta, accent = "blue", ring, series = [] } = metric;
  const up = delta >= 0;

  // Fewer at-risk partners is good news, so colour follows meaning, not direction.
  const goodWhenDown = metric.id === "at-risk";
  const positive = goodWhenDown ? !up : up;

  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-fg-muted">{label}</p>
          <p className="mt-2 flex items-baseline gap-1 text-3xl font-bold tracking-tight text-fg">
            <span className="tabular-nums">
              {prefix}
              {value}
            </span>
            {unit && <span className="text-lg font-semibold text-fg-muted">{unit}</span>}
          </p>
        </div>
        {ring !== undefined && (
          <ProgressRing value={ring} accent={accent} size={52} label={`${label}: ${ring}%`} />
        )}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div className="flex flex-col gap-1.5">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${positive ? "text-success" : "text-danger"}`}>
            <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
              <path d={up ? "M5 1L9 8H1z" : "M5 9L1 2h8z"} fill="currentColor" />
            </svg>
            {Math.abs(delta).toFixed(1)}%
            <span className="font-normal text-fg-muted">vs last month</span>
          </span>
        </div>
        <Sparkline data={series} accent={accent} width={96} height={32} />
      </div>
    </Card>
  );
}
