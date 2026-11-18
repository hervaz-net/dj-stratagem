"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";

type FormMode = "join" | "login" | "forgot" | "reset";
type AuthFormProps = { mode: FormMode };
type ApiResult = {
  ok?: boolean;
  csrf?: string;
  error?: string;
  message?: string;
  fields?: Record<string, string>;
};

const AUTH_API_BASE = (
  process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? "/api"
).replace(/\/$/, "");
const API_UNAVAILABLE =
  "Account service isn’t available here yet. Please try again on the hosted site or contact our team.";

async function getCsrfToken() {
  const response = await fetch(`${AUTH_API_BASE}/me.php`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const result = (await response.json().catch(() => null)) as ApiResult | null;
  if (!response.ok || !result?.csrf) {
    throw new Error(result?.message || API_UNAVAILABLE);
  }
  return result.csrf;
}

function authErrorMessage(result: ApiResult | null) {
  if (result?.message) {
    return result.message;
  }
  if (result?.error === "server_not_configured") {
    return API_UNAVAILABLE;
  }
  if (result?.error === "validation_failed") {
    const fieldErrors = Object.values(result.fields ?? {}).filter(
      (message): message is string =>
        typeof message === "string" && message.trim() !== "",
    );
    return fieldErrors.length > 0
      ? `Please check your details: ${fieldErrors.join(" ")}`
      : "Please check the information you entered and try again.";
  }
  if (result?.error === "server_error") {
    return "We couldn’t complete your request just now. Please try again shortly, or contact our team.";
  }
  return "Something went wrong. Please try again.";
}

async function postAuth(path: string, payload: Record<string, string>) {
  const csrf = await getCsrfToken();
  const response = await fetch(`${AUTH_API_BASE}/${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrf,
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json().catch(() => null)) as ApiResult | null;
  if (!response.ok || !result?.ok) {
    throw new Error(authErrorMessage(result));
  }
  return result;
}

const headings: Record<FormMode, { title: string; description: string }> = {
  join: {
    title: "Get your company on the desk.",
    description:
      "Tell us who you are. A real person reviews every account before it joins the network.",
  },
  login: {
    title: "Welcome back.",
    description: "Sign in to pick up where your team left off.",
  },
  forgot: {
    title: "A fresh start.",
    description:
      "Enter the email on your account. If it’s active, we’ll send a reset link.",
  },
  reset: {
    title: "Choose a new password.",
    description: "Use at least 12 characters. Longer is better.",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    try {
      if (mode === "join") {
        const confirm = String(form.get("confirm") || "");
        if (password.length < 12) {
          throw new Error("Use at least 12 characters for your password.");
        }
        if (password !== confirm) {
          throw new Error("Those passwords don’t match.");
        }
        await postAuth("register.php", {
          fullName: String(form.get("fullName") || ""),
          company: String(form.get("company") || ""),
          email,
          phone: String(form.get("phone") || ""),
          password,
        });
        setDone(true);
      } else if (mode === "login") {
        await postAuth("login.php", { email, password });
        window.location.assign("/dashboard");
      } else if (mode === "forgot") {
        await postAuth("password-reset.php", { action: "request", email });
        setDone(true);
      } else {
        if (password.length < 12) {
          throw new Error("Use at least 12 characters for your password.");
        }
        const confirm = String(form.get("confirm") || "");
        if (password !== confirm) {
          throw new Error("Those passwords don’t match.");
        }
        const token = new URLSearchParams(window.location.search).get("token") ?? "";
        await postAuth("password-reset.php", { action: "reset", token, password });
        setDone(true);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t complete that request. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  if (done) {
    const confirmation =
      mode === "join"
        ? "Your request is with our team. We’ll email you once your account is approved."
        : mode === "forgot"
          ? "If an approved account uses that email, a reset link is on its way. It works for one hour."
          : "Your password has been updated. Sign in with your new password.";
    return (
      <div aria-live="polite" className="form-success auth-success" role="status">
        <span className="success-check">✓</span>
        <h2>{mode === "join" ? "Request received." : "You’re all set."}</h2>
        <p>{confirmation}</p>
        <Link className="button button-secondary" href={mode === "join" ? "/" : "/login"}>
          {mode === "join" ? "Back to home" : "Continue to sign in"}
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  const { title, description } = headings[mode];

  return (
    <div className="auth-form-wrap">
      <div className="auth-form-heading">
        <span className="eyebrow">
          {mode === "join" ? "Request access" : mode === "login" ? "Member sign in" : "Account help"}
        </span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <form className="form-stack" onSubmit={submit}>
        {mode === "join" && (
          <div className="form-two-col">
            <label className="field">
              <span>Full name</span>
              <input autoComplete="name" maxLength={120} name="fullName" required />
            </label>
            <label className="field">
              <span>Company</span>
              <input
                autoComplete="organization"
                maxLength={160}
                name="company"
                required
              />
            </label>
          </div>
        )}
        {mode !== "reset" && (
          <label className="field">
            <span>Work email</span>
            <input autoComplete="email" name="email" required type="email" />
          </label>
        )}
        {mode === "join" && (
          <label className="field">
            <span>Phone <small>Optional</small></span>
            <input
              autoComplete="tel"
              maxLength={40}
              name="phone"
              pattern="[0-9()+. -]{7,40}"
              title="Use 7 to 40 digits, spaces, or standard phone punctuation."
              type="tel"
            />
          </label>
        )}
        {(mode === "join" || mode === "login" || mode === "reset") && (
          <>
            <label className="field">
              <span>Password</span>
              <input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={mode === "login" ? undefined : 12}
                name="password"
                required
                type="password"
              />
            </label>
            {(mode === "join" || mode === "reset") && (
              <label className="field">
                <span>Confirm password</span>
                <input
                  autoComplete="new-password"
                  minLength={12}
                  name="confirm"
                  required
                  type="password"
                />
              </label>
            )}
            {mode === "join" && (
              <span className="field-hint">
                <ShieldCheck size={14} /> Use at least 12 characters.
              </span>
            )}
          </>
        )}
        {error && (
          <p aria-live="polite" className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button button-primary button-large auth-submit" disabled={pending}>
          {pending ? (
            <><LoaderCircle className="spin" size={16} /> One moment…</>
          ) : (
            <>
              {mode === "join"
                ? "Request access"
                : mode === "login"
                  ? "Sign in"
                  : mode === "forgot"
                    ? "Send reset link"
                    : "Update password"}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
      <div className="auth-form-links">
        {mode === "join" && (
          <span>Already have an account? <Link href="/login">Sign in</Link></span>
        )}
        {mode === "login" && (
          <>
            <Link href="/forgot-password">Forgot password?</Link>
            <span>New to D&amp;J? <Link href="/join">Join free</Link></span>
          </>
        )}
        {mode === "forgot" && <Link href="/login"><ArrowLeft size={14} /> Back to sign in</Link>}
        {mode === "reset" && <Link href="/login"><ArrowLeft size={14} /> Back to sign in</Link>}
      </div>
    </div>
  );
}
