import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DELIVERY_STEPS,
  PICKUP_STEPS,
  isTrackingStatus,
} from "@/lib/parcel-tracking";
import { payLeg } from "@/lib/rider-payments";

// A rider updates the tracking status or the current location of a parcel
// assigned to them. Pickup riders handle the pending parcel; once it is
// collected it moves to the delivery rider for the remaining legs.
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (session?.user.role !== "rider" || !session.user.id) {
      return NextResponse.json({ message: "Riders only." }, { status: 403 });
    }

    const rider = await prisma.rider.findUnique({
      where: { userId: session.user.id },
    });

    if (!rider || rider.status !== "active") {
      return NextResponse.json(
        { message: "Your rider account is not active." },
        { status: 403 },
      );
    }

    const body = (await req.json()) as {
      parcelId?: string;
      tracking?: string;
      currentLocation?: string;
    };

    const { parcelId, tracking, currentLocation } = body;

    if (!parcelId) {
      return NextResponse.json(
        { message: "parcelId is required." },
        { status: 400 },
      );
    }

    if (tracking !== undefined && !isTrackingStatus(tracking)) {
      return NextResponse.json(
        { message: "Unknown tracking status." },
        { status: 400 },
      );
    }

    const location =
      typeof currentLocation === "string" ? currentLocation.trim() : undefined;

    if (!tracking && !location) {
      return NextResponse.json(
        { message: "Provide a tracking status or a current location." },
        { status: 400 },
      );
    }

    const parcel = await prisma.parcel.findUnique({ where: { id: parcelId } });

    if (!parcel) {
      return NextResponse.json({ message: "Parcel not found." }, { status: 404 });
    }

    // The pickup rider owns the parcel while it is pending; the delivery rider
    // takes over once it has been collected.
    const onPickup = parcel.pickupRiderId === rider.id && parcel.tracking === "pending";
    const onDelivery =
      parcel.deliveryRiderId === rider.id && parcel.tracking !== "pending";

    if (!onPickup && !onDelivery) {
      return NextResponse.json(
        { message: "This parcel is not assigned to you right now." },
        { status: 403 },
      );
    }

    if (tracking) {
      const allowed = onPickup ? PICKUP_STEPS : DELIVERY_STEPS;
      if (!allowed.includes(tracking)) {
        return NextResponse.json(
          { message: "That status is not available at this stage." },
          { status: 400 },
        );
      }
    }

    const updated = await prisma.parcel.update({
      where: { id: parcelId },
      data: {
        ...(tracking ? { tracking } : {}),
        ...(location ? { currentLocation: location } : {}),
      },
    });

    // Collecting the parcel pays the pickup rider; delivering pays the
    // delivery rider.
    if (tracking === "picked_up") {
      await payLeg(parcelId, "pickup");
    } else if (tracking === "delivered") {
      await payLeg(parcelId, "delivery");
    }

    return NextResponse.json({ parcel: updated });
  } catch (err) {
    console.error("Failed to update parcel:", err);
    return NextResponse.json(
      { message: "Something went wrong while updating the parcel." },
      { status: 500 },
    );
  }
}
