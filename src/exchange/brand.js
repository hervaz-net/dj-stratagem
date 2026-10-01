/**
 * Single source for names, contact details, and the three marketplace roles.
 * Rename the product here and it changes everywhere.
 */

export const COMPANY = "D&J Stratagem";
export const COMPANY_LEGAL = "D&J Stratagem, Inc.";
export const PRODUCT = "Stratagem Exchange";
export const PRODUCT_SHORT = "Exchange";
export const TAGLINE = "The B2B supply network for construction.";
export const SITE_URL = "https://djstratageminc.com";
export const CONTACT_EMAIL = "hello@djstratageminc.com";
export const LOCATION = "Los Angeles, California";

/**
 * The three sides of the marketplace, upstream to downstream. Keys are stable
 * identifiers (used in URLs, storage, and the API); labels are copy.
 */
export const ROLES = {
  supplier: {
    key: "supplier",
    label: "Manufacturers & vendors",
    short: "Supplier",
    path: "/suppliers",
    color: "role-supplier",
    summary: "Sell to distributors and direct to contractors from one catalog.",
  },
  distributor: {
    key: "distributor",
    label: "Distributors",
    short: "Distributor",
    path: "/distributors",
    color: "role-distributor",
    summary: "Buy from manufacturers, sell to contractors, and fill orders faster.",
  },
  contractor: {
    key: "contractor",
    label: "Contractors",
    short: "Contractor",
    path: "/contractors",
    color: "role-contractor",
    summary: "Post what the job needs and compare quotes from distributors and manufacturers.",
  },
};

/** Upstream → downstream order, for diagrams and pickers. */
export const ROLE_ORDER = ["supplier", "distributor", "contractor"];
