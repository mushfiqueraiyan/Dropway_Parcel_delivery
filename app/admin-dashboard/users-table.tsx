"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/toast";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const ROLE_STYLE: Record<string, string> = {
  admin: "border-signal/40 bg-signal/15 text-signal-deep",
  rider: "border-go/40 bg-go/15 text-go-deep",
  user: "border-ink/15 bg-paper text-graphite",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-widest ${
        ROLE_STYLE[role] ?? "border-ink/15 bg-paper text-graphite"
      }`}
    >
      {role}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function UsersTableSkeleton() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper p-5 shadow-sm">
      <div className="h-7 w-40 animate-pulse rounded bg-ink/10" />
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-12 animate-pulse rounded-lg bg-ink/5" />
        ))}
      </div>
    </div>
  );
}

export default function UsersTable({
  users,
  currentUserId,
}: {
  users: UserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function makeAdmin(user: UserRow) {
    setBusyId(user.id);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast(result.message ?? "Could not update the user.", "error");
        return;
      }

      toast(`${user.name} is now an admin.`);
      router.refresh();
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteUser(user: UserRow) {
    const confirmed = window.confirm(
      `Delete ${user.name}? Their riders and parcels will be removed too.`,
    );

    if (!confirmed) {
      return;
    }

    setBusyId(user.id);
    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast(result.message ?? "Could not delete the user.", "error");
        return;
      }

      toast(`${user.name} deleted.`);
      router.refresh();
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="eyebrow text-signal-deep">Admin</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">
            Users
          </h1>
        </div>
        <span className="rounded-full border border-ink/12 bg-paper-2 px-3 py-1 font-mono text-xs text-ink">
          {users.length} total
        </span>
      </div>

      {users.length === 0 ? (
        <p className="border-t border-ink/10 p-10 text-center text-sm text-graphite">
          No users yet.
        </p>
      ) : (
        <div className="overflow-x-auto border-t border-ink/10">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-graphite">
                {["User", "Role", "Joined"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="eyebrow px-5 py-3 font-normal"
                  >
                    {heading}
                  </th>
                ))}
                <th scope="col" className="eyebrow px-5 py-3 text-right font-normal">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUserId;
                const isAdmin = user.role === "admin";
                const busy = busyId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="border-t border-ink/8 align-middle hover:bg-paper-2/50"
                  >
                    <td className="px-5 py-4">
                      <span className="block font-medium text-ink">
                        {user.name}
                        {isSelf ? (
                          <span className="ml-2 font-mono text-[0.6rem] uppercase tracking-widest text-graphite">
                            you
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-graphite">
                        {user.email}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-5 py-4 text-xs text-graphite">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => makeAdmin(user)}
                          disabled={isAdmin || busy}
                          className="rounded-lg border border-ink/15 bg-paper px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-signal-deep/40 hover:bg-signal/15 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Make admin
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteUser(user)}
                          disabled={isSelf || busy}
                          className="rounded-lg border border-alert/30 bg-alert/10 px-3.5 py-1.5 text-xs font-semibold text-alert transition-colors hover:bg-alert/20 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
