import { IconSearch, IconX } from "../icons";

/**
 * Big help-center search field. Controlled by the page so the FAQ list below
 * filters as you type; Enter jumps to the results. The live result count sits
 * under the field as a polite status message.
 */
export default function ResourceSearch({ value, onChange, resultLabel, suggestions = [] }) {
  const jump = (e) => {
    e.preventDefault();
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full max-w-2xl">
      <form role="search" onSubmit={jump}>
        <label htmlFor="help-search" className="sr-only">
          Search the help center
        </label>
        <div className="relative">
          <IconSearch
            width={22}
            height={22}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-fg-muted"
            aria-hidden="true"
          />
          <input
            id="help-search"
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search the help center"
            autoComplete="off"
            spellCheck="false"
            enterKeyHint="search"
            className="glass block h-16 w-full rounded-2xl! border! border-line! py-0 pl-14 pr-14 text-base text-fg placeholder:text-fg-muted/70 focus:border-brand! [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg"
            >
              <IconX width={16} height={16} />
            </button>
          )}
        </div>
      </form>

      {suggestions.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mono-label text-fg-muted">Popular</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-fg transition-colors hover:border-brand hover:text-brand"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <p className="mt-4 text-sm text-fg-muted" role="status" aria-live="polite">
        {resultLabel}
      </p>
    </div>
  );
}
