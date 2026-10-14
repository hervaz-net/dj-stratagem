import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Seo from "../components/Seo";
import AuthShell, { AuthAlert, authInputClass } from "../components/auth/AuthShell";
import { IconArrowLeft, IconMail } from "../components/icons";
import { PRODUCT, CONTACT_EMAIL } from "../brand";
import useAuth from "../auth/useAuth";

/** Same accounts as the main site, so the same reset endpoint and reset page (/reset-password). */
async function requestReset(email, csrf) {
  const res = await fetch("/api/password-reset.php", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(csrf ? { "X-CSRF-Token": csrf } : {}) },
    body: JSON.stringify({ action: "request", email }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) throw new Error(data?.message ?? "Something went wrong. Please try again.");
  return data;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const { csrf } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid email address.");

    setBusy(true);
    try {
      const res = await requestReset(email.trim(), csrf);
      setMessage(res.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Forgot password" description={`Reset your ${PRODUCT} password.`} noindex />

      <AuthShell
        title="Locked out? We'll get you back in."
        text="We'll email you a link to choose a new password. It works once, for one hour."
        footnote={`Trouble with the link? Write to ${CONTACT_EMAIL}.`}
      >
        {submitted ? (
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-fg">
              <IconMail width={22} height={22} aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-fg">Check your email</h1>
            <p className="mt-3 leading-relaxed text-fg-muted" role="status">{message}</p>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Nothing after a few minutes? Check spam, or write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand hover:text-brand-hover">
                {CONTACT_EMAIL}
              </a>.
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
              Enter the email on your account and we&rsquo;ll send you a link to choose a new password.
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
                {busy ? "Sending…" : "Email me a reset link"}
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
