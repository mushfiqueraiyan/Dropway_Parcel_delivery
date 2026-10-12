import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripeClient(): Promise<Stripe | null> {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Add it to your .env file to enable payments.",
    );
  }

  stripePromise ??= loadStripe(publishableKey);
  return stripePromise;
}
