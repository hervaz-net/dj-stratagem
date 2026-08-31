# Proof and claims policy

The marketing site must not carry invented proof. This file records what was
removed, why, and the bar a claim has to clear before it goes on the site.

## The rule

**Every customer-facing claim must be true and substantiable at the moment it
is published.** Not aspirational, not illustrative-but-unlabelled, not "we'll
have these numbers soon."

This is not only a credibility question. In the US, testimonials and
endorsements are regulated by the FTC (16 CFR Part 255); fabricated
endorsements and unsubstantiated performance claims create real liability. And
naming another company as a customer when they are not can expose you to
trademark and unfair-competition claims from that company.

## What was removed (2026-08-07)

| Where | What | Why |
|---|---|---|
| `Home.jsx` | "Trusted by construction teams at" — Granite, Turner, PCL, McCarthy, Swinerton, Hensel Phelps | **Most serious.** Named real, identifiable companies as customers. None are customers. |
| `Home.jsx` | 3 testimonials — "Marcus D.", "Lisa T.", "James R." | Invented endorsements, one claiming a "30% win rate" increase. |
| `Pricing.jsx` | 3 testimonials — "Tony K.", "Sandra L.", "Derek O." | Invented endorsements with specific dollar claims ("$680k contract", "$34k saved"). |
| `About.jsx` | "2,400+ Contractors", "$2B+ Bids managed", "4.8★ Avg. rating" | Invented usage metrics. |
| `About.jsx` | 8 named team members | Invented people with invented roles. |
| `About.jsx` | 4 open job postings | Invented openings; an "Apply →" affordance that went nowhere. |
| `Solutions.jsx` | 3 case studies under the heading "Real results from real contractors" | Invented companies, cities, and metrics presented explicitly as real. |

Replaced with honest pre-launch framing: *"Built for contractors. Currently
onboarding early users."*

## The bar for putting something back

**Usage metrics** (contractors, bids managed, projects matched) — must come
from a query you can re-run against production. Record the date and restate it
on the page ("as of March 2027"). Round down, never up.

**Testimonials** — need a named real person at a named real company who has
given written permission to be quoted. Keep the permission on file. If they
want to be anonymous, "General contractor, Los Angeles" is fine; an invented
name is not.

**Customer logos** — written permission from that company. A signed order form
is not permission to use a logo.

**Case studies** — a real engagement, with metrics the customer has confirmed
and approved for publication.

**Performance claims** ("win rate up 30%") — need a documented measurement
methodology, not a single anecdote. If it is one customer's result, say so and
say it is not typical.

## Sample product data is fine, when labelled

`OpportunityPreview.jsx` shows representative project rows. That is a product
mockup, not a customer claim, and it carries a visible "Sample view" label.
Keep that label as long as the data is illustrative. The same applies to the
dashboard mockups in `WalkthroughModal.jsx`.

The line: **showing what the product does** is fine. **Claiming someone
used it and got a result** requires proof.

### Sample project listings carry a higher duty

`src/data/sampleProjects.js` feeds `/projects`, the project detail pages, and
the trade/location landing pages. These are illustrative, not a live feed.

This matters more than a mockup on a marketing page. A contractor who mistakes
a sample listing for a real solicitation loses real hours — chasing a bid,
pulling a team onto an estimate, calling an owner who never posted the work.
So every surface that renders this data shows `PreviewNotice`: a full-width
banner stating plainly that the listings are not live solicitations and cannot
be bid on.

Rules while the feed is illustrative:

- Never remove `PreviewNotice` from a page rendering `sampleProjects`.
- Never present a sample listing as biddable — no live countdowns implying a
  real deadline, no downloadable "plans" that do not exist.
- Owner and GC names must stay clearly generic or explicitly marked sample.
  Do not name a real GC as the contractor on an invented project.

When the real feed lands, replace the module with the API client and drop
`PreviewNotice` from the pages backed by live data — not before.

## Also removed: the phantom blog (2026-08-13)

`Home.jsx` carried a "From the blog" section advertising three articles with
titles, excerpts, publication dates, and read times. None were written, and
the cards were not even clickable. A teaser for content that does not exist is
a broken promise in the same family as invented proof, so it came down.

Put it back when there are posts. It needs real articles at real URLs — not
cards that link to `/changelog`, which is a changelog, not a blog.

## Still outstanding

- Starter stays free. Paid tiers are request-access only until billing
  actually exists. Do not put “free trial / no credit card” back on Pricing
  or Home unless a real trial is wired.
- Document pages (`privacy.html`, `terms.html`, brand/fleet/receipts/signage)
  now use the system UI stack and in-repo SVG marks. Do not put
  `fonts.googleapis.com` or missing `uploads/*.png` paths back.
