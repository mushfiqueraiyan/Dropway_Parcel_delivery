"use client"
import React, { useEffect, useState } from 'react'

type Parcel = {
  id: string;
  title: string;
  weight: number;
  pickup_location: string;
  pickup_district: string;
  pickup_upazila: string;
  dropoff_location: string;
  dropoff_district: string;
  dropoff_upazila: string;
  tracking: string | null;
  status?: string;
  createdAt: string;
  updatedAt: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
}

const Track = () => {
  const [parcel, setParcel] = useState<Parcel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchParcel() {
      try {
        const res = await fetch("/api/my-parcels")
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Could not load orders.");
        }

        setParcel(data.myParcels)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not load orders.")
      } finally {
        setLoading(false)
      }
    }

    fetchParcel()
  }, [])

  return (
    <main id="main" className="flex-1 bg-paper-2 px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <p className="eyebrow text-signal-deep">Tracking</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-ink sm:text-4xl">
          Track your parcels
        </h1>
        <p className="mt-3 text-[0.95rem] leading-6 text-graphite">
          Every parcel you book shows up here with its tracking number and route
          from pickup to drop-off.
        </p>

        {loading ? (
          <ul className="mt-8 space-y-4">
            {[0, 1].map((i) => (
              <li
                key={i}
                className="animate-pulse rounded-[1.4rem] border border-ink/10 bg-paper p-6 shadow-sm"
              >
                <div className="h-6 w-32 rounded-full bg-ink/10" />
                <div className="mt-4 h-5 w-40 rounded bg-ink/10" />
                <div className="mt-4 h-4 w-3/4 rounded bg-ink/10" />
              </li>
            ))}
          </ul>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-alert/25 bg-alert/5 p-6 text-center">
            <p className="text-sm text-alert">{error}</p>
          </div>
        ) : parcel.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-8 text-center shadow-sm">
            <p className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
              No parcels yet
            </p>
            <p className="mt-2 text-sm text-graphite">
              Book your first delivery and it will show up here.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {parcel.map((item) => (
              <li
                key={item.id}
                className="rounded-[1.4rem] border border-ink/10 bg-paper p-5 shadow-sm ring-1 ring-ink/5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-paper-2 px-3 py-1 font-mono text-xs tracking-wide text-ink">
                    <span
                      className={`size-1.5 rounded-full ${
                        item.tracking && item.tracking !== "pending"
                          ? "bg-go"
                          : "bg-signal"
                      }`}
                      aria-hidden="true"
                    />
                    {item.tracking && item.tracking !== "pending"
                      ? item.tracking
                      : "Tracking pending"}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-graphite">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <div className="mt-4 flex items-start justify-between gap-4">
                  <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h2>
                  <span className="shrink-0 rounded-full border border-signal/40 bg-signal/15 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-signal-deep">
                    {item.status ?? "paid"}
                  </span>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <dt className="eyebrow mt-0.5 w-20 shrink-0 text-graphite">
                      Pickup
                    </dt>
                    <dd className="min-w-0 flex-1 text-ink">
                      <span className="block truncate">{item.pickup_location}</span>
                      <span className="mt-0.5 block font-medium">
                        {item.pickup_upazila}, {item.pickup_district}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="eyebrow mt-0.5 w-20 shrink-0 text-graphite">
                      Drop-off
                    </dt>
                    <dd className="min-w-0 flex-1 text-ink">
                      <span className="block truncate">{item.dropoff_location}</span>
                      <span className="mt-0.5 block font-medium">
                        {item.dropoff_upazila}, {item.dropoff_district}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center gap-3">
                    <dt className="eyebrow w-20 shrink-0 text-graphite">
                      Weight
                    </dt>
                    <dd className="font-mono text-ink">{item.weight} kg</dd>
                  </div>
                  <div className="flex items-center gap-3">
                    <dt className="eyebrow w-20 shrink-0 text-graphite">
                      Updated
                    </dt>
                    <dd className="text-ink">{formatDate(item.updatedAt)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default Track
