import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import RoleBadge from "../components/RoleBadge";
import SampleLabel from "../components/SampleLabel";
import Accordion from "../components/Accordion";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import FilterChip from "../components/market/FilterChip";
import SampleNotice from "../components/market/SampleNotice";
import { daysFromToday, formatPrice, formatShortDate } from "../components/market/format";
import { PRODUCT } from "../brand";
import {
  IconTruck,
  IconClock,
  IconArrowRight,
  IconBlueprint,
  IconTool,
  IconCalendar,
  IconLayers,
  IconX,
} from "../components/icons";

// Sample equipment for the public preview. Owners are invented and named
// "Example …" so nobody mistakes them for real rental companies (PROOF.md).
// Dates stay relative to today so the board never shows a past due date.
const FLEET_DATA = [
  { id: "EQ-001", name: "Concrete mixer", type: "Equipment", status: "on-rent", location: "Los Angeles, CA", utilization: 89, lastService: daysFromToday(-63), nextService: daysFromToday(13), owner: "Example Equipment Rental", ownerRole: "distributor", capacity: "3 cubic yards", hourlyRate: 125, handoff: "Delivered" },
  { id: "EQ-002", name: "Excavator, 20 ton class", type: "Heavy equipment", status: "on-rent", location: "Orange County, CA", utilization: 76, lastService: daysFromToday(-74), nextService: daysFromToday(29), owner: "Example Earthworks Co.", ownerRole: "contractor", capacity: "20 ton", hourlyRate: 450, handoff: "Delivered" },
  { id: "EQ-003", name: "Dump truck", type: "Vehicle", status: "available", location: "San Diego, CA", utilization: 42, lastService: daysFromToday(-59), nextService: daysFromToday(40), owner: "Example Equipment Rental", ownerRole: "distributor", capacity: "15 ton", hourlyRate: 85, handoff: "With operator" },
  { id: "EQ-004", name: "Scaffolding kit", type: "Equipment", status: "in-shop", location: "Riverside, CA", utilization: 0, lastService: daysFromToday(-25), nextService: daysFromToday(20), owner: "Example Access Systems", ownerRole: "supplier", capacity: "3,000 sq ft", hourlyRate: 200, handoff: "Delivered" },
  { id: "EQ-005", name: "Towable generator", type: "Equipment", status: "available", location: "Ventura, CA", utilization: 55, lastService: daysFromToday(-79), nextService: daysFromToday(18), owner: "Example Power Rentals", ownerRole: "distributor", capacity: "500 kW", hourlyRate: 350, handoff: "Pickup or delivered" },
  { id: "EQ-006", name: "Bucket truck", type: "Vehicle", status: "on-rent", location: "Long Beach, CA", utilization: 92, lastService: daysFromToday(-62), nextService: daysFromToday(21), owner: "Example Electric Contractors", ownerRole: "contractor", capacity: "65 ft reach", hourlyRate: 200, handoff: "With operator" },
];

const STATUS = {
  available: { label: "Available", className: "bg-success-soft text-success" },
  "on-rent": { label: "On rent", className: "bg-brand-soft text-brand-fg" },
  "in-shop": { label: "In the shop", className: "bg-warning-soft text-warning" },
};

const STATUS_FILTERS = [
  { key: "all", label: "All equipment" },
  { key: "available", label: "Available" },
  { key: "on-rent", label: "On rent" },
  { key: "in-shop", label: "In the shop" },
];

const SORTS = {
  utilization: { label: "Highest utilization", fn: (a, b) => b.utilization - a.utilization },
  "rate-asc": { label: "Rate: low to high", fn: (a, b) => a.hourlyRate - b.hourlyRate },
  name: { label: "Name (A–Z)", fn: (a, b) => a.name.localeCompare(b.name) },
};

const features = [
  { icon: <IconTruck />, title: "List idle equipment", text: "Rental yards, distributors, and contractors with a machine between jobs can post availability, rates, and pickup or delivery." },
  { icon: <IconBlueprint />, title: "Request by the job", text: "Ask for a machine alongside the material request for the same project and phase, with the dates you need it on site." },
  { icon: <IconCalendar />, title: "Availability on the card", text: "What's available, what's out on rent, and what's in the shop, without calling around to find out." },
  { icon: <IconClock />, title: "Service dates up front", text: "Last and next service on every listing so renters know what they're getting and owners keep the shop list visible." },
  { icon: <IconTool />, title: "Capacity and specs", text: "Tonnage, reach, output, and coverage listed the same way on every card, so comparing two machines is quick." },
  { icon: <IconLayers />, title: "Next to your materials", text: "Equipment sits in the same account as your requests, quotes, and orders, not in a separate rental portal." },
];

const faqs = [
  {
    q: "Can I rent equipment from this page today?",
    a: "No. Every machine, owner, and rate here is a sample. Equipment listings are in preview and open to early users first.",
  },
  {
    q: "Who can list equipment?",
    a: "Any company on the Exchange: rental yards, distributors that rent, and contractors with a machine sitting idle between jobs.",
  },
  {
    q: "Does the Exchange provide insurance, damage waivers, or operators?",
    a: `No. ${PRODUCT} doesn't insure equipment, provide operators, or handle payment. Rental terms, coverage, and operator arrangements are between the owner and the renter.`,
  },
  {
    q: "What does it cost to list equipment?",
    a: "Equipment listing pricing isn't set yet. Talk to us if you want to list a fleet during the preview.",
  },
];

function StatusPill({ status, className = "" }) {
  const s = STATUS[status] ?? { label: status, className: "bg-subtle text-fg" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.className} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {s.label}
    </span>
  );
}

function UtilizationBar({ value, className = "" }) {
  return (
    <div className={`h-2 rounded-full bg-subtle ${className}`}>
      <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
    </div>
  );
}

function AssetDialog({ asset, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("fleet-asset-close")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [onClose]);

  const details = [
    { label: "Type", value: asset.type },
    { label: "Location", value: asset.location },
    { label: "Capacity", value: asset.capacity },
    { label: "Rate", value: `${formatPrice(asset.hourlyRate)} / hr` },
    { label: "Handoff", value: asset.handoff },
    { label: "Last service", value: formatShortDate(asset.lastService) },
    { label: "Next service", value: formatShortDate(asset.nextService) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fleet-asset-title"
        className="animate-menu-in max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-line bg-surface p-6 shadow-[var(--shadow-pop)] sm:rounded-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={asset.status} />
              <SampleLabel>Sample</SampleLabel>
            </div>
            <h2 id="fleet-asset-title" className="mt-3 text-2xl font-bold tracking-tight text-fg">
              {asset.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-fg-muted">{asset.id}</p>
          </div>
          <button
            id="fleet-asset-close"
            type="button"
            onClick={onClose}
            aria-label="Close equipment details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
          >
            <IconX width={18} height={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-line px-4 py-3">
          <span className="text-sm text-fg-muted">Listed by</span>
          <span className="text-sm font-semibold text-fg">{asset.owner}</span>
          <RoleBadge role={asset.ownerRole} />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
          {details.map((d) => (
            <div key={d.label}>
              <dt className="text-xs font-semibold text-fg-muted">{d.label}</dt>
              <dd className="mt-1 text-base font-semibold text-fg">{d.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-line pt-6">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-fg-muted">Utilization, last 90 days</p>
            <span className="text-lg font-bold text-fg tabular-nums">{asset.utilization}%</span>
          </div>
          <UtilizationBar value={asset.utilization} className="mt-3 h-3" />
        </div>

        <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-fg-muted">
          Booking and scheduling aren&rsquo;t wired on this preview.{" "}
          <Link to="/contact" className="font-medium text-brand hover:text-brand-hover">
            Talk to us
          </Link>{" "}
          if you want to list or rent equipment during early access.
        </p>
      </div>
    </div>
  );
}

export default function Fleet() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("utilization");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const closeAsset = useCallback(() => setSelectedAsset(null), []);

  const filteredFleet = useMemo(() => {
    const list = filterStatus === "all" ? FLEET_DATA : FLEET_DATA.filter((a) => a.status === filterStatus);
    // Copy before sorting so the module-level array keeps its order.
    return [...list].sort(SORTS[sortBy].fn);
  }, [filterStatus, sortBy]);

  const stats = useMemo(() => {
    const count = (s) => FLEET_DATA.filter((a) => a.status === s).length;
    const avg = Math.round(FLEET_DATA.reduce((sum, a) => sum + a.utilization, 0) / FLEET_DATA.length);
    return [
      { label: "Sample listings", value: FLEET_DATA.length },
      { label: "Available now", value: count("available") },
      { label: "On rent", value: count("on-rent") },
      { label: "Avg. utilization", value: `${avg}%` },
    ];
  }, []);

  return (
    <>
      <Seo
        title="Equipment & fleet"
        description="Preview of equipment listings on the marketplace: mixers, excavators, trucks, generators, and scaffolding from rental yards, distributors, and contractors. Sample listings only."
      />

      <PageHero
        eyebrow="Equipment & fleet"
        title="Rent the machine next to the material it moves."
        actions={
          <>
            <Button to="/register">Request access</Button>
            <Button to="/contact" variant="secondary">
              List equipment
            </Button>
          </>
        }
      >
        Equipment sits idle between jobs while the next crew calls five yards to find one. On the Exchange,
        owners list what&rsquo;s available and contractors request it for the job, in the same place they
        buy materials.
      </PageHero>

      <Section className="!pt-10 md:!pt-14">
        <SampleNotice title="Preview — sample equipment">
          Every machine, owner, rate, and service date below is illustrative. These are not real listings
          and can&rsquo;t be rented or dispatched from this page. Equipment listings open to early users first.
        </SampleNotice>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
              <p className="text-sm text-fg-muted">{s.label}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-fg tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by availability">
            {STATUS_FILTERS.map((f) => (
              <FilterChip key={f.key} active={filterStatus === f.key} onClick={() => setFilterStatus(f.key)}>
                {f.label}
              </FilterChip>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="fleet-sort-by" className="text-sm text-fg-muted">
              Sort
            </label>
            <select
              id="fleet-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-full border border-line bg-surface px-3 text-sm text-fg hover:border-line-strong"
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-5 text-sm text-fg-muted" aria-live="polite">
          Showing <span className="font-semibold text-fg tabular-nums">{filteredFleet.length}</span> of{" "}
          {FLEET_DATA.length} sample listings
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFleet.map((asset) => (
            <article
              key={asset.id}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-[var(--shadow-pop)]"
            >
              <div className="flex items-center justify-between gap-2">
                <StatusPill status={asset.status} />
                <SampleLabel>Sample</SampleLabel>
              </div>
              <p className="mt-4 text-xs font-semibold text-fg-muted">{asset.type}</p>
              <h3 className="mt-0.5 text-lg font-semibold text-fg">{asset.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-sm text-fg-muted">{asset.owner}</span>
                <RoleBadge role={asset.ownerRole} />
              </div>

              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-fg tabular-nums">{formatPrice(asset.hourlyRate)}</span>
                <span className="text-sm text-fg-muted">/ hr</span>
              </p>

              <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3 text-sm">
                <div>
                  <dt className="text-xs text-fg-muted">Location</dt>
                  <dd className="mt-0.5 font-medium text-fg">{asset.location}</dd>
                </div>
                <div>
                  <dt className="text-xs text-fg-muted">Capacity</dt>
                  <dd className="mt-0.5 font-medium text-fg">{asset.capacity}</dd>
                </div>
                <div>
                  <dt className="text-xs text-fg-muted">Handoff</dt>
                  <dd className="mt-0.5 font-medium text-fg">{asset.handoff}</dd>
                </div>
                <div>
                  <dt className="text-xs text-fg-muted">Next service</dt>
                  <dd className="mt-0.5 font-medium text-fg">{formatShortDate(asset.nextService)}</dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted">Utilization</span>
                  <span className="font-semibold text-fg tabular-nums">{asset.utilization}%</span>
                </div>
                <UtilizationBar value={asset.utilization} className="mt-1.5" />
              </div>

              <Button
                variant="soft"
                size="sm"
                aria-haspopup="dialog"
                onClick={() => setSelectedAsset(asset)}
                className="mt-5 w-full"
              >
                View details <IconArrowRight width={14} height={14} aria-hidden="true" />
                <span className="sr-only">for {asset.name}</span>
              </Button>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="How equipment works" title="Machines and materials, one marketplace.">
          Equipment is just another kind of supply. List it the way sellers list stock, and request it the
          way buyers request materials.
        </SectionHeading>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title}>
              {f.text}
            </FeatureCard>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button to="/marketplace" variant="secondary">
            Browse materials
          </Button>
          <Button to="/contractors" variant="ghost">
            For contractors <IconArrowRight width={16} height={16} aria-hidden="true" />
          </Button>
        </div>
      </Section>

      <Section width="max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Equipment FAQ" />
        <div className="mt-10">
          <Accordion items={faqs} />
        </div>
      </Section>

      <CTASection
        title="Have equipment sitting idle?"
        subtitle="Tell us what you run and where. We're onboarding early equipment owners and renters now. There is no live equipment feed on this public page."
        primaryLabel="Request access"
        primaryTo="/register"
        secondaryLabel="Talk to us"
        secondaryTo="/contact"
      />

      {selectedAsset && <AssetDialog asset={selectedAsset} onClose={closeAsset} />}
    </>
  );
}
