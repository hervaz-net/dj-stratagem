// Real posts only. No fabricated customer stories, no invented metrics — see
// PROOF.md and the comment in About.jsx. Educational and product content is
// fair game; testimonials and usage numbers are not, until they're real.

export const posts = [
  {
    slug: "why-one-platform",
    title: "Why we built one platform instead of five tools",
    date: "2026-09-08",
    readMins: 4,
    category: "Product",
    excerpt:
      "PlanHub finds bids. Dodge surfaces leads. BuildingConnected sends invitations. Most contractors run all three, plus a CRM and a marketing agency, on top. Here's why we didn't build a sixth point tool.",
    body: [
      "Every construction software company solves one slice of the job. PlanHub and BuildingConnected help you find and respond to bid invitations. Dodge and ConstructConnect sell project intelligence and leads. None of them touch what happens after you win — the CRM work, the marketing that generated the lead in the first place, the estimating and invoicing on the awarded job.",
      "The result, for most contractors we've talked to, is five or six subscriptions that don't share a record. A bid gets tracked in one tool, retyped into a CRM by hand, and the marketing that brought the opportunity in lives in a completely separate system with its own login. Nothing connects to anything else, so nothing compounds.",
      "D&J Stratagem is a bet that the whole pipeline — discovery, bidding, marketing, CRM, and materials sourcing — is worth more connected than any one piece is alone. A bid you win should update the same customer record your marketing tools use. A supplier you source from on Supply Exchange should show up in the same dashboard as the bid it's tied to.",
      "That's a bigger, slower thing to build than a single-purpose bid finder. We think it's the right trade.",
    ],
  },
  {
    slug: "how-sealed-bidding-works",
    title: "How sealed, scored bidding works on Supply Exchange",
    date: "2026-08-22",
    readMins: 5,
    category: "Supply Exchange",
    excerpt:
      "Open reverse auctions push suppliers to undercut each other until the margin — and the good suppliers — disappear. Here's the alternative we built instead.",
    body: [
      "The default model for sourcing materials online is the reverse auction: post a request, suppliers see each other's prices, and the number keeps dropping until someone blinks. It looks like savings. In practice it trains your best suppliers to stop quoting you, because there's no margin left by the time the auction closes.",
      "Supply Exchange runs differently. Suppliers submit one sealed quote — they can't see competitors' numbers and can't revise once submitted. When the window closes (you set it: two hours or two days), every quote is scored on more than price: unit cost, fill rate, lead time, and past performance, weighted however you choose. The best total offer wins, not necessarily the cheapest line item.",
      "Two mechanics keep this from being just a slower auction. Awards can split by line item, so the supplier who's best on rebar and the supplier who's best on PVC both win a piece of the same RFQ instead of one supplier winning everything at a loss. And for materials you reorder every week, standing price books skip the bidding step entirely — the RFQ happens quarterly on the contract price, not on every purchase order.",
      "The goal isn't the lowest possible price on any single order. It's a supply chain where the good suppliers stay at the table.",
    ],
  },
  {
    slug: "what-soc-2-type-ii-covers",
    title: "What SOC 2 Type II actually covers (and what it doesn't)",
    date: "2026-08-05",
    readMins: 3,
    category: "Security",
    excerpt:
      "\"SOC 2 compliant\" gets used loosely. Here's specifically what our Type II report attests to, and why Type II is a meaningfully different claim than Type I.",
    body: [
      "SOC 2 is an auditing standard from the AICPA, not a single checkbox. A Type I report says a company's security controls were designed correctly as of one point in time. A Type II report — what D&J Stratagem holds — says an independent auditor observed those controls actually operating correctly over a period of months, not just that they existed on paper.",
      "In practice that covers things like: access to customer data is restricted and logged, changes to production systems go through review, data is encrypted in transit and at rest, and there's a real incident response process rather than an improvised one. The audit examines evidence — logs, tickets, configuration — not just policy documents.",
      "What it doesn't mean: SOC 2 isn't a guarantee against every possible breach, and it isn't the same scope as certifications like FedRAMP or ISO 27001, which cover different (often broader or government-specific) requirements. If your legal or security team wants the full report to review, ask — that's normal, and we'd rather you read it than take our word for it.",
    ],
  },
  {
    slug: "reading-a-bid-score",
    title: "Reading a bid score: price isn't the only number that matters",
    date: "2026-07-18",
    readMins: 4,
    category: "Product",
    excerpt:
      "The lowest bid isn't automatically the best one. Here's how scoring across price, schedule, and past performance actually changes who gets awarded work.",
    body: [
      "It's tempting to award to whoever quotes the lowest number. It's also how you end up with a change-order-heavy job, a missed schedule, or a sub who's clearly in over their head on this particular scope. A bid comparison that only shows price is a comparison that's hiding information you already have.",
      "When we score bids on the platform, price is one input among several — schedule fit, past performance on similar work, and completeness of the submission all factor in, weighted however the GC running the comparison decides matters for that job. A bid that's 8% higher but has a contractor with a clean track record on similar scope and a schedule that actually fits your sequencing can score higher than the cheapest number in the stack.",
      "None of this replaces judgment — you still make the award. What it does is put the tradeoff in front of you explicitly, instead of burying it in a spreadsheet where the price column is the only thing anyone actually reads.",
    ],
  },
];

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}
