import { formatDue } from "../../data/sampleProjects";

/** Days between now and the bid deadline, floored at zero. */
export function daysUntil(iso) {
  const ms = new Date(`${iso}T00:00:00`) - new Date();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export const projectUrl = (p) => `${window.location.origin}/projects/${p.slug}`;

/** Quote a CSV cell; neutralise leading formula characters for spreadsheet apps. */
function cell(v) {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function projectsToCsv(list) {
  const head = [
    "Title",
    "City",
    "State",
    "Primary trade",
    "Scope",
    "Project type",
    "Value (USD)",
    "Bid due",
    "Procurement",
    "Owner",
    "General contractor",
    "Match %",
    "Documents",
    "URL",
  ];
  const rows = list.map((p) => [
    p.title,
    p.city,
    p.state,
    p.trade,
    p.scope.join("; "),
    p.type,
    p.value,
    p.bidDue,
    p.procurement,
    p.owner,
    p.gc,
    p.match,
    p.documents.join("; "),
    projectUrl(p),
  ]);
  return [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}

export function briefText(p) {
  const days = daysUntil(p.bidDue);
  return [
    "BID BRIEF",
    "=========",
    p.title,
    "",
    `Location:           ${p.city}, ${p.state}`,
    `Project type:       ${p.type}`,
    `Primary trade:      ${p.trade}`,
    `Scope:              ${p.scope.join(", ")}`,
    `Estimated value:    ${p.valueLabel}`,
    `Bid due:            ${formatDue(p.bidDue)}${days === 0 ? " (closed)" : ` (${days} days remaining)`}`,
    `Procurement:        ${p.procurement}`,
    "",
    "Contacts",
    "--------",
    `Owner:              ${p.owner}`,
    `General contractor: ${p.gc}`,
    "",
    "Summary",
    "-------",
    p.summary,
    "",
    "Documents",
    "---------",
    ...p.documents.map((d) => `- ${d}`),
    "",
    "Company fit",
    "-----------",
    `Match score: ${p.match}%`,
    ...p.matchReasons.map((r) => `- ${r}`),
    "",
    `Project page: ${projectUrl(p)}`,
    `Generated:    ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    "",
  ].join("\r\n");
}

/** Client-side file download via a Blob and a temporary anchor. */
export function downloadFile(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
