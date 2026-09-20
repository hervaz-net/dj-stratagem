import { useState } from "react";

/**
 * Embeds a static document from /public without overflowing the marketing chrome.
 * If the host SPA-fallbacks the file to index.html, show a readable fallback
 * instead of nesting the marketing app inside itself.
 */
export default function DocFrame({ src, title }) {
  const [failed, setFailed] = useState(false);

  function onLoad(event) {
    const frame = event.currentTarget;
    try {
      const doc = frame.contentDocument;
      if (!doc) return;
      const looksLikeSpaShell =
        Boolean(doc.getElementById("root")) && !doc.querySelector("[data-doc]");
      if (looksLikeSpaShell) setFailed(true);
    } catch {
      /* same-origin only; ignore cross-origin */
    }
  }

  if (failed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber">Document</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-paper">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-steel">
          This page should load from <code className="text-paper">{src}</code>, but the live
          host is still serving the marketing shell for that file. The file is in source and
          on the GitHub <code className="text-paper">deploy</code> branch. After{" "}
          <code className="text-paper">./deploy.sh</code> or cPanel Update from Remote + Deploy
          HEAD, this document renders here.
        </p>
        <p className="mt-4 text-sm text-steel">
          Questions:{" "}
          <a className="font-medium text-amber hover:text-amber-2" href="mailto:hello@djstratageminc.com">
            hello@djstratageminc.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      onLoad={onLoad}
      className="block w-full border-0 bg-paper"
      style={{ height: "calc(100dvh - 8rem)", minHeight: "32rem" }}
    />
  );
}
