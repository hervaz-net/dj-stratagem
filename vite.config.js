import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind stays active alongside Foundation only until every page has
// been migrated off it (tracked in the Foundation-migration task list) —
// remove this plugin and the `@import "tailwindcss"` line in index.scss
// together, in the same commit that converts the last page.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    // Foundation's form styles include a legacy IE9 "@media (min-width: 0\0)"
    // hack that lightningcss's strict parser otherwise rejects outright.
    // errorRecovery strips invalid-but-harmless rules like this instead of
    // failing the build.
    lightningcss: { errorRecovery: true },
  },
})
