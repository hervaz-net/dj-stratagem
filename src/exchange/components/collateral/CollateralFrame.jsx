import { Link } from "react-router-dom";
import Seo from "../Seo";
import Button from "../Button";
import { Eyebrow } from "../Section";
import { IconArrowLeft, IconExternal } from "../icons";

/**
 * Brand-collateral page: a short header, then the printable static document
 * from /public in a framed preview. The document itself stays light because
 * it represents paper.
 */
export default function CollateralFrame({ src, title, description, children }) {
  return (
    <>
      <Seo title={title} description={description} />

      <section className="border-b border-line bg-surface px-5 pb-10 pt-8 sm:px-6 md:pb-12 md:pt-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/brand#collateral"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-brand"
          >
            <IconArrowLeft width={14} height={14} aria-hidden="true" />
            Brand guidelines
          </Link>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Brand collateral</Eyebrow>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-balance text-3xl font-bold tracking-tight text-fg md:text-4xl">{title}</h1>
              </div>
              <p className="mt-3 text-lg leading-relaxed text-fg-muted">{children}</p>
            </div>
            <Button href={src} variant="secondary" target="_blank" rel="noopener" className="self-start md:self-auto">
              <IconExternal width={16} height={16} aria-hidden="true" />
              Open printable page
            </Button>
          </div>
        </div>
      </section>

      <div className="bg-subtle px-3 py-6 sm:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <iframe
            src={src}
            title={`${title} (printable preview)`}
            className="block w-full rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]"
            style={{ height: "calc(100dvh - 10rem)", minHeight: "34rem" }}
          />
        </div>
      </div>
    </>
  );
}
