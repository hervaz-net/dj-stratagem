"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

const CONTACT_API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API_URL ?? "/contact.php";

const ACCESS_TOPICS = [
  "Professional access",
  "Growth access",
  "Enterprise access",
];

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [contextTopic, setContextTopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get("topic") ?? "";
    if (ACCESS_TOPICS.includes(topic)) {
      setContextTopic(topic);
      setSelectedTopic("other");
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const selectedTopic = String(data.get("topic") || "");
    const topic =
      selectedTopic === "other"
        ? contextTopic || "Another question"
        : selectedTopic === "buying"
          ? "Finding or sourcing materials"
          : selectedTopic === "selling"
            ? "Listing materials or services"
            : selectedTopic === "partnership"
              ? "Partnership"
              : "Platform or account question";
    const message = String(data.get("message") || "");
    const payload = {
      name: String(data.get("name") || ""),
      company: String(data.get("company") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      role: String(data.get("role") || ""),
      topic:
        selectedTopic === "buying"
          ? "buying"
          : selectedTopic === "selling"
            ? "selling"
            : selectedTopic === "partnership"
              ? "partnership"
              : selectedTopic === "fleet"
                ? "fleet"
                : "support",
      message: [topic ? `Interested in: ${topic}` : "", message]
        .filter(Boolean)
        .join("\n\n"),
    };

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;
      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.message ||
            "We couldn’t send your message. Email hello@djstratageminc.com and we’ll help.",
        );
      }
      setSent(true);
      form.reset();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn’t send your message. Email hello@djstratageminc.com and we’ll help.",
      );
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div aria-live="polite" className="form-success" role="status">
        <span className="success-check">✓</span>
        <h2>Message received.</h2>
        <p>A person from our team will follow up. Thanks for getting in touch.</p>
        <a href="mailto:hello@djstratageminc.com">Email us directly</a>
      </div>
    );
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="form-honeypot" aria-hidden="true">
        Leave this field empty
        <input autoComplete="off" name="bot-field" tabIndex={-1} />
      </label>
      <div className="form-two-col">
        <label className="field">
          <span>Name</span>
          <input autoComplete="name" maxLength={120} name="name" required />
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
      <div className="form-two-col">
        <label className="field">
          <span>Work email</span>
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
        </label>
        <label className="field">
          <span>Phone <small>Optional</small></span>
          <input
            autoComplete="tel"
            maxLength={40}
            name="phone"
            type="tel"
          />
        </label>
      </div>
      <div className="form-two-col">
        <label className="field">
          <span>I’m a</span>
          <select defaultValue="" name="role" required>
            <option disabled value="">Choose one</option>
            <option>General contractor</option>
            <option>Subcontractor</option>
            <option>Supplier or distributor</option>
            <option>Other construction professional</option>
          </select>
        </label>
        <label className="field">
          <span>What can we help with?</span>
          <select
            name="topic"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const nextTopic = event.currentTarget.value;
              setSelectedTopic(nextTopic);
              if (nextTopic !== "other") setContextTopic("");
            }}
            value={selectedTopic}
          >
            <option disabled value="">Choose a topic</option>
            <option value="buying">Finding or sourcing materials</option>
            <option value="selling">Listing materials or services</option>
            <option value="partnership">Partnership</option>
            <option value="support">Platform or account question</option>
            <option value="other">Pricing or another question</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Anything we should know? <small>Optional</small></span>
        <textarea maxLength={1000} name="message" rows={4} />
      </label>
      {error && (
        <p aria-live="polite" className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-submit-row">
        <button className="button button-primary button-large" disabled={pending}>
          {pending ? (
            <><LoaderCircle className="spin" size={16} /> Sending…</>
          ) : (
            <>Send a message <ArrowRight size={16} /></>
          )}
        </button>
        <span>We’ll get back to you personally.</span>
      </div>
    </form>
  );
}
