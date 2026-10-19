import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

function RiderDashboardSkeleton() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <div className="h-6 w-24 animate-pulse rounded bg-ink/10" />
      <div className="mt-4 h-9 w-56 animate-pulse rounded bg-ink/10" />
      <div className="mt-8 h-40 animate-pulse rounded-2xl bg-ink/5" />
    </main>
  );
}

async function RiderDashboardGate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "rider") {
    redirect("/");
  }

  return <div>RiderDashboard</div>;
}

const RiderDashboard = () => {
  return (
    <Suspense fallback={<RiderDashboardSkeleton />}>
      <RiderDashboardGate />
    </Suspense>
  );
};

export default RiderDashboard;
