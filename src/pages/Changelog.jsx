import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.33",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Contact form email validation now anchors the same way as sign-in, register, and the footer, so extra text around an address no longer passes." },
      { type: "improved", text: "Live public_html is still on assets/index-BaMj1nih.js while GitHub deploy already has assets/index-Ba53Vio9.js. Missing health.php, send-demo.php, and manifest.webmanifest still SPA-fallback until the next cPanel pull." },
    ],
  },
