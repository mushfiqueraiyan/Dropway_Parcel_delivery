'use client'
import { AuthShell } from '@/components/auth-shell';
import { TextField } from '@/components/text-field';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@admin.com", password: "12345678" },
  { role: "Rider", email: "rider@rider.com", password: "12345678" },
];

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("");

    const { error: authError } = await authClient.signIn.email({
      email,
      password
    })

    if (authError) {
      setError(authError.message || "Invalid credentials");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setFilled(account.role);
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to book pickups, manage orders, and track every parcel."
      footer={
        <>
          New to Dropway?{" "}
          <Link
            href="/register"
            className="font-semibold text-ink underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <div className="mb-6">
        <span className="eyebrow block text-graphite">Quick fill</span>
        <div
          role="group"
          aria-label="Fill demo account"
          className="mt-2 flex gap-1 rounded-xl border border-ink/12 bg-paper-2 p-1"
        >
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.role}
              type="button"
              aria-pressed={filled === account.role}
              onClick={() => fillDemo(account)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm transition-colors ${
                filled === account.role
                  ? "bg-paper font-semibold text-ink shadow-sm"
                  : "text-graphite hover:text-ink"
              }`}
            >
              {account.role}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFilled(null);
          }}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFilled(null);
          }}
        />

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-alert/30 bg-alert/10 px-3.5 py-2.5 text-sm text-alert"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-signal text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  )
}

export default LoginPage
