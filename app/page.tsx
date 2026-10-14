import type { CSSProperties } from "react";

import { Logo } from "@/components/logo";
import { SendForm } from "@/components/send-form";
import { TrackForm } from "@/components/track-form";

const TRUST = [
  { value: "12,400", label: "Parcels out today" },
  { value: "64", label: "Districts covered" },
  { value: "96%", label: "On-time delivery" },
  { value: "4.9", label: "Rider rating" },
];

const STEPS = [
  {
    title: "Add the parcel",
    body: "Enter pickup, drop-off, and size. See the fare before you confirm.",
  },
  {
    title: "Assign a rider",
    body: "Dispatch routes it to the nearest rider, or your admin picks one.",
  },
  {
    title: "Track every leg",
    body: "Live status from pickup to door, with rider name and a real ETA.",
  },
  {
    title: "Proof of delivery",
    body: "The recipient signs on the rider app. Signature and photo stay on file.",
  },
];

const TICKER = [
  "DP-1042 · Gulshan 2 → Banani · out for delivery",
  "DP-1041 · Dhanmondi 27 → Mohammadpur · rider assigned",
  "DP-1040 · Motijheel → Wari · picked up 08:47",
  "DP-1039 · Uttara → Bashundhara · delivered 08:52",
  "12,400 parcels moving today",
  "Coverage · all 64 districts",
];

type OrderStatus = "unassigned" | "assigned" | "picked" | "delivered";

const ORDERS: {
  id: string;
  from: string;
  to: string;
  placed: string;
  dist: string;
  weight: string;
  status: OrderStatus;
  rider: string | null;
}[] = [
  {
    id: "DP-1042",
    from: "Gulshan 2",
    to: "Banani, Road 11",
    placed: "09:12",
    dist: "4.2 km",
    weight: "1.2 kg",
    status: "unassigned",
    rider: null,
  },
  {
    id: "DP-1041",
    from: "Dhanmondi 27",
    to: "Mohammadpur",
    placed: "09:04",
    dist: "2.8 km",
    weight: "0.6 kg",
    status: "assigned",
    rider: "Rakib H.",
  },
  {
    id: "DP-1040",
    from: "Motijheel",
    to: "Wari",
    placed: "08:47",
    dist: "6.1 km",
    weight: "3.4 kg",
    status: "picked",
    rider: "Tanvir A.",
  },
  {
    id: "DP-1039",
    from: "Uttara Sector 7",
    to: "Bashundhara R/A",
    placed: "08:30",
    dist: "9.0 km",
    weight: "5.1 kg",
    status: "delivered",
    rider: "Sabbir K.",
  },
];

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  unassigned: {
    label: "Unassigned",
    className: "border-signal/40 bg-signal/15 text-signal",
  },
  assigned: {
    label: "Assigned",
    className: "border-white/15 bg-white/5 text-white/70",
  },
  picked: {
    label: "Picked up",
    className: "border-white/15 bg-white/5 text-white/70",
  },
  delivered: {
    label: "Delivered",
    className: "border-go/40 bg-go/15 text-go",
  },
};

const TIMELINE = [
  {
    label: "Order placed",
    meta: "Gulshan 2 → Banani, Road 11",
    time: "09:12",
    state: "done",
  },
  {
    label: "Rider assigned",
    meta: "Rakib H. · 1.1 km away",
    time: "09:14",
    state: "done",
  },
  {
    label: "Picked up",
    meta: "Scanned at pickup point",
    time: "09:26",
    state: "done",
  },
  {
    label: "Out for delivery",
    meta: "2 stops away",
    time: "09:58",
    state: "current",
  },
  {
    label: "Delivered",
    meta: "Signature pending",
    time: "—",
    state: "todo",
  },
] as const;

const RIDER_POINTS = [
  "Accept assigned orders or pick from the open queue.",
  "Turn-by-turn routing to every drop.",
  "Per-drop payout, sent to bKash every Friday.",
];

const TIERS = [
  {
    name: "Envelope",
    limit: "up to 0.5 kg",
    price: "৳70",
    sla: "Dhaka same-day",
    features: ["Documents and small items", "Live tracking"],
    featured: false,
  },
  {
    name: "Small",
    limit: "up to 5 kg",
    price: "৳120",
    sla: "Nationwide next-day",
    features: ["Shoebox and up", "Signature on delivery"],
    featured: true,
  },
  {
    name: "Large",
    limit: "up to 20 kg",
    price: "৳220",
    sla: "Nationwide next-day",
    features: ["Bulky and multi-item", "Photo proof of delivery"],
    featured: false,
  },
];

const AURORA: CSSProperties = {
  backgroundImage:
    "radial-gradient(65% 55% at 84% 2%, rgba(255,176,32,0.18), transparent 62%), radial-gradient(50% 50% at 4% 92%, rgba(52,211,153,0.10), transparent 64%), radial-gradient(45% 40% at 46% -6%, rgba(130,160,255,0.09), transparent 60%)",
};

const GLOW: CSSProperties = {
  backgroundImage:
    "radial-gradient(60% 60% at 50% 0%, rgba(255,176,32,0.20), transparent 70%)",
};

const BARCODE: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 3px, currentColor 3px 5px, transparent 5px 6px, currentColor 6px 7px, transparent 7px 11px)",
};

const FADE_BOTTOM: CSSProperties = {
  backgroundImage: "linear-gradient(to bottom, transparent, var(--color-ink))",
};

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5L13 5" />
    </svg>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

function Timeline({ compact = false }: { compact?: boolean }) {
  return (
    <ol>
      {TIMELINE.map((event, index) => (
        <li key={event.label} className="relative flex gap-4 pb-5 last:pb-0">
          {index < TIMELINE.length - 1 ? (
            <span
              className="absolute bottom-0 left-[6px] top-[17px] w-px bg-white/12"
              aria-hidden
            />
          ) : null}
          <span
            className={`relative z-10 mt-0.5 size-[13px] shrink-0 rounded-full border-2 ${
              event.state === "done"
                ? "border-go bg-go"
                : event.state === "current"
                  ? "pulse-dot border-signal bg-signal"
                  : "border-white/25 bg-transparent"
            }`}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <span
                className={`text-sm font-medium ${
                  event.state === "todo" ? "text-white/45" : "text-paper"
                }`}
              >
                {event.label}
              </span>
              <span className="font-mono text-xs text-white/45">{event.time}</span>
            </div>
            {!compact ? (
              <p className="mt-0.5 text-xs text-white/45">{event.meta}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Ticker() {
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-ink text-paper">
      <div className="dw-marquee flex w-max items-center">
        {[...TICKER, ...TICKER].map((item, index) => (
          <span
            key={index}
            className="flex shrink-0 items-center gap-3 px-6 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/55"
          >
            <span className="size-1.5 rounded-full bg-signal" aria-hidden />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ConsignmentCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2.4rem]" style={GLOW} aria-hidden />
      <div className="relative rounded-[1.6rem] border border-white/12 bg-white/4 p-5 backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow text-white/50">Consignment</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/15 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-signal">
            <span className="pulse-dot size-1.5 rounded-full bg-signal" />
            In transit
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-paper p-4 text-ink">
          <div className="flex items-center justify-between gap-4">
            <span className="font-display text-lg font-extrabold tracking-[-0.02em]">
              DP-1042
            </span>
            <span className="h-7 w-24 text-ink/80" style={BARCODE} aria-hidden />
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-ink/10 pt-3 font-mono text-[0.68rem]">
            <div>
              <dt className="text-graphite">From</dt>
              <dd className="mt-0.5 text-ink">Gulshan 2</dd>
            </div>
            <div>
              <dt className="text-graphite">To</dt>
              <dd className="mt-0.5 text-ink">Banani</dd>
            </div>
            <div>
              <dt className="text-graphite">Weight</dt>
              <dd className="mt-0.5 text-ink">1.2 kg</dd>
            </div>
          </dl>
        </div>

        <div className="mt-5">
          <Timeline compact />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="font-mono text-xs text-white/55">ETA 26 min</span>
          <span className="inline-flex items-center gap-2 font-mono text-xs text-white/70">
            <span className="size-1.5 rounded-full bg-go" aria-hidden />
            Rakib H. · 1.1 km away
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <style href="dropway-marquee" precedence="default">{`
        @keyframes dw-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .dw-marquee { animation: dw-marquee 34s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .dw-marquee { animation: none; } }
      `}</style>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <main id="main" className="flex-1">
        <Ticker />

        {/* HERO */}
        <section
          data-dark
          id="top"
          className="relative overflow-hidden bg-ink text-paper"
        >
          <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
          <div className="absolute inset-0" style={AURORA} aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-40" style={FADE_BOTTOM} aria-hidden />

          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pt-20">
            <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="lg:col-span-7">
                <span className="rise inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 backdrop-blur">
                  <span className="pulse-dot size-1.5 rounded-full bg-go" />
                  <span className="eyebrow text-white/70">
                    Live network · all 64 districts
                  </span>
                </span>

                <h1
                  className="rise mt-7 font-display text-[2.9rem] font-extrabold leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[4.6rem]"
                  style={{ "--d": "60ms" } as CSSProperties}
                >
                  Add a parcel.
                  <br />
                  Track it to the <span className="text-signal">door.</span>
                </h1>

                <p
                  className="rise mt-7 max-w-xl text-[1.08rem] leading-7 text-white/65"
                  style={{ "--d": "120ms" } as CSSProperties}
                >
                  One order record from pickup to signature. Dispatch assigns the
                  nearest rider, you follow every leg, and proof of delivery
                  lands back on the parcel.
                </p>

                <div
                  className="rise mt-9 flex flex-wrap items-center gap-3"
                  style={{ "--d": "180ms" } as CSSProperties}
                >
                  <a
                    href="#send"
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-signal px-6 text-sm font-semibold text-ink shadow-[0_14px_34px_-12px_rgba(255,176,32,0.75)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Add a parcel
                    <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#track"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/4 px-6 text-sm font-semibold text-paper backdrop-blur transition-colors hover:bg-white/10"
                  >
                    Track a parcel
                  </a>
                </div>

                <dl
                  className="rise mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6"
                  style={{ "--d": "240ms" } as CSSProperties}
                >
                  {TRUST.map((item) => (
                    <div key={item.label}>
                      <dd className="font-display text-2xl font-extrabold tracking-[-0.03em]">
                        {item.value}
                      </dd>
                      <dt className="eyebrow mt-1 text-white/45">{item.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rise lg:col-span-5" style={{ "--d": "200ms" } as CSSProperties}>
                <ConsignmentCard />
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING */}
        <section id="send" className="scroll-mt-20 bg-paper">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-5">
                <p className="eyebrow text-signal-deep">Consignment</p>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-[2.6rem] sm:leading-[1.05]">
                  Raise a consignment in under a minute
                </h2>
                <p className="mt-4 max-w-md text-[1.02rem] leading-7 text-graphite">
                  Fill the waybill, confirm the fare, and the order enters the
                  dispatch queue. Nothing is charged until the parcel moves.
                </p>

                <ol className="mt-10 space-y-5 border-l border-ink/10 pl-6">
                  {STEPS.map((step, index) => (
                    <li key={step.title} className="relative">
                      <span className="absolute -left-[31px] grid size-6 place-items-center rounded-full bg-ink font-mono text-[0.62rem] font-semibold text-paper">
                        {index + 1}
                      </span>
                      <h3 className="font-display text-[0.95rem] font-bold tracking-[-0.01em] text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-graphite">
                        {step.body}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="lg:col-span-7">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="eyebrow text-graphite">Waybill · draft</span>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-graphite">
                    Not yet dispatched
                  </span>
                </div>
                <SendForm />
              </div>
            </div>
          </div>
        </section>

        {/* OPERATIONS */}
        <section
          data-dark
          id="dispatch"
          className="relative scroll-mt-20 overflow-hidden bg-ink text-paper"
        >
          <div className="absolute inset-0" style={AURORA} aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
            <div id="how" className="max-w-2xl scroll-mt-20">
              <p className="eyebrow text-signal">Operations</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-[2.6rem] sm:leading-[1.05]">
                One surface for the whole run
              </h2>
              <p className="mt-4 text-[1.02rem] leading-7 text-white/60">
                Dispatch, tracking, proof of delivery, and rider offers share
                one order record. This is what the team watches all day.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-6">
              {/* Dispatch queue */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur lg:col-span-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="pulse-dot size-2 rounded-full bg-go" />
                    <span className="text-sm font-semibold">Dispatch queue</span>
                    <span className="font-mono text-xs text-white/45">128 active</span>
                  </div>
                  <div className="flex gap-1.5">
                    {["All", "Unassigned", "In transit"].map((filter, index) => (
                      <span
                        key={filter}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          index === 0 ? "bg-paper text-ink" : "text-white/50"
                        }`}
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-white/8">
                  {ORDERS.slice(0, 3).map((order) => (
                    <li
                      key={order.id}
                      className="flex flex-wrap items-center gap-x-5 gap-y-3 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-xs text-white/50">
                            #{order.id}
                          </span>
                          <StatusPill status={order.status} />
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-paper">
                          <span className="truncate">{order.from}</span>
                          <Arrow className="size-3.5 shrink-0 text-white/30" />
                          <span className="truncate">{order.to}</span>
                        </p>
                        <p className="mt-1 font-mono text-[0.66rem] text-white/45">
                          Placed {order.placed} · {order.dist} · {order.weight}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {order.rider ? (
                          <span className="font-mono text-xs text-white/60">
                            {order.rider}
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="shrink-0 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
                          >
                            Assign rider
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tracking */}
              <div
                id="track"
                className="scroll-mt-20 rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur lg:col-span-2"
              >
                <span className="eyebrow text-white/50">Tracking</span>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  One timeline per order, updated on every scan.
                </p>
                <div className="mt-4">
                  <TrackForm />
                </div>
              </div>

              {/* Proof of delivery */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur lg:col-span-2">
                <span className="eyebrow text-white/50">Proof of delivery</span>
                <div className="mt-4 rounded-xl bg-paper p-4 text-ink">
                  <span className="h-6 w-full text-ink/70" style={BARCODE} aria-hidden />
                  <div className="mt-3 flex items-end justify-between border-t border-ink/10 pt-3">
                    <div>
                      <p className="font-display text-base font-bold">
                        Receipt · signed
                      </p>
                      <p className="mt-0.5 font-mono text-[0.66rem] text-graphite">
                        DP-1039 · 08:52
                      </p>
                    </div>
                    <span className="grid size-9 place-items-center rounded-full bg-go/15 text-go-deep">
                      <Check className="size-4" />
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-white/50">
                  Signature and photo are stored on the order, not a separate app.
                </p>
              </div>

              {/* Rider offer */}
              <div
                id="riders"
                className="scroll-mt-20 rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur lg:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-white/50">Rider offer</span>
                  <span className="rounded-full bg-go/15 px-2.5 py-1 font-mono text-xs font-semibold text-go">
                    +৳180
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium text-paper">
                  Pickup · 1.2 km away
                </p>
                <p className="mt-1 font-mono text-xs text-white/50">
                  Gulshan 2 → Banani · 26 min
                </p>
                <ul className="mt-4 space-y-2">
                  {RIDER_POINTS.slice(0, 2).map((point) => (
                    <li key={point} className="flex gap-2.5 text-xs leading-5 text-white/60">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:riders@dropway.com.bd?subject=Ride%20with%20Dropway"
                  className="mt-4 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-signal transition-colors hover:text-paper"
                >
                  Ride with Dropway
                  <Arrow className="size-3.5" />
                </a>
              </div>

              {/* Network */}
              <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur lg:col-span-2">
                <span className="eyebrow text-white/50">Network today</span>
                <dl className="mt-4 space-y-3">
                  {TRUST.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between gap-3 border-b border-white/8 pb-2.5 last:border-b-0 last:pb-0"
                    >
                      <dt className="text-sm text-white/55">{item.label}</dt>
                      <dd className="font-display text-xl font-extrabold tracking-[-0.03em]">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* RATE CARD */}
        <section id="pricing" className="scroll-mt-20 bg-paper-2">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
            <div className="max-w-2xl">
              <p className="eyebrow text-signal-deep">Rate card</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-[2.6rem] sm:leading-[1.05]">
                Priced by size, not by surprises
              </h2>
              <p className="mt-4 text-[1.02rem] leading-7 text-graphite">
                One flat rate per parcel, quoted before you confirm. Same-day
                adds 40%, and oversize is quoted on request.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-ink/10 bg-paper">
              <div className="hidden grid-cols-[1.3fr_2fr_auto] gap-6 border-b border-ink/10 px-6 py-3 sm:grid">
                <span className="eyebrow text-graphite">Size</span>
                <span className="eyebrow text-graphite">Included</span>
                <span className="eyebrow text-right text-graphite">Rate</span>
              </div>

              <ul>
                {TIERS.map((tier) => (
                  <li
                    key={tier.name}
                    className={`grid items-center gap-5 border-b border-ink/10 p-5 last:border-b-0 sm:grid-cols-[1.3fr_2fr_auto] sm:gap-6 sm:p-6 ${
                      tier.featured ? "bg-signal/8" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                          {tier.name}
                        </h3>
                        {tier.featured ? (
                          <span className="rounded-full bg-signal px-2.5 py-0.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-ink">
                            Most booked
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 font-mono text-xs text-graphite">
                        {tier.limit} · {tier.sla}
                      </p>
                    </div>

                    <ul className="flex flex-wrap gap-x-5 gap-y-2">
                      {tier.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-graphite"
                        >
                          <span className="text-go-deep">
                            <Check className="size-3.5" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <span className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">
                        {tier.price}
                      </span>
                      <a
                        href="#send"
                        className={`inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold transition-transform ${
                          tier.featured
                            ? "bg-ink text-paper hover:-translate-y-px"
                            : "border border-ink/15 text-ink hover:bg-ink hover:text-paper"
                        }`}
                      >
                        Send
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section data-dark className="relative overflow-hidden bg-ink text-paper">
          <div className="absolute inset-0" style={AURORA} aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-signal">Ready when you are</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-[2.7rem] sm:leading-[1.05]">
                Send your first parcel today
              </h2>
              <p className="mt-5 text-[1.02rem] leading-7 text-white/65">
                Book a pickup in under a minute, or talk to us about moving
                parcels at volume.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#send"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-signal px-7 text-sm font-semibold text-ink shadow-[0_14px_34px_-12px_rgba(255,176,32,0.75)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Add a parcel
                </a>
                <a
                  href="mailto:hello@dropway.com.bd?subject=Parcel%20volume"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/4 px-7 text-sm font-semibold text-paper backdrop-blur transition-colors hover:bg-white/10"
                >
                  Talk to us
                </a>
              </div>
              <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/50">
                hello@dropway.com.bd · +880 9612-345678
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer data-dark className="border-t border-white/10 bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
                Parcel pickup, dispatch, and delivery tracking across
                Bangladesh. Customers book, admins assign, riders deliver.
              </p>
            </div>

            <nav aria-label="Product">
              <p className="eyebrow text-white/55">Product</p>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  { href: "#send", label: "Send a parcel" },
                  { href: "#track", label: "Track a parcel" },
                  { href: "#how", label: "How it works" },
                  { href: "#pricing", label: "Rate card" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/65 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Portals">
              <p className="eyebrow text-white/55">Portals</p>
              <ul className="mt-5 space-y-3 text-sm">
                {[
                  { href: "#send", label: "Customer portal" },
                  { href: "#dispatch", label: "Dispatch console" },
                  { href: "#riders", label: "Rider app" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/65 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="eyebrow text-white/55">Contact</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a
                    href="mailto:hello@dropway.com.bd"
                    className="font-mono text-white/65 transition-colors hover:text-paper"
                  >
                    hello@dropway.com.bd
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+8809612345678"
                    className="font-mono text-white/65 transition-colors hover:text-paper"
                  >
                    +880 9612-345678
                  </a>
                </li>
                <li className="text-white/55">
                  Level 3, Concord Tower, Gulshan 1, Dhaka 1212
                </li>
                <li className="text-white/55">
                  Support desk · 9:00–22:00 (GMT+6)
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Dropway</span>
            <span>Delivering across all 64 districts</span>
          </div>
        </div>
      </footer>
    </>
  );
}
