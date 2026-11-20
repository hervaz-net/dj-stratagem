export function FaqList({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="join join-vertical w-full">
      {items.map((item) => (
        <details
          className="collapse collapse-arrow join-item border border-base-300 bg-base-100"
          key={item.question}
        >
          <summary className="collapse-title text-base font-semibold">
            {item.question}
          </summary>
          <div className="collapse-content text-sm leading-relaxed text-base-content/75">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
