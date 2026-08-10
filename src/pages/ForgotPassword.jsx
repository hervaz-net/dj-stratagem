import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Seo from "../components/Seo";

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

    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
    setSubmitted(true);
  };

  return (
    <>
      <Seo title="Forgot password" description="Reset your D&J Stratagem password." noindex />

      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-16 md:py-24">
        <div className="rounded-2xl border border-line bg-ink-2 p-8 shadow-xl shadow-brand/5">
          <Link to="/" className="inline-block" aria-label="D&J Stratagem — home">
            <Logo />
          </Link>

          {submitted ? (
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--viz-green)]/10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--viz-green)]" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-paper">Check your inbox</h1>
              <p className="mt-3 text-sm leading-relaxed text-steel">
                If <span className="font-medium text-paper">{email}</span> is associated with an account, you'll receive a reset link within a few minutes. Check your spam folder if it doesn't arrive.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block text-sm font-medium text-amber hover:text-amber-2"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mt-8 text-3xl font-semibold tracking-tight text-paper">Forgot password?</h1>
              <p className="mt-2 text-sm text-steel">
                Enter the email address on your account and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-paper">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-md border border-line bg-ink px-4 py-2.5 text-sm text-paper outline-hidden transition-colors placeholder:text-steel/60 focus:border-amber"
                  />
                </div>

                {error && (
                  <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                    {error}
                  </div>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                  {busy ? "Sending…" : "Send reset link"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-steel">
                Remembered it?{" "}
                <Link to="/login" className="font-medium text-amber hover:text-amber-2">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
