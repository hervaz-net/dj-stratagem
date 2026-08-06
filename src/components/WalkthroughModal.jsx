import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { IconX, IconArrowRight, IconCheck, IconBriefcase } from "./icons";

/**
 * A guided slide walkthrough of the platform, shown in place of a hosted video.
 * Seven slides paced to roughly five minutes: a narrative panel on the left and
 * a mock interface on the right so each claim is paired with what it looks like.
 */

const slides = [
  {
    tag: "Introduction",
    time: "~45 sec",
    title: "One platform for every contractor's growth",
    text: "D&J Stratagem replaces the disconnected patchwork of plan rooms, bid tools, CRMs, and marketing agencies with a single system built around winning work.",
    points: [
      "Find and respond to projects that match your trade",
      "Market your business to the right decision-makers",
      "Track relationships, bids, and awards in one place",
      "AI tools that write, estimate, and learn with you",
    ],
    panel: "overview",
  },
  {
    tag: "Bid Discovery",
    time: "~40 sec",
    title: "Find the right work before your competitors do",
    text: "Real-time alerts match new opportunities to your trade, geography, and project size — so you spend time on projects you can win, not every RFP that comes through.",
    points: [
      "50+ markets across 8 states, updated daily",
      "Filter by trade, GC, owner, project type, and value",
      "One-click access to plans, specs, and addenda",
      "Saved searches with instant email and app alerts",
    ],
    panel: "discovery",
  },
  {
    tag: "Smart Bidding",
    time: "~40 sec",
    title: "Bid faster, win more of what you submit",
    text: "AI-assisted bid responses pull from your past wins, rates, and boilerplate — so your team spends less time on paperwork and more on pricing strategy.",
    points: [
      "Templates built from your own winning submissions",
      "AI draft generation from scope documents and drawings",
      "E-signature and PDF delivery in one step",
      "Track status: submitted, under review, awarded, lost",
    ],
    panel: "bidding",
  },
  {
    tag: "Supply Exchange",
    time: "~35 sec",
    title: "Cut procurement costs without the phone tag",
    text: "The Supply Exchange connects you to verified distributors who compete for your orders — better pricing on every project, with less effort than calling three reps.",
    points: [
      "Request quotes from multiple suppliers simultaneously",
      "Compare pricing with verified ratings and lead times",
      "Order tracking from PO through job-site delivery",
      "Automatic cost capture feeds into job costing",
    ],
    panel: "supply",
  },
  {
    tag: "CRM & Pipeline",
    time: "~35 sec",
    title: "Never lose a relationship or miss a follow-up",
    text: "Built for construction relationships — GCs, owners, architects, and subs — with a pipeline view showing where every opportunity stands and what comes next.",
    points: [
      "Contact history tied directly to projects and bids",
      "Automated follow-up reminders after bid submission",
      "Track relationships across your whole team",
      "See which GCs and owners you win with most",
    ],
    panel: "pipeline",
  },
  {
    tag: "Analytics",
    time: "~35 sec",
    title: "Know your numbers, sharpen your strategy",
    text: "Win rate by GC, bid volume by month, market activity by zip — intelligence to bid smarter and price with confidence, not gut feel alone.",
    points: [
      "Win rate trends over time and by general contractor",
      "Revenue recognition and pipeline forecasting",
      "Market heat maps by geography and trade type",
      "Award data and competitor activity in your markets",
    ],
    panel: "analytics",
  },
];

const pad = (n) => String(n).padStart(2, "0");

/* ---------------------------------------------------------------- panels */

const card = "rounded-lg border border-line bg-ink p-2.5";
const chip = "rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide";

function Stat({ value, label, tone = "text-paper" }) {
  return (
    <div className={card}>
      <p className={`text-base font-semibold tabular-nums ${tone}`}>{value}</p>
      <p className="mt-0.5 text-[9px] text-steel">{label}</p>
    </div>
  );
}

function BidRow({ title, meta, badge, tone }) {
  return (
    <div className="mb-1.5 flex items-start gap-2.5 rounded-lg border border-line bg-ink p-2.5">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-brand/15 text-brand">
        <IconBriefcase width={12} height={12} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-paper">{title}</p>
        <p className="mt-0.5 text-[9px] text-steel">{meta}</p>
      </div>
      <span className={`${chip} shrink-0 ${tone}`}>{badge}</span>
    </div>
  );
}

function Panel({ kind }) {
  if (kind === "overview") {
    return (
      <>
        <div className="mb-3 grid grid-cols-3 gap-1.5">
          <Stat value="24" label="Open Bids" />
          <Stat value="$2.4M" label="Pipeline" />
          <Stat value="38%" label="Win Rate" tone="text-success" />
        </div>
        <BidRow
          title="Westside Medical — Electrical"
          meta="LA · Turner · Due Oct 18"
          badge="OPEN"
          tone="bg-success/15 text-success"
        />
        <BidRow
          title="Harbor Logistics — Framing"
          meta="Long Beach · Webcor · Due Oct 22"
          badge="REVIEW"
          tone="bg-amber/15 text-amber"
        />
        <div className="mt-2.5 flex justify-between border-t border-line pt-2.5 text-[9px] text-steel">
          <span>6 bids due this week</span>
          <span className="font-semibold text-amber">View all →</span>
        </div>
      </>
    );
  }

  if (kind === "discovery") {
    return (
      <>
        <div className="mb-3 flex gap-1.5">
          <div className="flex-1 rounded border border-line bg-ink px-2 py-1.5 text-[9px] text-steel">
            Trade: Electrical
          </div>
          <div className="rounded border border-line bg-ink px-2 py-1.5 text-[9px] text-steel">
            LA Metro
          </div>
          <div className="rounded border border-amber bg-amber/15 px-2 py-1.5 text-[9px] font-bold text-amber">
            Filter
          </div>
        </div>
        <BidRow
          title="Westside Medical Complex"
          meta="$4.2M est · Turner Construction · Oct 18"
          badge="NEW"
          tone="bg-success/15 text-success"
        />
        <BidRow
          title="Century City Office Tower"
          meta="$11M est · Skanska · Oct 25"
          badge="NEW"
          tone="bg-success/15 text-success"
        />
        <BidRow
          title="Harbor Logistics Hub"
          meta="$2.8M est · Webcor · Oct 22"
          badge="VIEWED"
          tone="bg-amber/15 text-amber"
        />
      </>
    );
  }

  if (kind === "bidding") {
    return (
      <>
        <p className="mb-2.5 text-[11px] font-semibold text-paper">
          Westside Medical Complex — Electrical
        </p>
        <div className="mb-2.5 rounded-lg border border-brand/30 bg-brand/10 p-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-brand">
            AI draft ready
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-steel">
            Based on your Cedars-Sinai and St. Francis submissions, scope and unit pricing are
            pre-filled. Review before sending.
          </p>
        </div>
        <div className="mb-2.5 grid grid-cols-2 gap-1.5">
          <Stat value="$387,400" label="Base Bid" />
          <Stat value="+$42,000" label="Alternates" />
        </div>
        <div className="rounded bg-amber py-2 text-center text-[11px] font-bold text-ink">
          Submit &amp; E-Sign →
        </div>
      </>
    );
  }

  if (kind === "supply") {
    const quotes = [
      { name: "Pacific Electrical Supply", meta: "4.9★ · Ships Oct 14", price: "$1,840", best: true },
      { name: "Western Wire & Cable", meta: "4.7★ · Ships Oct 16", price: "$1,970" },
      { name: "SoCal Industrial", meta: "4.5★ · Ships Oct 19", price: "$2,040" },
    ];
    return (
      <>
        <p className="mb-2.5 text-[11px] font-semibold text-paper">
          RFQ: 4,000 ft 12-AWG THHN
        </p>
        <div className="space-y-1.5">
          {quotes.map((q) => (
            <div
              key={q.name}
              className={`flex items-center justify-between rounded-lg border p-2.5 ${
                q.best ? "border-success/30 bg-success/10" : "border-line bg-ink"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-paper">{q.name}</p>
                <p className="mt-0.5 text-[9px] text-steel">{q.meta}</p>
              </div>
              <p
                className={`shrink-0 pl-2 text-xs font-bold tabular-nums ${
                  q.best ? "text-success" : "text-steel"
                }`}
              >
                {q.price}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-right text-[9px] text-steel">
          Saved $200 vs. your last order on this item
        </p>
      </>
    );
  }

  if (kind === "pipeline") {
    const cols = [
      { head: "Identified", items: [["Westside Medical", "$4.2M"], ["Harbor Hub", "$2.8M"]], bar: "border-l-brand" },
      { head: "Bid Sent", items: [["Century City", "$11M"], ["SFO Terminal", "$6.5M"]], bar: "border-l-amber" },
      { head: "In Review", items: [["SD Convention", "$8.1M"]], bar: "border-l-brand" },
      { head: "Awarded", items: [["UCLA Research", "$3.4M"]], bar: "border-l-success" },
    ];
    return (
      <>
        <div className="grid grid-cols-4 gap-1">
          {cols.map((c) => (
            <div key={c.head}>
              <p className="mb-1 text-[8px] uppercase tracking-wider text-steel">{c.head}</p>
              {c.items.map(([name, val]) => (
                <div
                  key={name}
                  className={`mb-1 rounded-r border-l-2 bg-ink px-1.5 py-1.5 ${c.bar}`}
                >
                  <p className="truncate text-[9px] text-paper/90">{name}</p>
                  <p className="mt-0.5 text-[8px] text-steel">{val}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5">
          <span className="text-[9px] text-steel">Total pipeline</span>
          <span className="text-xs font-bold tabular-nums text-paper">$36.0M</span>
        </div>
      </>
    );
  }

  // analytics
  return (
    <>
      <div className="mb-3 flex justify-between">
        <div>
          <p className="text-[9px] text-steel">Win Rate — 6 months</p>
          <p className="text-xl font-bold tracking-tight text-paper">
            38% <span className="text-[11px] font-semibold text-success">↑ 9 pts</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-steel">Revenue YTD</p>
          <p className="text-xl font-bold tracking-tight text-paper">$1.2M</p>
        </div>
      </div>
      <svg
        viewBox="0 0 400 90"
        preserveAspectRatio="none"
        className="h-[90px] w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="wt-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="text-amber">
          <line x1="0" y1="22" x2="400" y2="22" stroke="currentColor" strokeWidth=".5" opacity=".15" />
          <line x1="0" y1="56" x2="400" y2="56" stroke="currentColor" strokeWidth=".5" opacity=".15" />
          <path
            d="M0,72 C40,70 60,64 100,54 S160,42 200,38 S280,26 340,18 L400,12 L400,90 L0,90Z"
            fill="url(#wt-area)"
          />
          <path
            d="M0,72 C40,70 60,64 100,54 S160,42 200,38 S280,26 340,18 L400,12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="396" cy="13" r="3.5" fill="currentColor" />
        </g>
      </svg>
      <div className="flex justify-between text-[9px] text-steel">
        {["May", "Jun", "Jul", "Aug", "Sep"].map((m) => (
          <span key={m}>{m}</span>
        ))}
        <span className="font-semibold text-amber">Oct</span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- modal */

export default function WalkthroughModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const total = slides.length + 1; // slides + closing CTA
  const isLast = step === total - 1;
  const dialogRef = useRef(null);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, total - 1)), [total]);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  // Reset to the first slide each time it reopens, so a returning visitor
  // doesn't land mid-deck on whatever they last viewed.
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Escape closes; arrows page through. Bound only while open so the keys stay
  // free for the rest of the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, next, prev]);

  // The page behind a full-screen overlay must not scroll under it.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  const slide = slides[step];

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Platform walkthrough"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-2xl outline-hidden"
      >
        {/* header */}
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-paper">Platform Walkthrough</span>
            <span className="rounded bg-amber px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-ink">
              5 min
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tabular-nums text-steel">
              {pad(step + 1)} / {pad(total)}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close walkthrough"
              className="rounded p-1 text-steel transition-colors hover:bg-ink hover:text-paper focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber"
            >
              <IconX width={16} height={16} />
            </button>
          </div>
        </div>

        {/* progress */}
        <div className="h-0.5 shrink-0 bg-line">
          <div
            className="h-full bg-amber transition-[width] duration-500 ease-out"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        {/* body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLast ? (
            <div className="flex flex-col items-center px-8 py-14 text-center">
              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-amber px-3.5 py-1 text-[11px] font-semibold text-amber">
                <IconCheck width={12} height={12} /> Everything in one platform
              </span>
              <h3 className="text-balance text-3xl font-bold tracking-tight text-paper md:text-4xl">
                Ready to win more work?
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-steel">
                Request a demo and we&rsquo;ll show you where D&amp;J Stratagem fits into how your
                team already works &mdash; no slide deck, just a hands-on walkthrough.
              </p>
              {/* Client-side links, and the modal closes on the way out —
                  otherwise the overlay would survive the route change. */}
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="rounded-lg bg-amber px-6 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-amber-2"
                >
                  Request a Demo
                </Link>
                <Link
                  to="/pricing"
                  onClick={onClose}
                  className="rounded-lg border border-line px-6 py-2.5 text-sm font-semibold text-steel transition-colors hover:border-steel hover:text-paper"
                >
                  View Pricing
                </Link>
              </div>
              <p className="mt-7 text-[11px] text-steel">
                Los Angeles, CA &nbsp;·&nbsp;{" "}
                <a href="mailto:hello@djstratageminc.com" className="hover:text-amber">
                  hello@djstratageminc.com
                </a>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              <div className="flex flex-col justify-center p-6 md:p-8">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-amber">
                  {pad(step + 1)} / {pad(total)} · {slide.tag} · {slide.time}
                </p>
                <h3 className="text-balance text-2xl font-bold leading-tight tracking-tight text-paper">
                  {slide.title}
                </h3>
                <p className="mt-3.5 text-sm leading-relaxed text-steel">{slide.text}</p>
                <ul className="mt-5 space-y-2">
                  {slide.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[13px] text-paper/85">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
                        <IconCheck width={10} height={10} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative flex items-center justify-center border-line bg-ink/40 p-6 md:border-l">
                <div
                  className="bg-grid pointer-events-none absolute inset-0 opacity-20"
                  aria-hidden="true"
                />
                <div className="relative w-full max-w-sm rounded-xl border border-line bg-ink-2 p-3.5 shadow-xl">
                  <Panel kind={slide.panel} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* footer nav */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-line px-5 py-3">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-steel transition-colors hover:border-steel hover:text-paper disabled:opacity-30 disabled:hover:border-line disabled:hover:text-steel focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === step ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber ${
                  i === step ? "w-5 bg-amber" : "w-1.5 bg-line hover:bg-steel"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={isLast ? onClose : next}
            className="flex items-center gap-1.5 rounded-lg bg-amber px-4 py-2 text-xs font-bold text-ink transition-colors hover:bg-amber-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber"
          >
            {isLast ? "Close" : "Next"}
            {!isLast && <IconArrowRight width={12} height={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}
