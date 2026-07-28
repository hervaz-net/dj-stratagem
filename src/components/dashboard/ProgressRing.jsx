import { useEffect, useRef, useState } from "react";

const ACCENTS = {
  blue: "var(--viz-blue)",
  cyan: "var(--viz-cyan)",
  red: "var(--viz-red)",
  gold: "var(--viz-gold)",
  green: "var(--viz-green)",
};

/**
 * Circular gauge that fills to `value` percent, with the number in the middle.
 * Animates from empty on first paint unless reduced motion is requested.
 */
export default function ProgressRing({
  value = 0,
  accent = "cyan",
  size = 64,
  thickness = 6,
  label,
  className = "",
}) {
  const target = Math.max(0, Math.min(100, Number(value) || 0));
  const [shown, setShown] = useState(target);
  const mounted = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(target);
      return undefined;
    }
    // Start from 0 only on the very first render; later value changes tween
    // from wherever the ring already is.
    if (!mounted.current) {
      mounted.current = true;
      setShown(0);
      const raf = requestAnimationFrame(() => setShown(target));
      return () => cancelAnimationFrame(raf);
    }
    setShown(target);
    return undefined;
  }, [target]);

  const stroke = ACCENTS[accent] ?? ACCENTS.cyan;
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - shown / 100);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `${Math.round(target)} percent`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          className="text-steel/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <span className="absolute text-xs font-semibold tabular-nums text-paper">
        {Math.round(target)}%
      </span>
    </div>
  );
}
