import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { CAPABILITIES, capabilityById } from "./capabilities";
import "./home.css";

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

function rowsFor(id) {
  const cap = capabilityById(id);
  const extras = {
    projects: ["Post a project", "Name the trade and city", "Describe the scope", "A person replies"],
    exchange: ["Post a materials request", "List what you sell", "Compare quotes", "Contractors, distributors, manufacturers"],
    platform: ["General contractors", "Subcontractors", "Marketing", "Supply", "Business tools", "Drafts beside your judgment"],
    solutions: ["General contractors", "Subcontractors", "Suppliers"],
    supply: ["Sealed quotes, one round", "Scored, not just cheapest", "Standing price books", "Pooled demand"],
    capital: ["Pay-app advances", "Materials terms", "Bonding readiness"],
    workforce: ["Crews on demand", "Credentials up front", "Payroll paperwork"],
    fleet: ["Heavy-duty pickups", "Sprinters and cargo vans", "Full-size SUVs"],
    studio: ["Brand and identity", "Websites", "Proposals and qualifications"],
  };
  return (extras[id] || []).map((title) => ({ title, meta: cap?.status || "", tag: cap?.status || "" }));
}

function stepMode(current, key) {
  const i = CAPABILITIES.findIndex((c) => c.id === current);
  if (key === "Home") return CAPABILITIES[0].id;
  if (key === "End") return CAPABILITIES[CAPABILITIES.length - 1].id;
  const dir = key === "ArrowRight" ? 1 : -1;
  return CAPABILITIES[(i + dir + CAPABILITIES.length) % CAPABILITIES.length].id;
}

/** Roving tabindex: arrows move the selection and the keyboard focus together. */
function ModeTabs({ selected, onPick, listId, className, label }) {
  function onKey(event) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = stepMode(selected, event.key);
    onPick(next);
    requestAnimationFrame(() => {
      const tab = document.getElementById(`${listId}-${next}`);
      tab?.focus({ preventScroll: true });
      const scroller = tab?.parentElement;
      if (tab && scroller) {
        const left = tab.offsetLeft - (scroller.offsetLeft || 0);
        scroller.scrollTo({ left: Math.max(0, left - 12) });
      }
    });
  }
  return (
    <div className={className} role="tablist" aria-label={label} onKeyDown={onKey}>
      {CAPABILITIES.map((c) => (
        <button
          key={c.id}
          id={`${listId}-${c.id}`}
          type="button"
          role="tab"
          aria-selected={c.id === selected}
          aria-controls="workflow-panel"
          tabIndex={c.id === selected ? 0 : -1}
          onClick={() => onPick(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

function ProductCanvas({ id, onPick }) {
  const cap = capabilityById(id) || CAPABILITIES[0];
  const rows = rowsFor(cap.id);
  return (
    <div className="pc">
      <div className="pc-bar">
        <strong>DJ Stratagem</strong>
        <ModeTabs selected={cap.id} onPick={onPick} listId="pc" className="pc-mods" label="Modes in the product" />
      </div>
      <div className="pc-body">
        <div className="pc-side">
          <p>Workflow</p>
          {CAPABILITIES.map((c) => (
            <button key={c.id} type="button" aria-current={c.id === cap.id ? "true" : undefined} onClick={() => onPick(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="pc-main" id="workflow-panel" role="tabpanel" aria-labelledby={`hx-${cap.id}`}>
          <h2>{cap.label}</h2>
          <p className="pc-voice">{cap.voice}</p>
          <ul className="pc-rows">
            {rows.map((row) => (
              <li key={row.title}>
                <div>
                  <strong>{row.title}</strong>
                  {row.meta && <span>{row.meta}</span>}
                </div>
                <span className="pc-tag">{row.tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [id, setId] = useState("projects");
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const elId = "djs-org-jsonld";
    let el = document.getElementById(elId);
    if (!el) {
      el = document.createElement("script");
      el.id = elId;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "D&J Stratagem, Inc.",
      alternateName: "DJ Stratagem",
      url: "https://djstratageminc.com/",
      email: "hello@djstratageminc.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Los Angeles",
        addressRegion: "CA",
        addressCountry: "US",
      },
    });
    return () => { el.remove(); };
  }, []);

  useEffect(() => {
    if (reduce || paused) return undefined;
    const timer = window.setInterval(() => {
      setId((current) => {
        const i = CAPABILITIES.findIndex((c) => c.id === current);
        return CAPABILITIES[(i + 1) % CAPABILITIES.length].id;
      });
    }, 3800);
    return () => window.clearInterval(timer);
  }, [reduce, paused]);

  function pick(next) {
    setPaused(true);
    setId(next);
  }

  return (
    <>
      <Seo
        title="DJ Stratagem"
        description="One desk for construction in Los Angeles. Send a pursuit, a materials list, a vehicle request, a crew request, or a studio brief. A person replies."
      />
      <section className="hx" onPointerDown={() => setPaused(true)}>
        <div className="hx-inner">
          <p className="hx-kicker">One workflow · Los Angeles</p>
          <h1>Find the work. Price it. <span className="hx-accent">Build it.</span></h1>
          <p className="hx-lede">
            I find work, hold the bid, source materials, and line up trucks. You talk to me, not to a lineup of separate bots. Crew staffing, capital, and studio work are still being built.
          </p>
          <div className="hx-actions">
            <Link className="hx-cta" to={`/command/${id}`}>Open the desk</Link>
            <Link className="hx-quiet" to="/contact">Talk to a person</Link>
          </div>
          <ul className="hx-facts">
            <li>Free to start</li>
            <li>Every account reviewed by a person</li>
            <li>Based in Los Angeles</li>
          </ul>
          <ModeTabs selected={id} onPick={pick} listId="hx" className="hx-tabs" label="Workflow modes" />
          <div className="hx-stage">
            <figure className="hx-photo">
              <img src="/media/jobsite/crew.jpg" alt="Two workers tying rebar on a concrete deck" />
            </figure>
            <ProductCanvas id={id} onPick={pick} />
            <figure className="hx-photo">
              <img src="/media/jobsite/site.jpg" alt="A crew standing at the edge of a deck above an open jobsite" />
            </figure>
          </div>
          <p className="hx-credit">
            Jobsite photographs from <a href="https://unsplash.com/license">Unsplash</a>. The window is the workflow. Open a mode to send the request.
          </p>
        </div>
      </section>
      <section className="hx-lower">
        <div className="hx-lower-inner">
          <div className="hx-grid">
            <img src="/media/jobsite/hardhat.jpg" alt="Crew climbing a rebar column on an open structure" />
            <div>
              <h2>Nine modes. One desk.</h2>
              <p className="mt-3 max-w-xl text-fg-muted">Each of these used to be presented as its own product. They are views of the same workflow now.</p>
              <div className="hx-modes">
                {CAPABILITIES.map((c) => (
                  <Link key={c.id} className="hx-mode" to={`/command/${c.id}`}>
                    <small>{c.status}</small>
                    <h3>{c.label}</h3>
                    <p>{c.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
