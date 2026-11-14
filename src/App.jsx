import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import SiteNav from "./shared/SiteNav.jsx";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import CookieConsent from "./components/CookieConsent";
import ReadingProgress from "./components/ReadingProgress";
import CommandPalette from "./components/CommandPalette";
import Home from "./entity/Home";
import Services from "./entity/Services";
import CommandPage from "./entity/CommandPage";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Changelog from "./pages/Changelog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import BrandGuidelines from "./pages/BrandGuidelines";
import FleetCards from "./pages/FleetCards";
import Receipts from "./pages/Receipts";
import Signage from "./pages/Signage";
import NotFound from "./pages/NotFound";
import SuppliersDashboard from "./pages/dashboard/Suppliers";
import AdminUsers from "./pages/dashboard/Admin";
import Overview from "./pages/dashboard/Overview";
import Bids from "./pages/dashboard/Bids";
import BidsCompact from "./pages/dashboard/BidsCompact";
import Orders from "./pages/dashboard/Orders";
import Analytics from "./pages/dashboard/Analytics";
import Alerts from "./pages/dashboard/Alerts";
import Settings from "./pages/dashboard/Settings";
import Jobs from "./pages/dashboard/Jobs";
import Approvals from "./pages/dashboard/Approvals";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import { ToastProvider } from "./contexts/ToastContext";
import useAuth from "./auth/useAuth";
import { AdminGate } from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminMemberDetail from "./pages/admin/AdminMemberDetail";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminCatalog from "./pages/admin/AdminCatalog";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      if (hash && /^#[A-Za-z][\w:-]*$/.test(hash)) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView();
          return;
        }
      }
      window.scrollTo(0, 0);
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}

const SkipLink = () => (
  <a
    href="#main"
    className="sr-only rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-fg shadow-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
  >
    Skip to content
  </a>
);

/** Public marketing pages: site navbar, footer, back-to-top, cookie banner, floating CTA. */
function MarketingLayout({ children, siteFooter = true }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { user, loading } = useAuth();
  const account = {
    signedIn: !loading && !!user,
    dashboardHref: "/dashboard/overview",
    signInHref: "/login",
    joinHref: "/register",
  };

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <SkipLink />
      <SiteNav app="parent" account={account} onOpenPalette={openPalette} />
      <main id="main" className="site-main flex-1">
        {children}
      </main>
      {siteFooter && <Footer />}
      <BackToTop />
      <CookieConsent />
      <ReadingProgress />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}

/** Dashboard brings its own sidebar and header, so the site chrome is omitted. */
function DashboardShell({ children }) {
  return (
    <>
      <SkipLink />
      <main id="main">{children}</main>
    </>
  );
}

function CommandLayout({ children }) {
  return (
    <>
      <SkipLink />
      <main id="main">{children}</main>
      <CookieConsent />
    </>
  );
}

function RedirectTo({ to }) {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

function ProjectRedirect() {
  const { slug } = useParams();
  const { search, hash } = useLocation();
  return <Navigate to={`/command/projects/${slug}${search}${hash}`} replace />;
}

function MarketRedirect() {
  const { city, trade } = useParams();
  const { search, hash } = useLocation();
  return <Navigate to={`/command/projects/markets/${city}/${trade}${search}${hash}`} replace />;
}

function CompanyRedirect() {
  const { slug } = useParams();
  const { search, hash } = useLocation();
  const known = ["capital", "studio", "workforce", "fleet", "exchange", "projects", "platform", "solutions", "supply"];
  const to = known.includes(slug) ? `/command/${slug}` : "/";
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

/** Leave this app for a URL the server (or another bundle) owns. */
function FullLoad({ to }) {
  const { search, hash } = useLocation();
  useEffect(() => {
    window.location.replace(`${to}${search}${hash}`);
  }, [to, search, hash]);
  return (
    <p className="px-6 py-24 text-center text-sm text-fg-muted" role="status">
      Opening this page…
    </p>
  );
}

function ExchangeAlias() {
  const { pathname, search, hash } = useLocation();
  const rest = pathname.replace(/^\/exchange/, "") || "/";
  const exact = {
    "/": "/command/exchange",
    "/platform": "/command/platform",
    "/solutions": "/command/solutions",
    "/supply": "/command/supply",
    "/projects": "/command/projects",
    "/fleet": "/command/fleet",
    "/about": "/about",
    "/about-us": "/about",
    "/company": "/about",
    "/team": "/about",
    "/contact": "/contact",
    "/contact-us": "/contact",
    "/pricing": "/pricing",
    "/features": "/services",
    "/product": "/services",
    "/services": "/services",
    "/how-it-works": "/services",
    "/howitworks": "/services",
    "/partners": "/command/solutions",
    "/project": "/command/projects",
    "/home": "/",
    "/equipment": "/command/fleet",
  };
  const project = rest.match(/^\/projects\/([^/]+)$/);
  const market = rest.match(/^\/construction-projects\/([^/]+)\/([^/]+)$/);
  const to = project
    ? `/command/projects/${project[1]}`
    : market
      ? `/command/projects/markets/${market[1]}/${market[2]}`
      : exact[rest];
  useEffect(() => {
    // Marketplace, accounts, and the signed-in tools are the Exchange bundle.
    // A client-side miss would bounce them back to the desk.
    if (!to) window.location.replace(`${pathname}${search}${hash}`);
  }, [to, pathname, search, hash]);
  if (!to) {
    return <p className="px-6 py-24 text-center text-sm text-fg-muted" role="status">Opening this page…</p>;
  }
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ScrollToTop />
        <Routes>
          <Route
            path="/dashboard/*"
            element={
              <RequireAuth>
                <DashboardShell>
                  <Routes>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="jobs" element={<Jobs />} />
                    <Route path="approvals" element={<Approvals />} />
                    <Route path="suppliers" element={<SuppliersDashboard />} />
                    <Route path="bids" element={<Bids />} />
                    <Route path="bids-compact" element={<BidsCompact />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="alerts" element={<Alerts />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="admin" element={<AdminUsers />} />
                    <Route path="*" element={<Navigate to="overview" replace />} />
                  </Routes>
                </DashboardShell>
              </RequireAuth>
            }
          />

          {/* The homepage draws its own footer but shares the site nav. */}
          <Route path="/" element={<MarketingLayout><Home /></MarketingLayout>} />
          <Route path="/services" element={<MarketingLayout><Services /></MarketingLayout>} />
          <Route path="/command" element={<CommandLayout><CommandPage /></CommandLayout>} />
          <Route path="/command/projects/markets/:city/:trade" element={<CommandLayout><CommandPage view="market" /></CommandLayout>} />
          <Route path="/command/projects/:slug" element={<CommandLayout><CommandPage view="project" /></CommandLayout>} />
          <Route path="/command/:module" element={<CommandLayout><CommandPage /></CommandLayout>} />
          <Route path="/pricing" element={<MarketingLayout><Pricing /></MarketingLayout>} />
          <Route path="/about" element={<MarketingLayout><About /></MarketingLayout>} />
          <Route path="/contact" element={<MarketingLayout><Contact /></MarketingLayout>} />
          <Route path="/login" element={<MarketingLayout><Login /></MarketingLayout>} />
          <Route path="/register" element={<MarketingLayout><Register /></MarketingLayout>} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          {/* Admin control panel: its own shell; AdminGate sends non-admins away. */}
          <Route path="/admin" element={<AdminGate><AdminOverview /></AdminGate>} />
          <Route path="/admin/members" element={<AdminGate><AdminMembers /></AdminGate>} />
          <Route path="/admin/members/:id" element={<AdminGate><AdminMemberDetail /></AdminGate>} />
          <Route path="/admin/jobs" element={<AdminGate><AdminJobs /></AdminGate>} />
          <Route path="/admin/catalog" element={<AdminGate><AdminCatalog /></AdminGate>} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="/bids" element={<RedirectTo to="/command/projects" />} />
          <Route path="/resources" element={<MarketingLayout><Resources /></MarketingLayout>} />
          <Route path="/help" element={<Navigate to="/resources" replace />} />
          <Route path="/faq" element={<Navigate to="/resources" replace />} />
          <Route path="/faqs" element={<Navigate to="/resources" replace />} />
          <Route path="/support" element={<Navigate to="/resources" replace />} />
          <Route path="/profile" element={<Navigate to="/dashboard/settings" replace />} />
          <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
          <Route path="/forgot-password" element={<MarketingLayout><ForgotPassword /></MarketingLayout>} />
          <Route path="/reset-password" element={<MarketingLayout><ResetPassword /></MarketingLayout>} />
          <Route path="/verify-email" element={<MarketingLayout><VerifyEmail /></MarketingLayout>} />
          <Route path="/changelog" element={<MarketingLayout><Changelog /></MarketingLayout>} />
          <Route path="/privacy" element={<MarketingLayout><PrivacyPolicy /></MarketingLayout>} />
          <Route path="/terms" element={<MarketingLayout><TermsAndConditions /></MarketingLayout>} />
          <Route path="/brand" element={<MarketingLayout><BrandGuidelines /></MarketingLayout>} />
          <Route path="/companies" element={<Navigate to="/" replace />} />
          <Route path="/projects/:slug" element={<ProjectRedirect />} />
          <Route path="/projects" element={<RedirectTo to="/command/projects" />} />
          <Route path="/construction-projects/:city/:trade" element={<MarketRedirect />} />
          <Route path="/companies/:slug" element={<CompanyRedirect />} />
          {["platform", "solutions", "supply", "fleet", "capital", "studio", "workforce", "exchange"].map((slug) => (
            <Route key={slug} path={`/${slug}`} element={<RedirectTo to={`/command/${slug}`} />} />
          ))}
          {["fleet", "capital", "studio", "workforce"].map((slug) => (
            <Route key={`${slug}-rest`} path={`/${slug}/*`} element={<RedirectTo to={`/command/${slug}`} />} />
          ))}
          <Route path="/exchange/projects/:slug" element={<ProjectRedirect />} />
          <Route path="/exchange/projects" element={<RedirectTo to="/command/projects" />} />
          <Route path="/exchange/platform" element={<RedirectTo to="/command/platform" />} />
          <Route path="/exchange/solutions" element={<RedirectTo to="/command/solutions" />} />
          <Route path="/exchange/supply" element={<RedirectTo to="/command/supply" />} />
          <Route path="/exchange/fleet" element={<RedirectTo to="/command/fleet" />} />
          <Route path="/exchange/about" element={<RedirectTo to="/about" />} />
          <Route path="/exchange/contact" element={<RedirectTo to="/contact" />} />
          <Route path="/exchange/pricing" element={<RedirectTo to="/pricing" />} />
          <Route path="/exchange/construction-projects/:city/:trade" element={<MarketRedirect />} />
          <Route path="/marketing/fleet-cards" element={<MarketingLayout><FleetCards /></MarketingLayout>} />
          <Route path="/marketing/receipts" element={<MarketingLayout><Receipts /></MarketingLayout>} />
          <Route path="/marketing/signage" element={<MarketingLayout><Signage /></MarketingLayout>} />
          {/* Same aliases as public/.htaccess, so an in-app link doesn't 404 while a full load redirects. */}
          {[
            ["/signin", "/login"],
            ["/sign-in", "/login"],
            ["/log-in", "/login"],
            ["/account", "/login"],
            ["/sign-up", "/register"],
            ["/trial", "/register"],
            ["/start", "/register"],
            ["/get-started", "/register"],
            ["/join", "/register"],
            ["/forgot", "/forgot-password"],
            ["/reset", "/forgot-password"],
            ["/password", "/forgot-password"],
            ["/about-us", "/about"],
            ["/company", "/about"],
            ["/team", "/about"],
            ["/status", "/about"],
            ["/security", "/about"],
            ["/investors", "/about"],
            ["/accessibility", "/about"],
            ["/a11y", "/about"],
            ["/contact-us", "/contact"],
            ["/demo", "/contact"],
            ["/book", "/contact"],
            ["/book-demo", "/contact"],
            ["/request-demo", "/contact"],
            ["/careers", "/contact"],
            ["/jobs", "/contact"],
            ["/help", "/resources"],
            ["/support", "/resources"],
            ["/faq", "/resources"],
            ["/faqs", "/resources"],
            ["/resource", "/resources"],
            ["/privacy-policy", "/privacy"],
            ["/cookies", "/privacy"],
            ["/cookie", "/privacy"],
            ["/cookie-policy", "/privacy"],
            ["/gdpr", "/privacy"],
            ["/unsubscribe", "/privacy"],
            ["/terms-of-service", "/terms"],
            ["/tos", "/terms"],
            ["/legal", "/terms"],
            ["/eula", "/terms"],
            ["/brand-guidelines", "/brand"],
            ["/blog", "/changelog"],
            ["/docs", "/changelog"],
            ["/news", "/changelog"],
            ["/press", "/changelog"],
            ["/features", "/services"],
            ["/product", "/services"],
            ["/how-it-works", "/services"],
            ["/howitworks", "/services"],
            ["/home", "/"],
            ["/partners", "/command/solutions"],
            ["/project", "/command/projects"],
            ["/bid", "/command/projects"],
            ["/profile", "/dashboard/settings"],
            ["/settings", "/dashboard/settings"],
          ].map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="/blog/*" element={<Navigate to="/changelog" replace />} />
          {[
            ["/marketplace", "/exchange/marketplace"],
            ["/contractors", "/exchange/contractors"],
            ["/distributors", "/exchange/distributors"],
            ["/suppliers", "/exchange/suppliers"],
            ["/shop", "/exchange/marketplace"],
            ["/catalog", "/exchange/marketplace"],
            ["/supplier", "/exchange/suppliers"],
            ["/equipment", "/command/fleet"],
          ].map(([from, to]) => (
            <Route key={from} path={from} element={to.startsWith("/command") ? <Navigate to={to} replace /> : <FullLoad to={to} />} />
          ))}
          <Route path="/exchange/*" element={<ExchangeAlias />} />
          <Route path="*" element={<MarketingLayout><NotFound /></MarketingLayout>} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
