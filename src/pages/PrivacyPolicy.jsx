import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";

const sections = [
  {
    title: "1 · Who we are",
    body: "D&J Stratagem, Inc. is a Delaware corporation with offices at 506 S Spring St #13308, Los Angeles, CA 90013. We act as the controller of personal information collected through our website and marketing, and as a processor of the project, bid and contact data our customers upload into the Services.",
  },
  {
    title: "2 · What we collect",
    body: "Account data (name, business email, company, role, phone, billing), customer content (bids, quotes, drawings, contacts), usage data (IP, device, pages, timestamps), support correspondence, and business contact details from public registries used for lead qualification.",
  },
  {
    title: "3 · How we use it",
    body: "To provide, secure and support the Services; to bill and keep records; to improve features including AI on aggregated or de-identified data (we do not train one customer's confidential bid pricing into models offered to another); to send service notices and permitted marketing; and to detect fraud, enforce terms, and comply with law.",
  },
  {
    title: "4 · Sharing",
    body: "We do not sell personal information. We share it only with other participants in a bid you take part in, contracted service providers, professional advisers and acquirers, and authorities where required by law.",
  },
  {
    title: "5 · Retention and security",
    body: "Account and customer content is kept while a subscription is active and for 90 days after termination, then deleted or de-identified except where tax or legal rules require longer. Data is encrypted in transit and at rest. Report suspected issues to support@djstratageminc.com.",
  },
  {
    title: "6 · Your rights",
    body: "Depending on where you live, you may request access, correction, deletion, restriction, or a portable copy. California residents may exercise CCPA/CPRA rights. Send requests to hello@djstratageminc.com; we respond within 45 days.",
  },
  {
    title: "7 · Cookies",
    body: "The public site stores theme preference and cookie-consent choice in local storage. Session cookies keep you signed in after you create an account. There is no analytics or advertising pixel.",
  },
  {
    title: "8 · Children and international transfers",
    body: "The Services are for business use and are not directed to anyone under 18. We store data in the United States and use standard contractual clauses or another lawful mechanism for international transfers.",
  },
  {
    title: "9 · Changes and contact",
    body: "We will post any change here and update the date above. Material changes are notified by email at least 14 days before they take effect.",
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How D&J Stratagem, Inc. collects, uses, and shares personal information on djstratageminc.com and in the Services."
      />
      <Section className="pt-16 pb-20 md:pt-24">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-paper md:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-steel">
          D&amp;J Stratagem, Inc. · Effective 1 August 2026 · Last updated 2 September 2026
        </p>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-steel">
          This policy explains what D&amp;J Stratagem, Inc. collects when you visit
          djstratageminc.com or use our bidding, marketing, CRM and AI services, how we use
          it, and the choices you have. Questions go to{" "}
          <a className="font-medium text-amber hover:text-amber-2" href="mailto:hello@djstratageminc.com">
            hello@djstratageminc.com
          </a>
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
          <p className="text-xs font-semibold uppercase tracking-wider text-amber">Contact</p>
          <p className="mt-3 text-paper">D&amp;J Stratagem, Inc.</p>
          <p>506 S Spring St #13308, Los Angeles, CA 90013</p>
          <p className="mt-2">
            <a className="font-medium text-amber hover:text-amber-2" href="mailto:hello@djstratageminc.com">
              hello@djstratageminc.com
            </a>
            {" · "}
            <a className="font-medium text-amber hover:text-amber-2" href="mailto:support@djstratageminc.com">
              support@djstratageminc.com
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
