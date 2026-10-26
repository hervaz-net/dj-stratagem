# Project state: djstratageminc.com

Single source of truth for anyone (person or Claude thread) starting work on
this repo. Read this first. Update it when something here stops being true.

## Ground rules

- **`main` is the site.** Every change starts from the latest `main` and comes
  back through one pull request. Do not start from an older branch or another
  thread's branch.
- **One task, one branch, one PR.** Delete the branch after it merges.
- **The `deploy` branch is build output.** GitHub Actions writes it on every
  push to `main`. Never edit it or branch from it.
- History before 26 Oct 2026 was rewritten. Branches cut before then share no
  history with `main` and cannot be merged. Their work is already in `main`.

## Baseline (26 Oct 2026)

| | Commit | Notes |
| --- | --- | --- |
| Live site | `9d45120` | Bundle `assets/index-C1o7REja.js` on djstratageminc.com |
| `main` at cleanup | `9b6f30b` | Adds help center and saved projects (#239), Exchange tokens as the only design tokens (#240) |

`main` is ahead of live until cPanel pulls the new `deploy` (see Deploy).

## What the site is

- **Parent site** (`src/App.jsx`, `src/pages`): D&J Stratagem, Inc., branded
  **Stratagem AI**: "Build the pipeline, not the paperwork." Nine subagents
  under one account: Projects, Exchange, Platform, Solutions, Supply, Capital,
  Workforce, Fleet, Studio. Also home to sign-in, `/dashboard/*`, `/admin`, and
  the help center.
- **Subagent sites** (`src/subagents`, `src/ventures`, `src/exchange`): one page
  set per subagent (`/projects`, `/exchange`, `/platform`, `/solutions`,
  `/supply`, `/fleet`, …), all on the Exchange look.
- **Backend:** PHP in `public/api` on Namecheap shared hosting (MySQL).
  Stratagem AI jobs run on the Claude API once an admin approves them.

## Stack and commands

React 19, Vite, React Router, Tailwind CSS v4, oxlint. Node 22.

```
npm ci
npm run dev      # local site, no PHP
npm run lint
npm run build    # also checks subagents, rebuilds sitemap, verifies dist
```

## Design

Light-only. Colors and type come from the Exchange tokens
(`src/shared/tokens.css`, `src/index.css`); see `DESIGN_SYSTEM.md`. Never
hard-code hex values in components.

## Deploy

1. Merge to `main`. Actions builds and pushes the `deploy` branch.
2. The host pulls `deploy`. This step fails while the `CPANEL_TOKEN` repo
   secret is empty, so today it is manual: cPanel → Git Version Control →
   `dj-stratagem` → Update from Remote → Deploy HEAD Commit, or `./deploy.sh`
   on a machine with `~/.cpanel_token`.
3. Check: the live page's `assets/index-*.js` name matches `index.html` on the
   `deploy` branch.

## Open items

- Add the `CPANEL_TOKEN` repo secret so deploys stop lagging `main`.
- Stratagem AI needs its API key and cron job on the server before approved
  jobs run (README, "Jobs and subagents").
- The blog stays unpublished until its posts fit the current product
  (`PROOF.md`, "Still outstanding").
- Pricing figures are placeholders.
- Old branches: run `scripts/cleanup-branches.sh` (it archives, then deletes).
