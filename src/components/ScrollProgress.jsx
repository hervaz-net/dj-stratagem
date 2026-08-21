import { useEffect, useState } from "react";

/** Thin brand-orange bar along the bottom of the header showing read depth. */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? Math.min(1, doc.scrollTop / scrollable) : 0);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden" aria-hidden="true">
      <div
        className="h-full origin-left bg-gradient-to-r from-brand to-cta"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
