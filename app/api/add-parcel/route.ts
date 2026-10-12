import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { calculateParcelFee } from "@/lib/parcel-pricing";

interface ParcelBody {
  title?: string;
  weight?: string | number;
  location?: string;
  district?: string;
  upazila?: string;
  paymentIntentId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to add a parcel." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as ParcelBody;
    const { title, weight, location, district, upazila, paymentIntentId } = body;

    if (!title || !weight || !location || !district || !upazila) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment is required before creating a parcel." },
        { status: 402 },
      );
    }

    const parsedWeight = Number(weight);
    if (Number.isNaN(parsedWeight) || parsedWeight <= 0) {
      return NextResponse.json(
        { error: "Weight must be a positive number" },
        { status: 400 },
      );
    }

    const fee = calculateParcelFee(parsedWeight);
    const paymentIntent = await getStripe().paymentIntents.retrieve(
      paymentIntentId,
    );

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment has not been completed." },
        { status: 402 },
      );
    }

    if (paymentIntent.metadata.userId !== session.user.id) {
      return NextResponse.json(
        { error: "This payment does not belong to your account." },
        { status: 403 },
      );
    }

    if (paymentIntent.currency !== "bdt" || paymentIntent.amount !== fee * 100) {
      return NextResponse.json(
        { error: "Payment amount does not match this parcel." },
        { status: 400 },
      );
    }

    const existing = await prisma.parcel.findFirst({
      where: { paymentIntentId },
    });

    if (existing) {
      return NextResponse.json(
        { success: true, data: existing },
        { status: 200 },
      );
    }

    const parcel = await prisma.parcel.create({
      data: {
        id: crypto.randomUUID(),
        title,
        weight: parsedWeight,
        location,
        district,
        upazila,
        status: "paid",
        paymentStatus: "paid",
        amount: fee,
        paymentIntentId,
        currentLocation: `${upazila}, ${district}`,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, data: parcel }, { status: 201 });
  } catch (err) {
    console.error("Failed to create parcel:", err);
    return NextResponse.json(
      { error: "Something went wrong while creating the parcel." },
      { status: 500 },
    );
  }
}
