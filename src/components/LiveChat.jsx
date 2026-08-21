import { useEffect, useRef, useState } from "react";

const RESPONSES = [
  "Thanks for reaching out! A member of our team will reply within a few hours.",
  "Got it — we'll follow up shortly. In the meantime, check out our docs at /platform for quick answers.",
  "Thanks! Our typical response time is under 2 hours during business hours (9am–6pm ET).",
];

let _msgId = 0;

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: 0, from: "bot", text: "Hi! How can we help you today?" },
  ]);
  const [typing, setTyping] = useState(false);
  const [appeared, setAppeared] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setAppeared(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const id = ++_msgId;
    setMessages((m) => [...m, { id, from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: ++_msgId, from: "bot", text: RESPONSES[id % RESPONSES.length] },
      ]);
    }, 1400);
  };

  return (
    <>
      {/* Toggle button */}
      <div
        className={`fixed bottom-6 left-6 z-[100] transition-all duration-500 ${
          appeared ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close chat" : "Open chat"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-cta hover:bg-cta-hover shadow-lg shadow-cta/30 transition-transform hover:scale-105"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          )}
        </button>
        {!open && (
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-warning" />
          </span>
        )}
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-22 left-6 z-[100] flex w-80 flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-2xl shadow-brand/15"
          role="dialog"
          aria-label="Live chat"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-line bg-ink-3 px-4 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cta hover:bg-cta-hover text-xs font-semibold text-white">
              DJ
            </span>
            <div>
              <p className="text-sm font-semibold text-paper">D&amp;J Stratagem Support</p>
              <p className="text-xs text-[var(--viz-green)]">● Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" style={{ maxHeight: "260px" }}>
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "bg-amber/15 text-paper"
                      : "bg-ink-3 text-paper"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-ink-3 px-3 py-2">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-steel"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-line px-3 py-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper outline-none placeholder:text-steel/60 focus:border-amber"
            />
            <button
              type="button"
              onClick={send}
              disabled={!input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber/15 text-amber transition-colors hover:bg-amber/25 disabled:opacity-40"
              aria-label="Send"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
