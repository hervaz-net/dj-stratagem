import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconSearch } from "../icons";

const POPULAR = ["THHN wire", "Rebar", "Wedge anchors", "PVC fittings", "Drywall"];

/** Search-style entry into the marketplace. Sends the query as `?q=`. */
export default function HeroSearch({ className = "" }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/marketplace?q=${encodeURIComponent(term)}` : "/marketplace");
  };

  return (
    <div className={className}>
      <form role="search" onSubmit={onSubmit} className="flex w-full max-w-xl items-center gap-2 rounded-full border border-line bg-surface p-1.5 shadow-[var(--shadow-card)] focus-within:border-brand">
        <label htmlFor="hero-search" className="sr-only">
          Search materials, tools, and suppliers
        </label>
        <span className="pl-3 text-fg-muted" aria-hidden="true">
          <IconSearch width={18} height={18} />
        </span>
        <input
          id="hero-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search materials, tools, suppliers"
          className="h-10 min-w-0 flex-1 bg-transparent text-[0.95rem] text-fg outline-hidden placeholder:text-fg-muted"
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-full bg-fg px-4 text-sm font-semibold text-canvas transition-opacity hover:opacity-90"
        >
          Search
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-fg-muted">Popular:</span>
        {POPULAR.map((term) => (
          <Link
            key={term}
            to={`/marketplace?q=${encodeURIComponent(term)}`}
            className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}
