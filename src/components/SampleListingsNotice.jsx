/** Shown wherever sampleProjects is rendered. PROOF.md: these are not solicitations. */
export default function SampleListingsNotice({ className = "" }) {
  return (
    <p className={`text-sm leading-relaxed text-steel ${className}`} role="note">
      Illustrative listings, not live solicitations. Dates and fit scores are samples.
      They cannot be bid or quoted. A real project feed opens as members come on board.
    </p>
  );
}
