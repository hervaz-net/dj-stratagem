import { useEffect, useState } from "react";

const STORAGE_KEY = "djs-theme";
const THEME_EVENT = "djs-theme-change";

function readStoredTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredTheme(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* private mode / blocked storage */
  }
}

function readTheme() {
  if (typeof window === "undefined") return "light";
  const stored = readStoredTheme();
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Shared so the dashboard sidebar label and every toggle stay on one store. */
export function useThemeMode() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Navbar / dashboard mount this more than once. Without the event, toggling
  // one control leaves the others (and the sidebar "Dark mode" label) stale.
  useEffect(() => {
    const sync = () => setTheme(readTheme());
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  // Follow the OS until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      if (!readStoredTheme()) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const chooseTheme = (next) => {
    writeStoredTheme(next);
    setTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return { theme, chooseTheme };
}

export default function ThemeToggle({ className = "" }) {
  const { theme, chooseTheme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => chooseTheme(isDark ? "light" : "dark")}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-line bg-ink-2 text-steel transition-colors hover:border-amber/50 hover:text-amber ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
