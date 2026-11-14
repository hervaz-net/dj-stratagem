import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import CookieConsent from "../components/CookieConsent";
import { HOME, concepts } from "./content";
import PreviewBar from "./PreviewBar";
import "./preview.css";

export default function PreviewShell({ id, children }) {
  const concept = concepts.find((c) => c.id === id);
  const [params] = useSearchParams();
  const chrome = params.get("chrome") !== "0";

  return (
    <>
      <Seo title={`${concept.name} — design preview`} description={HOME.description} noindex />
      <meta name="robots" content="noindex, nofollow" />
      <div className={concept.rootClass} data-preview={concept.id}>
        <a className="pv-skip" href="#content">
          Skip to content
        </a>
        {chrome && <PreviewBar current={id} />}
        {children}
      </div>
      <CookieConsent />
    </>
  );
}
