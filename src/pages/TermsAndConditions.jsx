import { Link } from "react-router-dom";
import LegalDoc from "../components/legal/LegalDoc";

// Same wording as terms.html in /public (the printable copy). Change both together.
const SECTIONS = [
  {
    id: "the-services",
    title: "The Services",
    body: (
      <>
        <p>We grant you a non-exclusive, non-transferable right to access the Services during your subscription term for your internal business purposes. Features vary by plan, as set out in your order form. We may improve or change the Services, but will not materially reduce their core functionality during a paid term.</p>
      </>
    ),
  },
  {
    id: "accounts-and-acceptable-use",
    title: "Accounts and acceptable use",
    body: (
      <>
        <ul>
        <li>You are responsible for your users, their credentials and everything done under your account.</li>
        <li>Do not misuse the Services: no reverse engineering, resale, scraping, competitive benchmarking for a rival product, malware, or attempts to access another party's bid data.</li>
        <li>Do not use the Services to coordinate pricing with competitors, rig bids, or otherwise breach procurement or antitrust law.</li>
        <li>Do not upload content you lack the rights to, or content that is unlawful, infringing or confidential to a third party without permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "fees-and-billing",
    title: "Fees and billing",
    body: (
      <>
        <p>Fees are stated in your order form or plan page and are billed in advance, monthly or annually. Invoices are due 30 days from issue unless stated otherwise. Overdue amounts accrue interest at 1.5% per month or the maximum permitted by law, and we may suspend access after 15 days' written notice. Fees exclude taxes, which you are responsible for except on our net income. Except where required by law, payments are non-refundable; a terminated annual plan is not pro-rated. Billing questions go to <a href="mailto:billing@djstratageminc.com">billing@djstratageminc.com</a>.</p>
      </>
    ),
  },
  {
    id: "your-data",
    title: "Your data",
    body: (
      <>
        <p>You own the bids, quotes, drawings, contact records and other content you submit. You grant us the licence needed to host, process, transmit and display it in order to run the Services, including sharing a submitted bid with the party it was addressed to. We handle personal information as described in our <Link to="/privacy">Privacy Policy</Link>. On termination you may export your data for 30 days; after 90 days we delete it.</p>
      </>
    ),
  },
  {
    id: "bids-are-yours",
    title: "Bids are yours",
    body: (
      <>
        <p>D&amp;J Stratagem is a tool, not a party to your contracts. We do not verify the accuracy of quantities, rates, quotes, lead times or scope, and estimates, levelling results and AI suggestions are aids to your judgement, not professional advice. You remain solely responsible for the numbers you submit, the awards you make, and compliance with the tender rules that apply to you.</p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: (
      <>
        <p>We own the Services, the software, the D&amp;J Stratagem and Stratagem Exchange names and marks, and all related intellectual property. Nothing here transfers them to you. Feedback you give us may be used without obligation. You may not use our marks without written permission.</p>
      </>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    body: (
      <>
        <p>Each party will protect the other's confidential information with at least reasonable care, use it only to perform under these Terms, and disclose it only to people who need it and are bound to equivalent obligations. This does not cover information that is public, independently developed, or lawfully received from a third party.</p>
      </>
    ),
  },
  {
    id: "warranties-and-disclaimers",
    title: "Warranties and disclaimers",
    body: (
      <>
        <p>We warrant that the Services will perform materially as described in their documentation. Otherwise the Services are provided "as is", and to the fullest extent permitted by law we disclaim all other warranties, including merchantability, fitness for a particular purpose and non-infringement. We do not warrant uninterrupted or error-free operation.</p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>Neither party is liable for indirect, incidental, special or consequential damages, or for lost profits, lost bids, lost business or cost of substitute services. Each party's total liability arising out of these Terms is capped at the fees paid or payable in the 12 months before the event giving rise to the claim. These limits do not apply to your payment obligations, either party's indemnity obligations, or liability that cannot be limited by law.</p>
      </>
    ),
  },
  {
    id: "term-suspension-and-termination",
    title: "Term, suspension and termination",
    body: (
      <>
        <p>Subscriptions renew automatically for successive terms unless either party gives 30 days' notice before renewal. Either party may terminate for a material breach not cured within 30 days of written notice. We may suspend access immediately for non-payment after notice, or for conduct that threatens the security or lawful operation of the Services.</p>
      </>
    ),
  },
  {
    id: "governing-law-and-disputes",
    title: "Governing law and disputes",
    body: (
      <>
        <p>These Terms are governed by the laws of the State of California, without regard to conflict of law rules. The parties will attempt to resolve any dispute in good faith for 30 days; failing that, the exclusive venue is the state and federal courts located in Los Angeles County, California, and each party consents to their jurisdiction.</p>
      </>
    ),
  },
  {
    id: "general",
    title: "General",
    body: (
      <>
        <p>These Terms, with any order form and the Privacy Policy, are the entire agreement between us. Neither party may assign them without consent, except to a successor in a merger or sale of substantially all assets. If a provision is unenforceable, the rest stands. A waiver must be in writing. We may update these Terms on 30 days' notice; continued use after the effective date is acceptance.</p>
      </>
    ),
  },
];

export default function TermsAndConditions() {
  return (
    <LegalDoc
      title="Terms and Conditions"
      description="The terms that govern use of Stratagem Exchange and the other services of D&J Stratagem, Inc."
      effective="1 August 2026"
      updated="1 August 2026"
      printable="/terms.html"
      contactHeading="Notices"
      intro={
        <>
          These Terms govern your use of the websites, applications and services, including Stratagem Exchange, of D&amp;J Stratagem, Inc., a Delaware corporation at 506 S Spring St #13308, Los Angeles, CA 90013 (the "Services"). By creating an account, signing an order form, or using the Services, you agree to them. If you are agreeing on behalf of a company, you confirm you have authority to bind it.
        </>
      }
      contact={
        <>
          D&amp;J Stratagem, Inc.<br />506 S Spring St #13308, Los Angeles, CA 90013<br />Contract and corporate: <a href="mailto:corporate@djstratageminc.com">corporate@djstratageminc.com</a><br />Billing: <a href="mailto:billing@djstratageminc.com">billing@djstratageminc.com</a> · Accounting: <a href="mailto:accounting@djstratageminc.com">accounting@djstratageminc.com</a><br />Partnerships: <a href="mailto:b2b@djstratageminc.com">b2b@djstratageminc.com</a>
        </>
      }
      sections={SECTIONS}
    />
  );
}

