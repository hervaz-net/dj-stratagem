import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Seo from "../components/Seo";
import PasswordField from "../components/PasswordField";
import useAuth from "../auth/useAuth";

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => localStorage.getItem("login_email") ?? "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("login_email"));
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const errorId = "login-error";

  // Send an already-authenticated visitor onward rather than showing the form.
  const destination = location.state?.from ?? "/dashboard/suppliers";
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
      if (rememberMe) {
        localStorage.setItem("login_email", email);
      } else {
        localStorage.removeItem("login_email");
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

  const inputClass =
    "w-full rounded-md border border-line bg-ink px-4 py-2.5 text-sm text-paper outline-hidden " +
    "transition-colors placeholder:text-steel/60 focus:border-amber";

  return (
    <>
      <Seo title="Sign in" description="Sign in to your D&J Stratagem account." noindex />

      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-16 md:py-24">
        <div className="rounded-2xl border border-line bg-ink-2 p-8 shadow-xl shadow-brand/5">
          <Link to="/" className="inline-block" aria-label="D&J Stratagem — home">
            <Logo />
          </Link>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight text-paper">Sign in</h1>
          <p className="mt-2 text-sm text-steel">Access your D&amp;J Stratagem account.</p>

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
                aria-invalid={invalid === "email" ? true : undefined}
                // Field-specific: describing both inputs with the same message
                // would announce the email error on the password field too.
                aria-describedby={invalid === "email" ? errorId : undefined}
                className={inputClass}
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-steel">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 accent-amber"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-amber hover:text-amber-2">
                Forgot password?
              </Link>
            </div>

            <div aria-live="polite" role="status" id={errorId}>
              {error && (
                <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                  {error}
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" className="mt-2 w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-line" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-ink-2 px-3 text-xs uppercase tracking-wider text-steel">Or</span>
              </div>
            </div>
            <p className="text-center text-sm text-steel">
              Don&rsquo;t have an account?{" "}
              <Link to="/register" className="font-medium text-amber hover:text-amber-2">
                Request access
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-steel">
          Accounts are approved by our team before first sign-in.
        </p>
      </div>
    </>
  );
}
