"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/toast";
import {
  DELIVERY_STEPS,
  PICKUP_STEPS,
  TRACKING_LABELS,
  trackingLabel,
} from "@/lib/parcel-tracking";

export type RiderStage = "pickup" | "delivery";

export type RiderParcel = {
  id: string;
  title: string;
  weight: number;
  tracking: string;
  currentLocation: string | null;
  pickup_location: string;
  pickup_district: string;
  pickup_upazila: string;
  dropoff_location: string;
  dropoff_district: string;
  dropoff_upazila: string;
  stage: RiderStage;
};

const SELECT_CLASS =
  "w-full rounded-lg border border-ink/15 bg-paper-2 px-3 py-2 text-sm text-ink focus:border-signal-deep/50 focus:bg-paper focus:outline-none";

const STAGE_LABEL: Record<RiderStage, string> = {
  pickup: "Pickup",
  delivery: "Delivery",
};

function TrackingPill({ tracking }: { tracking: string }) {
  const done = tracking === "delivered";

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-paper-2 px-3 py-1 font-mono text-xs text-ink">
      <span
        className={`size-1.5 rounded-full ${done ? "bg-go" : "bg-signal"}`}
        aria-hidden="true"
      />
      {trackingLabel(tracking)}
    </span>
  );
}

export default function RiderParcels({ parcels }: { parcels: RiderParcel[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [active, setActive] = useState<RiderParcel | null>(null);
  const [tracking, setTracking] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  function openUpdate(parcel: RiderParcel) {
    setActive(parcel);
    setTracking(parcel.tracking);
    setLocation(
      parcel.currentLocation ??
        `${parcel.pickup_upazila}, ${parcel.pickup_district}`,
    );
  }

  async function handleSave() {
    if (!active) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/rider/update-parcel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: active.id,
          tracking,
          currentLocation: location,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast(result.message ?? "Could not update the parcel.", "error");
        return;
      }

      toast(
        tracking === "picked_up"
          ? "Collected — your pickup earning is on its way."
          : tracking === "delivered"
            ? "Delivered — your payout has been recorded."
            : "Tracking updated.",
      );
      setActive(null);
      router.refresh();
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  const steps = active?.stage === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;

  return (
    <>
      <div className="rounded-2xl border border-ink/10 bg-paper shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="eyebrow text-signal-deep">Rider hub</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">
              Assigned parcels
            </h1>
          </div>
          <span className="rounded-full border border-ink/12 bg-paper-2 px-3 py-1 font-mono text-xs text-ink">
            {parcels.length} active
          </span>
        </div>

        {parcels.length === 0 ? (
          <p className="border-t border-ink/10 p-10 text-center text-sm text-graphite">
            Nothing assigned right now. Pickups stay here until you mark them
            collected, then the parcel moves to its delivery rider.
          </p>
        ) : (
          <ul className="grid gap-4 border-t border-ink/10 p-5 sm:grid-cols-2">
            {parcels.map((parcel) => (
              <li
                key={parcel.id}
                className="flex flex-col rounded-[1.4rem] border border-ink/10 bg-paper-2/40 p-4 ring-1 ring-ink/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-lg font-bold tracking-[-0.02em] text-ink">
                      {parcel.title}
                    </h2>
                    <p className="mt-0.5 font-mono text-xs text-graphite">
                      {parcel.weight} kg
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-widest ${
                      parcel.stage === "pickup"
                        ? "border-signal/40 bg-signal/15 text-signal-deep"
                        : "border-go/40 bg-go/15 text-go-deep"
                    }`}
                  >
                    {STAGE_LABEL[parcel.stage]}
                  </span>
                </div>

                <div className="mt-3">
                  <TrackingPill tracking={parcel.tracking} />
                </div>

                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-start gap-3">
                    <dt className="eyebrow mt-0.5 w-16 shrink-0 text-graphite">
                      Pickup
                    </dt>
                    <dd className="min-w-0 flex-1 text-ink">
                      <span className="block truncate">
                        {parcel.pickup_location}
                      </span>
                      <span className="mt-0.5 block font-medium">
                        {parcel.pickup_upazila}, {parcel.pickup_district}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="eyebrow mt-0.5 w-16 shrink-0 text-graphite">
                      Drop-off
                    </dt>
                    <dd className="min-w-0 flex-1 text-ink">
                      <span className="block truncate">
                        {parcel.dropoff_location}
                      </span>
                      <span className="mt-0.5 block font-medium">
                        {parcel.dropoff_upazila}, {parcel.dropoff_district}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <dt className="eyebrow mt-0.5 w-16 shrink-0 text-graphite">
                      Now at
                    </dt>
                    <dd className="min-w-0 flex-1 text-ink">
                      {parcel.currentLocation ?? "—"}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => openUpdate(parcel)}
                  className="mt-4 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
                >
                  {parcel.stage === "pickup" ? "Mark collected" : "Update tracking"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {active ? (
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActive(null);
            }
          }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Update tracking for ${active.title}`}
            className="w-full max-w-lg rounded-2xl border border-ink/10 bg-paper p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-signal-deep">
                  {STAGE_LABEL[active.stage]} update
                </p>
                <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.02em] text-ink">
                  {active.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="grid size-8 shrink-0 place-items-center rounded-lg text-graphite transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="eyebrow text-graphite">Status</span>
                <select
                  value={tracking}
                  onChange={(event) => setTracking(event.target.value)}
                  className={`mt-1.5 ${SELECT_CLASS}`}
                >
                  {steps.map((step) => (
                    <option key={step} value={step}>
                      {TRACKING_LABELS[step]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="eyebrow text-graphite">Current location</span>
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Mirpur 10, Dhaka"
                  className={`mt-1.5 ${SELECT_CLASS}`}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setLocation(
                      `${active.pickup_upazila}, ${active.pickup_district}`,
                    )
                  }
                  className="rounded-lg border border-ink/15 bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-signal-deep/40 hover:bg-signal/15"
                >
                  At pickup
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLocation(
                      `${active.dropoff_upazila}, ${active.dropoff_district}`,
                    )
                  }
                  className="rounded-lg border border-ink/15 bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-signal-deep/40 hover:bg-signal/15"
                >
                  At drop-off
                </button>
              </div>

              <div className="flex justify-end gap-2 border-t border-ink/10 pt-4">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="rounded-lg border border-ink/15 bg-paper px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
