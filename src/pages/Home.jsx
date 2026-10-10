import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { StratagemMark } from "../components/SubagentHeader";
import { subagents } from "../data/subagents";
import "../styles/djx.css";

/* ------------------------------------------------------------------ helpers */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return undefined;
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/** Ticks while the tab is visible; stops on hidden tabs and reduced motion. */
function useTicker(ms, enabled) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    let id = null;
    const start = () => { if (!id) id = window.setInterval(() => setTick((t) => t + 1), ms); };
    const stop = () => { if (id) window.clearInterval(id); id = null; };
    const onVis = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [ms, enabled]);
  return tick;
}

function SubagentLink({ s, className, children, style }) {
  return s.external ? (
    <a href={s.to} className={className} style={style}>{children}</a>
  ) : (
    <Link to={s.to} className={className} style={style}>{children}</Link>
  );
}

const STAGE_COLOR = { find: "#c2610c", win: "#2459c4", build: "#0e6b4f", keep: "#b86e12" };

/* ------------------------------------------------------- typing headline */

const WORDS = ["find work.", "win it.", "build it.", "keep the customer."];

function TypingWord({ reduced }) {
  const tick = useTicker(70, !reduced);
  const [state, setState] = useState({ i: 0, n: 0, phase: "type", hold: 0 });

  useEffect(() => {
    if (reduced) return;
    setState((s) => {
      const w = WORDS[s.i];
      if (s.phase === "type") return s.n < w.length ? { ...s, n: s.n + 1 } : { ...s, phase: "hold", hold: 0 };
      if (s.phase === "hold") return s.hold < 24 ? { ...s, hold: s.hold + 1 } : { ...s, phase: "erase" };
      return s.n > 0 ? { ...s, n: s.n - 1 } : { i: (s.i + 1) % WORDS.length, n: 0, phase: "type", hold: 0 };
    });
  }, [tick, reduced]);

  if (reduced) return <span style={{ color: "var(--x-brand)" }}>{WORDS.join(" ")}</span>;
  return (
    <>
      <span className="sr-only">{WORDS.join(" ")}</span>
      <span aria-hidden="true">
        <span style={{ color: "var(--x-brand)" }}>{WORDS[state.i].slice(0, state.n)}</span>
        <span className="x-hcaret" />
      </span>
    </>
  );
}

/* --------------------------------------------------------- code panel */

const CODE = [
  [["c", "// one account, nine subagents"]],
  [["kw", "const"], ["d", " job = "], ["kw", "await"], ["d", " projects."], ["fn", "find"], ["d", "({ trade: "], ["s", '"electrical"'], ["d", ", city: "], ["s", '"Pasadena"'], ["d", " })"]],
  [["kw", "const"], ["d", " quotes = "], ["kw", "await"], ["d", " exchange."], ["fn", "request"], ["d", "(job, "], ["s", '"12 AWG THHN"'], ["d", ")"]],
  [["kw", "await"], ["d", " capital."], ["fn", "fund"], ["d", "(quotes."], ["fn", "best"], ["d", "().po)"]],
  [["kw", "await"], ["d", " workforce."], ["fn", "staff"], ["d", "(job, { crew: "], ["s", '"electrical"'], ["d", " })"]],
  [["d", "studio."], ["fn", "showcase"], ["d", "(job)  "], ["c", "// keep the customer"]],
];
const TOKEN_COLOR = { kw: "#7fd1ae", d: "#e6ece8", fn: "#8fb3ff", s: "#f2b766", c: "#6f8178" };
const OUTPUT = [
  "✓ open projects matched · electrical · Pasadena",
  "✓ supplier quotes compared · best one selected",
  "✓ PO funded · crew scheduled",
];
const LINE_LENGTHS = CODE.map((l) => l.reduce((a, t) => a + t[1].length, 0));
const TOTAL = LINE_LENGTHS.reduce((a, b) => a + b, 0);

function CodePanel({ reduced }) {
  const tick = useTicker(40, !reduced);
  const [pos, setPos] = useState({ n: 0, hold: 0 });

  useEffect(() => {
    if (reduced) return;
    setPos((p) => (p.n < TOTAL ? { n: p.n + 1, hold: 0 } : p.hold > 110 ? { n: 0, hold: 0 } : { ...p, hold: p.hold + 1 }));
  }, [tick, reduced]);

  const n = reduced ? TOTAL : pos.n;
  const done = n >= TOTAL;
  const outCount = reduced ? OUTPUT.length : done ? Math.min(OUTPUT.length, 1 + Math.floor(pos.hold / 14)) : 0;

  let budget = n;
  let used = 0;
  let caretPlaced = false;

  return (
    <div className="overflow-hidden" style={{ background: "#15201b", borderRadius: 20, boxShadow: "0 2px 4px #15201b0a, 0 24px 60px -20px #15201b66" }}>
      <div className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: "1px solid #2a3a32" }}>
        {[0, 1, 2].map((i) => <span key={i} className="h-[11px] w-[11px] rounded-full" style={{ background: "#3a4a42" }} />)}
        <span className="x-mono ml-2 text-xs" style={{ color: "#8a9a91" }}>pipeline.js</span>
        <span className="x-mono ml-auto rounded-full px-2 py-0.5 text-[11px]" style={{ color: "#7fd1ae", background: "#1f3329" }}>● running</span>
      </div>
      <pre className="x-mono m-0 overflow-x-auto py-4 text-[13.5px] leading-[1.75]" aria-label="Example: one job running through the subagents">
        {CODE.map((line, i) => {
          used += LINE_LENGTHS[i];
          const parts = [];
          for (const [kind, text] of line) {
            if (budget <= 0) break;
            const shown = text.slice(0, budget);
            budget -= shown.length;
            parts.push(<span key={parts.length} style={{ color: TOKEN_COLOR[kind], fontStyle: kind === "c" ? "italic" : undefined }}>{shown}</span>);
          }
          const caret = !reduced && !caretPlaced && (n < used || i === CODE.length - 1);
          if (caret) caretPlaced = true;
          return (
            <div key={i} className="flex pr-5">
              <span className="w-11 shrink-0 select-none pr-4 text-right" style={{ color: "#4d5e55" }}>{i + 1}</span>
              <span>{parts}{caret && <span className="x-caret" />}</span>
            </div>
          );
        })}
      </pre>
      <div className="x-mono min-h-[92px] px-5 pb-4 pt-3 text-[12.5px]" style={{ borderTop: "1px solid #2a3a32" }} aria-live="off">
        <div className="mb-1.5" style={{ color: "#8a9a91" }}>output</div>
        {OUTPUT.slice(0, outCount).map((o) => <div key={o} className="x-out" style={{ color: "#cfe9dc" }}>{o}</div>)}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- hub diagram */

function HubDiagram() {
  const nodes = subagents.map((s, i) => {
    const a = ((-90 + i * 40) * Math.PI) / 180;
    return { ...s, x: Math.round(320 + Math.cos(a) * 250), y: Math.round(220 + Math.sin(a) * 175), color: STAGE_COLOR[s.stage], delay: `-${(i * 0.29).toFixed(2)}s` };
  });
  return (
    <svg viewBox="0 0 640 440" className="block h-auto w-full" role="img" aria-label="The nine subagents, each connected to the Stratagem AI hub">
      {nodes.map((n) => (
        <g key={`l-${n.key}`}>
          <line x1={n.x} y1={n.y} x2="320" y2="220" stroke="#e4e7e0" strokeWidth="2" />
          <line className="x-beam" x1={n.x} y1={n.y} x2="320" y2="220" stroke={n.color} strokeWidth="3" strokeLinecap="round" style={{ animationDelay: n.delay }} />
        </g>
      ))}
      <g className="x-hub">
        <rect x="270" y="190" width="100" height="60" rx="14" fill="#0e6b4f" />
        <text x="320" y="226" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="800" fill="#fff">D&amp;J</text>
      </g>
      {nodes.map((n) => (
        <g key={`n-${n.key}`}>
          <rect x={n.x - 52} y={n.y - 17} width="104" height="34" rx="17" fill="#fff" stroke={n.color} strokeWidth="1.5" />
          <circle cx={n.x - 38} cy={n.y} r="4" fill={n.color} />
          <text x={n.x - 28} y={n.y + 5} fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#15201b">{n.name}</text>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------ how a job moves */

const STEPS = [
  { name: "Find", line: "Matched projects and supply requests land in one feed by trade and city.", meta: "projects · exchange" },
  { name: "Win", line: "Price it, propose it, and track the bid alongside every other job.", meta: "platform · solutions" },
  { name: "Build", line: "Fund the PO, source the material, staff the crew, roll the fleet.", meta: "capital · supply · workforce · fleet" },
  { name: "Keep", line: "Turn the finished job into marketing that wins the next one.", meta: "studio" },
];

function JobSteps({ reduced }) {
  const tick = useTicker(2400, !reduced);
  const active = reduced ? -1 : tick % STEPS.length;
  return (
    <ol className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      {STEPS.map((st, i) => {
        const on = i === active;
        return (
          <li
            key={st.name}
            className="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl p-6"
            style={{
              background: "var(--x-surface)",
              border: `1px solid ${on ? "var(--x-brand)" : "var(--x-border)"}`,
              boxShadow: on ? "var(--x-shadow-pop)" : "0 1px 2px #15201b0a",
              transition: "border-color .3s ease, box-shadow .3s ease",
            }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-bold"
              style={{ background: on ? "var(--x-brand)" : "var(--x-brand-soft)", color: on ? "#fff" : "var(--x-brand-hover)", transition: "background-color .3s ease, color .3s ease" }}
            >
              {i + 1}
            </span>
            <span className="text-xl font-bold tracking-tight">{st.name}</span>
            <span className="text-[15px] leading-relaxed" style={{ color: "var(--x-muted)" }}>{st.line}</span>
            <span className="x-mono text-xs" style={{ color: "var(--x-muted)" }}>{st.meta}</span>
            <span className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: "var(--x-subtle)" }} aria-hidden="true">
              {on && <span key={tick} className="x-fill block h-[3px]" style={{ background: "var(--x-brand)" }} />}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------------------------------------------------------- page */

const H2 = "m-0 font-extrabold leading-[1.1] tracking-[-0.03em]";
const EYEBROW = "mb-3 text-sm font-semibold";

export default function Home() {
  const reduced = usePrefersReducedMotion();
  const ticker = [...subagents, ...subagents];

  return (
    <div className="djx" style={{ background: "var(--x-bg)" }}>
      <Seo
        title="Build the pipeline, not the paperwork."
        description="D&J Stratagem is one place for contractors, subcontractors, and suppliers to find construction work, win it, market the business, and keep the customer."
      />

      {/* Hero */}
      <section className="x-grid border-b" style={{ borderColor: "var(--x-border)" }}>
        <div className="flex flex-wrap items-center gap-12" style={{ padding: "72px var(--x-gutter) 80px" }}>
          <div className="min-w-0 flex-[1_1_480px]">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold" style={{ background: "var(--x-surface)", borderColor: "var(--x-border)" }}>
              <span className="x-pulse h-2 w-2 rounded-full" style={{ background: "var(--x-accent)" }} aria-hidden="true" />
              Nine subagents, one account
            </span>
            <h1 className="mt-6 font-extrabold leading-[1.02] tracking-[-0.035em]" style={{ fontSize: "clamp(44px, 6vw, 76px)", color: "var(--x-text)", fontFamily: "inherit", fontStyle: "normal" }}>
              Build the pipeline, not the paperwork.
            </h1>
            <p className="mt-5 min-h-[1.3em] font-semibold tracking-[-0.02em]" style={{ fontSize: "clamp(22px, 2.4vw, 28px)", color: "var(--x-muted)" }}>
              One account to <TypingWord reduced={reduced} />
            </p>
            <p className="mt-5 max-w-[560px] text-lg leading-relaxed" style={{ color: "var(--x-muted)" }}>
              D&amp;J Stratagem AI is one place for contractors, subcontractors, and suppliers to find construction work, win it, market the business, and keep the customer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="x-btn x-btn-primary">Join free</Link>
              <a href="#subagents" className="x-btn x-btn-ghost">Explore the subagents</a>
            </div>
          </div>
          <div className={`min-w-0 flex-[1_1_460px] ${reduced ? "" : "x-float"}`}>
            <CodePanel reduced={reduced} />
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-b" style={{ background: "var(--x-surface)", borderColor: "var(--x-border)" }} aria-hidden="true">
        <div className="x-track flex w-max py-4">
          {ticker.map((s, i) => (
            <div key={`${s.key}-${i}`} className="flex items-center gap-2.5 whitespace-nowrap px-7 text-[15px] font-semibold" data-stage={s.stage}>
              <span className="x-chip">{s.stage.toUpperCase()}</span>
              {s.name}
            </div>
          ))}
        </div>
      </div>

      {/* Hub */}
      <section style={{ padding: "96px var(--x-gutter)" }}>
        <div className="flex flex-wrap items-center gap-12">
          <div className="min-w-0 flex-[1_1_380px]">
            <p className={EYEBROW} style={{ color: "var(--x-brand)" }}>One network, nine subagents</p>
            <h2 className={H2} style={{ fontSize: "clamp(30px, 3.6vw, 44px)", fontFamily: "inherit" }}>Every subagent runs through the same hub.</h2>
            <p className="mt-4 text-[17px] leading-relaxed" style={{ color: "var(--x-muted)" }}>
              Schedule all nine subagents to work at the same time while you watch your revenue grow.
            </p>
            <p className="mt-3 text-[17px] leading-relaxed" style={{ color: "var(--x-muted)" }}>
              You approve every job as the administrator before any subagent starts work.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["find", "win", "build", "keep"].map((st) => (
                <span key={st} data-stage={st} className="x-chip" style={{ fontSize: 13, padding: "6px 12px" }}>{st[0].toUpperCase() + st.slice(1)}</span>
              ))}
            </div>
          </div>
          <div className="x-card min-w-0 flex-[1.3_1_520px] p-3" style={{ borderRadius: 20 }}>
            <HubDiagram />
          </div>
        </div>
      </section>

      {/* Subagents */}
      <section id="subagents" className="scroll-mt-24 border-y" style={{ background: "var(--x-subtle)", borderColor: "var(--x-border)" }}>
        <div style={{ padding: "96px var(--x-gutter)" }}>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={EYEBROW} style={{ color: "var(--x-brand)" }}>Subagents</p>
              <h2 className={H2} style={{ fontSize: "clamp(30px, 3.6vw, 44px)", fontFamily: "inherit" }}>A clear place for every part of the job.</h2>
            </div>
            <p className="m-0 max-w-[420px] text-base leading-relaxed" style={{ color: "var(--x-muted)" }}>
              Same card, same layout, same account. Moving between subagents never feels like leaving.
            </p>
          </div>
          <ul className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {subagents.map((s) => (
              <li key={s.key} data-stage={s.stage} className="flex">
                <SubagentLink s={s} className="x-card flex min-h-[220px] w-full flex-col gap-3 p-6" style={{ color: "var(--x-text)" }}>
                  <span className="flex items-center justify-between">
                    <span className="x-chip">● {s.stage.toUpperCase()}</span>
                    <span className="x-mono text-xs" style={{ color: "var(--x-muted)" }}>{s.code}</span>
                  </span>
                  <span className="mt-1 text-[22px] font-bold tracking-tight">{s.name}</span>
                  <span className="flex-1 text-[15px] leading-relaxed" style={{ color: "var(--x-muted)" }}>{s.line}</span>
                  <span className="flex items-center gap-1.5 text-[15px] font-semibold" style={{ color: "var(--x-brand)" }}>
                    Open {s.name}
                    <svg className="x-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                  </span>
                </SubagentLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How a job moves */}
      <section id="how" style={{ padding: "96px var(--x-gutter)" }}>
        <p className={EYEBROW} style={{ color: "var(--x-brand)" }}>How a job moves</p>
        <h2 className={`${H2} mb-10 max-w-[760px]`} style={{ fontSize: "clamp(30px, 3.6vw, 44px)", fontFamily: "inherit" }}>From first lead to repeat customer in four steps.</h2>
        <JobSteps reduced={reduced} />
      </section>

      {/* CTA */}
      <section style={{ padding: "0 var(--x-gutter) 96px" }}>
        <div className="x-grid-dark flex flex-wrap items-center justify-between gap-8 rounded-3xl px-10 py-16 text-white" style={{ backgroundColor: "var(--x-brand)" }}>
          <div className="max-w-[680px]">
            <div className="mb-4 flex items-center gap-3"><StratagemMark size={36} /></div>
            <h2 className={H2} style={{ fontSize: "clamp(30px, 3.6vw, 44px)", color: "#fff", fontFamily: "inherit" }}>Bring your next job. We&apos;ll run the pipeline.</h2>
            <p className="mt-4 text-[17px] leading-relaxed" style={{ color: "#d6ebe1" }}>
              Create a free company profile, pick your trades and subagents, and work every job from one account.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="x-btn" style={{ background: "#fff", color: "var(--x-brand-hover)" }}>Join free</Link>
            <Link to="/contact" className="x-btn" style={{ border: "1px solid #ffffff66", color: "#fff" }}>Talk to us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
