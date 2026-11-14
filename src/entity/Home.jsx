import { useEffect } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { CAPABILITIES } from "./capabilities";
import CommandDesk from "./CommandDesk";

export default function Home() {
  useEffect(() => {
    const id = "djs-org-jsonld";
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.id = id;
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

  return (
    <>
      <Seo
        title="DJ Stratagem"
        description="One desk for construction: sample project cards, materials, and truck reservation requests. Crew staffing, capital, and studio work are still in development. Los Angeles."
      />
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-14 md:pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-fg">DJ Stratagem · Los Angeles</p>
        <h1 className="mt-4 max-w-4xl text-5xl leading-[0.95] md:text-7xl">
          One mind for the construction business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
          I find work, hold the bid, source materials, and line up trucks. You talk to me, not to a lineup of separate bots. Crew staffing, capital, and studio work are still being built.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="dk-btn inline-flex items-center" to="/command/projects">Open the desk</Link>
          <Link className="dk-btn secondary inline-flex items-center" to="/contact">Talk to a person</Link>
        </div>
        <ul className="mt-6 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-fg-muted">
          <li>Free to start</li>
          <li>Every account reviewed by a person</li>
          <li>Based in Los Angeles</li>
        </ul>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16" aria-labelledby="desk-preview">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h2 id="desk-preview" className="text-3xl">The desk, in motion</h2>
          <p className="max-w-md text-sm text-fg-muted">The same shell you get when you open it. Modes switch in place. Status lines are descriptions, not measured results.</p>
        </div>
        <div className="hero-desk">
          <CommandDesk preview />
        </div>
      </section>
      <section className="border-t border-line bg-subtle py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl">What I can do</h2>
          <p className="mt-3 max-w-2xl text-fg-muted">Each of these used to be presented as its own product. They are modes of this desk now.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <Link key={c.id} to={`/command/${c.id}`} className="dk-card">
                <span className="dk-pill">{c.status}</span>
                <h3>{c.label}</h3>
                <p>{c.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
