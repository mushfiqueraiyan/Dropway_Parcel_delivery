import type { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import type { RiderRow } from "./riders-table";

// Loads riders (optionally filtered) as plain rows for the client table.
export async function loadRiders(
  where: Prisma.RiderWhereInput = {},
): Promise<RiderRow[]> {
  const riders = await prisma.rider.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
  });

  return riders.map((rider) => ({
    id: rider.id,
    userId: rider.userId,
    name: rider.name,
    email: rider.user.email,
    phoneNumber: rider.phoneNumber,
    location: rider.location,
    district: rider.district,
    upazila: rider.upazila,
    nid: rider.nid,
    status: rider.status,
    createdAt: rider.createdAt.toISOString(),
  }));
}
