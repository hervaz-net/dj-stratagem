import Section from "../components/Section";
import CTASection from "../components/CTASection";
import PageHero from "../components/nocturne/PageHero";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.31",
    date: "October 2026",
    tag: "Feature",
    items: [
      { type: "new", text: "Stratagem AI runs the subagents. Once a job is approved, each subagent you picked does its part on its own, building on the work before it, and can call another subagent back in for follow-up work." },
      { type: "new", text: "Read each subagent's write-up in the job panel, or download the whole job's results as one file." },
      { type: "new", text: "Email updates when your account is approved, and when a job is approved, needs changes, needs your attention, or is done." },
      { type: "new", text: "A rejected job can be edited and resubmitted instead of starting over." },
      { type: "new", text: "Self-serve password reset: request a link at Forgot password and choose a new one." },
    ],
  },
  // ... truncated for this example; in real call the full content is used
];

const TYPE_COLOR = {
  new: "text-[var(--viz-green)] bg-[var(--viz-green)]/10",
  improved: "text-[var(--viz-cyan)] bg-[var(--viz-cyan)]/10",
  fixed: "text-warning bg-warning/10",
  fix: "text-warning bg-warning/10",
};

// rest of the component identical
