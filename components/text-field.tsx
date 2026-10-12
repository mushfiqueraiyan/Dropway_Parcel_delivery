import type { ComponentProps } from "react";

export function TextField({
  id,
  label,
  hint,
  ...props
}: { id: string; label: string; hint?: string } & ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block text-graphite">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="mt-2 h-11 w-full rounded-xl border border-ink/12 bg-paper-2 px-3.5 text-base text-ink transition-colors placeholder:text-ink/45 focus:border-signal-deep/50 focus:bg-paper focus:outline-none"
      />
      {hint ? <p className="mt-2 text-xs text-graphite">{hint}</p> : null}
    </div>
  );
}
