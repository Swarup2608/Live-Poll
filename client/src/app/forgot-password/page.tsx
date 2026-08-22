"use client";

import { useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";

const inputClass =
  "w-full rounded-[10px] border border-[var(--lb-border)] bg-[var(--lb-surface)] px-[14px] py-[13px] text-[15px] text-[var(--lb-text)] outline-none placeholder:text-[var(--lb-text-muted)] focus:border-[var(--lb-accent)]";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--lb-bg)] px-6 font-[var(--font-body)]">
      <div className="w-full max-w-[380px]">
        <h1 className="mb-2 font-[var(--font-display)] text-[26px] font-bold text-[var(--lb-text)]">
          Reset your password
        </h1>
        <p className="mb-8 text-[15px] text-[var(--lb-text-muted)]">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>

        {submitted ? (
          <p className="text-[15px] text-[var(--lb-text)]">
            If that email exists, a reset link was sent.
          </p>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-[var(--lb-text)]">
                Email
              </span>
              <input
                type="email"
                placeholder="you@company.com"
                className={inputClass}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-[10px] bg-[var(--lb-accent)] px-4 py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_20px_var(--lb-accent-soft)] transition hover:brightness-105 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-9 text-center text-[13px] text-[var(--lb-text-muted)]">
          <a href="/login" className="font-semibold text-[var(--lb-accent)]">
            Back to log in
          </a>
        </p>
      </div>
    </main>
  );
}
