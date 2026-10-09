import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import Seo from "../../components/Seo";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { fetchSettings, saveSettings, isConfigured } from "../../api/dashboard";
import { settingsFixture } from "../../api/fixtures";

function Section({ title, description, children }) {
  return (
    <GlassCard className="p-6 sm:p-7">
      <div className="mb-6 border-b border-line pb-4">
        <h2 className="font-display text-lg font-semibold tracking-tight text-paper">{title}</h2>
        {description && <p className="mt-1.5 text-sm font-medium text-steel">{description}</p>}
      </div>
      {children}
    </GlassCard>
  );
}

function Field({ label, id, children }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6">
      <label htmlFor={id} className="w-44 shrink-0 text-sm font-semibold text-steel">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-line bg-ink px-3.5 py-2.5 text-base font-medium text-paper outline-none transition-colors placeholder:text-steel/60 focus:border-amber";

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const NOTIFICATION_OPTIONS = [
  { key: "email_bids", label: "Bid activity", detail: "Awarded, lost, deadline approaching" },
  { key: "email_orders", label: "Order updates", detail: "Shipped, delivered, delayed" },
  { key: "email_alerts", label: "Risk alerts", detail: "Supplier risk score changes, SLA breaches" },
  { key: "email_weekly", label: "Weekly digest", detail: "Network summary every Monday" },
];

const ACCOUNT_TYPES = [
  {
    key: "credit",
    label: "Credit",
    detail: "Draw against a credit line. Invoices settle on net terms.",
  },
  {
    key: "prepaid",
    label: "Prepaid",
    detail: "Fund a wallet, then spend down the balance on orders.",
  },
];

export default function Settings() {
  const { user, csrf, applyUser } = useAuth();
  const { toast } = useToast();
  const blank = settingsFixture(user);

  const [profile, setProfile] = useState(blank.profile);
  const [billing, setBilling] = useState(blank.billing);
  const [notifications, setNotifications] = useState(blank.notifications);
  const [twofa, setTwofa] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingBilling, setSavingBilling] = useState(false);
  const [fundAmount, setFundAmount] = useState("2500");
  const [creditLimitDraft, setCreditLimitDraft] = useState(String(blank.billing.creditLimit || 50000));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await fetchSettings();
        if (cancelled) return;
        const merged = s.profile?.name || s.profile?.email ? s : settingsFixture(user);
        setProfile(merged.profile);
        setBilling(merged.billing ?? settingsFixture(user).billing);
        setNotifications(merged.notifications);
        setTwofa(!!merged.twofa);
        const limit = merged.billing?.creditLimit || 50000;
        setCreditLimitDraft(String(limit));
      } catch {
        const fallback = settingsFixture(user);
        if (!cancelled) {
          setProfile(fallback.profile);
          setBilling(fallback.billing);
          setNotifications(fallback.notifications);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const keepLocal = () => !isConfigured;

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await saveSettings({ action: "profile", ...profile }, { csrf });
      if (data.settings?.profile) setProfile(data.settings.profile);
      if (data.user && applyUser) applyUser(data.user);
      toast("Profile updated.", { type: "success" });
    } catch (err) {
      toast(keepLocal() ? "Saved on this device." : (err.message ?? "Couldn’t save profile."), {
        type: keepLocal() ? "info" : "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveBillingContact = async (e) => {
    e.preventDefault();
    setSavingBilling(true);
    try {
      const data = await saveSettings({ action: "billing", ...billing }, { csrf });
      if (data.settings?.billing) setBilling(data.settings.billing);
      toast("Billing contact updated.", { type: "success" });
    } catch (err) {
      toast(keepLocal() ? "Saved on this device." : (err.message ?? "Couldn’t save billing contact."), {
        type: keepLocal() ? "info" : "error",
      });
    } finally {
      setSavingBilling(false);
    }
  };

  const setAccountType = async (accountType) => {
    const prev = billing.accountType;
    setBilling((b) => ({ ...b, accountType }));
    try {
      const data = await saveSettings({ action: "account_type", accountType }, { csrf });
      if (data.settings?.billing) setBilling(data.settings.billing);
      toast(accountType === "prepaid" ? "Switched to prepaid." : "Switched to credit.", { type: "success" });
    } catch (err) {
      if (keepLocal()) {
        toast("Saved on this device.", { type: "info" });
      } else {
        setBilling((b) => ({ ...b, accountType: prev }));
        toast(err.message ?? "Couldn’t change account type.", { type: "error" });
      }
    }
  };

  const toggleFunded = async () => {
    const next = !billing.funded;
    const limit = Number(creditLimitDraft) || billing.creditLimit || 0;
    setBilling((b) => ({ ...b, funded: next, creditLimit: limit }));
    try {
      const data = await saveSettings({ action: "fund", funded: next, creditLimit: limit }, { csrf });
      if (data.settings?.billing) setBilling(data.settings.billing);
      toast(next ? "Account funded." : "Account marked unfunded.", { type: next ? "success" : "warning" });
    } catch (err) {
      if (keepLocal()) {
        toast("Saved on this device.", { type: "info" });
      } else {
        setBilling((b) => ({ ...b, funded: !next }));
        toast(err.message ?? "Couldn’t update funding.", { type: "error" });
      }
    }
  };

  const addFunds = async (e) => {
    e.preventDefault();
    const amount = Number(fundAmount);
    if (!Number.isFinite(amount) || amount < 1) {
      toast("Enter an amount of at least $1.", { type: "warning" });
      return;
    }
    const nextBal = (Number(billing.walletBalance) || 0) + amount;
    setBilling((b) => ({ ...b, walletBalance: nextBal, funded: true }));
    try {
      const data = await saveSettings({ action: "fund", amount }, { csrf });
      if (data.settings?.billing) setBilling(data.settings.billing);
      toast(`${money(amount)} added to the wallet.`, { type: "success" });
    } catch (err) {
      if (keepLocal()) {
        toast("Saved on this device.", { type: "info" });
      } else {
        setBilling((b) => ({ ...b, walletBalance: nextBal - amount }));
        toast(err.message ?? "Couldn’t add funds.", { type: "error" });
      }
    }
  };

  const saveCreditLimit = async (e) => {
    e.preventDefault();
    const limit = Number(creditLimitDraft);
    if (!Number.isFinite(limit) || limit < 0) {
      toast("Enter a valid credit limit.", { type: "warning" });
      return;
    }
    setBilling((b) => ({ ...b, creditLimit: limit }));
    try {
      const data = await saveSettings({ action: "fund", funded: billing.funded, creditLimit: limit }, { csrf });
      if (data.settings?.billing) setBilling(data.settings.billing);
      toast("Credit limit updated.", { type: "success" });
    } catch (err) {
      if (keepLocal()) {
        toast("Saved on this device.", { type: "info" });
      } else {
        toast(err.message ?? "Couldn’t save credit limit.", { type: "error" });
      }
    }
  };

  const toggleNotif = async (key) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    try {
      await saveSettings({ action: "notifications", ...next }, { csrf });
      toast("Notification preference saved.", { type: "info" });
    } catch (err) {
      if (!keepLocal()) setNotifications(notifications);
      toast(keepLocal() ? "Saved on this device." : (err.message ?? "Couldn’t save that preference."), {
        type: keepLocal() ? "info" : "error",
      });
    }
  };

  const toggleTwofa = async () => {
    const next = !twofa;
    setTwofa(next);
    try {
      await saveSettings({ action: "twofa", enabled: next }, { csrf });
      toast(next ? "2FA flag enabled on this account." : "2FA disabled.", { type: next ? "success" : "warning" });
    } catch (err) {
      if (!keepLocal()) setTwofa(!next);
      toast(keepLocal() ? "Saved on this device." : (err.message ?? "Couldn’t update 2FA."), {
        type: keepLocal() ? "info" : "error",
      });
    }
  };

  const funded = !!billing.funded;
  const prepaid = billing.accountType === "prepaid";

  return (
    <>
      <Seo title="Settings" description="Account settings." noindex />

      <DashboardLayout
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Settings" },
        ]}
        title="Settings"
        subtitle="Manage your account, billing, notifications, and security."
      >
        {!isConfigured && (
          <GlassCard className="mb-6 px-5 py-3 text-base font-medium text-steel">
            <span className="font-bold uppercase tracking-wider text-amber">Sample data</span>
            {" "}— profile, billing, and notification saves hit `/api/settings.php` on the hosted server.
          </GlassCard>
        )}

        <div className="space-y-6">
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
                  className="rounded-lg bg-amber/15 px-5 py-2.5 text-base font-bold text-amber transition-colors hover:bg-amber/25 disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save profile"}
                </button>
              </div>
            </form>
          </Section>

          <Section title="Billing" description="Who we invoice, how this account pays, and whether it is funded.">
            <form onSubmit={saveBillingContact} className="space-y-4">
              <Field label="Billing contact" id="billing-name">
                <input
                  id="billing-name"
                  value={billing.name}
                  onChange={(e) => setBilling((b) => ({ ...b, name: e.target.value }))}
                  className={inputCls}
                  autoComplete="name"
                />
              </Field>
              <Field label="Billing email" id="billing-email">
                <input
                  id="billing-email"
                  type="email"
                  value={billing.email}
                  onChange={(e) => setBilling((b) => ({ ...b, email: e.target.value }))}
                  className={inputCls}
                  autoComplete="email"
                />
              </Field>
              <Field label="Billing phone" id="billing-phone">
                <input
                  id="billing-phone"
                  type="tel"
                  value={billing.phone}
                  onChange={(e) => setBilling((b) => ({ ...b, phone: e.target.value }))}
                  className={inputCls}
                  autoComplete="tel"
                />
              </Field>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={savingBilling}
                  className="rounded-lg bg-amber/15 px-5 py-2.5 text-base font-bold text-amber transition-colors hover:bg-amber/25 disabled:opacity-60"
                >
                  {savingBilling ? "Saving…" : "Save billing contact"}
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-sm font-bold uppercase tracking-wider text-steel">Account type</p>
              <div role="radiogroup" aria-label="Account type" className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ACCOUNT_TYPES.map((t) => {
                  const on = billing.accountType === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setAccountType(t.key)}
                      className={`rounded-2xl border px-5 py-4 text-left transition-colors ${
                        on
                          ? "border-amber/60 bg-amber/10"
                          : "border-line bg-ink/40 hover:border-amber/35"
                      }`}
                    >
                      <p className={`font-display text-lg font-semibold ${on ? "text-amber" : "text-paper"}`}>{t.label}</p>
                      <p className="mt-1 text-sm font-medium text-steel">{t.detail}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-ink/50 px-5 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-steel">Account funded</p>
                  <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-paper">
                    {prepaid ? money(billing.walletBalance) : money(billing.creditLimit)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-steel">
                    {prepaid
                      ? (funded ? "Prepaid wallet is funded and ready to spend." : "Wallet is empty — add funds to place orders.")
                      : (funded ? "Credit line is active." : "Credit line is not funded yet.")}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${
                    funded
                      ? "border-[var(--viz-green)]/40 bg-[var(--viz-green)]/10 text-[var(--viz-green)]"
                      : "border-line bg-ink text-steel"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${funded ? "bg-[var(--viz-green)]" : "bg-steel"}`} />
                  {funded ? "Funded" : "Unfunded"}
                </span>
              </div>

              {prepaid ? (
                <form onSubmit={addFunds} className="mt-5 flex flex-wrap items-end gap-3">
                  <label className="min-w-[10rem] flex-1">
                    <span className="text-sm font-semibold text-steel">Add funds</span>
                    <input
                      type="number"
                      min="1"
                      step="100"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className={`${inputCls} mt-1`}
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg bg-amber/15 px-5 py-2.5 text-base font-bold text-amber transition-colors hover:bg-amber/25"
                  >
                    Add funds
                  </button>
                </form>
              ) : (
                <form onSubmit={saveCreditLimit} className="mt-5 flex flex-wrap items-end gap-3">
                  <label className="min-w-[10rem] flex-1">
                    <span className="text-sm font-semibold text-steel">Credit limit</span>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={creditLimitDraft}
                      onChange={(e) => setCreditLimitDraft(e.target.value)}
                      className={`${inputCls} mt-1`}
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg border border-line px-5 py-2.5 text-base font-bold text-paper transition-colors hover:border-amber/40"
                  >
                    Save limit
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={funded}
                    onClick={toggleFunded}
                    className="rounded-lg bg-amber/15 px-5 py-2.5 text-base font-bold text-amber transition-colors hover:bg-amber/25"
                  >
                    {funded ? "Mark unfunded" : "Fund account"}
                  </button>
                </form>
              )}
            </div>
          </Section>

          <Section title="Email notifications" description="Choose which emails you receive from D&J Stratagem.">
            <ul className="space-y-4">
              {NOTIFICATION_OPTIONS.map((opt) => (
                <li key={opt.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-paper">{opt.label}</p>
                    <p className="text-sm font-medium text-steel">{opt.detail}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications[opt.key]}
                    onClick={() => toggleNotif(opt.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors ${
                      notifications[opt.key] ? "border-amber bg-amber" : "border-line bg-ink"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        notifications[opt.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Security" description="Manage your password and two-factor authentication.">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-paper">Password</p>
                  <p className="text-sm font-medium text-steel">Reset is not enabled yet. Use forgot-password on the login page when it ships.</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-paper">Two-factor authentication</p>
                  <p className="text-sm font-medium text-steel">
                    {twofa ? "Flag enabled on this account. Authenticator enrollment ships next." : "Add an extra layer of security to your account."}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={twofa}
                  onClick={toggleTwofa}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors ${
                    twofa ? "border-amber bg-amber" : "border-line bg-ink"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${twofa ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </Section>

          <Section title="Account">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-paper">Delete account</p>
                <p className="text-sm font-medium text-steel">Permanently remove your account and all associated data. This cannot be undone.</p>
              </div>
              <button
                type="button"
                onClick={() => toast("Contact support to delete your account.", { type: "warning" })}
                className="shrink-0 rounded-lg border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-bold text-danger transition-colors hover:bg-danger/20"
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
