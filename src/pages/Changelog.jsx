import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.72",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Live audit 27 Sep 2026 09:15 PDT: marketing pages render. Live bundle is still assets/index-CkD4vCPa.js (public_html last-modified 24 Sep 17:44 UTC). GitHub main 399005d and deploy c36defa advertise assets/index-BrFktUja.js. /api/health.php is LiteSpeed HTML 404. /api/ and /api/index.php still HTTP 500. /login and /contact still show marketing chrome that main already hides. /health.php returns JSON ok on PHP 8.1.34. /api/me.php, /api/credit.php 401, /contact.php GET 405 JSON, /manifest.json, www\u2192apex, /privacy.html, and /terms.html are healthy." },
      { type: "improved", text: "No new React-tree defect. Source already aliases /api/health.php to /health.php before file passthrough, makes /api/index.php side-effect free so LiteSpeed cannot 500-loop it, and hides chrome on auth and legal routes. GitHub deploy already contains that tree. public_html is frozen until cPanel Update from Remote + Deploy HEAD (or ./deploy.sh) because CPANEL_TOKEN is empty in Actions." },
    ],
  },
]}