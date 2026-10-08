import { Link } from "react-router-dom";
import Seo from "../Seo";
import Button from "../Button";
import { Eyebrow } from "../Section";
import { IconPrinter } from "../icons";
import { PRODUCT, COMPANY_LEGAL } from "../../brand";

const prose =
  "text-[0.97rem] leading-relaxed text-fg " +
  "[&_p]:mt-3 [&_p:first-child]:mt-0 " +
  "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_li]:pl-1 [&_li]:marker:text-fg-muted " +
  "[&_strong]:font-semibold " +
  "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-brand-hover " +
  "[&_table]:w-full [&_table]:min-w-[30rem] [&_table]:text-sm [&_tr]:border-b [&_tr]:border-line [&_tr:last-child]:border-0 " +
  "[&_th]:w-40 [&_th]:py-3 [&_th]:pr-4 [&_th]:text-left [&_th]:align-top [&_th]:font-semibold " +
  "[&_td]:py-3 [&_td]:text-fg-muted";

const OTHER = {
  "/privacy-print.html": { to: "/terms", label: "Terms and Conditions" },
  "/terms-print.html": { to: "/privacy", label: "Privacy Policy" },
};

/**
 * Readable, themed layout for a legal document. The wording lives in the page
 * and must match the printable copy in /public word for word.
 */
export default function LegalDoc({
  title,
  description,
  effective,
  updated,
  printable,
  intro,
  sections,
  contact,
  contactHeading = "Contact",
}) {
  const other = OTHER[printable];

  return (
    <>
      <Seo title={title} description={description} />

      <section className="border-b border-line bg-surface px-5 pb-12 pt-12 sm:px-6 md:pb-16 md:pt-16">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-fg md:text-5xl">{title}</h1>
          <p className="mt-4 text-fg-muted">
            {PRODUCT}, operated by {COMPANY_LEGAL}
          </p>
          <dl className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="rounded-full bg-subtle px-3.5 py-1.5">
              <dt className="inline text-fg-muted">Effective </dt>
              <dd className="inline font-semibold text-fg">{effective}</dd>
            </div>
            <div className="rounded-full bg-subtle px-3.5 py-1.5">
              <dt className="inline text-fg-muted">Last updated </dt>
              <dd className="inline font-semibold text-fg">{updated}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={printable} variant="secondary" size="sm">
              <IconPrinter width={16} height={16} aria-hidden="true" />
              Printable version
            </Button>
            {other && (
              <Button to={other.to} variant="ghost" size="sm">
                {other.label}
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="px-5 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-semibold text-fg-muted">On this page</p>
            <ol className="mt-3 grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
                  >
                    <span className="w-5 shrink-0 tabular-nums text-fg-muted/80">{i + 1}.</span>
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#legal-contact"
                  className="flex gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
                >
                  <span className="w-5 shrink-0" aria-hidden="true" />
                  {contactHeading}
                </a>
              </li>
            </ol>
          </nav>

          <article className="min-w-0 max-w-3xl">
            <div className={`text-lg ${prose}`}>
              <p>{intro}</p>
            </div>

            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="mt-10 scroll-mt-28 border-t border-line pt-8">
                <h2 className="flex gap-3 text-xl font-bold tracking-tight text-fg">
                  <span className="tabular-nums text-brand">{i + 1}</span>
                  {s.title}
                </h2>
                <div className={`mt-4 ${prose}`}>{s.body}</div>
              </section>
            ))}

            <section
              id="legal-contact"
              className="mt-12 scroll-mt-28 rounded-2xl border border-line bg-subtle p-6 sm:p-8"
            >
              <h2 className="text-sm font-semibold text-brand">{contactHeading}</h2>
              <p className={`mt-3 ${prose}`}>{contact}</p>
            </section>

            <p className="mt-8 text-sm text-fg-muted">
              Questions about this page? See the{" "}
              <Link to="/contact" className="font-medium text-brand hover:text-brand-hover">
                contact page
              </Link>
              .
            </p>
          </article>
        </div>
      </div>
    </>
  );
}
