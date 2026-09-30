import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatusDot from "../../components/dashboard/StatusDot";
import Sparkline from "../../components/dashboard/Sparkline";
import { Card, DataNotice, ErrorNotice, Panel, StatTile, StatusPill } from "../../components/dashboard/ui";
import { shortDate, daysUntil } from "../../components/dashboard/format";
import { ROLE_VIEWS, SWITCHER_ORDER, roleView } from "../../components/dashboard/roles";
import Button from "../../components/Button";
import RoleBadge from "../../components/RoleBadge";
import SampleLabel from "../../components/SampleLabel";
import Seo from "../../components/Seo";
import { IconArrowRight, IconChat, IconPackage, IconTruck, IconMegaphone, IconBolt } from "../../components/icons";
import useAuth from "../../auth/useAuth";
import { useRole } from "../../contexts/RoleContext";
import usePolledResource from "../../api/usePolledResource";
import { fetchOverview, fetchTicker, isConfigured } from "../../api/dashboard";
import { overviewFixtures, requestFixtures, demandFixtures, catalogFixtures } from "../../api/fixtures";
import { DASHBOARD_NAV } from "../../navigation";
import { PRODUCT, ROLE_ORDER } from "../../brand";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STATUS_WORDS = { submitted: "sent", review: "under review", awarded: "accepted", lost: "declined" };

/** The activity feed and alert titles still say "bid" server-side. */
function relabel(text = "") {
  return String(text)
    .replace(/\bmarked (submitted|review|awarded|lost)\b/g, (_, s) => `marked ${STATUS_WORDS[s]}`)
    .replace(/\bBids\b/g, "Quotes")
    .replace(/\bBid\b/g, "Quote")
    .replace(/\bbids\b/g, "quotes")
    .replace(/\bbid\b/g, "quote");
}

const ALERT_DOT = { risk: "at-risk", delivery: "watch", bid: "active", price: "watch", system: "idle" };

function liveKpi(kpis, pattern) {
  return kpis.find((k) => pattern.test(k.label))?.value ?? "—";
}

const activeRequests = requestFixtures.filter((r) => r.status === "open" || r.status === "quoting");
const contractorDemand = demandFixtures.filter((r) => r.buyerRole === "contractor");

function tilesFor(role, kpis) {
  const quotes = liveKpi(kpis, /bid|quote/i);
  const orders = liveKpi(kpis, /order/i);
  const alerts = liveKpi(kpis, /alert/i);
  const icon = (I) => <I width={18} height={18} aria-hidden="true" />;
  if (role === "distributor") {
    return [
      { label: "Requests to quote", value: contractorDemand.length, hint: "From contractors", sample: true, icon: icon(IconMegaphone), tone: "contractor" },
      { label: "My requests upstream", value: activeRequests.length, hint: "To manufacturers", sample: true, icon: icon(IconChat), tone: "supplier" },
      { label: "Open quotes", value: quotes, hint: "Draft, sent, in review", icon: icon(IconBolt) },
      { label: "Open orders", value: orders, hint: "Pending through shipped", icon: icon(IconTruck), tone: "distributor" },
    ];
  }
  if (role === "supplier") {
    return [
      { label: "Matching requests", value: demandFixtures.length, hint: "In your categories", sample: true, icon: icon(IconMegaphone), tone: "distributor" },
      { label: "Quotes sent", value: quotes, hint: "Awaiting a decision", icon: icon(IconBolt) },
      { label: "Open orders", value: orders, hint: "From distributors and contractors", icon: icon(IconTruck), tone: "contractor" },
      { label: "Listed products", value: catalogFixtures.filter((p) => p.status === "active").length, hint: "In your catalog", sample: true, icon: icon(IconPackage), tone: "supplier" },
    ];
  }
  return [
    { label: "Open requests", value: activeRequests.length, hint: `${activeRequests.filter((r) => r.status === "quoting").length} with quotes in`, sample: true, icon: icon(IconChat), tone: "contractor" },
    { label: "Quotes received", value: quotes, hint: "Waiting on your decision", icon: icon(IconBolt) },
    { label: "Orders in transit", value: orders, hint: "Pending through shipped", icon: icon(IconTruck), tone: "distributor" },
    { label: "Unread alerts", value: alerts, hint: "Price, delivery, and risk", icon: icon(IconMegaphone), tone: "danger" },
  ];
}

const ACTIONS = {
  contractor: [
    { to: "/dashboard/requests?new=1", label: "Post a request" },
    { to: "/dashboard/quotes", label: "Compare quotes", variant: "secondary" },
  ],
  distributor: [
    { to: "/dashboard/requests", label: "Quote open demand" },
    { to: "/dashboard/requests?new=1", label: "Restock from makers", variant: "secondary" },
  ],
  supplier: [
    { to: "/dashboard/catalog", label: "List products" },
    { to: "/dashboard/requests", label: "Quote open demand", variant: "secondary" },
  ],
};

/** Supplier → distributor → contractor, with "you" highlighted. */
function ChainCard({ role }) {
  const ring = {
    supplier: "border-role-supplier bg-role-supplier-soft text-role-supplier",
    distributor: "border-role-distributor bg-role-distributor-soft text-role-distributor",
    contractor: "border-role-contractor bg-role-contractor-soft text-role-contractor",
  };
  return (
    <Panel title="Where you sit" description="Material flows left to right. Requests flow back up.">
      <ol className="flex items-center justify-between gap-1">
        {ROLE_ORDER.map((key, i) => (
          <li key={key} className="flex flex-1 items-center gap-1">
            <div
              className={`flex w-full flex-col items-center gap-1 rounded-xl border px-1 py-2.5 text-center ${
                key === role ? ring[key] : "border-line text-fg-muted"
              }`}
              aria-current={key === role ? "true" : undefined}
            >
              <span className="text-[0.7rem] font-semibold leading-tight">{ROLE_VIEWS[key].label}</span>
              {key === role && <span className="text-[0.65rem] font-bold uppercase tracking-wide">You</span>}
            </div>
            {i < ROLE_ORDER.length - 1 && (
              <IconArrowRight width={14} height={14} aria-hidden="true" className="shrink-0 text-fg-muted" />
            )}
          </li>
        ))}
      </ol>
      {role === "distributor" && (
        <p className="mt-3 text-xs leading-relaxed text-fg-muted">You buy upstream and sell downstream, so you’ll see both sides in Requests and Quotes.</p>
      )}
    </Panel>
  );
}

function QueueRow({ to, title, meta, right }) {
  return (
    <li>
      <Link to={to} className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-subtle">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-fg">{title}</span>
          <span className="block truncate text-xs text-fg-muted">{meta}</span>
        </span>
        <span className="shrink-0 text-right text-xs">{right}</span>
      </Link>
    </li>
  );
}

function neededLabel(date) {
  const d = daysUntil(date);
  if (d === null) return "";
  if (d < 0) return <span className="text-fg-muted">Past due</span>;
  return <span className={d <= 5 ? "font-semibold text-warning" : "text-fg-muted"}>Needed {shortDate(date)}</span>;
}

function WorkQueue({ role }) {
  if (role === "contractor") {
    return (
      <Panel
        title="Your open requests"
        description="How quotes are coming in on what you’ve asked for."
        sample
        actions={<Link to="/dashboard/requests" className="text-sm font-semibold text-brand hover:text-brand-hover">View all</Link>}
        bodyClassName="p-2"
      >
        <ul>
          {activeRequests.map((r) => (
            <QueueRow
              key={r.id}
              to="/dashboard/requests"
              title={r.title}
              meta={`${r.project || r.category} · ${r.quotes} quote${r.quotes === 1 ? "" : "s"}`}
              right={neededLabel(r.neededBy)}
            />
          ))}
        </ul>
      </Panel>
    );
  }

  const demand = role === "supplier" ? demandFixtures : contractorDemand;
  return (
    <>
      <Panel
        title={role === "supplier" ? "Requests that match your catalog" : "Contractor requests to quote"}
        description={role === "supplier" ? "From distributors restocking and contractors buying direct." : "Open demand in your categories."}
        sample
        actions={<Link to="/dashboard/requests" className="text-sm font-semibold text-brand hover:text-brand-hover">View all</Link>}
        bodyClassName="p-2"
      >
        <ul>
          {demand.slice(0, 4).map((r) => (
            <QueueRow
              key={r.id}
              to="/dashboard/requests"
              title={r.title}
              meta={`${r.buyer} · ${r.location}`}
              right={
                <span className="flex flex-col items-end gap-1">
                  <RoleBadge role={r.buyerRole} label={ROLE_VIEWS[r.buyerRole].label} />
                  {neededLabel(r.neededBy)}
                </span>
              }
            />
          ))}
        </ul>
      </Panel>
      {role === "distributor" && (
        <Panel
          title="Your requests upstream"
          sample
          actions={<Link to="/dashboard/requests" className="text-sm font-semibold text-brand hover:text-brand-hover">Manage</Link>}
          bodyClassName="p-2"
        >
          <ul>
            {activeRequests.slice(0, 2).map((r) => (
              <QueueRow key={r.id} to="/dashboard/requests" title={r.title} meta={`${r.quotes} manufacturer quote${r.quotes === 1 ? "" : "s"}`} right={neededLabel(r.neededBy)} />
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const { role } = useRole();
  const view = roleView(role);
  const overview = usePolledResource(fetchOverview, { intervalMs: 30000, initialData: overviewFixtures });
  const ticker = usePolledResource(fetchTicker, { intervalMs: 60000, initialData: [] });

  const data = overview.data ?? overviewFixtures;
  const kpis = data.kpis ?? [];
  const activity = data.activity ?? [];
  const deadlines = data.upcomingDeadlines ?? [];
  const topAlerts = data.topAlerts ?? [];
  const health = data.networkHealth ?? { value: 0, trend: [], up: false };
  const live = isConfigured && !overview.error;

  const jump = DASHBOARD_NAV.filter(
    (i) => i.to !== "/dashboard/overview" && !i.adminOnly && (!i.roles || i.roles.includes(role)),
  ).slice(0, 6);

  return (
    <>
      <Seo title="Overview" description={`Your ${PRODUCT} dashboard: requests, quotes, and orders at a glance.`} noindex />

      <DashboardLayout
        ticker={ticker.data ?? []}
        tickerLive={isConfigured && !ticker.error}
        title={`${greeting()}${user?.name ? `, ${user.name.split(" ")[0]}` : ""}.`}
        subtitle={
          role === "contractor"
            ? "What you’ve asked for, what’s been quoted, and what’s on its way to the jobsite."
            : role === "distributor"
              ? "Demand to quote, stock to reorder, and orders moving through your branches."
              : "Demand that matches your catalog, quotes out, and orders to fill."
        }
        actions={ACTIONS[role]?.map((a) => (
          <Button key={a.label} to={a.to} variant={a.variant}>
            {a.label}
          </Button>
        ))}
      >
        <div className="space-y-6">
          {!isConfigured && (
            <DataNotice>
              You’re looking at sample data with fictional companies. Live numbers load once you’re signed in on the hosted site.
            </DataNotice>
          )}
          {overview.error && <ErrorNotice onRetry={() => overview.refresh()} />}

          <div className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
            <span>Working as</span>
            <RoleBadge role={role} label={view.label} />
            <span className="hidden sm:inline">· {view.blurb}</span>
            <span className="sr-only">Switch roles from the sidebar.</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {tilesFor(role, kpis).map((t) => (
              <StatTile key={t.label} {...t} sample={t.sample || !live} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-6">
              <WorkQueue role={role} />

              <Panel title="Recent activity" sample={!live} bodyClassName="p-5">
                {activity.length ? (
                  <ol className="relative space-y-4 border-l border-line pl-5">
                    {activity.map((a) => (
                      <li key={a.id} className="relative">
                        <span className="absolute -left-[1.6rem] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-surface">
                          <StatusDot status={a.status} size={7} pulse={false} />
                        </span>
                        <p className="text-sm text-fg">{relabel(a.text)}</p>
                        <p className="text-xs text-fg-muted">{a.time}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-fg-muted">No activity yet. Post a request or send a quote to get things moving.</p>
                )}
              </Panel>
            </div>

            <div className="space-y-6">
              <ChainCard role={role} />

              <Panel
                title={view.sells && !view.buys ? "Quotes expiring soon" : "Quote deadlines"}
                sample={!live}
                actions={<Link to="/dashboard/quotes" className="text-sm font-semibold text-brand hover:text-brand-hover">View all</Link>}
                bodyClassName="p-2"
              >
                {deadlines.length ? (
                  <ul>
                    {deadlines.map((d) => (
                      <QueueRow
                        key={d.id}
                        to="/dashboard/quotes"
                        title={d.project}
                        meta={`Quote #${d.id} · ${d.due}`}
                        right={
                          <StatusPill tone={d.daysLeft <= 2 ? "danger" : d.daysLeft <= 5 ? "warning" : "neutral"} dot={false}>
                            {d.daysLeft < 0 ? `${Math.abs(d.daysLeft)}d over` : d.daysLeft === 0 ? "Today" : `${d.daysLeft}d`}
                          </StatusPill>
                        }
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="px-3 py-4 text-sm text-fg-muted">Nothing due.</p>
                )}
              </Panel>

              <Panel
                title="Alerts"
                sample={!live}
                actions={<Link to="/dashboard/alerts" className="text-sm font-semibold text-brand hover:text-brand-hover">View all</Link>}
              >
                {topAlerts.length ? (
                  <ul className="space-y-3">
                    {topAlerts.map((a) => (
                      <li key={a.id} className="flex items-start gap-2.5">
                        <span className="mt-1.5 shrink-0">
                          <StatusDot status={ALERT_DOT[a.type] ?? "watch"} size={7} pulse={false} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug text-fg">{relabel(a.title)}</p>
                          <p className="text-xs text-fg-muted">{a.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-fg-muted">All clear.</p>
                )}
              </Panel>

              <Card className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-fg-muted">Network on-time score</p>
                    <p className="mt-1 text-3xl font-bold tabular-nums text-fg">{health.value}%</p>
                  </div>
                  {!live && <SampleLabel>Sample</SampleLabel>}
                </div>
                <Sparkline data={health.trend ?? []} accent="green" width={260} height={40} className="mt-3 w-full" />
                <p className="mt-2 text-xs text-fg-muted">Average on-time delivery rate across your network partners.</p>
              </Card>

              <Panel title="Jump to" bodyClassName="p-2">
                <ul className="grid grid-cols-2 gap-1">
                  {jump.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-subtle">
                        {l.label}
                        <IconArrowRight width={14} height={14} aria-hidden="true" className="text-fg-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          <p className="text-xs text-fg-muted">
            Your company can act as more than one role. Switch between{" "}
            {SWITCHER_ORDER.map((k, i) => (
              <span key={k}>
                {i > 0 && (i === SWITCHER_ORDER.length - 1 ? " and " : ", ")}
                {ROLE_VIEWS[k].label.toLowerCase()}
              </span>
            ))}{" "}
            views from the sidebar at any time.
          </p>
        </div>
      </DashboardLayout>
    </>
  );
}
