import { useEffect } from "react";
import { IconX, IconKeyboard } from "../icons";

const shortcuts = [
  { keys: ["/"], desc: "Focus search" },
  { keys: ["Esc"], desc: "Clear search / close panel" },
  { keys: ["R"], desc: "Refresh data" },
  { keys: ["?"], desc: "Open this shortcuts panel" },
];

export default function ShortcutsModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-bid-navy/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        className="animate-menu-in fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-pop)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IconKeyboard width={18} height={18} className="text-brand" />
            <h2 className="text-base font-semibold text-fg">Keyboard shortcuts</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts panel"
            className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted hover:bg-subtle hover:text-fg"
          >
            <IconX width={18} height={18} />
          </button>
        </div>

        <dl className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.desc} className="flex items-center justify-between gap-4">
              <dt className="text-sm text-fg-muted">{s.desc}</dt>
              <dd className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex items-center rounded-lg border border-line bg-subtle px-2 py-0.5 text-xs font-mono font-semibold text-fg"
                  >
                    {k}
                  </kbd>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
