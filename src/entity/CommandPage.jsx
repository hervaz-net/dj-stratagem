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
    ? `${market[0].trade} work in ${market[0].city}`
    : "Send a pursuit";
  const title = view === "project"
    ? (project ? `${project.trade} pursuit in ${project.city}` : "Send a pursuit")
    : view === "market"
      ? marketTitle
      : cap?.label || "Desk";
  const description = view === "project"
    ? (project ? `Send a ${project.trade.toLowerCase()} pursuit in ${project.city}. A person replies.` : "Send the trade, the city, and the scope.")
    : view === "market"
      ? (market.length
        ? `Send a ${market[0].trade.toLowerCase()} pursuit in ${market[0].city}. A person replies.`
        : "Send the trade, the city, and the scope.")
      : cap?.voice || "DJ Stratagem command desk.";

  return (
    <>
      <Seo title={title} description={description} noindex={view === "project" && !project} />
      <CommandDesk moduleId={cap?.id || "projects"} view={view} focusOnChange />
    </>
  );
}
