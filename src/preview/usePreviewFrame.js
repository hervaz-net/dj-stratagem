import { useEffect } from "react";

/** Match the browser chrome to the concept, and stop smooth scrolling when motion is reduced. */
export default function usePreviewFrame(scheme, color) {
  useEffect(() => {
    const html = document.documentElement;
    const prevScheme = html.style.colorScheme;
    const prevScroll = html.style.scrollBehavior;
    const meta = document.querySelector('meta[name="theme-color"]');
    const prevColor = meta?.getAttribute("content") ?? null;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      html.style.colorScheme = scheme;
      html.style.scrollBehavior = motion.matches ? "auto" : prevScroll;
      if (meta && color) meta.setAttribute("content", color);
    };
    apply();
    motion.addEventListener("change", apply);
    return () => {
      motion.removeEventListener("change", apply);
      html.style.colorScheme = prevScheme;
      html.style.scrollBehavior = prevScroll;
      if (meta && prevColor) meta.setAttribute("content", prevColor);
    };
  }, [scheme, color]);
}
