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
import { FleetArt } from "../components/illustrations";

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
    switch (status) {
      case "in-use":
        return "badge-success";
      case "available":
        return "badge-brand";
      case "maintenance":
        return "badge-warning";
      default:
        return "badge-neutral";
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
      <Section className="relative overflow-hidden pt-10 pb-6 md:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>Fleet Management</Eyebrow>
            <h1 className="mt-4 text-2xl font-semibold leading-tight text-paper md:text-3xl">
              See how equipment would look on the board.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-steel">
              This page is a product preview: status filters, utilization, and asset cards
              using sample machines. It is not a live tracker for a real fleet.
            </p>
            <div
              role="note"
              className="mt-5 max-w-2xl rounded-md border border-amber/40 bg-amber/8 px-4 py-3"
            >
              <p className="text-sm font-semibold text-amber">Preview &mdash; sample assets</p>
              <p className="mt-1 text-sm leading-relaxed text-steel">
                Names, rates, and operators below are illustrative. They are not a customer
                fleet and cannot be dispatched from this page.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button to="/register" variant="primary">Request access</Button>
              <Button to="/contact" variant="secondary">Contact us</Button>
            </div>
          </div>
          <FleetArt className="hidden w-full lg:block" />
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card-corp rounded-lg p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="kpi-label">{stat.label}</p>
                    <p className="kpi-value mt-2">{stat.value}</p>
                  </div>
                  <Icon className="h-6 w-6 text-amber opacity-70" />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Catalog layout: same sidebar-facet pattern as Projects — an
          equipment board is browsed the same way a bid list is. */}
      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="card-corp rounded-lg p-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-steel">Status</p>
              <div className="flex flex-col gap-1">
                {[
                  { value: "all", label: "All assets" },
                  { value: "in-use", label: "In use" },
                  { value: "available", label: "Available" },
                  { value: "maintenance", label: "Maintenance" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFilterStatus(opt.value)}
                    className={`rounded-sm px-2.5 py-1.5 text-left text-sm transition-colors ${
                      filterStatus === opt.value ? "bg-cta/10 font-semibold text-cta" : "text-steel hover:bg-ink hover:text-paper"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label htmlFor="fleet-sort-by" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
                  Sort by
                </label>
                <select
                  id="fleet-sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="field-corp text-sm"
                >
                  <option value="utilization">Highest utilization</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <p className="mb-5 text-sm text-steel">
              <span className="font-semibold text-paper">{filteredFleet.length}</span> of {FLEET_DATA.length} assets
            </p>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFleet.map((asset) => (
                <article key={asset.id} className="card-corp card-corp-hover rounded-lg p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                        {asset.type}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-paper">{asset.name}</h3>
                      <p className="text-xs text-steel">{asset.id}</p>
                    </div>
                    <span className={`badge ${getStatusColor(asset.status)}`}>
                      {getStatusLabel(asset.status)}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-steel">Utilization</span>
                      <span className="text-sm font-semibold text-paper">{asset.utilization}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-ink">
                      <div className="h-full rounded-full bg-cta" style={{ width: `${asset.utilization}%` }} />
                    </div>
                  </div>
                  <div className="mb-4 space-y-2 border-t border-line pt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-steel">Location</span>
                      <span className="font-medium text-paper">{asset.location}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-steel">Operator</span>
                      <span className="font-medium text-paper">{asset.operator}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-steel">Rate</span>
                      <span className="font-medium text-paper">{asset.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-steel">Capacity</span>
                      <span className="font-medium text-paper">{asset.capacity}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setSelectedAsset(asset)}
                    className="btn btn-secondary w-full"
                  >
                    View details <IconArrowRight className="h-3 w-3" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tint className="border-t border-line">
        <div className="text-center">
          <Eyebrow>Powerful features</Eyebrow>
          <h2 className="text-balance mx-auto max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
            Built for modern construction operations.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
              <div key={idx} className="card-corp card-corp-hover rounded-lg p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-amber/10 text-amber">
                  <Icon width={18} height={18} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-paper">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-steel">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="text-center">
          <Eyebrow>Simple pricing</Eyebrow>
          <h2 className="text-balance mx-auto max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
            Fleet add-on pricing is not live yet.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { name: "Starter", price: "$199", period: "/month", features: ["Up to 25 assets", "Basic tracking", "Email support", "Monthly reports"] },
            { name: "Professional", price: "$599", period: "/month", highlight: true, features: ["Up to 250 assets", "Advanced analytics", "Priority support", "Real-time alerts", "API access", "Team collaboration"] },
            { name: "Enterprise", price: "Custom", period: "pricing", features: ["Unlimited assets", "White label", "Dedicated support", "Custom integration", "On-premise option"] },
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`card-corp relative rounded-lg p-6 ${plan.highlight ? "border-amber" : ""}`}
            >
              {plan.highlight && (
                <span className="badge badge-brand absolute -top-3 left-6 uppercase tracking-wider">
                  Most popular
                </span>
              )}
              <h3 className="text-base font-semibold text-paper">{plan.name}</h3>
              <div className="mt-3">
                <span className="text-2xl font-semibold text-paper">{plan.price}</span>
                <span className="ml-1.5 text-sm text-steel">{plan.period}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2.5 text-sm text-steel">
                    <IconCheck className="h-4 w-4 shrink-0 text-amber" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                to={plan.name === "Enterprise" ? "/contact" : "/register"}
                variant={plan.highlight ? "primary" : "secondary"}
                className="mt-6 w-full"
              >
                {plan.name === "Enterprise" ? "Talk to us" : "Request access"}
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Want this board on your own equipment?"
        subtitle="Request access and tell us what you run. There is no live fleet feed on this public page."
        primaryLabel="Request access"
        primaryTo="/register"
        secondaryLabel="Contact us"
        secondaryTo="/contact"
      />

      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedAsset(null)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fleet-asset-title"
            className="card-corp max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 id="fleet-asset-title" className="text-lg font-semibold text-paper">{selectedAsset.name}</h2>
                <p className="mt-1 text-sm text-steel">{selectedAsset.id}</p>
              </div>
              <button
                id="fleet-asset-close"
                type="button"
                onClick={() => setSelectedAsset(null)}
                aria-label="Close asset details"
                className="text-xl text-steel hover:text-paper"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6">
              <div className="border-b border-line pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-steel">Current status</p>
                  <span className={`badge ${getStatusColor(selectedAsset.status)}`}>
                    {getStatusLabel(selectedAsset.status)}
                  </span>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  { label: "Type", value: selectedAsset.type },
                  { label: "Location", value: selectedAsset.location },
                  { label: "Operator", value: selectedAsset.operator },
                  { label: "Hourly Rate", value: selectedAsset.hourlyRate },
                  { label: "Capacity", value: selectedAsset.capacity },
                  { label: "Last Maintenance", value: selectedAsset.lastMaintenance },
                ].map((item, idx) => (
                  <div key={idx}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-steel">{item.label}</p>
                    <p className="mt-1.5 text-sm font-semibold text-paper">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-line pt-6">
                <p className="text-xs font-semibold uppercase text-steel">Utilization</p>
                <div className="mt-4 flex items-baseline gap-4">
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-ink">
                      <div className="h-full rounded-full bg-cta" style={{ width: `${selectedAsset.utilization}%` }} />
                    </div>
                  </div>
                  <span className="kpi-value">{selectedAsset.utilization}%</span>
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
