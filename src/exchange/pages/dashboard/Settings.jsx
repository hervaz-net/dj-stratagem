import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, DataNotice, Field as FormField, Switch, inputCls } from "../../components/dashboard/ui";
import useLocalState from "../../components/dashboard/useLocalState";
import { ROLE_VIEWS, SWITCHER_ORDER } from "../../components/dashboard/roles";
import Button from "../../components/Button";
import RoleBadge from "../../components/RoleBadge";
import SampleLabel from "../../components/SampleLabel";
import Seo from "../../components/Seo";
import { useRole } from "../../contexts/RoleContext";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { fetchSettings, saveSettings, isConfigured } from "../../api/dashboard";
import { settingsFixture, MATERIAL_CATEGORIES } from "../../api/fixtures";
import { COMPANY, PRODUCT } from "../../brand";

function Section({ id, title, description, badge, children }) {
  return (
    <Card as="section" id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 p-5 sm:p-7">
      <div className="mb-6 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={`${id}-title`} className="text-lg font-semibold text-fg">{title}</h2>
          {badge}
        </div>
        {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

function Field({ label, id, children }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6">
      <label htmlFor={id} className="w-44 shrink-0 text-sm font-semibold text-fg">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

const SECTIONS = [
  ["marketplace", "Marketplace profile"],
  ["profile", "Profile"],
  ["billing", "Billing"],
  ["notifications", "Notifications"],
  ["security", "Security"],
  ["account", "Account"],
];

const DEFAULT_MARKET = { roles: [], categories: [], serviceArea: "", radius: "50", fulfillment: ["delivery", "will-call"] };

/** Roles, categories, and service area. No endpoint yet, so it stays in this browser. */
function MarketplaceProfile({ server, csrf, onSaved }) {
  const { role, setRole } = useRole();
  const { toast } = useToast();
  const live = Boolean(server);
  const [stored, setStored] = useLocalState("djs-marketplace-profile", DEFAULT_MARKET);
  const [draft, setDraft] = useState(() => {
    const base = live ? server : stored;
    return { ...DEFAULT_MARKET, ...base, roles: base.roles?.length ? base.roles : [role] };
  });
  const [busy, setBusy] = useState(false);

  const toggle = (key, value) =>
    setDraft((d) => ({ ...d, [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value] }));

  const save = async (e) => {
    e.preventDefault();
    if (!draft.roles.length) {
      toast("Pick at least one role.", { type: "warning" });
      return;
    }
    if (live) {
      setBusy(true);
      try {
        const data = await saveSettings({ action: "marketplace", ...draft }, { csrf });
        if (data.settings?.marketplace) onSaved?.(data.settings.marketplace);
        if (!draft.roles.includes(role)) setRole(draft.roles[0]);
        toast("Marketplace profile saved to your account.", { type: "success" });
      } catch (err) {
        toast(err?.message ?? "Couldn’t save the marketplace profile.", { type: "error" });
      } finally {
        setBusy(false);
      }
      return;
    }
    setStored(draft);
    if (!draft.roles.includes(role)) setRole(draft.roles[0]);
    toast("Marketplace profile saved in this browser.", { type: "info" });
  };

  const chip = (active) =>
    `inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40 ${
      active ? "border-brand bg-brand-soft text-brand-fg" : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
    }`;

  return (
    <Section
      id="marketplace"
      title="Marketplace profile"
      badge={live ? null : <SampleLabel>Saved in this browser</SampleLabel>}
      description={
        live
          ? "How buyers and sellers find you. Buyers see your company name and buying role on the requests you post."
          : "How buyers and sellers find you. The settings service isn’t reachable, so these choices stay on this device."
      }
    >
      <form onSubmit={save} className="space-y-6">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-fg">Your company acts as</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {SWITCHER_ORDER.map((key) => {
              const on = draft.roles.includes(key);
              return (
                <label
                  key={key}
                  className={`flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40 ${
                    on ? "border-brand bg-brand-soft" : "border-line hover:border-line-strong"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <RoleBadge role={key} label={ROLE_VIEWS[key].label} />
                    <input type="checkbox" checked={on} onChange={() => toggle("roles", key)} className="h-4 w-4 accent-[var(--brand)]" />
                  </span>
                  <span className="text-sm text-fg-muted">{ROLE_VIEWS[key].blurb}</span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-fg-muted">
            You’re working as <strong className="font-semibold text-fg">{ROLE_VIEWS[role].label.toLowerCase()}</strong> right now. Switch views from the sidebar.
          </p>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-fg">Categories you buy or sell</legend>
          <div className="flex flex-wrap gap-2">
            {MATERIAL_CATEGORIES.map((c) => (
              <label key={c} className={chip(draft.categories.includes(c))}>
                <input type="checkbox" checked={draft.categories.includes(c)} onChange={() => toggle("categories", c)} className="sr-only" />
                {c}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_12rem]">
          <FormField label="Service area" htmlFor="mp-area" hint="City, county, or ZIP you ship to or buy in.">
            <input
              id="mp-area"
              value={draft.serviceArea}
              onChange={(e) => setDraft((d) => ({ ...d, serviceArea: e.target.value }))}
              placeholder="e.g. Los Angeles County"
              className={inputCls}
            />
          </FormField>
          <FormField label="Radius" htmlFor="mp-radius">
            <select id="mp-radius" value={draft.radius} onChange={(e) => setDraft((d) => ({ ...d, radius: e.target.value }))} className={inputCls}>
              {["25", "50", "100", "250"].map((r) => (
                <option key={r} value={r}>{r} miles</option>
              ))}
              <option value="any">Anywhere</option>
            </select>
          </FormField>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-fg">Fulfillment</legend>
          <div className="flex flex-wrap gap-2">
            {[
              ["delivery", "Jobsite delivery"],
              ["will-call", "Will-call pickup"],
            ].map(([key, label]) => (
              <label key={key} className={chip(draft.fulfillment.includes(key))}>
                <input type="checkbox" checked={draft.fulfillment.includes(key)} onChange={() => toggle("fulfillment", key)} className="h-4 w-4 accent-[var(--brand)]" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end">
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save marketplace profile"}</Button>
        </div>
      </form>
    </Section>
  );
}

const money = (n) =>
  Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const NOTIFICATION_OPTIONS = [
  { key: "email_bids", label: "Quote activity", detail: "Quotes received, accepted, declined, or about to expire" },
  { key: "email_orders", label: "Order updates", detail: "Confirmed, shipped, delivered, delayed" },
  { key: "email_alerts", label: "Partner and price alerts", detail: "Risk score changes, late deliveries, price moves" },
  { key: "email_weekly", label: "Weekly digest", detail: "Network summary every Monday" },
];

const ACCOUNT_TYPES = [
  {
    key: "credit",
    label: "Credit",
    detail: "You settle with sellers on net terms, like net-30. Track your limit here.",
  },
  {
    key: "prepaid",
    label: "Prepaid",
    detail: "You pay sellers up front. Record deposits to keep a running balance.",
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
  const [market, setMarket] = useState(null);
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
        if (isConfigured && s.marketplace) setMarket(s.marketplace);
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
      toast(keepLocal() ? "Changed for this session only." : (err.message ?? "Couldn’t save profile."), {
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
      toast(keepLocal() ? "Changed for this session only." : (err.message ?? "Couldn’t save billing contact."), {
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
        toast("Changed for this session only.", { type: "info" });
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
      toast(next ? "Marked funded." : "Marked unfunded.", { type: next ? "success" : "warning" });
    } catch (err) {
      if (keepLocal()) {
        toast("Changed for this session only.", { type: "info" });
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
      toast(`${money(amount)} deposit recorded.`, { type: "success" });
    } catch (err) {
      if (keepLocal()) {
        toast("Changed for this session only.", { type: "info" });
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
        toast("Changed for this session only.", { type: "info" });
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
      toast(keepLocal() ? "Changed for this session only." : (err.message ?? "Couldn’t save that preference."), {
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
      toast(keepLocal() ? "Changed for this session only." : (err.message ?? "Couldn’t update 2FA."), {
        type: keepLocal() ? "info" : "error",
      });
    }
  };

  const funded = !!billing.funded;
  const prepaid = billing.accountType === "prepaid";

  return (
    <>
      <Seo title="Settings" description={`Account, marketplace profile, and notification settings for ${PRODUCT}.`} noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard/overview" }, { label: "Settings" }]}
        title="Settings"
        subtitle="Your marketplace profile, account details, billing contact, and notifications."
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <nav aria-label="Settings sections" className="lg:sticky lg:top-8 lg:self-start">
            <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
              {SECTIONS.map(([id, label]) => (
                <li key={id} className="shrink-0">
                  <a href={`#${id}`} className="block rounded-xl px-3 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-6">
            {!isConfigured && (
              <DataNotice>Account settings save to your account on the hosted site. Here, changes last for this session only.</DataNotice>
            )}

            <MarketplaceProfile key={market ? "account" : "browser"} server={market} csrf={csrf} onSaved={setMarket} />

            <Section id="profile" title="Profile" description="Your name and company as trading partners see them.">
              <form onSubmit={saveProfile} className="space-y-4">
                <Field label="Full name" id="name">
                  <input id="name" autoComplete="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Email address" id="email">
                  <input id="email" type="email" autoComplete="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Company" id="company">
                  <input id="company" autoComplete="organization" value={profile.company} onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Job title" id="title">
                  <input id="title" placeholder="e.g. Purchasing manager" value={profile.title} onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))} className={inputCls} />
                </Field>
                <Field label="Phone" id="phone">
                  <input id="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className={inputCls} />
                </Field>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</Button>
                </div>
              </form>
            </Section>

            <Section id="billing" title="Billing" description="Who we invoice and how this account is set up.">
              <form onSubmit={saveBillingContact} className="space-y-4">
                <Field label="Billing contact" id="billing-name">
                  <input id="billing-name" value={billing.name} onChange={(e) => setBilling((b) => ({ ...b, name: e.target.value }))} className={inputCls} autoComplete="name" />
                </Field>
                <Field label="Billing email" id="billing-email">
                  <input id="billing-email" type="email" value={billing.email} onChange={(e) => setBilling((b) => ({ ...b, email: e.target.value }))} className={inputCls} autoComplete="email" />
                </Field>
                <Field label="Billing phone" id="billing-phone">
                  <input id="billing-phone" type="tel" value={billing.phone} onChange={(e) => setBilling((b) => ({ ...b, phone: e.target.value }))} className={inputCls} autoComplete="tel" />
                </Field>
                <div className="flex justify-end pt-1">
                  <Button type="submit" disabled={savingBilling}>{savingBilling ? "Saving…" : "Save billing contact"}</Button>
                </div>
              </form>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-sm font-semibold text-fg">Account type</p>
                <p className="mt-1 text-sm text-fg-muted">
                  {PRODUCT} doesn’t process payments. These settings are an account record for your team, not a credit line or stored funds.
                </p>
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
                        className={`rounded-2xl border px-5 py-4 text-left transition-colors ${on ? "border-brand bg-brand-soft" : "border-line hover:border-line-strong"}`}
                      >
                        <p className={`text-base font-semibold ${on ? "text-brand-fg" : "text-fg"}`}>{t.label}</p>
                        <p className="mt-1 text-sm text-fg-muted">{t.detail}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-line bg-canvas p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-fg">{prepaid ? "Recorded balance" : "Recorded limit"}</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-fg">{prepaid ? money(billing.walletBalance) : money(billing.creditLimit)}</p>
                    <p className="mt-1 text-sm text-fg-muted">
                      {prepaid
                        ? funded ? "Marked funded." : "No balance recorded yet."
                        : funded ? "Marked active." : "Not marked active yet."}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${funded ? "bg-success-soft text-success" : "border border-line text-fg-muted"}`}>
                    <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                    {funded ? "Funded" : "Unfunded"}
                  </span>
                </div>

                {prepaid ? (
                  <form onSubmit={addFunds} className="mt-5 flex flex-wrap items-end gap-3">
                    <label className="min-w-[10rem] flex-1">
                      <span className="text-sm font-semibold text-fg">Record a deposit (USD)</span>
                      <input type="number" min="1" step="100" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} className={`${inputCls} mt-1.5`} />
                    </label>
                    <Button type="submit" variant="soft">Record deposit</Button>
                  </form>
                ) : (
                  <form onSubmit={saveCreditLimit} className="mt-5 flex flex-wrap items-end gap-3">
                    <label className="min-w-[10rem] flex-1">
                      <span className="text-sm font-semibold text-fg">Credit limit (USD)</span>
                      <input type="number" min="0" step="1000" value={creditLimitDraft} onChange={(e) => setCreditLimitDraft(e.target.value)} className={`${inputCls} mt-1.5`} />
                    </label>
                    <Button type="submit" variant="secondary">Save limit</Button>
                    <Button type="button" variant="soft" role="switch" aria-checked={funded} onClick={toggleFunded}>
                      {funded ? "Mark unfunded" : "Mark funded"}
                    </Button>
                  </form>
                )}
              </div>
            </Section>

            <Section id="notifications" title="Email notifications" description={`Choose which emails ${COMPANY} sends you.`}>
              <ul className="divide-y divide-line">
                {NOTIFICATION_OPTIONS.map((opt) => (
                  <li key={opt.key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                    <div>
                      <p id={`notif-${opt.key}`} className="text-[0.95rem] font-semibold text-fg">{opt.label}</p>
                      <p className="text-sm text-fg-muted">{opt.detail}</p>
                    </div>
                    <Switch checked={!!notifications[opt.key]} onChange={() => toggleNotif(opt.key)} label={opt.label} />
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="security" title="Security" description="Password and two-factor authentication.">
              <ul className="divide-y divide-line">
                <li className="pb-4">
                  <p className="text-[0.95rem] font-semibold text-fg">Password</p>
                  <p className="text-sm text-fg-muted">Password reset isn’t available yet. It will live on the sign-in page when it ships.</p>
                </li>
                <li className="flex items-center justify-between gap-4 pt-4">
                  <div>
                    <p className="text-[0.95rem] font-semibold text-fg">Two-factor authentication</p>
                    <p className="text-sm text-fg-muted">
                      {twofa ? "Flag enabled on this account. Authenticator enrollment ships next." : "Add an extra layer of security to your account."}
                    </p>
                  </div>
                  <Switch checked={twofa} onChange={toggleTwofa} label="Two-factor authentication" />
                </li>
              </ul>
            </Section>

            <Section id="account" title="Account">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[0.95rem] font-semibold text-fg">Delete account</p>
                  <p className="text-sm text-fg-muted">Permanently remove your account and its data. This can’t be undone.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast("Contact support to delete your account.", { type: "warning" })}
                  className="inline-flex h-10 shrink-0 items-center rounded-full border border-danger/30 bg-danger-soft px-4 text-sm font-semibold text-danger transition-colors hover:border-danger"
                >
                  Delete account
                </button>
              </div>
            </Section>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
