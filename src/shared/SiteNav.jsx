import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { subagents, subagentForPath } from "../data/subagents";
import { NAV_LINKS, NAV_MENUS, appForPath, isCurrent } from "./siteNav";
import SubagentMark, { subagentColor, subagentMarkSvg } from "./SubagentMark";
import "./site-nav.css";

/**
 * The global nav. The main site, Stratagem Exchange, and the company sites
 * each render this same component, so the nav stays put on every page.
 * Links inside the current app route client-side; links into another app
 * are plain page loads.
 */

function Go({ href, app, children, ...rest }) {
  const target = appForPath(href);
  if (target === app && app !== "venture") {
    const to = app === "exchange" ? href.replace(/^\/exchange/, "") || "/" : href;
    return <Link to={to} {...rest}>{children}</Link>;
  }
  return <a href={href} {...rest}>{children}</a>;
}

export function StratagemMark({ size = 28 }) {
  return (
    <span className="sn-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5" cy="18" r="2.5" />
        <circle cx="19" cy="18" r="2.5" />
        <path d="M11 7.2 6.2 15.8M13 7.2l4.8 8.6M7.5 18h9" />
      </svg>
    </span>
  );
}

/** Nine dots, one per subagent, colored by stage. Ripples; turns when open. */
function SubagentsGlyph({ open }) {
  return (
    <svg className={`sn-glyph ${open ? "is-open" : ""}`} width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      {subagents.map((s, i) => (
        <circle
          key={s.key}
          className="sn-glyph-dot"
          style={{ fill: subagentColor(s.key), animationDelay: `${((i % 3) + Math.floor(i / 3)) * 0.14}s` }}
          cx={3 + (i % 3) * 6}
          cy={3 + Math.floor(i / 3) * 6}
          r="2"
        />
      ))}
    </svg>
  );
}

const Chevron = ({ open }) => (
  <svg className={`sn-chev ${open ? "is-open" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M3 4.5 6 7.5 9 4.5" />
  </svg>
);

const Arrow = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

function MenuPanel({ menu, app, here, onNavigate, panelRef, id }) {
  return (
    <div className="sn-panel" id={id} ref={panelRef} role="region" aria-label={menu.label}>
      <div className="sn-panel-grid" data-cols={menu.columns}>
        <div className="sn-intro">
          <p className="sn-intro-title">{menu.intro.title}</p>
          <p className="sn-intro-text">{menu.intro.text}</p>
          <Go href={menu.intro.href} app={app} className="sn-intro-link" onClick={onNavigate}>
            {menu.intro.cta} <Arrow />
          </Go>
        </div>
        <ul className="sn-links">
          {menu.links.map((l, i) => (
            <li
              key={l.href + l.label}
              className="sn-tile"
              data-current={isCurrent(l.href, here) || undefined}
              style={{ animationDelay: `${i * 22}ms` }}
            >
              <Go
                href={l.href}
                app={app}
                className="sn-tile-main"
                aria-current={isCurrent(l.href, here) ? "page" : undefined}
                onClick={onNavigate}
              >
                <span className="sn-tile-top">
                  <span className="sn-tile-label">
                    {l.mark && <SubagentMark id={l.mark} size={24} />}
                    {l.label}
                  </span>
                  {l.tag && <span className="sn-tag" data-stage={l.stage}>{l.tag}</span>}
                </span>
                <span className="sn-tile-text">{l.text}</span>
              </Go>
              {l.sections?.length > 0 && (
                <ul className="sn-tile-sections" aria-label={`${l.label} pages`}>
                  {l.sections.map((sec) => (
                    <li key={sec.href}>
                      <Go href={sec.href} app={app} className="sn-section" aria-current={isCurrent(sec.href, here) ? "page" : undefined} onClick={onNavigate}>
                        {sec.label}
                      </Go>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <Go href={menu.feature.href} app={app} className={`sn-feature ${menu.feature.tone === "dark" ? "is-dark" : ""}`} onClick={onNavigate}>
          <span className="sn-feature-media">
            {menu.feature.image ? (
              <img src={menu.feature.image} alt="" loading="lazy" decoding="async" />
            ) : (
              <span className="sn-feature-grid" aria-hidden="true" />
            )}
            <span className="sn-feature-go"><Arrow /></span>
          </span>
          <span className="sn-feature-eyebrow">{menu.feature.eyebrow}</span>
          <span className="sn-feature-title">{menu.feature.title}</span>
        </Go>
      </div>
    </div>
  );
}

/**
 * @param {"parent"|"exchange"|"venture"} app   which app is rendering the nav
 * @param {{signedIn?:boolean, dashboardHref?:string, signInHref:string, joinHref:string}} account
 * @param {{href:string, label:string}} [action] the page's main action; replaces "Join free"
 * @param {() => void} [onOpenPalette]          opens site search when provided
 */
export default function SiteNav({ app, account, action, onOpenPalette }) {
  const location = useLocation();
  // Each app routes under its own basename, so read the full path.
  const here = typeof window === "undefined" ? location.pathname : window.location.pathname;
  // On a subagent's pages its name follows "Stratagem AI" in the header.
  const current = subagentForPath(here);

  // The tab icon is the subagent's mark on its pages, the Stratagem AI mark elsewhere.
  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]');
    if (!link) return;
    const svg = current ? subagentMarkSvg(current.key) : null;
    link.setAttribute("href", svg ? `data:image/svg+xml,${encodeURIComponent(svg)}` : "/favicon.svg");
  }, [current]);
  const [open, setOpen] = useState(null); // key of the open desktop menu
  const [sheet, setSheet] = useState(false); // mobile menu
  // Open accordion in the sheet; on a subagent page, start on Subagents.
  const [section, setSection] = useState(() =>
    typeof window !== "undefined" && subagentForPath(window.location.pathname) ? "subagents" : null,
  );
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const triggers = useRef({});
  const timer = useRef(0);
  const focusFirst = useRef(false);
  const uid = useId();

  const close = useCallback((restoreKey) => {
    window.clearTimeout(timer.current);
    setOpen(null);
    if (restoreKey) triggers.current[restoreKey]?.focus();
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    close();
    setSheet(false);
  }, [location.pathname, location.hash, close]);

  // Escape and outside click while a menu is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") close(open); };
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) close(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    if (focusFirst.current) {
      focusFirst.current = false;
      panelRef.current?.querySelector("a")?.focus();
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  // The mobile sheet locks page scroll and closes on Escape.
  useEffect(() => {
    if (!sheet) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setSheet(false); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  // Hover intent for mouse only; touch and keyboard use click.
  const hoverOpen = (key) => (e) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(key), open ? 0 : 80);
  };
  const hoverClose = (e) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(null), 200);
  };
  const keepOpen = () => window.clearTimeout(timer.current);

  const onTriggerKey = (key) => (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusFirst.current = true;
      setOpen(key);
    }
  };

  const menuActive = (m) => m.links.some((l) => isCurrent(l.href, here)) || isCurrent(m.intro.href, here);
  const openMenu = NAV_MENUS.find((m) => m.key === open);
  const panelId = (key) => `${uid}-${key}`;

  return (
    <>
      <header ref={wrapRef} className={`sn no-print ${open ? "has-open" : ""}`} data-app={app}>
        <div className="sn-bar">
          <div className="sn-brand">
            <Go href="/" app={app} className="sn-brand-home" aria-label="Stratagem AI home">
              <StratagemMark />
              <span className={`sn-brand-name ${current ? "has-suffix" : ""}`}>Stratagem AI</span>
            </Go>
            {current && (
              <>
                <span className="sn-brand-sep" aria-hidden="true" />
                <Go href={current.to} app={app} className="sn-brand-suffix" style={{ color: subagentColor(current.key) }} aria-label={`${current.name} home`}>
                  <SubagentMark id={current.key} size={22} />
                  {current.name}
                </Go>
              </>
            )}
          </div>

          <nav className="sn-nav" aria-label="Main">
            <ul className="sn-nav-list">
              {NAV_MENUS.map((m) => (
                <li key={m.key} onPointerEnter={hoverOpen(m.key)} onPointerLeave={hoverClose}>
                  <button
                    ref={(el) => { triggers.current[m.key] = el; }}
                    type="button"
                    className={`sn-trigger ${open === m.key ? "is-open" : ""} ${menuActive(m) ? "is-active" : ""}`}
                    aria-expanded={open === m.key}
                    aria-controls={panelId(m.key)}
                    onClick={() => { window.clearTimeout(timer.current); setOpen((v) => (v === m.key ? null : m.key)); }}
                    onKeyDown={onTriggerKey(m.key)}
                  >
                    {m.glyph && <SubagentsGlyph open={open === m.key} />}
                    {m.label}
                    <Chevron open={open === m.key} />
                  </button>
                </li>
              ))}
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Go href={l.href} app={app} className={`sn-trigger ${isCurrent(l.href, here) ? "is-active" : ""}`} aria-current={isCurrent(l.href, here) ? "page" : undefined}>
                    {l.label}
                  </Go>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sn-actions">
            {onOpenPalette && (
              <button type="button" className="sn-icon-btn" onClick={onOpenPalette} aria-label="Search the site (Command K)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            )}
            {account.signedIn ? (
              <Go href={account.dashboardHref} app={app} className="sn-cta">Dashboard <Arrow className="sn-cta-arrow" /></Go>
            ) : (
              <>
                <Go href={account.signInHref} app={app} className="sn-signin">Sign in</Go>
                <Go href={action?.href ?? account.joinHref} app={app} className="sn-cta" data-action={action ? "" : undefined} data-long={(action?.label?.length ?? 0) > 16 ? "" : undefined}>
                  {action?.label ?? "Join free"} <Arrow className="sn-cta-arrow" />
                </Go>
              </>
            )}
            <button
              type="button"
              className="sn-burger"
              aria-expanded={sheet}
              aria-controls={`${uid}-sheet`}
              aria-label={sheet ? "Close menu" : "Open menu"}
              onClick={() => setSheet((v) => !v)}
            >
              <span className={`sn-burger-lines ${sheet ? "is-open" : ""}`} aria-hidden="true"><span /><span /></span>
            </button>
          </div>
        </div>

        {openMenu && (
          <div onPointerEnter={keepOpen} onPointerLeave={hoverClose}>
            <MenuPanel
              key={openMenu.key}
              menu={openMenu}
              app={app}
              here={here}
              id={panelId(openMenu.key)}
              panelRef={panelRef}
              onNavigate={() => close()}
            />
          </div>
        )}

        {sheet && (
          <div className="sn-sheet" id={`${uid}-sheet`}>
            <ul className="sn-sheet-list">
              {NAV_MENUS.map((m) => {
                const expanded = section === m.key;
                return (
                  <li key={m.key} className="sn-sheet-item">
                    <button
                      type="button"
                      className="sn-sheet-trigger"
                      aria-expanded={expanded}
                      onClick={() => setSection(expanded ? null : m.key)}
                    >
                      <span className="sn-sheet-label">{m.glyph && <SubagentsGlyph open={expanded} />}{m.label}</span>
                      <Chevron open={expanded} />
                    </button>
                    {expanded && (
                      <ul className="sn-sheet-links">
                        {m.links.map((l) => (
                          <li key={l.href + l.label}>
                            <Go href={l.href} app={app} className="sn-sheet-link" aria-current={isCurrent(l.href, here) ? "page" : undefined} onClick={() => setSheet(false)}>
                              <span className="sn-sheet-link-label">
                                {l.mark && <SubagentMark id={l.mark} size={22} />}
                                {l.label}
                              </span>
                              {l.tag && <span className="sn-tag" data-stage={l.stage}>{l.tag}</span>}
                            </Go>
                            {/* The subagent you're on lists its own pages here. */}
                            {current && l.href === current.to && l.sections?.length > 0 && (
                              <ul className="sn-sheet-sections" aria-label={`${l.label} pages`}>
                                {l.sections.map((sec) => (
                                  <li key={sec.href}>
                                    <Go href={sec.href} app={app} className="sn-sheet-section" aria-current={isCurrent(sec.href, here) ? "page" : undefined} onClick={() => setSheet(false)}>
                                      {sec.label}
                                    </Go>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                        <li>
                          <Go href={m.intro.href} app={app} className="sn-sheet-more" onClick={() => setSheet(false)}>
                            {m.intro.cta} <Arrow />
                          </Go>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              })}
              {NAV_LINKS.map((l) => (
                <li key={l.href} className="sn-sheet-item">
                  <Go href={l.href} app={app} className="sn-sheet-trigger" onClick={() => setSheet(false)}>{l.label}</Go>
                </li>
              ))}
            </ul>
            <div className="sn-sheet-actions">
              {account.signedIn ? (
                <Go href={account.dashboardHref} app={app} className="sn-cta sn-cta-block" onClick={() => setSheet(false)}>Dashboard <Arrow className="sn-cta-arrow" /></Go>
              ) : (
                <>
                  <Go href={action?.href ?? account.joinHref} app={app} className="sn-cta sn-cta-block" onClick={() => setSheet(false)}>
                    {action?.label ?? "Join free"} <Arrow className="sn-cta-arrow" />
                  </Go>
                  <Go href={account.signInHref} app={app} className="sn-ghost sn-cta-block" onClick={() => setSheet(false)}>Sign in</Go>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      {openMenu && <div className="sn-scrim no-print" aria-hidden="true" onPointerDown={() => close()} />}
    </>
  );
}
