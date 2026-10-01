import { ROLES } from "../../brand";

/**
 * How each marketplace role sees the dashboard. `buys` / `sells` drive which
 * views a page shows; a distributor does both.
 */
export const ROLE_VIEWS = {
  contractor: {
    key: "contractor",
    label: ROLES.contractor.short,
    buys: true,
    sells: false,
    blurb: "Post requests, compare quotes, track deliveries.",
  },
  distributor: {
    key: "distributor",
    label: ROLES.distributor.short,
    buys: true,
    sells: true,
    blurb: "Buy from manufacturers, sell to contractors.",
  },
  supplier: {
    key: "supplier",
    label: "Manufacturer",
    buys: false,
    sells: true,
    blurb: "List products and quote incoming demand.",
  },
};

/** Switcher order: the order people usually read the chain from the jobsite. */
export const SWITCHER_ORDER = ["contractor", "distributor", "supplier"];

export const roleView = (role) => ROLE_VIEWS[role] ?? ROLE_VIEWS.contractor;

const CHAIN = ["supplier", "distributor", "contractor"];

/** Live supplier records carry no role yet; they are upstream manufacturers. */
export const partnerRoleOf = (partner) => (ROLES[partner?.partnerRole] ? partner.partnerRole : "supplier");

/** Where a partner sits relative to you: upstream sells to you, downstream buys. */
export function relationship(myRole, partnerRole) {
  const mine = CHAIN.indexOf(myRole);
  const theirs = CHAIN.indexOf(partnerRole);
  if (theirs < mine) return "supplier";
  if (theirs > mine) return "customer";
  return "peer";
}

export const RELATIONSHIP_LABEL = {
  supplier: "Sells to you",
  customer: "Buys from you",
  peer: "Same tier",
};

export const PARTNER_STATUS = {
  active: { label: "Active", tone: "success" },
  watch: { label: "Watch", tone: "warning" },
  "at-risk": { label: "At risk", tone: "danger" },
};
