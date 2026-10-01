import { IconMegaphone, IconScale, IconPackage, IconTruck } from "../icons";

const TRADE_STEPS = [
  {
    icon: IconMegaphone,
    title: "Request",
    text: "A contractor or distributor posts what they need: line items, quantities, a need-by date, and the jobsite or branch it ships to.",
    detail: "Line items · need-by · ship-to",
  },
  {
    icon: IconScale,
    title: "Quotes",
    text: "Sellers who carry the category and cover the area send quotes. The buyer sees them side by side on one request.",
    detail: "Price · lead time · delivery or will-call",
  },
  {
    icon: IconPackage,
    title: "Order",
    text: "The buyer accepts the quote that fits and it becomes a purchase order both sides work from.",
    detail: "PO · agreed terms · confirmations",
  },
  {
    icon: IconTruck,
    title: "Delivery",
    text: "Status moves from confirmed to shipped to delivered, so nobody has to call to ask where the material is.",
    detail: "Confirmed · shipped · delivered",
  },
];

/** Request → quotes → order → delivery, as a numbered horizontal track. */
export default function TradeFlow({ className = "" }) {
  return (
    <ol className={`relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      <span
        className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-line lg:block"
        aria-hidden="true"
      />
      {TRADE_STEPS.map((step, i) => {
        const Icon = step.icon;
        return (
          <li key={step.title} className="relative flex flex-col">
            <div className="flex items-center gap-3 lg:flex-col lg:items-center lg:text-center">
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface text-brand shadow-[var(--shadow-card)]">
                <Icon width={22} height={22} aria-hidden="true" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold tabular-nums text-white">
                  {i + 1}
                </span>
              </span>
              <h3 className="text-lg font-semibold text-fg lg:mt-4">{step.title}</h3>
            </div>
            <div className="mt-3 flex flex-1 flex-col rounded-2xl border border-line bg-surface p-5 lg:mt-5">
              <p className="flex-1 text-[0.95rem] leading-relaxed text-fg-muted">{step.text}</p>
              <p className="mt-4 rounded-xl bg-subtle px-3 py-2 text-xs font-medium text-fg">{step.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
