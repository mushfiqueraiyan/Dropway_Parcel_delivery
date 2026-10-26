import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import RiderSidebar, { type RiderTransaction } from "./rider-sidebar";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(value);
}

function SidebarSkeleton() {
  return (
    <aside className="h-80 animate-pulse rounded-2xl bg-ink/10 md:w-64 md:shrink-0" />
  );
}

async function RiderSidebarGate() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "rider") {
    redirect("/");
  }

  const rider = await prisma.rider.findUnique({
    where: { userId: session.user.id },
  });

  if (!rider) {
    redirect("/become-rider");
  }

  const payments = await prisma.payment.findMany({
    where: { riderId: rider.id },
    orderBy: { createdAt: "desc" },
    include: { parcel: { select: { title: true } } },
  });

  const paid = payments.filter((payment) => payment.status === "paid");
  const received = paid.reduce((sum, payment) => sum + payment.amount, 0);
  const pending = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const transactions: RiderTransaction[] = payments
    .slice(0, 12)
    .map((payment) => ({
      id: payment.id,
      parcelTitle: payment.parcel.title,
      leg: payment.leg === "pickup" ? "pickup" : "delivery",
      amount: payment.amount,
      status: payment.status,
      date: formatDate(payment.createdAt),
    }));

  return (
    <RiderSidebar
      rider={{
        name: rider.name,
        district: rider.district,
        upazila: rider.upazila,
      }}
      summary={{ received, pending, deliveries: paid.length }}
      transactions={transactions}
    />
  );
}

export default function RiderDashboardLayout({
  children,
}: LayoutProps<"/rider-dashboard">) {
  return (
    <div className="flex-1 bg-paper-2">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-start">
        <Suspense fallback={<SidebarSkeleton />}>
          <RiderSidebarGate />
        </Suspense>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
