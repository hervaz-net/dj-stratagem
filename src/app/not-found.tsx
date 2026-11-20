import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { eyebrow } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65svh] w-full max-w-3xl flex-col justify-center px-4 py-16" id="main">
      <BrandMark />
      <p className={`${eyebrow} mt-8`}>404 · Not on this set</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        Looks like this page took a different route.
      </h1>
      <p className="mt-3 text-base-content/70">The page may have moved. Let’s get you back to the work.</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link className="btn btn-primary" href="/">
          <ArrowLeft size={15} /> Back home
        </Link>
        <Link className="link inline-flex items-center gap-1 font-semibold" href="/contact">
          Talk to a person <ArrowUpRight size={15} />
        </Link>
      </div>
    </main>
  );
}
