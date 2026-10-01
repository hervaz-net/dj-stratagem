import { useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { CompactDashboard } from "../../components/CompactDashboard";
import AddBidButton from "../../components/dashboard/AddBidButton";
import {
  Card,
  DataNotice,
  EmptyState,
  ErrorNotice,
  FilterChips,
  Segmented,
  StatTile,
  StatusPill,
} from "../../components/dashboard/ui";
import { money, shortDate, daysUntil } from "../../components/dashboard/format";
import Seo from "../../components/Seo";
import { useToast } from "../../contexts/ToastContext";
import { useRole } from "../../contexts/RoleContext";
import useAuth from "../../auth/useAuth";
import usePolledResource from "../../api/usePolledResource";
import { fetchBids, updateBidStatus, isConfigured, isSample } from "../../api/dashboard";
import { bidFixtures } from "../../api/fixtures";
import { PRODUCT } from "../../brand";

// Status keys are the /api/bids.php contract; only the labels are marketplace copy.
function statusMeta(buyer) {
  return {
    draft: { label: "Draft", tone: "neutral", pill: "bg-subtle text-fg" },
    submitted: { label: buyer ? "Received" : "Sent", tone: "brand", pill: "bg-brand-soft text-brand-fg" },
    review: { label: "Under review", tone: "warning", pill: "bg-warning-soft text-warning" },
    awarded: { label: "Accepted", tone: "success", pill: "bg-success-soft text-success" },
    lost: { label: "Declined", tone: "danger", pill: "bg-danger-soft text-danger" },
  };
}

const ORDER = ["draft", "submitted", "review", "awarded", "lost"];
const OPEN = ["draft", "submitted", "review"];

const COPY = {
  contractor: {
    subtitle: "Every quote on your requests, from first price to accepted order.",
    empty: "Quotes you receive on your requests show up here.",
  },
  distributor: {
    subtitle: "Quotes you send to contractors and the ones you log from manufacturers, in one pipeline.",
    empty: "Quotes you send or receive show up here.",
  },
  supplier: {
    subtitle: "Every quote you’ve sent to distributors and contractors, from draft to accepted.",
    empty: "Quotes you send on incoming requests show up here.",
  },
};

const VIEW_ICONS = {
  table: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  board: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" />
    </svg>
  ),
  console: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 17l6-5-6-5M12 19h8" />
    </svg>
  ),
};

function StatusSelect({ quote, meta, onChange, className = "" }) {
  const s = meta[quote.status] ?? meta.draft;
  return (
    <>
      <label className="sr-only" htmlFor={`quote-status-${quote.id}`}>Status for quote {quote.id}</label>
      <select
        id={`quote-status-${quote.id}`}
        value={quote.status}
        onChange={(e) => onChange(quote.id, e.target.value)}
        className={`h-8 rounded-full border-0 pl-3 pr-7 text-xs font-semibold ${s.pill} ${className}`}
      >
        {ORDER.map((k) => (
          <option key={k} value={k}>{meta[k].label}</option>
        ))}
      </select>
    </>
  );
}

function DueHint({ due, status }) {
  const d = daysUntil(due);
  if (d === null || !OPEN.includes(status)) return null;
  if (d < 0) return <span className="text-xs font-semibold text-danger">Expired</span>;
  if (d <= 3) return <span className="text-xs font-semibold text-warning">{d === 0 ? "Today" : `${d}d left`}</span>;
  return null;
}

function Board({ rows, meta, onChange, buyer }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="grid min-w-[62rem] grid-cols-5 gap-4">
        {ORDER.map((key) => {
          const col = rows.filter((q) => q.status === key);
          const total = col.reduce((s, q) => s + Number(q.value || 0), 0);
          return (
            <section key={key} aria-label={meta[key].label} className="flex flex-col rounded-2xl bg-subtle p-3">
              <header className="mb-3 flex items-center justify-between gap-2 px-1">
                <StatusPill tone={meta[key].tone}>{meta[key].label}</StatusPill>
                <span className="text-xs font-semibold tabular-nums text-fg">{col.length} · {money(total, { compact: true })}</span>
              </header>
              <ul className="flex flex-col gap-2.5">
                {col.map((q) => (
                  <li key={q.id} className="rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
                    <p className="font-mono text-[0.7rem] text-fg-muted">#{q.id}</p>
                    <p className="mt-0.5 text-sm font-semibold leading-snug text-fg">{q.project}</p>
                    <p className="mt-0.5 truncate text-xs text-fg-muted">{buyer ? "From" : "To"} {q.gc}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-base font-bold tabular-nums text-fg">{money(q.value, { compact: true })}</span>
                      <DueHint due={q.due} status={q.status} />
                    </div>
                    <StatusSelect quote={q} meta={meta} onChange={onChange} className="mt-3 w-full" />
                  </li>
                ))}
                {!col.length && <li className="rounded-xl border border-dashed border-line-strong px-3 py-6 text-center text-xs text-fg-muted">None</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function Quotes() {
  const resource = usePolledResource(fetchBids, { intervalMs: 30000, initialData: bidFixtures });
  const quotes = resource.data ?? bidFixtures;
  const { role } = useRole();
  const buyer = role === "contractor";
  const meta = useMemo(() => statusMeta(buyer), [buyer]);
  const copy = COPY[role] ?? COPY.contractor;
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState({ key: "id", dir: "desc" });
  const [view, setView] = useState("table");
  const { csrf } = useAuth();
  const { toast } = useToast();

  const toggleSort = (key) =>
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const rows = useMemo(() => {
    const filtered = filter === "all" ? quotes : filter === "open" ? quotes.filter((q) => OPEN.includes(q.status)) : quotes.filter((q) => q.status === filter);
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
    });
  }, [quotes, filter, sort]);

  const count = (k) => quotes.filter((q) => q.status === k).length;
  const open = quotes.filter((q) => OPEN.includes(q.status));
  const openValue = open.reduce((s, q) => s + Number(q.value || 0), 0);
  const accepted = quotes.filter((q) => q.status === "awarded");
  const decided = accepted.length + count("lost");
  const rate = decided ? Math.round((accepted.length / decided) * 100) : 0;
  const totalValue = rows.reduce((s, q) => s + Number(q.value || 0), 0);

  const changeStatus = async (id, status) => {
    try {
      await updateBidStatus({ id, status, csrf });
      await resource.refresh();
      toast(`Quote #${id} marked ${meta[status]?.label ?? status}.`, { type: "success" });
    } catch (err) {
      toast(err.message ?? "Couldn’t update that quote.", { type: "error" });
    }
  };

  const bulkStatus = async (ids, status) => {
    let done = 0;
    for (const id of ids) {
      try {
        await updateBidStatus({ id, status, csrf });
        done += 1;
      } catch (err) {
        toast(`Quote #${id}: ${err.message ?? "update failed"}`, { type: "error" });
      }
    }
    await resource.refresh();
    if (done) toast(`${done} quote${done === 1 ? "" : "s"} marked ${meta[status]?.label ?? status}.`, { type: "success" });
  };

  const filters = [
    { key: "all", label: "All", count: quotes.length },
    { key: "open", label: "Open", count: open.length },
    ...ORDER.map((k) => ({ key: k, label: meta[k].label, count: count(k) })),
  ];

  const columns = [
    { key: "id", label: "Quote" },
    { key: "project", label: `Request / ${buyer ? "seller" : "buyer"}` },
    { key: "trade", label: "Category" },
    { key: "value", label: "Quote value", align: "right" },
    { key: "due", label: "Valid until", align: "right" },
    { key: "status", label: "Status" },
  ];

  return (
    <>
      <Seo title="Quotes" description={`Track quotes from draft to accepted order on ${PRODUCT}.`} noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard/overview" }, { label: "Quotes" }]}
        title={buyer ? "Quotes received" : role === "supplier" ? "Quotes sent" : "Quotes"}
        subtitle={copy.subtitle}
        actions={<AddBidButton buyer={buyer} onCreated={() => resource.refresh()} />}
      >
        <div className="space-y-6">
          {isSample("bids.php") && (
            <DataNotice>
              {isConfigured
                ? "This includes sample rows with fictional companies. An admin can remove them under Accounts once real data is coming in."
                : "These are sample quotes with fictional companies. Your live pipeline loads once you’re signed in on the hosted site."}
            </DataNotice>
          )}
          {resource.error && <ErrorNotice onRetry={() => resource.refresh()} />}

          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatTile label="Open quotes" value={open.length} hint={`${count("review")} under review`} />
            <StatTile label="Open value" value={money(openValue, { compact: true })} hint="Draft, sent, and in review" />
            <StatTile label="Accepted" value={accepted.length} hint={money(accepted.reduce((s, q) => s + Number(q.value || 0), 0), { compact: true }) + " total"} />
            <StatTile label="Acceptance rate" value={`${rate}%`} hint={`${accepted.length} of ${decided} decided`} valueClassName="text-brand" />
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {view !== "console" ? <FilterChips label="Filter quotes" options={filters} value={filter} onChange={setFilter} /> : <span />}
            <Segmented
              label="Quote view"
              value={view}
              onChange={setView}
              options={[
                { key: "table", label: "Pipeline", icon: VIEW_ICONS.table },
                { key: "board", label: "Board", icon: VIEW_ICONS.board },
                { key: "console", label: "Console", icon: VIEW_ICONS.console },
              ]}
              className="self-start"
            />
          </div>

          {view === "console" && (
            <CompactDashboard
              quotes={quotes}
              statusMeta={meta}
              buyer={buyer}
              onStatusChange={changeStatus}
              onBulkStatus={bulkStatus}
              onCreated={() => resource.refresh()}
            />
          )}

          {view === "board" && <Board rows={rows} meta={meta} onChange={changeStatus} buyer={buyer} />}

          {view === "table" && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[52rem] border-collapse text-sm">
                  <caption className="sr-only">Quotes with request, category, value, and status</caption>
                  <thead className="bg-subtle">
                    <tr className="border-b border-line">
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          scope="col"
                          aria-sort={sort.key === col.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                          className={`px-4 py-3 text-xs font-semibold text-fg ${col.align === "right" ? "text-right" : "text-left"}`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleSort(col.key)}
                            className={`inline-flex items-center gap-1 transition-colors hover:text-brand ${sort.key === col.key ? "text-brand" : ""}`}
                          >
                            {col.label}
                            <span className={sort.key === col.key ? "" : "opacity-30"} aria-hidden="true">
                              {sort.key === col.key && sort.dir === "asc" ? "↑" : "↓"}
                            </span>
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((q) => (
                      <tr key={q.id} className="border-b border-line transition-colors last:border-0 hover:bg-subtle">
                        <td className="px-4 py-3.5 font-mono text-xs text-fg-muted">#{q.id}</td>
                        <th scope="row" className="px-4 py-3.5 text-left font-normal">
                          <p className="font-semibold text-fg">{q.project}</p>
                          <p className="text-xs text-fg-muted">{buyer ? "From" : "To"} {q.gc}</p>
                        </th>
                        <td className="px-4 py-3.5 text-fg-muted">{q.trade}</td>
                        <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-fg">{money(q.value)}</td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-fg-muted">{shortDate(q.due)}</span>
                          <span className="ml-2"><DueHint due={q.due} status={q.status} /></span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusSelect quote={q} meta={meta} onChange={changeStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {rows.length > 0 && (
                    <tfoot>
                      <tr className="border-t border-line bg-subtle">
                        <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-fg">
                          {rows.length} quote{rows.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-fg">{money(totalValue)}</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
              {!rows.length && <EmptyState title="No quotes in this view">{copy.empty}</EmptyState>}
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
