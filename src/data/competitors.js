/**
 * How the construction supply chain trades today, without a marketplace.
 * Rendered on Home and About. These are ways of working, not named
 * companies: we don't compare ourselves against other products by name.
 */
export const statusQuo = [
  {
    name: "Calling around",
    does: "A buyer phones three counters for one price, then waits on callbacks.",
    instead: "Post one request and let sellers who carry the item quote it.",
  },
  {
    name: "Spreadsheets and PDFs",
    does: "Price sheets go stale in inboxes and nobody knows which one is current.",
    instead: "Sellers keep catalog pricing in one place buyers can see.",
  },
  {
    name: "Rep-driven ordering",
    does: "Reaching a new account means another rep, another territory, another trip.",
    instead: "Buyers in your service area can find your lines and send requests.",
  },
  {
    name: "Chasing deliveries",
    does: "Where the material is lives in someone's text thread.",
    instead: "Orders carry a status both sides can check.",
  },
];

/** @deprecated Kept so older imports keep working. */
export const competitors = statusQuo;
