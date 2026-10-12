export function TrackForm() {
  return (
    <div className="mt-8">
      <form role="search" action="#track">
        <label htmlFor="tracking" className="eyebrow block text-white/55">
          Track a parcel
        </label>
        <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 transition-colors focus-within:border-signal/50 sm:flex-row sm:items-center">
          <input
            id="tracking"
            name="tracking"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="Tracking number or order ID"
            className="h-11 w-full rounded-xl bg-transparent px-3.5 font-mono text-base tracking-wide text-paper placeholder:text-white/50 focus:outline-none"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-signal px-6 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
          >
            Track
          </button>
        </div>
      </form>

      <p className="mt-3 font-mono text-xs text-white/55">
        Try{" "}
        <span className="text-signal underline decoration-signal/40 underline-offset-4">
          DP-1042
        </span>{" "}
        · updates with every scan
      </p>
    </div>
  );
}
