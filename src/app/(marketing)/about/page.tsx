import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About D&J",
  description:
    "D&J Stratagem is a Los Angeles-based construction platform built to connect the work, people, and tools that move a job forward.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    number: "01",
    title: "Respect the work",
    text: "Construction is a team sport. Our tools should make the work easier to coordinate, not add another layer of busywork.",
  },
  {
    number: "02",
    title: "Keep it connected",
    text: "A job does not stop at the bid. We build around the full path from opportunity to delivery to the next customer.",
  },
  {
    number: "03",
    title: "People stay in control",
    text: "Accounts are reviewed by a person. AI can prepare work, but humans approve before it runs.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero about-hero">
        <div className="container about-hero-grid">
          <div className="page-hero-inner">
            <span className="eyebrow">A construction company’s desk</span>
            <h1>
              Built around the people
              <br />
              <span>who build the place.</span>
            </h1>
            <p>
              D&amp;J Stratagem is a Los Angeles-based construction platform
              bringing the job lifecycle into one connected account.
            </p>
          </div>
          <div className="about-image">
            <Image
              alt="A construction site framed by steel and sunlight"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 45vw"
              src="/media/construction-structure.jpg"
            />
            <span>LOS ANGELES · SOUTHERN CALIFORNIA</span>
          </div>
        </div>
      </section>
      <section className="section about-story">
        <div className="container about-story-grid">
          <Reveal>
            <span className="eyebrow">Why we’re here</span>
            <h2>The project is connected. The paperwork rarely is.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              A contractor can find a project in one place, prepare a bid in
              another, chase a supplier by email, and still need to coordinate
              the crew and vehicles somewhere else. Each handoff costs time and
              context.
            </p>
            <p>
              Stratagem brings those steps into one place. Not to replace the
              people who know the job, but to give them a clearer way to move it
              forward.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="section principles-section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">How we build</span>
              <h2>Tools with their boots on the ground.</h2>
            </div>
            <p>
              Useful, accountable, and designed for the pace and pressure of
              real work.
            </p>
          </div>
          <div className="principle-grid">
            {principles.map((principle, index) => (
              <Reveal delay={index * 0.07} key={principle.number}>
                <article className="principle-card">
                  <span>{principle.number}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section about-location">
        <div className="container location-card">
          <div className="location-symbol">
            <MapPin aria-hidden="true" size={28} />
          </div>
          <div>
            <span className="eyebrow">Rooted here</span>
            <h2>Los Angeles is home base.</h2>
            <p>
              We’re focused on Southern California’s contractors,
              subcontractors, and suppliers—building a practical network around
              the region’s work.
            </p>
          </div>
          <div className="location-facts">
            <span><Wrench size={15} /> Built for the trades</span>
            <span><ShieldCheck size={15} /> Human-reviewed accounts</span>
          </div>
        </div>
      </section>
      <section className="section simple-cta-section">
        <div className="container simple-cta">
          <div>
            <span className="eyebrow">Build with us</span>
            <h2>Bring your next job into focus.</h2>
          </div>
          <Link className="button button-primary" href="/join">
            Join free <ArrowUpRight size={16} />
          </Link>
          <Link className="text-link" href="/contact">
            Talk to a person <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
