"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

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
      <div aria-live="polite" className="alert alert-success items-start" role="status">
        <div>
          <h2 className="text-xl font-semibold">
            {mode === "join" ? "Request received." : "You’re all set."}
          </h2>
          <p className="mt-1">{confirmation}</p>
          <Link className="btn btn-outline mt-4" href={mode === "join" ? "/" : "/login"}>
            {mode === "join" ? "Back to home" : "Continue to sign in"}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  const { title, description } = headings[mode];

  return (
    <div className="w-full max-w-md">
      <div className="mb-6">
        <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
          {mode === "join" ? "Request access" : mode === "login" ? "Member sign in" : "Account help"}
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-base-content/70">{description}</p>
      </div>
      <form className="grid gap-4" onSubmit={submit}>
        {mode === "join" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Full name</legend>
              <input className="input" autoComplete="name" maxLength={120} name="fullName" required />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Company</legend>
              <input
                className="input"
                autoComplete="organization"
                maxLength={160}
                name="company"
                required
              />
            </fieldset>
          </div>
        )}
        {mode !== "reset" && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Work email</legend>
            <input className="input" autoComplete="email" name="email" required type="email" />
          </fieldset>
        )}
        {mode === "join" && (
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Phone <span className="font-normal text-base-content/50">Optional</span>
            </legend>
            <input
              className="input"
              autoComplete="tel"
              maxLength={40}
              name="phone"
              pattern="[0-9()+. -]{7,40}"
              title="Use 7 to 40 digits, spaces, or standard phone punctuation."
              type="tel"
            />
          </fieldset>
        )}
        {(mode === "join" || mode === "login" || mode === "reset") && (
          <>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input
                className="input"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={mode === "login" ? undefined : 12}
                name="password"
                required
                type="password"
              />
            </fieldset>
            {(mode === "join" || mode === "reset") && (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Confirm password</legend>
                <input
                  className="input"
                  autoComplete="new-password"
                  minLength={12}
                  name="confirm"
                  required
                  type="password"
                />
              </fieldset>
            )}
            {mode === "join" && (
              <p className="flex items-center gap-2 text-xs text-base-content/60">
                <ShieldCheck aria-hidden="true" size={14} /> Use at least 12 characters.
              </p>
            )}
          </>
        )}
        {error && (
          <p aria-live="polite" className="alert alert-error text-sm" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary w-full" disabled={pending} type="submit">
          {pending ? (
            <><span className="loading loading-spinner loading-sm" /> One moment…</>
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
      <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm text-base-content/70">
        {mode === "join" && (
          <span>Already have an account? <Link className="link link-primary" href="/login">Sign in</Link></span>
        )}
        {mode === "login" && (
          <>
            <Link className="link link-primary" href="/forgot-password">Forgot password?</Link>
            <span>New to D&amp;J? <Link className="link link-primary" href="/join">Join free</Link></span>
          </>
        )}
        {mode === "forgot" && (
          <Link className="link link-primary inline-flex items-center gap-1" href="/login">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        )}
        {mode === "reset" && (
          <Link className="link link-primary inline-flex items-center gap-1" href="/login">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        )}
      </div>
    </div>
  );
}
