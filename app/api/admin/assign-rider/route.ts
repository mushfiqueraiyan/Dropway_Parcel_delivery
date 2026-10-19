import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Assign a rider to either the pickup or the delivery of a parcel.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "admin") {
    return NextResponse.json({ message: "Admins only." }, { status: 403 });
  }

  const { parcelId, riderId, role } = (await req.json()) as {
    parcelId?: string;
    riderId?: string;
    role?: "pickup" | "delivery";
  };

  if (!parcelId || !riderId || (role !== "pickup" && role !== "delivery")) {
    return NextResponse.json(
      { message: "parcelId, riderId and role are required." },
      { status: 400 },
    );
  }

  const data =
    role === "pickup" ? { pickupRiderId: riderId } : { deliveryRiderId: riderId };

  const parcel = await prisma.parcel.update({
    where: { id: parcelId },
    data,
  });

  return NextResponse.json({ parcel });
}
