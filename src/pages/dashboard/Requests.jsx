import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import RequestDrawer from "../../components/dashboard/RequestDrawer";
import SendQuoteDrawer from "../../components/dashboard/SendQuoteDrawer";
import useLocalState from "../../components/dashboard/useLocalState";
import useLiveResource from "../../components/dashboard/useLiveResource";
import { Card, DataNotice, EmptyState, FilterChips, Segmented, StatusPill, inputCls } from "../../components/dashboard/ui";
import { money, shortDate, daysUntil } from "../../components/dashboard/format";
import { ROLE_VIEWS, roleView } from "../../components/dashboard/roles";
import Button from "../../components/Button";
import RoleBadge from "../../components/RoleBadge";
import SampleLabel from "../../components/SampleLabel";
import Seo from "../../components/Seo";
import { IconSearch, IconTruck, IconBuilding, IconCalendar } from "../../components/icons";
import { useRole } from "../../contexts/RoleContext";
import { useToast } from "../../contexts/ToastContext";
import { requestFixtures, demandFixtures } from "../../api/fixtures";
import { fetchMyRequests, fetchOpenDemand, createRequest, cancelRequest, acceptQuote, sendQuote } from "../../api/dashboard";
import useAuth from "../../auth/useAuth";
import { PRODUCT } from "../../brand";

const REQUEST_STATUS = {
  open: { label: "Open", tone: "brand" },
  quoting: { label: "Quotes in", tone: "info" },
  awarded: { label: "Awarded", tone: "success" },
  closed: { label: "Closed", tone: "neutral" },
};

const BUY_TABS = [
  { key: "active", label: "Active", match: (r) => r.status === "open" || r.status === "quoting" },
  { key: "awarded", label: "Awarded", match: (r) => r.status === "awarded" },
  { key: "closed", label: "Closed", match: (r) => r.status === "closed" },
  { key: "all", label: "All", match: () => true },
];

function NeededBy({ date }) {
  if (!date) return null;
  const d = daysUntil(date);
  const soon = d !== null && d >= 0 && d <= 5;
  return (
    <span className="inline-flex items-center gap-1.5">
      <IconCalendar width={15} height={15} aria-hidden="true" className="text-fg-muted" />
      <span className="text-fg">Needed {shortDate(date)}</span>
      {soon && <span className="font-semibold text-warning">{d === 0 ? "· today" : `· ${d}d`}</span>}
    </span>
  );
}

function Fulfillment({ value, location }) {
  const Icon = value === "delivery" ? IconTruck : IconBuilding;
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon width={15} height={15} aria-hidden="true" className="text-fg-muted" />
      <span className="text-fg">
        {location
          ? `${value === "delivery" ? "Deliver to" : value === "either" ? "Delivery or will-call near" : "Will-call near"} ${location}`
          : value === "delivery" ? "Delivery" : value === "either" ? "Delivery or will-call" : "Will-call"}
      </span>
    </span>
  );
}

function ItemList({ items, limit }) {
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <ul className="divide-y divide-line rounded-xl border border-line bg-canvas">
      {shown.map((it) => (
        <li key={it.description} className="flex items-baseline justify-between gap-3 px-3 py-2 text-sm">
          <span className="min-w-0 text-fg">{it.description}</span>
          <span className="shrink-0 tabular-nums text-fg-muted">
            {Number(it.qty).toLocaleString()} {it.unit}
          </span>
        </li>
      ))}
      {limit && items.length > limit && (
        <li className="px-3 py-2 text-xs font-medium text-fg-muted">+{items.length - limit} more line{items.length - limit === 1 ? "" : "s"}</li>
      )}
    </ul>
  );
}

function MyRequestCard({ request, live, onDelete, onAccept }) {
  const [open, setOpen] = useState(false);
  const status = REQUEST_STATUS[request.status] ?? REQUEST_STATUS.open;
  return (
    <Card as="article" className="flex flex-col p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-fg-muted">{request.id}</span>
        <StatusPill tone={status.tone}>{status.label}</StatusPill>
        {live ? null : request.local ? <StatusPill tone="accent" dot={false}>Saved in this browser</StatusPill> : <SampleLabel>Sample</SampleLabel>}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-fg">{request.title}</h3>
      <p className="mt-0.5 text-sm text-fg-muted">
        {request.category}
        {request.project && <> · {request.project}</>}
      </p>

      <div className="mt-4">
        <ItemList items={request.items} limit={open ? undefined : 2} />
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <NeededBy date={request.neededBy} />
        <Fulfillment value={request.fulfillment} location={request.location} />
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
        <div>
          <p className="text-2xl font-bold tabular-nums text-fg">
            {request.quotes}
            <span className="ml-1.5 text-sm font-medium text-fg-muted">quote{request.quotes === 1 ? "" : "s"}</span>
          </p>
          <p className="text-xs text-fg-muted">
            {request.bestQuote ? <>Best so far {money(request.bestQuote)}</> : "Waiting on sellers"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {request.sendTo.map((r) => (
            <RoleBadge key={r} role={r} label={`${ROLE_VIEWS[r].label}s`} />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Hide details" : "Details"}
        </Button>
        {(request.local || (live && (request.status === "open" || request.status === "quoting"))) && (
          <Button type="button" size="sm" variant="ghost" onClick={() => onDelete(request.id)} className="text-danger hover:bg-danger-soft">
            {live ? "Close request" : "Delete"}
          </Button>
        )}
      </div>
      {open && request.notes && <p className="mt-3 rounded-xl bg-subtle px-3 py-2 text-sm text-fg">{request.notes}</p>}
      {open && live && request.quoteList?.length > 0 && (
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
          {request.quoteList.map((q) => (
            <li key={q.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="font-semibold text-fg">{q.seller}</p>
                <p className="text-xs text-fg-muted">
                  {q.leadTimeDays === 0 ? "Same day" : `${q.leadTimeDays}-day lead time`} · valid {q.validDays} days · {q.sent}
                </p>
                {q.note && <p className="mt-1 text-xs text-fg">{q.note}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tabular-nums text-fg">{money(q.total)}</span>
                {q.status === "sent" && request.status === "quoting" ? (
                  <Button type="button" size="sm" onClick={() => onAccept(request.id, q.id)}>Accept</Button>
                ) : (
                  <StatusPill tone={q.status === "accepted" ? "success" : "neutral"}>
                    {q.status === "accepted" ? "Accepted" : q.status === "declined" ? "Declined" : "Sent"}
                  </StatusPill>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function DemandCard({ request, quote, onQuote }) {
  return (
    <Card as="article" className="flex flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {request.buyerRole && <RoleBadge role={request.buyerRole} label={ROLE_VIEWS[request.buyerRole]?.label} />}
          <span className="text-sm font-semibold text-fg">{request.buyer}</span>
        </div>
        <span className="text-xs text-fg-muted">{request.posted}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-fg">{request.title}</h3>
      <p className="mt-0.5 text-sm text-fg-muted">
        <span className="font-mono text-xs">{request.id}</span> · {request.category}
        {request.project && <> · {request.project}</>}
      </p>

      <div className="mt-4">
        <ItemList items={request.items} limit={3} />
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <NeededBy date={request.neededBy} />
        <Fulfillment value={request.fulfillment} location={request.location} />
      </div>

      <div className="mt-auto pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-fg-muted">
          {request.competing === 0 ? "No quotes yet" : `${request.competing} other quote${request.competing === 1 ? "" : "s"}`}
        </p>
        {quote ? (
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={quote.status === "declined" ? "neutral" : "success"}>
              {quote.status === "accepted" ? "Accepted" : quote.status === "declined" ? "Not selected" : "Your quote"}{" "}
              {money(quote.total, { compact: true })}
              {quote.live ? "" : " · saved locally"}
            </StatusPill>
            {quote.live && quote.status === "sent" && (
              <Button type="button" size="sm" variant="ghost" onClick={() => onQuote(request)}>Update</Button>
            )}
          </div>
        ) : (
          <Button type="button" size="sm" onClick={() => onQuote(request)}>
            Send quote
          </Button>
        )}
      </div>
      </div>
    </Card>
  );
}

function BuyView({ role, onLive }) {
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState("active");
  const [local, setLocal] = useLocalState("djs-rfq-local", []);
  const { toast } = useToast();
  const { csrf } = useAuth();
  const remote = useLiveResource(useCallback((o) => fetchMyRequests(o), []), requestFixtures);
  const live = remote.live;
  const drawerOpen = params.get("new") === "1";

  const setDrawer = (open) => {
    const next = new URLSearchParams(params);
    if (open) next.set("new", "1");
    else next.delete("new");
    setParams(next, { replace: true });
  };

  const all = useMemo(() => (live ? remote.data ?? [] : [...local, ...(remote.data ?? [])]), [live, local, remote.data]);
  const tabs = BUY_TABS.map((t) => ({ key: t.key, label: t.label, count: all.filter(t.match).length }));
  const rows = all.filter((BUY_TABS.find((t) => t.key === tab) ?? BUY_TABS[0]).match);
  useEffect(() => {
    if (!remote.loading) onLive?.(live);
  }, [remote.loading, live, onLive]);

  const run = async (fn, success) => {
    try {
      remote.setData(await fn());
      toast(success, { type: "success" });
      return true;
    } catch (err) {
      toast(err?.message ?? "Something went wrong. Try again.", { type: "error" });
      return false;
    }
  };

  const save = async (form) => {
    if (live) {
      if (await run(() => createRequest(form, { csrf }), "Request posted. Sellers in that category can quote it now.")) {
        setDrawer(false);
        setTab("active");
      }
      return;
    }
    const id = `RFQ-L${String(Date.now()).slice(-5)}`;
    setLocal((prev) => [
      { ...form, id, status: "open", quotes: 0, bestQuote: null, posted: new Date().toISOString().slice(0, 10), local: true },
      ...prev,
    ]);
    setDrawer(false);
    setTab("active");
    toast("Request saved in this browser. It hasn’t been sent to sellers.", { type: "info" });
  };

  const remove = (id) => {
    if (live) {
      run(() => cancelRequest({ id, csrf }), "Request closed. Sellers can no longer quote it.");
      return;
    }
    setLocal((prev) => prev.filter((r) => r.id !== id));
    toast("Request deleted.", { type: "info" });
  };

  const accept = (id, quoteId) =>
    run(() => acceptQuote({ id, quoteId, csrf }), "Quote accepted. The other sellers were told it went elsewhere.");

  const upstream = role === "distributor";

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips label="Request status" options={tabs} value={tab} onChange={setTab} />
        <Button type="button" onClick={() => setDrawer(true)} className="self-start">
          <span aria-hidden="true">+</span> Post a request
        </Button>
      </div>

      {rows.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <MyRequestCard key={r.id} request={r} live={live} onDelete={remove} onAccept={accept} />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            title="Nothing here yet"
            action={<Button type="button" onClick={() => setDrawer(true)}>Post a request</Button>}
          >
            {upstream
              ? "Restocking a branch? Post what you need and compare manufacturer pricing."
              : "Post what the job needs and compare quotes from distributors and manufacturers."}
          </EmptyState>
        </Card>
      )}

      <RequestDrawer open={drawerOpen} onClose={() => setDrawer(false)} onSave={save} role={role} />
    </>
  );
}

function SellView({ role, onLive }) {
  const [category, setCategory] = useState("all");
  const [buyerType, setBuyerType] = useState("all");
  const [query, setQuery] = useState("");
  const [quoting, setQuoting] = useState(null);
  const [localQuotes, setLocalQuotes] = useLocalState("djs-rfq-quotes-local", {});
  const { toast } = useToast();
  const { csrf } = useAuth();
  const remote = useLiveResource(useCallback((o) => fetchOpenDemand(o), []), demandFixtures);
  const live = remote.live;
  useEffect(() => {
    if (!remote.loading) onLive?.(live);
  }, [remote.loading, live, onLive]);

  // Distributors quote contractors; manufacturers see contractor and distributor demand.
  // Live requests also say which sellers the buyer wanted to hear from.
  const visible = (remote.data ?? []).filter((r) => {
    if (live && r.sendTo?.length && !r.sendTo.includes(role)) return false;
    return role === "supplier" || !r.buyerRole || r.buyerRole === "contractor";
  });
  const categories = [...new Set(visible.map((r) => r.category))];
  const quoteFor = (r) => (live ? (r.myQuote ? { ...r.myQuote, live: true } : null) : localQuotes[r.id]);

  const rows = visible.filter((r) => {
    if (category !== "all" && r.category !== category) return false;
    if (buyerType !== "all" && r.buyerRole !== buyerType) return false;
    const q = query.trim().toLowerCase();
    if (q && ![r.title, r.buyer, r.category, r.location, ...r.items.map((i) => i.description)].some((f) => (f ?? "").toLowerCase().includes(q))) return false;
    return true;
  });

  const save = async (quote) => {
    if (live) {
      try {
        remote.setData(await sendQuote({ ...quote, csrf }));
        setQuoting(null);
        toast("Quote sent. The buyer sees it next to the others.", { type: "success" });
      } catch (err) {
        toast(err?.message ?? "Couldn’t send the quote. Try again.", { type: "error" });
      }
      return;
    }
    setLocalQuotes((prev) => ({ ...prev, [quote.requestId]: { ...quote, savedAt: Date.now() } }));
    setQuoting(null);
    toast("Quote saved in this browser. Sample requests can’t receive quotes.", { type: "info" });
  };

  return (
    <>
      <Card className="mb-5 flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <label htmlFor="demand-search" className="sr-only">Search requests</label>
            <IconSearch width={16} height={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              id="demand-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search items, buyers, locations"
              className={`${inputCls} pl-10`}
            />
          </div>
          {role === "supplier" && (
            <Segmented
              label="Buyer type"
              size="sm"
              value={buyerType}
              onChange={setBuyerType}
              options={[
                { key: "all", label: "All buyers" },
                { key: "distributor", label: "Distributors" },
                { key: "contractor", label: "Contractors" },
              ]}
            />
          )}
        </div>
        <FilterChips
          label="Category"
          value={category}
          onChange={setCategory}
          options={[
            { key: "all", label: "All categories", count: visible.length },
            ...categories.map((c) => ({ key: c, label: c, count: visible.filter((r) => r.category === c).length })),
          ]}
        />
      </Card>

      {rows.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <DemandCard key={r.id} request={r} quote={quoteFor(r)} onQuote={setQuoting} />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState title="No requests match">Try another category or clear the search.</EmptyState>
        </Card>
      )}

      <SendQuoteDrawer request={quoting} onClose={() => setQuoting(null)} onSave={save} />
    </>
  );
}

export default function Requests() {
  const { role } = useRole();
  const view = roleView(role);
  const [params] = useSearchParams();
  const [side, setSide] = useState(params.get("new") === "1" || !view.sells ? "buy" : "sell");
  const mode = view.buys && view.sells ? side : view.sells ? "sell" : "buy";
  const [live, setLive] = useState(null);

  const subtitle =
    mode === "sell"
      ? role === "supplier"
        ? "Open requests from distributors and contractors that match what you make."
        : "Contractor requests in your categories. Quote the ones you can fill."
      : role === "distributor"
        ? "Your requests to manufacturers for branch and project stock."
        : "Everything you’ve asked sellers to price, and how the quotes are coming in.";

  return (
    <>
      <Seo title="Requests" description={`Post requests for quote and answer open demand on ${PRODUCT}.`} noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard/overview" }, { label: "Requests" }]}
        title={mode === "sell" ? "Open demand" : "My requests"}
        subtitle={subtitle}
        actions={
          view.buys && view.sells ? (
            <Segmented
              label="Request view"
              value={side}
              onChange={setSide}
              options={[
                { key: "sell", label: "Incoming" },
                { key: "buy", label: "My requests" },
              ]}
            />
          ) : null
        }
      >
        {live === false && (
          <DataNotice className="mb-6">
            {mode === "sell"
              ? "These requests are illustrative, from fictional buyers. They aren’t live demand and quotes you save stay in this browser."
              : "Example requests are illustrative. Requests you post here are saved in this browser only, because the request service isn’t reachable."}
          </DataNotice>
        )}

        {mode === "sell" ? (
          <SellView key={`${role}-sell`} role={role} onLive={setLive} />
        ) : (
          <BuyView key={`${role}-buy`} role={role} onLive={setLive} />
        )}
      </DashboardLayout>
    </>
  );
}
