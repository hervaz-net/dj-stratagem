import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Seo from "../components/Seo";
import RoleBadge from "../components/RoleBadge";
import PasswordField from "../components/PasswordField";
import AuthShell, { AuthAlert, authInputClass } from "../components/auth/AuthShell";
import { IconCheck } from "../components/icons";
import useAuth from "../auth/useAuth";
import { useRole } from "../contexts/RoleContext";
import { PRODUCT, CONTACT_EMAIL, ROLES, ROLE_ORDER } from "../brand";

const MIN_PASSWORD = 12;

const EMPTY = { role: "", fullName: "", company: "", email: "", phone: "", password: "", confirm: "" };

/** What each side does on the exchange, in the words of the picker. */
const ROLE_HINT = {
  supplier: "You make or brand products and sell to distributors, or direct to contractors.",
  distributor: "You buy from manufacturers and sell to contractors. You'll see both sides.",
  contractor: "You buy material for jobs and want quotes from suppliers and distributors.",
};

const RADIO_TONE = {
  supplier: "border-role-supplier bg-role-supplier-soft",
  distributor: "border-role-distributor bg-role-distributor-soft",
  contractor: "border-role-contractor bg-role-contractor-soft",
};

const DOT_TONE = {
  supplier: "border-role-supplier bg-role-supplier",
  distributor: "border-role-distributor bg-role-distributor",
  contractor: "border-role-contractor bg-role-contractor",
};

function passwordStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, score);
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Strong", "Very strong"];
const STRENGTH_COLOR = ["", "bg-danger", "bg-warning", "bg-brand", "bg-success"];
const STRENGTH_TEXT = ["", "text-danger", "text-warning", "text-brand", "text-success"];

function PasswordStrengthMeter({ password }) {
  const score = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              score >= seg ? STRENGTH_COLOR[score] : "bg-line"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${STRENGTH_TEXT[score]}`} aria-live="polite">
        {STRENGTH_LABEL[score]}
      </p>
    </div>
  );
}

function validate(v) {
  const e = {};
  if (!ROLES[v.role]) e.role = "Choose which side of the marketplace you're on.";
  if (!v.fullName.trim()) e.fullName = "Enter your full name.";
  if (!v.company.trim()) e.company = "Enter your company.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email address.";
  if (v.phone && !/^[\d\s()+.-]{7,40}$/.test(v.phone)) e.phone = "Enter a valid phone number.";

  if (v.password.length < MIN_PASSWORD) {
    e.password = `Use at least ${MIN_PASSWORD} characters.`;
  } else if (v.email && v.password.toLowerCase().includes(v.email.toLowerCase())) {
    e.password = "Don't use your email address as your password.";
  }
  if (v.confirm !== v.password) e.confirm = "Passwords don't match.";

  return e;
}

function Field({ id, label, value, onChange, onBlur, error, required, optional, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-fg">
        <span>
          {label}
          {required && <span className="ml-1 text-brand" aria-hidden="true">*</span>}
        </span>
        {optional && <span className="text-xs font-normal text-fg-muted">Optional</span>}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${authInputClass} ${error ? "border-danger" : "border-line"}`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Radio cards for the three sides of the marketplace. */
function RolePicker({ value, onChange, error }) {
  return (
    <fieldset aria-describedby={error ? "role-error" : undefined}>
      <legend className="text-sm font-semibold text-fg">
        Which side of the marketplace is your company on?
        <span className="ml-1 text-brand" aria-hidden="true">*</span>
      </legend>
      <p className="mt-1 text-sm text-fg-muted">Pick the one you'll use most. You can switch views later.</p>
      <div className="mt-3 grid grid-cols-1 gap-3">
        {ROLE_ORDER.map((key, i) => {
          const checked = value === key;
          return (
            <label
              key={key}
              className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${
                checked ? RADIO_TONE[key] : "border-line bg-surface hover:border-line-strong hover:bg-subtle"
              }`}
            >
              <input
                // First radio carries the id so validation can focus the group.
                id={i === 0 ? "role" : undefined}
                type="radio"
                name="role"
                value={key}
                checked={checked}
                onChange={() => onChange(key)}
                aria-invalid={error ? true : undefined}
                className="sr-only"
              />
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  checked ? DOT_TONE[key] : "border-line-strong"
                }`}
                aria-hidden="true"
              >
                {checked && <span className="h-2 w-2 rounded-full bg-surface" />}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.95rem] font-semibold text-fg">{ROLES[key].label}</span>
                  <RoleBadge role={key} />
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-fg-muted">{ROLE_HINT[key]}</span>
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id="role-error" className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export default function Register() {
  const { user, loading, register } = useAuth();
  const { setRole } = useRole();
  const [params] = useSearchParams();
  const [values, setValues] = useState(() => {
    const preset = params.get("role");
    return { ...EMPTY, role: ROLES[preset] ? preset : "" };
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard/overview" replace />;

  const set = (name) => (val) => {
    const next = { ...values, [name]: val };
    setValues(next);
    if (touched[name]) setErrors(validate(next));
  };

  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  };

  const pickRole = (key) => {
    const next = { ...values, role: key };
    setValues(next);
    setTouched((t) => ({ ...t, role: true }));
    setErrors(validate(next));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    setSubmitting(true);
    try {
      // The API does not store a marketplace role yet, so it stays client-side.
      await register({
        fullName: values.fullName,
        company: values.company,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      setRole(values.role);
      setDone(true);
    } catch (err) {
      if (err.fields) setErrors(err.fields);
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const chosen = ROLES[values.role];

  return (
    <>
      <Seo
        title="Create your company account"
        description={`Request a ${PRODUCT} account for your company: manufacturers and vendors, distributors, or contractors.`}
        noindex
      />

      <AuthShell
        wide
        title="One account for every side of the supply chain."
        text="Manufacturers reach distributors and contractors. Distributors buy upstream and sell downstream. Contractors post what the job needs."
        footnote={`Free to join while we onboard early users. Our team reviews every request before first sign-in. Questions: ${CONTACT_EMAIL}`}
      >
        {done ? (
          <div className="animate-fade-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
              <IconCheck width={22} height={22} aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-fg">Request received.</h1>
            <p className="mt-3 leading-relaxed text-fg-muted">
              Accounts are reviewed by our team before first sign-in. We&rsquo;ll email you at{" "}
              <span className="font-semibold text-fg">{values.email}</span> once yours is approved.
            </p>
            {chosen && (
              <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl bg-subtle px-4 py-3 text-sm text-fg-muted">
                You&rsquo;ll start in the <RoleBadge role={values.role} /> view on this device.
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/" variant="secondary">
                Back to home
              </Button>
              <Button to="/projects" variant="ghost">
                See sample demand
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-fg">Create your company account</h1>
            <p className="mt-2 text-fg-muted">
              Tell us who you are and how you trade. Our team approves accounts before first sign-in.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
              <RolePicker value={values.role} onChange={pickRole} error={touched.role && errors.role} />

              <div className="space-y-5 border-t border-line pt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    id="fullName"
                    label="Full name"
                    required
                    autoComplete="name"
                    value={values.fullName}
                    onChange={set("fullName")}
                    onBlur={blur("fullName")}
                    error={touched.fullName && errors.fullName}
                  />
                  <Field
                    id="company"
                    label="Company"
                    required
                    autoComplete="organization"
                    value={values.company}
                    onChange={set("company")}
                    onBlur={blur("company")}
                    error={touched.company && errors.company}
                  />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    id="email"
                    label="Work email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={values.email}
                    onChange={set("email")}
                    onBlur={blur("email")}
                    error={touched.email && errors.email}
                  />
                  <Field
                    id="phone"
                    label="Phone"
                    type="tel"
                    optional
                    autoComplete="tel"
                    value={values.phone}
                    onChange={set("phone")}
                    onBlur={blur("phone")}
                    error={touched.phone && errors.phone}
                  />
                </div>

                <div>
                  <PasswordField
                    id="password"
                    label="Password"
                    autoComplete="new-password"
                    value={values.password}
                    onChange={set("password")}
                    invalid={Boolean(touched.password && errors.password)}
                    describedBy={touched.password && errors.password ? "password-error" : undefined}
                    hint={
                      touched.password && errors.password
                        ? undefined
                        : `At least ${MIN_PASSWORD} characters. Length matters more than symbols.`
                    }
                  />
                  <PasswordStrengthMeter password={values.password} />
                  {touched.password && errors.password && (
                    <p id="password-error" className="mt-1.5 text-xs text-danger">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <PasswordField
                    id="confirm"
                    label="Confirm password"
                    autoComplete="new-password"
                    value={values.confirm}
                    onChange={set("confirm")}
                    invalid={Boolean(touched.confirm && errors.confirm)}
                    describedBy={touched.confirm && errors.confirm ? "confirm-error" : undefined}
                  />
                  {touched.confirm && errors.confirm && (
                    <p id="confirm-error" className="mt-1.5 text-xs text-danger">
                      {errors.confirm}
                    </p>
                  )}
                </div>
              </div>

              <div aria-live="polite" role="status">
                {serverError && <AuthAlert>{serverError}</AuthAlert>}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Sending request…" : "Request account"}
              </Button>
              <p className="text-center text-xs leading-relaxed text-fg-muted">
                By requesting an account you agree to the{" "}
                <Link to="/terms" className="font-semibold text-brand hover:text-brand-hover">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-semibold text-brand hover:text-brand-hover">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>

            <p className="mt-8 border-t border-line pt-6 text-center text-sm text-fg-muted">
              Already have an account?{" "}
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
