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

## Sample product data (2026-09-14: disclaimer labels removed)

`OpportunityPreview.jsx`, `HeroPanel.jsx`, the Fleet board, the Catalog, and
the project listing pages (`sampleProjects.js` — `/projects`, project detail,
trade/location pages) all show illustrative product mockups. Through
2026-09-14 these carried visible labels: a "Sample view" chip on the two hero
panels, a "Preview — sample X" banner (`PreviewNotice.jsx`) on Catalog,
Fleet, Projects, ProjectDetail, and TradeLocation, and a "Sample data" strip
on the Overview/Suppliers dashboards.

The owner explicitly asked for these removed, was shown this section's
original warning about the project-listing pages specifically (a contractor
mistaking a sample listing for a real solicitation loses real hours chasing
a bid that does not exist), and confirmed removal anyway. `PreviewNotice.jsx`
was deleted; the "Sample view" and "Sample data" labels were removed from
their components. A single small line was added to `Footer.jsx` instead:
"Product data shown throughout this site — projects, bids, pricing, and
catalog items — is illustrative." That is the only remaining disclosure.

Rules that still apply regardless of labelling:

- Never present a sample listing as biddable — no live countdowns implying a
  real deadline, no downloadable "plans" that do not exist.
- Owner and GC names must stay clearly generic or explicitly marked sample.
  Do not name a real GC as the contractor on an invented project.
- This is still not a customer claim or a testimonial — the line above ("showing
  what the product does" is fine, "claiming someone used it and got a result"
  requires proof) is unchanged and unaffected by this section.

When the real feed lands, replace `sampleProjects.js` with the API client.

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
