import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, MapPin, ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand-mark";
import { eyebrow } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your D&J Stratagem account.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="grid min-h-svh lg:grid-cols-[minmax(18rem,0.85fr)_1.15fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-base-300 bg-base-200 p-8 lg:flex">
        <Link className="link inline-flex w-fit items-center gap-2 text-sm" href="/">
          <ArrowLeft size={15} /> Back to D&amp;J
        </Link>
        <div className="max-w-md py-10">
          <BrandMark />
          <p className={`${eyebrow} mt-12`}>Your work, in motion</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Welcome back to the desk.</h2>
          <p className="mt-3 text-sm leading-relaxed text-base-content/75">
            Pick up the pipeline where you left off. Your account connects the work, people, and next steps.
          </p>
          <ul className="mt-6 grid gap-2 text-sm">
            <li className="flex items-center gap-2"><LockKeyhole className="text-primary" size={15} /> Secure account session</li>
            <li className="flex items-center gap-2"><ShieldCheck className="text-primary" size={15} /> Your team stays in control</li>
            <li className="flex items-center gap-2"><MapPin className="text-primary" size={15} /> Southern California focused</li>
          </ul>
        </div>
        <p className="font-mono text-[0.65rem] tracking-[0.14em] text-base-content/50">D&amp;J STRATAGEM · LOS ANGELES</p>
      </aside>
      <div className="flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mb-8 lg:hidden"><BrandMark /></div>
        <AuthForm mode="login" />
      </div>
    </section>
  );
}
