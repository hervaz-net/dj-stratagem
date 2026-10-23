import { formatDue } from "../../data/sampleProjects";

/**
 * Every export of a sample listing states, in its first line or first column,
 * that the listing is a sample (PROOF.md: sample listings carry a higher duty).
 */
export const SAMPLE_STATEMENT =
  "SAMPLE LISTING - this is an illustrative example, not a live solicitation, and it cannot be bid on or quoted.";

export const projectUrl = (p) => `${window.location.origin}/projects/${p.slug}`;

/** Quote a CSV cell; neutralise leading formula characters for spreadsheet apps. */
export function csvCell(v) {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function projectsToCsv(list) {
  const head = [
    "Listing status",
    "Title",
    "City",
    "State",
    "Primary trade",
    "Scope",
    "Project type",
    "Estimated value (USD)",
    "Sample date",
    "Procurement",
    "Owner",
    "General contractor",
    "Sample match %",
    "Sample documents",
    "URL",
  ];
  const rows = list.map((p) => [
    "SAMPLE listing - not a live solicitation, cannot be bid on",
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
  return [head, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/** Plain-text project summary. The first line is the sample statement. */
export function summaryText(p) {
  return [
    SAMPLE_STATEMENT,
    "",
    "PROJECT SUMMARY",
    "===============",
    p.title,
    "",
    `Location:           ${p.city}, ${p.state}`,
    `Project type:       ${p.type}`,
    `Primary trade:      ${p.trade}`,
    `Scope:              ${p.scope.join(", ")}`,
    `Estimated value:    ${p.valueLabel}`,
    `Sample date:        ${formatDue(p.bidDue)} (illustrative; not a real deadline)`,
    `Procurement:        ${p.procurement}`,
    "",
    "Contacts (sample)",
    "-----------------",
    `Owner:              ${p.owner}`,
    `General contractor: ${p.gc}`,
    "",
    "Scope of work",
    "-------------",
    p.summary,
    "",
    "Sample documents (placeholders, not available)",
    "----------------------------------------------",
    ...p.documents.map((d) => `- ${d}`),
    "",
    "Fit against a sample profile",
    "----------------------------",
    `Sample match score: ${p.match}%`,
    ...p.matchReasons.map((r) => `- ${r}`),
    "",
    `Listing page: ${projectUrl(p)}`,
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
