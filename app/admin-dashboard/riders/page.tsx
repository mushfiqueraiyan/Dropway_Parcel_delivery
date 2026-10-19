import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import RidersTable, { RidersTableSkeleton } from "../riders-table";
import { loadRiders } from "../riders-data";

async function RidersGate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  const riders = await loadRiders();

  return (
    <RidersTable
      title="All riders"
      riders={riders}
      emptyMessage="No riders have applied yet."
    />
  );
}

export default function RidersPage() {
  return (
    <Suspense fallback={<RidersTableSkeleton />}>
      <RidersGate />
    </Suspense>
  );
}
