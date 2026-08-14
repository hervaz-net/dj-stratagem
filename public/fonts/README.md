# Self-hosted webfonts

`fonts.css` plus the `.woff2` files next to it replace what used to be a
`fonts.googleapis.com` stylesheet link in `index.html` and in all six exported
document pages.

## Why

- **Privacy.** A Google Fonts link discloses every visitor's IP address to a
  third party on page load, before they have accepted anything. For a site
  that ships a cookie banner and a privacy policy, that is an awkward
  contradiction — and German courts have ruled it a GDPR violation.
- **Reliability.** The document pages already had one hard third-party runtime
  dependency (see `../vendor/README.md`); no reason to keep a second.
- **Speed.** Removes two DNS lookups and a TLS handshake from the critical
  path. `index.html` preloads the 400-weight Inter file, which is the face
  most of the first paint uses.

## What is here

Latin subsets from [@fontsource](https://fontsource.org) v5.3.0, which
repackages the upstream Google Fonts releases under the same OFL licence.
Only the weights the site actually requests are included — 188 KB total.

| Family | Weights | Used by |
|---|---|---|
| Inter | 400, 500, 600, 700 | the React app |
| Archivo | 400, 600, 800 | privacy, terms, brand sheets |
| Courier Prime | 400, 700 | marketing sheets |

## Adding a weight or family

```sh
npm pack @fontsource/<family>@5
tar xzf fontsource-<family>-5.3.0.tgz
cp package/files/<family>-latin-<weight>-normal.woff2 public/fonts/
```

Then add a matching `@font-face` block to `fonts.css`. Keep `font-display:
swap` — it preserves the behaviour of the `&display=swap` parameter the old
Google Fonts URLs carried, so text paints immediately in the fallback face.

Only latin subsets are vendored. If the site ever needs latin-ext, Cyrillic,
or Greek coverage, copy those files too and add `unicode-range` descriptors so
browsers download only what a given page needs.

## Note on the exported document pages

The `public/*.html` documents are tool exports. This edit — like the React
change in `../vendor/README.md` — is applied to the exported output. If those
documents are ever re-exported, re-apply both, or the pages will go back to
fetching from third parties.
