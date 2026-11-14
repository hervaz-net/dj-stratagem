import { openCookieSettings } from "../components/CookieConsent";
import { footerColumns } from "./content";
import SiteLink from "./SiteLink";

export default function FooterNav({ listClass, titleClass, linkClass }) {
  return footerColumns.map((col) => (
    <nav key={col.title} aria-label={col.title} className={listClass}>
      <span className={titleClass}>{col.title}</span>
      {col.links.map((item) =>
        item.cookies ? (
          <button key={item.label} type="button" className={linkClass} onClick={openCookieSettings}>
            {item.label}
          </button>
        ) : item.href.startsWith("mailto:") ? (
          <a key={item.label} className={linkClass} href={item.href}>
            {item.label}
          </a>
        ) : (
          <SiteLink key={item.label} className={linkClass} to={item.href}>
            {item.label}
          </SiteLink>
        ),
      )}
    </nav>
  ));
}
