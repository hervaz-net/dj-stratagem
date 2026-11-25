import Link from "next/link";
import { Home, Mail, Menu, Tag } from "lucide-react";
import { SiteDrawer } from "@/components/site-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="drawer">
      <input className="drawer-toggle" id="site-drawer" type="checkbox" />
      <div className="drawer-content flex min-h-screen flex-col">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:top-2.5 focus:left-2.5 focus:z-[1000] focus:rounded-[6px] focus:bg-primary focus:px-[15px] focus:py-[11px] focus:text-sm focus:font-bold focus:text-primary-content"
          href="#main"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main className="flex-1 max-[900px]:pb-16" id="main">
          {children}
        </main>
        <SiteFooter />
        <nav aria-label="Mobile dock" className="dock dock-sm z-30 bg-base-200 text-ink-dim min-[901px]:hidden">
          <Link href="/">
            <Home aria-hidden="true" size={16} />
            <span className="dock-label">Home</span>
          </Link>
          <label htmlFor="site-drawer">
            <Menu aria-hidden="true" size={16} />
            <span className="dock-label">Modes</span>
          </label>
          <Link href="/pricing">
            <Tag aria-hidden="true" size={16} />
            <span className="dock-label">Pricing</span>
          </Link>
          <Link href="/contact">
            <Mail aria-hidden="true" size={16} />
            <span className="dock-label">Contact</span>
          </Link>
        </nav>
      </div>
      <div className="drawer-side z-50">
        <label aria-label="Close menu" className="drawer-overlay" htmlFor="site-drawer" />
        <SiteDrawer />
      </div>
    </div>
  );
}
