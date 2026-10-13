import Section from "../../exchange/components/Section";
import Button from "../../exchange/components/Button";
import SubagentMark from "../../shared/SubagentMark";

/** A 404 inside a subagent's site, in its own colors. */
export default function SubagentNotFound({ brand }) {
  return (
    <Section className="text-center">
      <SubagentMark id={brand.slug} size={56} className="mx-auto" />
      <p className="mt-6 text-sm font-semibold text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg md:text-4xl">We couldn&rsquo;t find that page.</h1>
      <p className="mx-auto mt-4 max-w-md text-fg-muted">It may have moved, or the link may be out of date.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={brand.path}>Back to {brand.name.replace(/^Stratagem /, "")}</Button>
        <Button href="/" variant="secondary">Stratagem AI home</Button>
      </div>
    </Section>
  );
}
