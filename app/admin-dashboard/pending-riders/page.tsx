import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import RidersTable, { RidersTableSkeleton } from "../riders-table";
import { loadRiders } from "../riders-data";

async function PendingRidersGate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  // Riders who are not active yet — pending applications and suspended riders.
  const riders = await loadRiders({ status: { not: "active" } });

  return (
    <RidersTable
      title="Pending riders"
      riders={riders}
      emptyMessage="No pending riders. Every rider is active."
    />
  );
}

export default function PendingRidersPage() {
  return (
    <Suspense fallback={<RidersTableSkeleton />}>
      <PendingRidersGate />
    </Suspense>
  );
}
