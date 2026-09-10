import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import CookieBanner from "./components/CookieBanner";
import ReadingProgress from "./components/ReadingProgress";
import CommandPalette from "./components/CommandPalette";
import LiveChat from "./components/LiveChat";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import Solutions from "./pages/Solutions";
import Supply from "./pages/Supply";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import TradeLocation from "./pages/TradeLocation";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Changelog from "./pages/Changelog";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import BrandGuidelines from "./pages/BrandGuidelines";
import Fleet from "./pages/Fleet";
import FleetCards from "./pages/FleetCards";
import Receipts from "./pages/Receipts";
import Signage from "./pages/Signage";
import NotFound from "./pages/NotFound";
import SuppliersDashboard from "./pages/dashboard/Suppliers";
import AdminUsers from "./pages/dashboard/Admin";
import Overview from "./pages/dashboard/Overview";
import Bids from "./pages/dashboard/Bids";
import Orders from "./pages/dashboard/Orders";
import Analytics from "./pages/dashboard/Analytics";
import Alerts from "./pages/dashboard/Alerts";
import Settings from "./pages/dashboard/Settings";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import { ToastProvider } from "./contexts/ToastContext";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      if (hash) {
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
    className="sr-only rounded-lg bg-ink-2 px-4 py-2 text-sm font-semibold text-paper shadow-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
  >
    Skip to content
  </a>
);

/** Public marketing pages: site navbar, footer, back-to-top, cookie banner, floating CTA. */
function MarketingLayout({ children }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

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
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navbar onOpenPalette={openPalette} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
      <CookieBanner />
      <ReadingProgress />
      <LiveChat />
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
                    <Route path="suppliers" element={<SuppliersDashboard />} />
                    <Route path="bids" element={<Bids />} />
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

          <Route path="/" element={<MarketingLayout><Home /></MarketingLayout>} />
          <Route path="/platform" element={<MarketingLayout><Platform /></MarketingLayout>} />
          <Route path="/solutions" element={<MarketingLayout><Solutions /></MarketingLayout>} />
          <Route path="/supply" element={<MarketingLayout><Supply /></MarketingLayout>} />
          <Route path="/projects" element={<MarketingLayout><Projects /></MarketingLayout>} />
          <Route path="/project" element={<Navigate to="/projects" replace />} />
          <Route path="/projects/:slug" element={<MarketingLayout><ProjectDetail /></MarketingLayout>} />
          <Route
            path="/construction-projects/:city/:trade"
            element={<MarketingLayout><TradeLocation /></MarketingLayout>}
          />
          <Route path="/pricing" element={<MarketingLayout><Pricing /></MarketingLayout>} />
          <Route path="/about" element={<MarketingLayout><About /></MarketingLayout>} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/contact" element={<MarketingLayout><Contact /></MarketingLayout>} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
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
          <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
          <Route path="/forgot-password" element={<MarketingLayout><ForgotPassword /></MarketingLayout>} />
          <Route path="/forgot" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/reset-password" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/reset" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/password" element={<Navigate to="/forgot-password" replace />} />
          <Route path="/verify-email" element={<MarketingLayout><VerifyEmail /></MarketingLayout>} />
          <Route path="/changelog" element={<MarketingLayout><Changelog /></MarketingLayout>} />
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
          <Route path="/fleet" element={<MarketingLayout><Fleet /></MarketingLayout>} />
          <Route path="/fleet-cards" element={<Navigate to="/marketing/fleet-cards" replace />} />
          <Route path="/receipts" element={<Navigate to="/marketing/receipts" replace />} />
          <Route path="/signage" element={<Navigate to="/marketing/signage" replace />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/features" element={<Navigate to="/platform" replace />} />
          <Route path="/product" element={<Navigate to="/platform" replace />} />
          <Route path="/services" element={<Navigate to="/platform" replace />} />
          <Route path="/how-it-works" element={<Navigate to="/platform" replace />} />
          <Route path="/howitworks" element={<Navigate to="/platform" replace />} />
          <Route path="/docs" element={<Navigate to="/changelog" replace />} />
          <Route path="/help" element={<Navigate to="/contact" replace />} />
          <Route path="/support" element={<Navigate to="/contact" replace />} />
          <Route path="/demo" element={<Navigate to="/contact" replace />} />
          <Route path="/faq" element={<Navigate to="/contact" replace />} />
          <Route path="/faqs" element={<Navigate to="/contact" replace />} />
          <Route path="/book" element={<Navigate to="/contact" replace />} />
          <Route path="/book-demo" element={<Navigate to="/contact" replace />} />
          <Route path="/request-demo" element={<Navigate to="/contact" replace />} />
          <Route path="/company" element={<Navigate to="/about" replace />} />
          <Route path="/team" element={<Navigate to="/about" replace />} />
          <Route path="/blog" element={<MarketingLayout><Blog /></MarketingLayout>} />
          <Route path="/blog/:slug" element={<MarketingLayout><BlogPost /></MarketingLayout>} />
          <Route path="/news" element={<Navigate to="/blog" replace />} />
          <Route path="/press" element={<Navigate to="/blog" replace />} />
          <Route path="/careers" element={<Navigate to="/contact" replace />} />
          <Route path="/jobs" element={<Navigate to="/contact" replace />} />
          <Route path="/cookies" element={<Navigate to="/privacy" replace />} />
          <Route path="/cookie" element={<Navigate to="/privacy" replace />} />
          <Route path="/cookie-policy" element={<Navigate to="/privacy" replace />} />
          <Route path="/gdpr" element={<Navigate to="/privacy" replace />} />
          <Route path="/status" element={<Navigate to="/about" replace />} />
          <Route path="/security" element={<Navigate to="/about" replace />} />
          <Route path="/investors" element={<Navigate to="/about" replace />} />
          <Route path="/partners" element={<Navigate to="/about" replace />} />
          <Route path="/accessibility" element={<Navigate to="/about" replace />} />
          <Route path="/a11y" element={<Navigate to="/about" replace />} />
          <Route path="/marketing/fleet-cards" element={<MarketingLayout><FleetCards /></MarketingLayout>} />
          <Route path="/marketing/receipts" element={<MarketingLayout><Receipts /></MarketingLayout>} />
          <Route path="/marketing/signage" element={<MarketingLayout><Signage /></MarketingLayout>} />
          <Route path="*" element={<MarketingLayout><NotFound /></MarketingLayout>} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
