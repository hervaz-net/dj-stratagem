#!/usr/bin/env node
// The nine subagents are listed in three places that must agree: the site
// (src/data/subagents.js), the dashboard (src/api/jobs.js) and the server
// (public/api/jobs-lib.php). A mismatch makes job creation fail with
// "Unknown subagent", so the build stops here instead.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const site = [...read("src/data/subagents.js").matchAll(/key: "(\w+)".*?name: "([^"]+)", stage: "(\w+)"/g)];
const dash = [...read("src/api/jobs.js").matchAll(/\{ key: "(\w+)", name: "([^"]+)", stage: "(\w+)" \}/g)];
const php = [...read("public/api/jobs-lib.php").matchAll(/'(\w+)'\s*=> \['name' => '([^']+)',\s*'stage' => '(\w+)'/g)];

const fmt = (list) => list.map((m) => `${m[1]}:${m[2]}:${m[3]}`).join(", ");
const lists = { "src/data/subagents.js": fmt(site), "src/api/jobs.js": fmt(dash), "public/api/jobs-lib.php": fmt(php) };
const values = Object.values(lists);

if (site.length !== 9 || values.some((v) => v !== values[0])) {
  console.error("check-subagents: the subagent lists disagree (key:name:stage, in order):");
  for (const [file, v] of Object.entries(lists)) console.error(`  ${file}\n    ${v || "(none found)"}`);
  process.exit(1);
}
console.log(`check-subagents: ok (${site.length} subagents in sync)`);
