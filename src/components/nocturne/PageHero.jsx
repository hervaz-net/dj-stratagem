/**
 * Editorial page opener: a mono index line that draws itself in, an
 * oversized serif title, and the lede set off to the right. A ghosted
 * chapter number drifts behind the title.
 */
export default function PageHero({ index, kicker, title, lede, children }) {
  return (
    <section className="relative overflow-hidden px-6 pb-6 pt-10 md:pb-10 md:pt-16">
      <div className="mx-auto max-w-7xl">
        <div className="rise-in flex items-center gap-4">
          <span className="mono-label text-cta">{index}</span>
          <span className="h-px w-16 origin-left animate-[rise-in_1.2s_ease-out_both] bg-line" aria-hidden="true" />
          <span className="mono-label text-steel">{kicker}</span>
        </div>
        <span
          aria-hidden="true"
          className="bob pointer-events-none absolute -right-6 top-6 hidden select-none font-display text-[18rem] italic leading-none text-paper/[0.04] lg:block"
        >
          {index}
        </span>
        <h1
          className="rise-in relative mt-8 max-w-6xl text-balance text-[3.2rem] leading-[0.92] text-paper sm:text-7xl lg:text-[7.5rem]"
          style={{ animationDelay: "90ms" }}
        >
          {title}
        </h1>
        <div className="rise-in mt-10 grid gap-8 md:grid-cols-[1fr_minmax(0,32rem)]" style={{ animationDelay: "180ms" }}>
          <div className="order-2 md:order-1">{children}</div>
          {lede && <p className="order-1 text-lg leading-relaxed text-steel md:order-2">{lede}</p>}
        </div>
      </div>
    </section>
  );
}
