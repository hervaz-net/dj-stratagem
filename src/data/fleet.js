// Stratagem Fleet: passenger transportation operated by D&J Stratagem, Inc.
//
// Everything a booking partner or customer verifies lives here, so the page
// never states a credential, vehicle, or policy that is not on file. Fill a
// field in only when the document exists; an empty field renders "Pending".
// See PROOF.md: no invented permits, policies, vehicles, or reviews. Owned
// vehicles go in `owned`; models we only arrange go in `arranged`, labeled.

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


// Vehicle classes: what a customer books. The image is a real photo of a
// vehicle in that class (our own where we have one, licensed otherwise).
export const vehicleClasses = [
  {
    key: "suv",
    image: "/media/fleet/ours/cullinan-1.webp",
    name: "Ultra-luxury SUV",
    passengers: 6,
    bags: 6,
    bestFor: "Executives, families, and arrivals that should be noticed",
    features: ["Rolls-Royce, Maybach, Bentley, Escalade ESV", "Leather or semi-aniline seating", "Phone charging and bottled water", "Rear climate control"],
  },
  {
    key: "sedan",
    image: "/media/fleet/vehicles/rr-phantom.webp",
    name: "Luxury sedan",
    passengers: 3,
    bags: 3,
    bestFor: "Airport runs and one-to-one executive travel",
    features: ["Phantom, S-Class, Maybach, Flying Spur", "Rear executive seating", "Phone charging and bottled water", "Quiet cabin for calls"],
  },
  {
    key: "sports",
    image: "/media/fleet/vehicles/huracan.webp",
    name: "Sports car",
    passengers: 1,
    bags: 1,
    bestFor: "Self-drive weekends, shoots, and special occasions",
    features: ["Lamborghini, Ferrari, McLaren, Porsche", "Self-drive with a 24-hour minimum", "Delivered or collected in Los Angeles", "Damage deposit set on the quote"],
  },
  {
    key: "sprinter",
    image: "/media/fleet/vehicles/sprinter-jet.webp",
    name: "Executive Sprinter",
    passengers: 14,
    bags: 14,
    bestFor: "Site tours, roadshows, and team transfers",
    features: ["Stand-up cabin", "Captain's chairs or forward-facing seats", "Wi-Fi on request", "Rear luggage bay"],
  },
  {
    key: "coach",
    image: "/media/fleet/vehicles/mci-j4500.webp",
    name: "Motorcoach",
    passengers: 56,
    bags: 56,
    bestFor: "Conferences, crew moves, weddings, and tours",
    features: ["MCI, Prevost, Van Hool, Setra", "Under-floor luggage bays", "Restroom and PA system", "Wheelchair lift on request"],
  },
];

// Our own vehicles, listed on RentX and in service. Photos are our own.
// Specs and features are copied from the live RentX listing; keep them in sync.
const owned = [
  {
    key: "cullinan", classKey: "suv", year: 2019, make: "Rolls-Royce", model: "Cullinan", seats: 5,
    minimumHours: 24, base: "Downtown Los Angeles",
    photos: ["/media/fleet/ours/cullinan-1.webp", "/media/fleet/ours/cullinan-2.webp", "/media/fleet/ours/cullinan-3.webp"],
    features: ["Adaptive cruise control", "All-wheel drive", "Backup camera", "Brake assist", "Lane departure warning", "Bluetooth", "GPS", "Sunroof"],
  },
  {
    key: "escalade-esv", classKey: "suv", year: 2026, make: "Cadillac", model: "Escalade ESV", seats: 7,
    minimumHours: 24, base: "Downtown Los Angeles",
    photos: ["/media/fleet/ours/escalade-1.webp", "/media/fleet/ours/escalade-2.webp", "/media/fleet/ours/escalade-3.webp"],
    features: ["Adaptive cruise control", "All-wheel drive", "Backup camera", "Blind spot warning", "Lane keeping assist", "Android Auto and Apple CarPlay", "Heated seats", "Sunroof"],
  },
  {
    key: "maybach-gls", classKey: "suv", year: 2025, make: "Mercedes-Maybach", model: "GLS 600", seats: 4,
    minimumHours: 24, base: "Downtown Los Angeles",
    photos: ["/media/fleet/ours/maybach-1.webp", "/media/fleet/ours/maybach-2.webp", "/media/fleet/ours/maybach-3.webp"],
    features: ["Adaptive cruise control", "All-wheel drive", "Blind spot warning", "Lane keeping assist", "Apple CarPlay", "USB charging", "Heated seats", "Sunroof"],
  },
];

// Vehicles we arrange through partner operators, subject to availability.
// These are models we can book, not units we own: the page labels them so.
// Photos are freely licensed from Wikimedia Commons; credit is required and
// rendered with each photo. passengers = riders besides the driver.
export const arranged = [
  { key: "rr-cullinan", seats: 5, name: "Rolls-Royce Cullinan", classKey: "suv", passengers: 4, bags: 4, service: "both", note: "The benchmark ultra-luxury SUV, rear-hinged coach doors", image: "/media/fleet/vehicles/rr-cullinan.webp",
    credit: { author: "Jengtingchen", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Rolls-Royce_Cullinan_001.jpg" } },
  { key: "bentley-bentayga", seats: 5, name: "Bentley Bentayga EWB", classKey: "suv", passengers: 4, bags: 4, service: "both", note: "Long wheelbase with reclining rear airline seats", image: "/media/fleet/vehicles/bentley-bentayga.webp",
    credit: { author: "Alexander-93", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Bentley_Bentayga_(FL)_Azure_1X7A7439.jpg" } },
  { key: "lamborghini-urus", seats: 5, name: "Lamborghini Urus", classKey: "suv", passengers: 4, bags: 4, service: "self", note: "Super-SUV performance with room for four", image: "/media/fleet/vehicles/lamborghini-urus.webp",
    credit: { author: "Alexander-93", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Lamborghini_Urus_S_1X7A6796.jpg" } },
  { key: "mercedes-g63", seats: 5, name: "Mercedes-AMG G 63", classKey: "suv", passengers: 4, bags: 4, service: "both", note: "Hand-built V8 G-Class, an icon in any arrival", image: "/media/fleet/vehicles/mercedes-g63.webp",
    credit: { author: "Chanokchon", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2019_Mercedes-AMG_G_63.jpg" } },
  { key: "range-rover", seats: 5, name: "Range Rover SV", classKey: "suv", passengers: 4, bags: 4, service: "both", note: "Long-wheelbase flagship with executive rear seating", image: "/media/fleet/vehicles/range-rover.webp",
    credit: { author: "Dinkun Chen", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:LAND_ROVER_RANGE_ROVER_(L460)_China.jpg" } },
  { key: "aston-dbx", seats: 5, name: "Aston Martin DBX707", classKey: "suv", passengers: 4, bags: 4, service: "self", note: "The most powerful luxury SUV Aston Martin builds", image: "/media/fleet/vehicles/aston-dbx.webp",
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Aston_Martin_DBX_DSC_7244.jpg" } },
  { key: "ferrari-purosangue", seats: 4, name: "Ferrari Purosangue", classKey: "suv", passengers: 4, bags: 4, service: "self", note: "Ferrari's four-door, four-seat V12", image: "/media/fleet/vehicles/ferrari-purosangue.webp",
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Ferrari_Purosangue_DSC_7008.jpg" } },
  { key: "escalade-v", seats: 7, name: "Cadillac Escalade", classKey: "suv", passengers: 6, bags: 4, service: "both", note: "Three rows, captain's chairs, the full-size standard", image: "/media/fleet/vehicles/escalade-v.webp",
    credit: { author: "Dinkun Chen", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:CADILLAC_ESCALADE_China_(1).jpg" } },
  { key: "navigator", seats: 7, name: "Lincoln Navigator L", classKey: "suv", passengers: 6, bags: 4, service: "both", note: "Extended wheelbase, extra cargo behind the third row", image: "/media/fleet/vehicles/navigator.webp",
    credit: { author: "Kevauto", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2018_Lincoln_Navigator_front_9.22.18.jpg" } },
  { key: "bmw-xm", seats: 5, name: "BMW XM", classKey: "suv", passengers: 4, bags: 4, service: "self", note: "BMW M's plug-in hybrid flagship", image: "/media/fleet/vehicles/bmw-xm.webp",
    credit: { author: "Alexander-93", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:BMW_XM_(G09)_IMG_7778.jpg" } },
  { key: "lexus-lx", seats: 7, name: "Lexus LX 600", classKey: "suv", passengers: 6, bags: 4, service: "both", note: "Body-on-frame comfort with three-row seating", image: "/media/fleet/vehicles/lexus-lx.webp",
    credit: { author: "Damian B Oh", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Lexus_LX_600_VJA310_Atomic_Silver_(2).jpg" } },
  { key: "yukon-denali", seats: 7, name: "GMC Yukon Denali", classKey: "suv", passengers: 6, bags: 4, service: "both", note: "Three-row full-size SUV for families and teams", image: "/media/fleet/vehicles/yukon-denali.webp",
    credit: { author: "Calreyn88", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2021_GMC_Yukon_Denali.jpg" } },
  { key: "rr-phantom", seats: 5, name: "Rolls-Royce Phantom", classKey: "sedan", passengers: 3, bags: 3, service: "chauffeured", note: "The flagship limousine for the most important arrivals", image: "/media/fleet/vehicles/rr-phantom.webp",
    credit: { author: "Alexander-93", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Rolls-Royce_Phantom_VIII_Series_I_IMG_9101.jpg" } },
  { key: "rr-ghost", seats: 5, name: "Rolls-Royce Ghost", classKey: "sedan", passengers: 3, bags: 3, service: "both", note: "Quiet, understated Rolls-Royce for daily executive travel", image: "/media/fleet/vehicles/rr-ghost.webp",
    credit: { author: "Rutger van der Maar", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:2009_Rolls-Royce_Ghost.jpg" } },
  { key: "flying-spur", seats: 5, name: "Bentley Flying Spur", classKey: "sedan", passengers: 3, bags: 3, service: "both", note: "Grand touring sedan with a rear executive cabin", image: "/media/fleet/vehicles/flying-spur.webp",
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Bentley_Flying_Spur_(2019)_IMG_2635.jpg" } },
  { key: "maybach-s680", seats: 4, name: "Mercedes-Maybach S 680", classKey: "sedan", passengers: 3, bags: 3, service: "chauffeured", note: "V12 Maybach with rear reclining executive seats", image: "/media/fleet/vehicles/maybach-s680.webp",
    credit: { author: "Dinkun Chen", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:MERCEDES_MAYBACH_S-CLASS_(W223)_China_(12).jpg" } },
  { key: "s580", seats: 5, name: "Mercedes-Benz S 580", classKey: "sedan", passengers: 3, bags: 3, service: "both", note: "The executive sedan most airports and boardrooms expect", image: "/media/fleet/vehicles/s580.webp",
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_W223_IAA_2021_1X7A0206.jpg" } },
  { key: "bmw-i7", seats: 5, name: "BMW i7", classKey: "sedan", passengers: 3, bags: 3, service: "both", note: "All-electric limousine with a rear theater screen option", image: "/media/fleet/vehicles/bmw-i7.webp",
    credit: { author: "Original photo by User:Alexander-93 retouched by NearEMPTiness", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:BMW_7-Series_(G70)_750e_1X7A1895_(Hintergrund_retuschiert).jpg" } },
  { key: "audi-a8", seats: 5, name: "Audi A8 L", classKey: "sedan", passengers: 3, bags: 3, service: "both", note: "Long-wheelbase executive sedan, quiet and composed", image: "/media/fleet/vehicles/audi-a8.webp",
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Audi_A8_D5_(2021)_1X7A6342.jpg" } },
  { key: "panamera", seats: 4, name: "Porsche Panamera", classKey: "sedan", passengers: 3, bags: 3, service: "self", note: "Four-door Porsche with sports-car handling", image: "/media/fleet/vehicles/panamera.webp",
    credit: { author: "Pangalau", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Porsche_971_Panamera_(Singapore).jpg" } },
  { key: "lucid-air", seats: 5, name: "Lucid Air", classKey: "sedan", passengers: 3, bags: 3, service: "both", note: "Long-range electric luxury sedan", image: "/media/fleet/vehicles/lucid-air.webp",
    credit: { author: "Alexander-93", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Lucid_Air_DSC_6026.jpg" } },
  { key: "genesis-g90", seats: 5, name: "Genesis G90", classKey: "sedan", passengers: 3, bags: 3, service: "both", note: "Flagship comfort with a calm, spacious rear cabin", image: "/media/fleet/vehicles/genesis-g90.webp",
    credit: { author: "Benespit", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:00_Genesis_G90_1.jpg" } },
  { key: "huracan", seats: 2, name: "Lamborghini Hurac\u00e1n EVO", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "Naturally aspirated V10 supercar", image: "/media/fleet/vehicles/huracan.webp",
    credit: { author: "Matti Blume", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Lamborghini_Huracan_Evo,_GIMS_2019,_Le_Grand-Saconnex_(GIMS1010).jpg" } },
  { key: "revuelto", seats: 2, name: "Lamborghini Revuelto", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "V12 plug-in hybrid flagship supercar", image: "/media/fleet/vehicles/revuelto.webp",
    credit: { author: "Alexander-93", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Lamborghini_Revuelto_IMG_0562.jpg" } },
  { key: "ferrari-296", seats: 2, name: "Ferrari 296 GTB", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "Mid-engine V6 hybrid berlinetta", image: "/media/fleet/vehicles/ferrari-296.webp",
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Ferrari_296_GTB_1X7A6377.jpg" } },
  { key: "ferrari-roma", seats: 4, name: "Ferrari Roma", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "Front-engine V8 grand tourer, 2+2 seating", image: "/media/fleet/vehicles/ferrari-roma.webp",
    credit: { author: "Alexander-93", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Ferrari_Roma_IMG_9620.jpg" } },
  { key: "mclaren-750s", seats: 2, name: "McLaren 750S", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "Lightweight V8 supercar with dihedral doors", image: "/media/fleet/vehicles/mclaren-750s.webp",
    credit: { author: "Calreyn88", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2024_McLaren_750S_5.jpg" } },
  { key: "911-turbo-s", seats: 4, name: "Porsche 911 Turbo S", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "All-weather, all-wheel-drive everyday supercar", image: "/media/fleet/vehicles/911-turbo-s.webp",
    credit: { author: "Alexander Migl", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Porsche_992_Turbo_S_1X7A0411.jpg" } },
  { key: "db12", seats: 4, name: "Aston Martin DB12", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "Twin-turbo V8 super tourer", image: "/media/fleet/vehicles/db12.webp",
    credit: { author: "Alexander-93", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Aston_Martin_DB12_1X7A1921.jpg" } },
  { key: "continental-gt", seats: 4, name: "Bentley Continental GT", classKey: "sports", passengers: 3, bags: 1, service: "self", note: "Grand tourer built for long, fast drives", image: "/media/fleet/vehicles/continental-gt.webp",
    credit: { author: "Matti Blume", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Bentley_Continental_GT_V8_S,_Techno-Classica_2018,_Essen_(IMG_9623).jpg" } },
  { key: "rr-spectre", seats: 4, name: "Rolls-Royce Spectre", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "The first all-electric Rolls-Royce coupe", image: "/media/fleet/vehicles/rr-spectre.webp",
    credit: { author: "User3204", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2023_Rolls-Royce_Spectre.jpg" } },
  { key: "corvette-z06", seats: 2, name: "Chevrolet Corvette Z06", classKey: "sports", passengers: 1, bags: 1, service: "self", note: "Mid-engine flat-plane V8 track car for the street", image: "/media/fleet/vehicles/corvette-z06.webp",
    credit: { author: "OWS Photography", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", source: "https://commons.wikimedia.org/wiki/File:Chevrolet_Corvette_Z06_(C8)_Miami_Metro_Area,_USA.jpg" } },
  { key: "sprinter-jet", name: "Mercedes-Benz Sprinter Executive", classKey: "sprinter", passengers: 10, bags: 10, service: "chauffeured", note: "Executive conversion with captain's chairs and a stand-up cabin", image: "/media/fleet/vehicles/sprinter-jet.webp",
    credit: { author: "Ethan Llamas", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_Sprinter_VS30_317_CDI_Black_-_front.jpg" } },
  { key: "sprinter-14", name: "Mercedes-Benz Sprinter 14-passenger", classKey: "sprinter", passengers: 14, bags: 14, service: "chauffeured", note: "Forward-facing seats with a rear luggage bay", image: "/media/fleet/vehicles/sprinter-14.webp",
    credit: { author: "Damian B Oh", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_Sprinter_VS30_black_(1).jpg" } },
  { key: "sprinter-vip", name: "Mercedes-Benz Sprinter VIP Lounge", classKey: "sprinter", passengers: 8, bags: 8, service: "chauffeured", note: "Lounge seating, mood lighting, and a media screen", image: "/media/fleet/vehicles/sprinter-vip.webp",
    credit: { author: "Damian B Oh", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_VS30_Sprinter_Tourer_319_CDI_Jet_Black_(1).jpg" } },
  { key: "transit-15", name: "Ford Transit 15-passenger", classKey: "sprinter", passengers: 14, bags: 14, service: "chauffeured", note: "High-roof passenger van for crew shuttles", image: "/media/fleet/vehicles/transit-15.webp",
    credit: { author: "Elise240SX", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2020_Ford_Transit_350_XLT_Passenger_Van_in_Oxford_White,_Front_Right,_05-21-2022.jpg" } },
  { key: "sprinter-limo", name: "Mercedes-Benz Sprinter minicoach", classKey: "sprinter", passengers: 19, bags: 19, service: "chauffeured", note: "Minicoach body for team transfers and site tours", image: "/media/fleet/vehicles/sprinter-limo.webp",
    credit: { author: "Djsgmnd", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:EBS_4233.jpg" } },
  { key: "metris", name: "Mercedes-Benz Metris", classKey: "sprinter", passengers: 7, bags: 7, service: "chauffeured", note: "Compact passenger van for airport runs with luggage", image: "/media/fleet/vehicles/metris.webp",
    credit: { author: "HJUdall", license: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en", source: "https://commons.wikimedia.org/wiki/File:23_Mercedes-Benz_Metris_Passenger.jpg" } },
  { key: "mci-j4500", name: "MCI J4500", classKey: "coach", passengers: 56, bags: 56, service: "chauffeured", note: "The most common full-size coach on U.S. charters", image: "/media/fleet/vehicles/mci-j4500.webp",
    credit: { author: "Grendelkhan", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Google_bus_at_Sunnyvale_campus.jpg" } },
  { key: "prevost-h345", name: "Prevost H3-45", classKey: "coach", passengers: 56, bags: 56, service: "chauffeured", note: "High-deck touring coach with extra under-floor storage", image: "/media/fleet/vehicles/prevost-h345.webp",
    credit: { author: "MTATransitFan", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:H3-45_1352.jpg" } },
  { key: "vanhool-cx45", name: "Van Hool CX45", classKey: "coach", passengers: 56, bags: 56, service: "chauffeured", note: "Smooth-riding charter coach for long-distance groups", image: "/media/fleet/vehicles/vanhool-cx45.webp",
    credit: { author: "Artsistra", license: "CC0", licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en", source: "https://commons.wikimedia.org/wiki/File:Dattco_Van_Hool_CX45.jpg" } },
  { key: "setra-s517", name: "Setra S 516 HDH", classKey: "coach", passengers: 49, bags: 49, service: "chauffeured", note: "German high-deck coach with premium touring seats", image: "/media/fleet/vehicles/setra-s517.webp",
    credit: { author: "Travelarz", license: "CC BY-SA 3.0 pl", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/pl/deed.en", source: "https://commons.wikimedia.org/wiki/File:Setra_S_516_HDH_IAA_2016_(1)_Travelarz.JPG" } },
  { key: "prevost-x345", name: "Prevost X3-45", classKey: "coach", passengers: 56, bags: 56, service: "chauffeured", note: "Low-step entry coach for conferences and events", image: "/media/fleet/vehicles/prevost-x345.webp",
    credit: { author: "Kidfly182", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", source: "https://commons.wikimedia.org/wiki/File:MTA_Prevost_X3-45_2717.jpg" } },
  { key: "mci-d4505", name: "MCI D4505", classKey: "coach", passengers: 56, bags: 56, service: "chauffeured", note: "Proven 45-foot coach for shuttles and charters", image: "/media/fleet/vehicles/mci-d4505.webp",
    credit: { author: "Robertwu1997", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:AC_Transit_MCI_D45_CRT_LE.jpg" } },
];

export const serviceLabel = { chauffeured: "Chauffeured", self: "Self-drive", both: "Chauffeured or self-drive" };

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
