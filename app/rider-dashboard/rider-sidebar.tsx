"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { formatBdt, RIDER_SHARE } from "@/lib/parcel-pricing";

export type RiderTransaction = {
  id: string;
  parcelTitle: string;
  leg: "pickup" | "delivery";
  amount: number;
  status: string;
  date: string;
};

export type WalletSummary = {
  received: number;
  pending: number;
  deliveries: number;
};

const ITEMS: { label: string; href?: string }[] = [
  { label: "Deliveries", href: "/rider-dashboard" },
  { label: "Payouts" },
  { label: "Profile" },
];

const ITEM_CLASS =
  "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors";

function StatusPill({ status }: { status: string }) {
  const paid = status === "paid";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest ${
        paid
          ? "border-go/40 bg-go/15 text-go"
          : "border-signal/40 bg-signal/15 text-signal"
      }`}
    >
      {paid ? "Paid" : "Pending"}
    </span>
  );
}

export default function RiderSidebar({
  rider,
  summary,
  transactions,
}: {
  rider: { name: string; district: string; upazila: string };
  summary: WalletSummary;
  transactions: RiderTransaction[];
}) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink p-3 text-paper md:sticky md:top-20 md:w-64 md:shrink-0 md:self-start">
      <div className="rounded-xl bg-white/5 p-3">
        <p className="eyebrow text-white/45">Rider</p>
        <p className="mt-1 truncate font-display text-base font-bold tracking-[-0.02em] text-paper">
          {rider.name}
        </p>
        <p className="mt-0.5 truncate font-mono text-xs text-white/55">
          {rider.upazila}, {rider.district}
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className={`${ITEM_CLASS} ${
                pathname === item.href
                  ? "bg-signal font-semibold text-ink"
                  : "text-white/70 hover:bg-white/10 hover:text-paper"
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <span
              key={item.label}
              aria-disabled="true"
              className={`${ITEM_CLASS} cursor-not-allowed text-white/35`}
            >
              {item.label}
              <span className="font-mono text-[0.55rem] uppercase tracking-widest">
                soon
              </span>
            </span>
          ),
        )}
      </nav>

      <div className="rounded-xl border border-signal/25 bg-signal/10 p-4">
        <p className="eyebrow text-signal">Money received</p>
        <p className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-paper">
          {formatBdt(summary.received)}
        </p>
        <dl className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <dt className="text-white/55">Pending payout</dt>
            <dd className="font-mono text-signal">
              {formatBdt(summary.pending)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-white/55">Payouts paid</dt>
            <dd className="font-mono text-paper">{summary.deliveries}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-white/55">Your share</dt>
            <dd className="font-mono text-paper">
              {Math.round(RIDER_SHARE * 100)}% / leg
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="eyebrow px-1 pb-2 text-white/45">Recent payouts</p>

        {transactions.length === 0 ? (
          <p className="px-1 text-xs text-white/45">
            No earnings yet. Complete a delivery to get paid.
          </p>
        ) : (
          <ul className="flex max-h-72 flex-col gap-1.5 overflow-y-auto pr-1">
            {transactions.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-white/8 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium text-paper">
                    {item.parcelTitle}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-paper">
                    +{formatBdt(item.amount)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.58rem] uppercase tracking-widest text-white/45">
                    {item.leg} · {item.date}
                  </span>
                  <StatusPill status={item.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
