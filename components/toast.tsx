"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return context;
}

const VARIANT_ACCENT: Record<ToastVariant, string> = {
  success: "bg-go/15 text-go-deep",
  error: "bg-alert/15 text-alert",
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  return (
    <span
      className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${VARIANT_ACCENT[variant]}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {variant === "success" ? (
          <path d="M3 8.5l3.5 3.5L13 5" />
        ) : (
          <path d="M4 4l8 8M12 4l-8 8" />
        )}
      </svg>
    </span>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, message, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2.5 sm:inset-x-auto sm:right-5 sm:items-end">
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-ink/10 bg-paper px-4 py-3 text-ink shadow-xl ring-1 ring-ink/5"
          >
            <ToastIcon variant={item.variant} />
            <p className="flex-1 text-sm leading-6">{item.message}</p>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-md p-1 text-graphite transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
