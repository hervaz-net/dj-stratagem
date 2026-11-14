import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { BRANDS } from "../ventures/brands";
import { Field, FormStatus, Honeypot, useInquiry } from "../ventures/parts";
import { vehicleCredentials, lineup, modelLabel, operator } from "../data/fleet";
import { projects, projectsFor, landingPairs, findProject, TRADES, CITIES } from "../data/sampleProjects";
import { localDateISO } from "../lib/dates";

const field =
  "w-full rounded-[10px] border border-line-strong bg-canvas px-2.5 py-2 text-sm font-normal text-fg";

function Cards({ items }) {
  return (
    <div className="dk-grid">
      {items.map((item) => (
        <article key={item.title} id={item.id} className="dk-card">
          {item.kicker && <span className="dk-pill">{item.kicker}</span>}
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function EarlyList({ brand }) {
  const { state, invalid, onSubmit } = useInquiry({
    role: `${brand.name} early list`,
    buildMessage: (d) => [`I am a: ${d.get("kind") || "Not given"}`, String(d.get("notes") || "")].filter(Boolean).join("\n\n"),
  });
  if (state === "sent") {
    return (
      <div className="dk-card" id="early-list">
        <h3>You’re on the list.</h3>
        <p>A person reads every note. I’ll write as this mode opens.</p>
      </div>
    );
  }
  return (
    <form id="early-list" onSubmit={onSubmit} noValidate className="dk-form">
      <Honeypot />
      <Field label="Name" required><input name="name" autoComplete="name" className={field} /></Field>
      <Field label="Email" required><input name="email" type="email" autoComplete="email" className={field} /></Field>
      <Field label="Company"><input name="company" autoComplete="organization" className={field} /></Field>
      <Field label="I am a">
        <select name="kind" defaultValue="" className={field}>
          <option value="">Choose one</option>
          {brand.audience.map((a) => <option key={a}>{a}</option>)}
          {brand.slug === "workforce" && <option>Tradesperson</option>}
          <option>Something else</option>
        </select>
      </Field>
      <Field label="Anything I should know?">
        <textarea name="notes" rows={3} maxLength={1000} className={field} />
      </Field>
      <button type="submit" className="dk-btn" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Join the early list"}
      </button>
      <FormStatus state={state} invalid={invalid} />
    </form>
  );
}

function Developing({ id }) {
  const brand = BRANDS[id];
  return (
    <>
      <p className="dk-note">{brand.note || `${brand.status}. ${brand.footerLine}`}</p>
      <div className="dk-split">
        <div>
          <h2 id="offerings" className="mt-0 text-2xl">What I’m building</h2>
          <Cards items={brand.offerings.map((o) => ({ title: o.title, text: o.text }))} />
          <h2 id="audience" className="text-2xl">Who it’s for</h2>
          <ul className="dk-list">
            {brand.audience.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="mt-0 text-2xl">Early list</h2>
          <EarlyList brand={brand} />
          {brand.faqs && (
            <div id="questions" className="mt-4">
              <h2 className="text-2xl">Questions</h2>
              <ul className="dk-list">
                {brand.faqs.map((f) => (
                  <li key={f.q}><strong>{f.q}</strong><p className="mt-1 text-sm text-fg-muted">{f.a}</p></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const SUITES = [
  {
    id: "for-general-contractors",
    title: "General contractors",
    text: "Publish projects, keep RFIs, addenda, and deadlines together, and award with a paper trail. Comparison and award tools are planned.",
  },
  {
    id: "for-subcontractors",
    title: "Subcontractors",
    text: "Find work in your trade, keep a profile and portfolio, and list licenses and insurance. I don’t verify those documents yet. Bid history and follow-up CRM are planned.",
  },
  {
    title: "Marketing",
    text: "Profiles, lead capture, proposal drafts, and review requests aimed at contractors. The marketing suite is planned, not a live agency.",
  },
  {
    title: "Supply",
    text: "Sealed single-round quotes, scores you weight, a deadline that closes the window, and split awards by line. Standing price books and pooled demand are planned.",
  },
  {
    title: "Business tools",
    text: "CRM, estimating, invoicing, change orders, documents, and e-signatures tied to the job. Planned for the workspace after award.",
  },
  {
    title: "Drafts beside your judgment",
    text: "I can be aimed at matching, missing-document checks, and proposal drafts. Nothing is submitted, bought, or awarded for you.",
  },
];

const SOLUTIONS = {
  gc: {
    label: "General contractors",
    title: "Run the pipeline from one desk.",
    text: "One place to post work, invite subs, and keep bids, RFIs, and deadlines together. Early members get the workspace as each piece rolls out.",
    points: [
      "Post projects and invite subcontractors from one account (rolling out with early members)",
      "Compare bids side by side before awarding (planned)",
      "Keep RFIs, addenda, and deadlines off email chains (planned)",
      "Award and rate vendors in one record (planned)",
    ],
  },
  sub: {
    label: "Subcontractors",
    title: "See work worth bidding.",
    text: "Browse a sample project board by trade and region today. When a live feed opens, the same profile stays on the account.",
    points: [
      "Sample board by trade and territory today; live matching as members join",
      "Company profile and portfolio ready for digital bids",
      "Space to list licenses and insurance. I don’t verify them yet",
      "Bid history and follow-up CRM (planned)",
    ],
  },
  supplier: {
    label: "Suppliers",
    title: "Compete on the whole offer.",
    text: "Browse sample catalogs today. Sealed quotes, scored awards, and pooled demand roll out with early sellers.",
    points: [
      "Browse sample catalogs and list products while I onboard early sellers",
      "Sealed single-round quotes so competitors never see your number (planned)",
      "Floor pricing per SKU to protect margin (planned)",
      "Pooled contractor demand for larger committed orders (planned)",
    ],
  },
};

const CATEGORIES = [
  ["Power tools & accessories", "Drills, saws, grinders, batteries, blades, and bits."],
  ["Fasteners & hardware", "Screws, anchors, bolts, nails, brackets, and connectors."],
  ["Electrical", "Conduit, wire, boxes, breakers, fittings, and the hand tools that go with them."],
  ["Lumber & wood", "Dimensional lumber, sheet goods, slabs, and engineered wood."],
  ["Metal", "Plate, bar, rod, rebar, angle, and structural shapes cut to a take-off."],
  ["Plumbing pipe", "PVC, CPVC, ABS, copper, PEX, and the fitting run."],
  ["Plumbing fixtures", "Valves, hangers, traps, water heaters, and fixtures."],
  ["Safety & consumables", "PPE, fall protection, layout, abrasives, and tape."],
];

const MECHANICS = [
  ["Sealed quotes, one round", "Suppliers can’t see each other’s numbers and can’t re-bid. One price, submitted once."],
  ["Scored, not just cheapest", "You set the weights: price, lead time, fill rate, delivery, and past performance."],
  ["Close at the deadline", "Set a window. When it closes, quotes are scored. No haggling thread."],
  ["Split by line", "Award rod to one supplier and PVC to another so the fill can be complete."],
  ["Standing price books", "For SKUs you reorder, suppliers publish tiered contract pricing. Bidding happens on the book, not every purchase order."],
  ["Pooled demand", "The same SKU can be pooled across contractors so a small shop reaches a volume tier, and the supplier sees one committed block."],
];

function SampleCard({ project }) {
  return (
    <Link className="dk-card" to={`/command/projects/${project.slug}`}>
      <span className="dk-pill">Sample card</span>
      <h3>{project.title}</h3>
      <p>{project.trade} · {project.city}, {project.state} · {project.type}</p>
      <p>{project.summary}</p>
    </Link>
  );
}

export function ProjectsBoard() {
  const [trade, setTrade] = useState("Any");
  const [city, setCity] = useState("Any");
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (trade !== "Any" && p.trade !== trade) return false;
      if (city !== "Any" && p.city !== city) return false;
      if (!needle) return true;
      return [p.title, p.summary, p.type, p.trade, p.city].join(" ").toLowerCase().includes(needle);
    });
  }, [trade, city, q]);
  const pairs = useMemo(() => landingPairs(), []);
  return (
    <>
      <p className="dk-note" id="board">Sample cards only. Not live solicitations. Nothing here can be bid, and no prices or scores are shown.</p>
      <div className="dk-filters">
        <input aria-label="Search sample cards" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the sample board" />
        <select aria-label="Trade" value={trade} onChange={(e) => setTrade(e.target.value)}>
          <option>Any</option>
          {TRADES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select aria-label="City" value={city} onChange={(e) => setCity(e.target.value)}>
          <option>Any</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="dk-grid">
        {results.map((p) => <SampleCard key={p.slug} project={p} />)}
      </div>
      {results.length === 0 && <p className="dk-lede">No sample cards match that filter.</p>}
      <h2 id="markets" className="text-2xl">Markets on the sample board</h2>
      <div className="dk-grid">
        {pairs.map((p) => (
          <Link key={`${p.citySlug}-${p.tradeSlug}`} className="dk-card" to={`/command/projects/markets/${p.citySlug}/${p.tradeSlug}`}>
            <span className="dk-pill">Sample market</span>
            <h3>{p.trade} in {p.city}</h3>
            <p>Illustrative {p.trade.toLowerCase()} cards for {p.city}. Not a live bid list.</p>
          </Link>
        ))}
      </div>
    </>
  );
}

export function ProjectFocus() {
  const { slug } = useParams();
  const project = findProject(slug);
  if (!project) {
    return (
      <>
        <h1>That card isn’t on the board.</h1>
        <p className="dk-lede">The sample board doesn’t have this address.</p>
        <Link className="dk-btn mt-4 inline-flex items-center" to="/command/projects">Back to the board</Link>
      </>
    );
  }
  return (
    <>
      <p className="dk-kicker">Sample card · {project.trade}</p>
      <h1>{project.title}</h1>
      <p className="dk-lede">{project.city}, {project.state} · {project.type} · {project.procurement}</p>
      <p className="dk-note">Sample only. Not a live solicitation. Owner names, prices, and match scores are not shown.</p>
      <p className="dk-lede">{project.summary}</p>
      <h2 className="text-2xl">Scope listed on this card</h2>
      <ul className="dk-list">
        {(project.scope || [project.trade]).map((s) => <li key={s}>{s}</li>)}
      </ul>
      <h2 className="text-2xl">Document types listed</h2>
      <ul className="dk-list">
        {(project.documents || []).map((d) => <li key={d}>{d}</li>)}
      </ul>
      <Link className="dk-btn mt-4 inline-flex items-center" to="/command/projects">All sample cards</Link>
    </>
  );
}

export function MarketFocus() {
  const { city: citySlug, trade: tradeSlug } = useParams();
  const matches = projectsFor(citySlug, tradeSlug);
  if (matches.length === 0) return <Navigate to="/command/projects" replace />;
  const city = matches[0].city;
  const trade = matches[0].trade;
  const pairs = landingPairs();
  const sameTrade = pairs.filter((p) => p.tradeSlug === tradeSlug && p.citySlug !== citySlug);
  const sameCity = pairs.filter((p) => p.citySlug === citySlug && p.tradeSlug !== tradeSlug);
  return (
    <>
      <p className="dk-kicker">Sample market</p>
      <h1>{trade} construction projects in {city}</h1>
      <p className="dk-lede">
        Illustrative {trade.toLowerCase()} cards for subcontractors working in {city}. Samples only, not live solicitations.
      </p>
      <div className="dk-grid">
        {matches.map((p) => <SampleCard key={p.slug} project={p} />)}
      </div>
      <h2 className="text-2xl">Nearby on the sample board</h2>
      <div className="dk-grid">
        {sameTrade.map((p) => (
          <Link key={p.citySlug} className="dk-card" to={`/command/projects/markets/${p.citySlug}/${p.tradeSlug}`}>
            <h3>{p.trade} in {p.city}</h3>
            <p>Same trade, another city on the sample board.</p>
          </Link>
        ))}
        {sameCity.map((p) => (
          <Link key={p.tradeSlug} className="dk-card" to={`/command/projects/markets/${p.citySlug}/${p.tradeSlug}`}>
            <h3>{p.trade} in {p.city}</h3>
            <p>Same city, another trade on the sample board.</p>
          </Link>
        ))}
      </div>
    </>
  );
}

function ReserveForm() {
  const [start, setStart] = useState("");
  const { state, invalid, onSubmit } = useInquiry({
    role: "Fleet reservation request",
    buildMessage: (d) =>
      [
        `Vehicle: ${d.get("vehicle") || "Not chosen"}`,
        `How many: ${d.get("qty") || "1"}`,
        `Job: ${d.get("job") || "Not given"}`,
        `Jobsite: ${d.get("jobsite") || "Not given"}`,
        `Start: ${d.get("date") || "Not given"}`,
        `End: ${d.get("end") || "Not given"}`,
        String(d.get("notes") || ""),
      ].filter(Boolean).join("\n"),
  });
  if (state === "sent") {
    return <div className="dk-card"><h3>Request received.</h3><p>A person will reply about this reservation. It is not confirmed until we write back.</p></div>;
  }
  return (
    <form id="reserve" onSubmit={onSubmit} noValidate className="dk-form">
      <Honeypot />
      <Field label="Name" required><input name="name" autoComplete="name" required className={field} /></Field>
      <Field label="Company"><input name="company" autoComplete="organization" className={field} /></Field>
      <Field label="Email" required><input name="email" type="email" autoComplete="email" required className={field} /></Field>
      <Field label="Phone"><input name="phone" type="tel" autoComplete="tel" className={field} /></Field>
      <Field label="Job reference"><input name="job" className={field} /></Field>
      <Field label="Jobsite"><input name="jobsite" className={field} /></Field>
      <Field label="Start date"><input name="date" type="date" min={localDateISO()} value={start} onChange={(e) => setStart(e.target.value)} className={field} /></Field>
      <Field label="End date"><input name="end" type="date" min={start || localDateISO()} className={field} /></Field>
      <Field label="Vehicle">
        <select name="vehicle" className={field} defaultValue="">
          <option value="">Choose a model</option>
          {lineup.flatMap((g) => g.models.map((m) => <option key={m.key}>{modelLabel(m)}</option>))}
        </select>
      </Field>
      <Field label="How many"><input name="qty" type="number" min="1" max="50" defaultValue="1" className={field} /></Field>
      <Field label="Notes"><textarea name="notes" rows={3} maxLength={1000} className={field} /></Field>
      <button className="dk-btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Request a reservation"}</button>
      <FormStatus state={state} invalid={invalid} />
    </form>
  );
}

function FleetBoard() {
  return (
    <>
      <p className="dk-note">
        {operator.legalName} · {operator.base}. Service area: {operator.serviceArea}. {operator.hours} {operator.phone ? operator.phone : "No day-of phone is listed yet."}
      </p>
      <h2 id="vehicles" className="text-2xl">Lineup</h2>
      {lineup.map((group) => (
        <section key={group.key} className="mt-4">
          <h3 className="text-xl">{group.name}</h3>
          <p className="text-sm text-fg-muted">{group.use}</p>
          <div className="dk-grid">
            {group.models.map((m) => (
              <article key={m.key} className="dk-card">
                {m.photo && <img className="dk-photo" src={m.photo} alt="" />}
                <h3>{modelLabel(m)}</h3>
                <ul className="dk-list">
                  {m.specs.map(([k, v]) => <li key={k}><strong>{k}.</strong> {v}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ))}
      <h2 id="credentials" className="text-2xl">Credentials on file</h2>
      <ul className="dk-list">
        {vehicleCredentials.map((c) => (
          <li key={c.key}>
            <strong>{c.label}.</strong> {c.value || c.optional || "Pending"}
            <p className="mt-1 text-sm text-fg-muted">{c.vehicleNote || c.note}</p>
          </li>
        ))}
      </ul>
      <h2 id="how" className="text-2xl">Reservation request</h2>
      <p className="text-sm text-fg-muted">A request is not a confirmed reservation. Write hello@djstratageminc.com if the form doesn’t send.</p>
      <ReserveForm />
    </>
  );
}

function ExchangeBoard() {
  return (
    <>
      <p className="dk-note">Manufacturers and vendors sell to distributors and, where they choose, direct to contractors. Distributors sell to contractors. Public catalog rows are samples.</p>
      <div className="dk-grid">
        <a className="dk-card" href="/exchange/marketplace">
          <span className="dk-pill">Marketplace</span>
          <h3>Browse supply</h3>
          <p>Sample catalogs from the bundled demo files. Not live storefronts.</p>
        </a>
        <a className="dk-card" href="/exchange/contractors">
          <h3>Contractors</h3>
          <p>Post a request per job, compare quotes, and choose delivery or will-call.</p>
        </a>
        <a className="dk-card" href="/exchange/distributors">
          <h3>Distributors</h3>
          <p>Source from manufacturers and answer contractor requests on one account.</p>
        </a>
        <a className="dk-card" href="/exchange/suppliers">
          <h3>Manufacturers and vendors</h3>
          <p>List a catalog once and reach distributors and contractors.</p>
        </a>
      </div>
      <h2 className="text-2xl">How a buy moves</h2>
      <ul className="dk-list">
        <li>Post a request with lines, quantities, a need-by date, and where it ships.</li>
        <li>Sellers who carry that category and cover the area send quotes.</li>
        <li>Compare them, accept one, and follow the order through delivery.</li>
      </ul>
    </>
  );
}

function SolutionsBoard() {
  const { hash } = useLocation();
  const [tab, setTab] = useState("gc");
  useEffect(() => {
    const key = hash.replace("#", "");
    if (SOLUTIONS[key]) setTab(key);
  }, [hash]);
  const role = SOLUTIONS[tab];
  return (
    <>
      <div className="dk-tabs" role="tablist" aria-label="Side of the deal" id="roles">
        {Object.entries(SOLUTIONS).map(([key, value]) => (
          <button key={key} type="button" role="tab" id={key} aria-selected={tab === key} onClick={() => setTab(key)}>
            {value.label}
          </button>
        ))}
      </div>
      <h2 className="text-2xl">{role.title}</h2>
      <p className="dk-lede">{role.text}</p>
      <ul className="dk-list">
        {role.points.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </>
  );
}

export function Workspace({ id, view }) {
  if (view === "project") return <ProjectFocus />;
  if (view === "market") return <MarketFocus />;
  if (id === "projects") return <ProjectsBoard />;
  if (id === "exchange") return <ExchangeBoard />;
  if (id === "platform") {
    return (
      <>
        <section id="walkthrough">
          <p className="dk-note" id="suites">Six suites, one workspace. A pursuit doesn’t have to leave the desk it started on. Steps still in build are marked planned.</p>
          <Cards items={SUITES} />
        </section>
        <h2 id="integrations" className="text-2xl">Tools this workspace is being shaped to sit beside</h2>
        <p className="text-sm text-fg-muted">None of these connections are live.</p>
        <ul className="dk-list">
          {["QuickBooks", "Procore", "Autodesk", "DocuSign", "Sage 300", "Microsoft 365", "Bluebeam", "Plangrid", "Google Workspace", "Xero", "Slack", "Zapier"].map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </>
    );
  }
  if (id === "solutions") return <SolutionsBoard />;
  if (id === "supply") {
    return (
      <>
        <div className="dk-grid" id="categories">
          {CATEGORIES.map(([title, text]) => (
            <article key={title} className="dk-card"><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
        <h2 id="mechanics" className="text-2xl">How bidding is meant to work</h2>
        <ul className="dk-list" id="scoring">
          {MECHANICS.map(([title, text]) => <li key={title}><strong>{title}.</strong> {text}</li>)}
        </ul>
        <h2 id="suppliers" className="text-2xl">For suppliers</h2>
        <ul className="dk-list">
          <li>Set a floor per SKU so a quote can’t be scored below your margin (planned).</li>
          <li>Win on lead time, fill rate, and reliability, not only price (planned).</li>
          <li>Pooled orders mean fewer, larger, committed purchases (planned).</li>
        </ul>
        <p className="mt-3"><Link className="dk-btn inline-flex items-center" to="/command/exchange">Open the marketplace mode</Link></p>
      </>
    );
  }
  if (id === "fleet") return <FleetBoard />;
  if (id === "capital" || id === "workforce" || id === "studio") return <Developing id={id} />;
  return null;
}
