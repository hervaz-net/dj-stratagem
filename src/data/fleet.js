// Stratagem Fleet: the Fleet subagent's work vehicles, reserved for members'
// jobs. Operated by D&J Stratagem, Inc.
//
// Everything a booking partner or customer verifies lives here, so the page
// never states a credential, vehicle, or policy that is not on file. Fill a
// field in only when the document exists; an empty field renders "Pending".
// See PROOF.md: no invented permits, policies, vehicles, or reviews. Owned
// vehicles go in `owned`.

export const operator = {
  legalName: "D&J Stratagem, Inc.",
  dba: "Stratagem Fleet",
  base: "Los Angeles, California",
  serviceArea: "Los Angeles, Orange, Riverside, San Bernardino, and Ventura counties",
  email: "hello@djstratageminc.com",
  // Day-of line, answered while any trip is running. Set before taking bookings.
  phone: null,
  hours: "Reservation requests answered 7 days, 6am to 10pm.",
};

// Each value is the exact number or limit on the issued document, or null.
const issued = [
  {
    key: "tcp",
    label: "CPUC charter-party carrier permit",
    value: "TCP 344532-B",
    note: "Required by the California Public Utilities Commission to carry passengers for hire. Shown here only after the issued permit is on file.",
  },
  {
    key: "usdot",
    label: "USDOT number",
    value: "4211264",
    note: "Federal registration with the FMCSA. Registration is not operating authority.",
  },
  {
    key: "mc",
    label: "FMCSA operating authority (MC)",
    value: null,
    // Only needed for interstate trips. FMCSA lists the carrier as intrastate
    // only, so a missing MC number does not hold up the licensed state.
    optional: "Intrastate only",
    note: "Needed for interstate for-hire trips. Until issued, trips stay inside California.",
  },
  {
    key: "auto",
    label: "Commercial auto liability",
    value: "$5,000,000 combined single limit",
    note: "Limit is printed only from the certificate of insurance on file. At least $1,500,000 per vehicle is required; at least $5,000,000 on vehicles seating 16 or more where required.",
    // The passenger-carrier minimums above don't apply to reserved work vehicles.
    vehicleNote: "Covers every vehicle we reserve. The limit is printed only from the certificate of insurance on file.",
  },
  {
    key: "insurer",
    label: "Insurer",
    value: "biBerk",
    note: "Certificate of insurance, including the policy expiry, is available on request once issued. Expiry is not printed here until it is on the certificate we hold.",
  },
];


// The lineup: the only vehicles Fleet plans with and members can reserve.
// `photo`: an owner-supplied studio image (white background, 16:9) under
// public/media/vehicles/. Models without one show their drawing instead.
// These are models offered, not specific units; a unit goes in `owned` only
// once it is registered, inspected, and insured (see PROOF.md). No photos.
export const lineup = [
  {
    key: "pickup",
    name: "Heavy-duty pickups",
    short: "Pickups",
    use: "Towing, material runs, and the superintendent's truck on site.",
    models: [
      {
        key: "silverado",
        name: "Chevrolet Silverado 2500",
        years: "2025–2026",
        photo: "/media/vehicles/silverado.webp",
        specs: [["Class", "¾-ton heavy duty"], ["Trims", "WT through LTZ"], ["Engine", "V8"]],
      },
      {
        key: "superduty",
        name: "Ford F-250 / F-350",
        years: "2025–2026",
        specs: [["Class", "¾-ton or 1-ton"], ["Engine", "V8"], ["Bed", "Long or short"], ["Cab", "Crew Cab or SuperCab"]],
      },
      {
        key: "ram",
        name: "Ram 2500",
        years: "2025–2026",
        specs: [["Class", "¾-ton heavy duty"], ["Trims", "Tradesman through Laramie"], ["Engine", "V8"], ["Bed", "Long or short"], ["Drivetrain", "4x4"]],
      },
    ],
  },
  {
    key: "van",
    name: "Sprinters and cargo vans",
    short: "Vans",
    use: "Tools and materials under a roof, a rolling shop for trades.",
    models: [
      { key: "sprinter", name: "Mercedes-Benz Sprinter 3500", years: null, specs: [["Body", "Cargo van"], ["Engine", "Diesel"]] },
      { key: "transit", name: "Ford Transit Cargo", years: "2025–2026", specs: [["Body", "Cargo van"], ["Roof", "High or standard"]] },
    ],
  },
  {
    key: "suv",
    name: "Full-size SUVs",
    short: "SUVs",
    use: "Owner walks, client visits, and getting the project team between sites.",
    models: [
      { key: "suburban", name: "Chevrolet Suburban", years: "2025–2026", specs: [["Body", "Full-size SUV"], ["Seating", "Three rows"]] },
      {
        key: "escalade",
        name: "Cadillac Escalade / Escalade ESV",
        years: "2025–2026",
        specs: [["Body", "Full-size luxury SUV"], ["Length", "Standard or ESV (extended)"], ["Seating", "Three rows"]],
      },
    ],
  },
];

/** "2025–2026 Ford F-250 / F-350", for forms and requests. */
export const modelLabel = (m) => (m.years ? `${m.years} ${m.name}` : m.name);

// Specific vehicles: { key, classKey, year, make, model, seats, minimumHours,
// base, photos, features }. Empty until the owner asks for units to be listed.
const owned = [];

// Local test mode: `VITE_FLEET_FIXTURES=1 npm run dev`. Fills every credential
// and vehicle with obviously fake TEST values so the "fully licensed" state can
// be previewed. `import.meta.env.DEV` is false in production builds, so this
// branch and the fixtures are compiled out and can never reach the live site.
const fixtures =
  import.meta.env.DEV && import.meta.env.VITE_FLEET_FIXTURES === "1"
    ? {
        credentials: {
          tcp: "TEST-TCP-000000",
          usdot: "TEST-0000000",
          mc: "TEST-MC-000000",
          auto: "TEST $1,500,000 CSL",
          insurer: "TEST Insurer, exp. 12/31/2099",
        },
        vehicles: [
          { key: "t1", classKey: "pickup", year: 2099, make: "TEST", model: "Pickup", photos: [], features: [] },
          { key: "t2", classKey: "van", year: 2099, make: "TEST", model: "Cargo van", photos: [], features: [] },
          { key: "t3", classKey: "suv", year: 2099, make: "TEST", model: "SUV", photos: [], features: [] },
        ],
      }
    : null;

export const isTestFixtures = Boolean(fixtures);
export const credentials = issued.map((c) => ({ ...c, value: fixtures?.credentials[c.key] ?? c.value }));
// What applies to reserving work vehicles (no passengers carried for hire).
export const vehicleCredentials = credentials.filter((c) => ["usdot", "auto", "insurer"].includes(c.key));
export const isLicensed = vehicleCredentials.every((c) => c.value || c.optional);
export const vehicles = fixtures ? fixtures.vehicles : owned;
