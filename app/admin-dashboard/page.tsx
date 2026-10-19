import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminParcels, { type ParcelRow, type RiderRow } from "./admin-parcels";

function ParcelsSkeleton() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-5 shadow-sm">
      <div className="h-7 w-32 animate-pulse rounded bg-ink/10" />
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-12 animate-pulse rounded-lg bg-ink/5" />
        ))}
      </div>
    </div>
  );
}

async function AdminParcelsGate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  // Only show parcels that still need a rider assigned.
  const parcels = await prisma.parcel.findMany({
    where: {
      OR: [{ pickupRiderId: null }, { deliveryRiderId: null }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      pickupRider: { select: { name: true } },
      deliveryRider: { select: { name: true } },
    },
  });

  // Only active riders can be assigned to a parcel.
  const riders = await prisma.rider.findMany({
    where: { status: "active" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      location: true,
      district: true,
      upazila: true,
    },
  });

  const parcelRows: ParcelRow[] = parcels.map((parcel) => ({
    id: parcel.id,
    title: parcel.title,
    weight: parcel.weight,
    tracking: parcel.tracking,
    pickup_location: parcel.pickup_location,
    pickup_district: parcel.pickup_district,
    pickup_upazila: parcel.pickup_upazila,
    dropoff_location: parcel.dropoff_location,
    dropoff_district: parcel.dropoff_district,
    dropoff_upazila: parcel.dropoff_upazila,
    pickupRiderName: parcel.pickupRider?.name ?? null,
    deliveryRiderName: parcel.deliveryRider?.name ?? null,
  }));

  const riderRows: RiderRow[] = riders;

  return <AdminParcels parcels={parcelRows} riders={riderRows} />;
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<ParcelsSkeleton />}>
      <AdminParcelsGate />
    </Suspense>
  );
}
