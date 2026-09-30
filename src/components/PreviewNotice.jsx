import { Link } from "react-router-dom";
import { PRODUCT } from "../brand";

/**
 * Persistent, unmissable notice that the projects and material requests on
 * screen are illustrative.
 *
 * A supplier who mistakes a sample request for real demand loses real hours
 * pricing a package nobody will buy, so this is deliberately a full-width
 * banner rather than a subtle chip. Remove it only when the feed is live.
 */
export default function PreviewNotice({ title = "Preview: sample material requests", children, className = "" }) {
  return (
    <div
      role="note"
      className={`flex gap-3 rounded-2xl border border-accent/30 bg-accent-soft px-5 py-4 ${className}`}
    >
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/50 text-xs font-bold text-accent"
        aria-hidden="true"
      >
        !
      </span>
      <div>
        <p className="text-sm font-semibold text-accent">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-fg">
          {children ?? (
            <>
              These projects and material packages are illustrative examples of how demand appears
              on {PRODUCT}. They are <strong className="font-semibold">not live requests for quote</strong>,
              cannot be quoted or ordered, and the buyers shown are placeholders, not real companies.
              Live requests open to early users first.{" "}
              <Link to="/register" className="font-semibold text-brand underline hover:text-brand-hover">
                Request access
              </Link>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
