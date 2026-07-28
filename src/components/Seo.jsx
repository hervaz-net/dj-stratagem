import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://djstratageminc.com";
const SUFFIX = "D&J Stratagem, Inc.";
const DEFAULT_DESCRIPTION =
  "The operating system for construction growth — bidding, marketing, CRM, and AI tools that help contractors win more work and grow revenue.";

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
    const url = `${SITE}${pathname === "/" ? "/" : pathname}`;

    document.title = fullTitle;
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:url"]', "content", url);

    // Always write it — otherwise a route that omits `description` would
    // leave the previous route's text in the head.
    const desc = description ?? DEFAULT_DESCRIPTION;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:description"]', "content", desc);

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
