"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

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
      <div aria-live="polite" className="alert alert-success items-start" role="status">
        <div>
          <h2 className="text-lg font-semibold">Message received.</h2>
          <p>A person from our team will follow up. Thanks for getting in touch.</p>
          <a className="link mt-2 inline-block" href="mailto:hello@djstratageminc.com">
            Email us directly
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <label className="sr-only" aria-hidden="true">
        Leave this field empty
        <input autoComplete="off" name="bot-field" tabIndex={-1} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input className="input" autoComplete="name" maxLength={120} name="name" required />
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
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Work email</legend>
          <input
            className="input"
            autoComplete="email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Phone <span className="font-normal text-base-content/50">Optional</span></legend>
          <input className="input" autoComplete="tel" maxLength={40} name="phone" type="tel" />
        </fieldset>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">I’m a</legend>
          <select className="select" defaultValue="" name="role" required>
            <option disabled value="">Choose one</option>
            <option>General contractor</option>
            <option>Subcontractor</option>
            <option>Supplier or distributor</option>
            <option>Other construction professional</option>
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">What can we help with?</legend>
          <select
            className="select"
            name="topic"
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              const nextTopic = event.currentTarget.value;
              setSelectedTopic(nextTopic);
              if (nextTopic !== "other") setContextTopic("");
            }}
            required
            value={selectedTopic}
          >
            <option disabled value="">Choose a topic</option>
            <option value="buying">Finding or sourcing materials</option>
            <option value="selling">Listing materials or services</option>
            <option value="partnership">Partnership</option>
            <option value="support">Platform or account question</option>
            <option value="other">Pricing or another question</option>
          </select>
        </fieldset>
      </div>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Anything we should know? <span className="font-normal text-base-content/50">Optional</span>
        </legend>
        <textarea className="textarea min-h-28" maxLength={1000} name="message" rows={4} />
      </fieldset>
      {error && (
        <p aria-live="polite" className="alert alert-error text-sm" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? (
            <><span className="loading loading-spinner loading-sm" /> Sending…</>
          ) : (
            <>Send a message <ArrowRight size={16} /></>
          )}
        </button>
        <span className="text-xs text-base-content/60">We’ll get back to you personally.</span>
      </div>
    </form>
  );
}
