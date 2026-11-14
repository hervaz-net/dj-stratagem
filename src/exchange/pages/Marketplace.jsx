import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import ListingCard from "../components/market/ListingCard";
import RequestCard from "../components/market/RequestCard";
import CategoryTile from "../components/market/CategoryTile";
import FilterChip from "../components/market/FilterChip";
import { SAMPLE_REQUESTS, categoryIcon } from "../components/market/catalog";
import { fetchProducts } from "../api/products";
import { PRODUCT } from "../brand";
import {
  IconSearch,
  IconLock,
  IconScale,
  IconClock,
  IconLayers,
  IconPackage,
  IconUsers,
  IconCheck,
  IconArrowRight,
  IconTruck,
} from "../components/icons";

const SORTS = {
  relevance: { label: "Featured" },
  "price-asc": { label: "Price: low to high" },
  "price-desc": { label: "Price: high to low" },
  stock: { label: "In stock first" },
  lead: { label: "Shortest lead time" },
};

const mechanics = [
  {
    icon: <IconLock />,
    title: "Sealed quotes, one round",
    text: "Sellers can't see each other's numbers and can't re-bid. One honest price, submitted once, with no undercutting spiral.",
  },
  {
    icon: <IconScale />,
    title: "Compared on more than price",
    text: "Weigh unit price, lead time, fill rate, and delivery the way your job needs. The best total offer wins, not the lowest line.",
  },
  {
    icon: <IconLayers />,
    title: "Split awards by line item",
    text: "Nobody stocks everything. Award the rebar to one seller and the PVC to another and get a full fill instead of 80% from one.",
  },
  {
    icon: <IconClock />,
    title: "A deadline you set",
    text: "Give a request two hours or two days. When the window closes, every quote is lined up side by side and ready to award.",
  },
];

const repeatBuying = [
  {
    icon: <IconPackage />,
    title: "Standing price books",
    text: "For the SKUs you reorder every week, sellers publish tiered contract pricing that stays live. Reorder at a known price; re-quote the book each quarter, not every PO.",
  },
  {
    icon: <IconUsers />,
    title: "Pooled demand",
    text: "The same SKU across many small buyers adds up. Pooling it lets a two-crew shop reach a volume tier, and gives the seller one larger committed order instead of forty small ones.",
  },
];

const sellerProtections = [
  "Set floor pricing per SKU so a quote is never scored below your margin",
  "Win on lead time, fill rate, and reliability, not only on price",
  "Fewer, larger, committed orders instead of constant one-off quotes",
  "See open demand by category and region before you stock up",
];

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [draftQuery, setDraftQuery] = useState(urlQuery);
  // The home page search links here with ?q=; follow later changes too.
  useEffect(() => {
    setQuery(urlQuery);
    setDraftQuery(urlQuery);
  }, [urlQuery]);
  const [category, setCategory] = useState(null);
  const [seller, setSeller] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [fulfillment, setFulfillment] = useState(null);
  const [trade, setTrade] = useState("");
  const [lead, setLead] = useState("");
  const [trades, setTrades] = useState([]);
  const [leadTimes, setLeadTimes] = useState([]);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [catalogNote, setCatalogNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    fetchProducts({
      q: query,
      category: category || "",
      seller,
      trade,
      lead,
      fulfillment: fulfillment || "",
      inStock: inStockOnly,
      sort,
      page,
      limit: 24,
      signal: ctrl.signal,
    })
      .then((data) => {
        setResults(data.listings ?? []);
        setCategories(data.categories ?? []);
        setTrades(data.trades ?? []);
        setLeadTimes(data.leadTimes ?? []);
        setSellers(data.sellers ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setCatalogNote(data.note ?? "");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setError(err.message || "Could not load products.");
        setResults([]);
        setTotal(0);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [query, category, seller, inStockOnly, sort, page, fulfillment, trade, lead]);

  const filtersActive = query || category || seller !== "all" || inStockOnly || fulfillment || trade || lead;
  const resetFilters = () => {
    setQuery("");
    setDraftQuery("");
    setCategory(null);
    setSeller("all");
    setInStockOnly(false);
    setFulfillment(null);
    setTrade("");
    setLead("");
    setPage(1);
  };

  const categoryLabel = categories.find((c) => c.key === category)?.title;
  const catalogTotal = sellers.reduce((n, s) => n + (s.count || 0), 0);

  return (
    <>
      <Seo
        title="Marketplace"
        description="Browse construction supply from manufacturers and distributors: power tools, fasteners, electrical, lumber, rebar and structural, PVC and fittings. Compare price, minimums, lead time, and delivery or will-call."
      />

      <PageHero
        eyebrow="Marketplace"
        title="Construction supply, from the people who make it and stock it."
        actions={
          <>
            <Button to="/register">Post a request</Button>
            <Button to="/suppliers" variant="secondary">
              List products
            </Button>
          </>
        }
      >
        Browse demo catalogs from packaging, industrial, and building-materials suppliers. Listings are
        sample data for browsing — not live seller storefronts. Compare unit price, minimums, and lead time.
      </PageHero>

      <Section className="!pt-10 md:!pt-14">
        {catalogNote && (
          <p className="rounded-xl border border-line bg-subtle px-4 py-3 text-sm text-fg-muted" role="note">
            {catalogNote}
          </p>
        )}

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQuery(draftQuery);
          }}
          className="mt-8 flex items-center gap-3 rounded-full border border-line bg-surface py-1.5 pl-5 pr-1.5 shadow-[var(--shadow-card)] focus-within:border-brand"
        >
          <IconSearch width={18} height={18} className="shrink-0 text-fg-muted" aria-hidden="true" />
          <label htmlFor="market-search" className="sr-only">
            Search sample listings
          </label>
          <input
            id="market-search"
            type="search"
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            placeholder="Search SKUs, products, or sellers"
            className="h-10 min-w-0 flex-1 bg-transparent text-base text-fg outline-hidden placeholder:text-fg-muted/70"
          />
          <Button type="submit" size="sm" className="hidden sm:inline-flex">
            Search
          </Button>
        </form>

        <h2 className="mt-12 text-lg font-semibold text-fg">Shop by category</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <CategoryTile
            icon={<IconLayers />}
            title="All supply"
            count={catalogTotal || total}
            active={category === null}
            onClick={() => {
              setCategory(null);
              setPage(1);
            }}
          />
          {categories.slice(0, 9).map((c) => (
            <CategoryTile
              key={c.key}
              icon={categoryIcon(c.key) ?? <IconPackage />}
              title={c.title}
              count={c.count ?? 0}
              active={category === c.key}
              onClick={() => {
                setCategory(category === c.key ? null : c.key);
                setPage(1);
              }}
            />
          ))}
          <CategoryTile icon={<IconTruck />} title="Equipment rental" text="Machines and trucks by the day" to="/fleet" />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-b border-line pb-5">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter listings">
            <FilterChip
              active={seller === "all"}
              onClick={() => {
                setSeller("all");
                setPage(1);
              }}
            >
              All catalogs
            </FilterChip>
            {sellers.map((s) => (
              <FilterChip
                key={s.key}
                active={seller === s.key}
                onClick={() => {
                  setSeller(seller === s.key ? "all" : s.key);
                  setPage(1);
                }}
              >
                {s.name.replace(/^Demo /, "").replace(/ Catalog$/, "")}
              </FilterChip>
            ))}
            <span className="mx-1 hidden w-px self-stretch bg-line sm:block" aria-hidden="true" />
            <FilterChip
              active={inStockOnly}
              onClick={() => {
                setInStockOnly((v) => !v);
                setPage(1);
              }}
            >
              In stock
            </FilterChip>
            <FilterChip
              active={fulfillment === "delivery"}
              onClick={() => {
                setFulfillment(fulfillment === "delivery" ? null : "delivery");
                setPage(1);
              }}
            >
              Delivery
            </FilterChip>
            <FilterChip
              active={fulfillment === "will-call"}
              onClick={() => {
                setFulfillment(fulfillment === "will-call" ? null : "will-call");
                setPage(1);
              }}
            >
              Will-call
            </FilterChip>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by trade and lead time">
            <label htmlFor="market-trade" className="text-sm text-fg-muted">
              Trade
            </label>
            <select
              id="market-trade"
              value={trade}
              onChange={(e) => {
                setTrade(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-full border border-line bg-surface px-3 text-sm text-fg hover:border-line-strong"
            >
              <option value="">All trades</option>
              {trades.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.title}
                </option>
              ))}
            </select>
            {leadTimes.map((option) => (
              <FilterChip
                key={option.key}
                active={lead === option.key}
                onClick={() => {
                  setLead(lead === option.key ? "" : option.key);
                  setPage(1);
                }}
              >
                {option.title}
              </FilterChip>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="market-sort" className="text-sm text-fg-muted">
              Sort
            </label>
            <select
              id="market-sort"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-full border border-line bg-surface px-3 text-sm text-fg hover:border-line-strong"
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-fg-muted" aria-live="polite">
            {loading ? (
              "Loading sample listings…"
            ) : (
              <>
                <span className="font-semibold text-fg tabular-nums">{total.toLocaleString()}</span> sample{" "}
                {total === 1 ? "listing" : "listings"}
                {categoryLabel && <> in {categoryLabel}</>}
                {trade && <> · {trades.find((t) => t.key === trade)?.title}</>}
                {lead && <> · {leadTimes.find((t) => t.key === lead)?.title}</>}
                {totalPages > 1 && (
                  <>
                    {" "}
                    · page <span className="tabular-nums">{page}</span> of{" "}
                    <span className="tabular-nums">{totalPages}</span>
                  </>
                )}
              </>
            )}
          </p>
          {filtersActive && (
            <button type="button" onClick={resetFilters} className="text-sm font-medium text-brand hover:text-brand-hover">
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-line bg-subtle px-4 py-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        {!error && results.length > 0 ? (
          <>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((l) => (
                <ListingCard key={l.id} listing={l} icon={categoryIcon(l.category)} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          !loading &&
          !error && (
            <div className="mt-5 rounded-2xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
              <p className="text-base font-semibold text-fg">No sample listings match those filters.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
                On the live Exchange, a search that comes up empty is a good reason to post a request and let
                sellers come to you.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button size="sm" variant="secondary" onClick={resetFilters}>
                  Clear filters
                </Button>
                <Button size="sm" to="/register">
                  Post a request
                </Button>
              </div>
            </div>
          )
        )}
      </Section>

      <Section tone="subtle">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Open demand" title="What buyers are asking for.">
            Contractors post requests tied to a job. Distributors post restock requests to manufacturers.
            Sellers quote into both.
          </SectionHeading>
          <div className="flex shrink-0 items-center gap-3">
            <Button to="/projects" variant="secondary">
              Project demand <IconArrowRight width={16} height={16} />
            </Button>
          </div>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_REQUESTS.map((r) => (
            <RequestCard key={r.id} request={r} to="/projects" />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="How quoting works" title="Competitive, without the race to the bottom.">
          Open reverse auctions push sellers to undercut until the margin is gone, and what follows is
          substitutions, short-shipped orders, and slipped dates. Requests on {PRODUCT} are built to get
          one honest price from every seller.
        </SectionHeading>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mechanics.map((m) => (
            <FeatureCard key={m.title} icon={m.icon} title={m.title}>
              {m.text}
            </FeatureCard>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-fg">Most reorders shouldn&rsquo;t need a quote at all.</h3>
            <p className="mt-4 text-base leading-relaxed text-fg-muted">
              Running a request to buy the same box of deck screws you bought last Tuesday is pure friction.
              Two mechanisms take repeat volume off the quoting table.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {repeatBuying.map((e) => (
              <FeatureCard key={e.title} icon={e.icon} title={e.title} tone="distributor">
                {e.text}
              </FeatureCard>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="subtle">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="For sellers" title="A channel worth quoting into.">
              A marketplace only works if the supply side stays healthy. Manufacturers and distributors
              compete on what they&rsquo;re good at, not on bleeding margin to win a box of anchors.
            </SectionHeading>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/suppliers">For manufacturers</Button>
              <Button to="/distributors" variant="secondary">
                For distributors
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold text-fg">Built to protect seller margin</p>
            <ul className="mt-4 space-y-4">
              {sellerProtections.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-[0.95rem] text-fg">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-fg" aria-hidden="true">
                    <IconCheck width={13} height={13} />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CTASection
        title="Bring your materials list."
        subtitle="Post what the job needs, or list what you sell. We're onboarding early buyers and sellers now and will walk you through a recent PO."
        primaryLabel="Join free"
        secondaryLabel="Talk to us"
      />
    </>
  );
}
