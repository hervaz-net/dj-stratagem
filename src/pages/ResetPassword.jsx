import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Seo from "../components/Seo";
import PasswordField from "../components/PasswordField";
import useAuth from "../auth/useAuth";
import { resetPassword } from "../api/jobs";

/** Landing page for the emailed reset link: /reset-password?token=… */
export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const { csrf } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 12) return setError("Use at least 12 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      await resetPassword(token, password, { csrf });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Choose a new password" description="Set a new password for your D&J Stratagem account." noindex />
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-6 py-10 md:py-14">
        <div className="slab p-8">
          <Link to="/" className="inline-block" aria-label="D&J Stratagem — home">
            <Logo />
          </Link>
          {!token ? (
            <>
              <h1 className="mt-8 text-fg text-5xl leading-[0.95] md:text-7xl">Link incomplete</h1>
              <p className="mt-3 text-sm text-fg-muted">This reset link is missing its code. Open the link from the email again, or request a new one.</p>
              <Link to="/forgot-password" className="mt-6 inline-block text-sm font-medium text-brand hover:text-brand-hover">Request a new link →</Link>
            </>
          ) : done ? (
            <>
              <h1 className="mt-8 text-fg text-5xl leading-[0.95] md:text-7xl">Password updated</h1>
              <p className="mt-3 text-sm text-fg-muted" role="status">Sign in with your new password.</p>
              <Link to="/login" className="mt-6 inline-block text-sm font-medium text-brand hover:text-brand-hover">Sign in →</Link>
            </>
          ) : (
            <>
              <h1 className="mt-8 text-fg text-5xl leading-[0.95] md:text-7xl">Choose a new password</h1>
              <p className="mt-2 text-sm text-fg-muted">At least 12 characters, and not your email or company name.</p>
              <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
                <PasswordField id="new-password" label="New password" value={password} onChange={setPassword} autoComplete="new-password" />
                <PasswordField id="confirm-password" label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
                {error && (
                  <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger" role="alert">
                    {error}
                    {/expired|invalid|used/i.test(error) && (
                      <> <Link to="/forgot-password" className="font-semibold underline">Request a new link.</Link></>
                    )}
                  </div>
                )}
                <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                  {busy ? "Saving…" : "Save new password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
