import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Button from "../components/Button";
import AuthShell from "../components/auth/AuthShell";
import { IconArrowLeft, IconClock } from "../components/icons";
import { PRODUCT, CONTACT_EMAIL } from "../brand";

const STEPS = [
  { title: "You request an account", text: "Company, contact details, and which side of the marketplace you're on." },
  { title: "Our team reviews it", text: "A person checks the request. There is no automated verification email." },
  { title: "We email you when it's approved", text: `The notice comes from ${CONTACT_EMAIL}. Then you can sign in.` },
];

export default function VerifyEmail() {
  return (
    <>
      <Seo
        title="Account review"
        description={`New ${PRODUCT} accounts are approved by the team. There is no automated verification email.`}
        noindex
      />

      <AuthShell
        title="A person reviews every new account."
        text="Our team looks at each request before the account can sign in or trade."
        footnote={`Approval notices come from ${CONTACT_EMAIL}. Check spam if nothing arrives after a business day.`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-fg">
          <IconClock width={22} height={22} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-fg">Account review, not a magic link</h1>
        <p className="mt-3 leading-relaxed text-fg-muted">
          New accounts stay pending until someone on the team approves them. There is no automated
          verification email and no 24-hour link.
        </p>

        <ol className="mt-8 space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-subtle text-sm font-semibold text-fg tabular-nums">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">{s.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-fg-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-2xl bg-subtle px-5 py-4 text-sm leading-relaxed text-fg-muted">
          Need it faster? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand hover:text-brand-hover">
            {CONTACT_EMAIL}
          </a>{" "}
          from the address you used to sign up.
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Button to="/register" variant="secondary" size="sm">
            Request an account
          </Button>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted hover:text-fg">
            <IconArrowLeft width={15} height={15} aria-hidden="true" />
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    </>
  );
}
