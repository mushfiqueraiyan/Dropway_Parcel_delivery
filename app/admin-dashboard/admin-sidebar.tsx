"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: { label: string; href?: string }[] = [
  { label: "Parcels", href: "/admin-dashboard" },
  { label: "Riders", href: "/admin-dashboard/riders" },
  { label: "Pending riders", href: "/admin-dashboard/pending-riders" },
  { label: "Payments" },
  { label: "Settings", href: "/admin-dashboard/settings" },
];

const ITEM_CLASS =
  "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-2xl border border-white/10 bg-ink p-3 text-paper md:sticky md:top-20 md:w-56 md:shrink-0 md:self-start">
      <p className="eyebrow px-3 pb-2 pt-1 text-white/45">Dashboard</p>

      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) =>
          item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className={`${ITEM_CLASS} ${
                pathname === item.href
                  ? "bg-signal font-semibold text-ink"
                  : "text-white/70 hover:bg-white/10 hover:text-paper"
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <span
              key={item.label}
              aria-disabled="true"
              className={`${ITEM_CLASS} cursor-not-allowed text-white/35`}
            >
              {item.label}
              <span className="font-mono text-[0.55rem] uppercase tracking-widest">
                soon
              </span>
            </span>
          ),
        )}
      </nav>
    </aside>
  );
}
