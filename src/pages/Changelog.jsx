import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.52",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Re-audit 19 Sep 2026 13:05 PDT: marketing routes render. Live bundle is still assets/index-BjqCrvkQ.js (public_html last-modified 19 Sep 10:26 UTC). /contact.php GET is 405 JSON. /health.php, /send-demo.php, /api/health.php, /api/me.php, /api/login.php, /manifest.webmanifest, /privacy.html, and /terms.html SPA-fallback to index.html. www does not 301 to apex. /help and /docs stay on the SPA shell instead of the LiteSpeed aliases. Contact chrome still shows hello@djstratagem.com because the live JS predates the inc.com source fix." },
      { type: "improved", text: "GitHub main cdcfefd builds assets/index-DelttQ7O.js. GitHub deploy HEAD 8e35b21 still advertises assets/index-BjqCrvkQ.js and is missing login.php, register.php, bootstrap.php, and the static legal HTML. Publish-deploy run 228 built a complete dist, left deploy unchanged, and skipped the host pull because CPANEL_TOKEN is empty." },
      { type: "improved", text: "CI now fails the refresh step when GitHub deploy index.html does not advertise the just-built hashed bundle, so a ruleset-blocked push cannot look like a successful publish." },
      { type: "fix", text: "No new React-tree defect. Source already aliases /suppliers, uses hello@djstratageminc.com, and keeps PHP off the SPA fallback. Production stays blocked on cPanel Update from Remote + Deploy HEAD after a full deploy-tree refresh." },
    ],
  },
