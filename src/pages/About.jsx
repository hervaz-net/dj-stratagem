import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import CompetitorList from "../components/CompetitorList";
import DashboardShot from "../components/DashboardShot";
import { IconTarget, IconLink, IconShield, IconTrendingUp, IconArrowRight } from "../components/icons";
import { TeamArt } from "../components/illustrations";

const values = [
  {
    icon: <IconLink />,
    title: "One platform, not another silo",
    text: "We measure ourselves by how many disconnected tools we replace, not how many features we ship.",
  },
  {
    icon: <IconTrendingUp />,
    title: "We sell growth",
    text: "Access to bids is table stakes. The platform exists to help contractors win work and grow revenue.",
  },
  {
    icon: <IconTarget />,
    title: "Focus over feature sprawl",
    text: "Construction software has a long history of becoming a digital junk drawer. We start with the workflows that win jobs, then expand deliberately.",
  },
  {
    icon: <IconShield />,
    title: "Trust runs through everything",
    text: "Verified licenses, transparent bid histories, and vendor ratings — so both sides of every deal can move fast with confidence.",
  },
];

const explore = [
  { to: "/projects", title: "Browse projects", text: "See bid opportunities by trade, city, and project value." },
  { to: "/blog", title: "Read the blog", text: "Notes on bidding, procurement, and how the platform works." },
  { to: "/resources", title: "Help center", text: "Searchable FAQs, guides, and ways to reach us." },
  { to: "/contact", title: "Contact us", text: "Talk to sales, support, or partnerships." },
];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="D&J Stratagem, Inc. builds the platform where contractors win work, market their business, manage relationships, and grow revenue."
      />

      <PageHeader
        eyebrow="About D&J Stratagem"
        title="The operating system for construction growth."
        lede="D&J Stratagem, Inc. builds the platform where contractors win work, market their business, manage relationships, and grow revenue — from the first opportunity to the final invoice."
        actions={
          <>
            <Button to="/contact" variant="primary">Contact us</Button>
            <Button to="/resources" variant="secondary">Visit the help center</Button>
          </>
        }
      >
        {/* Where we are. Usage metrics go here only once they are real and
            measured — see PROOF.md. */}
        <div className="card-corp p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber">
            Where we are today
          </p>
          <p className="mt-3 text-base leading-relaxed text-steel">
            D&amp;J Stratagem is pre-launch and currently onboarding early users. We&rsquo;d
            rather show you the product than quote numbers we haven&rsquo;t earned yet.
          </p>
          <Link
            to="/contact?topic=demo"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:text-amber-2"
          >
            Ask for a walkthrough <IconArrowRight width={14} height={14} />
          </Link>
        </div>
      </PageHeader>

      <Section band="white">
        <div className="grid-x grid-margin-x gap-y-10">
          <div className="cell small-12 large-6">
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="text-balance text-xl font-semibold tracking-tight text-paper md:text-2xl">
              Every competitor solves one problem.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              Contractors today stitch together plan rooms, lead services, bid tools, CRMs,
              and marketing agencies &mdash; and none of them talk to each other. The result is
              double entry, missed follow-ups, and opportunities that die in an inbox.
            </p>
            <CompetitorList className="mt-6" />
          </div>
          <div className="cell small-12 large-6">
            <Eyebrow>What we build</Eyebrow>
            <h2 className="text-balance text-xl font-semibold tracking-tight text-paper md:text-2xl">
              The whole pipeline, opportunity to award.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              We built D&amp;J Stratagem to be the platform a contractor runs their growth on:
              bidding and awards, marketing and lead generation, CRM and estimating, documents
              and e-signatures &mdash; with AI woven through all of it.
            </p>
            <p className="mt-4 text-base leading-relaxed text-steel">
              That's a stronger promise than access to bid listings. We're selling growth:
              win more projects, build bigger business.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button to="/platform" variant="secondary">See the platform</Button>
              <Button to="/projects" variant="ghost">Browse projects</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section band="stone">
        <Eyebrow>What we believe</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
          The principles behind the platform.
        </h2>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {values.map((v) => (
            <div key={v.title} className="cell small-12 medium-6">
              <div className="card-corp card-corp-hover h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center bg-amber/10 text-amber">
                  {v.icon}
                </div>
                <h3 className="mt-5 text-base font-semibold text-paper">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="vetting" band="white">
        <div className="grid-x grid-margin-x items-center gap-y-10">
          <DashboardShot
            src="/screenshots/dash-admin.png"
            alt="Platform admin dashboard showing pending account requests waiting for approval"
            label="Accounts"
            className="cell small-12 large-6"
          />
          <div className="cell small-12 large-6">
            <Eyebrow>How accounts get vetted</Eyebrow>
            <h2 className="text-balance text-xl font-semibold tracking-tight text-paper md:text-2xl">
              Every account is reviewed before it goes live.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              New sign-ups don&rsquo;t get network access automatically. Our team reviews each
              one &mdash; company details, license and insurance information, the works &mdash;
              before it can post a project, submit a bid, or quote into Supply Exchange. That
              review is what makes the vendor ratings and verified credentials elsewhere on the
              platform mean something.
            </p>
            <p className="mt-4 text-sm text-steel">
              Waiting on an approval or have a question about the process? Check the{" "}
              <Link to="/resources" className="font-medium text-amber hover:text-amber-2">help center</Link>{" "}
              or{" "}
              <Link to="/contact?topic=support" className="font-medium text-amber hover:text-amber-2">contact support</Link>.
            </p>
          </div>
        </div>
      </Section>

      {/* Careers. Named team members and specific open roles go back only when
          they are real people and real openings — see PROOF.md. */}
      <Section id="careers" band="stone">
        <div className="grid-x grid-margin-x items-center gap-y-10">
          <div className="cell small-12 large-7">
            <Eyebrow>Careers</Eyebrow>
            <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
              Help build the platform for construction growth.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-steel">
              We&rsquo;re a small team with big ambitions. If you care about construction, software,
              and building things that actually get used &mdash; we&rsquo;d love to hear from you.
            </p>
            <p className="mt-6 text-sm text-steel">
              <a
                href="mailto:careers@djstratageminc.com"
                className="font-medium text-amber hover:text-amber-2"
              >
                Send us your resume
              </a>{" "}
              and tell us what you&rsquo;d want to build, or{" "}
              <Link to="/contact?topic=careers" className="font-medium text-amber hover:text-amber-2">
                write to us through the contact form
              </Link>
              .
            </p>
          </div>
          <div className="cell small-12 large-5 hidden lg:block">
            <TeamArt className="mx-auto h-auto w-full max-w-sm" />
          </div>
        </div>
      </Section>

      <Section band="white">
        <Eyebrow>Keep exploring</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
          See the product, or ask us anything.
        </h2>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {explore.map((l) => (
            <div key={l.to} className="cell small-12 medium-6 large-3">
              <Link
                to={l.to}
                className="card-corp card-corp-hover flex h-full flex-col p-5 no-underline"
              >
                <span className="text-base font-semibold text-paper">{l.title}</span>
                <span className="mt-1 flex-1 text-sm text-steel">{l.text}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber">
                  Go <IconArrowRight width={14} height={14} />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Let's talk about your growth."
        subtitle="We're always glad to hear how contractors are winning work today — and where the process still hurts."
        primaryLabel="Contact us"
        primaryTo="/contact"
        secondaryLabel="Browse projects"
        secondaryTo="/projects"
      />
    </>
  );
}
