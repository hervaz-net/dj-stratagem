import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { CAPABILITIES } from "./capabilities";

const LIVE = [
  ["Sample project board", "Cards by trade and city. Not live solicitations, and they cannot be bid.", "/command/projects"],
  ["Marketplace catalogs", "Bundled demo catalogs for browsing supply. Not live storefronts.", "/exchange/marketplace"],
  ["Fleet reservation requests", "Pickups, vans, and SUVs in Southern California. A request is not a confirmed booking.", "/command/fleet"],
  ["Account review", "Every account is reviewed by a person before you bid for real.", "/register"],
];

const BUILDING = [
  ["Capital", "No credit, loans, or bonds today.", "/command/capital"],
  ["Workforce", "Crew staffing is not available yet.", "/command/workforce"],
  ["Studio", "Not taking creative work yet.", "/command/studio"],
  ["Scored supply awards, CRM, and marketing suite", "Described on the desk. Not live.", "/command/platform"],
];

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        description="DJ Stratagem is one desk: projects, exchange, platform, solutions, supply, capital, workforce, fleet, and studio. Some modes are open. Others are still in development."
      />
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-fg">Services</p>
        <h1 className="mt-4 max-w-3xl text-5xl md:text-6xl">Everything I do lives on one desk.</h1>
        <p className="mt-5 max-w-2xl text-lg text-fg-muted">
          There isn’t a separate bot for bids, another for trucks, and another for materials. Ask me, and I open the mode that fits. What’s actually available is listed here without a number I haven’t earned.
        </p>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 md:grid-cols-2">
        <div>
          <h2 className="text-3xl">Open now</h2>
          <ul className="dk-list">
            {LIVE.map(([title, text, to]) => (
              <li key={title}>
                <Link className="font-semibold text-fg" to={to}>{title}</Link>
                <p className="mt-1 text-sm text-fg-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl">Still being built</h2>
          <ul className="dk-list">
            {BUILDING.map(([title, text, to]) => (
              <li key={title}>
                <Link className="font-semibold text-fg" to={to}>{title}</Link>
                <p className="mt-1 text-sm text-fg-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="border-t border-line bg-subtle py-14">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl">Modes</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <Link key={c.id} to={`/command/${c.id}`} className="dk-card">
                <span className="dk-pill">{c.stage} · {c.status}</span>
                <h3>{c.label}</h3>
                <p>{c.voice}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
