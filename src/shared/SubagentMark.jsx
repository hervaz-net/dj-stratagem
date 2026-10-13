/**
 * One logo per subagent. Every place a subagent is named on the site (the
 * header, the Subagents menu, the home page, its own pages and favicon, the
 * company sites, Exchange, the dashboards, the brand page) draws it from here,
 * so a mark only ever changes in one place.
 *
 * Each mark is a rounded tile in the subagent's own color with a white glyph,
 * on the same 32-unit grid as the Stratagem AI mark. Shapes are data, so the
 * React mark and the favicon string are drawn from the same source.
 */

// [tag, attributes, "line" | "solid"]
const P = (d, kind = "line") => ["path", { d }, kind];

export const SUBAGENT_MARKS = {
  // Find work: a map pin on the job.
  projects: {
    color: "#b91c1c",
    meaning: "A pin on the next job",
    shapes: [P("M16 25s-7-6.1-7-11.4a7 7 0 0 1 14 0C23 18.9 16 25 16 25z"), ["circle", { cx: 16, cy: 13.6, r: 2.6 }, "solid"]],
  },
  // Supply meets demand: two arrows trading places.
  exchange: {
    color: "#0e6b4f",
    meaning: "Supply and demand trading places",
    shapes: [P("M8.5 12.5h14l-4-4M23.5 19.5h-14l4 4")],
  },
  // The workspace: three stacked layers.
  platform: {
    color: "#4338ca",
    meaning: "Bids, jobs and customers stacked in one place",
    shapes: [P("M16 7.5 24.5 12 16 16.5 7.5 12z"), P("M7.5 16 16 20.5 24.5 16M7.5 20 16 24.5 24.5 20")],
  },
  // Playbooks: an open book.
  solutions: {
    color: "#7e22ce",
    meaning: "An open playbook",
    shapes: [P("M16 11.2C14 9.6 11.3 9 8.5 9v12.6c2.8 0 5.5.6 7.5 2.2 2-1.6 4.7-2.2 7.5-2.2V9c-2.8 0-5.5.6-7.5 2.2zM16 11.2v12.6")],
  },
  // Materials: a crate.
  supply: {
    color: "#334155",
    meaning: "A crate of materials",
    shapes: [P("M16 7.5 24 11.5v9L16 24.5 8 20.5v-9zM8 11.5l8 4 8-4M16 15.5v9")],
  },
  // Working capital: a stack of coins.
  capital: {
    color: "#9a6400",
    meaning: "A stack of working capital",
    shapes: [
      ["ellipse", { cx: 16, cy: 11.5, rx: 6.5, ry: 2.6 }, "line"],
      P("M9.5 11.5v4.5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-4.5M9.5 16v4.5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V16"),
    ],
  },
  // Crews: a hard hat.
  workforce: {
    color: "#0b7ea3",
    meaning: "A crew's hard hat",
    shapes: [P("M8 21h16M9.6 21a6.4 6.4 0 0 1 12.8 0"), P("M16 14.6v-3.2M13 15.7l-.8-2.6M19 15.7l.8-2.6")],
  },
  // Vehicles: a steering wheel.
  fleet: {
    color: "#c2410c",
    meaning: "A steering wheel",
    shapes: [["circle", { cx: 16, cy: 16, r: 8 }, "line"], P("M8.6 14.2h5.2M18.2 14.2h5.2M16 19v5"), ["circle", { cx: 16, cy: 16, r: 2.4 }, "solid"]],
  },
  // Marketing: a spark.
  studio: {
    color: "#c2185b",
    meaning: "The spark that brings the next client",
    shapes: [
      P("M16 7c.9 4.7 4.1 7.9 8.8 8.8-4.7.9-7.9 4.1-8.8 8.8-.9-4.7-4.1-7.9-8.8-8.8C11.9 14.9 15.1 11.7 16 7z", "solid"),
      ["circle", { cx: 23.5, cy: 9, r: 1.8 }, "solid"],
    ],
  },
};

const LINE = { stroke: "#fff", strokeWidth: 1.9, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
const SOLID = { fill: "#fff" };

export const subagentColor = (key) => SUBAGENT_MARKS[key]?.color ?? "#0e6b4f";

/**
 * The mark for one subagent. Decorative by default; pass `title` when the
 * mark stands alone and needs a name for screen readers.
 */
export default function SubagentMark({ id, size = 28, title, className = "", style, x, y }) {
  const mark = SUBAGENT_MARKS[id];
  if (!mark) return null;
  return (
    <svg
      x={x}
      y={y}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`shrink-0 ${className}`}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      <rect width="32" height="32" rx="9" fill={mark.color} />
      {mark.shapes.map(([Tag, attrs, kind], i) => (
        <Tag key={i} {...attrs} {...(kind === "solid" ? SOLID : LINE)} />
      ))}
    </svg>
  );
}

/** The same mark as a standalone SVG string, for favicons. */
export function subagentMarkSvg(id) {
  const mark = SUBAGENT_MARKS[id];
  if (!mark) return null;
  const line = 'stroke="#fff" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const body = mark.shapes
    .map(([tag, attrs, kind]) => {
      const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
      return `<${tag} ${a} ${kind === "solid" ? 'fill="#fff"' : line}/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="${mark.color}"/>${body}</svg>`;
}
