import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import Seo from "../components/Seo";

const suggestions = [
  { to: "/platform", label: "Platform", detail: "All six connected suites" },
  { to: "/supply", label: "Supply Exchange", detail: "Sealed, scored materials sourcing" },
  { to: "/pricing", label: "Pricing", detail: "Plans from free to enterprise" },
  { to: "/contact", label: "Contact", detail: "Book a walkthrough with our team" },
];

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you're looking for has moved or no longer exists." noindex />

      <Section className="pt-24 pb-24">
        <Eyebrow>404</Eyebrow>
        <h1 className="text-balance max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          We couldn&rsquo;t find that page.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel">
          The link may be out of date, or the page may have moved. Here&rsquo;s where to pick
          back up.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button to="/" variant="primary">
            Back to home
          </Button>
          <Button to="/contact" variant="secondary">
            Contact us
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((s) => (
            <Button
              key={s.to}
              to={s.to}
              variant="secondary"
              className="!items-start !justify-start !whitespace-normal !px-5 !py-4 text-left"
            >
              <span>
                <span className="block text-sm font-semibold text-paper">{s.label}</span>
                <span className="mt-1 block text-xs font-normal text-steel">{s.detail}</span>
              </span>
            </Button>
          ))}
        </div>
      </Section>
    </>
  );
}
