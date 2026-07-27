import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";

export default function NotFound() {
  return (
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
        <Button to="/" variant="primary">Back to home</Button>
        <Button to="/platform" variant="secondary">Explore the platform</Button>
        <Button to="/contact" variant="secondary">Contact us</Button>
      </div>
    </Section>
  );
}
