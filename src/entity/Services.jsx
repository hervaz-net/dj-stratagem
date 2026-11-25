import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { CAPABILITIES } from "./capabilities";

const LIVE = [
  ["Post a project", "Send the trade, the city, and the scope. A person replies.", "/command/projects"],
  ["Post a materials request", "Send the list. A person routes it to sellers.", "/exchange/marketplace"],
  ["Reserve a vehicle", "Send the vehicle and the dates. A person confirms.", "/command/fleet"],
  ["Open an account", "Create the account. A person reviews it.", "/register"],
];

const REQUESTS = [
  ["Capital", "Send the pay-app, materials, or bonding need.", "/command/capital"],
  ["Workforce", "Send the trade, the dates, and the site.", "/command/workforce"],
  ["Studio", "Send a brand, site, or proposal brief.", "/command/studio"],
  ["Platform", "Send the pursuit. Bids, documents, and follow-up stay on the account.", "/command/platform"],
];

export default function Services() {
  return (
    <>
      <Seo
        title="Services"
        description="DJ Stratagem is one desk. Send a pursuit, a materials list, a vehicle request, a crew request, a capital request, or a studio brief."
      />
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-fg">Services</p>
        <h1 className="mt-4 max-w-3xl text-5xl md:text-6xl">Everything I do lives on one desk.</h1>
        <p className="mt-5 max-w-2xl text-lg text-fg-muted">
          There isn’t a separate bot for bids, another for trucks, and another for materials. Ask, and the right mode opens. Each one takes a request a person can finish.
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
          <h2 className="text-3xl">Send a request</h2>
          <ul className="dk-list">
            {REQUESTS.map(([title, text, to]) => (
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
