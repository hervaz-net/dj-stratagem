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
              The all-in-one platform for bidding, procurement, and project coordination
              on complex multi-trade construction projects in Los Angeles.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">Product</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/platform" className="text-paper/80 hover:text-amber">Platform</Link></li>
              <li><Link to="/solutions" className="text-paper/80 hover:text-amber">Solutions</Link></li>
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">Based in</h4>
            <p className="mt-4 text-sm text-paper/80">
              Los Angeles, California
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-steel md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} D&amp;J Stratagem, Inc. All rights reserved.</p>
          <p>Built for the Los Angeles construction trade.</p>
        </div>
      </div>
    </footer>
  );
}
