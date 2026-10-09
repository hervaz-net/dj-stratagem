import { useId } from "react";

const ACCENTS = {
  blue: "var(--viz-blue)",
  cyan: "var(--viz-cyan)",
  red: "var(--viz-red)",
  gold: "var(--viz-gold)",
  green: "var(--viz-green)",
};

/**
 * Compact trend line with a soft area fill and a dot on the latest point.
 *
 * Decorative by default: the numbers it illustrates are always printed next
 * to it, so the SVG is aria-hidden rather than duplicating them for screen
 * readers. Pass `label` when the line is the only representation.
 */
export default function Sparkline({
  data = [],
  accent = "blue",
  width = 132,
  height = 40,
  strokeWidth = 1.75,
  label,
  className = "",
}) {
  const gradientId = useId();
  const stroke = ACCENTS[accent] ?? ACCENTS.blue;

  // A labelled sparkline must keep its accessible name even with no line to
  // draw, otherwise the reading disappears entirely for screen readers.
  if (data.length < 2) {
    return (
      <div
        className={className}
        style={{ width, height }}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : "true"}
      />
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = strokeWidth;
  const innerH = height - pad * 2;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = pad + innerH - ((v - min) / span) * innerH;
    return [x, y];
  });

  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={`overflow-visible ${className}`}
      preserveAspectRatio="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.32" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={2.6} fill={stroke} />
      <circle cx={lastX} cy={lastY} r={5} fill={stroke} opacity="0.25" />
    </svg>
  );
}
