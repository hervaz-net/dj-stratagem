import { Link } from "react-router-dom";

/** Venture and Exchange routes are separate apps and need a full page load. */
const FULL_LOAD = /^\/(exchange|fleet|capital|studio|workforce|platform|solutions|supply|projects|construction-projects)(\/|$)/;

export default function SiteLink({ to, children, ...rest }) {
  const path = String(to).split(/[?#]/)[0];
  if (FULL_LOAD.test(path)) {
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} {...rest}>
      {children}
    </Link>
  );
}
