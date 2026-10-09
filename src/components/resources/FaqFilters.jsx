/** Category chips with live counts. A wrapping row; each chip is a toggle button. */
export default function FaqFilters({ categories, active, counts, total, onChange }) {
  const items = [
    { name: "All", value: null, count: total },
    ...categories.map((c) => ({ name: c, value: c, count: counts[c] ?? 0 })),
  ];

  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
      {items.map((it) => {
        const on = active === it.value;
        const empty = it.count === 0 && !on;
        return (
          <button
            key={it.name}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(it.value)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              on
                ? "border-cta bg-cta text-white"
                : empty
                  ? "border-line bg-ink-2 text-steel/70 hover:text-paper"
                  : "border-line bg-ink-2 text-paper hover:border-brand hover:text-brand"
            }`}
          >
            <span>{it.name}</span>
            <span
              className={`min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums ${
                on ? "bg-white/20 text-white" : "bg-line/60 text-steel"
              }`}
            >
              {it.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
