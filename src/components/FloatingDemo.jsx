import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconCalendar } from "./icons";

export default function FloatingDemo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <Link
        to="/contact"
        className="group relative flex items-center gap-2.5 rounded-full bg-cta hover:bg-cta-hover px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cta/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cta/40"
      >
        {/* Pulsing ring */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <IconCalendar width={15} height={15} />
        Book a demo
      </Link>
    </div>
  );
}
