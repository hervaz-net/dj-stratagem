import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, CircleHelp } from "lucide-react";
import { FaqList } from "@/components/faq-list";
import { Reveal } from "@/components/reveal";
import { faqs } from "@/lib/site-data";
import { btn, btnSecondary, display, eyebrow, sectionTitle, sectionY, shell } from "@/lib/ui";

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
    features: ["Create a company profile", "Get started in the D&J network", "Explore the nine connected modes", "Human-reviewed account request"],
    action: "Join free",
    href: "/join",
    featured: false,
  },
  {
    name: "Professional",
    description: "For a trade business building a steady pipeline.",
    price: "Request access",
    qualifier: "Plan reviewed with you",
    features: ["A guided setup for your company", "A workflow matched to your trade", "Access plan discussed before you commit", "Talk with a real person"],
    action: "Request access",
    href: "/contact?topic=Professional%20access",
    featured: true,
  },
  {
    name: "Growth",
    description: "For teams coordinating more work and people.",
    price: "Request access",
    qualifier: "Scoped for your team",
    features: ["A plan built around your workflow", "Coordinate the modes your jobs need", "Team and rollout conversation", "Clear scope before you decide"],
    action: "Request access",
    href: "/contact?topic=Growth%20access",
    featured: false,
  },
  {
    name: "Enterprise",
    description: "For organizations with complex operations.",
    price: "Request access",
    qualifier: "Talk to our team",
    features: ["Discuss the right scope together", "Plan for your operating model", "Review onboarding and support needs", "Custom proposal before commitment"],
    action: "Talk to our team",
    href: "/contact?topic=Enterprise%20access",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-line-soft bg-[radial-gradient(ellipse_at_78%_20%,oklch(70%_0.16_50/0.11),transparent_35rem)] py-[clamp(70px,9vw,120px)]">
        <div className={`${shell} text-center`}>
          <span className={`${eyebrow} justify-center`}>Straightforward access</span>
          <h1 className={`${display} mt-0`}>
            Start free.
            <br />
            <span className="text-primary">Scale when you’re ready.</span>
          </h1>
          <p className="mx-auto mt-[19px] max-w-[560px] text-[15px] leading-[1.8] text-ink-dim">
            Begin with a free account. For paid plans, we’ll talk through your workflow and share the scope before you commit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-[11px] text-ink-dim">
            {["No card to start", "Paid access by request", "Reviewed by a person"].map((item) => (
              <span className="inline-flex items-center gap-1.5" key={item}>
                <Check className="text-success" size={15} /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className={`${sectionY} pt-[65px]`}>
        <div className={shell}>
          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, index) => (
              <Reveal delay={index * 0.05} key={plan.name}>
                <article className={`card relative min-h-[435px] rounded-[6px] border bg-base-300 p-0 max-[680px]:min-h-0 ${plan.featured ? "border-primary/60 bg-gradient-to-br from-primary/12 to-base-300" : "border-line"}`}>
                  {plan.featured && (
                    <span className="badge badge-primary absolute -top-px -right-px rounded-none rounded-tr-[5px] rounded-bl-[5px] font-mono text-[7px] tracking-[0.04em] uppercase">
                      A place to start
                    </span>
                  )}
                  <div className="card-body px-[19px] pt-[22px] pb-[18px]">
                    <span className="text-[17px] font-[650]">{plan.name}</span>
                    <p className="min-h-[38px] text-[10px] leading-[1.6] text-ink-muted">{plan.description}</p>
                    <div className="min-h-[39px] text-[22px] font-[700] tracking-[-0.05em]">{plan.price}</div>
                    <span className="text-[9px] text-ink-muted">{plan.qualifier}</span>
                    <ul className="my-[23px] grid gap-[11px] border-t border-line-soft pt-[17px]">
                      {plan.features.map((feature) => (
                        <li className="flex items-start gap-2 text-[10px] leading-[1.5] text-ink-dim" key={feature}>
                          <Check aria-hidden="true" className="mt-0.5 shrink-0 text-success" size={15} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link className={`${plan.featured ? btn : btnSecondary} mt-auto w-full text-[11px]`} href={plan.href}>
                      {plan.action} <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="alert mt-3.5 items-center rounded-[4px] border border-line-soft bg-transparent py-[13px] text-[10px] text-ink-muted">
            <CircleHelp className="text-primary" size={17} />
            <p className="flex-1">
              Paid plan pricing depends on the scope and access your team needs. We’ll explain the fit and cost before you decide—no surprise upgrade or automatic charge.
            </p>
            <Link className="link inline-flex items-center gap-1 text-[10px] font-[650] text-primary no-underline" href="/contact">
              Ask a question <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <section className={`${sectionY} border-t border-line-soft bg-base-200`}>
        <div className={`${shell} grid gap-[70px] max-[680px]:gap-6 min-[901px]:grid-cols-[minmax(260px,0.8fr)_minmax(0,1fr)]`}>
          <div>
            <span className={eyebrow}>Before you join</span>
            <h2 className={`${sectionTitle} text-[clamp(36px,4.2vw,51px)]`}>Clear answers, from a person.</h2>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>
    </>
  );
}
