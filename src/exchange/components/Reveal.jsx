import { useEffect, useRef } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fades and lifts children into view once, when they first cross the
 * viewport. The `data-reveal` attribute is applied from JS rather than
 * rendered into the markup, so if JS never runs the content is still
 * visible instead of stuck at opacity 0.
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    el.dataset.reveal = "";
    el.style.animationDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.reveal = "in";
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(el);

    // Safety net: content must never stay invisible. If the observer hasn't
    // fired by now (odd viewport, zoom, print, a browser quirk), show it.
    const failsafe = window.setTimeout(() => {
      if (el.dataset.reveal !== "in") el.dataset.reveal = "in";
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
