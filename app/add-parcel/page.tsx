"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ParcelPayment } from "@/components/parcel-payment";
import { SiteHeader } from "@/components/site-header";
import { useToast } from "@/components/toast";
import { authClient } from "@/lib/auth-client";
import { DISTRICTS_BY_DIVISION, getUpazilas } from "@/lib/bangladesh-locations";
import {
  calculateParcelFee,
  formatBdt,
  PARCEL_HEAVY_WEIGHT_KG,
} from "@/lib/parcel-pricing";

interface ParcelForm {
  title: string;
  weight: string;
  location: string;
  district: string;
  upazila: string;
}

const EMPTY_FORM: ParcelForm = {
  title: "",
  weight: "",
  location: "",
  district: "",
  upazila: "",
};

const FIELD_CLASS =
  "mt-2 h-11 w-full rounded-xl border border-ink/12 bg-paper-2 px-3.5 text-base text-ink transition-colors placeholder:text-ink/45 focus:border-signal-deep/50 focus:bg-paper focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-alert">{message}</p>;
}

export default function AddParcelPage() {
  const { toast } = useToast();
  const { data: session, isPending } = authClient.useSession();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fee, setFee] = useState<number | null>(null);
  const [startingPayment, setStartingPayment] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ParcelForm>({ defaultValues: EMPTY_FORM });

  const selectedDistrict = useWatch({ control, name: "district" });
  const weight = useWatch({ control, name: "weight" });
  const upazilas = getUpazilas(selectedDistrict);
  const estimatedFee = calculateParcelFee(Number(weight));

  const startPayment = async (data: ParcelForm) => {
    setStartingPayment(true);
    try {
      const response = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: data.weight }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast(result.error ?? "Could not start the payment.", "error");
        return;
      }

      setFee(result.amount);
      setClientSecret(result.clientSecret);
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setStartingPayment(false);
    }
  };

  const completeParcel = async (paymentIntentId: string) => {
    const response = await fetch("/api/add-parcel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...getValues(), paymentIntentId }),
    });

    const result = await response.json();

    if (!response.ok) {
      toast(
        result.error ?? "Payment succeeded but the parcel could not be saved.",
        "error",
      );
      return;
    }

    toast(`Parcel created successfully. Status: paid · Ref: ${result.data?.id}`);
    reset(EMPTY_FORM);
    setClientSecret(null);
    setFee(null);
  };

  const backToDetails = () => {
    setClientSecret(null);
    setFee(null);
  };

  return (
    <>
     

      <main
        id="main"
        className="flex-1 bg-paper-2 px-5 py-12 sm:px-8 sm:py-16"
      >
        <div className="mx-auto w-full max-w-2xl">
          <p className="eyebrow text-signal-deep">New booking</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.035em] text-ink sm:text-4xl">
            Add a parcel
          </h1>
          <p className="mt-3 text-[0.95rem] leading-6 text-graphite">
            Enter the parcel details, pay the delivery fee, and the order is
            created with status <span className="font-semibold">paid</span>.
          </p>

          {!isPending && !session ? (
            <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-6 text-center shadow-sm">
              <p className="text-sm text-graphite">
                You need an account to add a parcel.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-signal px-6 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
              >
                Log in to continue
              </Link>
            </div>
          ) : clientSecret && fee !== null ? (
            <div className="mt-8 rounded-[1.4rem] border border-ink/10 bg-paper p-6 shadow-xl ring-1 ring-ink/5 sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold tracking-[-0.02em]">
                  Payment
                </h2>
                <button
                  type="button"
                  onClick={backToDetails}
                  className="text-sm font-medium text-graphite transition-colors hover:text-ink"
                >
                  Edit details
                </button>
              </div>

              <dl className="mt-4 space-y-2 rounded-xl border border-ink/10 bg-paper-2 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-graphite">Parcel</dt>
                  <dd className="truncate font-medium text-ink">
                    {getValues("title")}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-graphite">Weight</dt>
                  <dd className="font-mono text-ink">
                    {getValues("weight")} kg
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-graphite">Location</dt>
                  <dd className="truncate text-ink">
                    {getValues("upazila")}, {getValues("district")}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-ink/10 pt-2">
                  <dt className="font-medium text-ink">Delivery fee</dt>
                  <dd className="font-mono font-semibold text-ink">
                    {formatBdt(fee)}
                  </dd>
                </div>
              </dl>

              <ParcelPayment
                clientSecret={clientSecret}
                amount={fee}
                onPaid={completeParcel}
              />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(startPayment)}
              className="mt-8 rounded-[1.4rem] border border-ink/10 bg-paper p-6 shadow-xl ring-1 ring-ink/5 sm:p-7"
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className="eyebrow block text-graphite">
                    Parcel title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Documents envelope"
                    className={FIELD_CLASS}
                    {...register("title", {
                      required: "Parcel title is required",
                    })}
                  />
                  <FieldError message={errors.title?.message} />
                </div>

                <div>
                  <label
                    htmlFor="weight"
                    className="eyebrow block text-graphite"
                  >
                    Weight (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    inputMode="decimal"
                    placeholder="1.2"
                    className={`${FIELD_CLASS} font-mono`}
                    {...register("weight", {
                      required: "Weight is required",
                      validate: (value) =>
                        Number(value) > 0 || "Weight must be greater than 0",
                    })}
                  />
                  <FieldError message={errors.weight?.message} />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="eyebrow block text-graphite"
                  >
                    Pickup address
                  </label>
                  <input
                    id="location"
                    type="text"
                    autoComplete="street-address"
                    placeholder="House 12, Road 5, Sector 3"
                    className={FIELD_CLASS}
                    {...register("location", {
                      required: "Pickup address is required",
                    })}
                  />
                  <FieldError message={errors.location?.message} />
                </div>

                <fieldset className="border-t border-ink/10 pt-5">
                  <legend className="eyebrow text-graphite">Location</legend>

                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="district"
                        className="eyebrow block text-graphite"
                      >
                        District
                      </label>
                      <select
                        id="district"
                        defaultValue=""
                        className={FIELD_CLASS}
                        {...register("district", {
                          required: "Select a district",
                          onChange: () => setValue("upazila", ""),
                        })}
                      >
                        <option value="" disabled>
                          Select district
                        </option>
                        {DISTRICTS_BY_DIVISION.map((group) => (
                          <optgroup key={group.division} label={group.division}>
                            {group.districts.map((district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <FieldError message={errors.district?.message} />
                    </div>

                    <div>
                      <label
                        htmlFor="upazila"
                        className="eyebrow block text-graphite"
                      >
                        Upazila
                      </label>
                      <select
                        id="upazila"
                        defaultValue=""
                        disabled={!selectedDistrict}
                        className={FIELD_CLASS}
                        {...register("upazila", {
                          required: "Select an upazila",
                        })}
                      >
                        <option value="" disabled>
                          {selectedDistrict
                            ? "Select upazila"
                            : "Select a district first"}
                        </option>
                        {upazilas.map((upazila) => (
                          <option key={upazila} value={upazila}>
                            {upazila}
                          </option>
                        ))}
                      </select>
                      <FieldError message={errors.upazila?.message} />
                    </div>
                  </div>
                </fieldset>

                <div>
                  <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-paper-2 px-4 py-3 font-mono text-sm">
                    <span className="text-graphite">Delivery fee</span>
                    <span className="text-ink">{formatBdt(estimatedFee)}</span>
                  </div>
                  <p className="mt-2 text-xs text-graphite">
                    {formatBdt(100)} for parcels up to {PARCEL_HEAVY_WEIGHT_KG}{" "}
                    kg · {formatBdt(200)} above {PARCEL_HEAVY_WEIGHT_KG} kg
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={startingPayment}
                className="mt-7 h-12 w-full rounded-xl bg-signal text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
              >
                {startingPayment ? "Starting payment…" : "Continue to payment"}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
