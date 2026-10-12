// Stratagem Fleet: passenger transportation operated by D&J Stratagem, Inc.
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
  hours: "Reservations 7 days, 6am to 10pm. Live trips are monitored start to finish.",
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
  },
  {
    key: "insurer",
    label: "Insurer",
    value: "biBerk",
    note: "Certificate of insurance, including the policy expiry, is available on request once issued. Expiry is not printed here until it is on the certificate we hold.",
  },
];


// Vehicle classes: what a customer books. No photos: the page describes each
// class in words and numbers until our own vehicles can be photographed.
export const vehicleClasses = [
  {
    key: "suv",
    name: "Ultra-luxury SUV",
    passengers: 6,
    bags: 6,
    bestFor: "Executives, families, and arrivals that should be noticed",
    features: ["Rolls-Royce, Maybach, Bentley, Escalade", "Leather or semi-aniline seating", "Phone charging and bottled water", "Rear climate control"],
  },
  {
    key: "sedan",
    name: "Luxury sedan",
    passengers: 3,
    bags: 3,
    bestFor: "Airport runs and one-to-one executive travel",
    features: ["Phantom, S-Class, Maybach, Flying Spur", "Rear executive seating", "Phone charging and bottled water", "Quiet cabin for calls"],
  },
  {
    key: "sports",
    name: "Sports car",
    passengers: 1,
    bags: 1,
    bestFor: "Self-drive weekends, shoots, and special occasions",
    features: ["Lamborghini, Ferrari, McLaren, Porsche", "Self-drive with a 24-hour minimum", "Delivered or collected in Los Angeles", "Damage deposit set on the quote"],
  },
  {
    key: "sprinter",
    name: "Executive Sprinter",
    passengers: 14,
    bags: 14,
    bestFor: "Site tours, roadshows, and team transfers",
    features: ["Stand-up cabin", "Captain's chairs or forward-facing seats", "Wi-Fi on request", "Rear luggage bay"],
  },
  {
    key: "coach",
    name: "Motorcoach",
    passengers: 56,
    bags: 56,
    bestFor: "Conferences, crew moves, weddings, and tours",
    features: ["MCI, Prevost, Van Hool, Setra", "Under-floor luggage bays", "Restroom and PA system", "Wheelchair lift on request"],
  },
];

// Specific vehicles: { key, classKey, year, make, model, seats, minimumHours,
// base, photos, features }. Empty until the owner asks for units to be listed.
const owned = [];

export const services = [
  {
    title: "Airport transfers",
    text: "LAX, Burbank, Long Beach, John Wayne, and Ontario. Flight tracked, so the pickup moves when your flight does.",
  },
  {
    title: "Corporate travel",
    text: "Executives, clients, and roadshows on an account with one invoice, a named contact, and trip records on request.",
  },
  {
    title: "Jobsite crew shuttles",
    text: "Daily runs between parking, staging, and the site. Built by a construction company, for construction schedules.",
  },
  {
    title: "Events and weddings",
    text: "Guest loops and timed departures with a run sheet agreed in advance, so the night runs on time.",
  },
  {
    title: "Hourly, as directed",
    text: "Book the vehicle and driver by the hour and go where the day takes you, inside the agreed service area.",
  },
  {
    title: "Group charters",
    text: "Conferences, teams, schools, and tours. One quote for the whole movement, however many vehicles it takes.",
  },
];

// Charged only if listed and agreed in writing before the trip. Nothing else.
export const extras = [
  { name: "Waiting time", text: "After the grace period stated on your quote, billed in the increments shown there." },
  { name: "Tolls and parking", text: "Passed through at cost, with receipts on request." },
  { name: "Extra stops", text: "Added only when you ask for them, at the per-stop rate on your quote." },
  { name: "Cleaning", text: "Only for damage or soiling beyond normal use, documented with photos." },
];

export const standards = [
  {
    title: "Drivers",
    points: [
      "Licensed for the vehicle class they drive before their first trip, with background checks and driving-record reviews finished before they carry a passenger",
      "Enrolled in drug and alcohol testing where the law requires it",
      "Zero tolerance for driving impaired by alcohol, drugs, or fatigue",
      "Trained in passenger safety, accessibility, and professional conduct",
    ],
  },
  {
    title: "Vehicles",
    points: [
      "Maintained on a written schedule and inspected where the law requires, once a vehicle is in service",
      "Clean, roadworthy, and exactly the class you booked",
      "A replacement is only ever equal or better in class, capacity, and condition",
      "No trip is passed to another operator without your approval",
    ],
  },
  {
    title: "On the day",
    points: [
      "A named contact for every trip, reachable from pickup to drop-off",
      "If anything could make us late, you hear it from us first, with the fix",
      "Incidents are reported immediately and documented",
      "Trip, maintenance, and incident records are kept",
    ],
  },
];

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
          { key: "t1", classKey: "sedan", year: 2099, make: "TEST", model: "Sedan", seats: 3, photos: [], features: [] },
          { key: "t2", classKey: "suv", year: 2099, make: "TEST", model: "SUV", seats: 6, photos: [], features: [] },
          { key: "t3", classKey: "sprinter", year: 2099, make: "TEST", model: "Sprinter", seats: 12, photos: [], features: [] },
        ],
      }
    : null;

export const isTestFixtures = Boolean(fixtures);
export const credentials = issued.map((c) => ({ ...c, value: fixtures?.credentials[c.key] ?? c.value }));
export const isLicensed = credentials.every((c) => c.value || c.optional);
export const vehicles = fixtures ? fixtures.vehicles : owned;
