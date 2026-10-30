import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import "../styles/blueprint.css";

/**
 * Blueprint homepage at "/": monochrome #0D0D0D, one orange accent, 1px grid
 * lines, monospace system text. Renders its own nav and footer, so App mounts
 * it outside MarketingLayout. The three UI frames are sample views (PROOF.md):
 * they show what each agent does, not anyone's real data.
 *
 * /projects, /supply, /workforce and /platform belong to the ventures app, so
 * they are plain anchors (full load); in-app routes use <Link>.
 */

const AGENTS = [
  {
    id: "agent-bidding",
    code: "01_BIDDING_AGENT",
    core: "01_BIDDING_CORE",
    suite: "Suite 01: The Bidding Agent",
    header: "[SUBAGENT_01] // THE CONTRACT & BIDDING UTILITY",
    blurb: "Automated Estimating & RFPs",
    features: ["RFP Ingestion", "Margin Protection", "Compliance Flagging"],
    copy:
      "Instantly ingest complex public and private RFP documents. This agent extracts hard technical constraints, cross-references regional historical data, and flags strict compliance mandates before you submit, allowing you to bid wider margins with complete legal confidence.",
    telemetry: ["Reading RFP documentation...", "Extracting compliance bounds...", "Calculating local wage rates..."],
    href: "/projects",
    open: "Open the project board",
  },
  {
    id: "agent-logistics",
    code: "02_LOGISTICS_AGENT",
    core: "02_LOGISTICS_CORE",
    suite: "Suite 02: The Logistics Agent",
    header: "[SUBAGENT_02] // THE LOGISTICAL ROUTING AGENT",
    blurb: "Supply Chain & Hauling",
    features: ["Material Matching", "Fleet Routing", "Lead Time Tracking"],
    copy:
      "Keep tracking logs clean and hauling trucks moving. This agent automates delivery workflows, cross-checks physical material availability with localized suppliers, and highlights supply chain bottlenecks before they stall a job site.",
    telemetry: ["Mapping material supply lines...", "Optimizing haul routes...", "Flagging delivery lead times..."],
    href: "/supply",
    open: "Open Supply",
  },
  {
    id: "agent-workforce",
    code: "03_WORKFORCE_AGENT",
    core: "03_WORKFORCE_CORE",
    suite: "Suite 03: The Workforce Agent",
    header: "[SUBAGENT_03] // THE COMPLIANT WORKFORCE INTELLIGENCE",
    blurb: "Compliance & Labor Dispatch",
    features: ["OSHA Credential Audit", "Certified Payroll Automation", "Trade Matching"],
    copy:
      "From dispatching trusted tradespeople to finalizing certified payroll structures. This agent validates credentials, cross-references OSHA compliance logs, and automates multi-tier labor paperwork so you can scale field crews without multiplying your overhead risks.",
    telemetry: ["Auditing trade licenses...", "Cross-referencing OSHA database...", "Syncing certified payroll data..."],
    href: "/workforce",
    open: "Open Workforce",
  },
];

const INTEGRATIONS = [
  {
    label: "[INTEGRATION_01] // ERP & COLLABORATION HUBS",
    title: "Construction & project management software",
    copy:
      "Sync your subagent actions with systems like Procore, Autodesk Construction Cloud, and general enterprise ERPs. The platform monitors active project sheets, flags change orders, and transfers logistical updates back to your team's existing dashboards without manual copy-pasting.",
  },
  {
    label: "[INTEGRATION_02] // GOVERNMENT & MUNICIPAL DATASTORES",
    title: "Public procurement & bidding portals",
    copy:
      "Connect to regional public works registries, electronic bidding networks, and municipal portals. Subagents monitor designated directories continuously, pulling down new RFP document suites the moment they go live to calculate structural matches instantly.",
  },
  {
    label: "[INTEGRATION_03] // LEDGER & ACCOUNTING INFRASTRUCTURE",
    title: "Financial, payroll & compliance engines",
    copy:
      "Route workforce data into enterprise financial pipelines including QuickBooks Enterprise, Sage 300, and local certified payroll clearinghouses. Automate labor reporting records, credential validity receipts, and compliance audit trail ledgers.",
  },
];

const FAQ = [
  {
    q: 'What exactly is a D&J Stratagem "Subagent" and how does it execute work?',
    a: "A subagent is not a generic chat window. It is a specialized background program running on our platform. Once you feed it a data parameter, like a municipal RFP document or a hauling schedule, the agent executes specific processes. It parses technical specifications, matches compliance matrices, or runs logistical routing variations automatically, delivering finalized data packages directly back to your dashboard.",
  },
  {
    q: "Construction compliance is legally strict. How reliable is your AI data parsing?",
    a: 'Our platform is built to counter the "hallucination" problems found in consumer AI tools. Stratagem subagents operate within bounded parameters drawn from regulatory sources, standard public bidding formats, and localized labor rules. The system does not guess: it flags discrepancies, cross-checks variables, and highlights potential risks for human verification before anything is submitted.',
  },
  {
    q: "Does this software completely replace our existing tools or integrate with them?",
    a: "Stratagem is designed to act as a coordination layer. It doesn't force you to rip out your operational tech. Through our integration pipeline, the platform ingests and pushes clean data to standard construction management databases, enterprise ERP systems, and municipal bidding networks via JSON/CSV or API connections.",
  },
  {
    q: "How is our proprietary estimating and bidding data secured?",
    a: "Data isolation is a core tenet of our architecture. Your bidding history, supplier margins, and workforce details are encrypted in transit and walled off to your company account. Our agents are never trained on your proprietary business documentation.",
  },
];

/** Reads the real PHP health probe; the status chip never claims more than it saw. */
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

const STATUS_TEXT = { checking: "CHECKING...", ok: "OPERATIONAL", bad: "UNREACHABLE" };

function StatusChip({ status }) {
  return (
    <span className="bp-status" role="status">
      <span className={`bp-dot ${status === "ok" ? "is-ok" : status === "bad" ? "is-bad" : ""}`} aria-hidden="true" />
      SYSTEM STATUS: {STATUS_TEXT[status]}
    </span>
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

  return (
    <header className="bp-nav" ref={ref}>
      <div className="bp-wrap bp-nav-row">
        <a href="#top" className="bp-brand" aria-label="D&J Stratagem home">
          [D&amp;J <span>STRATAGEM</span>]
        </a>
        <nav className="bp-links" aria-label="Main">
          <span className="bp-prefix">// PLATFORM:</span>
          <button
            type="button"
            className="bp-link"
            aria-expanded={open}
            aria-controls="bp-directory"
            onClick={() => setOpen((v) => !v)}
          >
            [Subagents {open ? "^" : "v"}]
          </button>
          <a className="bp-link" href="#integrations">[Integrations]</a>
          <a className="bp-link" href="/workforce">[Workforce]</a>
          <span className="bp-sep" aria-hidden="true" />
          <Link className="bp-link" to="/resources">[Docs]</Link>
        </nav>
        <StatusChip status={status} />
        <Link to="/register" className="bp-btn bp-btn-sm bp-nav-cta">Deploy Agent</Link>
        <button
          type="button"
          className="bp-link bp-menu-btn"
          aria-expanded={open}
          aria-controls="bp-directory"
          onClick={() => setOpen((v) => !v)}
        >
          [{open ? "Close" : "Menu"}]
        </button>
      </div>

      {open && (
        <div id="bp-directory" className="bp-drawer">
          <div className="bp-wrap">
            <div className="bp-drawer-mobile bp-mono">
              <a className="bp-link" href="#integrations" onClick={() => setOpen(false)}>[Integrations]</a>
              <a className="bp-link" href="/workforce">[Workforce]</a>
              <Link className="bp-link" to="/resources">[Docs]</Link>
              <Link className="bp-link" to="/login">[Sign in]</Link>
              <Link to="/register" className="bp-btn bp-btn-sm" style={{ marginTop: 8 }}>Deploy Agent</Link>
              <StatusChip status={status} />
            </div>
            <p className="bp-drawer-head bp-eyebrow" style={{ margin: 0 }}>
              System directory // choose a suite to deploy
            </p>
            <div className="bp-drawer-grid">
              {AGENTS.map((a) => (
                <div key={a.core} className="bp-drawer-col">
                  <h3>[{a.core}]</h3>
                  <p>{a.blurb}</p>
                  <ul>
                    {a.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <a className="bp-open" href={`#${a.id}`} onClick={() => setOpen(false)}>&gt; View telemetry</a>
                </div>
              ))}
            </div>
            <div className="bp-drawer-foot">
              <a href="/platform">&gt; View system architecture specs</a>
              <Link to="/companies">&gt; All nine subagent companies</Link>
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
      <span className="bp-tag">SAMPLE VIEW</span>
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
      <FrameBar title="bidding_agent / public_bids?filter=match>80" />
      <div className="bp-scroll">
        <table className="bp-table">
          <thead>
            <tr><th>Listing</th><th>City</th><th>Trade</th><th className="num">Line total</th><th>Compliance</th></tr>
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
      <div className="bp-scroll" style={{ borderTop: "1px solid var(--bp-line)" }}>
        <table className="bp-table">
          <thead>
            <tr><th>Line item · Civic center roof</th><th className="num">Qty</th><th className="num">Unit</th><th className="num">Cost</th></tr>
          </thead>
          <tbody>
            <tr><td>Tear-off, built-up roofing</td><td className="num">18,400 sf</td><td className="num">$2.10</td><td className="num">$38,640</td></tr>
            <tr><td>Modified bitumen, 2-ply</td><td className="num">18,400 sf</td><td className="num">$6.85</td><td className="num">$126,040</td></tr>
            <tr><td>Labor, prevailing wage adj.</td><td className="num">412 hr</td><td className="num">$81.60</td><td className="num">$33,620</td></tr>
          </tbody>
        </table>
      </div>
      <div className="bp-frame-foot">
        <span className="bp-muted">{compiled ? "> Package compiled. 3 files ready (sample)." : "3 listings · 1 package draft"}</span>
        <button type="button" className="bp-btn bp-btn-sm" onClick={() => setCompiled(true)} disabled={compiled}>
          {compiled ? "Compiled" : "Compile Package"}
        </button>
      </div>
    </div>
  );
}

function RouteFrame() {
  // Plain vector route: supplier yard -> two drops, one flagged for lead time.
  return (
    <div className="bp-frame">
      <FrameBar title="logistics_agent / routes/today" />
      <svg className="bp-map" viewBox="0 0 640 260" role="img" aria-label="Sample route map: supplier yard to two job sites, one delivery flagged for lead time">
        <defs>
          <pattern id="bp-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#1a1a1a" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="640" height="260" fill="url(#bp-grid)" />
        <path d="M40 200 L180 200 L180 120 L360 120 L360 60 L560 60" fill="none" stroke="#3a3a3a" strokeWidth="8" />
        <path d="M360 120 L520 200" fill="none" stroke="#3a3a3a" strokeWidth="8" />
        <path d="M40 200 L180 200 L180 120 L360 120 L360 60 L560 60" fill="none" stroke="#ff6b00" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M360 120 L520 200" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 6" />
        <g fontFamily="ui-monospace, Menlo, monospace" fontSize="11" fill="#cfcfcf">
          <rect x="30" y="190" width="20" height="20" fill="#0d0d0d" stroke="#ffffff" />
          <text x="20" y="232">YARD · REBAR + MESH</text>
          <circle cx="560" cy="60" r="9" fill="#0d0d0d" stroke="#3ddc84" strokeWidth="2" />
          <path d="M555 60 l4 4 l7 -8" fill="none" stroke="#3ddc84" strokeWidth="2" />
          <text x="470" y="36">SITE A · 07:40 ETA ✓</text>
          <circle cx="520" cy="200" r="9" fill="#0d0d0d" stroke="#ff6b00" strokeWidth="2" />
          <text x="514" y="204" fill="#ff6b00">!</text>
          <text x="420" y="232" fill="#ff6b00">SITE B · LEAD TIME +3D</text>
          <text x="196" y="112">I-10 E · 18 mi</text>
        </g>
      </svg>
      <div className="bp-scroll" style={{ borderTop: "1px solid var(--bp-line)" }}>
        <table className="bp-table">
          <thead><tr><th>Load</th><th>Material</th><th>Supplier stock</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>L-0412</td><td>#5 rebar, 40 tons</td><td className="bp-ok-text">✓ In stock</td><td className="bp-ok-text">Routed</td></tr>
            <tr><td>L-0413</td><td>Welded wire mesh</td><td className="bp-warn-text">Backorder</td><td className="bp-warn-text">Flagged</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CREWS = [
  ["Crew 14 · Electrical", "C-10 license", "OSHA 30", "Valid"],
  ["Crew 22 · Concrete", "C-8 license", "OSHA 10", "Valid"],
  ["Crew 31 · Roofing", "C-39 license", "OSHA 10", "Valid"],
  ["Crew 09 · Framing", "B license", "OSHA 10", "Renew in 12d"],
];

function CrewFrame() {
  return (
    <div className="bp-frame">
      <FrameBar title="workforce_agent / crews?credentials=all" />
      <div className="bp-scroll">
        <table className="bp-table">
          <thead><tr><th>Crew</th><th>Trade license</th><th>Safety</th><th>Credential status</th></tr></thead>
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
        <span className="bp-muted">Certified payroll · week 43 · 4 crews</span>
        <span className="bp-ok-text">3 of 4 ready to file</span>
      </div>
    </div>
  );
}

const FRAMES = [BidFrame, RouteFrame, CrewFrame];

/* ------------------------------------------------------- deployment engine */

function Engine({ status }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  // The suite crossing the middle of the viewport is the active one.
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
        <div className="bp-engine-head">
          <p className="bp-eyebrow">// Interactive blueprint</p>
          <h2 id="bp-engine-h" className="bp-h2">The Stratagem Deployment Engine</h2>
        </div>
        <div className="bp-engine">
          <aside className="bp-node" aria-label="Command node">
            <div className="bp-node-inner">
              <h3>THE COMMAND NODE</h3>
              <div className="bp-rule" />
              <dl>
                <dt>Active subagents:</dt>
                <dd>03</dd>
                <dt>System status:</dt>
                <dd>
                  <span className={`bp-dot ${status === "ok" ? "is-ok" : status === "bad" ? "is-bad" : ""}`} aria-hidden="true" />
                  {status === "ok" ? "Operational" : status === "bad" ? "Unreachable" : "Checking..."}
                </dd>
              </dl>
              <ol className="bp-tree">
                {AGENTS.map((a, i) => (
                  <li key={a.id}>
                    <a href={`#${a.id}`} aria-current={i === active ? "step" : undefined}>
                      <span className="bp-box" aria-hidden="true" />
                      {a.code}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="bp-node-note">Scroll to step through each agent. UI frames are sample views.</p>
            </div>
          </aside>

          <div>
            {AGENTS.map((a, i) => {
              const Frame = FRAMES[i];
              return (
                <article
                  key={a.id}
                  id={a.id}
                  data-index={i}
                  ref={(el) => (refs.current[i] = el)}
                  className="bp-suite"
                  aria-labelledby={`${a.id}-h`}
                >
                  <p className="bp-eyebrow">{a.suite}</p>
                  <h3 id={`${a.id}-h`}>{a.header}</h3>
                  <p className="bp-body">{a.copy}</p>
                  <div className="bp-telemetry" aria-label="Telemetry">
                    <p className="bp-tlabel">Telemetry:</p>
                    {a.telemetry.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                  <Frame />
                  <p className="bp-suite-foot">
                    <a className="bp-textlink" href={a.href}>&gt; {a.open}</a>
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

  // Paint the root dark too, so overscroll and scroll gaps never flash the light site background.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.backgroundColor;
    root.style.backgroundColor = "#0d0d0d";
    return () => {
      root.style.backgroundColor = prev;
    };
  }, []);

  return (
    <>
      <Seo
        title="Software for contractors, subcontractors and suppliers"
        description="D&J Stratagem deploys targeted digital subagents that take the manual drag out of bidding, logistical routing, and labor compliance for commercial construction."
      />
      <div id="top" className="bp">
        <Nav status={status} />

        <main id="main" tabIndex="-1">
          <section className="bp-section bp-hero" aria-labelledby="bp-h1">
            <div className="bp-wrap">
              <p className="bp-eyebrow">// Stratagem architecture v2.6</p>
              <h1 id="bp-h1" className="bp-h1">
                Hardware for your office. <em>Software for your workforce.</em>
              </h1>
              <p className="bp-lede">
                D&amp;J Stratagem is a unified technology platform built specifically for commercial contractors,
                subcontractors, and suppliers. We don&rsquo;t deal in generic AI gimmicks. We deploy targeted digital
                subagents that take the manual drag out of bidding, logistical routing, and labor compliance.
              </p>
              <div className="bp-actions">
                <Link to="/register" className="bp-btn">Deploy Your First Agent</Link>
                <a className="bp-textlink" href="/platform">&gt; Read Technical Specs</a>
              </div>
            </div>
          </section>

          <section className="bp-section" aria-labelledby="bp-problem-h">
            <div className="bp-wrap bp-split">
              <div>
                <p className="bp-eyebrow">// The philosophy switch</p>
                <h2 id="bp-problem-h" className="bp-h2">Stop fighting admin. Start filling the pipeline.</h2>
              </div>
              <div>
                <p className="bp-body">
                  Most software built for construction companies is either too generic to understand real trade
                  mechanics or too old to handle modern data speed. D&amp;J Stratagem bridges that gap. We designed our
                  system to act like a highly trained digital back office that runs silently in the background,
                  keeping your projects profitable and your crews compliant.
                </p>
              </div>
            </div>
          </section>

          <Engine status={status} />

          <section id="integrations" className="bp-section" aria-labelledby="bp-int-h" style={{ scrollMarginTop: 61 }}>
            <div className="bp-wrap">
              <div className="bp-split">
                <div>
                  <p className="bp-eyebrow">// Pipeline_connectivity_matrix</p>
                  <h2 id="bp-int-h" className="bp-h2">Unify your data lakes. Keep your current stack.</h2>
                </div>
                <div>
                  <p className="bp-body">
                    D&amp;J Stratagem does not force your company to abandon its reliable core infrastructure. Our
                    platform operates as a secure execution layer that sits on top of your existing environments,
                    pulling loose files, logs, and sheets into a single, automated intelligence node.
                  </p>
                </div>
              </div>
              <div className="bp-scroll" style={{ borderTop: "1px solid var(--bp-line)" }}>
                <table className="bp-table bp-matrix" style={{ fontFamily: "var(--bp-sans)", fontSize: 15 }}>
                  <tbody>
                    {INTEGRATIONS.map((it) => (
                      <tr key={it.label}>
                        <td style={{ width: "34%", padding: "24px 24px 24px 0", verticalAlign: "top", whiteSpace: "normal" }}>
                          <p className="bp-eyebrow" style={{ margin: 0 }}>{it.label}</p>
                          <p style={{ margin: "8px 0 0", fontWeight: 600 }}>{it.title}</p>
                        </td>
                        <td style={{ padding: "24px 0", verticalAlign: "top", whiteSpace: "normal", lineHeight: 1.7, color: "#cfcfcf" }}>
                          {it.copy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="bp-muted bp-mono" style={{ margin: 0, padding: "16px 0 28px", fontSize: 12, borderTop: "1px solid var(--bp-line)" }}>
                Don&rsquo;t see your system? <Link className="bp-textlink" to="/contact">&gt; Request an integration</Link>
              </p>
            </div>
          </section>

          <section className="bp-section" aria-labelledby="bp-faq-h">
            <div className="bp-wrap bp-faq">
              <div className="bp-faq-head">
                <p className="bp-eyebrow">// Operational verification [FAQ]</p>
                <h2 id="bp-faq-h" className="bp-h2">System integrity &amp; secure protocols.</h2>
              </div>
              <ul className="bp-faq-list">
                {FAQ.map((f, i) => (
                  <li key={f.q}>
                    <details open={i === 0}>
                      <summary>
                        <span className="bp-q">Q{i + 1}</span>
                        <span>{f.q}</span>
                      </summary>
                      <p>{f.a}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bp-section bp-closer" aria-labelledby="bp-close-h">
            <div className="bp-wrap">
              <p className="bp-eyebrow">// Conversion zone</p>
              <h2 id="bp-close-h" className="bp-h2">Built for builders who scale.</h2>
              <p className="bp-lede">
                Get away from messy text strings, disconnected apps, and fractured workflows. Deploy a unified system
                built around how actual physical construction projects move from award to closeout.
              </p>
              <div className="bp-actions">
                <Link to="/register" className="bp-btn">Initialize Your Environment</Link>
              </div>
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
