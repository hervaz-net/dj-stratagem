import { useId } from "react";

/*
 * Original side-profile illustrations of the Fleet lineup, drawn in SVG.
 * One shape per body type, tuned per model (cab, bed, roof, length, hood,
 * wheel arches) so each card shows its own vehicle. Deliberately no brand
 * logos or signature grilles: these depict the class, not a manufacturer's
 * artwork. Light studio look: white paint on a pale floor with a soft shadow.
 */

const PAINT = "#fbfbf9";
const EDGE = "#c3c7c2";
const GLASS = "#39414a";
const TRIM = "#2b2f33";
const GROUND = 178;

/** Crop per body type so every vehicle fills its frame. */
const VIEW = { pickup: "6 36 412 154", van: "10 16 400 174", suv: "8 38 404 152" };

const SPEC = {
  silverado: { type: "pickup", cab: "crew", bed: 118, hood: 100, arch: "square", grille: 34, lift: 0 },
  superduty: { type: "pickup", cab: "crew", bed: 140, hood: 104, arch: "round", grille: 38, lift: 2 },
  ram: { type: "pickup", cab: "crew", bed: 112, hood: 98, arch: "round", grille: 32, lift: 5 },
  sprinter: { type: "van", roof: 26, nose: "sloped" },
  transit: { type: "van", roof: 30, nose: "upright" },
  suburban: { type: "suv", length: 372, lux: false },
  escalade: { type: "suv", length: 380, lux: true },
};

function Wheel({ cx, r = 25, lux = false, ids }) {
  const cy = GROUND - r;
  const spokes = lux ? 10 : 6;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#1b1d1f" />
      <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke="#2c3034" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill={`url(#${ids.rim})`} stroke="#9aa0a6" strokeWidth="1" />
      {Array.from({ length: spokes }, (_, i) => {
        const a = (i / spokes) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r * 0.18}
            y1={cy + Math.sin(a) * r * 0.18}
            x2={cx + Math.cos(a) * r * 0.58}
            y2={cy + Math.sin(a) * r * 0.58}
            stroke="#7d848b"
            strokeWidth={lux ? 1.6 : 2.6}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.15} fill="#5d646b" />
    </g>
  );
}

/** Dark wheel-well opening above the rocker. */
function Arch({ cx, bottom, r = 27, shape = "round" }) {
  const w = r + 6;
  const top = GROUND - r - w + 2;
  if (shape === "square") {
    return (
      <path
        stroke="#d9dcd8"
        strokeWidth="3"
        d={`M${cx - w},${bottom} L${cx - w},${top + 12} Q${cx - w},${top} ${cx - w + 12},${top} L${cx + w - 12},${top} Q${cx + w},${top} ${cx + w},${top + 12} L${cx + w},${bottom} Z`}
        fill={TRIM}
      />
    );
  }
  return (
    <g>
      <path d={`M${cx - w - 4},${bottom} A${w + 4},${w + 4} 0 0 1 ${cx + w + 4},${bottom}`} fill="none" stroke="#d9dcd8" strokeWidth="4" />
      <path d={`M${cx - w},${bottom} A${w},${w} 0 0 1 ${cx + w},${bottom} Z`} fill={TRIM} />
    </g>
  );
}

/** Bumper block; `chrome` for luxury trims. */
function Bumper({ x, y, w, h, chrome = false }) {
  return <rect x={x} y={y} width={w} height={h} rx="3" fill={chrome ? "#cdd2d7" : "#3a3f44"} stroke={chrome ? "#9aa1a8" : "none"} strokeWidth="0.8" />;
}

/** Soft horizontal reflection along the body side. */
function Highlight({ x0, x1, y }) {
  return <line x1={x0} y1={y} x2={x1} y2={y} stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.85" />;
}

/** Grille with horizontal bars at the nose. */
function Grille({ x, y, w, h }) {
  const bars = Math.max(2, Math.floor(h / 6));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={TRIM} />
      {Array.from({ length: bars }, (_, i) => (
        <line key={i} x1={x + 1.5} x2={x + w - 1} y1={y + 4 + i * ((h - 6) / bars)} y2={y + 4 + i * ((h - 6) / bars)} stroke="#6b7278" strokeWidth="1.2" />
      ))}
    </g>
  );
}

function Shadow({ x0, x1, ids }) {
  return <ellipse cx={(x0 + x1) / 2} cy={GROUND + 3} rx={(x1 - x0) / 2 + 10} ry="7" fill="#000" opacity="0.13" filter={`url(#${ids.blur})`} />;
}

function Pickup({ s, ids }) {
  const x0 = 24;
  const cabLen = s.cab === "crew" ? 132 : 108;
  const cabStart = x0 + s.bed;
  const cabEnd = cabStart + cabLen;
  const x1 = cabEnd + s.hood;
  const bottom = 148 - s.lift;
  const belt = 98 - s.lift;
  const roof = 50 - s.lift;
  const hoodY = belt - 8;
  const wsTop = cabEnd - 40;
  const rearCx = x0 + s.bed * 0.56;
  const frontCx = x1 - 54;
  const winTop = roof + 8;
  const winBot = belt - 5;
  const split = cabStart + cabLen * 0.5;
  return (
    <g>
      <Shadow x0={x0} x1={x1} ids={ids} />
      {/* body */}
      <path
        d={`M${x0},${belt} L${cabStart},${belt} L${cabStart},${roof + 7} Q${cabStart},${roof} ${cabStart + 7},${roof}
            L${wsTop},${roof} Q${wsTop + 5},${roof} ${wsTop + 8},${roof + 4} L${cabEnd},${hoodY}
            L${x1 - 8},${hoodY + 2} Q${x1},${hoodY + 3} ${x1},${hoodY + 12} L${x1},${bottom - 6}
            Q${x1},${bottom} ${x1 - 6},${bottom} L${x0 + 4},${bottom} Q${x0},${bottom} ${x0},${bottom - 4} Z`}
        fill={`url(#${ids.paint})`}
        stroke={EDGE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* bed rail, tailgate, character line, rocker */}
      <line x1={x0 + 3} y1={belt + 3} x2={cabStart - 3} y2={belt + 3} stroke={EDGE} strokeWidth="1.2" />
      <line x1={x0 + 6} y1={belt + 3} x2={x0 + 6} y2={bottom - 3} stroke={EDGE} strokeWidth="1" />
      <line x1={x0 + 8} y1={belt + 20} x2={x1 - 10} y2={hoodY + 22} stroke="#dfe2de" strokeWidth="1.5" />
      <rect x={x0 + 2} y={bottom - 12} width={x1 - x0 - 4} height="10" rx="3" fill="#e9ebe8" />
      <Highlight x0={x0 + 10} x1={x1 - 14} y={belt + 11} />
      <line x1={cabEnd + 4} y1={hoodY + 3} x2={x1 - 14} y2={hoodY + 4} stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      {/* glass */}
      <path d={`M${cabStart + 9},${winTop} L${split - 4},${winTop} L${split - 4},${winBot} L${cabStart + 9},${winBot} Z`} fill={GLASS} />
      <path d={`M${split + 3},${winTop} L${wsTop + 2},${winTop} L${cabEnd - 8},${winBot} L${split + 3},${winBot} Z`} fill={GLASS} />
      <path d={`M${split + 6},${winTop + 2} L${split + 26},${winTop + 2} L${split + 10},${winBot - 2} Z`} fill="#fff" opacity="0.12" />
      {/* doors, handles, mirror */}
      <line x1={split} y1={roof + 2} x2={split} y2={bottom - 12} stroke={EDGE} strokeWidth="1.1" />
      <line x1={cabStart + 3} y1={belt} x2={cabStart + 3} y2={bottom - 12} stroke={EDGE} strokeWidth="1.1" />
      <rect x={split - 22} y={belt + 6} width="12" height="3" rx="1.5" fill="#b7bbb6" />
      <rect x={cabEnd - 34} y={belt + 6} width="12" height="3" rx="1.5" fill="#b7bbb6" />
      <path d={`M${cabEnd - 14},${winBot - 2} l10,-2 l2,9 l-10,2 Z`} fill={TRIM} />
      {/* grille, lamps */}
      <Grille x={x1 - 10} y={hoodY + 5} w={10} h={s.grille} />
      <rect x={x1 - 7} y={hoodY + 5} width="7" height="7" rx="2" fill="#e8eef5" stroke="#9fb0c2" strokeWidth="0.8" />
      <rect x={x0 - 1} y={belt + 6} width="5" height="20" rx="1.5" fill="#c43b2f" />
      <Bumper x={x1 - 3} y={bottom - 22} w={10} h={18} />
      <Bumper x={x0 - 7} y={bottom - 18} w={10} h={14} />
      <rect x={cabStart + 8} y={bottom - 3} width={cabLen - 14} height="5" rx="2" fill={TRIM} />
      <Arch cx={rearCx} bottom={bottom} shape={s.arch} />
      <Arch cx={frontCx} bottom={bottom} shape={s.arch} />
      <Wheel cx={rearCx} r={27} ids={ids} />
      <Wheel cx={frontCx} r={27} ids={ids} />
    </g>
  );
}

function Van({ s, ids }) {
  const x0 = 26;
  const x1 = 396;
  const bottom = 152;
  const roof = s.roof;
  const belt = 104;
  const wsTop = x1 - (s.nose === "sloped" ? 100 : 86);
  const hoodBack = x1 - (s.nose === "sloped" ? 46 : 40);
  const hoodY = s.nose === "sloped" ? 112 : 106;
  const rearCx = x0 + 82;
  const frontCx = x1 - 62;
  return (
    <g>
      <Shadow x0={x0} x1={x1} ids={ids} />
      <path
        d={`M${x0},${bottom - 4} L${x0},${roof + 10} Q${x0},${roof} ${x0 + 10},${roof} L${wsTop},${roof}
            Q${wsTop + 10},${roof} ${wsTop + 16},${roof + 10} L${hoodBack},${hoodY - 4}
            Q${hoodBack + 4},${hoodY} ${hoodBack + 12},${hoodY} L${x1 - 6},${hoodY + 4} Q${x1},${hoodY + 6} ${x1},${hoodY + 14}
            L${x1},${bottom - 6} Q${x1},${bottom} ${x1 - 6},${bottom} L${x0 + 4},${bottom} Z`}
        fill={`url(#${ids.paint})`}
        stroke={EDGE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* cab door glass only: cargo body */}
      <path d={`M${wsTop - 46},${roof + 14} L${wsTop + 10},${roof + 14} L${hoodBack - 6},${belt - 4} L${wsTop - 46},${belt - 4} Z`} fill={GLASS} />
      <path d={`M${wsTop - 40},${roof + 16} L${wsTop - 22},${roof + 16} L${wsTop - 34},${belt - 8} Z`} fill="#fff" opacity="0.12" />
      {/* sliding door and cab door seams, rub strip */}
      <line x1={wsTop - 52} y1={roof + 6} x2={wsTop - 52} y2={bottom - 12} stroke={EDGE} strokeWidth="1.1" />
      <line x1={wsTop - 150} y1={roof + 10} x2={wsTop - 150} y2={bottom - 12} stroke={EDGE} strokeWidth="1.1" />
      <rect x={x0 + 2} y={bottom - 30} width={x1 - x0 - 4} height="7" rx="2" fill="#e4e6e3" />
      <rect x={x0 + 2} y={bottom - 12} width={x1 - x0 - 4} height="10" rx="3" fill="#e9ebe8" />
      <Highlight x0={x0 + 10} x1={x1 - 14} y={belt + 6} />
      <Bumper x={x1 - 3} y={bottom - 20} w={9} h={16} />
      <Bumper x={x0 - 6} y={bottom - 16} w={9} h={12} />
      <rect x={wsTop - 72} y={belt + 6} width="12" height="3" rx="1.5" fill="#b7bbb6" />
      <path d={`M${hoodBack - 14},${belt - 6} l10,-2 l2,9 l-10,2 Z`} fill={TRIM} />
      {/* lamps */}
      <rect x={x1 - 8} y={hoodY + 4} width="8" height="9" rx="2" fill="#e8eef5" stroke="#9fb0c2" strokeWidth="0.8" />
      <Grille x={x1 - 8} y={hoodY + 15} w={8} h={18} />
      <rect x={x0 - 1} y={roof + 60} width="5" height="34" rx="1.5" fill="#c43b2f" />
      <Arch cx={rearCx} bottom={bottom} />
      <Arch cx={frontCx} bottom={bottom} />
      <Wheel cx={rearCx} r={24} ids={ids} />
      <Wheel cx={frontCx} r={24} ids={ids} />
    </g>
  );
}

function Suv({ s, ids }) {
  const x1 = 400;
  const x0 = x1 - s.length;
  const bottom = 150;
  const roof = 52;
  const belt = 100;
  const wsBase = x1 - 98;
  const wsTop = wsBase - 40;
  const hoodY = 94;
  const rearCx = x0 + 72;
  const frontCx = x1 - 60;
  const pillars = [x0 + 30, x0 + (wsTop - x0) * 0.38, x0 + (wsTop - x0) * 0.7];
  return (
    <g>
      <Shadow x0={x0} x1={x1} ids={ids} />
      <path
        d={`M${x0 + 2},${bottom - 4} L${x0 + 4},${roof + 14} Q${x0 + 6},${roof} ${x0 + 18},${roof}
            L${wsTop},${roof} Q${wsTop + 6},${roof} ${wsTop + 10},${roof + 5} L${wsBase},${hoodY - 2}
            L${x1 - 8},${hoodY + 2} Q${x1},${hoodY + 3} ${x1},${hoodY + 12} L${x1},${bottom - 6}
            Q${x1},${bottom} ${x1 - 6},${bottom} L${x0 + 6},${bottom} Z`}
        fill={`url(#${ids.paint})`}
        stroke={EDGE}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* daylight opening split by pillars */}
      <path d={`M${x0 + 12},${roof + 8} L${wsTop + 2},${roof + 8} L${wsBase - 8},${belt - 5} L${x0 + 10},${belt - 5} Z`} fill={GLASS} />
      {pillars.map((x) => (
        <rect key={x} x={x} y={roof + 6} width="6" height={belt - roof - 9} fill={s.lux ? "#20252a" : PAINT} />
      ))}
      {s.lux && <rect x={x0 + 10} y={belt - 5} width={wsBase - x0 - 18} height="2.5" fill="#cfd5db" />}
      <path d={`M${pillars[2] + 14},${roof + 10} L${pillars[2] + 32},${roof + 10} L${pillars[2] + 18},${belt - 8} Z`} fill="#fff" opacity="0.12" />
      {/* doors, character line, rocker, mirror */}
      {pillars.slice(1).map((x) => (
        <line key={x} x1={x + 3} y1={belt} x2={x + 3} y2={bottom - 12} stroke={EDGE} strokeWidth="1.1" />
      ))}
      <line x1={x0 + 8} y1={belt + 18} x2={x1 - 10} y2={hoodY + 20} stroke="#dfe2de" strokeWidth="1.5" />
      <rect x={x0 + 4} y={bottom - 12} width={x1 - x0 - 8} height="10" rx="3" fill={s.lux ? "#d9dde1" : "#e9ebe8"} />
      <Highlight x0={x0 + 12} x1={x1 - 14} y={belt + 10} />
      {/* roof rails */}
      <rect x={x0 + 26} y={roof - 5} width={wsTop - x0 - 40} height="3.5" rx="1.5" fill={s.lux ? "#bfc6cc" : TRIM} />
      <rect x={x0 + 30} y={roof - 3} width="6" height="4" fill={TRIM} />
      <rect x={wsTop - 22} y={roof - 3} width="6" height="4" fill={TRIM} />
      <Bumper x={x1 - 3} y={bottom - 20} w={9} h={16} chrome={s.lux} />
      <Bumper x={x0 - 4} y={bottom - 16} w={9} h={12} chrome={s.lux} />
      <rect x={pillars[1] - 10} y={bottom - 3} width={wsBase - pillars[1] - 4} height="5" rx="2" fill={s.lux ? "#9aa1a8" : TRIM} />
      <path d={`M${wsBase - 12},${belt - 7} l10,-2 l2,9 l-10,2 Z`} fill={TRIM} />
      {/* lamps */}
      {s.lux ? (
        <>
          <Grille x={x1 - 8} y={hoodY + 6} w={8} h={34} />
          <rect x={x1 - 3} y={hoodY + 2} width="3" height="36" rx="1.5" fill="#e8eef5" stroke="#9fb0c2" strokeWidth="0.8" />
          <rect x={x0} y={roof + 12} width="5" height="54" rx="2" fill="#c43b2f" />
        </>
      ) : (
        <>
          <rect x={x1 - 8} y={hoodY + 4} width="8" height="9" rx="2" fill="#e8eef5" stroke="#9fb0c2" strokeWidth="0.8" />
          <Grille x={x1 - 8} y={hoodY + 15} w={8} h={20} />
          <rect x={x0 + 1} y={belt - 2} width="5" height="22" rx="1.5" fill="#c43b2f" />
        </>
      )}
      <Arch cx={rearCx} bottom={bottom} />
      <Arch cx={frontCx} bottom={bottom} />
      <Wheel cx={rearCx} r={26} lux={s.lux} ids={ids} />
      <Wheel cx={frontCx} r={26} lux={s.lux} ids={ids} />
    </g>
  );
}

/** `id` is a lineup model key, e.g. "ram". `title` labels the image for screen readers. */
export default function VehicleArt({ id, title, className = "" }) {
  const u = useId().replace(/:/g, "");
  const s = SPEC[id];
  if (!s) return null;
  const Body = s.type === "pickup" ? Pickup : s.type === "van" ? Van : Suv;
  const ids = { paint: `va-paint-${u}`, rim: `va-rim-${u}`, blur: `va-blur-${u}` };
  return (
    <svg viewBox={VIEW[s.type]} className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={ids.paint} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor={PAINT} />
          <stop offset="1" stopColor="#e6e8e5" />
        </linearGradient>
        <radialGradient id={ids.rim} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#eef0f2" />
          <stop offset="1" stopColor="#a8aeb4" />
        </radialGradient>
        <filter id={ids.blur} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <Body s={s} ids={ids} />
    </svg>
  );
}

