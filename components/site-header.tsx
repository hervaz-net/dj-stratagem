"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { modes, resourceSections } from "@/lib/site-data";
import { shell } from "@/lib/ui";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-provider";

const primaryLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Company", href: "/about" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur-md">
      <div className={`${shell} flex min-h-8 items-center justify-between gap-3 font-mono text-[0.65rem] tracking-wide text-base-content/60`}>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-success" />
          <span className="sm:hidden">Los Angeles · Southern California</span>
          <span className="hidden sm:inline">Based in Los Angeles · Focused on Southern California</span>
        </span>
        <a className="link link-hover hidden sm:inline" href="mailto:hello@djstratageminc.com">
          Talk to a person
        </a>
      </div>
      <div className={`${shell} navbar min-h-16 px-0`}>
        <div className="navbar-start w-auto flex-none">
          <BrandMark />
        </div>
        <nav aria-label="Main navigation" className="navbar-center hidden flex-1 justify-center gap-1 xl:flex">
          <div className="dropdown dropdown-bottom">
            <button className="btn btn-ghost btn-sm gap-1" type="button">
              Platform <ChevronDown aria-hidden="true" size={14} />
            </button>
            <div className="dropdown-content z-30 mt-2 w-[22rem] rounded-box border border-base-300 bg-base-100 p-3 shadow-xl">
              <div className="mb-2 flex items-baseline justify-between border-b border-base-300 px-1 pb-2">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">
                  One account
                </span>
                <span className="text-xs font-semibold">Nine modes. One desk.</span>
              </div>
              <ul className="grid grid-cols-3 gap-1">
                {modes.map((mode) => (
                  <li key={mode.slug}>
                    <Link
                      className="flex flex-col rounded-box px-2 py-2 text-sm hover:bg-base-200"
                      href={`/${mode.slug}`}
                    >
                      <span className="font-semibold">{mode.name}</span>
                      <span className="font-mono text-[0.6rem] uppercase text-base-content/55">
                        {mode.stage}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="link link-hover mt-2 flex items-center justify-between px-1 pt-2 text-sm text-primary" href="/#how-it-works">
                See how a job moves <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          {primaryLinks.map((item) => (
            <Link className="btn btn-ghost btn-sm" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <div className="dropdown dropdown-bottom">
            <button className="btn btn-ghost btn-sm gap-1" type="button">
              Resources <ChevronDown aria-hidden="true" size={14} />
            </button>
            <ul className="dropdown-content menu z-30 mt-2 w-72 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
              {resourceSections.map((section) => (
                <li key={section.slug}>
                  <Link href={`/resources/${section.slug}`}>
                    <span className="flex flex-col items-start gap-0.5">
                      <span className="font-semibold">{section.title}</span>
                      <span className="text-xs font-normal whitespace-normal text-base-content/60">
                        {section.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="navbar-end hidden w-auto flex-none items-center gap-1 xl:flex">
          <ThemeToggle />
          <Link className="btn btn-ghost btn-sm" href="/login">
            Sign in
          </Link>
          <Link className="btn btn-primary btn-sm" href="/join">
            Join free <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
        <div className="navbar-end w-auto flex-none xl:hidden">
          <button
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="btn btn-square btn-ghost"
            onClick={() => setMobileOpen((open) => !open)}
            type="button"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="max-h-[calc(100svh-6.5rem)] overflow-auto border-t border-base-300 bg-base-100 xl:hidden"
          id="mobile-navigation"
        >
          <div className={`${shell} grid gap-6 py-4`}>
            <div>
              <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
                The platform
              </p>
              <ul className="menu menu-sm grid grid-cols-2 gap-1 p-0 sm:grid-cols-3">
                {modes.map((mode) => (
                  <li key={mode.slug}>
                    <Link href={`/${mode.slug}`} onClick={closeMenu}>
                      <span>{mode.name}</span>
                      <span className="font-mono text-[0.6rem] uppercase text-base-content/50">
                        {mode.stage}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="menu menu-sm p-0">
              {primaryLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={closeMenu}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {resourceSections.map((section) => (
                <li key={section.slug}>
                  <Link href={`/resources/${section.slug}`} onClick={closeMenu}>
                    {section.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" onClick={closeMenu}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" onClick={closeMenu}>
                  Sign in
                </Link>
              </li>
            </ul>
            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <Link className="btn btn-primary" href="/join" onClick={closeMenu}>
                Join free <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
