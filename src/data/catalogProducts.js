// Sample catalog data — illustrative SKUs, brands, and pricing, not a real
// supplier feed. Same practice as sampleProjects.js: realistic shape, clearly
// not live inventory. Generated combinatorially (base item x size/finish x
// brand) the way a real fastener/pipe catalog actually is structured — most
// hardware SKUs really are "the same part in five sizes," so this isn't a
// stretch to make the count look bigger than it is.

const CATS = {
  fasteners: "Fasteners & hardware",
  power: "Power tools & accessories",
  electrical: "Electrical tools & materials",
  lumber: "Lumber & wood",
  metal: "Metal plate, rods & structural",
  pvc: "Plumbing PVC & fittings",
  fixtures: "Plumbing hardware & fixtures",
  safety: "Safety & jobsite consumables",
};

let seq = 0;
const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function make(category, name, brand, type, unit, price, leadDaysMin, leadDaysMax) {
  seq += 1;
  return {
    id: `sku-${seq}-${slug(name)}-${slug(brand)}`,
    category,
    name,
    brand,
    type,
    unit,
    price: Math.round(price * 100) / 100,
    leadDaysMin,
    leadDaysMax,
  };
}

const products = [];

// ---------------------------------------------------------------- fasteners
{
  const brands = ["Grip-Rite", "Simpson Strong-Tie", "Hillman", "GRK Fasteners", "Powers Fasteners"];
  const finishes = ["Zinc-plated", "Hot-dip galvanized", "Stainless steel"];
  const items = [
    { name: "Hex Lag Screw", sizes: ['1/4" x 2"', '1/4" x 3"', '3/8" x 3"', '3/8" x 4"', '1/2" x 4"', '1/2" x 6"'], base: 0.35 },
    { name: "Deck Screw", sizes: ["#8 x 1-5/8\"", "#8 x 2-1/2\"", "#9 x 3\"", "#10 x 3-1/2\""], base: 0.08 },
    { name: "Concrete Anchor", sizes: ['1/4" x 1-3/4"', '3/8" x 3"', '1/2" x 4"'], base: 0.45 },
    { name: "Hex Bolt Grade 5", sizes: ['3/8" x 2"', '1/2" x 3"', '5/8" x 4"'], base: 0.5 },
    { name: "Flat Washer", sizes: ['1/4"', '3/8"', '1/2"', '5/8"'], base: 0.04 },
    { name: "Wedge Anchor", sizes: ['3/8" x 3"', '1/2" x 4"', '5/8" x 5"'], base: 0.9 },
  ];
  for (const item of items) {
    for (const size of item.sizes) {
      for (const finish of finishes) {
        const brand = brands[(item.sizes.indexOf(size) + finishes.indexOf(finish)) % brands.length];
        products.push(
          make(CATS.fasteners, item.name, brand, `${size} · ${finish}`, "box of 50", item.base * 50 * (1 + finishes.indexOf(finish) * 0.15), 1, 3),
        );
      }
    }
  }
}

// -------------------------------------------------------------- power tools
{
  const brands = ["DeWalt", "Milwaukee", "Makita", "Bosch", "Ridgid"];
  const items = [
    { name: "20V Cordless Drill/Driver Kit", unit: "kit", price: 179 },
    { name: "20V Impact Driver Kit", unit: "kit", price: 199 },
    { name: '7-1/4" Circular Saw', unit: "each", price: 149 },
    { name: "Reciprocating Saw", unit: "each", price: 159 },
    { name: '4-1/2" Angle Grinder', unit: "each", price: 89 },
    { name: '7" Angle Grinder', unit: "each", price: 169 },
    { name: "SDS-Plus Rotary Hammer", unit: "each", price: 219 },
    { name: "Jigsaw", unit: "each", price: 129 },
    { name: "Oscillating Multi-Tool", unit: "each", price: 139 },
    { name: "5.0Ah Battery Pack", unit: "each", price: 99 },
    { name: "9.0Ah Battery Pack", unit: "each", price: 179 },
    { name: "Fast Charger", unit: "each", price: 59 },
    { name: '7" Diamond Blade', unit: "each", price: 34 },
    { name: '7-1/4" Wood Blade, 24T', unit: "each", price: 12 },
    { name: '4-1/2" Metal Cutting Wheel', unit: "5-pack", price: 18 },
  ];
  for (const item of items) {
    for (const brand of brands) {
      const priceMult = brand === "Milwaukee" || brand === "Bosch" ? 1.1 : brand === "Ridgid" ? 0.92 : 1;
      products.push(make(CATS.power, item.name, brand, "Standard", item.unit, item.price * priceMult, 2, 6));
    }
  }
}

// --------------------------------------------------------------- electrical
{
  const brands = ["Southwire", "Leviton", "Square D", "Klein Tools", "Carlon"];
  const items = [
    { name: "THHN Wire", variants: ["12 AWG, 500 ft", "10 AWG, 500 ft", "8 AWG, 250 ft"], base: 65 },
    { name: "Romex NM-B Cable", variants: ["14/2, 250 ft", "12/2, 250 ft", "10/2, 125 ft"], base: 85 },
    { name: "EMT Conduit", variants: ['1/2" x 10 ft', '3/4" x 10 ft', '1" x 10 ft'], base: 9 },
    { name: "PVC Conduit", variants: ['1" x 10 ft', '2" x 10 ft'], base: 11 },
    { name: "Single-Pole Breaker", variants: ["15A", "20A", "30A"], base: 14 },
    { name: "Double-Pole Breaker", variants: ["30A", "50A"], base: 32 },
    { name: "GFCI Outlet", variants: ["15A", "20A"], base: 18 },
    { name: "Duplex Receptacle", variants: ["15A", "20A"], base: 3.5 },
    { name: "Single-Gang Box", variants: ["Plastic", "Metal"], base: 2.2 },
    { name: "Wire Connectors", variants: ["Box of 100"], base: 9 },
    { name: "Cable Staples", variants: ["Box of 100"], base: 6 },
  ];
  for (const item of items) {
    for (const variant of item.variants) {
      for (const brand of brands) {
        products.push(make(CATS.electrical, item.name, brand, variant, "each", item.base * (0.9 + brands.indexOf(brand) * 0.05), 1, 4));
      }
    }
  }
}

// -------------------------------------------------------------------lumber
{
  const brands = ["Georgia-Pacific", "Weyerhaeuser", "Boise Cascade"];
  const items = [
    { name: "2x4 Stud", variants: ["8 ft", "10 ft"], base: 4.2 },
    { name: "2x6", variants: ["8 ft", "10 ft"], base: 7.1 },
    { name: "2x8", variants: ["10 ft", "12 ft"], base: 11.4 },
    { name: "2x10", variants: ["12 ft", "16 ft"], base: 16.8 },
    { name: "4x4 Post", variants: ["8 ft"], base: 12.5 },
    { name: "1/2\" CDX Plywood", variants: ["4x8 sheet"], base: 38 },
    { name: "3/4\" CDX Plywood", variants: ["4x8 sheet"], base: 52 },
    { name: "7/16\" OSB", variants: ["4x8 sheet"], base: 22 },
    { name: "5/8\" OSB", variants: ["4x8 sheet"], base: 29 },
  ];
  const grades = ["Standard", "Pressure-treated"];
  for (const item of items) {
    for (const variant of item.variants) {
      for (const grade of grades) {
        const brand = brands[(item.name.length + variant.length) % brands.length];
        products.push(make(CATS.lumber, item.name, brand, `${variant} · ${grade}`, "each", item.base * (grade === "Pressure-treated" ? 1.35 : 1), 1, 5));
      }
    }
  }
}

// ----------------------------------------------------------------- metal
{
  const brands = ["Nucor", "Steel Dynamics", "Commercial Metals Co."];
  const items = [
    { name: "Rebar #4", variants: ["20 ft length"], base: 14 },
    { name: "Rebar #5", variants: ["20 ft length"], base: 21 },
    { name: "Rebar #6", variants: ["20 ft length"], base: 29 },
    { name: "Steel Angle", variants: ['2x2x1/4" x 20 ft', '3x3x1/4" x 20 ft'], base: 48 },
    { name: "Steel Flat Bar", variants: ['1/4x2" x 20 ft'], base: 32 },
    { name: "Steel Channel C3x4.1", variants: ["20 ft length"], base: 68 },
    { name: "Steel Plate", variants: ['1/4" x 4x8 sheet'], base: 210 },
    { name: "Threaded Rod", variants: ['1/2" x 6 ft', '3/4" x 6 ft'], base: 11 },
  ];
  for (const item of items) {
    for (const variant of item.variants) {
      for (const brand of brands) {
        products.push(make(CATS.metal, item.name, brand, variant, "each", item.base * (0.95 + brands.indexOf(brand) * 0.06), 3, 10));
      }
    }
  }
}

// -------------------------------------------------------------------- pvc
{
  const brands = ["Charlotte Pipe", "IPEX", "NIBCO"];
  const schedules = ["Schedule 40", "Schedule 80"];
  const items = [
    { name: "PVC Pipe", sizes: ['1/2" x 10 ft', '3/4" x 10 ft', '1" x 10 ft', '2" x 10 ft'], base: 4.5 },
    { name: "PVC 90° Elbow", sizes: ['1/2"', '3/4"', '1"'], base: 0.9 },
    { name: "PVC Tee", sizes: ['1/2"', '3/4"', '1"'], base: 1.1 },
    { name: "PVC Coupling", sizes: ['1/2"', '3/4"', '1"'], base: 0.6 },
  ];
  for (const item of items) {
    for (const size of item.sizes) {
      for (const sched of schedules) {
        const brand = brands[(size.length + sched.length) % brands.length];
        products.push(make(CATS.pvc, item.name, brand, `${size} · ${sched}`, "each", item.base * (sched === "Schedule 80" ? 1.4 : 1), 1, 3));
      }
    }
  }
  // PEX and CPVC — not schedule-rated, kept as their own variant axis
  const pexItems = [
    { name: "PEX Tubing", variants: ['1/2" x 100 ft', '3/4" x 100 ft'], base: 42 },
    { name: "CPVC Pipe", variants: ['1/2" x 10 ft', '3/4" x 10 ft'], base: 6.2 },
  ];
  for (const item of pexItems) {
    for (const variant of item.variants) {
      for (const brand of brands) {
        products.push(make(CATS.pvc, item.name, brand, variant, "each", item.base * (0.95 + brands.indexOf(brand) * 0.05), 1, 4));
      }
    }
  }
}

// --------------------------------------------------------------- fixtures
{
  const brands = ["Moen", "Kohler", "Rheem", "Delta"];
  const items = [
    { name: "Ball Valve", sizes: ['1/2"', '3/4"', '1"'], base: 8 },
    { name: "Gate Valve", sizes: ['3/4"', '1"'], base: 11 },
    { name: "Check Valve", sizes: ['1/2"', '3/4"'], base: 14 },
    { name: "Shutoff Valve", sizes: ['1/2"'], base: 6 },
    { name: "P-Trap", sizes: ["1-1/4\""], base: 9 },
  ];
  for (const item of items) {
    for (const size of item.sizes) {
      for (const brand of brands) {
        products.push(make(CATS.fixtures, item.name, brand, size, "each", item.base * (0.9 + brands.indexOf(brand) * 0.08), 2, 5));
      }
    }
  }
  const bigItems = [
    { name: "Water Heater, 40 gal", brand: "Rheem", price: 780 },
    { name: "Water Heater, 50 gal", brand: "Rheem", price: 940 },
    { name: "Kitchen Faucet", brand: "Moen", price: 145 },
    { name: "Kitchen Faucet", brand: "Delta", price: 132 },
    { name: "Bathroom Faucet", brand: "Kohler", price: 98 },
    { name: "Bathroom Faucet", brand: "Moen", price: 89 },
  ];
  for (const item of bigItems) {
    products.push(make(CATS.fixtures, item.name, item.brand, "Standard", "each", item.price, 5, 14));
  }
}

// ----------------------------------------------------------------- safety
{
  const brands = ["3M", "Honeywell", "Milwaukee", "Ergodyne"];
  const sizedItems = [
    { name: "Cut-Resistant Work Gloves", sizes: ["S", "M", "L", "XL"], base: 11 },
    { name: "Leather Work Gloves", sizes: ["S", "M", "L", "XL"], base: 14 },
  ];
  for (const item of sizedItems) {
    for (const size of item.sizes) {
      for (const brand of brands) {
        products.push(make(CATS.safety, item.name, brand, `Size ${size}`, "pair", item.base * (0.95 + brands.indexOf(brand) * 0.05), 1, 3));
      }
    }
  }
  const flatItems = [
    { name: "Hard Hat", unit: "each", price: 22 },
    { name: "Safety Glasses", unit: "each", price: 7 },
    { name: "Respirator, N95", unit: "10-pack", price: 24 },
    { name: "Hi-Vis Safety Vest", unit: "each", price: 16 },
    { name: "Fall Protection Harness", unit: "each", price: 89 },
    { name: "Caution Tape", unit: "300 ft roll", price: 8 },
    { name: "First Aid Kit", unit: "each", price: 34 },
    { name: "Foam Ear Plugs", unit: "100-pack", price: 11 },
    { name: "Knee Pads", unit: "pair", price: 19 },
  ];
  for (const item of flatItems) {
    for (const brand of brands) {
      products.push(make(CATS.safety, item.name, brand, "Standard", item.unit, item.price * (0.92 + brands.indexOf(brand) * 0.05), 1, 3));
    }
  }
}

export const CATEGORIES = Object.values(CATS);
export const BRANDS = [...new Set(products.map((p) => p.brand))].sort();
export const CATALOG = products;

/**
 * Grouped by base item name into ~80 browsable products, each carrying every
 * brand/type/price/lead-time combination as selectable variants — one card
 * with brand + type dropdowns reads as a real catalog page; 468 near-
 * duplicate rows (one per brand x size combination) would not.
 */
export const PRODUCT_GROUPS = Object.values(
  products.reduce((groups, p) => {
    const key = `${p.category}::${p.name}`;
    (groups[key] ??= {
      id: slug(key),
      category: p.category,
      name: p.name,
      variants: [],
    }).variants.push(p);
    return groups;
  }, {}),
);


export function etaLabel(p) {
  const start = new Date();
  start.setDate(start.getDate() + p.leadDaysMin);
  const end = new Date();
  end.setDate(end.getDate() + p.leadDaysMax);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return p.leadDaysMin === p.leadDaysMax ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}
