// Help-center content for /resources.
//
// Every answer here is checked against the live pages and data it describes
// (Pricing, Platform, Supply, Projects, Register, ForgotPassword, VerifyEmail,
// the Exchange app, companies.js) and against PROOF.md. D&J Stratagem is
// pre-launch and onboarding early users, so anything not documented elsewhere
// is hedged ("contact us") rather than promised. No customers, usage numbers,
// SLAs, certifications, or payment/financing/delivery promises belong here.
// Link only routes served by src/App.jsx or src/exchange/App.jsx (Exchange
// routes live under /exchange and need a full page load).

export const FAQ_CATEGORIES = [
  "Getting started",
  "Bidding & projects",
  "Supply & Exchange",
  "Accounts & security",
  "Billing",
];

// `keywords` are extra search terms (synonyms) matched but never displayed.
export const faqs = [
  // ---- Getting started ----
  {
    id: "what-is-it",
    category: "Getting started",
    q: "What is D&J Stratagem?",
    a: "A Los Angeles company building one place where contractors, subs, and suppliers find work, bid it, market themselves, and source materials. The platform is six connected suites, and it is built for general contractors, subcontractors, and suppliers.",
    keywords: "platform overview who for gc sub supplier solutions",
    link: { to: "/platform", label: "See the platform" },
  },
  {
    id: "is-it-live",
    category: "Getting started",
    q: "Is the platform live yet?",
    a: "We are pre-launch and onboarding early users, and some pages show sample data while that happens. If you need to know whether a specific feature is open to your account today, ask us and we will tell you plainly.",
    keywords: "launch available early access beta sample",
    link: { to: "/contact?topic=demo", label: "Ask for a walkthrough" },
  },
  {
    id: "get-started",
    category: "Getting started",
    q: "How do I get started?",
    a: "Request access with your name, company, and work email. Our team approves accounts before first sign-in and emails you once yours is approved.",
    keywords: "sign up register create account request access join approval",
    link: { to: "/register", label: "Request access" },
  },

  // ---- Bidding & projects ----
  {
    id: "sample-projects",
    category: "Bidding & projects",
    q: "Can I bid on the projects listed on the Projects page?",
    a: "No. Those listings are illustrative samples, not live solicitations, and they cannot be bid or quoted. A real project feed opens as members come on board.",
    keywords: "sample listings fake real solicitation opportunities",
    link: { to: "/projects", label: "See the sample projects" },
  },
  {
    id: "starter-bids",
    category: "Bidding & projects",
    q: "How many bids can I submit on the free plan?",
    a: "Starter includes up to 3 bids per month. Professional and above include unlimited bids and project postings.",
    keywords: "starter limit cap monthly plan free",
    link: { to: "/pricing", label: "Compare plans" },
  },
  {
    id: "compare-and-post",
    category: "Bidding & projects",
    q: "Can I post a project and compare the bids?",
    a: "Yes, on Professional and above. Publish a project, build your sub list, compare bids side by side, and keep RFIs, addenda, and deadlines in the same place through to the award.",
    keywords: "post project invite subs rfi addenda award general contractor gc",
    link: { to: "/platform#for-general-contractors", label: "How bidding works" },
  },
  {
    id: "license-insurance",
    category: "Bidding & projects",
    q: "How are licenses and insurance handled?",
    a: "License and insurance verification is part of the subcontractor side of the platform, including Starter. What we check can depend on your trade and state, so ask us before you rely on it.",
    keywords: "verification verify credentials vetting profile",
    link: { to: "/platform#for-subcontractors", label: "For subcontractors" },
  },

  // ---- Supply & Exchange ----
  {
    id: "what-is-supply",
    category: "Supply & Exchange",
    q: "How does sealed, scored quoting work on Supply Exchange?",
    a: "Suppliers send one sealed quote and cannot see competitors' numbers or re-bid. Quotes are scored on price plus lead time, fill rate, delivery, and past performance, weighted the way the buyer sets them, and awards can be split by line item.",
    keywords: "rfq auction bidding materials weights award split",
    link: { to: "/supply", label: "Read how it works" },
  },
  {
    id: "exchange-vs-supply",
    category: "Supply & Exchange",
    q: "What is the difference between Supply Exchange and Stratagem Exchange?",
    a: "Supply Exchange is the materials-sourcing suite described on this site. Stratagem Exchange is a sister company's separate marketplace at /exchange, with its own listings, requests, and quotes.",
    keywords: "marketplace companies sister separate app stratagem",
    link: { to: "/exchange", label: "Open Stratagem Exchange" },
  },
  {
    id: "exchange-listings",
    category: "Supply & Exchange",
    q: "Are the listings on the Exchange marketplace real?",
    a: "Not yet. Stratagem Exchange is onboarding early members, and the listings, prices, and requests shown today are labelled samples. Real listings open as members come on board.",
    keywords: "sample marketplace catalog prices products",
    link: { to: "/exchange/marketplace", label: "Browse the marketplace" },
  },
  {
    id: "supplier-join",
    category: "Supply & Exchange",
    q: "I'm a supplier or distributor. How do I get in?",
    a: "Supplier access is part of early onboarding. Tell us your product categories and service area and we will say what is open, or request an Exchange account directly.",
    keywords: "manufacturer vendor distributor sell quote catalog onboarding",
    link: { to: "/contact?topic=partnership", label: "Talk to us about supplying" },
  },

  // ---- Accounts & security ----
  {
    id: "account-review",
    category: "Accounts & security",
    q: "Why isn't my new account active yet?",
    a: "New accounts stay pending until someone on our team approves them, and there is no automated verification email. If you have heard nothing after a business day, check spam, then write to us from the address you signed up with.",
    keywords: "pending approval verify email waiting login sign in",
    link: { to: "/contact?topic=support", label: "Contact support" },
  },
  {
    id: "reset-password",
    category: "Accounts & security",
    q: "How do I reset my password?",
    a: "Self-serve reset is not live yet. Email hello@djstratageminc.com from the address on the account and we will reset it by hand.",
    keywords: "forgot lost locked out change login",
    link: { to: "/forgot-password", label: "Password help" },
  },
  {
    id: "password-rules",
    category: "Accounts & security",
    q: "What are the password requirements?",
    a: "Use at least 12 characters. The form rejects a password that contains your email address or matches your company name. Length matters more than symbols.",
    keywords: "minimum length characters strength rules register",
    link: { to: "/register", label: "Request access" },
  },
  {
    id: "delete-account",
    category: "Accounts & security",
    q: "How do I delete my account?",
    a: "Contact support and tell us which account to remove.",
    keywords: "remove close cancel data erase",
    link: { to: "/contact?topic=support", label: "Contact support" },
  },
  {
    id: "data-handling",
    category: "Accounts & security",
    q: "How is my data handled?",
    a: "The Privacy Policy covers this site, Stratagem Exchange, and the other Stratagem services. If your team needs more detail for a vendor review, ask and we will send what we can.",
    keywords: "privacy policy terms information collect security legal",
    link: { to: "/privacy", label: "Privacy Policy" },
  },

  // ---- Billing ----
  {
    id: "starter-free",
    category: "Billing",
    q: "Is Starter really free?",
    a: "Yes. Starter is the free plan: company profile, matching, and up to 3 bids a month. There is no trial that converts to a charge, and the paid tiers are a separate request.",
    keywords: "free trial cost price credit card",
    link: { to: "/pricing", label: "See pricing" },
  },
  {
    id: "paid-plans",
    category: "Billing",
    q: "How do I get a paid plan?",
    a: "Professional and Growth are request-access at introductory pricing, and Enterprise is custom. The Pricing page lists current plan rates and the annual-billing discount. Ask us how billing works for your account.",
    keywords: "professional growth enterprise upgrade annual discount monthly subscription",
    link: { to: "/contact", label: "Request access" },
  },
  {
    id: "per-bid-fees",
    category: "Billing",
    q: "Do you charge per bid or take a cut of awards?",
    a: "No. Subscription plans are flat. Add-ons such as pay-per-lead and featured listings are priced separately and are always opt-in.",
    keywords: "fees commission percentage add-ons leads",
    link: { to: "/pricing", label: "View add-ons" },
  },
  {
    id: "payments",
    category: "Billing",
    q: "Do you handle payments, escrow, or financing?",
    a: "Not on Stratagem Exchange: it does not process payments, hold funds, or extend credit, and buyers and sellers agree terms between themselves. Stratagem Capital is still in development and does not offer credit, loans, or bonds today.",
    keywords: "escrow pay invoice credit loans capital terms net-30 delivery",
    link: { to: "/exchange", label: "About Stratagem Exchange" },
  },
];

export const quickLinks = [
  { to: "/platform", title: "Platform", text: "Bidding, trade tools, marketing, sourcing, and AI." },
  { to: "/supply", title: "Supply Exchange", text: "Sealed, scored quoting for materials." },
  { to: "/projects", title: "Projects", text: "Sample project cards by trade and city." },
  { to: "/pricing", title: "Pricing", text: "Starter, Professional, Growth, Enterprise." },
  { to: "/changelog", title: "Changelog", text: "What shipped, and when." },
  { to: "/exchange/marketplace", title: "Exchange marketplace", text: "Sample listings on Stratagem Exchange.", reload: true },
];

// Searches worth suggesting; each should return at least one answer.
export const POPULAR_SEARCHES = ["password", "approval", "sample", "Exchange", "free"];

export const supportRoutes = [
  { to: "/contact?topic=support", title: "Product support", text: "Something not working, or a question about your account." },
  { to: "/contact?topic=demo", title: "Book a demo", text: "A walkthrough scheduled around your team." },
  { to: "/contact?topic=partnership", title: "Partnerships", text: "Suppliers, integrations, and industry groups." },
];
