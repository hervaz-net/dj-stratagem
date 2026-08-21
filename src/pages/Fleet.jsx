import { useState, useMemo } from "react";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import {
  IconTruck,
  IconClock,
  IconCheck,
  IconArrowRight,
  IconUsers,
  IconPackage,
} from "../components/icons";

// Mock fleet data
const FLEET_DATA = [
  {
    id: "FL-001",
    name: "Concrete Mixer",
    type: "Equipment",
    status: "in-use",
    location: "Los Angeles, CA",
    utilization: 89,
    lastMaintenance: "2024-08-01",
    nextScheduled: "2024-09-15",
    operator: "John Martinez",
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
    lastMaintenance: "2024-07-20",
    nextScheduled: "2024-10-01",
    operator: "Sarah Chen",
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
    lastMaintenance: "2024-08-05",
    nextScheduled: "2024-08-28",
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
    lastMaintenance: "2024-08-08",
    nextScheduled: "2024-08-18",
    operator: "Technician",
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
    lastMaintenance: "2024-07-15",
    nextScheduled: "2024-09-20",
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
    lastMaintenance: "2024-08-02",
    nextScheduled: "2024-09-10",
    operator: "Mike Rodriguez",
    capacity: "65 ft reach",
    hourlyRate: "$200",
  },
];

const STATS = [
  { label: "Total Fleet Assets", value: "156", icon: IconTruck },
  { label: "Utilization Rate", value: "71%", icon: IconPackage },
  { label: "Available Now", value: "42", icon: IconCheck },
  { label: "In Maintenance", value: "8", icon: IconClock },
];

export default function Fleet() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("utilization");
  const [selectedAsset, setSelectedAsset] = useState(null);

  const filteredFleet = useMemo(() => {
    let result = FLEET_DATA;

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
        return "bg-green-500/10 text-green-700 border-green-200";
      case "available":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "maintenance":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
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
      {/* Hero Section */}
      <Section className="relative overflow-hidden pt-16 pb-8 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Eyebrow>Fleet Management</Eyebrow>
          <h1 className="mt-6 text-5xl font-bold leading-tight text-paper md:text-6xl">
            Track, manage, and optimize your entire fleet in real time.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            Real-time asset tracking, predictive maintenance, utilization analytics, and
            automated scheduling. Keep every piece of equipment working smarter.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button variant="primary">Start Free Trial</Button>
            <Button variant="secondary">Watch Demo</Button>
          </div>
        </div>
      </Section>

      {/* Stats Grid */}
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

      {/* Controls Section */}
      <Section className="py-8 border-b border-line/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-steel">Filter by Status:</label>
              <select
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
              <label className="text-sm font-medium text-steel">Sort by:</label>
              <select
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

      {/* Fleet Grid */}
      <Section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFleet.map((asset) => (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="group cursor-pointer rounded-lg border border-line/30 bg-gradient-to-br from-ink via-ink-2 to-ink-3 p-6 backdrop-blur-sm transition-all hover:border-amber/30 hover:shadow-lg hover:scale-105"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                      {asset.type}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-paper">{asset.name}</h3>
                    <p className="text-xs text-steel">{asset.id}</p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                      asset.status
                    )}`}
                  >
                    {getStatusLabel(asset.status)}
                  </span>
                </div>

                {/* Utilization Bar */}
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

                {/* Info Grid */}
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

                {/* Maintenance Status */}
                <div className="border-t border-line/20 pt-4">
                  <p className="text-xs text-steel">
                    Last maintenance: <span className="font-medium text-paper">{asset.lastMaintenance}</span>
                  </p>
                  <p className="mt-1 text-xs text-steel">
                    Next scheduled: <span className="font-medium text-paper">{asset.nextScheduled}</span>
                  </p>
                </div>

                {/* View Details Button */}
                <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-amber/10 py-2 text-xs font-semibold text-amber transition-all hover:bg-amber/20 group-hover:bg-brand group-hover:text-white">
                  View Details <IconArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Feature Highlights */}
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
              {
                icon: IconTruck,
                title: "Real-Time Tracking",
                desc: "GPS-enabled asset tracking with live updates every 10 seconds.",
              },
              {
                icon: IconClock,
                title: "Predictive Maintenance",
                desc: "AI-powered alerts before problems happen, reducing downtime by 40%.",
              },
              {
                icon: IconPackage,
                title: "Utilization Analytics",
                desc: "Comprehensive dashboards showing ROI per asset and usage patterns.",
              },
              {
                icon: IconUsers,
                title: "Team Coordination",
                desc: "Assign, track, and communicate with operators in real time.",
              },
              {
                icon: IconCheck,
                title: "Compliance Tracking",
                desc: "Automated inspection checklists, certifications, and audit logs.",
              },
              {
                icon: IconArrowRight,
                title: "Seamless Integration",
                desc: "Connect with your existing ERP, accounting, and PM software.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-line/20 bg-gradient-to-br from-ink/50 via-ink-2/50 to-ink-3/50 p-6 backdrop-blur-sm transition-all hover:border-line hover:bg-gradient-to-br hover:from-ink via-ink-2 hover:to-ink-3"
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

      {/* Pricing Section */}
      <Section className="py-16 border-t border-line/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <Eyebrow>Simple Pricing</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-paper">
              Scale from 10 to 1,000+ assets
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$199",
                period: "/month",
                features: ["Up to 25 assets", "Basic tracking", "Email support", "Monthly reports"],
                cta: "Get Started",
              },
              {
                name: "Professional",
                price: "$599",
                period: "/month",
                highlight: true,
                features: [
                  "Up to 250 assets",
                  "Advanced analytics",
                  "Priority support",
                  "Real-time alerts",
                  "API access",
                  "Team collaboration",
                ],
                cta: "Start Free Trial",
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                features: ["Unlimited assets", "White label", "Dedicated support", "Custom integration", "On-premise option"],
                cta: "Contact Sales",
              },
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
                  variant={plan.highlight ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Ready to transform your fleet operations?"
        description="Join 500+ construction companies using D&J Stratagem to optimize asset utilization and cut maintenance costs by up to 35%."
        primaryCTA="Start Your Free Trial"
        secondaryCTA="Schedule a Demo"
      />

      {/* Modal - Asset Details */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedAsset(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-ink-2 p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-paper">{selectedAsset.name}</h2>
                <p className="mt-1 text-sm text-steel">{selectedAsset.id}</p>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-2xl text-steel hover:text-paper"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Row */}
              <div className="border-b border-line pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-steel">Current Status</p>
                    <p className="mt-1 text-lg font-bold text-paper">
                      {getStatusLabel(selectedAsset.status)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor(
                      selectedAsset.status
                    )}`}
                  >
                    {getStatusLabel(selectedAsset.status)}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
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

              {/* Utilization */}
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

              {/* Action Buttons */}
              <div className="border-t border-line pt-6 flex gap-3">
                <Button variant="primary" className="flex-1">
                  Schedule Maintenance
                </Button>
                <Button variant="secondary" className="flex-1">
                  View Full History
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
