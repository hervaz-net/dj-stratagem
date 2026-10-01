import { IconBuilding, IconTruck, IconHelmet } from "../icons";

/**
 * Marketing detail for each side of the marketplace. Names and paths come
 * from ROLES in brand.js; this adds what each side buys, sells, and does.
 * Tone classes are spelled out in full so Tailwind can see them.
 */
export const ROLE_META = {
  supplier: {
    icon: IconBuilding,
    tone: {
      text: "text-role-supplier",
      soft: "bg-role-supplier-soft",
      border: "border-role-supplier/30",
      bar: "bg-role-supplier",
    },
    headline: "Reach buyers without adding reps.",
    sells: "Catalog, stock, and price sheets to distributors and direct to contractors",
    buys: "Demand signals: who needs what, where, and when",
    workflows: [
      "Publish a catalog with SKUs, pack sizes, and lead times",
      "Keep price sheets current in one place instead of emailed PDFs",
      "Quote project requests that match your product lines",
      "Keep track of the distributors and buyers you work with",
    ],
  },
  distributor: {
    icon: IconTruck,
    tone: {
      text: "text-role-distributor",
      soft: "bg-role-distributor-soft",
      border: "border-role-distributor/30",
      bar: "bg-role-distributor",
    },
    headline: "Buy upstream, sell downstream, from one account.",
    sells: "Stocked inventory to contractors in your service area",
    buys: "Product lines and restock from manufacturers",
    workflows: [
      "List what you stock with branch availability and will-call",
      "Answer contractor requests in your territory",
      "Post restock and new-line requests to manufacturers",
      "Turn accepted quotes into orders and track them to delivery",
    ],
  },
  contractor: {
    icon: IconHelmet,
    tone: {
      text: "text-role-contractor",
      soft: "bg-role-contractor-soft",
      border: "border-role-contractor/30",
      bar: "bg-role-contractor",
    },
    headline: "Post what the job needs. Compare real quotes.",
    sells: "Demand: requests for quote tied to real jobs",
    buys: "Materials, tools, and consumables for each job",
    workflows: [
      "Post a request with line items, quantities, and a need-by date",
      "Tie requests to a project and jobsite address",
      "Compare quotes on price, lead time, and delivery or will-call",
      "Issue the order and follow it to the jobsite",
    ],
  },
};
