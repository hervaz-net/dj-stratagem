import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Seo from "../components/Seo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // TODO: replace with the real authentication endpoint. Credentials are
    // deliberately never logged or persisted here.
    window.setTimeout(() => {
      setLoading(false);
      setError("Accounts aren't open yet. Contact us and we'll get you set up.");
    }, 500);
  };

  const inputClass =
    "w-full rounded-md border border-line bg-ink px-4 py-2.5 text-sm text-paper outline-none " +
    "transition-colors placeholder:text-steel/60 focus:border-amber";

  return (
    <>
      <Seo
        title="Sign in"
        description="Sign in to your D&J Stratagem account."
        noindex
      />

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
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-paper">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-steel transition-colors hover:text-amber"
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.4 5.3A9.7 9.7 0 0 1 12 5c5 0 9 4.5 9 7a12 12 0 0 1-2.4 3.4M6.2 6.6C4 8.1 3 10.4 3 12c0 2.5 4 7 9 7a9.6 9.6 0 0 0 3.6-.7" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7-4 7-9 7-9-4.5-9-7z" />
                      <circle cx="12" cy="12" r="2.6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div aria-live="polite" role="status">
              {error && (
                <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                  {error}
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" className="mt-2 w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
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
              <Link to="/contact" className="font-medium text-amber hover:text-amber-2">
                Contact us for access
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-steel">
          This is a secure login portal for D&amp;J Stratagem platform users.
        </p>
      </div>
    </>
  );
}
