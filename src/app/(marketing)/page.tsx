import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  HardHat,
  Layers3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Reveal } from "@/components/reveal";
import { modes, pipeline } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Find the work. Price it. Build it.",
  description:
    "D&J Stratagem connects nine parts of the construction job lifecycle in one account—for contractors, subcontractors, and suppliers across Southern California.",
  alternates: { canonical: "/" },
};

const modeIcons = {
  projects: MapPin,
  exchange: PackageCheck,
  platform: Layers3,
  solutions: Wrench,
  supply: PackageCheck,
  capital: CircleDollarSign,
  workforce: Users,
  fleet: Truck,
  studio: HardHat,
};

const proofPoints = [
  "One account. Every stage.",
  "Reviewed by a person.",
  "Made for Southern California.",
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "D&J Stratagem, Inc.",
    url: "https://djstratageminc.com",
    email: "hello@djstratageminc.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    description:
      "A construction platform connecting contractors, subcontractors, and suppliers across the job lifecycle.",
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <section className="hero-section">
        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-with-mark">
              <span className="live-mark" />
              The construction desk for what’s next
            </div>
            <h1>
              Find the work.
              <br />
              Price it.
              <br />
              <span>Build it.</span>
            </h1>
            <p className="hero-subtitle">
              One account for the full job lifecycle—from first lead to the
              next customer.
            </p>
            <p className="hero-detail">
              Built for contractors, subcontractors, and suppliers who want to
              spend less time chasing the process and more time building the
              business.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary button-large" href="/join">
                Join free <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
              <Link className="text-link" href="#how-it-works">
                See how it works <ArrowDownRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div aria-label="Platform benefits" className="hero-proof">
              {proofPoints.map((point) => (
                <span key={point}>
                  <Check aria-hidden="true" size={14} />
                  {point}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-art-wrap">
            <div className="hero-art-frame">
              <Image
                alt="Construction crew at work on a Southern California job site"
                className="hero-photo"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 52vw"
                src="/media/construction-site.jpg"
              />
              <div className="photo-shade" />
              <div className="image-caption">
                <span className="caption-pin">
                  <MapPin aria-hidden="true" size={13} />
                  SOUTHERN CALIFORNIA
                </span>
                <span>Built around the work on the ground.</span>
              </div>
            </div>
            <div className="job-ticket">
              <div className="ticket-topline">
                <span className="ticket-label">
                  <span className="live-mark" />
                  JOB IN MOTION
                </span>
                <span className="ticket-code">DJS · 014</span>
              </div>
              <h2>Commercial tenant improvement</h2>
              <div className="ticket-meta">
                <span>
                  <MapPin size={13} /> Pasadena, CA
                </span>
                <span>Electrical · $280k–$340k</span>
              </div>
              <div className="ticket-progress">
                <div className="progress-stages">
                  <span className="stage-done">Found</span>
                  <span className="stage-current">Pursuit</span>
                  <span>Build</span>
                  <span>Showcase</span>
                </div>
                <span className="progress-line">
                  <i />
                </span>
              </div>
              <div className="ticket-people">
                <span className="avatar-stack" aria-hidden="true">
                  <i>GC</i>
                  <i>EL</i>
                  <i>+</i>
                </span>
                <span>One job. The right people in the loop.</span>
              </div>
            </div>
            <div aria-hidden="true" className="hero-coordinate">
              <span>34°08&apos; N</span>
              <span>118°08&apos; W</span>
            </div>
          </div>
        </div>
        <div className="container hero-bottomline">
          <span className="mono-label">ONE ACCOUNT · NINE MODES</span>
          <a href="#modes">
            Explore the desk <ArrowRight aria-hidden="true" size={15} />
          </a>
        </div>
      </section>

      <section aria-label="Platform positioning" className="trust-strip">
        <div className="container trust-inner">
          <span>Free to start</span>
          <i />
          <span>Every account reviewed by a person</span>
          <i />
          <span>Based in Los Angeles</span>
          <i />
          <span>Focused on Southern California</span>
        </div>
      </section>

      <section className="section modes-section" id="modes">
        <div className="container">
          <Reveal className="section-heading-row">
            <div>
              <span className="eyebrow">One connected system</span>
              <h2>
                Nine modes.
                <br />
                <span>One desk.</span>
              </h2>
            </div>
            <p>
              The parts of the job have always depended on each other. Now your
              tools can, too. Move through the whole pipeline without starting
              over in a different system.
            </p>
          </Reveal>
          <div className="mode-grid">
            {modes.map((mode, index) => {
              const Icon = modeIcons[mode.slug as keyof typeof modeIcons];
              return (
                <Reveal delay={Math.min(index * 0.035, 0.22)} key={mode.slug}>
                  <Link
                    className="mode-card"
                    data-stage={mode.stage.toLowerCase()}
                    href={`/${mode.slug}`}
                  >
                    <div className="mode-card-top">
                      <span className="mode-icon">
                        <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
                      </span>
                      <span className="mode-stage">{mode.stage}</span>
                    </div>
                    <h3>{mode.name}</h3>
                    <p>{mode.summary}</p>
                    <span className="mode-card-link">
                      Explore {mode.name}
                      <ArrowUpRight aria-hidden="true" size={14} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <div className="modes-footnote">
            <ShieldCheck aria-hidden="true" size={17} />
            <span>
              AI subagents can prepare the work across your pipeline. A person
              approves before anything runs.
            </span>
            <Link href="/platform">How the platform works <ChevronRight size={14} /></Link>
          </div>
        </div>
      </section>

      <section className="section pipeline-section" id="how-it-works">
        <div className="container">
          <Reveal className="pipeline-heading">
            <span className="eyebrow">A job, in motion</span>
            <h2>Build the pipeline, not the paperwork.</h2>
            <p>One job moves through the desk. Your team keeps the context.</p>
          </Reveal>
          <div className="pipeline-track">
            {pipeline.map((step, index) => (
              <Reveal
                className="pipeline-step"
                delay={index * 0.08}
                key={step.number}
              >
                <span className="step-number">{step.number}</span>
                <span className="step-connector" aria-hidden="true">
                  <i />
                </span>
                <div className="step-card">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <div className="step-modes">
                    {step.modes.map((mode) => (
                      <span key={mode}>{mode}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section approval-section">
        <div className="container approval-layout">
          <Reveal className="approval-copy">
            <span className="eyebrow">AI that stays in its lane</span>
            <h2>Automation should earn your trust.</h2>
            <p>
              Stratagem’s AI subagents prepare real work across the pipeline:
              qualifying opportunities, organizing requests, and drafting the
              next step. A human reviews and approves before anything executes.
            </p>
            <ul className="check-list">
              <li><Check size={16} /> You choose what work to hand off</li>
              <li><Check size={16} /> A person approves every run</li>
              <li><Check size={16} /> The result stays connected to the job</li>
            </ul>
            <Link className="text-link" href="/platform">
              Meet the platform <ArrowRight size={15} />
            </Link>
          </Reveal>
          <Reveal className="approval-panel" delay={0.1}>
            <div className="approval-panel-head">
              <span className="app-mark">D/J</span>
              <span>
                <strong>Work ready for review</strong>
                <small>PROJECTS → PLATFORM → EXCHANGE</small>
              </span>
              <span className="approval-state">Needs your OK</span>
            </div>
            <div className="approval-activity">
              <div className="activity-icon"><ClipboardCheck size={17} /></div>
              <div>
                <span className="activity-label">Pursuit brief · Pasadena TI</span>
                <p>
                  Trade fit confirmed. Supplier request drafted with the
                  electrical scope and due date.
                </p>
              </div>
            </div>
            <div className="approval-context">
              <span><Check size={13} /> Scope attached</span>
              <span><Check size={13} /> 3 suppliers matched</span>
              <span><Check size={13} /> No action taken yet</span>
            </div>
            <div className="approval-buttons">
              <span>Review details</span>
              <span>Approve run <ArrowRight size={14} /></span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="local-section">
        <div className="container local-layout">
          <div className="local-photo">
            <Image
              alt="Concrete structure under construction in the afternoon light"
              fill
              loading="lazy"
              sizes="(max-width: 760px) 100vw, 48vw"
              src="/media/construction-structure.jpg"
            />
            <span>BUILT FOR THE WORK THAT BUILDS OUR CITIES</span>
          </div>
          <Reveal className="local-copy">
            <span className="eyebrow">Los Angeles, built for the region</span>
            <h2>Local work. Shared momentum.</h2>
            <p>
              D&amp;J Stratagem is based in Los Angeles and focused on the
              people building across Southern California. We start close to
              home, with a network that understands the trades, suppliers, and
              jobs in this region.
            </p>
            <div className="local-facts">
              <span><MapPin size={15} /> Los Angeles, CA</span>
              <span><Users size={15} /> Contractor-first</span>
              <span><Wrench size={15} /> Made for the trades</span>
            </div>
            <Link className="text-link" href="/about">
              More about D&amp;J <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section closing-section">
        <div className="container">
          <div className="closing-panel">
            <div className="closing-grid" aria-hidden="true" />
            <BrandMark compact />
            <span className="eyebrow">Your next job starts here</span>
            <h2>
              Find the work.
              <br />
              <span>Build what’s next.</span>
            </h2>
            <p>
              Start with a free account. We review every company before it joins
              the network.
            </p>
            <div className="closing-actions">
              <Link className="button button-light button-large" href="/join">
                Join free <ArrowUpRight size={17} />
              </Link>
              <Link className="button button-outline-light" href="/contact">
                Talk to a person
              </Link>
            </div>
            <span className="closing-note">
              <CircleDollarSign size={15} /> No card required to get started
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
