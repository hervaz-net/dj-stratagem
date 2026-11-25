import {
  IconZap,
  IconBulb,
  IconFan,
  IconDroplet,
  IconBrick,
  IconRoof,
  IconRuler,
  IconScrew,
  IconPackage,
} from "../icons";

const ICONS = {
  Electrical: IconZap,
  Lighting: IconBulb,
  HVAC: IconFan,
  Plumbing: IconDroplet,
  "Concrete & rebar": IconBrick,
  Roofing: IconRoof,
  "Lumber & framing": IconRuler,
  "Fasteners & anchors": IconScrew,
};

const SIZES = {
  sm: { box: "h-8 w-8 rounded-lg", icon: 16 },
  md: { box: "h-11 w-11 rounded-xl", icon: 20 },
};

/** Tinted tile with the icon for a material category. */
export default function CategoryIcon({ category, size = "md", className = "" }) {
  const Icon = ICONS[category] ?? IconPackage;
  const s = SIZES[size] ?? SIZES.md;
  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-brand-soft text-brand-fg ${s.box} ${className}`}
      aria-hidden="true"
    >
      <Icon width={s.icon} height={s.icon} />
    </span>
  );
}
