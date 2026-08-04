"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AudienceTabBar, AudienceTopBar } from "@/components/AudienceNav";

export default function AskQuestionPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  function handleSubmit() {
    if (!question.trim()) return;
    router.push("/join/questions");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--lb-surface)] font-[var(--font-body)]">
      <AudienceTopBar title="Q3 All-Hands" />
      <main className="flex flex-1 flex-col px-6 py-7">
        <div className="mb-5 font-[var(--font-display)] text-xl font-bold text-[var(--lb-text)]">
          Ask the room
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do you want to ask?"
          className="min-h-[160px] flex-1 resize-none rounded-xl border-[1.5px] border-[var(--lb-border)] p-4 text-[15px] text-[var(--lb-text)] outline-none focus:border-[var(--lb-accent)]"
        />
        <button
          type="button"
          onClick={() => setAnonymous((v) => !v)}
          className="mt-4 flex items-center gap-2.5"
        >
          <span
            className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
              anonymous ? "bg-[var(--lb-accent)]" : "bg-[var(--lb-border)]"
            }`}
          >
            <span
              className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition-[left] ${
                anonymous ? "left-[19px]" : "left-[3px]"
              }`}
            />
          </span>
          <span className="text-[13px] text-[var(--lb-text-muted)]">
            Ask anonymously
          </span>
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!question.trim()}
          className="mt-5 rounded-xl bg-[var(--lb-accent)] py-3.5 text-center text-sm font-bold text-white disabled:opacity-40"
        >
          Submit question
        </button>
      </main>
      <AudienceTabBar />
    </div>
  );
}
