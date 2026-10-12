const SERVICES = ["Same-day", "Next-day", "Standard"];

const SIZES = ["Envelope", "Small", "Medium", "Large"];

export function SendForm() {
  return (
    <form
      action="#send"
      className="rounded-[1.4rem] bg-paper p-5 text-ink shadow-2xl ring-1 ring-ink/5 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-[-0.02em]">
          New parcel
        </h2>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-graphite">
          Draft
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="pickup" className="eyebrow block text-graphite">
            Pickup
          </label>
          <input
            id="pickup"
            name="pickup"
            type="text"
            autoComplete="street-address"
            placeholder="House 12, Road 5, Gulshan 2"
            className="mt-2 h-11 w-full rounded-xl border border-ink/12 bg-paper-2 px-3.5 text-base text-ink transition-colors placeholder:text-ink/45 focus:border-signal-deep/50 focus:bg-paper focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="dropoff" className="eyebrow block text-graphite">
            Drop-off
          </label>
          <input
            id="dropoff"
            name="dropoff"
            type="text"
            autoComplete="street-address"
            placeholder="Flat 4B, Road 11, Banani"
            className="mt-2 h-11 w-full rounded-xl border border-ink/12 bg-paper-2 px-3.5 text-base text-ink transition-colors placeholder:text-ink/45 focus:border-signal-deep/50 focus:bg-paper focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="weight" className="eyebrow block text-graphite">
              Weight (kg)
            </label>
            <input
              id="weight"
              name="weight"
              type="text"
              inputMode="decimal"
              placeholder="1.2"
              className="mt-2 h-11 w-full rounded-xl border border-ink/12 bg-paper-2 px-3.5 font-mono text-base text-ink transition-colors placeholder:text-ink/45 focus:border-signal-deep/50 focus:bg-paper focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="size" className="eyebrow block text-graphite">
              Size
            </label>
            <select
              id="size"
              name="size"
              defaultValue="Small"
              className="mt-2 h-11 w-full rounded-xl border border-ink/12 bg-paper-2 px-3 text-base text-ink transition-colors focus:border-signal-deep/50 focus:bg-paper focus:outline-none"
            >
              {SIZES.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="eyebrow block text-graphite">Service</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SERVICES.map((service) => (
              <label key={service} className="cursor-pointer">
                <input
                  type="radio"
                  name="service"
                  value={service}
                  defaultChecked={service === "Next-day"}
                  className="peer sr-only"
                />
                <span className="flex h-9 items-center rounded-full border border-ink/15 px-3.5 text-sm text-graphite transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal-deep">
                  {service}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 font-mono text-sm">
        <span className="text-graphite">Est. fare</span>
        <span className="text-ink">৳120 · 4.2 km</span>
      </div>

      <button
        type="submit"
        className="mt-4 h-12 w-full rounded-xl bg-signal text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
      >
        Add parcel
      </button>
      <p className="mt-3 text-center font-mono text-[0.66rem] uppercase tracking-[0.12em] text-graphite">
        Pickup in ~18 min · free to cancel for 2 min
      </p>
    </form>
  );
}
