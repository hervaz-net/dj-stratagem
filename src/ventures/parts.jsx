import { useEffect, useState } from "react";
import { serviceDate } from "../lib/serviceDate";
import { CONTACT_EMAIL } from "./brands";

/** Per-page title and description, suffixed with the company name only. */
export function useSeo(brand, { title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | ${brand.name}` : brand.name;
    const set = (sel, attr, key, value) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };
    set('meta[name="description"]', "name", "description", description);
    set('meta[property="og:title"]', "property", "og:title", document.title);
    set('meta[property="og:description"]', "property", "og:description", description);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://djstratageminc.com${brand.path}`);
  }, [brand, title, description]);
}

export const fieldClass =
  "h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-fg outline-hidden transition-colors placeholder:text-fg-muted/70 focus:border-brand";

export function Field({ label, required, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-fg">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      {children}
    </label>
  );
}

/**
 * Posts to /contact.php. `buildMessage(formData)` turns extra fields into the
 * message body; `role` labels the inquiry in the email subject.
 */
export function useInquiry({ role, topic, buildMessage }) {
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [invalid, setInvalid] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const name = String(d.get("name") || "").trim();
    const email = String(d.get("email") || "").trim();
    const company = String(d.get("company") || "").trim() || "Personal";
    const phone = String(d.get("phone") || "").trim();
    const message = buildMessage(d);
    if (!name) return setInvalid("Please enter your name.");
    if (name.length > 120) return setInvalid("Name must be 120 characters or fewer.");
    if (company.length > 160) return setInvalid("Company must be 160 characters or fewer.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setInvalid("Please enter a valid email address.");
    if (email.length > 254) return setInvalid("Email must be 254 characters or fewer.");
    if (phone.length > 40) return setInvalid("Phone must be 40 characters or fewer.");
    if (message.length > 4000) return setInvalid("That quote is too long. Shorten the notes and try again.");
    const tripDate = String(d.get("date") || "").trim();
    if (tripDate && tripDate < serviceDate()) {
      return setInvalid("Pickup date is in the past. Choose today or a later date.");
    }
    const passengers = String(d.get("passengers") || "").trim();
    if (passengers && (!/^\d+$/.test(passengers) || Number(passengers) < 1 || Number(passengers) > 100)) {
      return setInvalid("Passengers must be a whole number from 1 to 100.");
    }
    setInvalid("");

    const body = new FormData();
    body.set("name", name);
    body.set("company", company);
    body.set("email", email);
    body.set("phone", phone);
    body.set("role", role);
    if (topic) body.set("topic", topic);
    if (tripDate) body.set("trip_date", tripDate);
    if (passengers) body.set("passengers", passengers);
    body.set("bot-field", d.get("bot-field") || "");
    body.set("message", message);

    setState("sending");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/contact.php", { method: "POST", body, signal: controller.signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        const fields = Array.isArray(data.fields) ? data.fields.join(", ") : "";
        setInvalid(fields ? `Check ${fields} and try again.` : "");
        throw new Error("failed");
      }
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    } finally {
      window.clearTimeout(timer);
    }
  }

  return { state, invalid, onSubmit };
}

export function FormStatus({ state, invalid }) {
  return (
    <>
      {invalid && <p role="alert" className="text-sm text-danger">{invalid}</p>}
      {state === "error" && (
        <p role="alert" className="text-sm text-danger">
          That didn&rsquo;t send. Email{" "}
          <a className="font-medium underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> instead.
        </p>
      )}
    </>
  );
}

export const Honeypot = () => (
  <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
);
