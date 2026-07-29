import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import Solutions from "./pages/Solutions";
import Supply from "./pages/Supply";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import SuppliersDashboard from "./pages/dashboard/Suppliers";
import AdminUsers from "./pages/dashboard/Admin";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // An in-page anchor should keep its target rather than snapping to top.
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
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

/** Public marketing pages: site navbar, footer, back-to-top. */
function MarketingLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
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
      <ScrollToTop />
      <Routes>
        {/* One guarded parent, so protection is structural: every nested
            dashboard route inherits it rather than opting in. Without this a
            future /dashboard/foo would silently fall through to the public
            catch-all instead of redirecting to /login. */}
        <Route
          path="/dashboard/*"
          element={
            <RequireAuth>
              <DashboardShell>
                <Routes>
                  <Route index element={<Navigate to="suppliers" replace />} />
                  <Route path="suppliers" element={<SuppliersDashboard />} />
                  {/* Admin-only in practice: the endpoints reject non-admins,
                      so reaching this route without the role shows an error
                      rather than any data. */}
                  <Route path="admin" element={<AdminUsers />} />
                  {/* Unknown dashboard paths stay inside the guarded subtree. */}
                  <Route path="*" element={<Navigate to="suppliers" replace />} />
                </Routes>
              </DashboardShell>
            </RequireAuth>
          }
        />

        <Route path="/" element={<MarketingLayout><Home /></MarketingLayout>} />
        <Route path="/platform" element={<MarketingLayout><Platform /></MarketingLayout>} />
        <Route path="/solutions" element={<MarketingLayout><Solutions /></MarketingLayout>} />
        <Route path="/supply" element={<MarketingLayout><Supply /></MarketingLayout>} />
        <Route path="/pricing" element={<MarketingLayout><Pricing /></MarketingLayout>} />
        <Route path="/about" element={<MarketingLayout><About /></MarketingLayout>} />
        <Route path="/contact" element={<MarketingLayout><Contact /></MarketingLayout>} />
        <Route path="/login" element={<MarketingLayout><Login /></MarketingLayout>} />
        <Route path="/register" element={<MarketingLayout><Register /></MarketingLayout>} />
        <Route path="*" element={<MarketingLayout><NotFound /></MarketingLayout>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
