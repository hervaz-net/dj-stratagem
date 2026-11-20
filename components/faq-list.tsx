export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="join join-vertical w-full border-t border-line">
      {items.map((item) => (
        <details className="collapse collapse-arrow join-item rounded-none border-b border-line bg-transparent" key={item.question}>
          <summary className="collapse-title min-h-0 py-[17px] text-[13px] font-semibold">{item.question}</summary>
          <div className="collapse-content text-[11px] leading-[1.8] text-ink-dim">
            <p className="max-w-[630px]">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
