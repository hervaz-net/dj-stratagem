import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, CircleHelp } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with D&J Stratagem. Explore Professional, Growth, and Enterprise access with a clear, person-to-person plan review.",
  alternates: { canonical: "/pricing" },
};

const plans = [
  {
    name: "Starter",
    description: "Get your company on the desk.",
    price: "Free",
    qualifier: "Free to start",
    features: [
      "Create a company profile",
      "Get started in the D&J network",
      "Explore the nine connected modes",
      "Human-reviewed account request",
    ],
    action: "Join free",
    href: "/join",
    featured: false,
  },
  {
    name: "Professional",
    description: "For a trade business building a steady pipeline.",
    price: "Request access",
    qualifier: "Plan reviewed with you",
    features: [
      "A guided setup for your company",
      "A workflow matched to your trade",
      "Access plan discussed before you commit",
      "Talk with a real person",
    ],
    action: "Request access",
    href: "/contact?topic=Professional%20access",
    featured: true,
  },
  {
    name: "Growth",
    description: "For teams coordinating more work and people.",
    price: "Request access",
    qualifier: "Scoped for your team",
    features: [
      "A plan built around your workflow",
      "Coordinate the modes your jobs need",
      "Team and rollout conversation",
      "Clear scope before you decide",
    ],
    action: "Request access",
    href: "/contact?topic=Growth%20access",
    featured: false,
  },
  {
    name: "Enterprise",
    description: "For organizations with complex operations.",
    price: "Request access",
    qualifier: "Talk to our team",
    features: [
      "Discuss the right scope together",
      "Plan for your operating model",
      "Review onboarding and support needs",
      "Custom proposal before commitment",
    ],
    action: "Talk to our team",
    href: "/contact?topic=Enterprise%20access",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="page-hero pricing-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">Straightforward access</span>
          <h1>
            Start free.
            <br />
            <span>Scale when you’re ready.</span>
          </h1>
          <p>
            Begin with a free account. For paid plans, we’ll talk through your
            workflow and share the scope before you commit.
          </p>
          <div className="pricing-trust">
            <span><Check size={15} /> No card to start</span>
            <span><Check size={15} /> Paid access by request</span>
            <span><Check size={15} /> Reviewed by a person</span>
          </div>
        </div>
      </section>
      <section className="section pricing-section">
        <div className="container">
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <Reveal delay={index * 0.05} key={plan.name}>
                <article
                  className={`pricing-card${plan.featured ? " pricing-card-featured" : ""}`}
                >
                  {plan.featured && (
                    <span className="pricing-card-ribbon">A place to start</span>
                  )}
                  <span className="plan-name">{plan.name}</span>
                  <p className="plan-description">{plan.description}</p>
                  <div className="plan-price">{plan.price}</div>
                  <span className="plan-qualifier">{plan.qualifier}</span>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check aria-hidden="true" size={15} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className={`button ${plan.featured ? "button-primary" : "button-secondary"}`}
                    href={plan.href}
                  >
                    {plan.action} <ArrowUpRight size={15} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="pricing-note">
            <CircleHelp size={17} />
            <p>
              Paid plan pricing depends on the scope and access your team needs.
              We’ll explain the fit and cost before you decide—no surprise
              upgrade or automatic charge.
            </p>
            <Link href="/contact">Ask a question <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </section>
      <section className="section pricing-faq">
        <div className="container faq-layout">
          <div>
            <span className="eyebrow">Before you join</span>
            <h2>Clear answers, from a person.</h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>Is Starter really free?</summary>
              <p>
                Yes. There’s no card required to request and set up a Starter
                account. Every company is reviewed by a person.
              </p>
            </details>
            <details>
              <summary>What does a paid plan cost?</summary>
              <p>
                We’ll confirm a plan’s scope and price with you before you
                commit. Request access and our team will talk through your
                workflow.
              </p>
            </details>
            <details>
              <summary>Do I have to use all nine modes?</summary>
              <p>
                No. Start with the parts that fit your business. Talk with our
                team about which workflows are available for your account.
              </p>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
