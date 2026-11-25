"use client";

import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { modes, resourceSections } from "@/lib/site-data";
import { btnSm, eyebrow, shell } from "@/lib/ui";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-provider";

const primaryLinks = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Company", href: "/about" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-base-100/90 backdrop-blur-[18px]">
      <div className="border-b border-line-soft bg-base-200 font-mono text-[9px] tracking-[0.015em] text-ink-muted">
        <div className={`${shell} flex min-h-[30px] items-center justify-between max-[680px]:justify-center`}>
          <span className="inline-flex items-center gap-2 max-[900px]:text-[8px]">
            <span aria-hidden="true" className="status status-success status-sm" />
            Based in Los Angeles · Focused on Southern California
          </span>
          <a className="link link-hover inline-flex items-center gap-2 no-underline max-[680px]:hidden" href="mailto:hello@djstratageminc.com">
            Talk to a person
          </a>
        </div>
      </div>
      <div className={`${shell} navbar min-h-[70px] justify-between gap-6 px-0 max-[680px]:min-h-[62px]`}>
        <div className="navbar-start w-auto flex-none">
          <BrandMark />
        </div>
        <nav aria-label="Main navigation" className="megamenu navbar-center hidden min-h-0 flex-1 justify-end gap-1 text-xs font-semibold text-ink-dim min-[901px]:flex">
          <button className="h-auto min-h-0 px-2 text-xs font-semibold text-ink-dim" popoverTarget="platform-menu" type="button">
            Platform
          </button>
          <div className="w-[350px] rounded-[9px] border border-line bg-base-200 p-[15px] shadow-[0_24px_70px_-38px_oklch(3%_0.01_240/0.8)]" id="platform-menu" popover="auto">
            <div className="mb-2 flex items-baseline justify-between border-b border-line-soft px-1 pb-3">
              <span className={`${eyebrow} text-[9px]`}>One account</span>
              <span className="text-xs font-[650] text-base-content">Nine modes. One desk.</span>
            </div>
            <ul className="menu menu-sm grid grid-cols-3 gap-1 p-0">
              {modes.map((mode) => (
                <li key={mode.slug}>
                  <Link className="flex flex-col items-start gap-0.5" href={`/${mode.slug}`}>
                    <span>{mode.name}</span>
                    <small className="font-mono text-[8px] uppercase text-ink-muted">{mode.stage}</small>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="link link-hover mt-2 flex items-center justify-between border-t border-line-soft px-1 pt-3 text-[11px] font-[650] text-primary no-underline" href="/#how-it-works">
              See how a job moves <ArrowUpRight size={14} />
            </Link>
          </div>
          {primaryLinks.map((item) => (
            <Link className="px-2 text-xs font-semibold text-ink-dim no-underline hover:text-base-content" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          <button className="h-auto min-h-0 px-2 text-xs font-semibold text-ink-dim" popoverTarget="resources-menu" type="button">
            Resources
          </button>
          <ul className="menu w-[290px] rounded-[9px] border border-line bg-base-200 p-2 shadow-[0_24px_70px_-38px_oklch(3%_0.01_240/0.8)]" id="resources-menu" popover="auto">
            {resourceSections.map((section) => (
              <li key={section.slug}>
                <Link href={`/resources/${section.slug}`}>
                  <span className="flex flex-col items-start">
                    <span>{section.title}</span>
                    <small className="text-[10px] font-normal whitespace-normal text-ink-muted">{section.description}</small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="navbar-end hidden w-auto flex-none items-center gap-[17px] min-[901px]:flex max-[1100px]:gap-2.5">
          <ThemeToggle />
          <Link className="link text-xs font-semibold text-ink-dim no-underline hover:text-base-content" href="/login">
            Sign in
          </Link>
          <Link className={btnSm} href="/join">
            Join free <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
        <div className="navbar-end w-auto flex-none min-[901px]:hidden">
          <label aria-label="Open menu" className="btn btn-square size-10 min-h-10 rounded-[5px] border border-line bg-base-300" htmlFor="site-drawer">
            <Menu size={21} />
          </label>
        </div>
      </div>
    </header>
  );
}
