import { prisma } from "@/lib/prisma";
import { calculateRiderEarning } from "@/lib/parcel-pricing";

export type ParcelLeg = "pickup" | "delivery";

// A rider starts earning the moment they take a leg, so we open a pending
// earning entry as soon as they are assigned. The amount is 10% of the
// parcel's weight-based fee.
export async function recordAssignment(
  parcelId: string,
  leg: ParcelLeg,
  riderId: string,
) {
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId },
    select: { amount: true },
  });

  if (!parcel) {
    return;
  }

  const amount = calculateRiderEarning(parcel.amount);
  const existing = await prisma.payment.findFirst({
    where: { parcelId, leg },
  });

  if (existing) {
    if (existing.riderId !== riderId || existing.amount !== amount) {
      await prisma.payment.update({
        where: { id: existing.id },
        data: { riderId, amount, status: "pending" },
      });
    }
    return;
  }

  await prisma.payment.create({
    data: {
      id: crypto.randomUUID(),
      parcelId,
      leg,
      riderId,
      amount,
      status: "pending",
    },
  });
}

// A leg pays out when it is finished: the pickup rider when the parcel is
// collected, the delivery rider when it is delivered.
export async function payLeg(parcelId: string, leg: ParcelLeg) {
  const parcel = await prisma.parcel.findUnique({
    where: { id: parcelId },
    select: { amount: true, pickupRiderId: true, deliveryRiderId: true },
  });

  if (!parcel) {
    return;
  }

  const riderId =
    leg === "pickup" ? parcel.pickupRiderId : parcel.deliveryRiderId;

  if (!riderId) {
    return;
  }

  const amount = calculateRiderEarning(parcel.amount);
  const existing = await prisma.payment.findFirst({
    where: { parcelId, leg },
  });

  if (existing) {
    await prisma.payment.update({
      where: { id: existing.id },
      data: { riderId, amount, status: "paid" },
    });
  } else {
    await prisma.payment.create({
      data: {
        id: crypto.randomUUID(),
        parcelId,
        leg,
        riderId,
        amount,
        status: "paid",
      },
    });
  }
}
