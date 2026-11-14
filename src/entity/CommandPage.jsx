import { useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { findProject, projectsFor } from "../data/sampleProjects";
import { capabilityById } from "./capabilities";
import CommandDesk from "./CommandDesk";

export default function CommandPage({ view = "module" }) {
  const params = useParams();
  const { hash } = useLocation();
  const moduleId = view === "module" ? (params.module || "projects") : "projects";
  const cap = capabilityById(moduleId);

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    document.getElementById(id)?.scrollIntoView();
  }, [hash, moduleId, view]);

  if (view === "module" && params.module && !cap) {
    return <Navigate to="/command/projects" replace />;
  }

  const project = view === "project" ? findProject(params.slug) : null;
  const market = view === "market" ? projectsFor(params.city, params.trade) : [];
  const marketTitle = market.length
    ? `${market[0].trade} Construction Projects in ${market[0].city}`
    : "Sample market";
  const title = view === "project"
    ? (project ? `${project.title} — ${project.city}, ${project.state}` : "Sample project")
    : view === "market"
      ? marketTitle
      : cap?.label || "Desk";
  const description = view === "project"
    ? (project ? `Sample card: ${project.summary}` : "That card is not on the sample board.")
    : view === "market"
      ? (market.length
        ? `Illustrative ${market[0].trade.toLowerCase()} project cards in ${market[0].city}, CA. Samples only — not live solicitations.`
        : "Sample market.")
      : cap?.voice || "DJ Stratagem command desk.";

  return (
    <>
      <Seo title={title} description={description} noindex={view === "project" && !project} />
      <CommandDesk moduleId={cap?.id || "projects"} view={view} focusOnChange />
    </>
  );
}
