import "./symbols.css";

/**
 * Site-wide symbols for the marketplace's roles, its trade flow, and the
 * ideas the pages keep returning to. One registry, so a symbol looks the same
 * on Exchange, the main site, the company sites and the dashboards.
 *
 * Roles glow in their own color. Everything else sits on a soft tile in the
 * color you pass (the page's brand color by default).
 */

const L = (d) => ["path", { d }, "line"];
const DOT = (cx, cy, r = 1.3) => ["circle", { cx, cy, r }, "solid"];

export const ROLE_COLORS = {
  supplier: "#0e6b4f",
  distributor: "#2459c4",
  contractor: "#c2610c",
};

export const SYMBOLS = {
  // ---- Roles ----
  supplier: {
    label: "Supplier",
    color: ROLE_COLORS.supplier,
    glow: true,
    // A plant: the maker at the top of the chain.
    shapes: [L("M3.5 20V9.5l5 3v-3l5 3V6h3l.8 3H20.5V20z"), L("M3 20h18M7 16.5h2M11.5 16.5h2M16 16.5h2")],
  },
  distributor: {
    label: "Distributor",
    color: ROLE_COLORS.distributor,
    glow: true,
    // A warehouse that stocks and ships on.
    shapes: [L("M3 10 12 4.5 21 10v10H3z"), L("M7 20v-6.5h10V20M7 16.75h10")],
  },
  contractor: {
    label: "Contractor",
    color: ROLE_COLORS.contractor,
    glow: true,
    // A hammer: the one who builds.
    shapes: [L("M14.6 3.6 20.4 9.4 17.8 12 12 6.2z"), L("M13.4 10.6 4.6 19.4a1.5 1.5 0 0 1-2.1-2.1l8.8-8.8")],
  },

  // ---- Trade flow ----
  request: {
    label: "Request",
    // A clipboard with a new line item.
    shapes: [L("M9 3.5h6v3H9z"), L("M8 5H6.5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H16"), L("M12 10.5v6M9 13.5h6")],
  },
  quote: {
    label: "Quote",
    // A price tag.
    shapes: [L("M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.5 8.5a1.4 1.4 0 0 1 0 2l-6.2 6.2a1.4 1.4 0 0 1-2 0z"), DOT(8.3, 8.3, 1.6)],
  },
  order: {
    label: "Order",
    // A purchase order, signed off.
    shapes: [L("M6 3h8.5L19 7.5V21H6z"), L("M14.5 3v4.5H19"), L("M9 14.2l2.2 2.2 4.3-4.6")],
  },
  delivery: {
    label: "Delivery",
    // A truck on its way.
    shapes: [L("M2.5 6.5h11.5v10H2.5zM14 10h4l3.5 3.5v3H14"), ["circle", { cx: 6.5, cy: 18.5, r: 2 }, "line"], ["circle", { cx: 17.5, cy: 18.5, r: 2 }, "line"]],
  },

  // ---- Marketplace ----
  category: {
    label: "Category",
    shapes: [L("M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4z"), ["circle", { cx: 16.75, cy: 16.75, r: 3.4 }, "line"]],
  },
  "listed-supply": {
    label: "Listed supply",
    // Stock on the shelf, ready to quote.
    shapes: [L("M4 13h7v7H4zM13 13h7v7h-7zM8.5 5.5h7v7h-7z"), L("M10.5 5.5v2.2M6 13v2.2M15 13v2.2")],
  },
  "open-requests": {
    label: "Open requests",
    // An inbox with something waiting.
    shapes: [L("M3.5 13.5 6.3 6h9.2M18 9.5l2.5 4V19a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-5.5h5l1.3 2.2h4.4l1.3-2.2h5"), DOT(19, 5.5, 2.2)],
  },

  // ---- The usual way ----
  "calling-around": {
    label: "Calling around",
    shapes: [
      L("M5.5 3.5h3l1.5 4-2 1.2a10 10 0 0 0 4.8 4.8l1.2-2 4 1.5v3a2 2 0 0 1-2 2A14.5 14.5 0 0 1 3.5 5.5a2 2 0 0 1 2-2z"),
      L("M15 3.5a5.5 5.5 0 0 1 5.5 5.5M15 7a2 2 0 0 1 2 2"),
    ],
  },
  "spreadsheets-pdfs": {
    label: "Spreadsheets and PDFs",
    // A price sheet behind a PDF that's already out of date.
    shapes: [L("M3.5 3.5h10v13h-10zM3.5 8h10M3.5 12.5h10M8.5 3.5v13"), L("M11 9.5h6.5l3 3v8h-9.5z"), L("M17.5 9.5v3h3M13.5 16.5h4.5")],
  },
  "rep-driven": {
    label: "Rep-driven ordering",
    // A rep with a briefcase, one territory at a time.
    shapes: [["circle", { cx: 8.5, cy: 7, r: 3 }, "line"], L("M3 20a5.5 5.5 0 0 1 11 0"), L("M14.5 13h7v7h-7zM16.5 13v-1.6h3V13M14.5 16h7")],
  },
  "chasing-deliveries": {
    label: "Chasing deliveries",
    // A truck you're waiting on.
    shapes: [L("M2.5 10h9.5v7.5H2.5zM12 12.5h3.5l3 3v2H12"), ["circle", { cx: 5.5, cy: 19.3, r: 1.6 }, "line"], ["circle", { cx: 15.5, cy: 19.3, r: 1.6 }, "line"], ["circle", { cx: 17.5, cy: 6, r: 3.6 }, "line"], L("M17.5 4.4V6l1.2.9")],
  },
  "net-30": {
    label: "Net-30 terms",
    // A calendar with thirty days to pay.
    shapes: [L("M4 5.5h16V20H4zM4 9.5h16M8 3.5v4M16 3.5v4"), ["text", { x: 12, y: 17.6, "text-anchor": "middle", "font-size": 7.5, "font-weight": 800, "font-family": "Inter, system-ui, sans-serif" }, "text", "30"]],
  },
  questions: {
    label: "Questions",
    shapes: [L("M4 5h16v11H10l-4.5 3.5V16H4z"), L("M10.2 8.8a1.9 1.9 0 1 1 2.8 1.6c-.6.4-1 .8-1 1.5"), DOT(12, 13.6, 0.9)],
  },
};

function Shapes({ shapes, ink }) {
  return shapes.map(([Tag, attrs, kind, text], i) => {
    if (kind === "text") {
      const { "text-anchor": anchor, "font-size": fs, "font-weight": fw, "font-family": ff, ...rest } = attrs;
      return <text key={i} {...rest} textAnchor={anchor} fontSize={fs} fontWeight={fw} fontFamily={ff} fill={ink}>{text}</text>;
    }
    if (kind === "solid") return <Tag key={i} {...attrs} fill={ink} />;
    return <Tag key={i} {...attrs} fill="none" stroke={ink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />;
  });
}

/**
 * @param id       a key of SYMBOLS
 * @param variant  "tile" (soft tile, colored glyph), "solid" (filled tile,
 *                 white glyph) or "plain" (glyph only). Roles default to solid.
 * @param glow     glow in the symbol's color; roles glow by default
 * @param color    overrides the symbol's color (defaults to the brand color)
 * @param title    accessible name when the symbol stands alone
 */
export default function Sym({ id, size = 40, variant, glow, color, title, className = "" }) {
  const sym = SYMBOLS[id];
  if (!sym) return null;
  const tone = color ?? sym.color ?? "var(--brand, #0e6b4f)";
  const kind = variant ?? (sym.glow ? "solid" : "tile");
  const glowing = glow ?? Boolean(sym.glow);
  const ink = kind === "solid" ? "#fff" : tone;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };

  if (kind === "plain") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={`sym ${glowing ? "sym-glow" : ""} ${className}`} style={{ "--sym": tone }} focusable="false" {...a11y}>
        <Shapes shapes={sym.shapes} ink={tone} />
      </svg>
    );
  }
  return (
    <span
      className={`sym sym-${kind} ${glowing ? "sym-glow" : ""} ${className}`}
      style={{ "--sym": tone, width: size, height: size }}
      {...a11y}
    >
      <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <Shapes shapes={sym.shapes} ink={ink} />
      </svg>
    </span>
  );
}

/** Symbol keys grouped for the brand sheet. */
export const SYMBOL_GROUPS = [
  { title: "Roles", keys: ["supplier", "distributor", "contractor"] },
  { title: "Trade flow", keys: ["request", "quote", "order", "delivery"] },
  { title: "Marketplace", keys: ["category", "listed-supply", "open-requests", "questions"] },
  { title: "The usual way", keys: ["calling-around", "spreadsheets-pdfs", "rep-driven", "chasing-deliveries", "net-30"] },
];
