import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Section from "../components/Section";
import PageHero from "../components/nocturne/PageHero";
import Button from "../components/Button";
import Seo from "../components/Seo";
import { IconMap, IconChat, IconClock, IconCheck } from "../components/icons";

const roleOptions = ["General Contractor", "Subcontractor", "Supplier", "Engineer", "Other"];
const MESSAGE_MAX = 1000;

// Values match the keys in public/contact.php $topics. Resource links use
// ?topic=partnership, which maps to the relay's `partner` key.
const TOPICS = [
  {
    key: "demo",
    label: "Request a demo",
    button: "Request a demo",
    prompt: "What are you looking to solve?",
    placeholder: "Tell us about your current bidding, procurement, or coordination process.",
    done: "Someone from our team will follow up shortly to schedule time.",
    note: "We\u2019ll only use your details to follow up about a demo.",
  },
  {
    key: "support",
    label: "Product support",
    button: "Send to support",
    prompt: "What do you need help with?",
    placeholder: "What you were doing, what you expected, and what happened instead.",
    done: "Our team will reply to your email within one business day.",
    note: "We\u2019ll only use your details to reply to this request.",
  },
  {
    key: "partner",
    label: "Partnership",
    button: "Send message",
    prompt: "What would you like to explore together?",
    placeholder: "Who you are, what you offer, and how you see us working together.",
    done: "Someone from our team will review this and reply within one business day.",
    note: "We\u2019ll only use your details to reply about a partnership.",
  },
  {
    key: "careers",
    label: "Careers",
    button: "Send message",
    prompt: "Tell us about yourself",
    placeholder: "Your background and the kind of role you\u2019re looking for.",
    done: "Thanks for reaching out. We\u2019ll reply by email.",
    note: "We\u2019ll only use your details to reply about careers.",
  },
  {
    key: "other",
    label: "Something else",
    button: "Send message",
    prompt: "How can we help?",
    placeholder: "Tell us what\u2019s on your mind.",
    done: "Our team will reply to your email within one business day.",
    note: "We\u2019ll only use your details to reply to this message.",
  },
];
const TOPIC_ALIASES = { partnership: "partner", sales: "demo" };
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
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTopic = (searchParams.get("topic") ?? "").toLowerCase();
  const topicKey = TOPIC_ALIASES[rawTopic] ?? rawTopic;
  // The URL is the single source of truth so resource-page links, the select,
  // and a refreshed tab all agree.
  const topic = TOPICS.find((t) => t.key === topicKey) ?? TOPICS[0];
  const setTopic = (key) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (key === TOPICS[0].key) next.delete("topic");
        else next.set("topic", key);
        return next;
      },
      { replace: true },
    );

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
            <p className="text-sm text-steel">
              Looking for a quick answer? Try the{" "}
              <Link to="/resources" className="font-semibold text-paper underline-offset-4 hover:underline">
                help center
              </Link>
              .
            </p>
          </div>

          <div className="slab p-6 sm:p-8">
            {submitted ? (
              <div className="animate-fade-in flex flex-col items-start gap-4 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                  <IconCheck width={22} height={22} />
                </div>
                <h2 className="text-xl font-semibold text-paper">Thanks &mdash; message received.</h2>
                <p className="text-sm text-steel">{topic.done}</p>
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
                    maxLength={LIMITS.name}
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
                    maxLength={LIMITS.company}
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
                    maxLength={LIMITS.email}
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
                    maxLength={LIMITS.phone}
                    value={values.phone}
                    onChange={setField("phone")}
                    onBlur={onBlur("phone")}
                    error={touched.phone && errors.phone}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-paper" htmlFor="topic">
                    Topic
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={topic.key}
                    onChange={(e) => setTopic(e.target.value)}
                    className={`${inputClass} border-line`}
                  >
                    {TOPICS.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
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
                      {topic.prompt}
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
                    placeholder={topic.placeholder}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-sm text-danger">{errors.message}</p>
                  )}
                </div>

                <div aria-live="polite" role="status">
                  {error && (
                    <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                      {typeof error === "string"
                        ? error
                        : "Something went wrong sending your message. Please try again, or email us directly at hello@djstratageminc.com."}
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                  {submitting ? "Sending…" : topic.button}
                </Button>

                <p className="text-center text-xs text-steel">{topic.note}</p>
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
