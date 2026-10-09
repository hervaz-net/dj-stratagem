import { Link } from "react-router-dom";
import { IconArrowRight } from "../icons";

/** A whole-card link: icon, title, short text, and an onward arrow. */
export default function LinkCard({ to, icon, title, children, cta = "Explore", className = "" }) {
  return (
    <Link
      to={to}
      className={`card-corp card-corp-hover group flex h-full flex-col p-5 no-underline ${className}`}
    >
      {icon && (
        <div className="mb-4 flex h-9 w-9 items-center justify-center bg-amber/10 text-amber">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-paper">{title}</h3>
      <p className="mb-0 mt-1.5 text-sm leading-relaxed text-steel">{children}</p>
      <span className="mt-auto inline-flex items-center pt-4 gap-1.5 text-sm font-semibold text-amber">
        {cta} <IconArrowRight width={14} height={14} />
      </span>
    </Link>
  );
}
