import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import Shell from "./Shell";
import Fleet from "./pages/Fleet";
import Venture from "./pages/Venture";
import { BRANDS } from "./brands";

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

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/fleet" element={<Shell brand={BRANDS.fleet}><Fleet brand={BRANDS.fleet} /></Shell>} />
        {["capital", "studio", "workforce"].map((slug) => (
          <Route key={slug} path={BRANDS[slug].path} element={<Shell brand={BRANDS[slug]}><Venture brand={BRANDS[slug]} /></Shell>} />
        ))}
        <Route path="/companies/:slug" element={<LegacyCompany />} />
        <Route path="*" element={<Navigate to="/fleet" replace />} />
      </Routes>
    </>
  );
}
