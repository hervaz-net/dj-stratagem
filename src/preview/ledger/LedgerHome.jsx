import { useEffect, useRef, useState } from "react";
import SubagentMark from "../../shared/SubagentMark";
import FooterNav from "../FooterNav";
import PreviewShell from "../PreviewShell";
import SiteLink from "../SiteLink";
import useActiveSection from "../useActiveSection";
import usePreviewFrame from "../usePreviewFrame";
import {
  HOME,
  concepts,
  exampleDashboard,
  facts,
  sections,
  subagentItems,
} from "../content";
import "./ledger.css";

const ledger = concepts.find((c) => c.id === "ledger");
const sectionIds = sections.map((s) => s.id);
const labels = {
  start: "Opening",
  platform: "Platform",
  subagents: "Agents",
  method: "Method",
  company: "Colophon",
};

export default function LedgerHome() {
  usePreviewFrame(ledger.scheme, ledger.theme);
  const active = useActiveSection(sectionIds, "start");
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <PreviewShell id="ledger">
      <header className="l-mast">
        <SiteLink to="/" className="l-brand">{HOME.product}</SiteLink>
        <div className="l-mast-actions">
          <span className="l-meta">{labels[active]}</span>
          <button
            type="button"
            className="l-ul"
            aria-expanded={open}
            aria-controls="ledger-contents"
            onClick={() => {
              dialogRef.current?.showModal();
              setOpen(true);
            }}
          >
            Contents
          </button>
          <SiteLink className="l-ul l-signin" to="/login">Sign in</SiteLink>
          <SiteLink className="l-btn" to={HOME.primary.href}>{HOME.primary.label}</SiteLink>
        </div>
      </header>
      <dialog
        id="ledger-contents"
        ref={dialogRef}
        className="l-dialog"
        aria-label="Contents"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <header>
          <h2>Contents</h2>
          <button type="button" className="l-ul" onClick={close}>Close</button>
        </header>
        <ol>
          {sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} onClick={close}>
                {labels[section.id]}
                <span className="l-meta">{String(index + 1).padStart(2, "0")}</span>
              </a>
            </li>
          ))}
        </ol>
      </dialog>

      <main id="content" tabIndex={-1}>
        <section className="l-wrap l-open" id="start" aria-labelledby="ledger-h1">
          <div className="l-grid">
            <p className="l-margin">01 — Los Angeles</p>
            <div>
              <SiteLink className="l-meta l-ul" to={HOME.fleet.href}>
                {HOME.fleet.flag} — {HOME.fleet.label}
              </SiteLink>
              <h1 id="ledger-h1">
                {HOME.headline[0]} <em>{HOME.headline[1]}</em>
              </h1>
              <p className="l-deck">{HOME.lede}</p>
              <div className="l-actions">
                <SiteLink className="l-btn" to={HOME.primary.href}>{HOME.primary.label}</SiteLink>
                <SiteLink className="l-ul" to={HOME.secondary.href}>{HOME.secondary.label}</SiteLink>
              </div>
              <p className="l-assure">{HOME.assurances.join(" · ")}</p>
            </div>
          </div>
        </section>

        <section className="l-wrap l-figure" aria-labelledby="ledger-fig">
          <div className="l-grid">
            <p className="l-margin" id="ledger-fig">Fig. I</p>
            <figure>
              <div className="l-sheet">
                <header>
                  <span>{exampleDashboard.account} · {exampleDashboard.role}</span>
                  <span>{exampleDashboard.sub}</span>
                </header>
                <ul className="l-nav">
                  {subagentItems.map((item) => <li key={item.key}>{item.name}</li>)}
                </ul>
                <dl className="l-metrics">
                  {exampleDashboard.metrics.map((metric) => (
                    <div key={metric.id}>
                      <dt>{metric.label}</dt>
                      <dd>{metric.value}<small>{metric.note}</small></dd>
                    </div>
                  ))}
                </dl>
                <div className="l-scroll">
                  <table className="l-table">
                    <caption>{exampleDashboard.pursuitsTitle} · {exampleDashboard.pursuitsMeta}</caption>
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
                          <td>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <table className="l-table">
                    <caption>{exampleDashboard.quoteTitle}</caption>
                    <thead>
                      <tr>
                        <th scope="col">{exampleDashboard.quoteSub}</th>
                        <th scope="col">Lead time</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exampleDashboard.quotes.map((quote) => (
                        <tr key={quote.name} className={quote.flag ? "l-low" : undefined}>
                          <td>{quote.name}{quote.flag ? ` · ${quote.flag}` : ""}</td>
                          <td>{quote.lead}</td>
                          <td>{quote.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </figure>
          </div>
        </section>

        <section className="l-wrap l-section" aria-label="Who it is for">
          <div className="l-grid">
            <p className="l-margin">For</p>
            <div className="l-cols">
              {HOME.audiences.map((item) => (
                <article key={item.id}>
                  <p className="l-meta">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <SiteLink className="l-ul" to={item.href}>{item.cta}</SiteLink>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="l-wrap l-section" id="platform" aria-labelledby="ledger-platform">
          <div className="l-grid">
            <p className="l-margin">02 — {HOME.platform.eyebrow}</p>
            <div>
              <h2 id="ledger-platform">{HOME.platform.title}</h2>
              <p className="l-lede">{HOME.platform.lede}</p>
              <ol className="l-tools">
                {HOME.platform.tools.map((tool, index) => (
                  <li key={tool.title}>
                    <b>0{index + 1}</b>
                    <div>
                      <h3>{tool.title}</h3>
                      <p>{tool.body}</p>
                      <SiteLink className="l-ul" to={tool.href}>{tool.cta}</SiteLink>
                    </div>
                  </li>
                ))}
              </ol>
              <blockquote className="l-pull">
                <em>{HOME.ai.body}</em>
                <footer>
                  {HOME.ai.name} <SiteLink className="l-ul" to={HOME.ai.href}>{HOME.ai.cta}</SiteLink>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="l-wrap l-section" id="subagents" aria-labelledby="ledger-subs">
          <div className="l-grid">
            <p className="l-margin">03</p>
            <div>
              <h2 id="ledger-subs">{HOME.subagents.title}</h2>
              <p className="l-lede">{HOME.subagents.lede}</p>
              <ul className="l-toc">
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
            </div>
          </div>
        </section>

        <section className="l-wrap l-section" id="method" aria-labelledby="ledger-method">
          <div className="l-grid">
            <p className="l-margin">04</p>
            <div>
              <p className="l-meta">{HOME.method.eyebrow}</p>
              <h2 id="ledger-method">{HOME.method.title}</h2>
              <ol className="l-steps">
                {HOME.method.steps.map((step) => (
                  <li key={step.n}>
                    <b>{step.n}</b>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                    <p className="l-get"><small>You get</small>{step.get}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="l-wrap l-section" id="company" aria-labelledby="ledger-company">
          <div className="l-grid">
            <p className="l-margin">05</p>
            <div>
              <p className="l-meta">{HOME.company.eyebrow}</p>
              <h2 id="ledger-company">{HOME.company.title}</h2>
              <p className="l-lede l-drop">{HOME.company.body}</p>
              <p style={{ marginTop: 14 }}>
                <SiteLink className="l-ul" to={HOME.company.href}>{HOME.company.cta}</SiteLink>
              </p>
              <dl className="l-facts">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.email ? <a className="l-ul" href={`mailto:${fact.email}`}>{fact.email}</a> : fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="l-wrap l-close" aria-labelledby="ledger-cta">
          <div className="l-grid">
            <p className="l-margin">Join</p>
            <div>
              <h2 id="ledger-cta">{HOME.closing.title}</h2>
              <p className="l-lede">{HOME.closing.body}</p>
              <div className="l-actions">
                <SiteLink className="l-btn" to={HOME.primary.href}>{HOME.primary.label}</SiteLink>
                <SiteLink className="l-ul" to={HOME.closing.secondary.href}>{HOME.closing.secondary.label}</SiteLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="l-wrap l-foot">
        <div className="l-foot-top">
          <div>
            <SiteLink to="/" className="l-brand">{HOME.product}</SiteLink>
            <p className="l-note">D&J Stratagem, Inc. · Los Angeles, California</p>
          </div>
          <a className="l-ul" href="mailto:hello@djstratageminc.com">hello@djstratageminc.com</a>
        </div>
        <div className="l-foot-grid">
          <FooterNav listClass="l-foot-col" titleClass="l-foot-title" linkClass="l-foot-link" />
        </div>
        <div className="l-legal">
          <span>© 2026 D&J Stratagem, Inc. All rights reserved.</span>
          <span>Set in Fraunces and Source Sans 3.</span>
        </div>
      </footer>
    </PreviewShell>
  );
}
