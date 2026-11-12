import { useEffect, useRef, useState } from "react";
import SubagentMark from "../../shared/SubagentMark";
import FooterNav from "../FooterNav";
import { Arrow, Mark } from "../icons";
import PreviewShell from "../PreviewShell";
import SiteLink from "../SiteLink";
import useActiveSection from "../useActiveSection";
import usePreviewFrame from "../usePreviewFrame";
import {
  HOME,
  concepts,
  exampleDashboard,
  exampleRfq,
  facts,
  fleetPhotos,
  sections,
  subagentItems,
} from "../content";
import "./yard.css";

const yard = concepts.find((c) => c.id === "yard");
const sectionIds = sections.map((s) => s.id);

function Plate({ children, className = "" }) {
  return (
    <div className={`y-plate ${className}`}>
      <span className="y-scan" aria-hidden="true" />
      <span className="y-corner y-corner-tl" aria-hidden="true" />
      <span className="y-corner y-corner-tr" aria-hidden="true" />
      <span className="y-corner y-corner-bl" aria-hidden="true" />
      <span className="y-corner y-corner-br" aria-hidden="true" />
      {children}
    </div>
  );
}

function IndexLinks({ active, onNavigate }) {
  return sections.map((s, i) => (
    <a
      key={s.id}
      className="y-index"
      href={`#${s.id}`}
      aria-current={active === s.id ? "true" : undefined}
      onClick={onNavigate}
    >
      <span>{String(i + 1).padStart(2, "0")}</span>
      {s.label}
    </a>
  ));
}

export default function YardHome() {
  usePreviewFrame(yard.scheme, yard.theme);
  const active = useActiveSection(sectionIds, "start");
  const dialogRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const onClose = () => setMenuOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const closeMenu = () => dialogRef.current?.close();

  return (
    <PreviewShell id="yard">
      <div className="y-shell">
        <header className="y-mobile">
          <SiteLink to="/" className="y-brand">
            <span className="y-brand-mark"><Mark /></span>
            Stratagem
          </SiteLink>
          <button
            type="button"
            className="y-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="yard-menu"
            onClick={() => {
              dialogRef.current?.showModal();
              setMenuOpen(true);
            }}
          >
            Index
          </button>
        </header>
        <dialog
          id="yard-menu"
          ref={dialogRef}
          className="y-dialog"
          aria-label="Section index"
          onClick={(event) => {
            if (event.target === dialogRef.current) closeMenu();
          }}
        >
          <div className="y-dialog-head">
            <span>Sheet index</span>
            <button type="button" className="y-menu-btn" onClick={closeMenu}>Close</button>
          </div>
          <nav>
            <IndexLinks active={active} onNavigate={closeMenu} />
          </nav>
        </dialog>

        <aside className="y-rail">
          <SiteLink to="/" className="y-brand">
            <span className="y-brand-mark"><Mark /></span>
            Stratagem
          </SiteLink>
          <nav aria-label="Sections">
            <IndexLinks active={active} />
          </nav>
          <div className="y-rail-foot">
            <SiteLink className="y-btn y-btn-amber" to={HOME.primary.href}>{HOME.primary.label}</SiteLink>
            <SiteLink className="y-btn y-btn-line" to="/login">Sign in</SiteLink>
          </div>
        </aside>

        <main className="y-main" id="content" tabIndex={-1}>
          <section className="y-hero" id="start" aria-labelledby="yard-h1">
            <SiteLink className="y-new" to={HOME.fleet.href}>
              <b>{HOME.fleet.flag}</b>
              {HOME.fleet.label}
              <Arrow />
            </SiteLink>
            <p className="y-kicker">01 / Los Angeles</p>
            <h1 id="yard-h1">
              {HOME.headline[0]}
              <br />
              <span className="y-accent">{HOME.headline[1]}</span>
            </h1>
            <p className="y-lede">{HOME.lede}</p>
            <div className="y-actions">
              <SiteLink className="y-btn y-btn-amber" to={HOME.primary.href}>{HOME.primary.label}</SiteLink>
              <SiteLink className="y-btn y-btn-line" to={HOME.secondary.href}>{HOME.secondary.label}</SiteLink>
            </div>
            <ul className="y-assurances">
              {HOME.assurances.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <figure className="y-figure">
              <figcaption className="y-caption">
                <span className="y-badge">Example</span>
                {HOME.example}
              </figcaption>
              <Plate>
                <div className="y-dash-top">
                  <span>{HOME.exampleChrome}</span>
                  <span className="y-badge">Example</span>
                </div>
                <div className="y-dash" aria-hidden="true">
                  <div className="y-side">
                    <p>
                      <strong>{exampleDashboard.account}</strong>
                      <span>{exampleDashboard.role}</span>
                    </p>
                    <ul>
                      {["Overview", "Projects", "Bids", "Materials", "Crews", "Fleet"].map((item) => (
                        <li key={item} className={item === "Overview" ? "is-on" : undefined}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="y-work">
                    <header className="y-block" style={{ border: 0, marginBottom: 12 }}>
                      <div>
                        <strong>{exampleDashboard.greeting}</strong>
                        <div style={{ color: "var(--y-faint)", fontSize: 13 }}>{exampleDashboard.sub}</div>
                      </div>
                    </header>
                    <div className="y-metrics">
                      {exampleDashboard.metrics.map((metric) => (
                        <div key={metric.id} className="y-metric">
                          <span>{metric.label}</span>
                          <strong>{metric.value}</strong>
                          <em>{metric.note}</em>
                        </div>
                      ))}
                    </div>
                    <div className="y-split">
                      <div className="y-block">
                        <header>
                          <strong>{exampleDashboard.pursuitsTitle}</strong>
                          <span>{exampleDashboard.pursuitsMeta}</span>
                        </header>
                        <div className="y-scroll">
                          <table className="y-table">
                            <thead>
                              <tr>
                                {["Project", "Trade", "City", "Due", "Status"].map((col) => <th key={col} scope="col">{col}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {exampleDashboard.pursuits.map((row) => (
                                <tr key={row.project}>
                                  <td>{row.project}</td>
                                  <td>{row.trade}</td>
                                  <td>{row.city}</td>
                                  <td>{row.due}</td>
                                  <td>
                                    <span className={`y-pill ${row.status === "Bidding" ? "y-pill-bid" : ""} ${row.status === "Awarded" ? "y-pill-won" : ""}`}>{row.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="y-block">
                        <header>
                          <strong>{exampleDashboard.quoteTitle}</strong>
                          <span>{exampleDashboard.quoteSub}</span>
                        </header>
                        {exampleDashboard.quotes.map((quote) => (
                          <div key={quote.name} className={`y-quote ${quote.flag ? "is-low" : ""}`}>
                            <p>
                              <strong>{quote.name}</strong>
                              <small>{quote.lead}</small>
                            </p>
                            <b>{quote.flag ? `${quote.flag} ${quote.price}` : quote.price}</b>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Plate>
            </figure>

            <ul className="y-aud">
              {HOME.audiences.map((item, i) => (
                <li key={item.id}>
                  <SiteLink to={item.href}>
                    <strong>0{i + 1}</strong>
                    <span>{item.title}</span>
                    <em>{item.cta} <Arrow /></em>
                  </SiteLink>
                </li>
              ))}
            </ul>
          </section>

          <section className="y-section" id="platform" aria-labelledby="yard-platform">
            <div className="y-section-head">
              <div>
                <p className="y-kicker">02 / {HOME.platform.eyebrow}</p>
                <h2 id="yard-platform">{HOME.platform.title}</h2>
              </div>
              <p>{HOME.platform.lede}</p>
            </div>
            <div className="y-tools">
              {HOME.platform.tools.map((tool, i) => (
                <SiteLink key={tool.title} to={tool.href} className="y-tool y-plate">
                  <b>0{i + 1}</b>
                  <strong>{tool.title}</strong>
                  <p>{tool.body}</p>
                  <span>{tool.cta} <Arrow /></span>
                </SiteLink>
              ))}
            </div>
            <div className="y-ai">
              <p><strong>{HOME.ai.name}</strong> {HOME.ai.body}</p>
              <SiteLink to={HOME.ai.href}>{HOME.ai.cta} <Arrow /></SiteLink>
            </div>
          </section>

          <section className="y-section" id="subagents" aria-labelledby="yard-subs">
            <div className="y-section-head">
              <div>
                <p className="y-kicker">03 / {HOME.subagents.eyebrow}</p>
                <h2 id="yard-subs">{HOME.subagents.title}</h2>
              </div>
              <p>{HOME.subagents.lede}</p>
            </div>
            <ul className="y-bom">
              {subagentItems.map((item) => (
                <li key={item.key}>
                  <a href={item.to}>
                    <SubagentMark id={item.key} size={28} />
                    <code>{item.code}</code>
                    <strong>{item.name}</strong>
                    <span>{item.note}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="y-section" id="companies" aria-labelledby="yard-cos">
            <div className="y-section-head">
              <div>
                <p className="y-kicker">04 / Companies</p>
                <h2 id="yard-cos">{HOME.companies.title}</h2>
              </div>
              <p>{HOME.companies.lede}</p>
            </div>
            <article className="y-feature y-plate">
              <div className="y-copy">
                <p className="y-kicker">{HOME.companies.items[0].kicker}</p>
                <h3>{HOME.companies.items[0].title}</h3>
                <p>{HOME.companies.items[0].body}</p>
                <div className="y-co-foot">
                  <span className="y-status">{HOME.companies.items[0].status}</span>
                  <SiteLink className="y-more" to={HOME.companies.items[0].href}>{HOME.companies.items[0].cta} <Arrow /></SiteLink>
                </div>
              </div>
              <div className="y-rfq" aria-hidden="true">
                <header>
                  <span>{exampleRfq.title}</span>
                  <span className="y-badge">Sample</span>
                </header>
                <ul>
                  {exampleRfq.rows.map(([item, qty]) => (
                    <li key={item}><span>{item}</span><span>{qty}</span></li>
                  ))}
                </ul>
                <footer>
                  <span>{exampleRfq.received}</span>
                  <span>{exampleRfq.low}</span>
                </footer>
              </div>
            </article>
            <div className="y-cos">
              {HOME.companies.items.slice(1).map((company) => (
                <article key={company.id} className="y-co y-plate">
                  {company.media === "photos" && (
                    <div className="y-photos">
                      {fleetPhotos.map((photo) => (
                        <figure key={photo.src}>
                          <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} />
                          <figcaption>{photo.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                  {company.planned && (
                    <>
                      <p className="y-kicker">{company.plannedTitle}</p>
                      <ul className="y-planned">
                        {company.planned.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </>
                  )}
                  <p className="y-kicker">{company.kicker}</p>
                  <h3>{company.title}</h3>
                  <p>{company.body}</p>
                  {company.note && <p className="y-note">{company.note}</p>}
                  <div className="y-co-foot">
                    <span className={`y-status ${company.status === "In development" ? "is-wait" : ""}`}>{company.status}</span>
                    <SiteLink className="y-more" to={company.href}>{company.cta} <Arrow /></SiteLink>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="y-section" id="method" aria-labelledby="yard-method">
            <div className="y-section-head">
              <div>
                <p className="y-kicker">05 / {HOME.method.eyebrow}</p>
                <h2 id="yard-method">{HOME.method.title}</h2>
              </div>
            </div>
            <ol className="y-steps">
              {HOME.method.steps.map((step) => (
                <li key={step.n} className="y-step">
                  <b>0{step.n}</b>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                  <p className="y-get"><small>You get</small>{step.get}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="company" aria-labelledby="yard-company">
            <div className="y-nameplate">
              <p className="y-kicker">06 / {HOME.company.eyebrow}</p>
              <h2 id="yard-company">{HOME.company.title}</h2>
              <p className="y-lede">{HOME.company.body}</p>
              <p style={{ marginTop: 16 }}>
                <SiteLink className="y-more" to={HOME.company.href}>{HOME.company.cta} <Arrow /></SiteLink>
              </p>
              <dl className="y-facts">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.email ? <a href={`mailto:${fact.email}`}>{fact.email}</a> : fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="y-cta" aria-labelledby="yard-cta">
            <div>
              <h2 id="yard-cta">{HOME.closing.title}</h2>
              <p>{HOME.closing.body}</p>
            </div>
            <div className="y-actions">
              <SiteLink className="y-btn y-btn-ink" to={HOME.primary.href}>{HOME.primary.label}</SiteLink>
              <SiteLink className="y-btn y-btn-line" to={HOME.closing.secondary.href} style={{ borderColor: "#1a1408" }}>{HOME.closing.secondary.label}</SiteLink>
            </div>
          </section>

          <footer className="y-foot">
            <div className="y-foot-brand">
              <SiteLink to="/" className="y-brand"><span className="y-brand-mark"><Mark /></span>Stratagem</SiteLink>
              <span>D&J Stratagem, Inc.<br />Los Angeles, California</span>
              <a href="mailto:hello@djstratageminc.com">hello@djstratageminc.com</a>
            </div>
            <div className="y-foot-grid">
              <FooterNav listClass="y-foot-col" titleClass="y-foot-title" linkClass="y-foot-link" />
            </div>
            <div className="y-legal">
              <span>© 2026 D&J Stratagem, Inc. All rights reserved.</span>
              <span>Los Angeles, California</span>
            </div>
          </footer>
        </main>
      </div>
    </PreviewShell>
  );
}
