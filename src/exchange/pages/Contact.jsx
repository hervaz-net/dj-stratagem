import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Section from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import Seo from "../components/Seo";
import { IconMap, IconMail, IconClock, IconCheck } from "../components/icons";
import { PRODUCT, COMPANY, CONTACT_EMAIL, LOCATION, ROLES, ROLE_ORDER } from "../brand";

const TOPICS = [
  { key: "buying", label: "Buying", detail: "Post requests and source material" },
  { key: "selling", label: "Selling", detail: "List products and quote requests" },
  { key: "partnership", label: "Distributor partnership", detail: "Bring your branches or lines on board" },
  { key: "support", label: "Support", detail: "Help with an account or the site" },
];

const roleOptions = [...ROLE_ORDER.map((k) => ROLES[k].label), "Other"];
const MESSAGE_MAX = 1000;
const LIMITS = { name: 120, company: 160, email: 254, phone: 40, message: MESSAGE_MAX };

const inputClass =
  "w-full rounded-xl border bg-surface px-3.5 py-2.5 text-[0.95rem] text-fg outline-hidden transition-colors " +
  "placeholder:text-fg-muted focus:border-brand";

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

/** Pre-filled email, offered when the form can't reach the server. */
function composeMailto(values, role, topic) {
  const subject = encodeURIComponent(`${topic} inquiry from ${values.name} (${values.company})`);
  const body = encodeURIComponent(
    [
      `Name: ${values.name}`,
      `Company: ${values.company}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Role: ${role}`,
      `Topic: ${topic}`,
      "",
      values.message || "(no message)",
    ].join("\n"),
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

/** A non-JSON answer means the host served something other than the handler. */
async function postForm(url, form, signal) {
  const res = await fetch(url, { method: "POST", body: new FormData(form), signal });
  const type = res.headers.get("content-type") || "";
  if (!type.includes("json")) return { res, data: null };
  return { res, data: await res.json().catch(() => null) };
}

export default function Contact() {
  const [params] = useSearchParams();
  const [topic, setTopic] = useState(() =>
    TOPICS.some((t) => t.key === params.get("topic")) ? params.get("topic") : TOPICS[0].key,
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
      // /send-demo.php is the WAF-safe alias when the host answers /contact.php with HTML.
      let { res, data } = await postForm("/contact.php", e.target, controller.signal);
      if (!data) ({ res, data } = await postForm("/send-demo.php", e.target, controller.signal));
      if (!res.ok || !data?.ok) {
        const fields = Array.isArray(data?.fields) ? data.fields : [];
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
        description={`Talk to the ${PRODUCT} team about buying, selling, distributor partnerships, or support. Based in ${LOCATION}.`}
      />

      <PageHero eyebrow="Contact" title="Talk to the team behind the marketplace.">
        Whether you buy material, sell it, or run the branches in between, tell us how you trade
        today and we&rsquo;ll show you where {PRODUCT} fits.
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="space-y-4">
            {[
              {
                icon: <IconMail width={18} height={18} aria-hidden="true" />,
                title: CONTACT_EMAIL,
                detail: "Buying, selling, partnerships, and support.",
                href: `mailto:${CONTACT_EMAIL}`,
              },
              {
                icon: <IconClock width={18} height={18} aria-hidden="true" />,
                title: "We reply within one business day",
                detail: "Walkthroughs are scheduled at a time that works for your team.",
              },
              {
                icon: <IconMap width={18} height={18} aria-hidden="true" />,
                title: LOCATION,
                detail: `Home of ${COMPANY}.`,
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="break-words font-semibold text-fg transition-colors hover:text-brand"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <p className="font-semibold text-fg">{item.title}</p>
                  )}
                  <p className="mt-1 text-sm text-fg-muted">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-8">
            {submitted ? (
              <div className="animate-fade-in flex flex-col items-start gap-4 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success">
                  <IconCheck width={22} height={22} aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold text-fg">Thanks &mdash; message received.</h2>
                <p className="text-[0.95rem] text-fg-muted">
                  Someone from our team will follow up shortly.
                </p>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form name="contact" className="space-y-6" onSubmit={handleSubmit} noValidate>
                <p className="hidden">
                  <label>
                    Don&rsquo;t fill this out:{" "}
                    <input name="bot-field" tabIndex="-1" autoComplete="off" />
                  </label>
                </p>

                <fieldset>
                  <legend className="mb-3 text-sm font-semibold text-fg">What can we help with?</legend>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {TOPICS.map((t) => (
                      <label
                        key={t.key}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3.5 transition-colors hover:bg-subtle has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand"
                      >
                        <input
                          type="radio"
                          name="topic"
                          value={t.key}
                          checked={topic === t.key}
                          onChange={() => setTopic(t.key)}
                          className="mt-1 h-4 w-4 shrink-0 accent-[var(--brand)]"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-fg">{t.label}</span>
                          <span className="block text-xs text-fg-muted">{t.detail}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

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
                  <label className="mb-2 block text-sm font-semibold text-fg" htmlFor="role">
                    Your business
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
                    <label className="block text-sm font-semibold text-fg" htmlFor="message">
                      Tell us a bit more
                    </label>
                    <span className="text-xs tabular-nums text-fg-muted">
                      {values.message.length}/{MESSAGE_MAX}
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={MESSAGE_MAX}
                    value={values.message}
                    onChange={setField("message")}
                    className={`${inputClass} resize-none border-line`}
                    placeholder="What you buy or sell, the categories you work in, and the area you serve."
                  />
                </div>

                <div aria-live="polite" role="status">
                  {error && (
                    <p className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
                      {typeof error === "string"
                        ? error
                        : "Something went wrong sending your message."}{" "}
                      <a
                        className="font-semibold underline underline-offset-2"
                        href={composeMailto(values, role, TOPICS.find((t) => t.key === topic)?.label ?? topic)}
                      >
                        Email {CONTACT_EMAIL}
                      </a>{" "}
                      instead and we&rsquo;ll follow up.
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Sending…" : "Send message"}
                </Button>

                <p className="text-center text-xs text-fg-muted">
                  We&rsquo;ll only use your details to reply to this message.
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
      <label className="mb-2 block text-sm font-semibold text-fg" htmlFor={name}>
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
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
