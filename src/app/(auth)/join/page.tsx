import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand-mark";
import { eyebrow } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Join free",
  description:
    "Request a D&J Stratagem account. Free to start; every company is reviewed by a person.",
  robots: { index: false, follow: false },
};

export default function JoinPage() {
  return (
    <section className="grid min-h-svh lg:grid-cols-[minmax(18rem,0.85fr)_1.15fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-base-300 bg-base-200 p-8 lg:flex">
        <Link className="link inline-flex w-fit items-center gap-2 text-sm" href="/">
          <ArrowLeft size={15} /> Back to D&amp;J
        </Link>
        <div className="max-w-md py-10">
          <BrandMark />
          <p className={`${eyebrow} mt-12`}>Find the work. Price it. Build it.</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">One desk for the whole job.</h2>
          <p className="mt-3 text-sm leading-relaxed text-base-content/75">
            Get your company in the network and put your next opportunity in motion.
          </p>
          <ul className="mt-6 grid gap-2 text-sm">
            <li className="flex items-center gap-2"><Check className="text-primary" size={15} /> Free to start</li>
            <li className="flex items-center gap-2"><ShieldCheck className="text-primary" size={15} /> Reviewed by a person</li>
            <li className="flex items-center gap-2"><MapPin className="text-primary" size={15} /> Focused on Southern California</li>
          </ul>
        </div>
        <p className="font-mono text-[0.65rem] tracking-[0.14em] text-base-content/50">D&amp;J STRATAGEM · LOS ANGELES</p>
      </aside>
      <div className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mb-8 lg:hidden"><BrandMark /></div>
        <AuthForm mode="join" />
        <p className="mt-6 max-w-md text-xs leading-relaxed text-base-content/55">
          By requesting access, you agree to our <Link className="link link-primary" href="/terms">Terms</Link>{" "}
          and <Link className="link link-primary" href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
