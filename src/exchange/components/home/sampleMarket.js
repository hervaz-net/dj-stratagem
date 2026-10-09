import { daysFromToday } from "../../data/sampleDates";

/**
 * Illustrative marketplace data for the home page preview. Every company name
 * starts with "Sample" or "Example" so nobody mistakes it for a real seller,
 * and every surface that renders it carries a SampleLabel (see PROOF.md).
 */

export const CATEGORIES = [
  { key: "electrical", label: "Electrical", example: "Wire, conduit, boxes" },
  { key: "fasteners", label: "Fasteners & hardware", example: "Anchors, screws, connectors" },
  { key: "lumber", label: "Lumber & sheet goods", example: "Dimensional, plywood, LVL" },
  { key: "plumbing", label: "Plumbing & PVC", example: "Pipe, fittings, valves" },
  { key: "steel", label: "Rebar & structural", example: "Rebar, plate, angle" },
  { key: "tools", label: "Power tools", example: "Drills, saws, batteries" },
  { key: "concrete", label: "Concrete & masonry", example: "Mix, block, grout" },
  { key: "safety", label: "Safety & consumables", example: "PPE, tape, abrasives" },
];

export const SAMPLE_LISTINGS = [
  {
    id: "l1",
    category: "Electrical",
    name: "12 AWG THHN copper building wire, 500 ft reel",
    sku: "EX-THHN12-500",
    seller: "Sample Wire & Cable Co.",
    role: "supplier",
    price: "$96.40",
    unit: "per reel",
    stock: "In stock",
    lead: "Ships in 2 days",
  },
  {
    id: "l2",
    category: "Rebar & structural",
    name: "#4 Grade 60 rebar, 20 ft sticks",
    sku: "EX-RB4-20",
    seller: "Example Steel Supply",
    role: "distributor",
    price: "$11.85",
    unit: "per stick",
    stock: "2 branches",
    lead: "Will-call today",
  },
  {
    id: "l3",
    category: "Fasteners & hardware",
    name: '3/8" x 3" wedge anchors, zinc, box of 50',
    sku: "EX-WA38-3",
    seller: "Sample Fastener Works",
    role: "supplier",
    price: "$24.10",
    unit: "per box",
    stock: "Pallet qty available",
    lead: "Ships in 3 days",
  },
];

export const SAMPLE_REQUESTS = [
  {
    id: "r1",
    title: "4,000 ft 12 AWG THHN, black/white/green",
    buyer: "contractor",
    project: "Medical office TI, Pasadena",
    needBy: `Needed ${daysFromToday(14)}`,
    quotes: 3,
  },
  {
    id: "r2",
    title: "Restock: 3/4\" EMT conduit and set-screw fittings",
    buyer: "distributor",
    project: "Branch restock, Riverside",
    needBy: `Needed ${daysFromToday(20)}`,
    quotes: 2,
  },
  {
    id: "r3",
    title: "1,200 sheets 5/8\" Type X drywall",
    buyer: "contractor",
    project: "Mixed-use podium, Long Beach",
    needBy: `Needed ${daysFromToday(28)}`,
    quotes: 0,
  },
];
