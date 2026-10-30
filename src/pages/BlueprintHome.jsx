import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import "../styles/blueprint.css";

/**
 * Homepage at "/": a bold, jobsite-colored page built around three agents (bidding,
 * logistics, workforce). Renders its own nav and footer, so App mounts it
 * outside MarketingLayout. The UI frames are sample views (PROOF.md): they
 * show what each agent does, not anyone's real data.
 *
 * /projects, /supply, /workforce and /platform belong to the ventures app, so
 * they are plain anchors (full load); in-app routes use <Link>.
 */

const AGENTS = [
  {
    id: "agent-bidding",
    num: "01",
    name: "Bidding agent",
    line: "Reads RFPs for you, pulls out the constraints that matter, and flags compliance problems before you submit.",
    features: ["RFP ingestion", "Margin protection", "Compliance flags"],
    sample: "Civic center roof · $198,300 · Clear",
    href: "/projects",
    open: "See the project board",
  },
  {
    id: "agent-logistics",
    num: "02",
    name: "Logistics agent",
    line: "Matches materials to local supplier stock, plans haul routes, and warns you about late deliveries before they stall the site.",
    features: ["Material matching", "Fleet routing", "Lead-time alerts"],
    sample: "Load L-0413 · Mesh backordered +3d",
    href: "/supply",
    open: "See Supply",
  },
  {
    id: "agent-workforce",
    num: "03",
    name: "Workforce agent",
    line: "Checks licenses and OSHA cards, builds certified payroll, and helps you fill crew gaps with qualified people.",
    features: ["Credential checks", "Certified payroll", "Trade matching"],
    sample: "4 crews · 3 ready to file",
    href: "/workforce",
    open: "See Workforce",
  },
];

// Ticker lines, labelled "Sample activity" on the page (PROOF.md).
const TICKER = [
  "RFP matched · Riverside · Concrete · $412,800",
  "Load L-0412 routed · #5 rebar, 40 tons",
  "Crew 14 cleared · C-10 · OSHA 30",
  "Compliance flag · Bldg C electrical · 2 items",
  "Mesh backordered · Site B +3 days · alert sent",
  "Certified payroll · week 43 · 3 of 4 ready",
];

const INTEGRATIONS = [
  {
    label: "Project management",
    title: "Procore, Autodesk and your ERP",
    copy: "Agent results land in the dashboards your team already uses, so nobody copies data between systems.",
  },
  {
    label: "Public bidding",
    title: "Municipal and public works portals",
    copy: "New RFP packages are picked up as they're posted and scored against your trades and territory.",
  },
  {
    label: "Accounting and payroll",
    title: "QuickBooks, Sage 300 and payroll services",
    copy: "Crew hours and credentials flow into labor reports and certified payroll records.",
  },
];

const FAQ = [
  {
    q: "What is a subagent?",
    a: "A focused program that runs in the background on one job. Give it an RFP or a hauling schedule and it does the specific work, such as reading specs, checking compliance or planning routes, then returns the results to your dashboard. It is not a chat window.",
  },
  {
    q: "How reliable is the AI on compliance?",
    a: "Agents work inside fixed rules: public bidding formats, labor rules and the requirements in the documents you give them. When something doesn't match, the agent flags it for a person to check. Nothing is submitted without a human review.",
  },
  {
    q: "Do we have to replace our current tools?",
    a: "No. Stratagem sits alongside what you use today and moves data in and out by CSV, JSON or a direct connection.",
  },
  {
    q: "How is our bidding data protected?",
    a: "Your bids, supplier pricing and crew details are encrypted in transit and kept to your company account. Our agents are never trained on your documents.",
  },
];

/** Reads the real PHP health probe; the status line never claims more than it saw. */
function useSystemStatus() {
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    let alive = true;
    fetch("/api/health.php", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => alive && setStatus(d && d.ok ? "ok" : "bad"))
      .catch(() => alive && setStatus("bad"));
    return () => {
      alive = false;
    };
  }, []);
  return status;
}

const STATUS_TEXT = { checking: "Checking status", ok: "All systems operational", bad: "Status unavailable" };

function StatusLine({ status }) {
  return (
    <span className="bp-status" role="status">
      <span className={`bp-dot ${status === "ok" ? "is-ok" : status === "bad" ? "is-bad" : ""}`} aria-hidden="true" />
      {STATUS_TEXT[status]}
    </span>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Nav({ status }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="bp-nav" ref={ref}>
      <div className="bp-wrap bp-nav-row">
        <a href="#top" className="bp-brand" aria-label="D&J Stratagem home">
          <span className="bp-mark" aria-hidden="true" />
          D&amp;J Stratagem
        </a>
        <nav className="bp-links" aria-label="Main">
          <button type="button" className="bp-link" aria-expanded={open} aria-controls="bp-directory" onClick={() => setOpen((v) => !v)}>
            Subagents
            <svg className="bp-caret" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          <a className="bp-link" href="#integrations">Integrations</a>
          <a className="bp-link" href="/workforce">Workforce</a>
          <Link className="bp-link" to="/resources">Docs</Link>
        </nav>
        <div className="bp-nav-right">
          <StatusLine status={status} />
          <Link className="bp-link" to="/login">Sign in</Link>
          <Link to="/register" className="bp-btn bp-btn-sm">Deploy an agent</Link>
        </div>
        <button type="button" className="bp-link bp-menu-btn" aria-expanded={open} aria-controls="bp-directory" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div id="bp-directory" className="bp-drawer">
          <div className="bp-wrap">
            <div className="bp-drawer-mobile">
              <a className="bp-link" href="#integrations" onClick={close}>Integrations</a>
              <a className="bp-link" href="/workforce">Workforce</a>
              <Link className="bp-link" to="/resources">Docs</Link>
              <Link className="bp-link" to="/login">Sign in</Link>
              <Link to="/register" className="bp-btn">Deploy an agent</Link>
              <StatusLine status={status} />
            </div>
            <div className="bp-drawer-grid">
              {AGENTS.map((a) => (
                <a key={a.id} className="bp-drawer-card" href={`#${a.id}`} onClick={close}>
                  <span className="bp-label">{a.num}</span>
                  <h3>{a.name}</h3>
                  <p>{a.features.join(" · ")}</p>
                </a>
              ))}
            </div>
            <div className="bp-drawer-foot">
              <a href="/platform">How the platform works →</a>
              <Link to="/companies">All Stratagem companies →</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------- sample UI frames */

function FrameBar({ title }) {
  return (
    <div className="bp-frame-bar">
      <span>{title}</span>
      <span className="bp-tag">Sample view</span>
    </div>
  );
}

const BIDS = [
  ["Municipal facility renovation", "Riverside", "Concrete", "$412,800", "Clear"],
  ["School modernization, Bldg C", "Anaheim", "Electrical", "$286,450", "2 flags"],
  ["Civic center roof replacement", "Pasadena", "Roofing", "$198,300", "Clear"],
];

function BidFrame() {
  const [compiled, setCompiled] = useState(false);
  return (
    <div className="bp-frame">
      <FrameBar title="Matched public bids" />
      <div className="bp-scroll">
        <table className="bp-table">
          <thead>
            <tr><th>Listing</th><th>City</th><th>Trade</th><th className="num">Estimate</th><th>Compliance</th></tr>
          </thead>
          <tbody>
            {BIDS.map(([t, c, tr, v, s]) => (
              <tr key={t}>
                <td>{t}</td><td>{c}</td><td>{tr}</td><td className="num">{v}</td>
                <td className={s === "Clear" ? "bp-ok-text" : "bp-warn-text"}>{s}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bp-frame-foot">
        <span className="bp-muted">{compiled ? "Bid package ready (sample)" : "Civic center roof · 3 line items"}</span>
        <button type="button" className="bp-btn bp-btn-sm" onClick={() => setCompiled(true)} disabled={compiled}>
          {compiled ? "Package ready" : "Compile package"}
        </button>
      </div>
    </div>
  );
}

function RouteFrame() {
  return (
    <div className="bp-frame">
      <FrameBar title="Today's deliveries" />
      <svg className="bp-map" viewBox="0 0 640 240" role="img" aria-label="Sample route map: supplier yard to two job sites, one delivery flagged as late">
        <defs>
          <pattern id="bp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#f0f0ee" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="640" height="240" fill="url(#bp-grid)" />
        <path d="M60 180 L190 180 L190 110 L360 110 L360 60 L560 60" fill="none" stroke="#e6e6e3" strokeWidth="10" strokeLinejoin="round" />
        <path d="M360 110 L520 180" fill="none" stroke="#e6e6e3" strokeWidth="10" />
        <path className="bp-route" pathLength="1" d="M60 180 L190 180 L190 110 L360 110 L360 60 L560 60" fill="none" stroke="#121212" strokeWidth="3" strokeLinejoin="round" />
        <path className="bp-route-late" d="M360 110 L520 180" fill="none" stroke="#ff6b00" strokeWidth="3" strokeDasharray="6 5" />
        <g fontFamily="Inter, Arial, sans-serif" fontSize="13" fontWeight="600" fill="#121212">
          <rect x="50" y="170" width="20" height="20" rx="4" fill="#121212" />
          <text x="40" y="214">Supplier yard</text>
          <circle cx="560" cy="60" r="10" fill="#fff" stroke="#15803d" strokeWidth="2.5" />
          <path d="M555 60 l4 4 l7 -8" fill="none" stroke="#15803d" strokeWidth="2.5" />
          <text x="478" y="36">Site A · on time</text>
          <circle cx="520" cy="180" r="10" fill="#fff" stroke="#ff6b00" strokeWidth="2.5" />
          <text x="516" y="185" fill="#c2410c">!</text>
          <text x="440" y="214" fill="#c2410c">Site B · 3 days late</text>
        </g>
      </svg>
      <div className="bp-scroll" style={{ borderTop: "1px solid var(--bp-line)" }}>
        <table className="bp-table">
          <thead><tr><th>Load</th><th>Material</th><th>Supplier stock</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>L-0412</td><td>#5 rebar, 40 tons</td><td className="bp-ok-text">In stock</td><td className="bp-ok-text">Routed</td></tr>
            <tr><td>L-0413</td><td>Welded wire mesh</td><td className="bp-warn-text">Backorder</td><td className="bp-warn-text">Flagged</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CREWS = [
  ["Crew 14 · Electrical", "C-10", "OSHA 30", "Valid"],
  ["Crew 22 · Concrete", "C-8", "OSHA 10", "Valid"],
  ["Crew 31 · Roofing", "C-39", "OSHA 10", "Valid"],
  ["Crew 09 · Framing", "B", "OSHA 10", "Renew in 12 days"],
];

function CrewFrame() {
  return (
    <div className="bp-frame">
      <FrameBar title="Crew credentials" />
      <div className="bp-scroll">
        <table className="bp-table">
          <thead><tr><th>Crew</th><th>License</th><th>Safety</th><th>Status</th></tr></thead>
          <tbody>
            {CREWS.map(([c, l, o, s]) => (
              <tr key={c}>
                <td>{c}</td><td>{l}</td><td>{o}</td>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span className={`bp-dot ${s === "Valid" ? "is-ok" : "is-bad"}`} aria-hidden="true" />
                    <span className={s === "Valid" ? "bp-ok-text" : "bp-warn-text"}>{s}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bp-frame-foot">
        <span className="bp-muted">Certified payroll · week 43</span>
        <span className="bp-ok-text">3 of 4 ready to file</span>
      </div>
    </div>
  );
}

const FRAMES = [BidFrame, RouteFrame, CrewFrame];

/* ------------------------------------------------------- how it works */

function Engine({ status }) {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(() => new Set());
  const refs = useRef([]);

  // Frames play their animation once, the first time they scroll into view.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number(e.target.dataset.index);
          setSeen((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
          io.unobserve(e.target);
        }
      },
      { threshold: 0.25 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // The agent crossing the middle of the viewport is the active one.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="bp-section" aria-labelledby="bp-engine-h">
      <div className="bp-wrap">
        <p className="bp-label">How it works</p>
        <h2 id="bp-engine-h" className="bp-h2">Three agents, one system.</h2>
        <p className="bp-intro">Each agent handles one part of the job and passes its results to the next.</p>

        <div className="bp-engine">
          <nav className="bp-steps" aria-label="Agents">
            <ol>
              {AGENTS.map((a, i) => (
                <li key={a.id}>
                  <a href={`#${a.id}`} aria-current={i === active ? "step" : undefined}>
                    <span className="bp-num">{a.num}</span>
                    {a.name}
                  </a>
                </li>
              ))}
            </ol>
            <StatusLine status={status} />
          </nav>

          <div>
            {AGENTS.map((a, i) => {
              const Frame = FRAMES[i];
              return (
                <article key={a.id} id={a.id} data-index={i} ref={(el) => (refs.current[i] = el)} className={`bp-agent${seen.has(i) ? " is-in" : ""}`} aria-labelledby={`${a.id}-h`}>
                  <span className="bp-bignum" aria-hidden="true">{a.num}</span>
                  <h3 id={`${a.id}-h`}>{a.name}</h3>
                  <p>{a.line}</p>
                  <ul className="bp-checks">
                    {a.features.map((f) => (
                      <li key={f}><Check />{f}</li>
                    ))}
                  </ul>
                  <Frame />
                  <p className="bp-agent-foot">
                    <a className="bp-textlink" href={a.href}>{a.open} →</a>
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- page */

export default function BlueprintHome() {
  const status = useSystemStatus();

  return (
    <>
      <Seo
        title="Software for contractors, subcontractors and suppliers"
        description="D&J Stratagem gives commercial contractors focused agents for bidding, material logistics and labor compliance."
      />
      <div id="top" className="bp">
        <Nav status={status} />

        <main id="main" tabIndex="-1">
          <section className="bp-hero" aria-labelledby="bp-h1">
            <div className="bp-wrap bp-hero-grid">
              <div>
                <p className="bp-kicker">For commercial contractors, subs and suppliers</p>
                <h1 id="bp-h1" className="bp-h1">
                  Hardware for your office. <span>Software for your workforce.</span>
                </h1>
                <p className="bp-lede">
                  Focused agents take the manual work out of bidding, material logistics and labor compliance.
                </p>
                <div className="bp-actions">
                  <Link to="/register" className="bp-btn">Deploy your first agent</Link>
                  <a className="bp-btn is-line" href="/platform">How it works</a>
                </div>
              </div>

              <div className="bp-agents-card">
                <header>
                  <span>Your agents</span>
                  <span className="bp-tag">Sample view</span>
                </header>
                <ul>
                  {AGENTS.map((a) => (
                    <li key={a.id}>
                      <a href={`#${a.id}`}>
                        <span className="bp-num">{a.num}</span>
                        <span>
                          <strong>{a.name}</strong>
                          <small><span className="bp-dot is-ok" aria-hidden="true" />{a.sample}</small>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="bp-hazard" aria-hidden="true" />
          <div className="bp-ticker" aria-label="Sample activity">
            <span className="bp-ticker-tag">Sample activity</span>
            <div className="bp-ticker-track">
              {[0, 1].map((k) => (
                <ul key={k} aria-hidden={k === 1 ? "true" : undefined}>
                  {TICKER.map((t) => (
                    <li key={t}><span className="bp-dot is-ok" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <section className="bp-section is-dark" aria-labelledby="bp-problem-h">
            <div className="bp-wrap bp-problem">
              <div>
                <p className="bp-label">Why Stratagem</p>
                <h2 id="bp-problem-h" className="bp-h2">Stop fighting admin. Start filling the <span>pipeline.</span></h2>
              </div>
              <p>
                Most construction software is either too generic for real trade work or too old to keep up. Stratagem
                works like a back office that runs in the background, keeping jobs profitable and crews compliant.
              </p>
            </div>
          </section>

          <Engine status={status} />

          <section id="integrations" className="bp-section is-alt" aria-labelledby="bp-int-h" style={{ scrollMarginTop: 72 }}>
            <div className="bp-wrap">
              <p className="bp-label">Integrations</p>
              <h2 id="bp-int-h" className="bp-h2">Keep your current stack.</h2>
              <p className="bp-intro">Stratagem works on top of the tools you already run. No rip-and-replace.</p>
              <div className="bp-cards">
                {INTEGRATIONS.map((it) => (
                  <div key={it.label} className="bp-card">
                    <p className="bp-label">{it.label}</p>
                    <h3>{it.title}</h3>
                    <p>{it.copy}</p>
                  </div>
                ))}
              </div>
              <p className="bp-after">
                Don&rsquo;t see your system? <Link className="bp-textlink" to="/contact">Request an integration →</Link>
              </p>
            </div>
          </section>

          <section className="bp-section" aria-labelledby="bp-faq-h">
            <div className="bp-wrap bp-faq">
              <div>
                <p className="bp-label">FAQ</p>
                <h2 id="bp-faq-h" className="bp-h2">Questions contractors ask us.</h2>
              </div>
              <ul className="bp-faq-list">
                {FAQ.map((f) => (
                  <li key={f.q}>
                    <details>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bp-closer" aria-labelledby="bp-close-h">
            <div className="bp-wrap bp-closer-row">
              <div>
                <h2 id="bp-close-h" className="bp-h2 bp-xl">Built for builders who scale.</h2>
                <p className="bp-intro">One system for how projects really move, from award to closeout.</p>
              </div>
              <Link to="/register" className="bp-btn">Get started</Link>
            </div>
          </section>
        </main>

        <footer className="bp-foot">
          <div className="bp-wrap bp-foot-row">
            <span>D&amp;J Stratagem, Inc. · Los Angeles, California</span>
            <nav aria-label="Footer">
              <Link to="/about">About</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/resources">Help center</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
