import LegalDoc from "../components/legal/LegalDoc";

// Same wording as privacy-print.html in /public (the printable copy). Change both together.
const SECTIONS = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>D&amp;J Stratagem, Inc. is a Delaware corporation with offices at 506 S Spring St #13308, Los Angeles, CA 90013. We act as the controller of personal information collected through our website and marketing, and as a processor of the project, bid and contact data our customers upload into the Services.</p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <>
        <div className="overflow-x-auto"><table>
        <tbody>
        <tr><th scope="row">Account data</th><td>Name, business email, company, role, phone number and billing details you provide when you register or subscribe.</td></tr>
        <tr><th scope="row">Customer content</th><td>Bids, quotes, drawings, scope schedules, pricing, contact records and messages you or your invitees upload to the Services.</td></tr>
        <tr><th scope="row">Usage data</th><td>IP address, device and browser type, pages viewed, features used, and timestamps, collected through server logs and strictly necessary cookies.</td></tr>
        <tr><th scope="row">Support data</th><td>Correspondence you send to our support, billing or sales addresses, and any attachments included with it.</td></tr>
        <tr><th scope="row">Third-party data</th><td>Business contact and firmographic details from public registries, permit records and lead partners, used for marketing and lead qualification.</td></tr>
        </tbody>
        </table></div>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: (
      <>
        <ul>
        <li>To provide, secure and support the Services, including hosting your bids and routing invitations.</li>
        <li>To bill you, collect payment and keep accounting records.</li>
        <li>To improve the Services, including training and tuning AI features on aggregated or de-identified data. We do not use one customer's confidential bid pricing to train models offered to another customer.</li>
        <li>To send service notices, and — where permitted — marketing about features and events. You can opt out of marketing at any time.</li>
        <li>To detect fraud and abuse, enforce our terms, and comply with legal obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing",
    body: (
      <>
        <p>We do not sell personal information. We share it only with:</p>
        <ul>
        <li><strong>Other participants in a bid</strong> you take part in — a general contractor sees the quotes submitted to its package, and an invited subcontractor sees the package it was invited to.</li>
        <li><strong>Service providers</strong> that host the site, process payments, or send email on our behalf, bound by contract to use the data only for us. We do not run an analytics or advertising pixel on the public site.</li>
        <li><strong>Professional advisers and acquirers</strong> in connection with an audit, financing or sale of the business.</li>
        <li><strong>Authorities</strong> where required by law or to protect rights and safety.</li>
        </ul>
      </>
    ),
  },
  {
    id: "retention-and-security",
    title: "Retention and security",
    body: (
      <>
        <p>We keep account and customer content for as long as your subscription is active and for 90 days after termination, after which it is deleted or de-identified, except where a longer period is required for tax, accounting or legal purposes. Data is encrypted in transit and at rest, access is limited to staff who need it, and we review our controls annually. No system is perfectly secure; report a suspected issue to <a href="mailto:support@djstratageminc.com">support@djstratageminc.com</a>.</p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>Depending on where you live, you may request access to, correction of, or deletion of your personal information, ask us to restrict or stop certain processing, and receive a portable copy. California residents may exercise the rights granted by the CCPA/CPRA, including the right to know, delete and correct, and to be free from discrimination for exercising them. Send requests to <a href="mailto:hello@djstratageminc.com">hello@djstratageminc.com</a>; we respond within 45 days. If your data was uploaded by a customer of ours, we will refer your request to that customer.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <>
        <p>The public site stores theme preference and cookie-consent choice in local storage on your device. Session cookies keep you signed in after you create an account. There is no analytics or advertising pixel. The banner on first visit records that choice; the Services still work if you dismiss it.</p>
      </>
    ),
  },
  {
    id: "children-and-international-transfers",
    title: "Children and international transfers",
    body: (
      <>
        <p>The Services are for business use and are not directed to anyone under 18. We store data in the United States; where we receive personal information from outside the United States, we rely on standard contractual clauses or another lawful transfer mechanism.</p>
      </>
    ),
  },
  {
    id: "changes-and-contact",
    title: "Changes and contact",
    body: (
      <>
        <p>We will post any change here and update the date above; material changes are notified by email at least 14 days before they take effect.</p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalDoc
      title="Privacy Policy"
      description="How D&J Stratagem, Inc. collects, uses, and protects personal information on Stratagem Exchange and djstratageminc.com."
      effective="1 August 2026"
      updated="2 September 2026"
      printable="/privacy-print.html"
      contactHeading="Contact"
      intro={
        <>
          This policy explains what D&amp;J Stratagem, Inc. ("D&amp;J Stratagem", "we", "us") collects when you visit djstratageminc.com or use Stratagem Exchange or our bidding, marketing, CRM and AI services (the "Services"), how we use it, and the choices you have. Questions go to <a href="mailto:hello@djstratageminc.com">hello@djstratageminc.com</a>.
        </>
      }
      contact={
        <>
          D&amp;J Stratagem, Inc.<br />506 S Spring St #13308, Los Angeles, CA 90013<br /><a href="mailto:hello@djstratageminc.com">hello@djstratageminc.com</a> · <a href="mailto:support@djstratageminc.com">support@djstratageminc.com</a>
        </>
      }
      sections={SECTIONS}
    />
  );
}

