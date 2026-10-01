// Stratagem Fleet: passenger transportation operated by D&J Stratagem, Inc.
//
// Everything a booking partner or customer verifies lives here, so the page
// never states a credential, vehicle, or policy that is not on file. Fill a
// field in only when the document exists; an empty field renders "Pending".
// See PROOF.md: no invented permits, policies, vehicles, or reviews.

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
export const credentials = [
  {
    key: "tcp",
    label: "CPUC charter-party carrier permit",
    value: null, // e.g. "TCP 000000-B"
    note: "Required by the California Public Utilities Commission to carry passengers for hire.",
  },
  {
    key: "usdot",
    label: "USDOT number",
    value: null,
    note: "Federal registration with the FMCSA.",
  },
  {
    key: "mc",
    label: "FMCSA operating authority (MC)",
    value: null,
    note: "Needed for interstate for-hire trips. Until issued, trips stay inside California.",
  },
  {
    key: "auto",
    label: "Commercial auto liability",
    value: null, // e.g. "$1,500,000 combined single limit"
    note: "At least $1,500,000 per vehicle; at least $5,000,000 on vehicles seating 16 or more where required.",
  },
  {
    key: "insurer",
    label: "Insurer and policy expiry",
    value: null,
    note: "Certificate of insurance available on request.",
  },
];

export const isLicensed = credentials.every((c) => c.value);

// Vehicle classes are definitions of service, not a claim about units owned.
// Add specific vehicles to `vehicles` only once each is registered, inspected,
// and insured, with real photos you own.
export const vehicleClasses = [
  {
    key: "sedan",
    name: "Executive sedan",
    passengers: 3,
    bags: 3,
    shape: "sedan",
    bestFor: "Airport runs and one-to-one executive travel",
    features: ["Leather seating", "Phone charging", "Bottled water", "Rear climate control"],
  },
  {
    key: "suv",
    name: "Premium SUV",
    passengers: 6,
    bags: 6,
    shape: "suv",
    bestFor: "Small teams, families, and extra luggage",
    features: ["Three-row seating", "Phone charging", "Bottled water", "All-weather capable"],
  },
  {
    key: "sprinter",
    name: "Executive Sprinter",
    passengers: 12,
    bags: 12,
    shape: "van",
    bestFor: "Site tours, roadshows, and team transfers",
    features: ["Stand-up cabin", "Forward-facing seats", "Wi-Fi", "Rear luggage bay"],
  },
  {
    key: "minibus",
    name: "Minibus",
    passengers: 28,
    bags: 20,
    shape: "minibus",
    bestFor: "Crew shuttles, weddings, and event loops",
    features: ["Wheelchair lift available", "PA system", "Overhead racks", "Climate control"],
  },
  {
    key: "coach",
    name: "Motorcoach",
    passengers: 56,
    bags: 56,
    shape: "coach",
    bestFor: "Large groups, conferences, and charters",
    features: ["Under-floor luggage bays", "Restroom", "Wi-Fi and outlets", "Reclining seats"],
  },
];

// Specific vehicles: { classKey, year, make, model, seats, photo }. Empty until real.
export const vehicles = [];

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
      "Licensed for the vehicle class they drive, with background checks and driving-record reviews before their first trip",
      "Enrolled in drug and alcohol testing where the law requires it",
      "Zero tolerance for driving impaired by alcohol, drugs, or fatigue",
      "Trained in passenger safety, accessibility, and professional conduct",
    ],
  },
  {
    title: "Vehicles",
    points: [
      "Maintained on a written schedule, inspected before every shift, and inspected where the law requires",
      "Clean, roadworthy, and exactly the class you booked",
      "A replacement is only ever equal or better in class, capacity, and condition",
      "We use our own vehicles and drivers. No trip is passed to another operator without your approval",
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
