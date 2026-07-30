import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Button from "../components/Button";
import Logo from "../components/Logo";
import Seo from "../components/Seo";
import PasswordField from "../components/PasswordField";
import { IconCheck } from "../components/icons";
import useAuth from "../auth/useAuth";

const MIN_PASSWORD = 12;

const EMPTY = { fullName: "", company: "", email: "", phone: "", password: "", confirm: "" };

/**
 * Calculates a password strength score from zero to four.
 * @param {string} pw - The password to evaluate.
 * @return {number} A score from 0 to 4 based on password length and character variety.
 */
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
const STRENGTH_COLOR = ["", "bg-[var(--viz-red)]", "bg-[var(--viz-gold)]", "bg-[var(--viz-cyan)]", "bg-[var(--viz-green)]"];
const STRENGTH_TEXT = ["", "text-[var(--viz-red)]", "text-[var(--viz-gold)]", "text-[var(--viz-cyan)]", "text-[var(--viz-green)]"];

/**
 * Displays a segmented visual indicator and label for password strength.
 * @param {Object} props - Component properties.
 * @param {string} props.password - The password to evaluate.
 * @return {JSX.Element|null} The strength meter, or `null` when no password is provided.
 */
function PasswordStrengthMeter({ password }) {
  const score = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
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

/**
 * Validates registration form values and collects field-specific error messages.
 * @param {Object} v - The registration form values.
 * @return {Object} An object containing validation errors keyed by field name.
 */
function validate(v) {
  const e = {};
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

function Field({ id, label, value, onChange, onBlur, error, required, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-paper">
        {label}
        {required && <span className="ml-1 text-amber" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-md border bg-ink px-4 py-2.5 text-sm text-paper outline-hidden transition-colors placeholder:text-steel/60 focus:border-amber ${
          error ? "border-danger" : "border-line"
        }`}
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

/**
 * Render the account access request form and confirmation view.
 */
export default function Register() {
  const { user, loading, register } = useAuth();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard/suppliers" replace />;

  const set = (name) => (val) => {
    const next = { ...values, [name]: val };
    setValues(next);
    if (touched[name]) setErrors(validate(next));
  };

  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
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
      await register({
        fullName: values.fullName,
        company: values.company,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      setDone(true);
    } catch (err) {
      if (err.fields) setErrors(err.fields);
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Request access"
        description="Request a D&J Stratagem platform account."
        noindex
      />

      <div className="mx-auto flex w-full max-w-lg flex-col justify-center px-6 py-16 md:py-24">
        <div className="rounded-2xl border border-line bg-ink-2 p-8 shadow-xl shadow-brand/5">
          <Link to="/" className="inline-block" aria-label="D&J Stratagem — home">
            <Logo />
          </Link>

          {done ? (
            <div className="animate-fade-in mt-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                <IconCheck width={22} height={22} />
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-paper">
                Request received.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-steel">
                Accounts are reviewed by our team before first sign-in. We&rsquo;ll email you at{" "}
                <span className="font-medium text-paper">{values.email}</span> once yours is
                approved.
              </p>
              <Button to="/" variant="secondary" className="mt-6">
                Back to home
              </Button>
            </div>
          ) : (
            <>
              <h1 className="mt-8 text-3xl font-semibold tracking-tight text-paper">
                Request access
              </h1>
              <p className="mt-2 text-sm text-steel">
                Tell us who you are. Our team approves accounts before first sign-in.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
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
                <Field
                  id="email"
                  label="Work email"
                  type="email"
                  required
                  autoComplete="email"
                  value={values.email}
                  onChange={set("email")}
                  onBlur={blur("email")}
                  error={touched.email && errors.email}
                />
                <Field
                  id="phone"
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={set("phone")}
                  onBlur={blur("phone")}
                  error={touched.phone && errors.phone}
                />

                <PasswordField
                  id="password"
                  label="Password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={set("password")}
                  invalid={Boolean(touched.password && errors.password)}
                  describedBy={
                    touched.password && errors.password ? "password-error" : undefined
                  }
                  hint={
                    touched.password && errors.password
                      ? undefined
                      : `At least ${MIN_PASSWORD} characters. Length matters more than symbols.`
                  }
                />
                <PasswordStrengthMeter password={values.password} />
                {touched.password && errors.password && (
                  <p id="password-error" className="-mt-2 text-xs text-danger">
                    {errors.password}
                  </p>
                )}

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
                  <p id="confirm-error" className="-mt-2 text-xs text-danger">
                    {errors.confirm}
                  </p>
                )}

                <div aria-live="polite" role="status">
                  {serverError && (
                    <div className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                      {serverError}
                    </div>
                  )}
                </div>

                <Button type="submit" variant="primary" className="mt-2 w-full" disabled={submitting}>
                  {submitting ? "Sending request…" : "Request access"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-steel">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-amber hover:text-amber-2">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
