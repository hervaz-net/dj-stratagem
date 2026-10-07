import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PRODUCT, SITE_URL } from "../brand";

const SITE = SITE_URL;
const SUFFIX = PRODUCT;
const DEFAULT_DESCRIPTION =
  "The B2B supply network for construction. Manufacturers sell to distributors, distributors sell to contractors, and contractors post what the job needs, all on one marketplace.";

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [key, val] = selector.replace(/^meta\[|\]$/g, "").split("=");
    el.setAttribute(key, val.replace(/"/g, ""));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

/**
 * Per-route document metadata. Every page previously shared the single
 * <title> and description baked into index.html, so search results and
 * shared links looked identical no matter which page was sent.
 */
export default function Seo({ title, description, noindex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SUFFIX}` : SUFFIX;
    // BrowserRouter basename is /exchange, so pathname is "/" on the
    // Exchange home and "/pricing" on Exchange pricing. Prefix the base or
    // canonical and og:url point at the parent site (homepage or /pricing).
    const path = pathname === "/" ? "/exchange" : `/exchange${pathname}`;
    const url = `${SITE}${path}`;

    document.title = fullTitle;
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:site_name"]', "content", SUFFIX);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:url"]', "content", url);

    // Always write it — otherwise a route that omits `description` would
    // leave the previous route's text in the head.
    const desc = description ?? DEFAULT_DESCRIPTION;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[name="twitter:description"]', "content", desc);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    const robots = document.head.querySelector('meta[name="robots"]');
    if (noindex) {
      setMeta('meta[name="robots"]', "content", "noindex, nofollow");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, noindex, pathname]);

  return null;
}
