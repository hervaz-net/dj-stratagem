import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import RoleBadge from "../components/RoleBadge";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import RequestCard from "../components/projects/RequestCard";
import { IconArrowRight, IconSearch, IconSliders } from "../components/icons";
import { ROLES, PRODUCT } from "../brand";
import {
  projects,
  landingPairs,
  TRADES,
  CITIES,
  MATERIAL_CATEGORIES,
  FULFILLMENT,
} from "../data/sampleProjects";

const ANY = "Any";

const BUYERS = [
  { key: ANY, label: "All buyers" },
  { key: "contractor", label: ROLES.contractor.label },
  { key: "distributor", label: ROLES.distributor.label },
];

const SORTS = {
  due: { label: "Quotes due soonest", fn: (a, b) => a.bidDue.localeCompare(b.bidDue) },
  fit: { label: "Best fit", fn: (a, b) => b.match - a.match },
  size: { label: "Largest project", fn: (a, b) => b.value - a.value },
};

const controlClass =
  "h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-fg " +
  "outline-hidden transition-colors hover:border-line-strong focus:border-brand";

const FLOW = [
  { roles: ["contractor", "distributor"], title: "A buyer posts the package", text: "Material, quantity, need-by date, and whether it ships to the jobsite or waits for will-call." },
  { roles: ["supplier", "distributor"], title: "Sellers quote what they stock", text: "Manufacturers and distributors price the packages they can fill, with lead times and terms." },
  { roles: ["contractor", "distributor"], title: "The buyer awards a PO", text: "Compare quotes line by line, accept one, and track the order through delivery." },
];

export default function Projects() {
  const [q, setQ] = useState("");
  const [trade, setTrade] = useState(ANY);
  const [city, setCity] = useState(ANY);
  const [category, setCategory] = useState(ANY);
  const [fulfillment, setFulfillment] = useState(ANY);
  const [buyer, setBuyer] = useState(ANY);
  const [sort, setSort] = useState("due");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects
      .filter((p) => {
        if (trade !== ANY && p.trade !== trade) return false;
        if (city !== ANY && p.city !== city) return false;
        if (buyer !== ANY && p.buyerRole !== buyer) return false;
        if (category !== ANY && !p.materialPackages.some((m) => m.category === category)) return false;
        if (fulfillment !== ANY && !p.materialPackages.some((m) => m.fulfillment === fulfillment)) return false;
        if (!needle) return true;
        return (
          p.title.toLowerCase().includes(needle) ||
          p.summary.toLowerCase().includes(needle) ||
          p.type.toLowerCase().includes(needle) ||
          p.scope.some((s) => s.toLowerCase().includes(needle)) ||
          p.materialPackages.some(
            (m) => m.title.toLowerCase().includes(needle) || m.items.toLowerCase().includes(needle),
          )
        );
      })
      .sort(SORTS[sort].fn);
  }, [q, trade, city, category, fulfillment, buyer, sort]);

  const reset = () => {
    setQ("");
    setTrade(ANY);
    setCity(ANY);
    setCategory(ANY);
    setFulfillment(ANY);
    setBuyer(ANY);
  };

  const filtered =
    q !== "" || trade !== ANY || city !== ANY || category !== ANY || fulfillment !== ANY || buyer !== ANY;
  const packageCount = results.reduce((n, p) => n + p.materialPackages.length, 0);

  return (
    <>
      <Seo
        title="Project demand: construction material requests"
        description={`See how contractors and distributors post material packages for quote on ${PRODUCT}: electrical, HVAC, plumbing, concrete, roofing, and framing demand across Southern California. Sample requests shown during early access.`}
      />

      <PageHero
        eyebrow="Project demand"
        title="See what the job needs before the PO goes out."
        actions={
          <>
            <Button to="/register" size="lg">
              Post a request
            </Button>
            <Button to="/register" size="lg" variant="secondary">
              Quote as a seller
            </Button>
          </>
        }
        aside={
          <div className="rounded-2xl border border-line bg-canvas p-5 sm:p-6">
            <p className="text-sm font-semibold text-fg">How a request moves</p>
            <ol className="mt-4 space-y-4">
              {FLOW.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-fg tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{step.text}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {step.roles.map((r) => (
                        <RoleBadge key={r} role={r} />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        }
      >
        Contractors and distributors post the material packages a job needs, from wire and
        conduit to rebar and roof systems. Manufacturers and distributors quote the packages they
        can fill.
      </PageHero>

      <section className="px-5 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-6xl">

          {/* filters */}
          <div className="mt-8 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-fg">
              <IconSliders width={16} height={16} aria-hidden="true" className="text-fg-muted" />
              Filter requests
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="q" className="mb-1.5 block text-xs font-semibold text-fg-muted">
                  Search
                </label>
                <div className="relative">
                  <IconSearch
                    width={16}
                    height={16}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
                  />
                  <input
                    id="q"
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Conduit, rebar, RTU, project…"
                    className={`${controlClass} pl-9 placeholder:text-fg-muted/70`}
                  />
                </div>
              </div>
              <Filter id="trade" label="Trade" value={trade} onChange={setTrade} options={TRADES} />
              <Filter id="city" label="Location" value={city} onChange={setCity} options={CITIES} />
              <Filter
                id="category"
                label="Material"
                value={category}
                onChange={setCategory}
                options={MATERIAL_CATEGORIES}
              />
              <Filter
                id="fulfillment"
                label="Fulfillment"
                value={fulfillment}
                onChange={setFulfillment}
                options={Object.keys(FULFILLMENT)}
                labels={FULFILLMENT}
              />
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
              <fieldset>
                <legend className="sr-only">Buyer type</legend>
                <div className="flex flex-wrap gap-2">
                  {BUYERS.map((b) => {
                    const active = buyer === b.key;
                    return (
                      <label
                        key={b.key}
                        className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${
                          active
                            ? "border-brand bg-brand-soft text-brand-fg"
                            : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
                        }`}
                      >
                        <input
                          type="radio"
                          name="buyer"
                          value={b.key}
                          checked={active}
                          onChange={() => setBuyer(b.key)}
                          className="sr-only"
                        />
                        {b.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="shrink-0 text-xs font-semibold text-fg-muted">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={`${controlClass} h-9 sm:w-48`}
                >
                  {Object.entries(SORTS).map(([key, s]) => (
                    <option key={key} value={key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-fg-muted">
              <span className="font-semibold text-fg tabular-nums">{results.length}</span>{" "}
              {results.length === 1 ? "project" : "projects"} &middot;{" "}
              <span className="tabular-nums">{packageCount}</span> material{" "}
              {packageCount === 1 ? "package" : "packages"}
              {filtered ? " match your filters" : ""}
            </p>
            {filtered && (
              <button
                type="button"
                onClick={reset}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
              >
                Clear filters
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
              <p className="text-base font-semibold text-fg">No requests match those filters.</p>
              <p className="mt-2 text-sm text-fg-muted">
                Try a wider trade, location, or material, or{" "}
                <button type="button" onClick={reset} className="font-semibold text-brand hover:text-brand-hover">
                  clear the filters
                </button>
                .
              </p>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {results.map((p) => (
                <li key={p.slug}>
                  <RequestCard project={p} />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-xs leading-relaxed text-fg-muted">
            Fit scores are calculated against a sample seller profile to show how matching works.
            On a live account they reflect your catalog, service area, and terms.
          </p>
        </div>
      </section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Both sides of a request" title="Buyers post demand. Sellers answer it.">
          Demand on {PRODUCT} is a package of material tied to a real job. That gives sellers
          enough detail to price it, and gives buyers quotes they can compare line by line.
        </SectionHeading>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <SideCard
            roles={["contractor", "distributor"]}
            title="Buying for a job"
            points={[
              "Post packages from a takeoff, not a phone tree",
              "Set need-by dates and choose delivery or will-call",
              "Compare quotes, lead times, and terms side by side",
            ]}
            cta="Post a request"
          />
          <SideCard
            roles={["supplier", "distributor"]}
            title="Selling into the job"
            points={[
              "See packages that match what you stock and where you ship",
              "Quote the lines you can fill, not the whole project",
              "Win new contractor and distributor accounts",
            ]}
            cta="Start quoting"
          />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Browse by market" title="Material demand by trade and city" />
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {landingPairs().map((pair) => (
            <li key={`${pair.citySlug}/${pair.tradeSlug}`}>
              <Link
                to={`/construction-projects/${pair.citySlug}/${pair.tradeSlug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-line-strong hover:bg-subtle"
              >
                <span className="text-sm">
                  <span className="font-semibold text-fg">{pair.trade}</span>
                  <span className="text-fg-muted"> in {pair.city}</span>
                </span>
                <IconArrowRight
                  width={15}
                  height={15}
                  aria-hidden="true"
                  className="text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CTASection
        title="Put your material requests in front of the right sellers."
        subtitle="Create a free company profile, tell us what you buy or sell and where, and you'll be first in line when live requests open."
        primaryLabel="Join free"
        secondaryLabel="Talk to our team"
      />
    </>
  );
}

function SideCard({ roles, title, points, cta }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => (
          <RoleBadge key={r} role={r} />
        ))}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-fg">{title}</h3>
      <ul className="mt-4 flex-1 space-y-2.5">
        {points.map((pt) => (
          <li key={pt} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-fg-muted">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
            {pt}
          </li>
        ))}
      </ul>
      <Button to="/register" variant="soft" className="mt-6 self-start">
        {cta}
      </Button>
    </div>
  );
}

function Filter({ id, label, value, onChange, options, labels }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-fg-muted">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={controlClass}>
        <option value={ANY}>{ANY}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {labels?.[o] ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}
