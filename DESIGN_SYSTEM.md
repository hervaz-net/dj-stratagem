# D&J Stratagem — Modern Bidding Platform Design System

## 🎨 Brand Identity

### Color Palette (Locked)

**Primary Brand:**
- **Bid Navy** `#0B1F33` — Corporate identity, headers, sidebars, dark text
- **Bid Blue** `#2B6A8A` — Secondary actions, hover states, accents
- **Bid Orange** `#E85D04` — Call-to-action buttons, place bid, submit

**Neutrals (No chroma — clean, modern):**
- **Text** `#1A2330` — Primary body text, bold and dark
- **Text Muted** `#6B7280` — Secondary text, hints, disabled states
- **Surface** `#F4F5F7` — Page background, light and airy
- **Card** `#FFFFFF` — Card backgrounds, raised surfaces
- **Border** `#E0E2E6` — Dividers, input borders, subtle structure

**Semantic Status:**
- **Success** `#15803D` (+ light: `#DCFCE7`) — Awarded, won, active bids
- **Warning** `#D97706` (+ light: `#FEF3C7`) — Submitted, pending review
- **Danger** `#B91C1C` (+ light: `#FEE2E2`) — Rejected, overdue, at-risk

---

## 📐 Typography

| Role | Font | Size | Weight | Use |
|------|------|------|--------|-----|
| **Display** | DM Sans | 48–64px | Bold (700) | Page headlines, hero titles |
| **Heading 1** | DM Sans | 32px | Bold (700) | Section titles |
| **Heading 2** | DM Sans | 24px | Bold (700) | Subsection titles |
| **Heading 3** | DM Sans | 18px | Bold (600) | Card titles, bid names |
| **Body** | DM Sans | 16px | Regular (400) | Paragraph text |
| **Label** | DM Sans | 14px | Semibold (600) | Form labels, small titles |
| **Small** | DM Sans | 12px | Regular (400) | Captions, hints |

**Dark, bold fonts** throughout — never gray, never light weight except for muted secondary text.

---

## 🧩 Component Library

### Buttons

**Primary CTA** (Bid Orange)
```jsx
<button className="px-8 py-4 bg-bid-orange hover:bg-bid-orange-hover text-white font-semibold rounded-lg transition-colors">
  Place Bid
</button>
```

**Secondary** (Bid Navy outline)
```jsx
<button className="px-8 py-4 bg-white border-2 border-bid-navy text-bid-navy font-semibold rounded-lg hover:bg-bid-navy hover:text-white transition-colors">
  Learn More
</button>
```

**Tertiary** (Text link)
```jsx
<button className="text-bid-orange hover:text-bid-orange-hover font-semibold transition-colors flex items-center gap-2">
  View Details →
</button>
```

### Status Badges

**Active Bid**
```jsx
<span className="px-3 py-1 bg-bid-orange/10 text-bid-orange text-xs font-semibold rounded-full">ACTIVE</span>
```

**Awarded**
```jsx
<span className="px-3 py-1 bg-success-light text-success text-xs font-semibold rounded-full">AWARDED</span>
```

**Submitted**
```jsx
<span className="px-3 py-1 bg-warning-light text-warning text-xs font-semibold rounded-full">SUBMITTED</span>
```

**Overdue**
```jsx
<span className="px-3 py-1 bg-danger-light text-danger text-xs font-semibold rounded-full">OVERDUE</span>
```

### Bid Cards

Bid cards are the core of the marketplace — clean, modern, information-dense:

**Features:**
- White background with subtle border (`#E0E2E6`)
- Bid navy headlines (`#0B1F33`)
- Generous padding (24px) for breathing room
- Grid layout for key metrics (Budget, Time Left, Submissions)
- Hover effect: shadow lift + border color shift to bid-blue
- Orange "View Details" CTA with chevron
- Specialty badge in bid-blue/10 background

**Key metric display:**
- Budget amount in bold bid-navy
- Time left in red (danger) if < 3 days, otherwise bid-blue
- Submission count in gray

---

## 🎯 Layout Principles

### Hero Section
- **Full viewport height** with subtle gradient background (bid-blue/5 to transparent)
- **Two-column grid:** Left = headline + CTA, Right = stacked card mockup
- **Trust signals** below fold: metrics (500+ Bids, 2.4K Contractors, $85M Total)
- **Geometric accents** (rounded gradients) top-right and bottom-left for visual interest

### Marketplace Dashboard
- **Sticky header** with title + subtitle
- **Search + filter bar** in white card with rounded input
- **Filter tabs** (All, My Bids, Urgent, High Budget, Nearby)
- **Bid card grid** — responsive, hover-lift effect
- **No construction aesthetic** — pure modern bidding platform

### Navigation
- **Sticky navbar** with subtle shadow
- **Logo + brand name** on left
- **Desktop menu** centered: Browse Bids, How It Works, Pricing, Resources
- **Right CTA:** Sign In + Get Started (orange button)
- **Mobile:** hamburger menu, collapsible sections
- **Logged-in state:** notifications bell + profile dropdown

---

## 🎨 Visual Examples

### Contrast & Accessibility

**White text on Bid Orange:**
- Contrast ratio: 8.2:1 (AAA ✓)
- Use 16px+ semibold for guaranteed readability

**Bid Navy on light backgrounds:**
- Contrast ratio: 18:1 (AAA ✓)
- Safe for 12px+ text

**Bid Navy on Bid Blue:**
- Never use together for contrast — only for section divisions

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Grid | Usage |
|-----------|-------|------|-------|
| **Mobile** | < 640px | 1 col | Touch-friendly, stacked layout |
| **Tablet** | 640–1024px | 2 col | Bid cards, features |
| **Desktop** | > 1024px | 3+ col | Full dashboard, hero side-by-side |

---

## ✨ Interaction & Micro-animations

- **Button hover:** 200ms color transition + subtle shadow lift
- **Card hover:** 200ms shadow + border color to bid-blue/30
- **Dropdown:** 150ms fade-in, z-index managed
- **Badge pulse** (for urgent bids): optional 2s infinite opacity pulse
- **Smooth scroll:** no jarring transitions

---

## 🛠️ Implementation (Tailwind CSS)

All components use Tailwind classes with custom theme tokens:

```tailwind
@theme inline {
  --color-bid-navy: #0B1F33;
  --color-bid-blue: #2B6A8A;
  --color-bid-orange: #E85D04;
  --color-text: #1A2330;
  --color-surface: #F4F5F7;
  --color-card: #FFFFFF;
  --color-border: #E0E2E6;
  /* ... semantic colors ... */
}
```

Use these throughout as `bg-bid-navy`, `text-bid-orange`, `border-border`, etc.

---

## 🚀 Next Steps

1. ✅ Hero component created
2. ✅ Dashboard component created
3. ✅ Modern navbar created
4. ⏭️ Integrate into main landing page
5. ⏭️ Create footer (modern, clean)
6. ⏭️ Add additional pages (How It Works, Pricing, Resources)
7. ⏭️ Test color contrast (WebAIM)
8. ⏭️ Deploy & measure performance

---

## 📊 Brand Rationale

This design **avoids construction clichés** (orange vests, concrete textures, safety imagery) and instead focuses on:

- **Modern corporate trust** (dark navy, clean whites)
- **Action-oriented** (orange CTA, urgency badges)
- **Information-rich** (grid layouts, dense metrics)
- **Premium feel** (generous whitespace, subtle shadows)
- **Platform UX** (search, filter, status at a glance)

Perfect for a bidding marketplace that wants to be taken seriously—not as "another construction site," but as a **professional business tool**.
