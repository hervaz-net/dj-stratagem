import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "../static/fonts");
mkdirSync(out, { recursive: true });

const files = [
  ["@fontsource/barlow/files/barlow-latin-400-normal.woff2", "barlow-400.woff2"],
  ["@fontsource/barlow/files/barlow-latin-500-normal.woff2", "barlow-500.woff2"],
  ["@fontsource/barlow/files/barlow-latin-600-normal.woff2", "barlow-600.woff2"],
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2", "barlow-condensed-600.woff2"],
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2", "barlow-condensed-700.woff2"],
  ["@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", "ibm-plex-mono-400.woff2"],
  ["@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", "ibm-plex-mono-500.woff2"],
];

for (const [from, to] of files) {
  copyFileSync(join(root, "node_modules", from), join(out, to));
}
