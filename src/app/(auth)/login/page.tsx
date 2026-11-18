import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, MapPin, ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { BrandMark } from "@/components/brand-mark";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your D&J Stratagem account.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section className="auth-page auth-login-page">
      <div className="auth-aside">
        <Link className="auth-back" href="/">
          <ArrowLeft size={15} /> Back to D&amp;J
        </Link>
        <div className="auth-aside-inner">
          <BrandMark />
          <span className="eyebrow">Your work, in motion</span>
          <h2>Welcome back to the desk.</h2>
          <p>
            Pick up the pipeline where you left off. Your account connects the
            work, people, and next steps.
          </p>
          <ul>
            <li><LockKeyhole size={15} /> Secure account session</li>
            <li><ShieldCheck size={15} /> Your team stays in control</li>
            <li><MapPin size={15} /> Southern California focused</li>
          </ul>
        </div>
        <span className="auth-aside-foot">D&amp;J STRATAGEM · LOS ANGELES</span>
      </div>
      <div className="auth-main">
        <div className="auth-mobile-brand"><BrandMark /></div>
        <AuthForm mode="login" />
        <p className="auth-legal">
          Need an account? <Link href="/join">Join free</Link>
        </p>
      </div>
    </section>
  );
}
