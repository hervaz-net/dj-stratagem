import { useEffect, useRef } from "react";

// Contour lines: gentle stacked sine waves, computed once.
const W = 1600;
const H = 1000;
const LINES = Array.from({ length: 14 }, (_, i) => {
  const base = 60 + i * 66;
  const amp = 26 + (i % 4) * 14;
  const freq = 1.2 + (i % 3) * 0.45;
  const phase = i * 0.8;
  let d = "";
  for (let x = 0; x <= W; x += 40) {
    const y = base + Math.sin((x / W) * Math.PI * 2 * freq + phase) * amp + Math.sin((x / W) * Math.PI * 5 + i) * 8;
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
  }
  return d.trim();
});

/**
 * The living background behind every parent-site page: drifting aurora
 * fields, a slow conic sweep, flowing contour lines that parallax with
 * scroll, a soft spotlight that eases toward the pointer, and film grain.
 * Motion is transform/opacity only (GPU-friendly) and stops entirely for
 * prefers-reduced-motion.
 */
export default function Atmosphere() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight * 0.3;
    let x = tx;
    let y = ty;
    let frame = 0;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      // Ease toward the pointer so the light glides instead of snapping.
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--scroll", `${window.scrollY}`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="atmosphere no-print" aria-hidden="true">
      <div className="aurora-sweep" />
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
      <div className="aurora aurora-4" />
      <svg className="contours" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <g>
          {LINES.map((d, i) => (
            <path key={i} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
      <div className="spotlight" />
      <div className="grain" />
    </div>
  );
}
