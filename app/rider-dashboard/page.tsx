import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RiderParcels, { type RiderParcel } from "./rider-parcels";

function RiderParcelsSkeleton() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-5 shadow-sm">
      <div className="h-7 w-40 animate-pulse rounded bg-ink/10" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-48 animate-pulse rounded-2xl bg-ink/5" />
        ))}
      </div>
    </div>
  );
}

async function RiderParcelsGate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "rider") {
    redirect("/");
  }

  const rider = await prisma.rider.findUnique({
    where: { userId: session.user.id },
  });

  if (!rider) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper p-10 text-center text-sm text-graphite shadow-sm">
        No rider profile found for your account.
      </div>
    );
  }

  // Pickup riders see a parcel until it is collected; after that it belongs to
  // the delivery rider, who sees it through to delivery.
  const parcels = await prisma.parcel.findMany({
    where: {
      OR: [
        { pickupRiderId: rider.id, tracking: "pending" },
        { deliveryRiderId: rider.id, tracking: { not: "pending" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  const rows: RiderParcel[] = parcels.map((parcel) => ({
    id: parcel.id,
    title: parcel.title,
    weight: parcel.weight,
    tracking: parcel.tracking,
    currentLocation: parcel.currentLocation,
    pickup_location: parcel.pickup_location,
    pickup_district: parcel.pickup_district,
    pickup_upazila: parcel.pickup_upazila,
    dropoff_location: parcel.dropoff_location,
    dropoff_district: parcel.dropoff_district,
    dropoff_upazila: parcel.dropoff_upazila,
    stage: parcel.tracking === "pending" ? "pickup" : "delivery",
  }));

  return <RiderParcels parcels={rows} />;
}

export default function RiderDashboard() {
  return (
    <Suspense fallback={<RiderParcelsSkeleton />}>
      <RiderParcelsGate />
    </Suspense>
  );
}
