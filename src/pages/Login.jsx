import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import AuthShell from "../components/AuthShell";
import Seo from "../components/Seo";
import PasswordField from "../components/PasswordField";
import HumanCheck from "../auth/HumanCheck";
import { allowsPreferences } from "../components/CookieConsent";
import useAuth from "../auth/useAuth";

const REMEMBER_KEY = "djs-login-email";

function readRememberedEmail() {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? localStorage.getItem("login_email") ?? "";
  } catch {
    return "";
  }
}

function writeRememberedEmail(email) {
  try {
    if (email && allowsPreferences()) localStorage.setItem(REMEMBER_KEY, email);
    else localStorage.removeItem(REMEMBER_KEY);
    // Shared key collided with Stratagem Exchange on this origin.
    localStorage.removeItem("login_email");
  } catch {
    /* private mode / blocked storage */
  }
}

export default function Login() {
  const { user, loading, login, turnstileSiteKey, setChallengeToken, challengeReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(() => {
    try {
      return readRememberedEmail();
    } catch {
      return "";
    }
  });
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return !!readRememberedEmail();
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
  const safeRequested =
    typeof requested === "string" &&
    requested.startsWith("/") &&
    !requested.startsWith("//") &&
    !requested.includes("\\")
      ? requested
      : null;
  // Admins land in the admin control panel unless they were headed somewhere.
  const homeFor = (u) => (u?.role === "admin" ? "/admin" : "/dashboard/overview");
  const destination = safeRequested ?? homeFor(user);
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
      const signedIn = await login(email, password);
      writeRememberedEmail(rememberMe ? email : "");
      navigate(safeRequested ?? homeFor(signedIn), { replace: true });
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
    "w-full rounded-md border border-line bg-canvas px-4 py-2.5 text-sm text-fg outline-hidden " +
    "transition-colors placeholder:text-fg-muted/60 focus:border-brand";

  return (
    <>
      <Seo title="Sign in" description="Sign in to your D&J Stratagem account." noindex />

      <AuthShell
        mode="login"
        title="Welcome back."
        lede="Sign in to run your subagents, jobs, and Fleet."
        footer={
          <>
            New to Stratagem?{" "}
            <Link to="/register" className="font-medium text-brand hover:underline">
              Create an account
            </Link>
            <span className="mt-3 block font-mono text-[11px] uppercase tracking-[0.14em]">
              Accounts are approved before first sign-in
            </span>
          </>
        }
      >
          <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-fg">
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
              <label className="flex items-center gap-2 text-sm text-fg-muted">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setRememberMe(on);
                    // Apply immediately. Waiting for a successful sign-in left
                    // the stored address in place after an unchecked failed attempt.
                    writeRememberedEmail(on ? email : "");
                  }}
                  className="h-3.5 w-3.5 accent-brand"
                />
                Remember my email
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-brand hover:text-brand-hover">
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

            <HumanCheck siteKey={turnstileSiteKey} onToken={setChallengeToken} resetKey={challengeReset} className="mt-2" />
            <Button type="submit" variant="primary" className="mt-2 w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

      </AuthShell>
    </>
  );
}
