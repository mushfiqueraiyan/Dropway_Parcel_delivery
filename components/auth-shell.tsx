import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside
        data-dark
        className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-paper lg:flex xl:p-14"
      >
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <div className="absolute inset-0 hero-glow" aria-hidden />

        <div className="relative">
          <Link
            href="/"
            className="inline-flex rounded-md transition-opacity hover:opacity-85"
            aria-label="Dropway home"
          >
            <Logo />
          </Link>
        </div>

        <div className="relative max-w-md">
          <p className="eyebrow text-signal">Parcel delivery platform</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] xl:text-4xl">
            One place to send, dispatch, and track every parcel.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-7 text-white/60">
            Customers book a pickup, admins assign the nearest rider, and every
            order carries live status from door to door.
          </p>

          <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-white/60">#DP-1042</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-go/40 bg-go/15 px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-go">
                Delivered
              </span>
            </div>
            <p className="mt-3 text-sm text-white/80">
              24 Market St → 5th Ave, Apt 12
            </p>
            <p className="mt-1 font-mono text-[0.68rem] text-white/50">
              Signed 10:41 · Marcus T.
            </p>
          </div>
        </div>

        <div className="relative flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white/50">
          <span>12,400 parcels today</span>
          <span>38 cities</span>
          <span>96% on-time</span>
        </div>
      </aside>

      <div className="flex flex-col bg-paper">
        <div className="flex items-center justify-between px-6 py-5 sm:px-8">
          <span className="lg:hidden">
            <Logo tone="dark" />
          </span>
          <Link
            href="/"
            className="ml-auto text-sm font-medium text-graphite transition-colors hover:text-ink"
          >
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-8 sm:py-14">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.035em] text-ink">
              {title}
            </h1>
            <p className="mt-3 text-[0.95rem] leading-6 text-graphite">
              {subtitle}
            </p>

            <div className="mt-8">{children}</div>

            <div className="mt-6 text-sm text-graphite">{footer}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
