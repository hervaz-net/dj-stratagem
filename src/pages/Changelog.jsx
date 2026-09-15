import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.38",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "A later Deploy 4451fab overwrite put an old .htaccess back on the deploy branch. Live still 301s /blog, /news, and /press to /changelog, SPA-fallbacks /health.php, /favicon.ico, /apple-touch-icon.png, and /manifest.webmanifest, and returns JSON not_found for /api/health.php." },
      { type: "improved", text: "Source again ships the current public/.htaccess (no blog 301, favicon/manifest/health probes, alt-php81 handler) plus public/api/health.php. api/.htaccess now passes health.php through before the directory catch-all." },
      { type: "improved", text: "GitHub deploy must be rebuilt from this main. public_html will not change until cPanel Update from Remote + Deploy HEAD, or a CPANEL_TOKEN on publish-deploy." },
    ],
  },
  {
    version: "1.37",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Live public_html now matches GitHub deploy: assets/index-BoLTTWBH.js from main 062bc70. /health.php, /api/health.php, /send-demo.php, and /manifest.webmanifest are real files, not SPA fallbacks." },
      { type: "improved", text: "Intent aliases such as /signup, /signin, /help, /docs, and /how-it-works 301 at LiteSpeed to the canonical routes." },
      { type: "improved", text: "LiteSpeed now advertises application/manifest+json for /manifest.webmanifest instead of application/octet-stream." },
    ],
  },
]