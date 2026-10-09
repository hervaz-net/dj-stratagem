import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import Seo from "../components/Seo";
import { IconArrowRight } from "../components/icons";
import { PAGES } from "../lib/siteMap";

const EXTRA = [
  { to: "/login", label: "Sign in", desc: "Access your account" },
  { to: "/register", label: "Request access", desc: "Accounts are approved by our team" },
];

const ALL = [...PAGES.filter((p) => !p.hidden), ...EXTRA];

export default function NotFound() {
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () => (q ? ALL.filter((p) => `${p.label} ${p.desc ?? ""}`.toLowerCase().includes(q)) : ALL),
    [q],
  );

  return (
    <>
      <Seo title="Page not found" description="The page you're looking for has moved or no longer exists." noindex />

      <Section band="stone" className="pt-12 pb-12 md:pt-16 md:pb-14">
        <Eyebrow>404 &middot; Page not found</Eyebrow>
        <h1 className="text-balance max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-4xl">
          We couldn&rsquo;t find that page.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel">
          The link may be out of date, or the page may have moved. Search the site below, or pick
          back up from the home page.
        </p>

        {pathname && pathname !== "/" && (
          <p className="mt-3 text-sm text-steel">
            Requested: <span className="break-all font-medium text-paper">{pathname}</span>
          </p>
        )}

        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 max-w-xl"
        >
          <label htmlFor="nf-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
            Find a page
          </label>
          <input
            id="nf-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pricing, catalog, projects, contact…"
            className="field-corp"
          />
        </form>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button to="/" variant="primary">
            Back to home
          </Button>
          <Button to="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </Section>

      <Section band="white">
        <Eyebrow>{q ? `${matches.length} ${matches.length === 1 ? "match" : "matches"}` : "Where to go next"}</Eyebrow>
        {matches.length > 0 ? (
          <div className="grid-x grid-margin-x gap-y-4" aria-live="polite">
            {matches.map((p) => (
              <div key={p.to} className="cell small-12 medium-6 large-4">
                <Link to={p.to} className="card-corp card-corp-hover flex h-full items-start justify-between gap-3 p-4">
                  <span>
                    <span className="block text-sm font-semibold text-paper-2">{p.label}</span>
                    {p.desc && <span className="mt-1 block text-xs leading-relaxed text-steel">{p.desc}</span>}
                  </span>
                  <IconArrowRight width={14} height={14} className="mt-1 shrink-0 text-amber" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-steel" aria-live="polite">
            Nothing matches &ldquo;{query}&rdquo;. Try a shorter word, or{" "}
            <Link to="/contact" className="font-medium text-amber hover:text-amber-2">
              contact us
            </Link>
            .
          </p>
        )}
      </Section>
    </>
  );
}
