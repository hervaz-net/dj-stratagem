import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Seo from "../components/Seo";

export default function VerifyEmail() {
  return (
    <>
      <Seo title="Verify your email" description="Check your inbox to verify your email address." noindex />

      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-16 md:py-24">
        <div className="rounded-2xl border border-line bg-ink-2 p-8 shadow-xl shadow-brand/5">
          <Link to="/" className="inline-block" aria-label="D&J Stratagem — home">
            <Logo />
          </Link>

          <div className="mt-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-amber" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-paper">Check your email</h1>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              We sent a verification link to your email address. Click it to confirm your account before your first sign-in.
            </p>
            <p className="mt-3 text-sm text-steel">
              The link expires in <span className="font-medium text-paper">24 hours</span>.
            </p>

            <div className="mt-8 space-y-3">
              <p className="text-xs text-steel">Didn&rsquo;t receive it?</p>
              <p className="text-sm leading-relaxed text-steel">
                Automated resend is not live yet. Email{" "}
                <a href="mailto:hello@djstratageminc.com" className="font-medium text-amber hover:text-amber-2">
                  hello@djstratageminc.com
                </a>{" "}
                and we will confirm the account.
              </p>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <Link to="/login" className="text-sm font-medium text-steel hover:text-paper">
                ← Back to sign in
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-steel">
          Check your spam folder if you don't see the email within a few minutes.
        </p>
      </div>
    </>
  );
}
