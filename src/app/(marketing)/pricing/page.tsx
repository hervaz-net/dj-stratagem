import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, CircleHelp } from "lucide-react";
import { FaqList } from "@/components/faq-list";
import { Reveal } from "@/components/reveal";
import { faqs } from "@/lib/site-data";
import { display, eyebrow, sectionY, shell } from "@/lib/ui";

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
      <section className="border-b border-base-300 py-16 sm:py-24">
        <div className={`${shell} text-center`}>
          <p className={eyebrow}>Straightforward access</p>
          <h1 className={`${display} mt-4`}>
            Start free.
            <br />
            <span className="text-primary">Scale when you’re ready.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base-content/75">
            Begin with a free account. For paid plans, we’ll talk through your workflow and share the scope before you commit.
          </p>
          <ul className="mt-6 flex flex-col items-center gap-2 text-sm text-base-content/75 sm:flex-row sm:justify-center sm:gap-6">
            {["No card to start", "Paid access by request", "Reviewed by a person"].map((item) => (
              <li className="inline-flex items-center gap-2" key={item}>
                <Check className="text-success" size={15} /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={sectionY}>
        <div className={shell}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, index) => (
              <Reveal delay={index * 0.05} key={plan.name}>
                <article className={`card h-full border bg-base-100 ${plan.featured ? "border-primary" : "border-base-300"}`}>
                  <div className="card-body">
                    {plan.featured && <span className="badge badge-primary w-fit">A place to start</span>}
                    <h2 className="card-title">{plan.name}</h2>
                    <p className="text-sm text-base-content/70">{plan.description}</p>
                    <p className="text-2xl font-semibold tracking-tight">{plan.price}</p>
                    <p className="text-xs text-base-content/55">{plan.qualifier}</p>
                    <ul className="my-2 grid gap-2 border-t border-base-300 pt-4 text-sm">
                      {plan.features.map((feature) => (
                        <li className="flex items-start gap-2" key={feature}>
                          <Check aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={15} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link className={`btn mt-auto ${plan.featured ? "btn-primary" : "btn-outline"}`} href={plan.href}>
                      {plan.action} <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-box border border-base-300 p-4 text-sm text-base-content/70 sm:flex-row sm:items-center">
            <CircleHelp className="shrink-0 text-primary" size={18} />
            <p className="flex-1">
              Paid plan pricing depends on the scope and access your team needs. We’ll explain the fit and cost before you decide—no surprise upgrade or automatic charge. Published prices are not listed because they are confirmed with you.
            </p>
            <Link className="link link-primary inline-flex items-center gap-1 font-semibold" href="/contact">
              Ask a question <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <section className={`${sectionY} border-t border-base-300 bg-base-200/40`}>
        <div className={`${shell} grid gap-8 lg:grid-cols-[0.8fr_1.2fr]`}>
          <div>
            <p className={eyebrow}>Before you join</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>Clear answers, from a person.</h2>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
