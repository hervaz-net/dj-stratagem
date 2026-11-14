import { Link } from "react-router-dom";
import { concepts } from "./content";

export default function PreviewBar({ current }) {
  return (
    <nav className="pv-bar" aria-label="Design previews">
      <span>Design preview · not the live homepage · noindex</span>
      {concepts.map((c) => (
        <Link key={c.id} to={c.path} aria-current={c.id === current ? "page" : undefined}>
          {c.name}
        </Link>
      ))}
      <Link to="/">Live site</Link>
    </nav>
  );
}
