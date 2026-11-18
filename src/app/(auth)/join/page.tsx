import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, MapPin, ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand-mark";

export const metadata: Metadata = {
  title: "Join free",
  description:
    "Request a D&J Stratagem account. Free to start; every company is reviewed by a person.",
  robots: { index: false, follow: false },
};

export default function JoinPage() {
  return (
    <section className="auth-page auth-join-page">
      <div className="auth-aside">
        <Link className="auth-back" href="/">
          <ArrowLeft size={15} /> Back to D&amp;J
        </Link>
        <div className="auth-aside-inner">
          <BrandMark />
          <span className="eyebrow">Find the work. Price it. Build it.</span>
          <h2>One desk for the whole job.</h2>
          <p>
            Get your company in the network and put your next opportunity in
            motion.
          </p>
          <ul>
            <li><Check size={15} /> Free to start</li>
            <li><ShieldCheck size={15} /> Reviewed by a person</li>
            <li><MapPin size={15} /> Focused on Southern California</li>
          </ul>
        </div>
        <span className="auth-aside-foot">D&amp;J STRATAGEM · LOS ANGELES</span>
      </div>
      <div className="auth-main">
        <div className="auth-mobile-brand"><BrandMark /></div>
        <AuthForm mode="join" />
        <p className="auth-legal">
          By requesting access, you agree to our <Link href="/terms">Terms</Link>{" "}
          and <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
