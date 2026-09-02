import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import {
  IconTruck,
  IconClock,
  IconCheck,
  IconArrowRight,
  IconUsers,
  IconPackage,
} from "../components/icons";

// Sample service dates stay relative to today so the preview board
// never shows a next-scheduled date that already passed.
function isoDaysFromToday(days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Sample fleet data for the public preview board.
const FLEET_DATA = [
  {
    id: "FL-001",
    name: "Concrete Mixer",
    type: "Equipment",
    status: "in-use",
    location: "Los Angeles, CA",
    utilization: 89,
    lastMaintenance: isoDaysFromToday(-63),
    nextScheduled: isoDaysFromToday(13),
    operator: "Assigned crew",
    capacity: "3 cubic yards",
    hourlyRate: "$125",
  },
  {
    id: "FL-002",
    name: "Excavator 320",
    type: "Heavy Equipment",
    status: "in-use",
    location: "Orange County, CA",
    utilization: 76,
    lastMaintenance: isoDaysFromToday(-74),
    nextScheduled: isoDaysFromToday(29),
    operator: "Assigned crew",
    capacity: "20 ton",
    hourlyRate: "$450",
  },
  {
    id: "FL-003",
    name: "Dump Truck",
    type: "Vehicle",
    status: "available",
    location: "San Diego, CA",
    utilization: 42,
    lastMaintenance: isoDaysFromToday(-59),
    nextScheduled: isoDaysFromToday(40),
    operator: "Available",
    capacity: "15 ton",
    hourlyRate: "$85",
  },
  {
    id: "FL-004",
    name: "Scaffolding Kit",
    type: "Equipment",
    status: "maintenance",
    location: "Riverside, CA",
    utilization: 0,
    lastMaintenance: isoDaysFromToday(-25),
    nextScheduled: isoDaysFromToday(20),
    operator: "Shop tech",
    capacity: "3000 sq ft",
    hourlyRate: "$200",
  },
  {
    id: "FL-005",
    name: "Power Generator",
    type: "Equipment",
    status: "available",
    location: "Ventura, CA",
    utilization: 55,
    lastMaintenance: isoDaysFromToday(-79),
    nextScheduled: isoDaysFromToday(18),
    operator: "Available",
    capacity: "500 kW",
    hourlyRate: "$350",
  },
  {
    id: "FL-006",
    name: "Bucket Truck",
    type: "Vehicle",
    status: "in-use",
    location: "Long Beach, CA",
    utilization: 92,
    lastMaintenance: isoDaysFromToday(-62),
    nextScheduled: isoDaysFromToday(21),
    operator: "Assigned crew",
    capacity: "65 ft reach",
    hourlyRate: "$200",
  },
];

const STATS = [
  { label: "Sample assets on this page", value: "6", icon: IconTruck },
  { label: "Avg. sample utilization", value: "59%", icon: IconPackage },
  { label: "Available in the sample", value: "2", icon: IconCheck },
  { label: "In maintenance (sample)", value: "1", icon: IconClock },
];

export default function Fleet() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("utilization");
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (!selectedAsset) return undefined;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("fleet-asset-close")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedAsset(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [selectedAsset]);

  const filteredFleet = useMemo(() => {
    // Copy first. Sorting the module-level FLEET_DATA array in place
    // permanently reorders the source list after the first render.
    let result = [...FLEET_DATA];

    if (filterStatus !== "all") {
      result = result.filter((item) => item.status === filterStatus);
    }

    result.sort((a, b) => {
      if (sortBy === "utilization") {
        return b.utilization - a.utilization;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return result;
  }, [filterStatus, sortBy]);

  const getStatusColor = (status) => {
    // Use design tokens, not Tailwind default greens/oranges. Those 700
    // text colors disappear against the dark theme ink surfaces.
    switch (status) {
      case "in-use":
        return "bg-success/10 text-success border-success/30";
      case "available":
        return "bg-amber/10 text-amber border-amber/30";
      case "maintenance":
        return "bg-warning/10 text-warning border-warning/30";
      default:
        return "bg-ink-3 text-steel border-line";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "in-use":
        return "In Use";
      case "available":
        return "Available";
      case "maintenance":
        return "Maintenance";
      default:
        return status;
    }
  };

  return (
    <>
      <Seo
        title="Fleet"
        description="Preview of the D&J Stratagem fleet board — sample assets only. Request access to talk about live equipment tracking."
      />
      <Section className="relative overflow-hidden pt-16 pb-8 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Eyebrow>Fleet Management</Eyebrow>
          <h1 className="mt-6 text-5xl font-bold leading-tight text-paper md:text-6xl">
            See how equipment would look on the board.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            This page is a product preview: status filters, utilization, and asset cards
            using sample machines. It is not a live tracker for a real fleet.
          </p>
          <div
            role="note"
            className="mt-6 max-w-2xl rounded-xl border border-amber/40 bg-amber/8 px-5 py-4"
          >
            <p className="text-sm font-semibold text-amber">Preview &mdash; sample assets</p>
            <p className="mt-1 text-sm leading-relaxed text-steel">
              Names, rates, and operators below are illustrative. They are not a customer
              fleet and cannot be dispatched from this page.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button to="/register" variant="primary">Request access</Button>
            <Button to="/contact" variant="secondary">Request a demo</Button>
          </div>
        </div>
      </Section>

      <Section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-line/50 bg-gradient-to-br from-ink via-ink-2 to-ink-3 p-6 backdrop-blur-sm transition-all hover:border-line hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-steel">{stat.label}</p>
                      <p className="mt-2 text-3xl font-bold text-paper">{stat.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-amber opacity-60" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="py-8 border-b border-line/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="fleet-filter-status" className="text-sm font-medium text-steel">Filter by Status:</label>
              <select
                id="fleet-filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-line/50 bg-ink-2 px-3 py-2 text-sm text-paper transition-colors hover:border-line focus:outline-none focus:ring-2 focus:ring-amber/20"
              >
                <option value="all">All Assets</option>
                <option value="in-use">In Use</option>
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="fleet-sort-by" className="text-sm font-medium text-steel">Sort by:</label>
              <select
                id="fleet-sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-line/50 bg-ink-2 px-3 py-2 text-sm text-paper transition-colors hover:border-line focus:outline-none focus:ring-2 focus:ring-amber/20"
              >
                <option value="utilization">Highest Utilization</option>
                <option value="name">Name (A-Z)</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div className="ml-auto text-xs text-steel">
              Showing {filteredFleet.length} of {FLEET_DATA.length} assets
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFleet.map((asset) => (
              <article
                key={asset.id}
                className="group rounded-lg border border-line/30 bg-gradient-to-br from-ink via-ink-2 to-ink-3 p-6 backdrop-blur-sm transition-all hover:border-amber/30 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                      {asset.type}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-paper">{asset.name}</h3>
                    <p className="text-xs text-steel">{asset.id}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(asset.status)}`}>
                    {getStatusLabel(asset.status)}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-steel">Utilization</span>
                    <span className="text-sm font-bold text-paper">{asset.utilization}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-line/30">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber to-amber-2 transition-all"
                      style={{ width: `${asset.utilization}%` }}
                    />
                  </div>
                </div>
                <div className="mb-4 space-y-2 border-t border-line/20 pt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-steel">Location:</span>
                    <span className="font-medium text-paper">{asset.location}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-steel">Operator:</span>
                    <span className="font-medium text-paper">{asset.operator}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-steel">Rate:</span>
                    <span className="font-medium text-paper">{asset.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-steel">Capacity:</span>
                    <span className="font-medium text-paper">{asset.capacity}</span>
                  </div>
                </div>
                <div className="border-t border-line/20 pt-4">
                  <p className="text-xs text-steel">
                    Last maintenance: <span className="font-medium text-paper">{asset.lastMaintenance}</span>
                  </p>
                  <p className="mt-1 text-xs text-steel">
                    Next scheduled: <span className="font-medium text-paper">{asset.nextScheduled}</span>
                  </p>
                </div>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setSelectedAsset(asset)}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-amber/10 py-2 text-xs font-semibold text-amber transition-all hover:bg-amber/20 group-hover:bg-brand group-hover:text-white"
                >
                  View Details <IconArrowRight className="h-3 w-3" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 border-t border-line/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <Eyebrow>Powerful Features</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-paper">
              Built for modern construction operations
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: IconTruck, title: "Asset status board", desc: "See what is in use, available, or in the shop without inventing GPS pings." },
              { icon: IconClock, title: "Maintenance dates", desc: "Keep last service and next due on the card so the shop list is visible." },
              { icon: IconPackage, title: "Utilization snapshot", desc: "A simple rate per asset so idle machines are obvious in the sample set." },
              { icon: IconUsers, title: "Crew assignment", desc: "Show who is on the machine, or that it is waiting for a crew." },
              { icon: IconCheck, title: "Inspection notes", desc: "A place for checklists and cert dates when the live module ships." },
              { icon: IconArrowRight, title: "Works with the rest of the product", desc: "Fleet sits next to bids, orders, and suppliers — not a standalone toy site." },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-line/20 bg-gradient-to-br from-ink/50 via-ink-2/50 to-ink-3/50 p-6 backdrop-blur-sm transition-all hover:border-line hover:from-ink hover:via-ink-2 hover:to-ink-3"
                >
                  <Icon className="h-8 w-8 text-amber" />
                  <h3 className="mt-4 text-lg font-bold text-paper">{feature.title}</h3>
                  <p className="mt-2 text-sm text-steel leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="py-16 border-t border-line/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <Eyebrow>Simple Pricing</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-paper">
              Fleet add-on pricing is not live yet
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Starter", price: "$199", period: "/month", features: ["Up to 25 assets", "Basic tracking", "Email support", "Monthly reports"] },
              { name: "Professional", price: "$599", period: "/month", highlight: true, features: ["Up to 250 assets", "Advanced analytics", "Priority support", "Real-time alerts", "API access", "Team collaboration"] },
              { name: "Enterprise", price: "Custom", period: "pricing", features: ["Unlimited assets", "White label", "Dedicated support", "Custom integration", "On-premise option"] },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-lg border p-8 backdrop-blur-sm transition-all ${
                  plan.highlight
                    ? "border-amber/50 bg-gradient-to-br from-amber/10 via-amber/5 to-transparent ring-2 ring-amber/20 md:scale-105"
                    : "border-line/30 bg-gradient-to-br from-ink via-ink-2 to-ink-3"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-6 bg-brand px-3 py-1 text-xs font-bold text-white">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-paper">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-paper">{plan.price}</span>
                  <span className="text-sm text-steel ml-2">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3 text-sm text-steel">
                      <IconCheck className="h-4 w-4 text-amber flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  to={plan.name === "Enterprise" ? "/contact" : "/register"}
                  variant={plan.highlight ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {plan.name === "Enterprise" ? "Talk to us" : "Request access"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTASection
        title="Want this board on your own equipment?"
        subtitle="Request access and tell us what you run. There is no live fleet feed on this public page."
        primaryLabel="Request access"
        primaryTo="/register"
        secondaryLabel="Request a demo"
        secondaryTo="/contact"
      />

      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedAsset(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fleet-asset-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-ink-2 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 id="fleet-asset-title" className="text-2xl font-bold text-paper">{selectedAsset.name}</h2>
                <p className="mt-1 text-sm text-steel">{selectedAsset.id}</p>
              </div>
              <button
                id="fleet-asset-close"
                type="button"
                onClick={() => setSelectedAsset(null)}
                aria-label="Close asset details"
                className="text-2xl text-steel hover:text-paper"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="border-b border-line pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-steel">Current Status</p>
                    <p className="mt-1 text-lg font-bold text-paper">{getStatusLabel(selectedAsset.status)}</p>
                  </div>
                  <span className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor(selectedAsset.status)}`}>
                    {getStatusLabel(selectedAsset.status)}
                  </span>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  { label: "Type", value: selectedAsset.type },
                  { label: "Location", value: selectedAsset.location },
                  { label: "Operator", value: selectedAsset.operator },
                  { label: "Hourly Rate", value: selectedAsset.hourlyRate },
                  { label: "Capacity", value: selectedAsset.capacity },
                  { label: "Last Maintenance", value: selectedAsset.lastMaintenance },
                ].map((item, idx) => (
                  <div key={idx}>
                    <p className="text-xs font-semibold uppercase text-steel">{item.label}</p>
                    <p className="mt-2 text-lg font-bold text-paper">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-line pt-6">
                <p className="text-xs font-semibold uppercase text-steel">Utilization</p>
                <div className="mt-4 flex items-baseline gap-4">
                  <div className="flex-1">
                    <div className="h-4 rounded-full bg-line/30">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber to-amber-2"
                        style={{ width: `${selectedAsset.utilization}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-paper">{selectedAsset.utilization}%</span>
                </div>
              </div>
              <p className="border-t border-line pt-6 text-sm text-steel">
                Schedule and history actions are not wired on this preview. Use{" "}
                <Link to="/contact" className="font-medium text-amber hover:text-amber-2">the contact form</Link>{" "}
                if you want this on a real fleet.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
