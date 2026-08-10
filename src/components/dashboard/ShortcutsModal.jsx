import { useEffect } from "react";
import { IconX, IconKeyboard } from "../icons";

const shortcuts = [
  { keys: ["/"], desc: "Focus search" },
  { keys: ["Esc"], desc: "Clear search / close panel" },
  { keys: ["R"], desc: "Refresh data" },
  { keys: ["?"], desc: "Open this shortcuts panel" },
  { keys: ["↑", "↓"], desc: "Sort column (click header first)" },
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
        className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-ink-2 p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <IconKeyboard width={18} height={18} className="text-amber" />
            <h2 className="text-base font-semibold text-paper">Keyboard shortcuts</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts panel"
            className="rounded-md p-1 text-steel hover:text-paper"
          >
            <IconX width={18} height={18} />
          </button>
        </div>

        <dl className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.desc} className="flex items-center justify-between gap-4">
              <dt className="text-sm text-steel">{s.desc}</dt>
              <dd className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="inline-flex items-center rounded-md border border-line bg-ink px-2 py-0.5 text-xs font-mono font-semibold text-paper"
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
