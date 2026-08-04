"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AudienceTabBar, AudienceTopBar } from "@/components/AudienceNav";

const OPTIONS = ["Live captions", "Team spaces", "Mobile app"];

export default function LivePollPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--lb-surface)] font-[var(--font-body)]">
      <AudienceTopBar title="Q3 All-Hands" />
      <main className="flex flex-1 flex-col px-6 py-7">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--lb-text-muted)]">
          Live poll · 3 of 6
        </div>
        <div className="mb-6 font-[var(--font-display)] text-xl font-bold leading-snug text-[var(--lb-text)]">
          Which feature should we ship next?
        </div>
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt) => {
            const active = selected === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSelected(opt)}
                className={`rounded-xl border-2 px-4 py-4 text-left text-[15px] font-semibold ${
                  active
                    ? "border-[var(--lb-accent)] bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]"
                    : "border-[var(--lb-border)] text-[var(--lb-text)]"
                }`}
              >
                {opt} {active && "✓"}
              </button>
            );
          })}
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => router.push("/join/results")}
          disabled={!selected}
          className="mt-6 rounded-xl bg-[var(--lb-accent)] py-3.5 text-center text-sm font-bold text-white disabled:opacity-40"
        >
          Submit vote
        </button>
      </main>
      <AudienceTabBar />
    </div>
  );
}
