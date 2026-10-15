import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import BecomeRiderForm from "./become-rider-form";

function RiderFormSkeleton() {
  return (
    <main className="mx-auto w-full max-w-xl px-5 py-16">
      <div className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <span className="eyebrow text-signal-deep">Join the fleet</span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
          Become a rider
        </h1>
        <div className="mt-8 space-y-5" aria-hidden>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 w-24 rounded bg-ink/10" />
              <div className="h-11 w-full rounded-lg bg-ink/5" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

async function RiderGate() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) {
    redirect("/login");
  }

  return <BecomeRiderForm />;
}

export default function BecomeRiderPage() {
  return (
    <Suspense fallback={<RiderFormSkeleton />}>
      <RiderGate />
    </Suspense>
  );
}
