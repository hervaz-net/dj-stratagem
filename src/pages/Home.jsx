import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import Seo from "../components/Seo";
import { projects, TRADES, formatDue } from "../data/sampleProjects";
import {
  IconGavel,
  IconHelmet,
  IconMegaphone,
  IconBriefcase,
  IconPackage,
  IconSparkle,
} from "../components/icons";

const capabilities = [
  { icon: <IconGavel width={30} height={30} />, title: "Bid rooms", text: "Post packages, invite subs, level every number side by side, and award with a paper trail that holds up." },
  { icon: <IconHelmet width={30} height={30} />, title: "Trade matching", text: "Projects scored against your trade, territory, size, and history, so the good ones find you first." },
  { icon: <IconMegaphone width={30} height={30} />, title: "Marketing engine", text: "A company profile that ranks, steady inbound leads, and proposals drafted for you in minutes." },
  { icon: <IconPackage width={30} height={30} />, title: "Supply sourcing", text: "Sealed, single-round quotes scored on more than price, so suppliers stay and fill rates hold." },
  { icon: <IconBriefcase width={30} height={30} />, title: "Back office", text: "CRM, estimating, invoicing, change orders, and e-signatures, in the field and in the office." },
  { icon: <IconSparkle width={30} height={30} />, title: "Quiet AI", text: "Fit scores, competitiveness signals, and first drafts. It does the busywork; you make the call." },
];

const moves = [
  { n: "01", title: "Tell us who you are", text: "Trades, territory, project sizes, certifications. You verify once, and it travels with every bid." },
  { n: "02", title: "Let the work come to you", text: "We rank every new project against your profile and nudge you when something worth chasing lands." },
  { n: "03", title: "Run the pursuit in one place", text: "Deadlines, documents, contacts, and status live together, so nothing dies in an inbox." },
  { n: "04", title: "Win, learn, repeat", text: "Follow-up, analytics, and marketing turn each result into a better next bid." },
];

const roles = [
  { key: "gc", label: "General contractors", line: "Run the whole bid room.", text: "Publish packages, invite the right subs, compare like for like, and award with confidence." },
  { key: "sub", label: "Subcontractors", line: "Spend time on winnable work.", text: "See projects that fit your trade and area, bid digitally, and build a record that wins more." },
  { key: "supplier", label: "Suppliers", line: "Meet demand early.", text: "Spot upcoming projects and the contractors who need you, then quote into sealed RFQs that protect margin." },
  { key: "service", label: "Service providers", line: "Leads without the agency.", text: "A profile that ranks brings qualified commercial leads straight to you." },
];

const faqs = [
  {
    q: "How is this different from PlanHub or BuildingConnected?",
    a: "Those tools each solve one slice, finding bids or sending invitations. D&J Stratagem connects the whole pipeline: bidding and awards, marketing and leads, CRM and estimating, documents and e-signatures. One login instead of five subscriptions that don't talk to each other.",
  },
  {
    q: "Do I need to be a general contractor?",
    a: "No. General contractors, subcontractors, and suppliers all work on the same platform, each with workflows built for their side of the deal. Subs can start free with a profile and matched projects.",
  },
  {
    q: "What is Supply Exchange?",
    a: "Sourcing for the materials you reorder constantly: fasteners, lumber, conduit, PVC, plate, tools. Sealed single-round quotes and multi-factor scored awards replace the open reverse auction, so suppliers stay at the table.",
  },
  {
    q: "How fast can we get going?",
    a: "Profile setup takes under an hour, and most teams are bidding through the platform the same week. Growth and Enterprise plans include guided onboarding.",
  },
  {
    q: "Can I try it first?",
    a: "Starter is free: profile, matching, and a small bid cap. Paid plans open after a short review. Request access or email hello@djstratageminc.com.",
  },
];

const STATEMENT =
  "Most contractors stitch together five tools to do one job. We built one place to find the work, win it, market the business, and keep the customer.";

/** Words light up one by one as the statement scrolls through the viewport. */
function ScrollWords({ text }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-4xl leading-[1.12] text-paper md:text-6xl lg:text-7xl">
      {words.map((w, i) => {
        const lit = progress * words.length > i;
        return (
          <span key={i} className="transition-opacity duration-500" style={{ opacity: lit ? 1 : 0.14 }}>
            {w}{" "}
          </span>
        );
      })}
    </p>
  );
}

/** Cycles through matched projects like a departures board. */
function SignalTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % projects.length), 3200);
    return () => window.clearInterval(id);
  }, []);
  const p = projects[i];
  return (
    <Link
      to={`/projects/${p.slug}`}
      className="slab group block w-full max-w-sm p-5 transition-transform duration-500 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span className="mono-label flex items-center gap-2 text-tide">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tide" /> New match
        </span>
        <span className="mono-label text-steel">
          {String(i + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
        </span>
      </div>
      <div key={p.slug} className="rise-in">
        <p className="mt-4 font-display text-3xl leading-tight text-paper">{p.title}</p>
        <p className="mt-2 text-sm text-steel">
          {p.city}, {p.state} · {p.trade} · {p.valueLabel}
        </p>
        <div className="mt-5 flex items-end justify-between">
          <span className="mono-label text-steel">Bids due {formatDue(p.bidDue)}</span>
          <span className="font-display text-5xl leading-none text-cta">
            {p.match}
            <span className="text-xl">%</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [role, setRole] = useState("gc");

  return (
    <>
      <Seo
        title="Find Construction Projects. Bid Smarter. Win More Work."
        description="D&J Stratagem is one place for contractors, subcontractors, and suppliers to find construction work, win it, market the business, and keep the customer."
      />

      {/* Hero */}
      <section className="relative px-6 pb-16 pt-12 md:pt-20">
        <div className="mx-auto grid min-h-[72vh] max-w-7xl items-end gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="mono-label rise-in text-steel">D&amp;J Stratagem, Inc. — Los Angeles</p>
            <h1 className="rise-in mt-8 text-[3.4rem] leading-[0.92] text-paper sm:text-8xl xl:text-[8.25rem]" style={{ animationDelay: "80ms" }}>
              Build the <span className="ink-flow italic">pipeline,</span>
              <br />
              not the paperwork.
            </h1>
            <div className="rise-in mt-10 grid max-w-3xl gap-8 md:grid-cols-[1fr_auto] md:items-end" style={{ animationDelay: "180ms" }}>
              <p className="text-lg leading-relaxed text-steel">
                Construction work, matched to your trade and territory. Then everything after it: the
                bid, the award, the marketing, the relationship.
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <Button to="/projects" size="lg">
                  Find projects <span aria-hidden="true" className="transition-transform group-hover/btn:translate-x-1">→</span>
                </Button>
                <Button to="/platform" variant="ghost">
                  See the platform
                </Button>
              </div>
            </div>
          </div>
          <div className="rise-in relative hidden lg:block" style={{ animationDelay: "260ms" }}>
            <SignalTicker />
          </div>
        </div>

        {/* Trade chips drifting at the edge of the hero. */}
        <div aria-hidden="true" className="pointer-events-none absolute right-6 top-6 hidden flex-col items-end gap-3 xl:flex">
          {TRADES.slice(0, 4).map((t, i) => (
            <span
              key={t}
              className="bob chamfer-sm bg-glass px-3 py-1.5 font-mono text-xs text-steel backdrop-blur-md"
              style={{ animationDelay: `${-i * 1.7}s`, marginRight: `${(i % 2) * 48}px` }}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl items-center gap-4 lg:hidden">
          <SignalTicker />
        </div>

        <div className="mx-auto mt-14 hidden max-w-7xl items-center gap-4 md:flex" aria-hidden="true">
          <span className="mono-label text-steel">Scroll</span>
          <span className="relative h-px w-24 overflow-hidden bg-line">
            <span className="absolute inset-y-0 left-0 w-1/3 animate-[marquee_2.4s_linear_infinite] bg-cta" />
          </span>
        </div>
      </section>

      {/* Trades band */}
      <div className="marquee border-y-0 py-5" aria-hidden="true">
        <div className="marquee-track reverse gap-6">
          {[...TRADES, ...TRADES, ...TRADES, ...TRADES].map((t, i) => (
            <span key={i} className="flex shrink-0 items-center gap-6 font-mono text-sm uppercase tracking-[0.2em] text-steel">
              {t}
              <span className="text-cta">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Statement */}
      <Section>
        <Eyebrow>Why we exist</Eyebrow>
        <ScrollWords text={STATEMENT} />
      </Section>

      {/* Four moves: sticky title, scrolling steps */}
      <Section>
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">
              Four moves, <em>one rhythm.</em>
            </h2>
            <p className="mt-6 max-w-sm text-steel">From first profile to the next win, the platform keeps the pursuit moving.</p>
          </div>
          <ol className="space-y-4">
            {moves.map((m, i) => (
              <Reveal as="li" key={m.n} delay={i * 80}>
                <div className="group grid grid-cols-[auto_1fr] gap-6 py-8 md:gap-10">
                  <span className="font-display text-7xl leading-none text-paper/15 transition-colors duration-500 group-hover:text-cta md:text-8xl">
                    {m.n}
                  </span>
                  <div className="pt-2">
                    <h3 className="text-3xl text-paper md:text-4xl">{m.title}</h3>
                    <p className="mt-3 max-w-md text-steel">{m.text}</p>
                  </div>
                </div>
                <div className="dotline" />
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* The board */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>On the board</Eyebrow>
            <h2 className="max-w-2xl text-6xl text-paper md:text-7xl">
              Work that <em>fits</em>, ranked.
            </h2>
          </div>
          <Button to="/projects" variant="ghost">
            Browse every project →
          </Button>
        </div>
        <div className="mt-14">
          <div className="mono-label hidden grid-cols-[1fr_9rem_7rem_6rem_4rem] gap-6 pb-4 text-steel md:grid">
            <span>Project</span>
            <span>Where</span>
            <span>Trade</span>
            <span>Value</span>
            <span className="text-right">Fit</span>
          </div>
          {projects.slice(0, 6).map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <div className="dotline" />
              <Link
                to={`/projects/${p.slug}`}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 transition-[padding] duration-500 hover:pl-4 md:grid-cols-[1fr_9rem_7rem_6rem_4rem]"
              >
                <span className="font-display text-2xl leading-tight text-paper transition-colors group-hover:text-cta md:text-3xl">{p.title}</span>
                <span className="text-right font-display text-3xl text-paper md:order-last">{p.match}</span>
                <span className="text-sm text-steel">{p.city}, {p.state}</span>
                <span className="hidden font-mono text-xs uppercase tracking-wider text-steel md:block">{p.trade}</span>
                <span className="hidden text-sm text-paper md:block">{p.valueLabel}</span>
              </Link>
            </Reveal>
          ))}
          <div className="dotline" />
        </div>
      </Section>

      {/* Capabilities: horizontal drift */}
      <Section>
        <Eyebrow>The platform</Eyebrow>
        <h2 className="max-w-3xl text-6xl text-paper md:text-7xl">
          Six instruments, <em>one</em> desk.
        </h2>
        <div className="-mx-6 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none]">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 70} className="w-[19rem] shrink-0 snap-start md:w-[22rem]">
              <FeatureCard icon={c.icon} title={c.title} className="h-full">
                {c.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Before / after */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>The switch</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">
              Five logins <em>become</em> one.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <ul className="space-y-5 text-xl md:text-2xl">
              {[
                ["Five subscriptions", "One platform"],
                ["Bids retyped into a CRM", "Bids, awards, and CRM share a record"],
                ["Marketing outsourced", "Marketing from the same desk"],
                ["Follow-ups lost in email", "Every lead tracked to a decision"],
              ].map(([was, now]) => (
                <li key={was} className="group">
                  <span className="block text-steel line-through decoration-cta/70 decoration-2">{was}</span>
                  <span className="mt-1 block font-display text-3xl text-paper md:text-4xl">{now}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Roles: expanding columns */}
      <Section>
        <Eyebrow>Who it serves</Eyebrow>
        <h2 className="max-w-3xl text-6xl text-paper md:text-7xl">
          Every side <em>of the deal.</em>
        </h2>
        <div className="mt-14 flex flex-col gap-3 lg:h-[26rem] lg:flex-row">
          {roles.map((r, i) => {
            const active = role === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onMouseEnter={() => setRole(r.key)}
                onFocus={() => setRole(r.key)}
                onClick={() => setRole(r.key)}
                aria-pressed={active}
                className={`slab relative flex flex-col justify-between overflow-hidden p-7 text-left transition-[flex-grow,background-color] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                  active ? "bg-ink-3 lg:grow-[3]" : "lg:grow"
                } lg:basis-0`}
              >
                <span className="mono-label text-steel">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className={`block font-display text-3xl text-paper transition-all duration-500 md:text-4xl ${active ? "" : "lg:[writing-mode:vertical-rl] lg:rotate-180"}`}>
                    {r.label}
                  </span>
                  <span className={`block overflow-hidden transition-all duration-700 ${active ? "mt-4 max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                    <span className="block font-display text-2xl italic text-cta">{r.line}</span>
                    <span className="mt-2 block max-w-md text-steel">{r.text}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">
              Asked <em>often.</em>
            </h2>
          </div>
          <Accordion items={faqs} />
        </div>
      </Section>

      <CTASection
        title="Let's build what's next."
        subtitle="Create your company profile and see the projects that fit your trade, territory, and size."
      />
    </>
  );
}
