"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import { formatBdt } from "@/lib/parcel-pricing";
import { getStripeClient } from "@/lib/stripe-client";

function PayButton({
  amount,
  onPaid,
}: {
  amount: number;
  onPaid: (paymentIntentId: string) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setBusy(true);
    setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Please check your payment details.");
      setBusy(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setBusy(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      await onPaid(paymentIntent.id);
      return;
    }

    setError("Payment was not completed.");
    setBusy(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || busy}
        className="mt-6 h-12 w-full rounded-xl bg-signal text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? "Processing…" : `Pay ${formatBdt(amount)}`}
      </button>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ParcelPayment({
  clientSecret,
  amount,
  onPaid,
}: {
  clientSecret: string;
  amount: number;
  onPaid: (paymentIntentId: string) => Promise<void>;
}) {
  return (
    <Elements stripe={getStripeClient()} options={{ clientSecret }}>
      <div className="mt-5 rounded-xl border border-ink/12 bg-paper-2 p-4">
        <PaymentElement />
      </div>
      <PayButton amount={amount} onPaid={onPaid} />
    </Elements>
  );
}
