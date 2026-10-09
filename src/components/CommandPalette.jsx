import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { PAGES } from "../lib/siteMap";

const DASHBOARD_ITEMS = [
  { label: "Overview", to: "/dashboard/overview", group: "Dashboard" },
  { label: "Suppliers", to: "/dashboard/suppliers", group: "Dashboard" },
  { label: "Bids", to: "/dashboard/bids", group: "Dashboard" },
  { label: "Orders", to: "/dashboard/orders", group: "Dashboard" },
  { label: "Analytics", to: "/dashboard/analytics", group: "Dashboard" },
  { label: "Alerts", to: "/dashboard/alerts", group: "Dashboard" },
  { label: "Settings", to: "/dashboard/settings", group: "Dashboard" },
  { label: "Accounts", to: "/dashboard/admin", group: "Dashboard", adminOnly: true },
];

// Marketing entries come from the shared site map so the palette can never
// drift out of sync with the navbar and footer.
const NAV_ITEMS = [
  ...DASHBOARD_ITEMS,
  { label: "Home", to: "/", group: "Site" },
  ...PAGES.map((p) => ({ label: p.label, to: p.to, group: "Site", hint: p.desc })),
  { label: "Privacy Policy", to: "/privacy", group: "Site" },
  { label: "Terms & Conditions", to: "/terms", group: "Site" },
  { label: "Sign in", to: "/login", group: "Account" },
  { label: "Register", to: "/register", group: "Account" },
];

function score(item, q) {
  const label = item.label.toLowerCase();
  const query = q.toLowerCase();
  if (label.startsWith(query)) return 2;
  if (label.includes(query)) return 1;
  if (item.hint && item.hint.toLowerCase().includes(query)) return 0.5;
  return 0;
}

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const catalog = useMemo(() => {
    const signedIn = Boolean(user);
    return NAV_ITEMS.filter((i) => {
      if (i.group === "Dashboard" && !signedIn) return false;
      if (i.adminOnly && user?.role !== "admin") return false;
      return true;
    });
  }, [user]);

  const results = query.trim()
    ? catalog.filter((i) => score(i, query) > 0).sort((a, b) => score(b, query) - score(a, query))
    : catalog;

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setCursor(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 10);
    const onDocKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onDocKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onDocKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => { setCursor(0); }, [query]);

  const go = (item) => {
    navigate(item.to);
    onClose();
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") { if (results[cursor]) go(results[cursor]); }
    else if (e.key === "Escape") onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center bg-black/40 px-4 pt-[15vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-lg overflow-hidden border border-line-2 bg-ink-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-steel" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Go to…"
            className="flex-1 bg-transparent text-sm text-paper outline-none placeholder:text-steel/60"
            aria-label="Search pages"
            aria-autocomplete="list"
            role="combobox"
            aria-expanded="true"
          />
          <kbd className="border border-line px-1.5 py-0.5 text-[10px] text-steel">Esc</kbd>
        </div>
        <ul role="listbox" className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-steel">No results</li>
          )}
          {results.map((item, i) => (
            <li key={item.to} role="option" aria-selected={i === cursor}>
              <button
                type="button"
                onClick={() => go(item)}
                onMouseEnter={() => setCursor(i)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  i === cursor ? "bg-amber/10 text-amber" : "text-paper hover:bg-ink-3"
                }`}
              >
                <span className="flex-1">
                  {item.label}
                  {item.hint && <span className="ml-2 hidden text-xs text-steel sm:inline">{item.hint}</span>}
                </span>
                <span className="text-xs text-steel">{item.group}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-2 text-[10px] text-steel/60 flex gap-4">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> go</span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
