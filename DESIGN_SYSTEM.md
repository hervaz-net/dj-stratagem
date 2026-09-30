# Stratagem Exchange: design system

**Stratagem Exchange** is the B2B marketplace product of **D&J Stratagem, Inc.**
It connects three sides of the construction supply chain:

```
Manufacturers & vendors  ──sell to──▶  Distributors  ──sell to──▶  Contractors
        └──────────────── also sell direct to ───────────────────────▲
```

- **Supply** is catalog listings, stock, and price sheets from manufacturers and distributors.
- **Demand** is requests for quote (RFQs) that contractors and distributors post, often tied to a project.
- A **quote** answers a request, an **order** (PO) is an accepted quote, and fulfillment is tracked through delivery.

Names, contact details, and role definitions live in `src/brand.js`. Site
navigation lives in `src/navigation.js`. Import from both instead of
hard-coding strings.

## Direction: modern marketplace

The look is bright and friendly, like a B2B Faire or Shopify, in a trade setting:

- Generous white space and a warm off-white canvas, with white cards on top.
- Rounded corners: `rounded-2xl` for cards, `rounded-full` for buttons and pills, `rounded-xl` for inputs and small tiles.
- One deep green brand color for primary actions. Warm amber is the highlight, used sparingly.
- Soft shadows (`shadow-[var(--shadow-card)]`, with `--shadow-pop` for menus and hover). No glows, glass, grid backgrounds, or animated blobs.
- Content-first imagery. There are no photos, so use category tiles, product and listing cards, simple inline SVG diagrams, and realistic UI mockups built from components.
- Motion stays short (≤200 ms) and functional. `Reveal` is fine. Nothing loops except status dots.

## Tokens (Tailwind classes)

Every color is a CSS variable with light and dark values (`src/index.css`).
**Never hard-code hex values in components**, or dark mode breaks.

| Purpose | Class |
|---|---|
| Page background | `bg-canvas` |
| Card / raised surface | `bg-surface` |
| Tinted band, hover, table header | `bg-subtle` |
| Borders and dividers | `border-line` (`border-line-strong` on hover) |
| Primary text | `text-fg` |
| Secondary text | `text-fg-muted` |
| Primary action, links, active state | `bg-brand` / `text-brand`, `hover:bg-brand-hover` |
| Brand tint (selected chip, icon tile) | `bg-brand-soft text-brand-fg` |
| Highlight (new, featured, sample) | `text-accent`, `bg-accent-soft` |
| Role colors | `role-supplier`, `role-distributor`, `role-contractor` (+ `-soft`) |
| Status | `success`, `warning`, `danger` (+ `-soft`) |
| Always-dark band (CTA) | `bg-bid-navy` with `text-white` |

Legacy class names (`ink`, `paper`, `steel`, `amber`, `cta`, `bid-*`) are
aliases kept only so unmigrated code renders. Don't use them in new code.

**Role colors are fixed across the whole product.** Supplier is green,
distributor is blue, contractor is orange. Use `<RoleBadge role="…" />`
whenever a role is named in UI.

## Type

System font stack (Inter if installed). **Don't load web fonts from Google**:
it exposes visitor IPs before cookie consent. The base size is 16px.

| Role | Classes |
|---|---|
| Home hero | `text-4xl md:text-6xl font-bold tracking-tight` |
| Page hero (use `PageHero`) | `text-4xl md:text-5xl font-bold` |
| Section title (use `SectionHeading`) | `text-3xl md:text-4xl font-bold` |
| Card title | `text-lg font-semibold` |
| Body / lede | `text-base` / `text-lg text-fg-muted` |
| Meta, labels | `text-sm` / `text-xs font-semibold` |
| Prices and quantities | `tabular-nums`, `font-mono` for SKUs only |

## Components (`src/components/`)

| Component | Use |
|---|---|
| `Section`, `SectionHeading`, `Eyebrow` | Every marketing section. `tone="subtle"` for alternating bands. |
| `PageHero` | Top of every interior marketing page. |
| `Button` | Variants `primary`, `secondary`, `ghost`, `soft`. Sizes `sm`, `md`, `lg`. Pass `to` for internal links. |
| `FeatureCard` | Icon, title, and text card. `tone` = `brand` or a role key. |
| `RoleBadge` | Colored role pill. |
| `SampleLabel` | **Required** on any illustrative listing, price, metric, or mockup. |
| `PreviewNotice` | Full-width notice for pages whose main content is sample listings. |
| `CTASection` | Closing band. Override the copy per page. |
| `Accordion`, `Reveal`, `StatCounter`, `icons.jsx` | Existing helpers, still valid. |
| `Logo` / `LogoMark` | Brand mark. `byline` adds "by D&J Stratagem". |

Dashboard components live in `src/components/dashboard/`. The dashboard uses
`DashboardLayout`, and a user's marketplace role comes from `useRole()`
(`src/contexts/RoleContext.jsx`).

## Voice

- Plain, specific, and trade-literate: "rebar", "conduit", "price sheet", "lead time", "will-call", "net-30". Avoid "synergy" and "revolutionize".
- Speak to each side about its own problem. Contractors care about getting the right material to the jobsite on time at a fair price. Distributors care about filling orders, moving inventory, and finding new accounts. Manufacturers care about reaching distributors and contractors without adding sales reps.
- Sentence-case headings. Keep buttons to two or three words ("Post a request", "List products", "Join free").

## Honesty rules (see PROOF.md: these are not optional)

- No invented customers, logos, testimonials, usage numbers, or performance claims. The product is **onboarding early users**.
- Sample listings, prices, suppliers, and metrics are fine **only** with a visible `SampleLabel` or `PreviewNotice`. Sample company names must be obviously fictional and never real brands.
- Don't claim integrations, payments, escrow, financing, insurance, delivery networks, or verification that don't exist. Describe what the product helps you do, not guarantees.
- Don't invent prices or fees on the pricing page beyond what's already published there.
- If a form doesn't send anywhere yet, say so (see the footer newsletter).

## Accessibility

- Text meets WCAG AA contrast in both themes (the tokens already do; don't put `text-fg-muted` on `bg-subtle` for small text).
- Every interactive element is a real `<button>` or `<a>`/`Link`, is keyboard reachable, and has a visible focus ring (global).
- Icons are `aria-hidden`, and icon-only buttons need an `aria-label`.
- Layouts work from 360px wide up. Tables scroll inside `overflow-x-auto`.
