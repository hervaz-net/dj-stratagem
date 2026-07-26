import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import { IconMap, IconChat, IconClock, IconCheck } from "../components/icons";

const roleOptions = ["General Contractor", "Subcontractor", "Supplier", "Engineer", "Other"];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState(roleOptions[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const form = e.target;

    try {
      const res = await fetch("/contact.php", {
        method: "POST",
        body: new FormData(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("Submission failed");
      form.reset();
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
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
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
                  <IconMap width={18} height={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-paper">Los Angeles, California</p>
                  <p className="mt-1 text-sm text-steel">Serving general contractors and subcontractors nationwide.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
                  <IconChat width={18} height={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-paper">hello@djstratagem.com</p>
                  <p className="mt-1 text-sm text-steel">General inquiries and demo requests.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber/10 text-amber">
                  <IconClock width={18} height={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-paper">We reply within one business day</p>
                  <p className="mt-1 text-sm text-steel">Demos are scheduled at a time that works for your team.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-ink-2 p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-start gap-4 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber/10 text-amber">
                  <IconCheck width={22} height={22} />
                </div>
                <h3 className="text-xl font-semibold text-paper">Thanks &mdash; message received.</h3>
                <p className="text-sm text-steel">
                  Someone from our team will follow up shortly to schedule time.
                </p>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form name="contact" className="space-y-5" onSubmit={handleSubmit}>
                <p className="hidden">
                  <label>
                    Don&rsquo;t fill this out: <input name="bot-field" tabIndex="-1" autoComplete="off" />
                  </label>
                </p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Full name" name="name" required />
                  <Field label="Company" name="company" required />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Phone" name="phone" type="tel" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-paper">Role</label>
                  <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-md border border-line bg-ink px-3.5 py-2.5 text-sm text-paper outline-none focus:border-amber"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-paper">
                    What are you looking to solve?
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full resize-none rounded-md border border-line bg-ink px-3.5 py-2.5 text-sm text-paper outline-none focus:border-amber"
                    placeholder="Tell us about your current bidding, procurement, or coordination process."
                  />
                </div>

                {error && (
                  <p className="text-sm text-amber">
                    Something went wrong sending your message. Please try again, or email us directly.
                  </p>
                )}

                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                  {submitting ? "Sending…" : "Request a demo"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({ label, name, type = "text", required }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-paper" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-line bg-ink px-3.5 py-2.5 text-sm text-paper outline-none focus:border-amber"
      />
    </div>
  );
}
