import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { calculateParcelFee } from "@/lib/parcel-pricing";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to pay for a parcel." },
        { status: 401 },
      );
    }

    const { weight } = await request.json();
    const weightKg = Number(weight);

    if (!weightKg || weightKg <= 0) {
      return NextResponse.json(
        { error: "Enter a valid weight before paying." },
        { status: 400 },
      );
    }

    const fee = calculateParcelFee(weightKg);

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: fee * 100,
      currency: "bdt",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: session.user.id,
        weight: String(weightKg),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: fee,
      currency: "bdt",
    });
  } catch (err) {
    console.error("Failed to create payment intent:", err);
    return NextResponse.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }
}
