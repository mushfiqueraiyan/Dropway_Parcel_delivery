"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



import { Logo } from "@/components/logo";
import { authClient } from "@/lib/auth-client";

const LINKS = [
 
  { href: "/add-parcel", label: "Add Parcel" },
  { href: "/become-rider", label: "Become a rider" },
  { href: "/track", label: "Track Parcel" },
];

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4.2 16.5a5.8 5.8 0 0 1 11.6 0" />
    </svg>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const admin = session?.user.role === 'admin'
  const role = session?.user.role === 'rider'
  

  const handleLogout = async () => {
    await authClient.signOut();
    setOpen(false);
    router.refresh();
    router.push("/");
  };

  return (
    <header
      data-dark
      className="sticky top-0 z-50 border-b border-white/10 bg-ink/85 text-paper backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="/"
          className="rounded-md transition-opacity hover:opacity-85"
          aria-label="Dropway home"
        >
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/65 transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="/track"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-paper"
          >
            Track
          </a>

          {admin ? (
            <Link
              href="/admin-dashboard"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-paper"
            >
              Dashboard
            </Link>
          ) : role ? (
            <Link
              href="/rider-dashboard"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-paper"
            >
              Rider Hub
            </Link>
          ) : null}

          {!isPending && !user ? (
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-paper"
            >
              Log in
            </Link>
          ) : null}

          <a
            href="#send"
            className="rounded-full bg-signal px-4 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0"
          >
            Send a parcel
          </a>

          {user ? (
            <>
              <div className="group relative">
                <button
                  type="button"
                  aria-describedby="user-tooltip"
                  aria-label={`Signed in as ${user.name}`}
                  className="grid size-9 place-items-center rounded-full border border-white/15 text-paper transition-colors hover:bg-white/10 focus-visible:bg-white/10"
                >
                  <UserIcon />
                </button>
                <div
                  id="user-tooltip"
                  role="tooltip"
                  className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-xl border border-white/12 bg-ink-soft p-3 opacity-0 shadow-2xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  <p className="truncate text-sm font-semibold text-paper">
                    {user.name}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs text-white/60">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-paper"
              >
                Log out
              </button>
            </>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-lg border border-white/15 text-paper md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            {open ? (
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-white/10 bg-ink md:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col px-5 py-3 sm:px-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/8 py-3.5 text-[0.95rem] text-white/80"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#send"
            onClick={() => setOpen(false)}
            className="mt-4 rounded-full bg-signal px-4 py-3 text-center text-sm font-semibold text-ink"
          >
            Send a parcel
          </a>
          <a
            href="#track"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold text-paper"
          >
            Track a parcel
          </a>

          {admin ? (
            <Link
              href="/admin-dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold text-paper"
            >
              Dashboard
            </Link>
          ) : role ? (
            <Link
              href="/rider-dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold text-paper"
            >
              Rider Hub
            </Link>
          ) : null}

          {user ? (
            <>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/12 bg-white/5 px-3.5 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-paper">
                  <UserIcon />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-paper">
                    {user.name}
                  </span>
                  <span className="block truncate font-mono text-xs text-white/60">
                    {user.email}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 mb-2 rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold text-paper"
              >
                Log out
              </button>
            </>
          ) : !isPending ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 mb-2 rounded-full border border-white/20 px-4 py-3 text-center text-sm font-semibold text-paper"
            >
              Log in
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
