import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const SCRIPTS = {
  login: [
    ["k", "$ stratagem auth --resume"],
    ["d", "› handshake ok · tls 1.3"],
    ["", "› subagents      9/9 online"],
    ["", "› jobs queue     synced"],
    ["", "› fleet          standby"],
    ["d", "› awaiting credentials"],
  ],
  register: [
    ["k", "$ stratagem init --account"],
    ["d", "› provisioning workspace…"],
    ["", "› subagents      9/9 registered"],
    ["", "› pipeline       find → win → market → keep"],
    ["", "› fleet          available after approval"],
    ["d", "› awaiting details"],
  ],
};

function useTyped(lines) {
  const [state, setState] = useState({ line: 0, char: 0 });
  const reduce = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduce.current) {
      setState({ line: lines.length, char: 0 });
      return undefined;
    }
    setState({ line: 0, char: 0 });
    let line = 0;
    let char = 0;
    let t;
    const tick = () => {
      if (line >= lines.length) return;
      char += 1;
      if (char > lines[line][1].length) {
        line += 1;
        char = 0;
        setState({ line, char });
        t = setTimeout(tick, 260);
      } else {
        setState({ line, char });
        t = setTimeout(tick, line === 0 ? 45 : 14);
      }
    };
    t = setTimeout(tick, 350);
    return () => clearTimeout(t);
  }, [lines]);

  return state;
}

function Console({ mode }) {
  const lines = SCRIPTS[mode];
  const { line, char } = useTyped(lines);
  const lit = Math.round((9 * Math.min(line, lines.length)) / lines.length);
  const tone = { k: "text-molten", d: "text-steel", "": "text-paper" };

  return (
    <section
      aria-hidden="true"
      className="slab auth-rise order-2 overflow-hidden lg:sticky lg:top-28 lg:order-1 lg:self-start lg:mt-6"
    >
      <div className="relative flex items-center gap-1.5 border-b border-line px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-steel">
        <i className="h-2 w-2 rounded-full bg-line" />
        <i className="h-2 w-2 rounded-full bg-line" />
        <i className="h-2 w-2 rounded-full bg-line" />
        <span className="ml-2">stratagem://auth</span>
      </div>
      <pre className="relative m-0 min-h-[150px] whitespace-pre-wrap p-5 font-mono text-[13px] leading-7 lg:min-h-[260px]">
        {lines.slice(0, line).map(([c, text], i) => (
          <span key={i} className={`block ${tone[c]}`}>{text}</span>
        ))}
        {line < lines.length && (
          <span className={tone[lines[line][0]]}>{lines[line][1].slice(0, char)}</span>
        )}
        <span className="auth-caret" />
      </pre>
      <div className="relative flex items-center justify-between gap-3 border-t border-line px-5 py-3">
        <div className="grid grid-cols-9 gap-1.5">
          {Array.from({ length: 9 }, (_, i) => (
            <i
              key={i}
              className={`h-2.5 w-2.5 rounded-[3px] transition-colors duration-500 ${i < lit ? "bg-tide" : "bg-line"}`}
            />
          ))}
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel">9 subagents · one pipeline</span>
      </div>
    </section>
  );
}

/** Two-column auth layout shared by Login and Register. */
export default function AuthShell({ mode, title, lede, children, footer }) {
  const isLogin = mode === "login";
  const tab = (to, label, active) => (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={`relative z-10 rounded-full py-2 text-center text-sm font-medium transition-colors ${
        active ? "text-paper" : "text-steel hover:text-paper"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="relative isolate w-full overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1120px] items-center gap-8 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-14">
        <Console mode={mode} />

        <section className="slab auth-rise auth-rise-2 order-1 p-6 sm:p-9 lg:order-2">
          <nav aria-label="Account" className="relative mb-7 grid grid-cols-2 rounded-full border border-line bg-ink/60 p-1">
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full border border-line bg-[var(--surface-hover)] shadow-sm transition-transform duration-300 ease-out ${
                isLogin ? "" : "translate-x-full"
              }`}
            />
            {tab("/login", "Sign in", isLogin)}
            {tab("/register", "Create account", !isLogin)}
          </nav>

          {title && (
            <h1 className="text-paper text-5xl leading-[0.95] md:text-6xl">
              {title}
            </h1>
          )}
          {lede && <p className="mt-3 text-sm text-steel">{lede}</p>}

          {children}

          {footer && <div className="mt-6 text-center text-sm text-steel">{footer}</div>}
        </section>
      </div>
    </div>
  );
}
