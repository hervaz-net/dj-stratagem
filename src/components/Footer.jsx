import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel">
              The operating system for construction growth &mdash; bidding, marketing,
              and business tools that help contractors win more work.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">Product</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/platform" className="text-paper/80 hover:text-amber">Platform</Link></li>
              <li><Link to="/solutions" className="text-paper/80 hover:text-amber">Solutions</Link></li>
              <li><Link to="/supply" className="text-paper/80 hover:text-amber">Supply Exchange</Link></li>
              <li><Link to="/pricing" className="text-paper/80 hover:text-amber">Pricing</Link></li>
              <li><Link to="/contact" className="text-paper/80 hover:text-amber">Request a demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/about" className="text-paper/80 hover:text-amber">About</Link></li>
              <li><Link to="/contact" className="text-paper/80 hover:text-amber">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">Get started</h4>
            <p className="mt-4 text-sm text-paper/80">
              Built for general contractors and subcontractors nationwide.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-steel md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} D&amp;J Stratagem, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-steel hover:text-paper">Privacy Policy</a>
            <a href="/terms" className="text-steel hover:text-paper">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
