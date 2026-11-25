import { IconX } from "../icons";

/** "Sound familiar?" list of the problems a role deals with today. */
export default function PainList({ items, className = "" }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {items.map((p) => (
        <li key={p.title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger" aria-hidden="true">
            <IconX width={15} height={15} />
          </span>
          <div>
            <p className="font-semibold text-fg">{p.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">{p.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
