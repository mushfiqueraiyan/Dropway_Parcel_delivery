import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/logo";
import { SendForm } from "@/components/send-form";
import { TrackForm } from "@/components/track-form";

const STATS = [
  { value: "12,400", label: "Parcels out today" },
  { value: "64", label: "Districts covered" },
  { value: "96%", label: "On-time delivery" },
  { value: "4.9", label: "Rider rating" },
];

const STEPS = [
  {
    n: "01",
    title: "Book in a minute",
    body: "Add pickup, drop-off, and size. See the fare before you confirm.",
  },
  {
    n: "02",
    title: "We assign a rider",
    body: "Dispatch routes your parcel to the nearest rider automatically.",
  },
  {
    n: "03",
    title: "Track to the door",
    body: "Follow every scan live, then get proof of delivery on the order.",
  },
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

const GLOW: CSSProperties = {
  backgroundImage:
    "radial-gradient(60% 55% at 50% 0%, rgba(255,176,32,0.18), transparent 68%)",
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
      width="16"
      height="16"
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

function ParcelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M10 2.2 16.6 5.6v8.8L10 17.8 3.4 14.4V5.6z" />
      <path d="M3.4 5.6 10 9l6.6-3.4M10 9v8.8" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M10 17.6s5.4-4.4 5.4-9a5.4 5.4 0 1 0-10.8 0c0 4.6 5.4 9 5.4 9z" />
      <circle cx="10" cy="8.5" r="2.1" />
    </svg>
  );
}

function ScooterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="4.8" cy="14.4" r="2.4" />
      <circle cx="15.6" cy="14.4" r="2.4" />
      <path d="M7.2 14.4h5.9M11 14.4l1.7-9.2h-1.7M13.4 5.2h1.9l1.2 9.2" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M3.4 8.4V16h13.2V8.4" />
      <path d="M2.6 8.4 4.3 4h11.4l1.7 4.4a2.1 2.1 0 0 1-4.1.6 2.1 2.1 0 0 1-4.1 0 2.1 2.1 0 0 1-4.1-.6z" />
      <path d="M8.4 16v-3.8h3.2V16" />
    </svg>
  );
}

const SERVICES = [
  {
    title: "Send a parcel",
    body: "Doorstep pickup, delivered across all 64 districts.",
    href: "/add-parcel",
    icon: <ParcelIcon />,
  },
  {
    title: "Track a parcel",
    body: "Follow every scan from pickup to signature.",
    href: "/track",
    icon: <PinIcon />,
  },
  {
    title: "Become a rider",
    body: "Take drops near you and earn per delivery.",
    href: "/become-rider",
    icon: <ScooterIcon />,
  },
  {
    title: "Business delivery",
    body: "Move parcels at volume from one console.",
    href: "#dispatch",
    icon: <StoreIcon />,
  },
];

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-paper">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-10 lg:pb-24 lg:pt-20">
            <div>
              <span className="rise inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-paper-2 px-3.5 py-1.5 text-sm text-graphite">
                <span className="pulse-dot size-2 rounded-full bg-go" aria-hidden />
                Live in all 64 districts
              </span>

              <h1
                className="rise mt-6 font-display text-[2.7rem] font-extrabold leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-[4.3rem]"
                style={{ "--d": "60ms" } as CSSProperties}
              >
                Send anything.
                <br />
                Track it to the <span className="text-signal-deep">door.</span>
              </h1>

              <p
                className="rise mt-6 max-w-lg text-lg leading-8 text-graphite"
                style={{ "--d": "120ms" } as CSSProperties}
              >
                Book a pickup in under a minute. We assign the nearest rider, you
                watch every leg, and proof of delivery lands back on the parcel.
              </p>

              <div
                className="rise mt-8 flex flex-wrap items-center gap-3"
                style={{ "--d": "180ms" } as CSSProperties}
              >
                <Link
                  href="/add-parcel"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-signal px-6 text-sm font-semibold text-ink shadow-[0_16px_36px_-14px_rgba(255,176,32,0.8)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Send a parcel
                  <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#track"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/15 bg-paper px-6 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
                >
                  Track a parcel
                </a>
              </div>

              <dl
                className="rise mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/10 pt-8 sm:grid-cols-4"
                style={{ "--d": "240ms" } as CSSProperties}
              >
                {STATS.map((item) => (
                  <div key={item.label}>
                    <dd className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">
                      {item.value}
                    </dd>
                    <dt className="mt-1 text-sm text-graphite">{item.label}</dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rise" style={{ "--d": "160ms" } as CSSProperties}>
              <div className="relative mx-auto w-[248px] max-w-full">
                <div
                  className="absolute -inset-10 rounded-[3rem] opacity-80 blur-2xl"
                  style={GLOW}
                  aria-hidden
                />
                <Image
                  src="/heroImage.png"
                  alt="Dropway app showing a live parcel route on a map"
                  width={248}
                  height={509}
                  preload
                  className="relative h-auto w-full drop-shadow-[0_40px_64px_rgba(18,22,34,0.35)]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="bg-paper-2">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-[-0.035em] text-ink sm:text-4xl">
              What do you need to move?
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-8 text-graphite">
              One app for sending, tracking, and riding.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((service) => {
                const isAnchor = service.href.startsWith("#");
                const className =
                  "group flex flex-col rounded-3xl border border-ink/10 bg-paper p-6 transition-all hover:-translate-y-1 hover:border-signal hover:shadow-[0_24px_50px_-28px_rgba(18,22,34,0.4)]";
                const inner = (
                  <>
                    <span className="grid size-12 place-items-center rounded-2xl bg-signal/15 text-signal-deep">
                      {service.icon}
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold tracking-[-0.02em] text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-graphite">
                      {service.body}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                      Open
                      <Arrow className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </>
                );

                return isAnchor ? (
                  <a key={service.title} href={service.href} className={className}>
                    {inner}
                  </a>
                ) : (
                  <Link key={service.title} href={service.href} className={className}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" data-dark className="scroll-mt-20 bg-ink text-paper">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="eyebrow text-signal">How it works</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
              Three steps from your door to theirs
            </h2>

            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <li key={step.n} className="border-t border-white/12 pt-6">
                  <span className="font-mono text-sm font-semibold text-signal">
                    {step.n}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-7 text-white/60">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SEND */}
        <section id="send" className="scroll-mt-20 bg-paper">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow text-signal-deep">Send a parcel</p>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] text-ink sm:text-4xl">
                Raise a consignment in under a minute
              </h2>
              <p className="mt-4 max-w-md text-lg leading-8 text-graphite">
                Fill the waybill and the fare is quoted before you confirm.
                Nothing is charged until the parcel moves.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Flat rate quoted up front",
                  "Free to cancel for 2 minutes",
                  "Live ETA once a rider is assigned",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-graphite">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-go/15 text-go-deep">
                      <Check className="size-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <SendForm />
          </div>
        </section>

        {/* TRACK */}
        <section id="track" data-dark className="scroll-mt-20 bg-ink text-paper">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-24">
            <p className="eyebrow text-signal">Tracking</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
              Where is my parcel?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-white/60">
              Enter your tracking number for the live timeline, rider, and ETA.
            </p>
            <div className="mx-auto mt-8 max-w-xl text-left">
              <TrackForm />
            </div>
          </div>
        </section>

        {/* RATE CARD */}
        <section id="pricing" className="scroll-mt-20 bg-paper-2">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <p className="eyebrow text-signal-deep">Rate card</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-[-0.035em] text-ink sm:text-4xl">
              Priced by size, not by surprises
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-8 text-graphite">
              One flat rate per parcel, quoted before you confirm. Same-day adds
              40%, and oversize is quoted on request.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex flex-col rounded-3xl border bg-paper p-6 ${
                    tier.featured
                      ? "border-signal shadow-[0_28px_60px_-34px_rgba(18,22,34,0.45)]"
                      : "border-ink/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                      {tier.name}
                    </h3>
                    {tier.featured ? (
                      <span className="rounded-full bg-signal px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink">
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 font-mono text-xs text-graphite">
                    {tier.limit} · {tier.sla}
                  </p>

                  <p className="mt-5 font-display text-4xl font-extrabold tracking-[-0.03em] text-ink">
                    {tier.price}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm text-graphite">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-go/15 text-go-deep">
                          <Check className="size-3" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/add-parcel"
                    className={`mt-6 grid h-11 place-items-center rounded-xl text-sm font-semibold transition-transform hover:-translate-y-px ${
                      tier.featured
                        ? "bg-signal text-ink"
                        : "border border-ink/15 text-ink hover:bg-ink hover:text-paper"
                    }`}
                  >
                    Send
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section
          id="dispatch"
          data-dark
          className="relative scroll-mt-20 overflow-hidden bg-ink text-paper"
        >
          <div className="absolute inset-0" style={GLOW} aria-hidden />
          <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <p className="eyebrow text-signal">For business</p>
                <h2 className="mt-4 font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
                  Move parcels at volume
                </h2>
                <p className="mt-3 leading-7 text-white/60">
                  One dispatch console for the whole run: assign riders, watch the
                  queue, and keep delivery proof on every order.
                </p>
                <a
                  href="mailto:hello@dropway.com.bd?subject=Parcel%20volume"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-signal px-6 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Talk to sales
                  <Arrow className="size-4" />
                </a>
              </div>

              <div
                id="riders"
                className="scroll-mt-20 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
              >
                <p className="eyebrow text-signal">For riders</p>
                <h2 className="mt-4 font-display text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
                  Ride with Dropway
                </h2>
                <p className="mt-3 leading-7 text-white/60">
                  Accept drops near you, follow routing to every door, and get paid
                  per delivery to bKash every Friday.
                </p>
                <Link
                  href="/become-rider"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/4 px-6 text-sm font-semibold text-paper transition-colors hover:bg-white/10"
                >
                  Become a rider
                  <Arrow className="size-4" />
                </Link>
              </div>
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
                Parcel pickup, dispatch, and delivery tracking across Bangladesh.
                Customers book, admins assign, riders deliver.
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
