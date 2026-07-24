# D&J Stratagem, Inc. — marketing site

Marketing site for D&J Stratagem's construction bidding, procurement, and project
coordination platform. Built with React, Vite, React Router, and Tailwind CSS v4.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs to `dist/`.

## Deploying to Netlify

This repo includes `netlify.toml` (build command, publish dir, and the SPA
redirect needed for client-side routing). To deploy:

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
   Build settings are picked up automatically from `netlify.toml`.
3. Deploy.

### Contact form

The Contact page submits to [Netlify Forms](https://docs.netlify.com/forms/setup/).
This only works once the site is deployed on Netlify — the static form mirror in
`index.html` is what Netlify's build-time bot uses to detect and register the
form (`name="contact"`), and the real React form in `src/pages/Contact.jsx`
submits to it via `fetch`. Locally, submissions will fail with a 404 — that's
expected.

After the first deploy, go to **Site settings → Forms → Form notifications** in
the Netlify dashboard and add an email notification so submissions actually
reach an inbox — this step isn't configurable from code.
