"use client";

import Link from "next/link";
import { modes, resourceSections } from "@/lib/site-data";
import { btn, eyebrow } from "@/lib/ui";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-provider";

export function SiteDrawer() {
  return (
    <ul className="menu min-h-full w-80 bg-base-200 p-4 text-ink-dim">
      <li className="menu-title font-mono text-[10px] tracking-[0.14em] text-primary">The platform</li>
      {modes.map((mode) => (
        <li key={mode.slug}>
          <Link href={`/${mode.slug}`}>
            <span>{mode.name}</span>
            <span className="badge badge-ghost badge-xs font-mono">{mode.stage}</span>
          </Link>
        </li>
      ))}
      <li className="menu-title mt-2 font-mono text-[10px] tracking-[0.14em] text-primary">Desk</li>
      <li><Link href="/#how-it-works">How it works</Link></li>
      <li><Link href="/pricing">Pricing</Link></li>
      <li><Link href="/about">Company</Link></li>
      <li><Link href="/contact">Contact</Link></li>
      {resourceSections.map((section) => (
        <li key={section.slug}>
          <Link href={`/resources/${section.slug}`}>{section.title}</Link>
        </li>
      ))}
      <li><Link href="/login">Sign in</Link></li>
      <li className="mt-2">
        <ThemeToggle />
      </li>
      <li className="mt-2">
        <Link className={btn} href="/join">
          Join free <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </li>
      <li className={`${eyebrow} mt-4 list-none px-2`}>Los Angeles</li>
    </ul>
  );
}
