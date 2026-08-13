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
      className={`rounded-xl border border-amber/40 bg-amber/8 px-5 py-4 ${className}`}
    >
      <p className="text-sm font-semibold text-amber">Preview &mdash; sample listings</p>
      <p className="mt-1 text-sm leading-relaxed text-steel">
        These projects are illustrative examples showing how opportunities appear on the
        platform. They are <strong className="font-semibold text-paper">not live solicitations</strong> and
        cannot be bid on. The real project feed opens to early users first &mdash;{" "}
        <a href="/register" className="font-medium text-amber underline hover:text-amber-2">
          request access
        </a>
        .
      </p>
    </div>
  );
}
