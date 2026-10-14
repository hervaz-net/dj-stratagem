/**
 * Renders the Markdown a subagent writes: headings, paragraphs, bullet and
 * numbered lists, tables, quotes, code, **bold**, *italic* and `code`.
 * Builds React elements only — never innerHTML — so AI output can't inject
 * markup or scripts. Anything it doesn't recognise shows as plain text.
 */

function inline(text, keyBase) {
  const out = [];
  const re = /(\*\*([^*]+)\*\*|__([^_]+)__|\*([^*\s][^*]*)\*|`([^`]+)`)/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[2] || m[3]) out.push(<strong key={k} className="font-semibold">{m[2] || m[3]}</strong>);
    else if (m[4]) out.push(<em key={k}>{m[4]}</em>);
    else out.push(<code key={k} className="rounded bg-ink-3 px-1 py-0.5 font-mono text-[12px]">{m[5]}</code>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
const isDivider = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
const cells = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

export default function Markdown({ text }) {
  const lines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const k = key++;

    if (!line.trim()) { i++; continue; }

    if (line.trim().startsWith("```")) {
      const body = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) body.push(lines[i++]);
      i++;
      blocks.push(<pre key={k} className="overflow-x-auto rounded-md bg-ink-3 p-3 font-mono text-[12px]">{body.join("\n")}</pre>);
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const cls = level <= 2 ? "mt-4 text-[15px] font-bold" : "mt-3 text-sm font-semibold";
      blocks.push(<p key={k} className={`${cls} text-paper first:mt-0`} role="heading" aria-level={Math.min(level + 3, 6)}>{inline(h[2], k)}</p>);
      i++;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push(<hr key={k} className="my-3 border-line" />);
      i++;
      continue;
    }

    if (isTableRow(line) && i + 1 < lines.length && isDivider(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(cells(lines[i++]));
      blocks.push(
        <div key={k} className="my-2 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[12.5px]">
            <thead>
              <tr>{head.map((c, j) => <th key={j} className="border-b border-line px-2 py-1.5 font-semibold text-paper">{inline(c, `${k}h${j}`)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>{head.map((_, j) => <td key={j} className="border-b border-line/60 px-2 py-1.5 align-top">{inline(r[j] ?? "", `${k}r${ri}c${j}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    const bullet = /^\s*[-*+]\s+(.*)$/;
    const numbered = /^\s*\d+[.)]\s+(.*)$/;
    if (bullet.test(line) || numbered.test(line)) {
      const ordered = numbered.test(line);
      const re = ordered ? numbered : bullet;
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        const checkbox = lines[i].match(re)[1].match(/^\[( |x|X)\]\s+(.*)$/);
        items.push(checkbox ? `${checkbox[1].trim() ? "☑" : "☐"} ${checkbox[2]}` : lines[i].match(re)[1]);
        i++;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={k} className={`my-2 space-y-1 pl-5 ${ordered ? "list-decimal" : "list-disc"}`}>
          {items.map((it, j) => <li key={j}>{inline(it, `${k}-${j}`)}</li>)}
        </List>,
      );
      continue;
    }

    if (line.startsWith(">")) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith(">")) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={k} className="my-2 border-l-2 border-line pl-3 text-steel">{inline(quote.join(" "), k)}</blockquote>);
      continue;
    }

    const para = [];
    while (
      i < lines.length && lines[i].trim() && !/^(#{1,6})\s/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i])
      && !isTableRow(lines[i]) && !lines[i].trim().startsWith("```") && !lines[i].startsWith(">")
    ) para.push(lines[i++].trim());
    if (!para.length) para.push(lines[i++].trim());
    blocks.push(<p key={k} className="my-2">{inline(para.join(" "), k)}</p>);
  }

  return <div className="break-words text-[13px] leading-relaxed text-paper">{blocks}</div>;
}
