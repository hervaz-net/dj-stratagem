import SubagentMark, { SUBAGENT_MARKS, subagentMarkSvg } from "./SubagentMark";
import { subagents } from "../data/subagents";
import Sym, { SYMBOL_GROUPS, SYMBOLS } from "./Symbol";

/** The nine subagent marks with their color, meaning and an SVG download. */
export default function SubagentMarkSheet() {
  return (
    <section aria-labelledby="marks-heading" className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6661]">Subagent marks</p>
      <h2 id="marks-heading" className="mt-2 text-3xl font-bold tracking-tight text-[#111311]">One mark per subagent</h2>
      <p className="mt-2 max-w-2xl text-[#5f6661]">
        Use a subagent&apos;s mark wherever that subagent is named: navigation, page headers, job cards, favicons, print.
        Keep the rounded tile and its color; never recolor or redraw the glyph.
      </p>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subagents.map((s) => {
          const m = SUBAGENT_MARKS[s.key];
          return (
            <li key={s.key} className="flex items-center gap-4 rounded-2xl border border-[#e8eae7] bg-white p-5">
              <SubagentMark id={s.key} size={56} title={`${s.name} mark`} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#111311]">{s.name}</p>
                <p className="text-sm text-[#5f6661]">{m.meaning}</p>
                <p className="mt-1 font-mono text-xs text-[#5f6661]">{m.color}</p>
              </div>
              <a
                href={`data:image/svg+xml,${encodeURIComponent(subagentMarkSvg(s.key))}`}
                download={`stratagem-${s.key}-mark.svg`}
                className="shrink-0 rounded-full border border-[#e8eae7] px-3 py-1.5 text-xs font-semibold text-[#111311] hover:border-[#111311]/40"
              >
                SVG
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Every shared symbol, grouped, for the brand page. */
export function SymbolSheet() {
  return (
    <section aria-labelledby="symbols-heading" className="mx-auto max-w-6xl px-5 pb-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5f6661]">Symbols</p>
      <h2 id="symbols-heading" className="mt-2 text-3xl font-bold tracking-tight text-[#111311]">Roles, the trade, and the usual way</h2>
      <p className="mt-2 max-w-2xl text-[#5f6661]">
        The three roles always glow in their own color: supplier green, distributor blue, contractor orange. Every other
        symbol takes the color of the page it sits on.
      </p>
      <div className="mt-8 space-y-8">
        {SYMBOL_GROUPS.map((g) => (
          <div key={g.title}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#5f6661]">{g.title}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {g.keys.map((k) => (
                <li key={k} className="flex items-center gap-3 rounded-2xl border border-[#e8eae7] bg-white p-4">
                  <Sym id={k} size={44} color={SYMBOLS[k].color ?? "#0e6b4f"} />
                  <span className="text-sm font-semibold text-[#111311]">{SYMBOLS[k].label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
