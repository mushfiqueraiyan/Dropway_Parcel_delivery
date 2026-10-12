import type { CSSProperties } from "react";

import { Logo } from "@/components/logo";
import { SendForm } from "@/components/send-form";
import { SiteHeader } from "@/components/site-header";
import { TrackForm } from "@/components/track-form";

const TRUST = [
  { value: "12,400", label: "Parcels out today" },
  { value: "64", label: "Districts covered" },
  { value: "96%", label: "On-time delivery" },
  { value: "4.9", label: "Average rider rating" },
];

const STEPS = [
  {
    title: "Add the parcel",
    body: "Enter pickup, drop-off, and size. See the fare before you confirm the order.",
  },
  {
    title: "Assign a rider",
    body: "Dispatch sends the order to the nearest rider, or your admin assigns it by hand.",
  },
  {
    title: "Track every leg",
    body: "Live status from pickup to door, with the rider's name and a real ETA.",
  },
  {
    title: "Proof of delivery",
    body: "The recipient signs on the rider's app. Signature and photo stay on the order.",
  },
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
    className: "border-signal-deep/30 bg-signal/20 text-signal-deep",
  },
  assigned: {
    label: "Assigned",
    className: "border-ink/15 bg-ink/5 text-ink/70",
  },
  picked: {
    label: "Picked up",
    className: "border-ink/15 bg-ink/5 text-ink/70",
  },
  delivered: {
    label: "Delivered",
    className: "border-go-deep/30 bg-go/15 text-go-deep",
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
    meta: "Scanned at the pickup point",
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
    features: ["Documents and small items", "Dhaka same-day", "Live tracking"],
    featured: false,
  },
  {
    name: "Small",
    limit: "up to 5 kg",
    price: "৳120",
    features: ["Shoebox and up", "Nationwide next-day", "Signature on delivery"],
    featured: true,
  },
  {
    name: "Large",
    limit: "up to 20 kg",
    price: "৳220",
    features: ["Bulky and multi-item", "Nationwide next-day", "Photo proof of delivery"],
    featured: false,
  },
];

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
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
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] ${className}`}
    >
      {label}
    </span>
  );
}

function RiderChip({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-full bg-ink/10 font-mono text-[0.6rem] font-semibold text-ink/70">
        {initials}
      </span>
      <span className="text-xs font-medium text-ink/70">{name}</span>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      

      <main id="main" className="flex-1">
        {/* HERO */}
        <section
          data-dark
          id="send"
          className="relative scroll-mt-20 overflow-hidden bg-ink text-paper"
        >
          <div className="absolute inset-0 bg-grid opacity-70" aria-hidden />
          <div className="absolute inset-0 hero-glow" aria-hidden />

          <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pt-24">
            <div className="grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-16">
              <div>
                <p className="eyebrow rise text-signal">
                  Same-day · Next-day · Standard
                </p>
                <h1
                  className="rise mt-5 font-display text-[2.6rem] font-extrabold leading-[1.03] tracking-[-0.035em] sm:text-6xl lg:text-[4rem]"
                  style={{ "--d": "60ms" } as CSSProperties}
                >
                  Add a parcel.
                  <br />
                  Track it to the door.
                </h1>
                <p
                  className="rise mt-6 max-w-xl text-[1.06rem] leading-7 text-white/65"
                  style={{ "--d": "120ms" } as CSSProperties}
                >
                  Book a pickup in under a minute. We assign the nearest rider,
                  you follow every leg, and the recipient signs on delivery.
                </p>

                <div
                  className="rise mt-8 flex flex-wrap items-center gap-3"
                  style={{ "--d": "180ms" } as CSSProperties}
                >
                  <a
                    href="#send"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-signal px-6 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
                  >
                    Send a parcel
                  </a>
                  <a
                    href="#track"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold text-paper transition-colors hover:bg-white/10"
                  >
                    Track a parcel
                    <Arrow className="size-4" />
                  </a>
                </div>

                <p
                  className="rise mt-6 font-mono text-xs text-white/55"
                  style={{ "--d": "240ms" } as CSSProperties}
                >
                  Cash on delivery available · live tracking on every order
                </p>
              </div>

              <div
                className="rise"
                style={{ "--d": "200ms" } as CSSProperties}
              >
                <SendForm />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section
          data-dark
          className="border-y border-white/10 bg-ink-soft text-paper"
        >
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-8 lg:grid-cols-4">
              {TRUST.map((item) => (
                <div
                  key={item.label}
                  className="reveal border-t border-white/12 pt-4"
                >
                  <dt className="eyebrow text-white/55">{item.label}</dt>
                  <dd className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="scroll-mt-20 bg-paper">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="max-w-2xl">
              <p className="eyebrow text-signal-deep">How it works</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
                From your desk to their door
              </h2>
              <p className="mt-4 text-[1.02rem] leading-7 text-graphite">
                The customer adds the parcel, dispatch assigns a rider, and
                every scan along the way lands on one order record.
              </p>
            </div>

            <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="reveal bg-paper p-7 transition-colors hover:bg-paper-2"
                >
                  <span className="font-display text-4xl font-extrabold tracking-[-0.04em] text-signal-deep">
                    0{index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-[-0.015em]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.92rem] leading-6 text-graphite">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* DISPATCH CONSOLE */}
        <section id="dispatch" className="scroll-mt-20 bg-paper-2">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="max-w-2xl">
              <p className="eyebrow text-signal-deep">Dispatch console</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
                Every order in one queue
              </h2>
              <p className="mt-4 text-[1.02rem] leading-7 text-graphite">
                Admins see what is unassigned, what is moving, and who is
                carrying it. One tap puts an order on the right rider.
              </p>
            </div>

            <div className="reveal mt-12 overflow-hidden rounded-[1.4rem] border border-ink/10 bg-paper shadow-xl ring-1 ring-ink/5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <span className="pulse-dot size-2 rounded-full bg-go-deep" />
                  <span className="text-sm font-semibold text-ink">Orders</span>
                  <span className="font-mono text-xs text-graphite">
                    128 active
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Unassigned", "In transit", "Delivered"].map(
                    (filter, index) => (
                      <span
                        key={filter}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          index === 0
                            ? "bg-ink text-paper"
                            : "text-graphite"
                        }`}
                      >
                        {filter}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="grid lg:grid-cols-[208px_1fr]">
                <div className="hidden border-r border-ink/10 bg-paper-2/60 p-4 lg:block">
                  <ul className="space-y-1">
                    {["Orders", "Riders", "Areas", "Reports", "Settings"].map(
                      (item, index) => (
                        <li key={item}>
                          <span
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                              index === 0
                                ? "bg-ink font-semibold text-paper"
                                : "text-graphite"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                index === 0 ? "bg-signal" : "bg-ink/25"
                              }`}
                            />
                            {item}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>

                <ul>
                  {ORDERS.map((order) => (
                    <li
                      key={order.id}
                      className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-ink/8 px-4 py-4 last:border-b-0 sm:px-5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-xs text-graphite">
                            #{order.id}
                          </span>
                          <StatusPill status={order.status} />
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-ink">
                          <span className="truncate">{order.from}</span>
                          <Arrow className="size-3.5 shrink-0 text-ink/30" />
                          <span className="truncate">{order.to}</span>
                        </p>
                        <p className="mt-1 font-mono text-[0.68rem] text-graphite">
                          Placed {order.placed} · {order.dist} · {order.weight}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {order.rider ? (
                          <RiderChip name={order.rider} />
                        ) : (
                          <span className="text-xs font-medium text-graphite">
                            No rider yet
                          </span>
                        )}
                        {order.status === "unassigned" ? (
                          <button
                            type="button"
                            className="shrink-0 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
                          >
                            Assign rider
                          </button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TRACK */}
        <section
          data-dark
          id="track"
          className="relative scroll-mt-20 overflow-hidden bg-ink text-paper"
        >
          <div className="absolute inset-0 hero-glow opacity-60" aria-hidden />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <p className="eyebrow text-signal">Tracking</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
                Follow a parcel from pickup to door
              </h2>
              <p className="mt-4 max-w-md text-[1.02rem] leading-7 text-white/60">
                Every order carries one timeline. Customers see it, dispatch
                sees it, and the rider updates it with each scan.
              </p>

              <TrackForm />

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/50">
                <span>Live ETA</span>
                <span>Rider name</span>
                <span>Proof of delivery</span>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/12 bg-white/[0.035] p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white/60">
                  #DP-1042
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/15 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-signal">
                  <span className="size-1.5 rounded-full bg-signal" />
                  Out for delivery
                </span>
              </div>

              <ol className="mt-6">
                {TIMELINE.map((event, index) => (
                  <li
                    key={event.label}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    {index < TIMELINE.length - 1 ? (
                      <span
                        className="absolute left-[7px] top-[19px] bottom-0 w-px bg-white/12"
                        aria-hidden
                      />
                    ) : null}
                    <span
                      className={`relative z-10 mt-0.5 size-[15px] shrink-0 rounded-full border-2 ${
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
                            event.state === "todo"
                              ? "text-white/50"
                              : "text-paper"
                          }`}
                        >
                          {event.label}
                        </span>
                        <span className="font-mono text-xs text-white/50">
                          {event.time}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-white/50">
                        {event.meta}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* RIDERS */}
        <section id="riders" className="scroll-mt-20 bg-paper">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow text-signal-deep">For riders</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
                Take the orders that fit your route
              </h2>
              <p className="mt-4 max-w-md text-[1.02rem] leading-7 text-graphite">
                Riders get offers nearby, not a shift sheet. Accept what works,
                skip what does not, and get paid per drop.
              </p>
              <ul className="mt-8 space-y-4">
                {RIDER_POINTS.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-go/15 text-go-deep">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-[0.95rem] leading-6 text-graphite">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:riders@dropway.com.bd?subject=Ride%20with%20Dropway"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Join as a rider
                <Arrow className="size-4" />
              </a>
            </div>

            <div className="reveal rounded-[1.4rem] border border-ink/10 bg-paper p-6 shadow-xl ring-1 ring-ink/5">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-graphite">
                  Rider · new offer
                </span>
                <span className="font-mono text-sm font-semibold text-go-deep">
                  +৳180
                </span>
              </div>
              <p className="mt-4 font-display text-lg font-bold tracking-[-0.015em]">
                Pickup · 1.2 km away
              </p>
              <p className="mt-1 text-sm text-graphite">
                Gulshan 2 → Banani, Road 11
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-ink/10 py-4 font-mono text-xs">
                <div>
                  <dt className="text-graphite">Dist</dt>
                  <dd className="mt-1 text-ink">4.2 km</dd>
                </div>
                <div>
                  <dt className="text-graphite">Weight</dt>
                  <dd className="mt-1 text-ink">1.2 kg</dd>
                </div>
                <div>
                  <dt className="text-graphite">ETA</dt>
                  <dd className="mt-1 text-ink">26 min</dd>
                </div>
              </dl>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  className="h-11 flex-1 rounded-xl bg-ink text-sm font-semibold text-paper transition-transform hover:-translate-y-px active:translate-y-0"
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="h-11 rounded-xl border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="scroll-mt-20 bg-paper-2">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="max-w-2xl">
              <p className="eyebrow text-signal-deep">Pricing</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
                Priced by size, not by surprises
              </h2>
              <p className="mt-4 text-[1.02rem] leading-7 text-graphite">
                One flat rate per parcel, quoted before you confirm. Same-day
                adds 40%, and oversize is quoted on request.
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`reveal flex flex-col rounded-2xl border p-7 ${
                    tier.featured
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/10 bg-paper text-ink"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`eyebrow ${
                        tier.featured ? "text-white/55" : "text-graphite"
                      }`}
                    >
                      {tier.limit}
                    </span>
                    {tier.featured ? (
                      <span className="rounded-full bg-signal px-2.5 py-0.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink">
                        Most booked
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.02em]">
                    {tier.name}
                  </h3>

                  <p className="mt-4 flex items-baseline gap-1.5">
                    <span className="font-display text-4xl font-extrabold tracking-[-0.03em]">
                      {tier.price}
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        tier.featured ? "text-white/55" : "text-graphite"
                      }`}
                    >
                      / parcel
                    </span>
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5">
                        <span
                          className={`mt-0.5 shrink-0 ${
                            tier.featured ? "text-signal" : "text-go-deep"
                          }`}
                        >
                          <Check className="size-4" />
                        </span>
                        <span
                          className={`text-sm leading-6 ${
                            tier.featured ? "text-white/70" : "text-graphite"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#send"
                    className={`mt-7 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                      tier.featured
                        ? "bg-signal text-ink hover:-translate-y-px"
                        : "border border-ink/15 text-ink hover:bg-ink hover:text-paper"
                    }`}
                  >
                    Send a parcel
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          data-dark
          className="relative overflow-hidden bg-ink text-paper"
        >
          <div className="absolute inset-0 hero-glow opacity-70" aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-signal">Ready when you are</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-[2.7rem] sm:leading-[1.06]">
                Send your first parcel today
              </h2>
              <p className="mt-5 text-[1.02rem] leading-7 text-white/60">
                Book a pickup in under a minute, or talk to us about moving
                parcels at volume.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="#send"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-signal px-7 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
                >
                  Send a parcel
                </a>
                <a
                  href="mailto:hello@dropway.com.bd?subject=Parcel%20volume"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-semibold text-paper transition-colors hover:bg-white/10"
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
                  { href: "#pricing", label: "Pricing" },
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
