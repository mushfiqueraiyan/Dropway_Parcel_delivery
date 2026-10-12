'use client'
import { AuthShell } from '@/components/auth-shell';
import { TextField } from '@/components/text-field';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError("");

    const { error: authError } = await authClient.signUp.email({
      name,
      email,
      password,
    })

    if (authError) {
      setError(authError.message || "Could not create your account");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Book a pickup in under a minute and track every parcel to the door."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-ink underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <TextField
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Alex Rivera"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          hint="At least 8 characters."
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  )
}

export default RegisterPage
