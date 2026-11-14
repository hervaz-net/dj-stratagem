import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { BRANDS } from "../ventures/brands";
import { Field, FormStatus, Honeypot, useInquiry } from "../ventures/parts";
import { vehicleCredentials, lineup, modelLabel, operator } from "../data/fleet";
import { projectsFor, landingPairs, findProject, TRADES, CITIES } from "../data/sampleProjects";
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
    role: `${brand.name} request`,
    buildMessage: (d) => [`I am a: ${d.get("kind") || "Not given"}`, String(d.get("notes") || "")].filter(Boolean).join("\n\n"),
  });
  if (state === "sent") {
    return (
      <div className="dk-card" id="early-list">
        <h3>Request received.</h3>
        <p>A person reads it and replies with the next step.</p>
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
        {state === "sending" ? "Sending…" : "Send the request"}
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
    text: "Publish the project, invite subcontractors, and keep RFIs, addenda, and the award on one record. Send the pursuit to start.",
  },
  {
    id: "for-subcontractors",
    title: "Subcontractors",
    text: "Send your trade, profile, and license details. A person reviews the documents and keeps the follow-up on the account.",
  },
  {
    title: "Marketing",
    text: "Send the profile, the service area, and the proposal you need. A person drafts it with you.",
  },
  {
    title: "Supply",
    text: "Send the material list. Quotes come back sealed, scored on the weights you set, and can split by line.",
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
      "Post the project and invite subcontractors from the account",
      "Compare the bids side by side before you award",
      "Keep RFIs, addenda, and deadlines on the pursuit",
      "Award and rate vendors on the same record",
    ],
  },
  sub: {
    label: "Subcontractors",
    title: "See work worth bidding.",
    text: "Send the trade and the city. A person matches the pursuit to your profile.",
    points: [
      "Send a pursuit by trade and territory",
      "Keep the company profile and portfolio on the account",
      "Send licenses and insurance for a person to review",
      "Bid history and follow-up stay on the account",
    ],
  },
  supplier: {
    label: "Suppliers",
    title: "Compete on the whole offer.",
    text: "List what you sell and answer requests. Quotes stay sealed. You set a floor per SKU.",
    points: [
      "List products and answer a materials request",
      "Send one sealed quote. Competitors do not see the number",
      "Set a floor per SKU so the quote holds your margin",
      "Join pooled demand when the same SKU is requested together",
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

function PursuitForm({ trade = "", city = "" }) {
  const { state, invalid, onSubmit } = useInquiry({
    role: "Project pursuit",
    buildMessage: (d) =>
      [
        `Trade: ${d.get("trade") || "Not given"}`,
        `City: ${d.get("city") || "Not given"}`,
        `Scope: ${d.get("scope") || "Not given"}`,
      ].join("\n"),
  });
  if (state === "sent") {
    return (
      <div className="dk-card" id="board">
        <h3>Pursuit received.</h3>
        <p>A person reads the trade, city, and scope and replies with the next step.</p>
      </div>
    );
  }
  return (
    <form id="board" onSubmit={onSubmit} noValidate className="dk-form">
      <Honeypot />
      <Field label="Name" required><input name="name" autoComplete="name" required className={field} /></Field>
      <Field label="Email" required><input name="email" type="email" autoComplete="email" required className={field} /></Field>
      <Field label="Company"><input name="company" autoComplete="organization" className={field} /></Field>
      <Field label="Trade">
        <select name="trade" className={field} defaultValue={trade}>
          <option value="">Choose a trade</option>
          {TRADES.map((item) => <option key={item}>{item}</option>)}
        </select>
      </Field>
      <Field label="City">
        <select name="city" className={field} defaultValue={city}>
          <option value="">Choose a city</option>
          {CITIES.map((item) => <option key={item}>{item}</option>)}
        </select>
      </Field>
      <Field label="Scope"><textarea name="scope" rows={4} maxLength={1000} className={field} placeholder="What the job needs done" /></Field>
      <button className="dk-btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send the pursuit"}</button>
      <FormStatus state={state} invalid={invalid} />
    </form>
  );
}

export function ProjectsBoard() {
  const pairs = landingPairs();
  return (
    <>
      <p className="dk-lede" id="markets">Name the trade, the city, and the scope. A person replies with the next step.</p>
      <PursuitForm />
      <h2 className="text-2xl">Open a market</h2>
      <div className="dk-grid">
        {pairs.map((p) => (
          <Link key={`${p.citySlug}-${p.tradeSlug}`} className="dk-card" to={`/command/projects/markets/${p.citySlug}/${p.tradeSlug}`}>
            <h3>{p.trade} in {p.city}</h3>
            <p>Send a pursuit for this trade and city.</p>
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
        <h1>Send a pursuit</h1>
        <p className="dk-lede">This address is open. Name the trade, the city, and the scope.</p>
        <PursuitForm />
      </>
    );
  }
  return (
    <>
      <p className="dk-kicker">{project.trade} · {project.city}</p>
      <h1>Send a {project.trade.toLowerCase()} pursuit in {project.city}</h1>
      <p className="dk-lede">A person reads the scope and replies with the next step.</p>
      <PursuitForm trade={project.trade} city={project.city} />
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
      <p className="dk-kicker">{trade} · {city}</p>
      <h1>{trade} work in {city}</h1>
      <p className="dk-lede">Send the scope. A person replies with the next step.</p>
      <PursuitForm trade={trade} city={city} />
      <h2 className="text-2xl">Other markets</h2>
      <div className="dk-grid">
        {sameTrade.map((p) => (
          <Link key={p.citySlug} className="dk-card" to={`/command/projects/markets/${p.citySlug}/${p.tradeSlug}`}>
            <h3>{p.trade} in {p.city}</h3>
            <p>Send a pursuit in this city.</p>
          </Link>
        ))}
        {sameCity.map((p) => (
          <Link key={p.tradeSlug} className="dk-card" to={`/command/projects/markets/${p.citySlug}/${p.tradeSlug}`}>
            <h3>{p.trade} in {p.city}</h3>
            <p>Send a pursuit for this trade.</p>
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
    return <div className="dk-card"><h3>Request received.</h3><p>A person confirms the vehicle and the dates by email.</p></div>;
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
      <p className="text-sm text-fg-muted">Send the vehicle and the dates. A person confirms by email. If the form doesn’t send, write hello@djstratageminc.com.</p>
      <ReserveForm />
    </>
  );
}

function ExchangeBoard() {
  return (
    <>
      <p className="dk-lede">Post what the job needs, or list what you sell. A person routes the request.</p>
      <div className="dk-grid">
        <a className="dk-card" href="/exchange/marketplace">
          <span className="dk-pill">Marketplace</span>
          <h3>Browse supply</h3>
          <p>Open the marketplace and post a materials request.</p>
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
          <p className="dk-note" id="suites">Six suites, one workspace. Send the pursuit and a person keeps bids, documents, and follow-up on the same account.</p>
          <Cards items={SUITES} />
        </section>
        <h2 id="integrations" className="text-2xl">Tools this workspace is being shaped to sit beside</h2>
        <p className="text-sm text-fg-muted">Name the tools on the account. A person sets up the connection with you.</p>
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
          <li>Set a floor per SKU so a quote holds your margin.</li>
          <li>Win on lead time, fill rate, and reliability, not only price.</li>
          <li>Pooled orders group the same SKU into one committed purchase.</li>
        </ul>
        <p className="mt-3"><Link className="dk-btn inline-flex items-center" to="/command/exchange">Open the marketplace mode</Link></p>
      </>
    );
  }
  if (id === "fleet") return <FleetBoard />;
  if (id === "capital" || id === "workforce" || id === "studio") return <Developing id={id} />;
  return null;
}
