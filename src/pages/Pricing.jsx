import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import Seo from "../components/Seo";
import { IconCheck } from "../components/icons";

const ANNUAL_DISCOUNT = 0.2;

const tiers = [
  {
    name: "Starter",
    monthly: 0,
    period: "",
    blurb: "For subs getting started — build a profile and find work.",
    features: [
      "Company profile and portfolio",
      "Browse and match to open projects",
      "Submit up to 3 bids per month",
      "License and insurance verification",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Professional",
    monthly: 99,
    period: "/mo",
    blurb: "For contractors ready to win consistently.",
    features: [
      "Everything in Starter",
      "Unlimited bids and project postings",
      "Bid comparison, RFIs, and awards",
      "CRM, estimating, and invoicing",
      "Bid history and analytics",
      "AI proposal drafts",
      "Supply Exchange RFQs with scored auto-award",
      "Premium profile placement",
    ],
    cta: "Request access",
    highlighted: true,
  },
  {
    name: "Growth",
    monthly: 249,
    period: "/mo",
    blurb: "For firms that treat marketing as a growth engine.",
    features: [
      "Everything in Professional",
      "Full marketing suite: SEO, campaigns, reviews",
      "Lead generation with pay-per-lead options",
      "Featured project listings",
      "AI bid competitiveness and pipeline forecasting",
      "AI plan and spec analysis with missing-document detection",
      "Standing price books and pooled-demand buying",
      "Priority support",
    ],
    cta: "Request access",
    highlighted: false,
  },
  {
    name: "Enterprise",
    monthly: null,
    period: "",
    blurb: "For large contractors with teams, volume, and integrations.",
    features: [
      "Everything in Growth",
      "Unlimited team seats and roles",
      "Dedicated onboarding and account manager",
      "Custom integrations and reporting",
      "Volume pricing",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

const addOns = [
  { name: "Premium contractor profile", detail: "Stand out in search and matching results." },
  { name: "Pay-per-lead", detail: "Buy qualified leads only when you want them." },
  { name: "Featured project listings", detail: "Put your project in front of more qualified subs." },
  { name: "Supplier advertising", detail: "Reach contractors at the moment they're buying." },
  { name: "Supply Exchange for suppliers", detail: "Quote into sealed RFQs with floor pricing that protects your margin." },
  { name: "CRM & AI add-ons", detail: "Scale up automation as your team grows." },
];

const comparison = [
  { feature: "Company profile and matching", values: ["Yes", "Yes", "Yes", "Yes"] },
  { feature: "Bids per month", values: ["3", "Unlimited", "Unlimited", "Unlimited"] },
  { feature: "Project postings and awards", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "CRM, estimating, invoicing", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "Supply Exchange RFQs", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "Full marketing suite", values: ["—", "—", "Yes", "Yes"] },
  { feature: "AI forecasting and plan analysis", values: ["—", "Partial", "Yes", "Yes"] },
  { feature: "Standing price books, pooled demand", values: ["—", "—", "Yes", "Yes"] },
  { feature: "Team seats", values: ["1", "5", "15", "Unlimited"] },
  { feature: "Support", values: ["Community", "Standard", "Priority", "Dedicated"] },
];

const pricingFaqs = [
  {
    q: "Can I change plans later?",
    a: "Yes. Paid plans are not self-serve checkout yet — email hello@djstratageminc.com or use Request access and we will move you. When billing is live, upgrades and downgrades will prorate. Nothing is locked behind an annual commitment unless you choose one.",
  },
  {
    q: "Is there a free trial?",
    a: "Not yet. Starter is the free plan: profile, matching, and a small monthly bid cap. Paid features start after we approve an account and you pick Professional, Growth, or Enterprise. There is no card-on-file trial that auto-converts.",
  },
  {
    q: "Do you charge per bid or take a cut of awards?",
    a: "No. Subscription plans are flat. Optional add-ons like pay-per-lead and featured listings are priced separately and are always opt-in.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual plans are paid up front and shown here as the equivalent monthly rate, a 20% saving against paying month to month.",
  },
];
