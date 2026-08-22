"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { apiFetch } from "@/lib/api";

const inputClass =
  "w-full rounded-[10px] border border-[var(--lb-border)] bg-[var(--lb-surface)] px-[14px] py-[13px] text-[15px] text-[var(--lb-text)] outline-none placeholder:text-[var(--lb-text-muted)] focus:border-[var(--lb-accent)]";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "That reset link is invalid or has expired.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-[15px] text-[var(--lb-text)]">
        This reset link is missing a token. Request a new one from{" "}
        <a
          href="/forgot-password"
          className="font-semibold text-[var(--lb-accent)]"
        >
          the forgot password page
        </a>
        .
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-semibold text-[var(--lb-text)]">
          New password
        </span>
        <input
          type="password"
          placeholder="••••••••"
          className={inputClass}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          minLength={8}
          required
        />
      </label>

      {error && (
        <p className="text-[13px] font-semibold text-red-500">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-[10px] bg-[var(--lb-accent)] px-4 py-[14px] text-[15px] font-semibold text-white shadow-[0_8px_20px_var(--lb-accent-soft)] transition hover:brightness-105 disabled:opacity-60"
      >
        {loading ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--lb-bg)] px-6 font-[var(--font-body)]">
      <div className="w-full max-w-[380px]">
        <h1 className="mb-2 font-[var(--font-display)] text-[26px] font-bold text-[var(--lb-text)]">
          Set a new password
        </h1>
        <p className="mb-8 text-[15px] text-[var(--lb-text-muted)]">
          Choose a new password for your account.
        </p>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
