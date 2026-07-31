import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import Seo from "../../components/Seo";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";

function Section({ title, description, children }) {
  return (
    <GlassCard className="p-6">
      <div className="mb-5 border-b border-line pb-4">
        <h2 className="text-sm font-semibold text-paper">{title}</h2>
        {description && <p className="mt-1 text-xs text-steel">{description}</p>}
      </div>
      {children}
    </GlassCard>
  );
}

function Field({ label, id, children }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6">
      <label htmlFor={id} className="w-36 shrink-0 text-xs font-medium text-steel">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-paper outline-none transition-colors placeholder:text-steel/60 focus:border-amber";

const NOTIFICATION_OPTIONS = [
  { key: "email_bids", label: "Bid activity", detail: "Awarded, lost, deadline approaching" },
  { key: "email_orders", label: "Order updates", detail: "Shipped, delivered, delayed" },
  { key: "email_alerts", label: "Risk alerts", detail: "Supplier risk score changes, SLA breaches" },
  { key: "email_weekly", label: "Weekly digest", detail: "Network summary every Monday" },
];

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    company: user?.company ?? "",
    phone: "",
    title: "",
  });

  const [notifications, setNotifications] = useState({
    email_bids: true,
    email_orders: true,
    email_alerts: true,
    email_weekly: false,
  });

  const [twofa, setTwofa] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast("Profile updated.", { type: "success" });
  };

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast("Notification preference saved.", { type: "info" });
  };

  return (
    <>
      <Seo title="Settings" description="Account settings." noindex />

      <DashboardLayout
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Settings" },
        ]}
        title="Settings"
        subtitle="Manage your account, notifications, and security."
      >
        <div className="space-y-6">
          {/* Profile */}
          <Section title="Profile" description="Your public-facing account information.">
            <form onSubmit={saveProfile} className="space-y-4">
              <Field label="Full name" id="name">
                <input id="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Email address" id="email">
                <input id="email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Company" id="company">
                <input id="company" value={profile.company} onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Job title" id="title">
                <input id="title" placeholder="e.g. Procurement Manager" value={profile.title} onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))} className={inputCls} />
              </Field>
              <Field label="Phone" id="phone">
                <input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className={inputCls} />
              </Field>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-amber/15 px-4 py-2 text-sm font-semibold text-amber transition-colors hover:bg-amber/25 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save profile"}
                </button>
              </div>
            </form>
          </Section>

          {/* Notifications */}
          <Section title="Email notifications" description="Choose which emails you receive from D&J Stratagem.">
            <ul className="space-y-4">
              {NOTIFICATION_OPTIONS.map((opt) => (
                <li key={opt.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-paper">{opt.label}</p>
                    <p className="text-xs text-steel">{opt.detail}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[opt.key]}
                    onClick={() => toggleNotif(opt.key)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors ${
                      notifications[opt.key] ? "border-amber bg-amber" : "border-line bg-ink"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        notifications[opt.key] ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </Section>

          {/* Security */}
          <Section title="Security" description="Manage your password and two-factor authentication.">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-paper">Password</p>
                  <p className="text-xs text-steel">Last changed: never</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast("Password reset email sent.", { type: "info" })}
                  className="text-xs font-semibold text-amber hover:text-amber-2"
                >
                  Change password
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-paper">Two-factor authentication</p>
                  <p className="text-xs text-steel">
                    {twofa ? "Enabled via authenticator app." : "Add an extra layer of security to your account."}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={twofa}
                  onClick={() => {
                    setTwofa((v) => !v);
                    toast(twofa ? "2FA disabled." : "2FA enabled — check your authenticator app.", { type: twofa ? "warning" : "success" });
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 transition-colors ${
                    twofa ? "border-amber bg-amber" : "border-line bg-ink"
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${twofa ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-paper">Active sessions</p>
                  <p className="text-xs text-steel">1 active session (this device)</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast("All other sessions signed out.", { type: "success" })}
                  className="text-xs font-semibold text-danger hover:text-danger/80"
                >
                  Sign out other devices
                </button>
              </div>
            </div>
          </Section>

          {/* Danger zone */}
          <Section title="Account">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-paper">Delete account</p>
                <p className="text-xs text-steel">Permanently remove your account and all associated data. This cannot be undone.</p>
              </div>
              <button
                type="button"
                onClick={() => toast("Contact support to delete your account.", { type: "warning" })}
                className="shrink-0 rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/20"
              >
                Delete account
              </button>
            </div>
          </Section>
        </div>
      </DashboardLayout>
    </>
  );
}
