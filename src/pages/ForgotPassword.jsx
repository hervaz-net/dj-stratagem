import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Seo from "../components/Seo";
import AuthShell, { AuthAlert, authInputClass } from "../components/auth/AuthShell";
import { IconArrowLeft, IconMail } from "../components/icons";
import { PRODUCT, CONTACT_EMAIL } from "../brand";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");

    // No reset-mail endpoint ships yet. Do not pretend a message was sent.
    setBusy(true);
    await new Promise((r) => setTimeout(r, 300));
    setBusy(false);
    setSubmitted(true);
  };

  return (
    <>
      <Seo title="Forgot password" description={`Reset your ${PRODUCT} password.`} noindex />

      <AuthShell
        title="Locked out? We'll get you back in."
        text="Password resets are handled by a person on our team for now, so you'll hear from someone who can actually help."
        footnote={`Self-serve reset email is not live yet. Requests go to ${CONTACT_EMAIL}.`}
      >
        {submitted ? (
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-fg">
              <IconMail width={22} height={22} aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-fg">How to reset</h1>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Self-serve password reset is not live yet, so nothing has been emailed. Write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand hover:text-brand-hover">
                {CONTACT_EMAIL}
              </a>{" "}
              from <span className="font-semibold text-fg">{email}</span> and we will reset the account by hand.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover"
            >
              <IconArrowLeft width={15} height={15} aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-fg">Forgot your password?</h1>
            <p className="mt-2 leading-relaxed text-fg-muted">
              Enter the email on the account. We&rsquo;ll show you how to reach us. Automated reset
              email is not live yet.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-fg">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "forgot-error" : undefined}
                  className={`${authInputClass} ${error ? "border-danger" : "border-line"}`}
                />
              </div>

              <div aria-live="polite" role="status" id="forgot-error">
                {error && <AuthAlert>{error}</AuthAlert>}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? "Checking…" : "Get reset steps"}
              </Button>
            </form>

            <p className="mt-8 border-t border-line pt-6 text-center text-sm text-fg-muted">
              Remembered it?{" "}
              <Link to="/login" className="font-semibold text-brand hover:text-brand-hover">
                Sign in
              </Link>
            </p>
          </>
        )}
      </AuthShell>
    </>
  );
}
