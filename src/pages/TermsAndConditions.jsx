import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1 · The Services",
    body: "We grant you a non-exclusive, non-transferable right to access the Services during your subscription term for your internal business purposes. Features vary by plan. We may improve the Services, but will not materially reduce core functionality during a paid term.",
  },
  {
    title: "2 · Accounts and acceptable use",
    body: "You are responsible for your users and everything done under your account. Do not reverse engineer, resell, scrape, benchmark for a rival product, or attempt to access another party's bid data. Do not use the Services to coordinate pricing or rig bids. Do not upload content you lack rights to.",
  },
  {
    title: "3 · Fees and billing",
    body: "Fees are billed in advance from your order form or plan page. Invoices are due in 30 days unless stated otherwise. Overdue amounts may accrue interest and we may suspend access after 15 days' written notice. Payments are non-refundable except where required by law. Billing questions go to billing@djstratageminc.com.",
  },
  {
    title: "4 · Your data",
    body: "You own the bids, quotes, drawings and contact records you submit. You grant us the licence needed to host and display that content to run the Services. On termination you may export your data for 30 days; after 90 days we delete it.",
  },
  {
    title: "5 · Bids are yours",
    body: "D&J Stratagem is a tool, not a party to your contracts. Estimates, levelling results and AI suggestions are aids to your judgement, not professional advice. You remain responsible for the numbers you submit and the awards you make.",
  },
  {
    title: "6 · Intellectual property",
    body: "We own the Services, software, name and mark. Nothing here transfers them to you. Feedback may be used without obligation. You may not use our marks without written permission.",
  },
  {
    title: "7 · Confidentiality",
    body: "Each party will protect the other's confidential information with at least reasonable care and use it only to perform under these Terms.",
  },
  {
    title: "8 · Warranties and disclaimers",
    body: "We warrant that the Services will perform materially as described. Otherwise they are provided as-is, and we disclaim merchantability, fitness for a particular purpose and non-infringement to the fullest extent permitted by law.",
  },
  {
    title: "9 · Limitation of liability",
    body: "Neither party is liable for indirect or consequential damages, lost profits or lost bids. Each party's total liability is capped at the fees paid or payable in the 12 months before the claim, except for payment obligations, indemnities, or liability that cannot be limited by law.",
  },
  {
    title: "10 · Term, suspension and termination",
    body: "Subscriptions renew automatically unless either party gives 30 days' notice before renewal. Either party may terminate for a material breach not cured within 30 days. We may suspend access for non-payment after notice, or for conduct that threatens the Services.",
  },
  {
    title: "11 · Governing law and disputes",
    body: "These Terms are governed by California law. Exclusive venue is the state and federal courts in Los Angeles County, California.",
  },
  {
    title: "12 · General",
    body: "These Terms, any order form and the Privacy Policy are the entire agreement. We may update these Terms on 30 days' notice; continued use after the effective date is acceptance.",
  },
];

export default function TermsAndConditions() {
  return (
    <>
      <Seo
        title="Terms and Conditions"
        description="Terms that govern use of the D&J Stratagem website, applications, and services."
      />
      <Section className="pt-16 pb-20 md:pt-24">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-paper md:text-5xl">
          Terms and Conditions
        </h1>
        <p className="mt-4 text-sm text-steel">
          D&amp;J Stratagem, Inc. · Effective 1 August 2026 · Last updated 1 August 2026
        </p>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-steel">
          These Terms govern your use of the websites, applications and services of D&amp;J
          Stratagem, Inc. By creating an account, signing an order form, or using the Services,
          you agree to them. See also the{" "}
          <Link className="font-medium text-amber hover:text-amber-2" to="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-12 max-w-2xl space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-amber">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-12 max-w-2xl rounded-2xl border border-line bg-ink-2 px-6 py-5 text-sm leading-relaxed text-steel">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber">Notices</p>
          <p className="mt-3 text-paper">D&amp;J Stratagem, Inc.</p>
          <p>506 S Spring St #13308, Los Angeles, CA 90013</p>
          <p className="mt-2">
            <a className="font-medium text-amber hover:text-amber-2" href="mailto:corporate@djstratageminc.com">
              corporate@djstratageminc.com
            </a>
            {" · "}
            <a className="font-medium text-amber hover:text-amber-2" href="mailto:billing@djstratageminc.com">
              billing@djstratageminc.com
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
