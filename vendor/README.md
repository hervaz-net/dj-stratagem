# Vendored runtime dependencies

`react.production.min.js` and `react-dom.production.min.js` are the React 18.3.1
UMD builds, served from our own origin.

## Why these are here

The exported document pages — `privacy.html`, `terms.html`,
`brand-guidelines.html`, and the `/marketing/*` sheets — are driven by
`support.js`, which ends with:

```js
hideRawTemplate();
loadReactUmd().then(init).catch(...)
```

`hideRawTemplate()` hides the document body, and `init` reveals it only after
React resolves. `loadReactUmd()` originally fetched React and ReactDOM from
`unpkg.com`.

That made every one of those pages invisible whenever unpkg was slow,
blocked, or down — including the Privacy Policy and Terms, which are the pages
most likely to be requested by someone who needs them to work. The documents
contain no React or JSX at all; they are static HTML gated behind a
third-party fetch that served no purpose for them.

Serving the same files from our own origin removes the dependency. Nothing
about the authoring workflow changes.

## Notes

- SRI hashes were cleared alongside the URL change. Subresource integrity
  guards against a compromised third-party CDN; against same-origin files it
  only adds a way for the page to break if the file is ever re-minified.
  `loadScript` skips both `integrity` and `crossOrigin` when the value is
  empty, which is correct for same-origin.
- `BABEL_URL` still points at unpkg. `loadBabel()` has no call sites — it is
  dead configuration, not a live dependency — so it was left alone rather than
  vendoring a ~3 MB transpiler nothing loads. If a future document uses JSX
  and starts calling it, vendor Babel the same way before shipping.

## Updating

Pull the matching UMD build from npm rather than editing these by hand:

```sh
npm pack react@18.3.1 react-dom@18.3.1
# extract each tarball, then copy:
#   package/umd/react.production.min.js
#   package/umd/react-dom.production.min.js
```

Keep the two versions in step with each other.
