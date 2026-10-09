import { IconSearch, IconX } from "../icons";

const SUGGESTIONS = ["Quote", "Password", "Free trial", "Sealed bidding", "Account approval"];

/**
 * Big help-center search field. Controlled by the page so the FAQ list below
 * filters as you type; Enter jumps to the results.
 */
export default function ResourceSearch({ value, onChange, resultLabel }) {
  const jump = (e) => {
    e.preventDefault();
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-2xl">
      <form role="search" onSubmit={jump}>
        <label htmlFor="help-search" className="sr-only">
          Search help articles and FAQs
        </label>
        <div className="relative">
          <IconSearch
            width={20}
            height={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-steel"
            aria-hidden="true"
          />
          <input
            id="help-search"
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search: quote, password, billing, sealed bidding…"
            autoComplete="off"
            spellCheck="false"
            className="!mb-0 !h-14 w-full !pl-12 !pr-12 text-base [&::-webkit-search-cancel-button]:hidden"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-steel hover:text-paper"
            >
              <IconX width={16} height={16} />
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-steel">Popular:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="border border-line-2 bg-ink-2 px-2.5 py-1 text-xs font-medium text-paper hover:border-amber hover:text-amber"
          >
            {s}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-steel" role="status" aria-live="polite">
        {resultLabel}
      </p>
    </div>
  );
}
