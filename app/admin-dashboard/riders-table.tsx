"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/toast";

export type RiderRow = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  district: string;
  upazila: string;
  nid: string;
  status: string;
  createdAt: string;
};

const STATUS_STYLE: Record<string, string> = {
  active: "border-go/40 bg-go/15 text-go-deep",
  pending: "border-signal/40 bg-signal/15 text-signal-deep",
  suspended: "border-alert/30 bg-alert/10 text-alert",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-widest ${
        STATUS_STYLE[status] ?? "border-ink/15 bg-paper text-graphite"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function RiderModal({
  rider,
  onClose,
}: {
  rider: RiderRow;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const isActive = rider.status === "active";

  async function toggleStatus() {
    setSaving(true);
    try {
      const response = await fetch("/api/rider", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: rider.userId,
          status: isActive ? "suspended" : "active",
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast(result.message ?? "Could not update the rider.", "error");
        return;
      }

      toast(isActive ? "Rider deactivated." : "Rider activated.");
      onClose();
      router.refresh();
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  const details = [
    { label: "Email", value: rider.email },
    { label: "Phone", value: rider.phoneNumber },
    { label: "Base location", value: rider.location },
    { label: "District", value: rider.district },
    { label: "Upazila", value: rider.upazila },
    { label: "NID", value: rider.nid },
    { label: "Joined", value: formatDate(rider.createdAt) },
  ];

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Rider details for ${rider.name}`}
        className="w-full max-w-md rounded-2xl border border-ink/10 bg-paper p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-signal-deep">Rider</p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-[-0.02em] text-ink">
              {rider.name}
            </h2>
            <div className="mt-2">
              <StatusBadge status={rider.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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

        <dl className="mt-5 divide-y divide-ink/8 rounded-xl border border-ink/10 bg-paper-2/50">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-start justify-between gap-4 px-4 py-2.5"
            >
              <dt className="eyebrow text-graphite">{detail.label}</dt>
              <dd className="min-w-0 text-right text-sm text-ink">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={toggleStatus}
            disabled={saving}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-wait disabled:opacity-60 ${
              isActive
                ? "border border-alert/30 bg-alert/10 text-alert"
                : "bg-go text-ink"
            }`}
          >
            {saving
              ? "Saving…"
              : isActive
                ? "Deactivate rider"
                : "Activate rider"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function RidersTableSkeleton() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-5 shadow-sm">
      <div className="h-7 w-40 animate-pulse rounded bg-ink/10" />
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-12 animate-pulse rounded-lg bg-ink/5" />
        ))}
      </div>
    </div>
  );
}

export default function RidersTable({
  title,
  riders,
  emptyMessage,
}: {
  title: string;
  riders: RiderRow[];
  emptyMessage: string;
}) {
  const [active, setActive] = useState<RiderRow | null>(null);

  return (
    <>
      <div className="rounded-2xl border border-ink/10 bg-paper shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="eyebrow text-signal-deep">Admin</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">
              {title}
            </h1>
          </div>
          <span className="rounded-full border border-ink/12 bg-paper-2 px-3 py-1 font-mono text-xs text-ink">
            {riders.length} total
          </span>
        </div>

        {riders.length === 0 ? (
          <p className="border-t border-ink/10 p-10 text-center text-sm text-graphite">
            {emptyMessage}
          </p>
        ) : (
          <div className="overflow-x-auto border-t border-ink/10">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="text-graphite">
                  {["Rider", "Phone", "Area", "Status"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="eyebrow px-5 py-3 font-normal"
                    >
                      {heading}
                    </th>
                  ))}
                  <th scope="col" className="eyebrow px-5 py-3 text-right font-normal">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {riders.map((rider) => (
                  <tr
                    key={rider.id}
                    onClick={() => setActive(rider)}
                    className="cursor-pointer border-t border-ink/8 align-middle hover:bg-paper-2/50"
                  >
                    <td className="px-5 py-4">
                      <span className="block font-medium text-ink">
                        {rider.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-graphite">
                        {rider.email}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-ink">
                      {rider.phoneNumber}
                    </td>
                    <td className="px-5 py-4 text-ink">
                      {rider.upazila}, {rider.district}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={rider.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActive(rider)}
                        className="rounded-lg border border-ink/15 bg-paper px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-signal-deep/40 hover:bg-signal/15"
                      >
                        View
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
        <RiderModal rider={active} onClose={() => setActive(null)} />
      ) : null}
    </>
  );
}
