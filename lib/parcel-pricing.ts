export const PARCEL_BASE_FEE = 100;
export const PARCEL_HEAVY_FEE = 200;
export const PARCEL_HEAVY_WEIGHT_KG = 10;

export function calculateParcelFee(weightKg: number): number {
  return weightKg > PARCEL_HEAVY_WEIGHT_KG ? PARCEL_HEAVY_FEE : PARCEL_BASE_FEE;
}

export function formatBdt(amount: number): string {
  return `৳${amount}`;
}
