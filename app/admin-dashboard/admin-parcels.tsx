"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/toast";

export type RiderRow = {
  id: string;
  name: string;
  location: string;
  district: string;
  upazila: string;
};

export type ParcelRow = {
  id: string;
  title: string;
  weight: number;
  tracking: string;
  pickup_location: string;
  pickup_district: string;
  pickup_upazila: string;
  dropoff_location: string;
  dropoff_district: string;
  dropoff_upazila: string;
  pickupRiderName: string | null;
  deliveryRiderName: string | null;
};

const SELECT_CLASS =
  "w-full rounded-lg border border-ink/15 bg-paper-2 px-3 py-2 text-sm text-ink focus:border-signal-deep/50 focus:bg-paper focus:outline-none";

function AssignRider({
  parcelId,
  role,
  district,
  upazila,
  assignedName,
  riders,
  onAssigned,
}: {
  parcelId: string;
  role: "pickup" | "delivery";
  district: string;
  upazila: string;
  assignedName: string | null;
  riders: RiderRow[];
  onAssigned: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [riderId, setRiderId] = useState("");
  const [saving, setSaving] = useState(false);

  // A rider can only be assigned when their district and upazila match the parcel.
  const matchedRiders = riders.filter(
    (rider) => rider.district === district && rider.upazila === upazila,
  );

  async function handleAssign() {
    if (!riderId) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/assign-rider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcelId, riderId, role }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast(result.message ?? "Could not assign the rider.", "error");
        return;
      }

      toast(
        role === "pickup" ? "Pickup rider assigned." : "Delivery rider assigned.",
      );
      router.refresh();
      onAssigned();
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-paper-2/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-graphite">
          {role === "pickup" ? "Pickup rider" : "Delivery rider"}
        </span>
        <span
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-widest ${
            assignedName
              ? "border-go/40 bg-go/15 text-go-deep"
              : "border-ink/15 bg-paper text-graphite"
          }`}
        >
          {assignedName ?? "Unassigned"}
        </span>
      </div>
      <p className="mt-1 text-xs text-graphite">
        Match: {upazila}, {district}
      </p>

      {matchedRiders.length === 0 ? (
        <p className="mt-3 text-xs text-graphite">
          No active rider in {upazila}, {district}.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <select
            value={riderId}
            onChange={(event) => setRiderId(event.target.value)}
            className={SELECT_CLASS}
            aria-label={`Select ${role} rider`}
          >
            <option value="">Select a rider</option>
            {matchedRiders.map((rider) => (
              <option key={rider.id} value={rider.id}>
                {rider.name} — {rider.location}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAssign}
            disabled={!riderId || saving}
            className="shrink-0 rounded-lg bg-signal px-4 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Assigning…" : "Assign"}
          </button>
        </div>
      )}
    </div>
  );
}

function RiderCell({ name }: { name: string | null }) {
  if (!name) {
    return <span className="text-graphite">Unassigned</span>;
  }

  return (
    <span className="inline-flex items-center gap-2 text-ink">
      <span className="size-1.5 rounded-full bg-go" aria-hidden="true" />
      {name}
    </span>
  );
}

export default function AdminParcels({
  parcels,
  riders,
}: {
  parcels: ParcelRow[];
  riders: RiderRow[];
}) {
  const [active, setActive] = useState<ParcelRow | null>(null);

  return (
    <>
      <div className="rounded-2xl border border-ink/10 bg-paper shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="eyebrow text-signal-deep">Admin</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">
              Unassigned parcels
            </h1>
          </div>
          <span className="rounded-full border border-ink/12 bg-paper-2 px-3 py-1 font-mono text-xs text-ink">
            {parcels.length} total
          </span>
        </div>

        {parcels.length === 0 ? (
          <p className="border-t border-ink/10 p-10 text-center text-sm text-graphite">
            No unassigned parcels. Every parcel already has a rider on pickup
            and delivery.
          </p>
        ) : (
          <div className="overflow-x-auto border-t border-ink/10">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-graphite">
                  {["Parcel", "Route", "Tracking", "Pickup rider", "Delivery rider"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="eyebrow px-5 py-3 font-normal"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                  <th scope="col" className="eyebrow px-5 py-3 text-right font-normal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => (
                  <tr
                    key={parcel.id}
                    className="border-t border-ink/8 align-middle hover:bg-paper-2/50"
                  >
                    <td className="px-5 py-4">
                      <span className="block font-medium text-ink">
                        {parcel.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-xs text-graphite">
                        {parcel.weight} kg
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="block text-ink">
                        {parcel.pickup_upazila}, {parcel.pickup_district}
                      </span>
                      <span className="mt-0.5 block text-xs text-graphite">
                        → {parcel.dropoff_upazila}, {parcel.dropoff_district}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-paper-2 px-3 py-1 font-mono text-xs text-ink">
                        <span
                          className={`size-1.5 rounded-full ${
                            parcel.tracking && parcel.tracking !== "pending"
                              ? "bg-go"
                              : "bg-signal"
                          }`}
                          aria-hidden="true"
                        />
                        {parcel.tracking && parcel.tracking !== "pending"
                          ? parcel.tracking
                          : "Pending"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <RiderCell name={parcel.pickupRiderName} />
                    </td>

                    <td className="px-5 py-4">
                      <RiderCell name={parcel.deliveryRiderName} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActive(parcel)}
                        className="rounded-lg border border-ink/15 bg-paper px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-signal-deep/40 hover:bg-signal/15"
                      >
                        {parcel.pickupRiderName || parcel.deliveryRiderName
                          ? "Manage"
                          : "Assign"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            aria-label={`Assign riders for ${active.title}`}
            className="w-full max-w-lg rounded-2xl border border-ink/10 bg-paper p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-signal-deep">Assign riders</p>
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

            <div className="mt-5 space-y-3">
              <AssignRider
                parcelId={active.id}
                role="pickup"
                district={active.pickup_district}
                upazila={active.pickup_upazila}
                assignedName={active.pickupRiderName}
                riders={riders}
                onAssigned={() => setActive(null)}
              />
              <AssignRider
                parcelId={active.id}
                role="delivery"
                district={active.dropoff_district}
                upazila={active.dropoff_upazila}
                assignedName={active.deliveryRiderName}
                riders={riders}
                onAssigned={() => setActive(null)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
