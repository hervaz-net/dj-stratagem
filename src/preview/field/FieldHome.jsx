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
  facts,
  fleetPhotos,
  navFocus,
  roleNames,
  sections,
  subagentItems,
  workspaceAccount,
} from "../content";
import "./field.css";

const field = concepts.find((c) => c.id === "field");
const sectionIds = sections.map((s) => s.id);

function moveIndex(current, delta, length) {
  return (current + delta + length) % length;
}

export default function FieldHome() {
  usePreviewFrame(field.scheme, field.theme);
  const active = useActiveSection(sectionIds, "start");
  const [role, setRole] = useState(HOME.audiences[0].id);
  const roleRefs = useRef([]);
  const dialogRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const audience = HOME.audiences.find((item) => item.id === role);
  const roleIndex = HOME.audiences.findIndex((item) => item.id === role);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const onClose = () => setMenuOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const onRoleKey = (event) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = moveIndex(roleIndex, delta, HOME.audiences.length);
    setRole(HOME.audiences[next].id);
    roleRefs.current[next]?.focus();
  };

  const focusedKey = navFocus[role];
  const focused = subagentItems.find((item) => item.key === focusedKey);

  return (
    <PreviewShell id="field">
      <div className="f-navwrap">
        <header className="f-nav">
          <SiteLink to="/" className="f-brand">
            <span className="f-brand-mark"><Mark /></span>
            {HOME.product}
          </SiteLink>
          <nav className="f-nav-links" aria-label="Sections">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? "true" : undefined}>
                {section.label}
              </a>
            ))}
          </nav>
          <div className="f-nav-end">
            <button
              type="button"
              className="f-menu-btn"
              aria-expanded={menuOpen}
              aria-controls="field-menu"
              onClick={() => {
                dialogRef.current?.showModal();
                setMenuOpen(true);
              }}
            >
              Menu
            </button>
            <SiteLink className="f-signin" to="/login">Sign in</SiteLink>
            <SiteLink className="f-btn f-btn-teal f-nav-cta" to={HOME.primary.href}>
              <span className="f-nav-long">{HOME.primary.label}</span>
              <span className="f-nav-short">Join</span>
            </SiteLink>
          </div>
        </header>
      </div>
      <dialog
        id="field-menu"
        ref={dialogRef}
        className="f-dialog"
        aria-label="Sections"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <header>
          <strong>{HOME.product}</strong>
          <button type="button" onClick={() => dialogRef.current?.close()}>Close</button>
        </header>
        <nav>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} onClick={() => dialogRef.current?.close()}>{section.label}</a>
          ))}
          <SiteLink to="/login" onClick={() => dialogRef.current?.close()}>Sign in</SiteLink>
        </nav>
      </dialog>

      <main id="content" tabIndex={-1}>
        <section className="f-hero" id="start" aria-labelledby="field-h1">
          <div className="f-wrap f-hero-copy">
            <SiteLink className="f-kicker" to={HOME.fleet.href}>
              <b>{HOME.fleet.flag}</b>
              {HOME.fleet.label}
            </SiteLink>
            <h1 id="field-h1">
              {HOME.headline[0]}<br />{HOME.headline[1]}
            </h1>
            <div className="f-hero-split">
              <div>
                <p className="f-lede">{HOME.lede}</p>
                <div className="f-actions">
                  <SiteLink className="f-btn f-btn-teal" to={HOME.primary.href}>{HOME.primary.label} <Arrow /></SiteLink>
                  <SiteLink className="f-btn f-btn-line" to={HOME.secondary.href}>{HOME.secondary.label}</SiteLink>
                </div>
                <ul className="f-assure">
                  {HOME.assurances.map((item) => (
                    <li key={item}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3 8.2 6.4 11.5 13 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="f-seg" role="radiogroup" aria-label="Show the workspace for" onKeyDown={onRoleKey}>
                  {HOME.audiences.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={item.id === role}
                      tabIndex={item.id === role ? 0 : -1}
                      ref={(node) => { roleRefs.current[index] = node; }}
                      onClick={() => setRole(item.id)}
                    >
                      {item.id === "gc" ? "Contractors" : item.id === "sub" ? "Subcontractors" : "Suppliers"}
                    </button>
                  ))}
                </div>
                <p className="f-roleline" aria-live="polite">
                  {audience.title}{" "}
                  <SiteLink to={audience.href}>{audience.cta}</SiteLink>
                </p>
              </div>
            </div>
          </div>
          <div className="f-stage">
            <div className="f-wrap">
            <figure className="f-frame-rise" aria-label="Dashboard">
              <div className="f-frame">
                <div className="f-frame-bar">
                  <span>{HOME.product}</span>
                  <span>{workspaceAccount}</span>
                </div>
                <div className="f-frame-body" aria-hidden="true">
                  <div className="f-dash">
                  <div className="f-side">
                    <ul>
                      {subagentItems.map((item) => (
                        <li key={item.key} className={item.key === focusedKey ? "is-on" : undefined}>{item.name}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="f-work">
                  <div className="f-account">
                    <strong>{workspaceAccount}</strong>
                    <span>{roleNames[role]}</span>
                  </div>
                  <div className="f-focus">
                    <h2>{focused.name}</h2>
                    <p>{focused.note}</p>
                    <p>{audience.title}</p>
                  </div>
                  </div>
                  </div>
                </div>
              </div>
            </figure>
            </div>
          </div>
        </section>

        <section className="f-section" id="platform" aria-labelledby="field-platform">
          <div className="f-wrap">
            <div className="f-head">
              <div>
                <p className="f-eyebrow">{HOME.platform.eyebrow}</p>
                <h2 id="field-platform">{HOME.platform.title}</h2>
              </div>
              <p>{HOME.platform.lede}</p>
            </div>
            <div className="f-bento">
              {HOME.platform.tools.map((tool, index) => (
                <SiteLink key={tool.title} to={tool.href} className={`f-card ${index === 0 ? "f-card-lg" : ""}`}>
                  <h3>{tool.title}</h3>
                  <p>{tool.body}</p>
                  <span>{tool.cta} <Arrow /></span>
                </SiteLink>
              ))}
            </div>
            <div className="f-ai">
              <p><strong>{HOME.ai.name}</strong> {HOME.ai.body}</p>
              <SiteLink to={HOME.ai.href}>{HOME.ai.cta} <Arrow /></SiteLink>
            </div>
          </div>
        </section>

        <section className="f-section" id="subagents" aria-labelledby="field-subs" style={{ paddingTop: 0 }}>
          <div className="f-wrap">
            <div className="f-head">
              <div>
                <p className="f-eyebrow">{HOME.subagents.eyebrow}</p>
                <h2 id="field-subs">{HOME.subagents.title}</h2>
              </div>
              <p>{HOME.subagents.lede}</p>
            </div>
            <div className="f-agents">
              {subagentItems.map((item) => (
                <a key={item.key} className="f-agent" href={item.to}>
                  <header>
                    <SubagentMark id={item.key} size={32} />
                    <code>{item.code}</code>
                  </header>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </a>
              ))}
            </div>
            <aside className="f-fleet">
              <div>
                <p className="f-eyebrow">{HOME.fleetStrip.eyebrow}</p>
                <h3>{HOME.fleetStrip.title}</h3>
                <p>{HOME.fleetStrip.body}</p>
                <SiteLink className="f-more" to={HOME.fleetStrip.href}>{HOME.fleetStrip.cta} <Arrow /></SiteLink>
              </div>
              <div className="f-photos">
                {fleetPhotos.map((photo) => (
                  <figure key={photo.src}>
                    <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" />
                    <figcaption>{photo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="f-section" id="method" aria-labelledby="field-method" style={{ paddingTop: 0 }}>
          <div className="f-wrap">
            <div className="f-head">
              <div>
                <p className="f-eyebrow">{HOME.method.eyebrow}</p>
                <h2 id="field-method">{HOME.method.title}</h2>
              </div>
            </div>
            <div className="f-method">
              <div className="f-rail" aria-hidden="true"><span /></div>
              <ol className="f-steps">
                {HOME.method.steps.map((step) => (
                  <li key={step.n} className="f-step">
                    <div>
                      <h3><b>{step.n}</b>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                    <p className="f-get"><small>You get</small>{step.get}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="f-section" id="company" aria-labelledby="field-company" style={{ paddingTop: 0 }}>
          <div className="f-wrap">
            <p className="f-eyebrow">{HOME.company.eyebrow}</p>
            <h2 id="field-company">{HOME.company.title}</h2>
            <p className="f-lede">{HOME.company.body}</p>
            <p style={{ marginTop: 12 }}>
              <SiteLink className="f-more" to={HOME.company.href}>{HOME.company.cta} <Arrow /></SiteLink>
            </p>
            <dl className="f-facts">
              {facts.map((fact) => (
                <div key={fact.label} className="f-fact">
                  <dt>{fact.label}</dt>
                  <dd>{fact.email ? <a href={`mailto:${fact.email}`}>{fact.email}</a> : fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className="f-cta">
              <div>
                <h2>{HOME.closing.title}</h2>
                <p>{HOME.closing.body}</p>
              </div>
              <div className="f-actions">
                <SiteLink className="f-btn f-btn-white" to={HOME.primary.href}>{HOME.primary.label}</SiteLink>
                <SiteLink className="f-btn f-btn-ghost" to={HOME.closing.secondary.href}>{HOME.closing.secondary.label}</SiteLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="f-wrap f-foot">
        <div className="f-foot-top">
          <div>
            <SiteLink to="/" className="f-brand"><span className="f-brand-mark"><Mark /></span>{HOME.product}</SiteLink>
            <p style={{ color: "var(--f-muted)" }}>D&J Stratagem, Inc. · Los Angeles, California</p>
          </div>
          <a href="mailto:hello@djstratageminc.com">hello@djstratageminc.com</a>
        </div>
        <div className="f-foot-grid">
          <FooterNav listClass="f-foot-col" titleClass="f-foot-title" linkClass="f-foot-link" />
        </div>
        <div className="f-legal">
          <span>© 2026 D&J Stratagem, Inc. All rights reserved.</span>
          <span>Los Angeles, California</span>
        </div>
      </footer>
    </PreviewShell>
  );
}
