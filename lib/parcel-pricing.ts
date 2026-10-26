export const PARCEL_BASE_FEE = 100;
export const PARCEL_HEAVY_FEE = 200;
export const PARCEL_HEAVY_WEIGHT_KG = 10;

export function calculateParcelFee(weightKg: number): number {
  return weightKg > PARCEL_HEAVY_WEIGHT_KG ? PARCEL_HEAVY_FEE : PARCEL_BASE_FEE;
}

// Each leg of a delivery pays the rider 10% of the parcel's weight-based fee,
// so the pickup rider and the delivery rider both earn a share.
export const RIDER_SHARE = 0.1;

export function calculateRiderEarning(parcelFee: number): number {
  return Math.round(parcelFee * RIDER_SHARE);
}

export function formatBdt(amount: number): string {
  return `৳${amount}`;
}
