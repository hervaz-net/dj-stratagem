import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, Link, useLocation, useParams } from "react-router-dom";
import SiteNav from "../shared/SiteNav.jsx";
import useAuth from "./auth/useAuth";
import Logo from "./components/Logo";
import { PRODUCT } from "./brand";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import CookieBanner from "./components/CookieBanner";
import ReadingProgress from "./components/ReadingProgress";
import CommandPalette from "./components/CommandPalette";
import Marketplace from "./pages/Marketplace";
import ForContractors from "./pages/ForContractors";
import ForDistributors from "./pages/ForDistributors";
import ForSuppliers from "./pages/ForSuppliers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Changelog from "./pages/Changelog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import BrandGuidelines from "./pages/BrandGuidelines";
import FleetCards from "./pages/FleetCards";
import Receipts from "./pages/Receipts";
import Signage from "./pages/Signage";
import NotFound from "./pages/NotFound";
import Network from "./pages/dashboard/Network";
import Requests from "./pages/dashboard/Requests";
import Catalog from "./pages/dashboard/Catalog";
import AdminUsers from "./pages/dashboard/Admin";
import Overview from "./pages/dashboard/Overview";
import Quotes from "./pages/dashboard/Quotes";
import Orders from "./pages/dashboard/Orders";
import Analytics from "./pages/dashboard/Analytics";
import Alerts from "./pages/dashboard/Alerts";
import Settings from "./pages/dashboard/Settings";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import { ToastProvider } from "./contexts/ToastContext";
import { RoleProvider } from "./contexts/RoleContext";
import { hideMarketingChrome } from "./chrome/formRoutes";

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

const OWN_SHELL_ROUTES = ["/login", "/register", "/forgot-password", "/verify-email"];

/** Password emails use the parent /reset-password page. Stay on Exchange and the token is dropped. */
function ToParentReset() {
  const { search, hash } = useLocation();
  useEffect(() => {
    window.location.replace(`/reset-password${search}${hash}`);
  }, [search, hash]);
  return (
    <p className="px-6 py-24 text-center text-sm text-fg-muted" role="status">
      Opening password reset…
    </p>
  );
}

/** Public marketing pages: site navbar, footer, back-to-top, cookie banner, floating CTA. */
function MarketingLayout({ children }) {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const account = {
    signedIn: !loading && !!user,
    dashboardHref: "/exchange/dashboard",
    signInHref: "/exchange/login",
    joinHref: "/exchange/register",
  };
  const hideChrome = hideMarketingChrome(pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    if (hideChrome) return undefined;
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hideChrome]);

  // Auth and legal forms render without site chrome. Auth pages bring their
  // own shell with a home link; everything else gets a slim header.
  if (hideChrome) {
    const ownShell = OWN_SHELL_ROUTES.includes(pathname.replace(/\/+$/, ""));
    return (
      <div className="flex min-h-screen flex-col">
        <SkipLink />
        {!ownShell && (
          <header className="no-print border-b border-line bg-surface">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-6">
              <Link to="/" aria-label={`${PRODUCT} home`}>
                <Logo />
              </Link>
              <div className="flex items-center gap-2">
                <Link to="/" className="rounded-full px-3 py-1.5 text-sm font-medium text-fg-muted hover:bg-subtle hover:text-fg">
                  Back to site
                </Link>
              </div>
            </div>
          </header>
        )}
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <SiteNav app="exchange" account={account} onOpenPalette={openPalette} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <CookieBanner />
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

/** Persona and duplicate marketing URLs belong to the one desk on the parent site. */
function Leave({ to }) {
  const params = useParams();
  const { search, hash } = useLocation();
  useEffect(() => {
    const path = to
      .replace(":slug", params.slug || "")
      .replace(":city", params.city || "")
      .replace(":trade", params.trade || "");
    window.location.replace(`${path}${search}${hash}`);
  }, [to, params.slug, params.city, params.trade, search, hash]);
  return (
    <p className="px-6 py-24 text-center text-sm text-fg-muted" role="status">
      Opening the desk…
    </p>
  );
}

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
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
                    <Route path="requests" element={<Requests />} />
                    <Route path="quotes" element={<Quotes />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="catalog" element={<Catalog />} />
                    <Route path="network" element={<Network />} />
                    {/* Pre-rebrand paths */}
                    <Route path="bids" element={<Navigate to="/dashboard/quotes" replace />} />
                    <Route path="bids-compact" element={<Navigate to="/dashboard/quotes" replace />} />
                    <Route path="suppliers" element={<Navigate to="/dashboard/network" replace />} />
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

          <Route path="/" element={<Leave to="/command/exchange" />} />
          <Route path="/platform" element={<Leave to="/command/platform" />} />
          <Route path="/solutions" element={<Leave to="/command/solutions" />} />
          <Route path="/marketplace" element={<MarketingLayout><Marketplace /></MarketingLayout>} />
          <Route path="/contractors" element={<MarketingLayout><ForContractors /></MarketingLayout>} />
          <Route path="/distributors" element={<MarketingLayout><ForDistributors /></MarketingLayout>} />
          <Route path="/suppliers" element={<MarketingLayout><ForSuppliers /></MarketingLayout>} />
          <Route path="/supply" element={<Leave to="/command/supply" />} />
          <Route path="/supply/catalog" element={<Navigate to="/marketplace" replace />} />
          <Route path="/catalog" element={<Navigate to="/marketplace" replace />} />
          <Route path="/supplier" element={<Navigate to="/suppliers" replace />} />
          <Route path="/contractor" element={<Navigate to="/contractors" replace />} />
          <Route path="/distributor" element={<Navigate to="/distributors" replace />} />
          <Route path="/project" element={<Leave to="/command/projects" />} />
          <Route path="/projects" element={<Leave to="/command/projects" />} />
          <Route path="/projects/:slug" element={<Leave to="/command/projects/:slug" />} />
          <Route path="/construction-projects/:city/:trade" element={<Leave to="/command/projects/markets/:city/:trade" />} />
          <Route path="/pricing" element={<Leave to="/pricing" />} />
          <Route path="/about" element={<Leave to="/about" />} />
          <Route path="/about-us" element={<Leave to="/about" />} />
          <Route path="/contact" element={<Leave to="/contact" />} />
          <Route path="/contact-us" element={<Leave to="/contact" />} />
          <Route path="/login" element={<MarketingLayout><Login /></MarketingLayout>} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/sign-in" element={<Navigate to="/login" replace />} />
          <Route path="/log-in" element={<Navigate to="/login" replace />} />
          <Route path="/account" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<MarketingLayout><Register /></MarketingLayout>} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/sign-up" element={<Navigate to="/register" replace />} />
          <Route path="/trial" element={<Navigate to="/register" replace />} />
          <Route path="/start" element={<Navigate to="/register" replace />} />
          <Route path="/get-started" element={<Navigate to="/register" replace />} />
          <Route path="/join" element={<Navigate to="/register" replace />} />
          <Route path="/credit" element={<Navigate to="/dashboard/settings" replace />} />
          <Route path="/credits" element={<Navigate to="/dashboard/settings" replace />} />
          <Route path="/credit-application" element={<Navigate to="/dashboard/settings" replace />} />
          <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
          <Route path="/forgot-password" element={<MarketingLayout><ForgotPassword /></MarketingLayout>} />
          <Route path="/forgot" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/reset-password" element={<ToParentReset />} />
          <Route path="/reset" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/password" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/verify-email" element={<MarketingLayout><VerifyEmail /></MarketingLayout>} />
          <Route path="/changelog" element={<MarketingLayout><Changelog /></MarketingLayout>} />
          {/* Blog unpublished until there are posts that fit the marketplace (PROOF.md). */}
          <Route path="/blog" element={<Navigate to="/changelog" replace />} />
          <Route path="/blog/:slug" element={<Navigate to="/changelog" replace />} />
          <Route path="/privacy" element={<MarketingLayout><PrivacyPolicy /></MarketingLayout>} />
          <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/terms" element={<MarketingLayout><TermsAndConditions /></MarketingLayout>} />
          <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
          <Route path="/tos" element={<Navigate to="/terms" replace />} />
          <Route path="/legal" element={<Navigate to="/terms" replace />} />
          <Route path="/eula" element={<Navigate to="/terms" replace />} />
          <Route path="/unsubscribe" element={<Navigate to="/privacy" replace />} />
          <Route path="/brand" element={<MarketingLayout><BrandGuidelines /></MarketingLayout>} />
          <Route path="/brand-guidelines" element={<Navigate to="/brand" replace />} />
          <Route path="/fleet" element={<Leave to="/command/fleet" />} />
          <Route path="/equipment" element={<Leave to="/command/fleet" />} />
          <Route path="/fleet-cards" element={<Navigate to="/marketing/fleet-cards" replace />} />
          <Route path="/receipts" element={<Navigate to="/marketing/receipts" replace />} />
          <Route path="/signage" element={<Navigate to="/marketing/signage" replace />} />
          <Route path="/home" element={<Leave to="/" />} />
          <Route path="/exchange" element={<Navigate to="/marketplace" replace />} />
          <Route path="/shop" element={<Navigate to="/marketplace" replace />} />
          <Route path="/features" element={<Leave to="/services" />} />
          <Route path="/product" element={<Leave to="/services" />} />
          <Route path="/services" element={<Leave to="/services" />} />
          <Route path="/how-it-works" element={<Leave to="/services" />} />
          <Route path="/howitworks" element={<Leave to="/services" />} />
          <Route path="/docs" element={<Navigate to="/changelog" replace />} />
          <Route path="/help" element={<Navigate to="/contact" replace />} />
          <Route path="/support" element={<Navigate to="/contact" replace />} />
          <Route path="/demo" element={<Navigate to="/contact" replace />} />
          <Route path="/faq" element={<Navigate to="/contact" replace />} />
          <Route path="/faqs" element={<Navigate to="/contact" replace />} />
          <Route path="/book" element={<Navigate to="/contact" replace />} />
          <Route path="/book-demo" element={<Navigate to="/contact" replace />} />
          <Route path="/request-demo" element={<Navigate to="/contact" replace />} />
          <Route path="/company" element={<Leave to="/about" />} />
          <Route path="/team" element={<Leave to="/about" />} />
          <Route path="/news" element={<Navigate to="/changelog" replace />} />
          <Route path="/press" element={<Navigate to="/changelog" replace />} />
          <Route path="/careers" element={<Navigate to="/contact" replace />} />
          <Route path="/jobs" element={<Navigate to="/contact" replace />} />
          <Route path="/cookies" element={<Navigate to="/privacy" replace />} />
          <Route path="/cookie" element={<Navigate to="/privacy" replace />} />
          <Route path="/cookie-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/gdpr" element={<Navigate to="/privacy" replace />} />
          <Route path="/status" element={<Navigate to="/about" replace />} />
          <Route path="/security" element={<Navigate to="/about" replace />} />
          <Route path="/investors" element={<Navigate to="/about" replace />} />
          <Route path="/partners" element={<Leave to="/command/solutions" />} />
          <Route path="/accessibility" element={<Navigate to="/about" replace />} />
          <Route path="/a11y" element={<Navigate to="/about" replace />} />
          <Route path="/marketing/fleet-cards" element={<MarketingLayout><FleetCards /></MarketingLayout>} />
          <Route path="/marketing/receipts" element={<MarketingLayout><Receipts /></MarketingLayout>} />
          <Route path="/marketing/signage" element={<MarketingLayout><Signage /></MarketingLayout>} />
          <Route path="*" element={<MarketingLayout><NotFound /></MarketingLayout>} />
        </Routes>
      </ToastProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
