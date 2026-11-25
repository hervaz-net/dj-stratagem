import { PRODUCT } from "../brand";
import SubagentMark from "../../shared/SubagentMark";

/** Exchange's mark is its subagent logo, shared with the rest of the site. */
export function LogoMark({ size = 28, className = "" }) {
  return <SubagentMark id="exchange" size={size} className={className} />;
}

export default function Logo({ className = "", compact = false }) {
  const [first, ...rest] = PRODUCT.split(" ");
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-bold tracking-tight text-fg">
            {first} <span className="font-semibold text-brand">{rest.join(" ")}</span>
          </span>
        </span>
      )}
    </span>
  );
}
