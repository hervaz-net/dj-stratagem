import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconMegaphone } from "./icons";
import { hideMarketingChrome } from "../chrome/formRoutes";

/** Small persistent shortcut to start buying. Icon-only on phones. */
export default function FloatingDemo() {
  const [visible, setVisible] = useState(false);
  const { pathname } = useLocation();
  const hide = hideMarketingChrome(pathname);

  useEffect(() => {
    if (hide) {
      setVisible(false);
      return undefined;
    }
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, [hide]);

  if (hide) return null;

  return (
    <div
      className={`no-print fixed bottom-32 right-4 z-[90] transition-[opacity,transform] duration-200 sm:right-6 [[data-cookie-banner="1"]_&]:invisible [[data-cookie-banner="1"]_&]:pointer-events-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <Link
        to="/register"
        aria-label="Post a request"
        tabIndex={visible ? undefined : -1}
        className="flex h-11 items-center gap-2 rounded-full bg-brand px-3.5 text-sm font-semibold text-white shadow-[var(--shadow-pop)] transition-colors hover:bg-brand-hover sm:px-4"
      >
        <IconMegaphone width={17} height={17} aria-hidden="true" />
        <span className="hidden sm:inline">Post a request</span>
      </Link>
    </div>
  );
}
