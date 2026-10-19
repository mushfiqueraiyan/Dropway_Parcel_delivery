import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user.role !== "admin") {
    return null;
  }

  return session;
}

// Promote a user to admin.
export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Admins only." }, { status: 403 });
  }

  const { userId } = (await req.json()) as { userId?: string };

  if (!userId) {
    return NextResponse.json({ message: "userId is required." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: "admin" },
  });

  return NextResponse.json({ user });
}

// Delete a user (their riders, parcels and sessions are removed too).
export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: "Admins only." }, { status: 403 });
  }

  const { userId } = (await req.json()) as { userId?: string };

  if (!userId) {
    return NextResponse.json({ message: "userId is required." }, { status: 400 });
  }

  if (userId === session.user.id) {
    return NextResponse.json(
      { message: "You cannot delete your own account." },
      { status: 400 },
    );
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}
