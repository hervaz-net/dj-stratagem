import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.24",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Intent aliases such as /docs, /signin, and /legal now 301 at LiteSpeed, so a stale SPA bundle cannot keep showing the 404 page." },
      { type: "improved", text: "/legal and /eula redirect to terms. /unsubscribe redirects to privacy. /accessibility maps to about." },
      { type: "improved", text: "Publish-deploy fails immediately when CPANEL_TOKEN is missing instead of pretending the host pull succeeded." },
    ],
  },
