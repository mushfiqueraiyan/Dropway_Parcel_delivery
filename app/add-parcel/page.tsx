"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { ParcelPayment } from "@/components/parcel-payment";
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

const INTRO_STEPS = [
  {
    title: "Enter the details",
    body: "Title, weight, pickup address, then district and upazila.",
  },
  {
    title: "Settle the fare",
    body: "A flat rate by weight, quoted before you pay.",
  },
  {
    title: "Into dispatch",
    body: "The order lands on the queue with status paid.",
  },
];

const AURORA: CSSProperties = {
  backgroundImage:
    "radial-gradient(60% 50% at 88% 0%, rgba(255,176,32,0.16), transparent 62%), radial-gradient(50% 50% at 0% 96%, rgba(52,211,153,0.10), transparent 64%)",
};

const BARCODE: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 3px, currentColor 3px 5px, transparent 5px 6px, currentColor 6px 7px, transparent 7px 11px)",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-alert">{message}</p>;
}

function Waybill({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-paper p-6 text-ink shadow-2xl ring-1 ring-black/5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow text-graphite">{label}</span>
        <span className="h-6 w-28 text-ink/75" style={BARCODE} aria-hidden />
      </div>
      <div className="mt-5 border-t border-dashed border-ink/15 pt-6">{children}</div>
    </div>
  );
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
    <main
      id="main"
      data-dark
      className="relative flex-1 overflow-hidden bg-ink text-paper"
    >
      <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
      <div className="absolute inset-0" style={AURORA} aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-14">
          <aside className="lg:col-span-4">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 backdrop-blur">
              <span className="pulse-dot size-1.5 rounded-full bg-go" />
              <span className="eyebrow text-white/70">New consignment</span>
            </span>

            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
              Add a parcel
            </h1>
            <p className="mt-5 max-w-md text-[1.02rem] leading-7 text-white/60">
              Enter the details, settle the fare, and the order drops straight
              into the dispatch queue.
            </p>

            <ol className="mt-10 space-y-6 border-l border-white/12 pl-6">
              {INTRO_STEPS.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="absolute -left-[31px] grid size-6 place-items-center rounded-full bg-paper font-mono text-[0.62rem] font-semibold text-ink">
                    {index + 1}
                  </span>
                  <h2 className="font-display text-[0.95rem] font-bold tracking-[-0.01em] text-paper">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow text-white/50">Flat rate</span>
                <span className="font-mono text-xs text-white/60">
                  {formatBdt(100)} / {formatBdt(200)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {formatBdt(100)} up to {PARCEL_HEAVY_WEIGHT_KG} kg ·{" "}
                {formatBdt(200)} above. Charged only when the parcel moves.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-8">
            {!isPending && !session ? (
              <Waybill label="Waybill · locked">
                <div className="py-6 text-center">
                  <p className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    Sign in to raise a consignment
                  </p>
                  <p className="mt-2 text-sm text-graphite">
                    You need an account to book a pickup and follow it to the door.
                  </p>
                  <Link
                    href="/login"
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-signal px-6 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
                  >
                    Log in to continue
                  </Link>
                </div>
              </Waybill>
            ) : clientSecret && fee !== null ? (
              <Waybill label="Waybill · payment">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">
                    Settle the fare
                  </h2>
                  <button
                    type="button"
                    onClick={backToDetails}
                    className="text-sm font-medium text-graphite transition-colors hover:text-ink"
                  >
                    Edit details
                  </button>
                </div>

                <dl className="mt-5 divide-y divide-ink/10 rounded-xl border border-ink/10 bg-paper-2 px-4">
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-sm text-graphite">Parcel</dt>
                    <dd className="truncate font-medium text-ink">
                      {getValues("title")}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-sm text-graphite">Weight</dt>
                    <dd className="font-mono text-sm text-ink">
                      {getValues("weight")} kg
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-sm text-graphite">Location</dt>
                    <dd className="truncate text-sm text-ink">
                      {getValues("upazila")}, {getValues("district")}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2.5">
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
              </Waybill>
            ) : (
              <Waybill label="Waybill · draft">
                <form onSubmit={handleSubmit(startPayment)}>
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
                      <label htmlFor="weight" className="eyebrow block text-graphite">
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
                      <label htmlFor="location" className="eyebrow block text-graphite">
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

                    <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-paper-2 px-4 py-3 font-mono text-sm">
                      <span className="text-graphite">Delivery fee</span>
                      <span className="text-ink">{formatBdt(estimatedFee)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={startingPayment}
                    className="mt-7 h-12 w-full rounded-xl bg-signal text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
                  >
                    {startingPayment ? "Starting payment…" : "Continue to payment"}
                  </button>
                  <p className="mt-3 text-center font-mono text-[0.66rem] uppercase tracking-[0.12em] text-graphite">
                    {formatBdt(100)} up to {PARCEL_HEAVY_WEIGHT_KG} kg ·{" "}
                    {formatBdt(200)} above
                  </p>
                </form>
              </Waybill>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
