import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { HOME, concepts } from "./content";
import "./preview-index.css";

export default function PreviewIndex() {
  return (
    <div className="pv-index">
      <Seo title="Homepage design previews" description={HOME.description} noindex />
      <meta name="robots" content="noindex, nofollow" />
      <main id="content">
        <p>Design previews · not the live homepage · noindex</p>
        <h1>Three ways to redesign the homepage.</h1>
        <p className="pv-index-lead">
          The page at / is unchanged. These concepts use the current copy, including the labeled example workspace, and they are not linked from the site navigation.
        </p>
        <div className="pv-index-grid">
          {concepts.map((concept) => (
            <article key={concept.id}>
              <h2>{concept.name}</h2>
              <p>{concept.summary}</p>
              <p>{concept.rationale}</p>
              <ul className="pv-swatches" aria-label={`${concept.name} palette`}>
                {concept.palette.map((swatch) => (
                  <li key={swatch.hex}>
                    <i style={{ background: swatch.hex }} aria-hidden="true" />
                    {swatch.name}
                  </li>
                ))}
              </ul>
              <p>{concept.fonts.map((font) => `${font.role}: ${font.name}`).join(" · ")}</p>
              <Link to={concept.path}>Open {concept.name}</Link>
            </article>
          ))}
        </div>
        <footer>
          <Link to="/">Back to the live homepage</Link>
        </footer>
      </main>
    </div>
  );
}
