import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Seo from "../components/Seo";
import {
  IconMap,
  IconChat,
  IconClock,
  IconCheck,
  IconArrowRight,
  IconBuilding,
  IconTool,
  IconUsers,
  IconBriefcase,
} from "../components/icons";

const roleOptions = ["General Contractor", "Subcontractor", "Supplier", "Engineer", "Other"];
const MESSAGE_MAX = 1000;

// Field chrome (border, radius, focus) comes from the element styles in the
// design system; this only sets width and cancels Foundation's bottom margin.
const inputClass = "w-full !mb-0";

// One entry per topic: the <select> option, the message prompt, and the
// confirmation copy. Values must match the topics public/contact.php accepts.
const TOPICS = {
  demo: {
    label: "Request a demo",
    messageLabel: "What would you like to see?",
    placeholder:
      "Tell us how your team bids, procures, and coordinates today, and what you want the walkthrough to cover.",
    success: "Someone from our team will follow up shortly to schedule a walkthrough at a time that works for you.",
  },
  quote: {
    label: "Quote or catalog question",
    messageLabel: "What do you need quoted?",
    placeholder:
      "Items or SKUs, quantities, delivery ZIP, and when you need them. You can also build a quote from the catalog.",
    success:
      "We will review your request and reply with confirmed pricing and availability. Nothing is ordered or charged.",
  },
  support: {
    label: "Product support",
    messageLabel: "What do you need help with?",
    placeholder: "Describe what you were trying to do and what happened instead. Include the page you were on.",
    success: "Our support team will reply to the email you gave us, usually within one business day.",
  },
  partnership: {
    label: "Partnership",
    messageLabel: "How would you like to work together?",
    placeholder: "Tell us about your company, what you supply or build, and the kind of partnership you have in mind.",
    success: "Thanks for reaching out. We will review your note and reply about next steps.",
  },
  careers: {
    label: "Careers",
    messageLabel: "What would you like to build with us?",
    placeholder: "Tell us about your background and the kind of work you want to do. Links to your resume or portfolio are welcome.",
    success: "Thanks for your interest. We read every note and will reply if there is a fit.",
  },
  other: {
    label: "Something else",
    messageLabel: "How can we help?",
    placeholder: "Tell us what is on your mind and we will point you to the right person.",
    success: "We will read your message and reply to the email you gave us.",
  },
};

const TOPIC_KEYS = Object.keys(TOPICS);

const routes = [
  { topic: "demo", icon: IconBuilding, title: "Sales and demos", text: "See the platform on your own workflow." },
  { topic: "support", icon: IconTool, title: "Support", text: "Account, bidding, or quote problems." },
  { topic: "partnership", icon: IconUsers, title: "Partnerships", text: "Suppliers, integrations, industry groups." },
  { topic: "careers", icon: IconBriefcase, title: "Careers", text: "Help build the platform." },
];

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
  const [params, setParams] = useSearchParams();
  const requested = params.get("topic");
  const topic = TOPIC_KEYS.includes(requested) ? requested : "demo";
  const copy = TOPICS[topic];
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

  // The URL is the single source of truth for the topic, so the select, the
  // route cards, and a shared /contact?topic=... link always agree.
  const setTopic = (next) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.set("topic", next);
        return p;
      },
      { replace: true },
    );
  };

  const chooseRoute = (next) => {
    setSubmitted(false);
    setTopic(next);
    // On narrow screens the form sits below the cards; bring it into view.
    window.requestAnimationFrame(() => {
      const form = document.getElementById("contact-form");
      if (form && window.innerWidth < 1024) form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
      if (!res.ok || !data.ok) throw new Error("Submission failed");
      setValues(EMPTY);
      setTouched({});
      setSubmitted(true);
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
        description="Get in touch with D&J Stratagem. Request a demo, ask a quote or catalog question, get product support, or talk partnerships and careers."
      />

      <PageHeader
        eyebrow="Contact"
        title="Let’s talk about your next project."
        lede="Tell us a bit about how your team bids, procures, and coordinates today, and we’ll show you where D&J Stratagem fits. Pick a topic so your message reaches the right person."
      />

      <Section band="white">
        <div className="grid-x grid-margin-x gap-y-10">
          <div className="cell small-12 large-5">
            <h2 className="text-lg font-semibold tracking-tight text-paper">Where should your message go?</h2>
            <ul className="m-0 mt-4 list-none space-y-3 p-0">
              {routes.map((r) => {
                const Icon = r.icon;
                const selected = topic === r.topic;
                return (
                  <li key={r.topic}>
                    <Link
                      to={`/contact?topic=${r.topic}`}
                      replace
                      aria-current={selected ? "true" : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        chooseRoute(r.topic);
                      }}
                      className={`card-corp card-corp-hover flex items-start gap-4 p-4 no-underline ${
                        selected ? "!border-amber" : ""
                      }`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-amber/10 text-amber">
                        <Icon width={18} height={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-paper">{r.title}</span>
                        <span className="mt-0.5 block text-sm text-steel">{r.text}</span>
                      </span>
                      {selected ? (
                        <span className="label primary shrink-0 self-center">Selected</span>
                      ) : (
                        <IconArrowRight width={16} height={16} className="shrink-0 self-center text-amber" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 space-y-5 border-t border-line pt-6">
              {[
                {
                  icon: <IconChat width={18} height={18} />,
                  title: "hello@djstratageminc.com",
                  detail: "General inquiries and support.",
                  href: "mailto:hello@djstratageminc.com",
                },
                {
                  icon: <IconMap width={18} height={18} />,
                  title: "Los Angeles, California",
                  detail: "Serving general contractors and subcontractors nationwide.",
                },
                {
                  icon: <IconClock width={18} height={18} />,
                  title: "We reply within one business day",
                  detail: "Demos are scheduled at a time that works for your team.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-amber/10 text-amber">
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
                    <p className="mt-0.5 text-sm text-steel">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-steel">
              Looking for a fast answer? Try the{" "}
              <Link to="/resources" className="font-medium text-amber hover:text-amber-2">
                help center FAQ
              </Link>
              , or{" "}
              <Link to="/quote" className="font-medium text-amber hover:text-amber-2">
                review your quote
              </Link>{" "}
              if you have catalog items waiting.
            </p>
          </div>

          <div id="contact-form" className="cell small-12 large-7">
            <div className="card-corp p-6 sm:p-8">
              {submitted ? (
                <div className="animate-fade-in flex flex-col items-start gap-4 py-10" role="status">
                  <div className="flex h-12 w-12 items-center justify-center bg-success/10 text-success">
                    <IconCheck width={22} height={22} />
                  </div>
                  <h2 className="text-xl font-semibold text-paper">Thanks &mdash; message received.</h2>
                  <p className="text-sm text-steel">{copy.success}</p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="secondary" onClick={() => setSubmitted(false)}>
                      Send another message
                    </Button>
                    <Button to="/resources" variant="clear">
                      Browse the help center
                    </Button>
                  </div>
                </div>
              ) : (
                <form name="contact" className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <p className="hidden">
                    <label>
                      Don&rsquo;t fill this out:{" "}
                      <input name="bot-field" tabIndex="-1" autoComplete="off" />
                    </label>
                  </p>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-paper" htmlFor="topic">
                      Topic
                      <span className="ml-1 text-amber" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className={inputClass}
                    >
                      {TOPIC_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {TOPICS[k].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid-x grid-margin-x gap-y-5">
                    <div className="cell small-12 medium-6">
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
                    </div>
                    <div className="cell small-12 medium-6">
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
                  </div>
                  <div className="grid-x grid-margin-x gap-y-5">
                    <div className="cell small-12 medium-6">
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
                    </div>
                    <div className="cell small-12 medium-6">
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
                      className={inputClass}
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
                        {copy.messageLabel}
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
                      className={`${inputClass} resize-none`}
                      placeholder={copy.placeholder}
                    />
                    {topic === "quote" && (
                      <p className="mt-2 text-xs text-steel">
                        Have catalog items in mind? Add them from the{" "}
                        <Link to="/supply/catalog" className="font-medium text-amber hover:text-amber-2">
                          catalog
                        </Link>{" "}
                        and send a full line-item request from your{" "}
                        <Link to="/quote" className="font-medium text-amber hover:text-amber-2">
                          quote
                        </Link>
                        .
                      </p>
                    )}
                  </div>

                  {/* The mail relay requires a non-empty `lines` block for the
                      quote topic. A question typed here is the request, so
                      pass it through rather than failing the submit. */}
                  {topic === "quote" && (
                    <input
                      type="hidden"
                      name="lines"
                      value={values.message.trim() || "See message (no line items attached)."}
                    />
                  )}

                  <div aria-live="polite" role="status">
                    {error && (
                      <p className="border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                        Something went wrong sending your message. Please try again, or email us
                        directly at hello@djstratageminc.com.
                      </p>
                    )}
                  </div>

                  <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                    {submitting ? "Sending…" : "Send message"}
                  </Button>

                  <p className="text-center text-xs text-steel">
                    We&rsquo;ll only use your details to follow up about your message.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section band="stone">
        <Eyebrow>Before you write</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
          Some questions are faster to answer yourself.
        </h2>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {[
            { to: "/resources", title: "Help center", text: "Search answers on bidding, quotes, accounts, and billing." },
            { to: "/supply/catalog", title: "Catalog and quotes", text: "Build a line-item quote and send it from your device." },
            { to: "/pricing", title: "Pricing", text: "Compare plans and see what each one includes." },
          ].map((l) => (
            <div key={l.to} className="cell small-12 medium-4">
              <Link
                to={l.to}
                className="card-corp card-corp-hover flex h-full items-center justify-between gap-4 p-5 no-underline"
              >
                <span>
                  <span className="block text-base font-semibold text-paper">{l.title}</span>
                  <span className="mt-1 block text-sm text-steel">{l.text}</span>
                </span>
                <IconArrowRight width={18} height={18} className="shrink-0 text-amber" />
              </Link>
            </div>
          ))}
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
        className={`${inputClass} ${error ? "!border-danger" : ""}`}
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
