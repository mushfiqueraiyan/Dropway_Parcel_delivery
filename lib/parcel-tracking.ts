export const TRACKING_STEPS = [
  "pending",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
] as const;

export type TrackingStatus = (typeof TRACKING_STEPS)[number];

export const TRACKING_LABELS: Record<TrackingStatus, string> = {
  pending: "Pending",
  picked_up: "Picked up",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export function isTrackingStatus(value: unknown): value is TrackingStatus {
  return (
    typeof value === "string" &&
    (TRACKING_STEPS as readonly string[]).includes(value)
  );
}

// The pickup rider owns the parcel until it is collected.
export const PICKUP_STEPS: TrackingStatus[] = ["pending", "picked_up"];

// Once collected the parcel moves to the delivery rider for the remaining legs.
export const DELIVERY_STEPS: TrackingStatus[] = [
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export function trackingLabel(value: string | null | undefined): string {
  if (value && isTrackingStatus(value)) {
    return TRACKING_LABELS[value];
  }

  return "Pending";
}
