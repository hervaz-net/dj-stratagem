import Section from "./Section";
import PageHeader from "./PageHeader";

/** Embeds a static document from /public without overflowing the marketing chrome. */
export default function DocFrame({ src, title }) {
  return (
    <iframe
      src={src}
      title={title}
      className="block w-full border-0 bg-white"
      style={{ height: "calc(100dvh - 8rem)", minHeight: "32rem" }}
    />
  );
}

/**
 * Flat page shell for the static documents in /public: a PageHeader band, then
 * the document in a hairline-bordered frame on a white band. The document
 * itself is untouched.
 */
export function DocPage({ src, title, eyebrow, lede, crumbs }) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        lede={lede}
        crumbs={crumbs}
        actions={
          <a href={src} target="_blank" rel="noopener noreferrer" className="button secondary">
            Open full document
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        }
      />
      <Section band="white" className="!py-8 md:!py-10">
        <div className="border border-line-2">
          <DocFrame src={src} title={title} />
        </div>
      </Section>
    </>
  );
}
