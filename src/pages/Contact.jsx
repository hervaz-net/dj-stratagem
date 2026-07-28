import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import Seo from "../components/Seo";
import { IconMap, IconChat, IconClock, IconCheck } from "../components/icons";

const roleOptions = ["General Contractor", "Subcontractor", "Supplier", "Engineer", "Other"];
const MESSAGE_MAX = 1000;

const inputClass =
  "w-full rounded-md border bg-ink px-3.5 py-2.5 text-sm text-paper outline-none transition-colors " +
  "placeholder:text-steel/70 focus:border-amber";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.company.trim()) errors.company = "Please enter your company.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "That doesn't look like a valid email address.";
  if (values.phone && !/^[\d\s()+.-]{7,}$/.test(values.phone))
    errors.phone = "Please enter a valid phone number.";
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

    try {
      const res = await fetch("/contact.php", {
        method: "POST",
        body: new FormData(e.target),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("Submission failed");
      setValues(EMPTY);
      setTouched({});
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Contact"
        description="Request a demo of D&J Stratagem. Tell us how your team bids, procures, and coordinates today, and we'll show you where the platform fits."
      />

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          Let&rsquo;s talk about your next project.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Tell us a bit about how your team bids, procures, and coordinates today, and we&rsquo;ll
          show you where D&amp;J Stratagem fits.
        </p>
      </Section>

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
                title: "hello@djstratagem.com",
                detail: "General inquiries and demo requests.",
                href: "mailto:hello@djstratagem.com",
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
                      className="text-sm font-semibold text-paper transition-colors hover:text-amber"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-paper">{item.title}</p>
                  )}
                  <p className="mt-1 text-sm text-steel">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
            {submitted ? (
              <div className="animate-fade-in flex flex-col items-start gap-4 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
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
              <form name="contact" className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                    autoComplete="name"
                    required
                    value={values.name}
                    onChange={setField("name")}
                    onBlur={onBlur("name")}
                    error={touched.name && errors.name}
                  />
                  <Field
                    label="Company"
                    name="company"
                    autoComplete="organization"
                    required
                    value={values.company}
                    onChange={setField("company")}
                    onBlur={onBlur("company")}
                    error={touched.company && errors.company}
                  />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={values.email}
                    onChange={setField("email")}
                    onBlur={onBlur("email")}
                    error={touched.email && errors.email}
                  />
                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={setField("phone")}
                    onBlur={onBlur("phone")}
                    error={touched.phone && errors.phone}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-paper" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`${inputClass} border-line`}
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <label className="block text-sm font-medium text-paper" htmlFor="message">
                      What are you looking to solve?
                    </label>
                    <span className="text-xs tabular-nums text-steel">
                      {values.message.length}/{MESSAGE_MAX}
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={MESSAGE_MAX}
                    value={values.message}
                    onChange={setField("message")}
                    className={`${inputClass} resize-none border-line`}
                    placeholder="Tell us about your current bidding, procurement, or coordination process."
                  />
                </div>

                <div aria-live="polite" role="status">
                  {error && (
                    <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                      Something went wrong sending your message. Please try again, or email us
                      directly at hello@djstratagem.com.
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                  {submitting ? "Sending…" : "Request a demo"}
                </Button>

                <p className="text-center text-xs text-steel">
                  We&rsquo;ll only use your details to follow up about a demo.
                </p>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({ label, name, type = "text", required, error, ...rest }) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-paper" htmlFor={name}>
        {label}
        {required && (
          <span className="ml-1 text-amber" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClass} ${error ? "border-danger focus:border-danger" : "border-line"}`}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
