import { useState } from "react";
import Section from "../components/Section";
import PageHero from "../components/nocturne/PageHero";
import Button from "../components/Button";
import Seo from "../components/Seo";
import { IconMap, IconChat, IconClock, IconCheck } from "../components/icons";

const roleOptions = ["General Contractor", "Subcontractor", "Supplier", "Engineer", "Other"];
const MESSAGE_MAX = 1000;
// Must match public/contact.php $limits. A longer paste used to 422 with a
// generic "something went wrong" and no field to fix.
const LIMITS = { name: 120, company: 160, email: 254, phone: 40, message: MESSAGE_MAX };

const inputClass =
  "w-full rounded-md border bg-ink px-3.5 py-2.5 text-sm text-paper outline-hidden transition-colors " +
  "placeholder:text-steel/70 focus:border-amber";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  else if (values.name.trim().length > LIMITS.name)
    errors.name = `Name must be ${LIMITS.name} characters or fewer.`;
  if (!values.company.trim()) errors.company = "Please enter your company.";
  else if (values.company.trim().length > LIMITS.company)
    errors.company = `Company must be ${LIMITS.company} characters or fewer.`;
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "That doesn't look like a valid email address.";
  else if (values.email.trim().length > LIMITS.email)
    errors.email = `Email must be ${LIMITS.email} characters or fewer.`;
  if (values.phone && !/^[\d\s()+.-]{7,}$/.test(values.phone))
    errors.phone = "Please enter a valid phone number.";
  else if (values.phone.trim().length > LIMITS.phone)
    errors.phone = `Phone must be ${LIMITS.phone} characters or fewer.`;
  if (values.message.length > LIMITS.message)
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`;
  return errors;
}

const EMPTY = { name: "", company: "", email: "", phone: "", message: "" };

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState(roleOptions[0]);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const setField = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    if (touched[name]) setErrors(validate(next));
  };

  const onBlur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, company: true, email: true, phone: true });
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard and screen-reader users
      // land on it rather than hunting for the message.
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }

    setSubmitting(true);
    setError(false);

    // Without a deadline, a hung request leaves `submitting` true forever and
    // the button permanently disabled with no error shown.
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/contact.php", {
        method: "POST",
        body: new FormData(e.target),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        const fields = Array.isArray(data.fields) ? data.fields : [];
        if (fields.length > 0) {
          setError(`Check ${fields.join(", ")} and try again. A field is missing or too long.`);
        } else {
          throw new Error("Submission failed");
        }
      } else {
        setValues(EMPTY);
        setTouched({});
        setSubmitted(true);
      }
    } catch {
      setError(true);
    } finally {
      window.clearTimeout(timer);
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Contact"
        description="Request a demo of D&J Stratagem. Tell us how your team bids, procures, and coordinates today, and we'll show you where the platform fits."
      />
      <PageHero
        index="09"
        kicker="Contact"
        title={<>Say hello. <em>We answer.</em></>}
        lede="Tell us how your team bids, sources, and coordinates today. A person reads every note and replies within one business day."
      />

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            {[
              {
                icon: <IconMap width={18} height={18} />,
                title: "Los Angeles, California",
                detail: "Serving general contractors and subcontractors nationwide.",
              },
              {
                icon: <IconChat width={18} height={18} />,
                title: "hello@djstratageminc.com",
                detail: "General inquiries and demo requests.",
                href: "mailto:hello@djstratageminc.com",
              },
              {
                icon: <IconClock width={18} height={18} />,
                title: "We reply within one business day",
                detail: "Demos are scheduled at a time that works for your team.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
                  {item.icon}
                </div>
                <div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-paper hover:text-amber"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-paper">{item.title}</p>
                  )}
                  <p className="mt-0.5 text-sm text-steel">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-line bg-ink-2 p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                  <IconCheck width={22} height={22} />
                </div>
                <h2 className="text-xl font-semibold text-paper">Thanks &mdash; message received.</h2>
                <p className="text-sm text-steel">
                  Someone from our team will follow up shortly to schedule time.
                </p>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form name="contact" method="post" action="/contact.php" className="space-y-5" onSubmit={handleSubmit} noValidate>
                <p className="hidden">
                  <label>
                    Don&rsquo;t fill this out:{" "}
                    <input name="bot-field" tabIndex="-1" autoComplete="off" />
                  </label>
                </p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    name="name"
                    value={values.name}
                    onChange={setField("name")}
                    onBlur={onBlur("name")}
                    error={touched.name ? errors.name : null}
                    autoComplete="name"
                  />
                  <Field
                    label="Company"
                    name="company"
                    value={values.company}
                    onChange={setField("company")}
                    onBlur={onBlur("company")}
                    error={touched.company ? errors.company : null}
                    autoComplete="organization"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Work email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={setField("email")}
                    onBlur={onBlur("email")}
                    error={touched.email ? errors.email : null}
                    autoComplete="email"
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={values.phone}
                    onChange={setField("phone")}
                    onBlur={onBlur("phone")}
                    error={touched.phone ? errors.phone : null}
                    autoComplete="tel"
                    optional
                  />
                </div>

                <div>
                  <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-paper">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={inputClass + " appearance-none"}
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-paper">
                    <span>What are you trying to solve?</span>
                    <span className="text-xs font-normal text-steel">
                      {values.message.length}/{MESSAGE_MAX}
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={MESSAGE_MAX}
                    value={values.message}
                    onChange={setField("message")}
                    onBlur={onBlur("message")}
                    placeholder="Tell us about your current bidding, procurement, or coordination process."
                    className={inputClass + " resize-y"}
                  />
                  {touched.message && errors.message && (
                    <p className="mt-1.5 text-xs text-danger">{errors.message}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-danger" role="alert">
                    {typeof error === "string"
                      ? error
                      : "Something went wrong sending that. Please try again, or email hello@djstratageminc.com directly."}
                  </p>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                  {submitting ? "Sending\u2026" : "Request a demo"}
                </Button>

                <p className="text-center text-xs text-steel">
                  By submitting, you agree to our{" "}
                  <a href="/privacy" className="underline hover:text-paper">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  optional,
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-paper">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-steel">Optional</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        required={!optional}
        className={inputClass + (error ? " border-danger" : "")}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
