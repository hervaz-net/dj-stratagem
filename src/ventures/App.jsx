import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import Shell from "./Shell";
import Fleet from "./pages/Fleet";
import Venture from "./pages/Venture";
import { BRANDS } from "./brands";
import { SUBAGENT_SITES as S } from "../subagents/sites";
import { appForPath } from "../shared/siteNav.js";
import SubagentNotFound from "../subagents/pages/SubagentNotFound";
import Projects from "../subagents/pages/Projects";
import ProjectDetail from "../subagents/pages/ProjectDetail";
import TradeLocation from "../subagents/pages/TradeLocation";
import Platform from "../subagents/pages/Platform";
import Solutions from "../subagents/pages/Solutions";
import Supply from "../subagents/pages/Supply";

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

/** Old /companies/:slug links land on the company's own address. */
function LegacyCompany() {
  const { slug } = useParams();
  const brand = BRANDS[slug];
  if (!brand) {
    window.location.replace("/");
    return null;
  }
  return <Navigate to={brand.path} replace />;
}

/**
 * A link into the main site or Exchange (a shared component's router Link,
 * say) lands here: load the real page. An unknown address under a subagent
 * gets that subagent's 404.
 */
function Elsewhere() {
  const { pathname, search, hash } = useLocation();
  const local = appForPath(pathname) === "venture";
  useEffect(() => {
    if (!local) window.location.replace(`${pathname}${search}${hash}`);
  }, [local, pathname, search, hash]);
  if (!local) return null;
  const key = pathname.split("/")[1] === "construction-projects" ? "projects" : pathname.split("/")[1];
  const brand = S[key] ?? BRANDS[key] ?? BRANDS.fleet;
  return <Shell brand={brand}><SubagentNotFound brand={brand} /></Shell>;
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/fleet" element={<Shell brand={BRANDS.fleet}><Fleet brand={BRANDS.fleet} /></Shell>} />
        {["capital", "studio", "workforce"].map((slug) => (
          <Route key={slug} path={BRANDS[slug].path} element={<Shell brand={BRANDS[slug]}><Venture brand={BRANDS[slug]} /></Shell>} />
        ))}
        <Route path="/projects" element={<Shell brand={S.projects}><Projects brand={S.projects} /></Shell>} />
        <Route path="/projects/:slug" element={<Shell brand={S.projects}><ProjectDetail brand={S.projects} /></Shell>} />
        <Route path="/construction-projects/:city/:trade" element={<Shell brand={S.projects}><TradeLocation brand={S.projects} /></Shell>} />
        <Route path="/platform" element={<Shell brand={S.platform}><Platform brand={S.platform} /></Shell>} />
        <Route path="/solutions" element={<Shell brand={S.solutions}><Solutions brand={S.solutions} /></Shell>} />
        <Route path="/supply" element={<Shell brand={S.supply}><Supply brand={S.supply} /></Shell>} />
        <Route path="/companies/:slug" element={<LegacyCompany />} />
        <Route path="*" element={<Elsewhere />} />
      </Routes>
    </>
  );
}
