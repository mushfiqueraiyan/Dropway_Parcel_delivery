import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your .env file to enable payments.",
    );
  }

  client ??= new Stripe(secretKey);
  return client;
}
