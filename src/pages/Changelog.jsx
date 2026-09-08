import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.17",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Desktop consent is a full-width bottom bar instead of a floating card, so the first-fold hero mockup and pricing toggle stay visible before anyone dismisses it." },
    ],
  },
  {
    version: "1.16",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/signin and /sign-in now redirect to /login instead of the 404 page." },
    ],
  },
  {
    version: "1.15",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Phone consent is a full-width bottom bar instead of a tall floating card, so first-fold hero CTAs stay tappable before anyone dismisses it." },
    ],
  },
  {
    version: "1.14",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/fleet-cards, /receipts, and /signage now redirect to the marketing document frames instead of the 404 page." },
    ],
  },
  {
    version: "1.13",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Phone consent card is a short bottom bar so hero CTAs stay tappable. Body padding no longer pretends to lift first-fold buttons out from under a tall overlay." },
    ],
  },
  {
    version: "1.12",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Consent card uses the short phone copy through the 768px breakpoint and reserves more bottom space so closing CTAs stay tappable." },
      { type: "improved", text: "Password fields no longer use a bullet placeholder that looks like a filled-in password." },
    ],
  },
  {
    version: "1.11",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Phone consent card uses shorter copy and reserves first-fold space so hero CTAs stay tappable." },
      { type: "improved", text: "Floating demo, chat, and back-to-top stay off brand and marketing document frames." },
    ],
  },
  {
    version: "1.10",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Consent, demo, and chat chrome no longer sit on top of first-fold CTAs." },
    ],
  },
];
