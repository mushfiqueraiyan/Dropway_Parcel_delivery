export function Logo({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid size-7 place-items-center rounded-[7px] bg-signal text-ink">
        <svg
          width="15"
          height="15"
          viewBox="0 0 16 16"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M8 1.9 13.7 5v6L8 14.1 2.3 11V5z" />
          <path d="M2.3 5 8 8.1 13.7 5M8 8.1v6" />
        </svg>
      </span>
      <span
        className={`font-display text-[1.08rem] font-extrabold tracking-[-0.025em] ${
          tone === "dark" ? "text-ink" : "text-paper"
        }`}
      >
        Dropway
      </span>
    </span>
  );
}
