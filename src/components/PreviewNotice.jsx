import { Link } from "react-router-dom";

/**
 * Persistent, unmissable notice that the projects on screen are illustrative.
 *
 * A contractor who mistakes a sample listing for a real solicitation loses real
 * hours chasing a bid that does not exist, so this is deliberately a full-width
 * banner rather than a subtle chip. Remove it only when the feed is live.
 */
export default function PreviewNotice({ className = "" }) {
  return (
    <div
      role="note"
      className={`rounded-2xl border border-accent/30 bg-accent-soft px-5 py-4 ${className}`}
    >
      <p className="text-sm font-semibold text-accent">Preview &mdash; sample listings</p>
      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
        These projects are illustrative examples showing how opportunities appear on the
        platform. They are <strong className="font-semibold text-fg">not live solicitations</strong> and
        cannot be bid on. The real project feed opens to early users first &mdash;{" "}
        <Link to="/register" className="font-medium text-brand underline hover:text-brand-hover">
          request access
        </Link>
        .
      </p>
    </div>
  );
}
