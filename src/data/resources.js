// Help-center content. Everything here is generic and mirrors how the rest
// of the site describes the product. D&J Stratagem is pre-launch and
// onboarding early users, so anything not documented elsewhere in the repo
// is hedged ("early access", "contact us for details") rather than promised.
// No customer names, usage numbers, SLAs, or certifications belong here.

export const FAQ_CATEGORIES = [
  "Getting started",
  "Bidding",
  "Supply & quotes",
  "Accounts & security",
  "Billing",
];

export const faqs = [
  // ---- Getting started ----
  {
    id: "what-is-it",
    category: "Getting started",
    q: "What is D&J Stratagem?",
    a: "A construction growth platform that puts bidding, project matching, marketing, CRM, estimating, and materials sourcing (Supply Exchange) in one place, instead of in five or six separate tools. The Platform page walks through each piece.",
    link: { to: "/platform", label: "See the platform" },
  },
  {
    id: "who-for",
    category: "Getting started",
    q: "Who is it built for?",
    a: "General contractors who post projects and compare bids, subcontractors who want to find and win work, and suppliers who quote materials into Supply Exchange. The Solutions page lays out the workflow for each.",
    link: { to: "/solutions", label: "Browse solutions" },
  },
  {
    id: "launched",
    category: "Getting started",
    q: "Is the platform live?",
    a: "We are pre-launch and onboarding early users, so some areas are in early access. If you need to know whether a specific capability is available to you today, ask us and we will tell you plainly.",
    link: { to: "/contact?topic=demo", label: "Ask for a walkthrough" },
  },
  {
    id: "get-started",
    category: "Getting started",
    q: "How do I get started?",
    a: "Request access by creating an account, or start with a demo if you would like a walkthrough first. New accounts are reviewed by our team before first sign-in, and we email you once yours is approved.",
    link: { to: "/register", label: "Request access" },
  },
  {
    id: "find-projects",
    category: "Getting started",
    q: "How do I find projects to bid on?",
    a: "Open the Projects page to browse bid opportunities and filter by trade, city, and project value. Once your account is approved, your company profile is used to match you to relevant work.",
    link: { to: "/projects", label: "Browse projects" },
  },

  // ---- Bidding ----
  {
    id: "starter-bids",
    category: "Bidding",
    q: "How many bids can I submit on the free plan?",
    a: "The Starter plan includes up to 3 bids per month. Professional and above include unlimited bids and project postings.",
    link: { to: "/pricing", label: "Compare plans" },
  },
  {
    id: "compare-bids",
    category: "Bidding",
    q: "How are bids compared and awarded?",
    a: "A bid comparison puts submissions side by side, and price is only one input. Schedule fit, past performance, and completeness of the submission can be weighted by the contractor running the comparison. You still make the award; the scoring just makes the tradeoffs visible.",
    link: { to: "/blog/reading-a-bid-score", label: "Read: reading a bid score" },
  },
  {
    id: "post-project",
    category: "Bidding",
    q: "Can I post my own project and invite subs?",
    a: "Yes, on Professional and above. You can publish a project, build a sub list, and keep RFIs, addenda, and deadlines in one place through to the award.",
    link: { to: "/platform", label: "How bidding works" },
  },
  {
    id: "license-insurance",
    category: "Bidding",
    q: "How are licenses and insurance handled?",
    a: "License and insurance information is collected as part of account review and your company profile, so people reviewing your bid can see it. Ask us if you need to know exactly what is checked for your trade or state.",
    link: { to: "/about#vetting", label: "How accounts are vetted" },
  },

  // ---- Supply & quotes ----
  {
    id: "request-quote",
    category: "Supply & quotes",
    q: "How do I request a quote for materials?",
    a: "Browse the catalog, set a quantity on any item, then open your quote to review it, add project details, and send it to our team. It is a request for a quote, not an order; we reply with confirmed pricing and availability, normally within one business day.",
    link: { to: "/supply/catalog", label: "Open the catalog" },
  },
  {
    id: "quote-order",
    category: "Supply & quotes",
    q: "Does sending a quote request buy anything?",
    a: "No. Nothing is ordered or charged when you send a quote request. Prices shown in the catalog are for estimating and are confirmed in our reply.",
    link: { to: "/quote", label: "View your quote" },
  },
  {
    id: "quote-saved",
    category: "Supply & quotes",
    q: "Where is my quote kept while I build it?",
    a: "Your selections are saved on the device and browser you are using, so they will not follow you to another computer. You can download the quote as a CSV or print it before sending.",
    link: { to: "/quote", label: "Go to your quote" },
  },
  {
    id: "sealed-bidding",
    category: "Supply & quotes",
    q: "How does sealed, scored bidding work on Supply Exchange?",
    a: "Suppliers submit one sealed quote and cannot see competitors' numbers or revise it. When the window closes, quotes are scored on price plus factors such as lead time, fill rate, delivery, and past performance, weighted the way the buyer chooses. Awards can also be split by line item.",
    link: { to: "/blog/how-sealed-bidding-works", label: "Read the explainer" },
  },
  {
    id: "supplier-quote",
    category: "Supply & quotes",
    q: "I'm a supplier. How do I quote into Supply Exchange?",
    a: "Supplier access is part of early onboarding. Contact us with your product categories and service area and we will walk you through how sealed RFQs, floor pricing per SKU, and standing price books work.",
    link: { to: "/contact?topic=partnership", label: "Talk to us about supplying" },
  },

  // ---- Accounts & security ----
  {
    id: "account-review",
    category: "Accounts & security",
    q: "Why isn't my new account active right away?",
    a: "Every new account is reviewed by our team before it can post a project, submit a bid, or quote into Supply Exchange. We email you when yours is approved. If you have waited more than a business day, check spam, then write to us from the address you signed up with.",
    link: { to: "/contact?topic=support", label: "Contact support" },
  },
  {
    id: "reset-password",
    category: "Accounts & security",
    q: "How do I reset my password?",
    a: "Self-serve password reset is not live yet. Email hello@djstratageminc.com from the address on the account and we will reset it by hand.",
    link: { to: "/forgot-password", label: "Password help" },
  },
  {
    id: "data-handling",
    category: "Accounts & security",
    q: "How is my data handled?",
    a: "The Privacy Policy describes what we collect and how it is used, and we only use contact details to follow up on your request. If your security or legal team needs more detail, ask and we will send what we can.",
    link: { to: "/privacy", label: "Privacy Policy" },
  },

  // ---- Billing ----
  {
    id: "plans",
    category: "Billing",
    q: "What plans are available?",
    a: "Starter (free), Professional, Growth, and Enterprise, plus optional add-ons. Enterprise starts with a conversation rather than a self-serve checkout.",
    link: { to: "/pricing", label: "See pricing" },
  },
  {
    id: "free-trial",
    category: "Billing",
    q: "Is there a free trial?",
    a: "Not yet. Starter is the free plan. Paid features start after we approve an account and you choose a paid plan, and there is no card-on-file trial that auto-converts.",
    link: { to: "/pricing", label: "Plan details" },
  },
  {
    id: "annual",
    category: "Billing",
    q: "How does annual billing work?",
    a: "Annual plans are paid up front and priced at 20% less than paying month to month. You can switch the toggle on the Pricing page to see the monthly equivalent.",
    link: { to: "/pricing", label: "Toggle annual pricing" },
  },
  {
    id: "per-bid-fees",
    category: "Billing",
    q: "Do you take a cut of awards or charge per bid?",
    a: "No. Subscription plans are flat. Optional add-ons such as pay-per-lead and featured listings are priced separately and are always opt-in.",
    link: { to: "/pricing#addons", label: "View add-ons" },
  },
];

// Real posts from src/data/blogPosts.js. Slugs must match; descriptions here
// are help-center framing, not new claims.
export const guides = [
  {
    slug: "why-one-platform",
    tag: "Start here",
    title: "Why we built one platform instead of five tools",
    blurb: "The idea behind the product, and what connecting discovery, bidding, CRM, and sourcing is meant to fix.",
  },
  {
    slug: "reading-a-bid-score",
    tag: "Bidding",
    title: "Reading a bid score: price isn't the only number that matters",
    blurb: "How scoring across price, schedule, and past performance changes how you compare bids.",
  },
  {
    slug: "how-sealed-bidding-works",
    tag: "Supply & quotes",
    title: "How sealed, scored bidding works on Supply Exchange",
    blurb: "Sealed quotes, scored awards, split awards by line item, and standing price books, explained.",
  },
  {
    slug: "what-soc-2-type-ii-covers",
    tag: "Security",
    title: "What SOC 2 Type II actually covers (and what it doesn't)",
    blurb: "A plain-language explainer on what a SOC 2 Type II report is and what it does not promise.",
  },
];

export const quickLinks = [
  { to: "/supply/catalog", title: "Catalog", text: "Browse materials and build a quote." },
  { to: "/quote", title: "Your quote", text: "Review, download, or send your request." },
  { to: "/projects", title: "Projects", text: "Browse bid opportunities by trade and city." },
  { to: "/pricing", title: "Pricing", text: "Plans, add-ons, and the ROI calculator." },
  { to: "/changelog", title: "Changelog", text: "What shipped, and when." },
  { to: "/platform", title: "Platform", text: "Bidding, marketing, CRM, and AI in one place." },
];

export const supportRoutes = [
  { topic: "support", title: "Product support", text: "Something not working, or an account question." },
  { topic: "demo", title: "Book a demo", text: "A walkthrough scheduled around your team." },
  { topic: "partnership", title: "Partnerships", text: "Suppliers, integrations, and industry groups." },
];
