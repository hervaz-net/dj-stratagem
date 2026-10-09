import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Accordion from "../components/Accordion";
import Seo from "../components/Seo";
import HeroBids from "../components/home/HeroBids";
import OpportunityTable from "../components/home/OpportunityTable";
import LinkCard from "../components/home/LinkCard";
import { competitors } from "../data/competitors";
import {
  IconGavel,
  IconHelmet,
  IconMegaphone,
  IconBriefcase,
  IconPackage,
  IconSparkle,
  IconArrowRight,
  IconCheck,
  IconSearch,
} from "../components/icons";

const h2 = "text-balance text-2xl font-semibold tracking-tight text-paper-2 md:text-3xl";

const stats = [
  { value: "6", label: "Connected suites", detail: "Bidding, marketing, CRM, supply, tools, AI" },
  { value: "5+", label: "Tools replaced", detail: "One login instead of a patchwork" },
  { value: "1", label: "Pipeline", detail: "Opportunity through final invoice" },
];

const roles = [
  {
    to: "/solutions#gc",
    icon: <IconGavel />,
    title: "General contractors",
    text: "Post packages, invite subs, compare bids, and award with a clear paper trail.",
  },
  {
    to: "/solutions#sub",
    icon: <IconHelmet />,
    title: "Subcontractors",
    text: "Find work matching your trades and service area, and submit structured digital bids.",
  },
  {
    to: "/solutions#supplier",
    icon: <IconPackage />,
    title: "Suppliers",
    text: "Quote into sealed RFQs from contractors who need your products, and protect your margin.",
  },
  {
    to: "/platform#marketing-suite",
    icon: <IconMegaphone />,
    title: "Service providers",
    text: "Generate qualified commercial construction leads from a profile that ranks.",
  },
];

const shortcuts = [
  { to: "/projects", label: "Browse open projects", hint: "Bid opportunities by trade and city" },
  { to: "/supply/catalog", label: "Shop the catalog", hint: "300+ SKUs by brand, type, and quantity" },
  { to: "/quote", label: "Request a quote", hint: "Review your list and send it to our team" },
  { to: "/resources", label: "Help center", hint: "FAQs, guides, and how to reach us" },
];

const suites = [
  {
    to: "/solutions#gc",
    icon: <IconGavel />,
    title: "Bid management",
    text: "Post projects, invite subs, compare bids side by side, and award with confidence.",
  },
  {
    to: "/solutions#sub",
    icon: <IconHelmet />,
    title: "Project matching",
    text: "Find projects that match your trade, submit digital bids, and build a bid history that wins more work.",
  },
  {
    to: "/platform#marketing-suite",
    icon: <IconMegaphone />,
    title: "Marketing suite",
    text: "SEO-optimized profiles, lead generation, and AI-generated proposals that keep your pipeline full.",
  },
  {
    to: "/supply",
    icon: <IconPackage />,
    title: "Supply Exchange",
    text: "Source the materials you burn through every week with sealed, scored bidding — no race to the bottom.",
  },
  {
    to: "/platform#business-tools",
    icon: <IconBriefcase />,
    title: "Business tools",
    text: "CRM, estimating, invoicing, change orders, and e-signatures — plus a mobile app that keeps the field in sync with the office.",
  },
  {
    to: "/platform#ai-features",
    icon: <IconSparkle />,
    title: "AI built in",
    text: "Match to the right projects, predict bid competitiveness, and draft proposals in minutes, not hours.",
  },
];

const steps = [
  {
    n: "01",
    title: "Create your company profile",
    text: "Tell us your trades, locations, project types, capacity, and certifications. Verification happens once and travels with every bid you submit.",
  },
  {
    n: "02",
    title: "Discover matched opportunities",
    text: "The platform scores construction projects against your profile and surfaces the ones worth your time — with alerts when new work fits.",
  },
  {
    n: "03",
    title: "Manage your bid pipeline",
    text: "Track opportunities, deadlines, documents, contacts, and bid status in one place, so nothing dies in an inbox.",
  },
  {
    n: "04",
    title: "Win more work",
    text: "Use marketing, analytics, and follow-up tools to turn opportunities into revenue — then learn from what you win and lose.",
  },
];

const without = [
  "Five subscriptions, five logins",
  "Bid data retyped into the CRM",
  "Marketing handled by an outside agency",
  "Follow-ups lost in an inbox",
];
const withUs = [
  "One platform, one login",
  "Bids, awards, and CRM share a record",
  "Marketing runs from the same dashboard",
  "Every opportunity tracked to a decision",
];

const faqs = [
  {
    q: "How is this different from PlanHub or BuildingConnected?",
    a: "Those tools solve one slice — finding bids, or sending invitations. D&J Stratagem connects the whole pipeline: bidding and awards, marketing and lead generation, CRM and estimating, documents and e-signatures. You stop paying for five subscriptions that don't talk to each other.",
  },
  {
    q: "Do I need to be a general contractor to use it?",
    a: "No. General contractors, subcontractors, and suppliers all work from the same platform, each with workflows built for their side of the deal. Subs can start free with a profile and matched projects.",
  },
  {
    q: "What is Supply Exchange, exactly?",
    a: "A sourcing marketplace for the materials you reorder constantly — fasteners, lumber, conduit, PVC, plate, power tools. It uses sealed single-round quotes and multi-factor scored awards instead of an open reverse auction, so suppliers stay at the table and your fill rates hold up.",
  },
  {
    q: "How long does it take to get started?",
    a: "Profile setup takes under an hour. Most teams are bidding through the platform the same week. Growth and Enterprise plans include guided onboarding.",
  },
  {
    q: "Can I try it before committing?",
    a: "Starter is free: profile, matching, and a small bid cap. Paid plans are not self-serve trials. Request access or email hello@djstratageminc.com and we will open the right plan after review.",
  },
];

const textLink = "font-semibold text-amber hover:text-amber-2";

export default function Home() {
  return (
    <>
      <Seo
        title="Find Construction Projects. Bid Smarter. Win More Work."
        description="D&J Stratagem gives contractors, subcontractors, and suppliers the tools to discover construction bid opportunities, manage their pipeline, market their capabilities, and win more projects."
      />

      {/* 1 — dark hero */}
      <Section band="dark" className="pt-10 pb-10 md:pt-14 md:pb-12">
        <div className="grid-x grid-margin-x items-center gap-y-10">
          <div className="cell small-12 large-7">
            <Eyebrow>Bid intelligence for construction</Eyebrow>
            <h1 className="text-balance max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-paper-2 md:text-5xl">
              Find better construction projects. Bid smarter. Win more work.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-steel">
              D&amp;J Stratagem gives contractors, subcontractors, and suppliers the tools to
              discover bid opportunities, manage their pipeline, market their capabilities, and
              turn more opportunities into awarded projects.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button to="/projects" variant="primary">
                Find construction projects <IconArrowRight width={16} height={16} />
              </Button>
              <Button to="/platform" variant="secondary">
                See how it works
              </Button>
            </div>
            <p className="mt-6 text-sm text-steel">
              Built for contractors.{" "}
              <span className="font-semibold text-paper">Currently onboarding early users.</span>
            </p>
          </div>
          <div className="cell small-12 large-5">
            <HeroBids />
          </div>
        </div>

        <div className="mt-12 grid-x grid-margin-x gap-y-6 md:mt-14">
          {stats.map((s) => (
            <div key={s.label} className="cell small-12 medium-4">
              <div className="border-t border-line pt-4">
                <p className="mb-0 text-3xl font-semibold tracking-tight text-paper-2">{s.value}</p>
                <p className="mb-0 mt-1 text-sm font-semibold text-amber">{s.label}</p>
                <p className="mb-0 mt-0.5 text-sm text-steel">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 2 — white: role router */}
      <Section band="white">
        <div className="max-w-2xl">
          <Eyebrow>Start here</Eyebrow>
          <h2 className={h2}>Where do you want to start?</h2>
          <p className="mb-0 mt-3 text-base leading-relaxed text-steel">
            Pick the side of the deal you work on, or jump straight to a live page.
          </p>
        </div>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {roles.map((r) => (
            <div key={r.title} className="cell small-12 medium-6 large-3">
              <LinkCard to={r.to} icon={r.icon} title={r.title} cta="See the workflow">
                {r.text}
              </LinkCard>
            </div>
          ))}
        </div>
        <div className="mt-8 grid-x grid-margin-x gap-y-3">
          {shortcuts.map((s) => (
            <div key={s.to} className="cell small-12 medium-6 large-3">
              <Link
                to={s.to}
                className="group block border-t border-line pt-3 no-underline hover:border-amber"
              >
                <span className="flex items-center justify-between text-sm font-semibold text-paper-2 group-hover:text-amber">
                  {s.label} <IconArrowRight width={14} height={14} />
                </span>
                <span className="mt-0.5 block text-xs text-steel">{s.hint}</span>
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* 3 — stone: matched opportunities */}
      <Section band="stone">
        <div className="grid-x grid-margin-x items-center gap-y-8">
          <div className="cell small-12 large-5">
            <Eyebrow>What you get</Eyebrow>
            <h2 className={h2}>Matched opportunities, not a firehose of RFPs.</h2>
            <p className="mb-0 mt-4 text-base leading-relaxed text-steel">
              Every project is scored against your trade, service area, project size, and past
              work &mdash; so you spend your time on the bids you can actually win.
            </p>
            <ul className="m-0 mt-5 list-none space-y-2.5 p-0">
              {[
                "Alerts when new work fits your profile",
                "Deadlines, documents, and contacts tracked per bid",
                "A bid history that sharpens every submission",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-paper">
                  <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Button to="/projects" variant="primary">
                <IconSearch width={16} height={16} /> Browse open projects
              </Button>
            </div>
          </div>
          <div className="cell small-12 large-7">
            <OpportunityTable />
          </div>
        </div>
      </Section>

      {/* 4 — white: suites */}
      <Section band="white">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Eyebrow>The platform</Eyebrow>
            <h2 className={h2}>Everything a growing contractor needs.</h2>
          </div>
          <Button to="/platform" variant="secondary">
            See the full platform <IconArrowRight width={16} height={16} />
          </Button>
        </div>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {suites.map((f) => (
            <div key={f.title} className="cell small-12 medium-6 large-4">
              <LinkCard to={f.to} icon={f.icon} title={f.title} cta="Learn more">
                {f.text}
              </LinkCard>
            </div>
          ))}
        </div>
      </Section>

      {/* 5 — dark: why one platform */}
      <Section band="dark">
        <div className="grid-x grid-margin-x gap-y-10">
          <div className="cell small-12 large-6">
            <Eyebrow>The problem</Eyebrow>
            <h2 className={h2}>Most platforms solve one piece of the puzzle.</h2>
            <p className="mb-0 mt-4 text-base leading-relaxed text-steel">
              Contractors end up stitching together five tools to do one job &mdash; and still
              handle marketing, CRM, and document management somewhere else entirely.
            </p>
            <ul className="m-0 mt-6 list-none border-t border-line p-0">
              {competitors.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between gap-4 border-b border-line py-3 text-sm"
                >
                  <span className="font-semibold text-paper">{c.name}</span>
                  <span className="text-steel">{c.does}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="cell small-12 large-6">
            <Eyebrow>Why it&rsquo;s different</Eyebrow>
            <h2 className={h2}>We sell growth, not just access to bids.</h2>
            <p className="mb-0 mt-4 text-base leading-relaxed text-steel">
              Bidding, marketing, CRM, estimating, and AI on one connected platform. Once you rely
              on it, switching gets painful &mdash; in a good way &mdash; because you own the whole
              pipeline from opportunity to award.
            </p>
            <div className="mt-6 grid-x grid-margin-x gap-y-4">
              <div className="cell small-12 medium-6">
                <div className="h-full border border-line p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-steel">
                    Without a platform
                  </p>
                  <ul className="m-0 mt-3 list-none space-y-2 p-0 text-sm text-steel">
                    {without.map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <span className="mt-2 h-px w-2.5 shrink-0 bg-steel" aria-hidden="true" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="cell small-12 medium-6">
                <div className="h-full border border-amber p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber">
                    On D&amp;J Stratagem
                  </p>
                  <ul className="m-0 mt-3 list-none space-y-2 p-0 text-sm text-paper">
                    {withUs.map((t) => (
                      <li key={t} className="flex items-start gap-2.5">
                        <IconCheck width={14} height={14} className="mt-0.5 shrink-0 text-amber" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm text-steel">
              Compare plans on{" "}
              <Link to="/pricing" className={textLink}>
                Pricing
              </Link>{" "}
              or read{" "}
              <Link to="/about" className={textLink}>
                how accounts are vetted
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* 6 — white: how it works */}
      <Section band="white">
        <div className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className={h2}>Designed for contractors who are serious about growth.</h2>
        </div>
        <div className="mt-8 grid-x grid-margin-x gap-y-6">
          {steps.map((s) => (
            <div key={s.n} className="cell small-12 medium-6 large-3">
              <div className="h-full border-t-2 border-paper pt-4">
                <span className="text-sm font-semibold tabular-nums text-amber">{s.n}</span>
                <h3 className="mt-2 text-base font-semibold text-paper-2">{s.title}</h3>
                <p className="mb-0 mt-2 text-sm leading-relaxed text-steel">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button to="/projects" variant="primary">
            Start finding projects <IconArrowRight width={16} height={16} />
          </Button>
          <Button to="/pricing" variant="secondary">
            View plans
          </Button>
        </div>
      </Section>

      {/* 7 — stone: FAQ */}
      <Section band="stone">
        <div className="grid-x grid-margin-x gap-y-8">
          <div className="cell small-12 large-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 className={h2}>Answers before you sign up.</h2>
            <p className="mt-4 text-sm leading-relaxed text-steel">
              Still deciding? Browse the{" "}
              <Link to="/resources" className={textLink}>
                help center
              </Link>
              , check{" "}
              <Link to="/pricing" className={textLink}>
                plans and pricing
              </Link>
              , or{" "}
              <Link to="/contact" className={textLink}>
                talk to us
              </Link>
              .
            </p>
          </div>
          <div className="cell small-12 large-8">
            <Accordion items={faqs} />
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
