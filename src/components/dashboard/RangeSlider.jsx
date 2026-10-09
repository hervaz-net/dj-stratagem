import { useId } from "react";

/**
 * Dual-thumb range filter.
 *
 * Built from two overlaid native <input type="range"> elements rather than
 * divs + pointer maths, so arrow keys, Home/End, and screen-reader semantics
 * work without reimplementing them. Each input only receives pointer events on
 * its own thumb, which is what lets the two overlap and stay grabbable.
 */
export default function RangeSlider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value = [min, max],
  onChange,
  format = (v) => v,
  accent = "var(--brand)",
  className = "",
}) {
  const id = useId();
  const [low, high] = value;

  const pct = (v) => ((v - min) / (max - min)) * 100;

  // Thumbs may not cross; clamp each against the other.
  const setLow = (v) => onChange?.([Math.min(Number(v), high), high]);
  const setHigh = (v) => onChange?.([low, Math.max(Number(v), low)]);

  const thumb =
    "pointer-events-none absolute inset-x-0 top-1/2 h-9 w-full -translate-y-1/2 appearance-none bg-transparent " +
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
    "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white " +
    "[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab " +
    "[&::-webkit-slider-thumb]:bg-[var(--thumb)] " +
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
    "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full " +
    "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md " +
    "[&::-moz-range-thumb]:bg-[var(--thumb)]";

  return (
    <div className={className}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-steel">{label}</span>
        <span className="text-xs font-medium tabular-nums text-paper">
          {format(low)} &ndash; {format(high)}
        </span>
      </div>

      <div className="relative h-9">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-steel/20" />
        {/* selected span */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
          style={{
            left: `${pct(low)}%`,
            width: `${Math.max(0, pct(high) - pct(low))}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${accent} 60%, transparent), ${accent})`,
            boxShadow: `0 0 12px -2px color-mix(in srgb, ${accent} 70%, transparent)`,
          }}
        />

        <input
          type="range"
          id={`${id}-low`}
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(e) => setLow(e.target.value)}
          aria-label={`${label} minimum`}
          className={thumb}
          style={{ "--thumb": accent }}
        />
        <input
          type="range"
          id={`${id}-high`}
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(e) => setHigh(e.target.value)}
          aria-label={`${label} maximum`}
          className={thumb}
          style={{ "--thumb": accent }}
        />
      </div>
    </div>
  );
}
