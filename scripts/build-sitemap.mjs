#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml from the routes the app actually serves.
 *
 * The sitemap was hand-maintained and had already drifted — it listed seven
 * URLs while the app served twenty-odd, and it would have gone stale again the
 * moment a project or landing page was added. Generating it from the same data
 * module the pages render keeps the two in step.
 *
 * Runs automatically as part of `npm run build`.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Imported rather than duplicated, so new projects appear without edits here.
const { projects, landingPairs } = await import(
  resolve(root, "src/data/sampleProjects.js")
);

const SITE = "https://djstratageminc.com";

/** Static marketing routes. Auth and dashboard paths stay out — robots.txt
 *  disallows them and they carry no search value. */
const staticPaths = [
  ["/", "1.0"],
  ["/projects", "0.9"],
  ["/platform", "0.8"],
  ["/solutions", "0.8"],
  ["/supply", "0.8"],
  ["/fleet", "0.7"],
  ["/pricing", "0.8"],
  ["/about", "0.6"],
  ["/contact", "0.6"],
  ["/changelog", "0.4"],
  ["/privacy", "0.3"],
  ["/terms", "0.3"],
  ["/brand", "0.3"],
];

const urls = [
  ...staticPaths.map(([path, priority]) => ({ path, priority })),
  ...projects.map((p) => ({ path: `/projects/${p.slug}`, priority: "0.7" })),
  ...landingPairs().map((p) => ({
    path: `/construction-projects/${p.citySlug}/${p.tradeSlug}`,
    priority: "0.7",
  })),
];

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, priority }) =>
      `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;

const out = resolve(root, "public/sitemap.xml");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, xml);
console.log(`sitemap: ${urls.length} URLs -> public/sitemap.xml`);
