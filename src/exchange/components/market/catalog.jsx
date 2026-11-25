import { IconTool, IconBolt, IconLayers, IconPackage, IconShield, IconTruck, IconBuilding } from "../icons";
import { daysFromToday } from "./format";

/**
 * Marketplace categories and SAMPLE catalog data for public previews.
 *
 * Every seller and SKU below is invented and deliberately named "Example …"
 * so nobody mistakes it for a real company. Render with SampleLabel or
 * SampleNotice (see PROOF.md). Replace with the catalog API when it exists.
 */

export const CATEGORIES = [
  { key: "tools", title: "Power tools & accessories", text: "Drills, saws, batteries, blades, and bits.", icon: <IconTool /> },
  { key: "fasteners", title: "Fasteners & hardware", text: "Screws, anchors, bolts, and connectors.", icon: <IconBolt /> },
  { key: "electrical", title: "Electrical", text: "Conduit, wire, boxes, breakers, fittings.", icon: <IconLayers /> },
  { key: "lumber", title: "Lumber & sheet goods", text: "Dimensional lumber, plywood, engineered wood.", icon: <IconPackage /> },
  { key: "metals", title: "Metals & structural", text: "Rebar, plate, bar, angle, and shapes.", icon: <IconBuilding /> },
  { key: "plumbing", title: "Plumbing PVC & fittings", text: "PVC, CPVC, PEX, copper, and fittings.", icon: <IconTruck /> },
  { key: "fixtures", title: "Plumbing hardware & fixtures", text: "Valves, hangers, traps, and fixtures.", icon: <IconPackage /> },
  { key: "safety", title: "Safety & consumables", text: "PPE, fall protection, layout, abrasives.", icon: <IconShield /> },
];

export const categoryIcon = (key) => CATEGORIES.find((c) => c.key === key)?.icon ?? <IconPackage />;

export const SAMPLE_LISTINGS = [
  { id: "l1", category: "electrical", sku: "EX-EL-0750", title: "3/4 in. EMT conduit, 10 ft stick", seller: "Example Electric Supply", sellerRole: "distributor", price: 8.45, unit: "stick", minOrder: "50 sticks", leadTime: "Same day", inStock: true, fulfillment: ["delivery", "will-call"] },
  { id: "l2", category: "electrical", sku: "EX-EL-1250", title: "12 AWG THHN copper wire, 500 ft reel", seller: "Example Electric Supply", sellerRole: "distributor", price: 142, unit: "reel", minOrder: "1 reel", leadTime: "Next day", inStock: true, fulfillment: ["delivery", "will-call"] },
  { id: "l3", category: "tools", sku: "EX-TL-2041", title: "20V brushless hammer drill kit, 2 batteries", seller: "Example Tool Mfg.", sellerRole: "supplier", price: 189, unit: "kit", minOrder: "2 kits", leadTime: "3–5 days", inStock: true, fulfillment: ["delivery"] },
  { id: "l4", category: "tools", sku: "EX-TL-7124", title: "7-1/4 in. framing blade, 24T, 10-pack", seller: "Example Tool Supply", sellerRole: "distributor", price: 64, unit: "pack", minOrder: "1 pack", leadTime: "Same day", inStock: true, fulfillment: ["will-call", "delivery"] },
  { id: "l5", category: "fasteners", sku: "EX-FS-1030", title: "#10 x 3 in. structural wood screw, 1,000 ct", seller: "Example Fastener Works", sellerRole: "supplier", price: 96.5, unit: "box", minOrder: "5 boxes", leadTime: "5–7 days", inStock: true, fulfillment: ["delivery"] },
  { id: "l6", category: "plumbing", sku: "EX-PL-4020", title: "4 in. Sch 40 PVC pipe, 20 ft", seller: "Example Pipe & Supply", sellerRole: "distributor", price: 38.2, unit: "length", minOrder: "10 lengths", leadTime: "Same day", inStock: true, fulfillment: ["delivery", "will-call"] },
  { id: "l7", category: "plumbing", sku: "EX-PL-0753", title: "3/4 in. PEX-A tubing, 300 ft coil", seller: "Example Pipe & Supply", sellerRole: "distributor", price: 118, unit: "coil", minOrder: "1 coil", leadTime: "10 days", inStock: false, fulfillment: ["delivery", "will-call"] },
  { id: "l8", category: "lumber", sku: "EX-LB-2408", title: "2x4 x 8 ft SPF #2 stud", seller: "Example Lumber Yard", sellerRole: "distributor", price: 4.12, unit: "piece", minOrder: "1 unit (294 pcs)", leadTime: "Same day", inStock: true, fulfillment: ["will-call", "delivery"] },
  { id: "l9", category: "lumber", sku: "EX-LB-3448", title: "3/4 in. CDX plywood, 4 x 8 sheet", seller: "Example Lumber Yard", sellerRole: "distributor", price: 41.75, unit: "sheet", minOrder: "20 sheets", leadTime: "Next day", inStock: true, fulfillment: ["delivery"] },
  { id: "l10", category: "metals", sku: "EX-MT-0520", title: "#5 rebar, Grade 60, 20 ft", seller: "Example Steel Service", sellerRole: "distributor", price: 14.3, unit: "bar", minOrder: "100 bars", leadTime: "2–3 days", inStock: true, fulfillment: ["delivery"] },
  { id: "l11", category: "metals", sku: "EX-MT-A36P", title: "A36 plate, 1/2 in. x 48 x 96", seller: "Example Plate Mill", sellerRole: "supplier", price: 612, unit: "sheet", minOrder: "4 sheets", leadTime: "2–3 weeks", inStock: false, fulfillment: ["delivery"] },
  { id: "l12", category: "safety", sku: "EX-SF-HV50", title: "Class 2 hi-vis vest, case of 50", seller: "Example Safety Mfg.", sellerRole: "supplier", price: 210, unit: "case", minOrder: "2 cases", leadTime: "1 week", inStock: true, fulfillment: ["delivery"] },
  { id: "l13", category: "fixtures", sku: "EX-FX-BV12", title: "1/2 in. brass ball valve, full port, 25 ct", seller: "Example Valve Co.", sellerRole: "supplier", price: 187.5, unit: "box", minOrder: "2 boxes", leadTime: "1 week", inStock: true, fulfillment: ["delivery"] },
  { id: "l14", category: "fasteners", sku: "EX-FS-WA38", title: "3/8 in. x 3 in. wedge anchor, 50 ct", seller: "Example Builders Hardware", sellerRole: "distributor", price: 31.9, unit: "box", minOrder: "1 box", leadTime: "Same day", inStock: true, fulfillment: ["will-call", "delivery"] },
];

export const SAMPLE_REQUESTS = [
  { id: "r1", title: "Level 2 electrical rough-in: conduit, wire, boxes", buyer: "Example Electric Contractors", buyerRole: "contractor", project: "Medical office renovation", location: "Los Angeles, CA", lines: 14, neededBy: daysFromToday(9), fulfillment: "delivery", quotes: 3 },
  { id: "r2", title: "Rebar package for spread footings", buyer: "Example Concrete Builders", buyerRole: "contractor", project: "Municipal facility renovation", location: "Riverside, CA", lines: 6, neededBy: daysFromToday(12), fulfillment: "delivery", quotes: 2 },
  { id: "r3", title: "Branch restock: PVC and CPVC fittings", buyer: "Example Pipe & Supply", buyerRole: "distributor", project: null, location: "Anaheim, CA", lines: 40, neededBy: daysFromToday(21), fulfillment: "delivery", quotes: 1 },
  { id: "r4", title: "Framing lumber, three drops", buyer: "Example Framing Co.", buyerRole: "contractor", project: "Logistics hub framing", location: "Long Beach, CA", lines: 8, neededBy: daysFromToday(6), fulfillment: "will-call", quotes: 4 },
];
