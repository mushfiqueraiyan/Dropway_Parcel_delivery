import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UsersTable, { type UserRow, UsersTableSkeleton } from "../users-table";

async function SettingsGate() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role !== "admin") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows: UserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? "user",
    createdAt: user.createdAt.toISOString(),
  }));

  return <UsersTable users={rows} currentUserId={session.user.id} />;
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <SettingsGate />
    </Suspense>
  );
}
