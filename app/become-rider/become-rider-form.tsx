"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useToast } from "@/components/toast";
import { DISTRICT_NAMES, getUpazilas } from "@/lib/bangladesh-locations";

interface RiderFormValues {
  name: string;
  phoneNumber: string;
  location: string;
  district: string;
  upazila: string;
  nid: string;
}

const EMPTY_FORM: RiderFormValues = {
  name: "",
  phoneNumber: "",
  location: "",
  district: "",
  upazila: "",
  nid: "",
};

const FIELD_CLASS =
  "mt-1 w-full rounded-lg border border-ink/15 bg-paper-2 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-signal-deep/50 focus:bg-paper focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

export default function BecomeRiderForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<RiderFormValues>({ defaultValues: EMPTY_FORM });

  const district = useWatch({ control, name: "district" });
  const upazilas = getUpazilas(district);

  const onSubmit = async (data: RiderFormValues) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/rider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast(result.message ?? "Could not submit your application.", "error");
        return;
      }

      toast("Application submitted. We'll review it shortly.");
      reset(EMPTY_FORM);
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-16">
      <div className="rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        <span className="eyebrow text-signal-deep">Join the fleet</span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
          Become a rider
        </h1>
        <p className="mt-2 text-sm leading-6 text-graphite">
          Apply once — we review your details and activate your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className={FIELD_CLASS}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-alert">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-ink"
            >
              Phone number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className={FIELD_CLASS}
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: "Enter a valid 11-digit mobile number",
                },
              })}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-alert">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-ink"
            >
              Base location
            </label>
            <input
              id="location"
              type="text"
              placeholder="House 12, Road 5, Sector 3"
              className={FIELD_CLASS}
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-alert">{errors.location.message}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-ink"
              >
                District
              </label>
              <select
                id="district"
                defaultValue=""
                className={FIELD_CLASS}
                {...register("district", {
                  required: "District is required",
                  onChange: () => setValue("upazila", ""),
                })}
              >
                <option value="" disabled>
                  Select district
                </option>
                {DISTRICT_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="mt-1 text-xs text-alert">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="upazila"
                className="block text-sm font-medium text-ink"
              >
                Upazila
              </label>
              <select
                id="upazila"
                defaultValue=""
                disabled={!district}
                className={FIELD_CLASS}
                {...register("upazila", { required: "Upazila is required" })}
              >
                <option value="" disabled>
                  {district ? "Select upazila" : "Select a district first"}
                </option>
                {upazilas.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              {errors.upazila && (
                <p className="mt-1 text-xs text-alert">
                  {errors.upazila.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="nid" className="block text-sm font-medium text-ink">
              National ID (NID)
            </label>
            <input
              id="nid"
              type="text"
              inputMode="numeric"
              placeholder="Your National NID Number"
              className={FIELD_CLASS}
              {...register("nid", {
                required: "NID is required",
                pattern: {
                  value: /^[0-9]{10,17}$/,
                  message: "Enter a valid NID (10-17 digits)",
                },
              })}
            />
            {errors.nid && (
              <p className="mt-1 text-xs text-alert">{errors.nid.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-signal px-4 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        </form>
      </div>
    </main>
  );
}
