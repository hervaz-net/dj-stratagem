import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Seo from "../components/Seo";

export default function VerifyEmail() {
  return (
    <>
      <Seo title="Account review" description="New D&J Stratagem accounts are approved by the team. There is no automated verification email." noindex />

      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-16 md:py-24">
        <div className="rounded-2xl border border-line bg-surface p-8 shadow-xl shadow-brand/5">
          <Link to="/" className="inline-block" aria-label="D&J Stratagem — home">
            <Logo />
          </Link>

          <div className="mt-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-brand" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-fg">Account review, not a magic link</h1>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              New accounts stay pending until someone on the team approves them. There is no automated verification email and no 24-hour link.
            </p>
            <p className="mt-3 text-sm text-fg-muted">
              If you just requested access, wait for an email from us. If you never submitted a request, start at{" "}
              <Link to="/register" className="font-medium text-brand hover:text-brand-hover">
                /register
              </Link>
              .
            </p>

            <div className="mt-8 space-y-3">
              <p className="text-sm leading-relaxed text-fg-muted">
                Need it faster? Email{" "}
                <a href="mailto:hello@djstratageminc.com" className="font-medium text-brand hover:text-brand-hover">
                  hello@djstratageminc.com
                </a>{" "}
                from the address you used to sign up.
              </p>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <Link to="/login" className="text-sm font-medium text-fg-muted hover:text-fg">
                ← Back to sign in
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-fg-muted">
          Approval notices come from hello@djstratageminc.com. Check spam if nothing arrives after a business day.
        </p>
      </div>
    </>
  );
}
