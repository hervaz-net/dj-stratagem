import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import HumanCheck from "../../auth/HumanCheck";
import PasswordField from "../../exchange/components/PasswordField";
import { IconArrowRight, IconCheck } from "../../exchange/components/icons";
import { Mark } from "../Shell";
import { CONTACT_EMAIL } from "../brands";
import { Field, fieldClass, useSeo } from "../parts";

/** Centered card on the company's canvas, the same frame Exchange uses. */
function AuthCard({ brand, title, subtitle, children, footer }) {
  return (
    <section className="px-5 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-md">
        <div className="flex flex-col items-center text-center">
          <Mark slug={brand.slug} size={48} />
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-fg">{title}</h1>
          {subtitle && <p className="mt-2 text-fg-muted">{subtitle}</p>}
        </div>
        <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">{children}</div>
        {footer && <p className="mt-6 text-center text-sm text-fg-muted">{footer}</p>}
      </div>
    </section>
  );
}

function SubmitButton({ busy, children }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand px-5 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-60"
    >
      {busy ? "Please wait…" : children} {!busy && <IconArrowRight width={15} height={15} aria-hidden="true" />}
    </button>
  );
}

const FieldError = ({ children }) => (children ? <p className="mt-1.5 text-xs text-danger">{children}</p> : null);

export function SignUp({ brand }) {
  useSeo(brand, { title: "Create an account", description: `Create a ${brand.name} account.` });
  const { register, user, turnstileSiteKey, setChallengeToken, challengeReset } = useAuth();
  const [values, setValues] = useState({ fullName: "", company: "", email: "", phone: "" });
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (user) return <Navigate to={`${brand.path}/account`} replace />;

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const found = {};
    if (!values.fullName.trim()) found.fullName = "Enter your full name.";
    if (!values.company.trim()) found.company = "Enter your company, or “Personal”.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) found.email = "Enter a valid email address.";
    if (password.length < 12) found.password = "Use at least 12 characters.";
    setErrors(found);
    setMessage("");
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      await register({ ...values, email: values.email.trim(), password, source: brand.slug });
      setDone(true);
    } catch (err) {
      setErrors(err.fields ?? {});
      setMessage(err.fields ? "" : err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <AuthCard brand={brand} title="Request received" subtitle={`Thanks for signing up for ${brand.name}.`}>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
            <IconCheck width={18} height={18} aria-hidden="true" />
          </span>
          <p className="text-sm leading-relaxed text-fg-muted">
            Every new account is reviewed by a person. We&rsquo;ll email you once yours is approved, and then you can sign in.
          </p>
        </div>
        <Link to={brand.path} className="mt-6 inline-flex text-sm font-semibold text-brand hover:text-brand-hover">
          Back to {brand.name}
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      brand={brand}
      title={`Create your ${brand.name} account`}
      subtitle="Every account is reviewed by a person before it’s activated."
      footer={
        <>
          Already have an account?{" "}
          <Link to={`${brand.path}/signin`} className="font-semibold text-brand hover:text-brand-hover">Sign in</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Full name" required>
          <input value={values.fullName} onChange={set("fullName")} autoComplete="name" className={fieldClass} aria-invalid={!!errors.fullName || undefined} />
          <FieldError>{errors.fullName}</FieldError>
        </Field>
        <Field label="Company" required>
          <input value={values.company} onChange={set("company")} autoComplete="organization" placeholder="Or “Personal”" className={fieldClass} aria-invalid={!!errors.company || undefined} />
          <FieldError>{errors.company}</FieldError>
        </Field>
        <Field label="Work email" required>
          <input value={values.email} onChange={set("email")} type="email" autoComplete="email" className={fieldClass} aria-invalid={!!errors.email || undefined} />
          <FieldError>{errors.email}</FieldError>
        </Field>
        <Field label="Phone">
          <input value={values.phone} onChange={set("phone")} type="tel" autoComplete="tel" className={fieldClass} aria-invalid={!!errors.phone || undefined} />
          <FieldError>{errors.phone}</FieldError>
        </Field>
        <div>
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            invalid={!!errors.password}
            hint="At least 12 characters."
          />
          <FieldError>{errors.password}</FieldError>
        </div>
        <HumanCheck siteKey={turnstileSiteKey} onToken={setChallengeToken} resetKey={challengeReset} />
        {message && <p role="alert" className="text-sm text-danger">{message}</p>}
        <SubmitButton busy={busy}>Create account</SubmitButton>
        <p className="text-xs leading-relaxed text-fg-muted">
          By creating an account you agree to the <a href="/terms" className="underline">Terms</a> and{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
      </form>
    </AuthCard>
  );
}

export function SignIn({ brand }) {
  useSeo(brand, { title: "Sign in", description: `Sign in to your ${brand.name} account.` });
  const { login, user, turnstileSiteKey, setChallengeToken, challengeReset } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={`${brand.path}/account`} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return setMessage("Enter your email and password.");
    setBusy(true);
    setMessage("");
    try {
      await login(email.trim(), password);
      navigate(`${brand.path}/account`, { replace: true });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      brand={brand}
      title="Welcome back"
      subtitle={`Sign in to ${brand.name}.`}
      footer={
        <>
          New here?{" "}
          <Link to={`${brand.path}/signup`} className="font-semibold text-brand hover:text-brand-hover">Create an account</Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" className={fieldClass} />
        </Field>
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" />
        <HumanCheck siteKey={turnstileSiteKey} onToken={setChallengeToken} resetKey={challengeReset} />
        {message && <p role="alert" className="text-sm text-danger">{message}</p>}
        <SubmitButton busy={busy}>Sign in</SubmitButton>
        <p className="text-xs text-fg-muted">
          Forgot your password? Email <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand">{CONTACT_EMAIL}</a>.
        </p>
      </form>
    </AuthCard>
  );
}

export function Account({ brand }) {
  useSeo(brand, { title: "Your account", description: `Your ${brand.name} account.` });
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="min-h-[50vh]" aria-busy="true" />;
  if (!user) return <Navigate to={`${brand.path}/signin`} replace />;

  const first = (user.name ?? "").split(" ")[0];
  const rows = [
    ["Name", user.name],
    ["Company", user.company],
    ["Email", user.email],
  ].filter(([, v]) => v);

  return (
    <AuthCard brand={brand} title={first ? `Hi, ${first}` : "Your account"} subtitle={`Signed in to ${brand.name}.`}>
      <dl className="divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-3 text-sm">
            <dt className="text-fg-muted">{k}</dt>
            <dd className="truncate font-medium text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 grid gap-3">
        <a
          href={`${brand.path}${brand.cta.href}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover"
        >
          {brand.cta.label} <IconArrowRight width={15} height={15} aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate(brand.path, { replace: true });
          }}
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-[0.95rem] font-semibold text-fg transition-colors hover:bg-subtle"
        >
          Sign out
        </button>
      </div>
    </AuthCard>
  );
}
