import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Seo from "../components/Seo";
import PasswordField from "../components/PasswordField";
import AuthShell, { AuthAlert, authInputClass } from "../components/auth/AuthShell";
import useAuth from "../auth/useAuth";
import { PRODUCT, CONTACT_EMAIL } from "../brand";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("login_email") ?? "";
    } catch {
      return "";
    }
  });
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return !!localStorage.getItem("login_email");
    } catch {
      return false;
    }
  });
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const errorId = "login-error";

  // Only follow same-origin paths. A poisoned history state must not send
  // a signed-in visitor to //evil.example or an external URL.
  const requested = location.state?.from;
  const destination =
    typeof requested === "string" &&
    requested.startsWith("/") &&
    !requested.startsWith("//") &&
    !requested.includes("\\")
      ? requested
      : "/dashboard/overview";
  if (!loading && user) return <Navigate to={destination} replace />;

  const fail = (field, message) => {
    setInvalid(field);
    setError(message);
    document.getElementById(field)?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInvalid(null);

    if (!email) return fail("email", "Enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail("email", "Enter a valid email address.");
    }
    if (!password) return fail("password", "Enter your password.");

    setSubmitting(true);
    try {
      await login(email, password);
      try {
        if (rememberMe) localStorage.setItem("login_email", email);
        else localStorage.removeItem("login_email");
      } catch {
        /* private mode / blocked storage */
      }
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
      // Focus the email field for a credentials failure so a retry is one
      // keystroke away; leave focus alone for server-side problems.
      if (err.code === "invalid_credentials") {
        setInvalid("email");
        document.getElementById("email")?.focus();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Sign in" description={`Sign in to your ${PRODUCT} account.`} noindex />

      <AuthShell
        title="Pick up where the order left off."
        text="Requests, quotes, and purchase orders for every side of the construction supply chain, in one account."
        footnote="Accounts are approved by our team before first sign-in. If yours is still pending, we will email you when it is ready."
      >
        <h1 className="text-3xl font-bold tracking-tight text-fg">Sign in</h1>
        <p className="mt-2 text-fg-muted">Welcome back to {PRODUCT}.</p>

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
              aria-invalid={invalid === "email" ? true : undefined}
              // Field-specific: describing both inputs with the same message
              // would announce the email error on the password field too.
              aria-describedby={invalid === "email" ? errorId : undefined}
              className={`${authInputClass} ${invalid === "email" ? "border-danger" : "border-line"}`}
            />
          </div>

          <PasswordField
            id="password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            invalid={invalid === "password"}
            describedBy={invalid === "password" ? errorId : undefined}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-fg-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded accent-brand"
              />
              Remember my email
            </label>
            <Link to="/forgot-password" className="text-sm font-semibold text-brand hover:text-brand-hover">
              Forgot password?
            </Link>
          </div>

          <div aria-live="polite" role="status" id={errorId}>
            {error && <AuthAlert>{error}</AuthAlert>}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 rounded-2xl bg-subtle px-5 py-4 text-sm">
          <p className="font-semibold text-fg">New to {PRODUCT}?</p>
          <p className="mt-1 text-fg-muted">
            Manufacturers, distributors, and contractors can{" "}
            <Link to="/register" className="font-semibold text-brand hover:text-brand-hover">
              request an account
            </Link>
            . Trouble signing in? Email {CONTACT_EMAIL}.
          </p>
        </div>
      </AuthShell>
    </>
  );
}
