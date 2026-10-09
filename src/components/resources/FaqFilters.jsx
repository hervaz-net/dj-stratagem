/** Category filter: wrapping chips on small screens, a sticky list on large. */
export default function FaqFilters({ categories, active, counts, total, onChange }) {
  const items = [{ name: "All", value: null, count: total }, ...categories.map((c) => ({ name: c, value: c, count: counts[c] ?? 0 }))];

  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
      {items.map((it) => {
        const on = active === it.value;
        return (
          <button
            key={it.name}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(it.value)}
            className={`flex items-center justify-between gap-3 border px-3 py-2 text-left text-sm font-medium transition-colors lg:w-full ${
              on
                ? "border-paper-2 bg-paper-2 text-ink-2"
                : "border-line-2 bg-ink-2 text-paper hover:border-amber hover:text-amber"
            }`}
          >
            <span>{it.name}</span>
            <span className={`text-xs tabular-nums ${on ? "text-ink-2" : "text-steel"}`}>{it.count}</span>
          </button>
        );
      })}
    </div>
  );
}
