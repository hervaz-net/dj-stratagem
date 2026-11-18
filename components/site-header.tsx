"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { modes, resourceSections } from "@/lib/site-data";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-provider";

const primaryLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Company", href: "/about" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>
            <span aria-hidden="true" className="status-dot" />
            Based in Los Angeles · Focused on Southern California
          </span>
          <a href="mailto:hello@djstratageminc.com">Talk to a person</a>
        </div>
      </div>
      <div className="container header-inner">
        <BrandMark />
        <nav aria-label="Main navigation" className="desktop-nav">
          <details className="nav-disclosure">
            <summary>
              Platform <ChevronDown aria-hidden="true" size={14} />
            </summary>
            <div className="nav-menu mode-menu">
              <div className="menu-heading">
                <span className="eyebrow">One account</span>
                <span>Nine modes. One desk.</span>
              </div>
              <div className="mode-menu-grid">
                {modes.map((mode) => (
                  <Link href={`/${mode.slug}`} key={mode.slug}>
                    <span>{mode.name}</span>
                    <small>{mode.stage}</small>
                  </Link>
                ))}
              </div>
              <Link className="menu-bottom-link" href="/#how-it-works">
                See how a job moves <ArrowUpRight size={14} />
              </Link>
            </div>
          </details>
          {primaryLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <details className="nav-disclosure">
            <summary>
              Resources <ChevronDown aria-hidden="true" size={14} />
            </summary>
            <div className="nav-menu resource-menu">
              {resourceSections.map((section) => (
                <Link href={`/resources/${section.slug}`} key={section.slug}>
                  <span>{section.title}</span>
                  <small>{section.description}</small>
                </Link>
              ))}
            </div>
          </details>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link className="header-signin" href="/login">
            Sign in
          </Link>
          <Link className="button button-primary button-small" href="/join">
            Join free <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
        <button
          aria-controls="mobile-navigation"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen((open) => !open)}
          type="button"
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="mobile-nav"
          id="mobile-navigation"
        >
          <div className="mobile-nav-group">
            <span className="eyebrow">The platform</span>
            {modes.map((mode) => (
              <Link href={`/${mode.slug}`} key={mode.slug} onClick={closeMenu}>
                <span>{mode.name}</span>
                <small>{mode.stage}</small>
              </Link>
            ))}
          </div>
          <div className="mobile-nav-links">
            <ThemeToggle />
            {primaryLinks.map((item) => (
              <Link href={item.href} key={item.href} onClick={closeMenu}>
                {item.label}
              </Link>
            ))}
            {resourceSections.map((section) => (
              <Link
                href={`/resources/${section.slug}`}
                key={section.slug}
                onClick={closeMenu}
              >
                {section.title}
              </Link>
            ))}
            <Link href="/contact" onClick={closeMenu}>
              Contact
            </Link>
            <Link href="/login" onClick={closeMenu}>
              Sign in
            </Link>
            <Link
              className="button button-primary"
              href="/join"
              onClick={closeMenu}
            >
              Join free <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
