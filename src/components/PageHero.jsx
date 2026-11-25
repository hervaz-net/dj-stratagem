/**
 * Interior page opener: an eyebrow index line, a bold display title, and
 * the lede set off to the right. One identity on every page.
 */
export default function PageHero({ index, kicker, title, lede, children }) {
  return (
    <section className="relative overflow-hidden px-6 pb-6 pt-10 md:pb-10 md:pt-16">
      <div className="mx-auto max-w-7xl">
        <div className="rise-in flex items-center gap-4">
          <span className="mono-label text-brand">{index}</span>
          <span className="h-px w-16 origin-left rise-in bg-line" aria-hidden="true" />
          <span className="mono-label text-fg-muted">{kicker}</span>
        </div>
        <h1
          className="rise-in mt-6 max-w-4xl text-balance text-5xl leading-[0.98] text-fg md:text-7xl"
          style={{ animationDelay: "90ms" }}
        >
          {title}
        </h1>
        {children ? (
          <div className="rise-in mt-10 grid gap-8 md:grid-cols-[1fr_minmax(0,32rem)]" style={{ animationDelay: "180ms" }}>
            <div className="order-2 md:order-1">{children}</div>
            {lede && <p className="order-1 text-lg leading-relaxed text-fg-muted md:order-2">{lede}</p>}
          </div>
        ) : (
          lede && <p className="rise-in mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">{lede}</p>
        )}
      </div>
    </section>
  );
}
