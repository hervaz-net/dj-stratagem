/**
 * Renders a stat value. Used to count up from 0 on scroll via
 * IntersectionObserver, but that meant the real number was replaced by a
 * literal "0" until the observer fired — wrong in any screenshot, slow
 * connection, or fast scroll, not just invisible. The surrounding <Reveal>
 * already provides scroll-in motion, so this just shows the number.
 */
export default function StatCounter({ value, prefix = "", suffix = "" }) {
  return (
    <span>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
