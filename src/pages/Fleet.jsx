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

/** Keep sample service dates relative to today so the preview never looks expired. */
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
