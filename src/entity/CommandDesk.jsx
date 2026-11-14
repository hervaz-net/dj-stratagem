import { useEffect, useId, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CAPABILITIES, capabilityById, routeAsk } from "./capabilities";
import { Workspace } from "./workspaces";
import "./desk.css";

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduce;
}

export default function CommandDesk({
  moduleId = "projects",
  view = "module",
  preview = false,
  focusOnChange = false,
}) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const askId = useId();
  const [previewId, setPreviewId] = useState(moduleId);
  const [paused, setPaused] = useState(false);
  const [ask, setAsk] = useState("");
  const [miss, setMiss] = useState("");
  const activeId = preview ? previewId : moduleId;
  const cap = capabilityById(activeId) || CAPABILITIES[0];

  useEffect(() => {
    if (!preview || reduce || paused) return undefined;
    const timer = window.setInterval(() => {
      setPreviewId((current) => {
        const i = CAPABILITIES.findIndex((c) => c.id === current);
        return CAPABILITIES[(i + 1) % CAPABILITIES.length].id;
      });
    }, 3400);
    return () => window.clearInterval(timer);
  }, [preview, reduce, paused]);

  useEffect(() => {
    if (preview || !focusOnChange) return;
    document.getElementById("desk-title")?.focus();
  }, [activeId, view, preview, focusOnChange]);

  const events = useMemo(() => {
    const rest = CAPABILITIES.filter((c) => c.id !== cap.id);
    return [cap, ...rest];
  }, [cap]);

  function go(id) {
    if (preview) {
      setPreviewId(id);
      return;
    }
    navigate(`/command/${id}`);
  }

  function onAsk(e) {
    e.preventDefault();
    const hit = routeAsk(ask);
    if (!hit) {
      setMiss("I don’t have a mode for that. Try projects, materials, trucks, crews, or capital.");
      return;
    }
    setMiss("");
    setAsk("");
    if (preview) {
      navigate(`/command/${hit.id}`);
      return;
    }
    navigate(`/command/${hit.id}`);
  }

  const title = view === "module" ? cap.label : cap.label;
  const showModuleHead = view === "module";

  return (
    <div className={`dk ${preview ? "is-preview" : ""}`} onPointerDown={preview ? () => setPaused(true) : undefined}>
      <header className="dk-top">
        <Link className="dk-brand" to="/">
          <strong>DJ Stratagem</strong>
          <span>One desk</span>
        </Link>
        <form className="dk-ask" onSubmit={onAsk}>
          <label className="sr-only" htmlFor={askId}>Ask Stratagem</label>
          <input
            id={askId}
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            placeholder="Ask Stratagem — projects, materials, trucks…"
            autoComplete="off"
          />
          <button type="submit">Open</button>
        </form>
        <nav className="dk-links" aria-label="Site">
          <Link to="/services">Services</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {preview ? <Link className="dk-btn" to={`/command/${cap.id}`}>Open the desk</Link> : <Link to="/login">Sign in</Link>}
        </nav>
      </header>
      {miss && <p className="dk-ask-msg px-4" role="status">{miss}</p>}
      <div className="dk-body">
        <nav className="dk-rail" aria-label="Capabilities">
          <h2>Capabilities</h2>
          <ul>
            {CAPABILITIES.map((c) => {
              const current = c.id === cap.id;
              const href = `/command/${c.id}`;
              if (preview) {
                return (
                  <li key={c.id}>
                    <a
                      href={href}
                      aria-current={c.id === cap.id ? "page" : undefined}
                      onClick={(e) => { e.preventDefault(); go(c.id); }}
                    >
                      <strong>{c.label}</strong>
                      <small>{c.status}</small>
                    </a>
                  </li>
                );
              }
              return (
                <li key={c.id}>
                  <Link to={href} aria-current={current ? "page" : undefined}>
                    <strong>{c.label}</strong>
                    <small>{c.status}</small>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="dk-stage" id="workspace">
          <div className="dk-enter" key={`${cap.id}-${view}`}>
            <p className="sr-only" aria-live="polite">Now showing {cap.label}. {cap.status}.</p>
            {showModuleHead && (
              <>
                <p className="dk-kicker">{cap.stage} · {cap.status}</p>
                <h1 id="desk-title" tabIndex={-1}>{title}</h1>
                <p className="dk-lede">{cap.voice}</p>
              </>
            )}
            <Workspace id={cap.id} view={view} />
          </div>
        </div>
        <aside className="dk-activity" aria-label="Activity">
          <h2>Activity</h2>
          <ol>
            {events.map((c, i) => (
              <li key={c.id}>
                {i === 0 && <span className="dk-now">Now</span>}
                <strong>{c.label}</strong>
                <span>{c.activity}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <details className="dk-mobile-status">
        <summary>Activity · {cap.label}</summary>
        <ol>
          {events.map((c) => (
            <li key={c.id}><strong>{c.label}</strong><span>{c.activity}</span></li>
          ))}
        </ol>
      </details>
    </div>
  );
}
