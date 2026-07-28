import { Routes, Route, useLocation } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

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

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      <a
        href="#main"
        className="sr-only rounded-lg bg-ink-2 px-4 py-2 text-sm font-semibold text-paper shadow-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/supply" element={<Supply />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
