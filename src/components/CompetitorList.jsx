import { competitors } from "../data/competitors";

export default function CompetitorList({ className = "" }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {competitors.map((c) => (
        <div
          key={c.name}
          className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3 text-sm"
        >
          <span className="font-medium text-fg">{c.name}</span>
          <span className="text-xs text-fg-muted">{c.does}</span>
        </div>
      ))}
    </div>
  );
}
