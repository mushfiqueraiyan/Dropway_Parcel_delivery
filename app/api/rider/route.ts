import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RiderBody {
  name?: string;
  phoneNumber?: string;
  location?: string;
  district?: string;
  upazila?: string;
  nid?: string;
}

const RIDER_STATUSES = ["pending", "active", "suspended"] as const;

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }

    const rider = await prisma.rider.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ rider });
  } catch (err) {
    console.error("Failed to load rider:", err);
    return NextResponse.json(
      { message: "Something went wrong while loading your rider profile." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please login to become a rider." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as RiderBody;
    const { name, phoneNumber, location, district, upazila, nid } = body;

    if (!name || !phoneNumber || !location || !district || !upazila || !nid) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const existed = await prisma.rider.findUnique({
      where: { userId: session.user.id },
    });

    if (existed) {
      return NextResponse.json(
        { message: "You have already applied to be a rider.", rider: existed },
        { status: 409 },
      );
    }

    const rider = await prisma.rider.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        name,
        phoneNumber,
        location,
        district,
        upazila,
        nid,
        status: "pending",
      },
    });

    return NextResponse.json({ rider }, { status: 201 });
  } catch (err) {
    console.error("Failed to create rider:", err);
    return NextResponse.json(
      { message: "Something went wrong while submitting your application." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized. Please login." },
        { status: 401 },
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Only an admin can update a rider's status." },
        { status: 403 },
      );
    }

    const body = (await req.json()) as { userId?: string; status?: string };
    const { userId, status } = body;

    if (
      !userId ||
      !status ||
      !RIDER_STATUSES.includes(status as (typeof RIDER_STATUSES)[number])
    ) {
      return NextResponse.json(
        { message: "A valid userId and status are required." },
        { status: 400 },
      );
    }

    const existed = await prisma.rider.findUnique({ where: { userId } });

    if (!existed) {
      return NextResponse.json(
        { message: "No rider application found for this user." },
        { status: 404 },
      );
    }

    const rider = await prisma.rider.update({
      where: { userId },
      data: { status },
    });

    // Keep the user's role in sync so active riders can open the rider dashboard.
    await prisma.user.update({
      where: { id: userId },
      data: { role: status === "active" ? "rider" : "user" },
    });

    return NextResponse.json({ rider });
  } catch (err) {
    console.error("Failed to update rider:", err);
    return NextResponse.json(
      { message: "Something went wrong while updating the rider." },
      { status: 500 },
    );
  }
}
