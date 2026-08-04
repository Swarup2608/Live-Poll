"use client";

import { useState } from "react";
import Link from "next/link";
import { AudienceTabBar, AudienceTopBar } from "@/components/AudienceNav";

type Question = { id: number; text: string; votes: number; voted: boolean };

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Can we brand the projector view per room?",
    votes: 24,
    voted: false,
  },
  {
    id: 2,
    text: "Will this be available for hybrid events too?",
    votes: 17,
    voted: false,
  },
  {
    id: 3,
    text: "Does it support exporting to Slack automatically?",
    votes: 9,
    voted: false,
  },
];

export default function BrowseQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  function upvote(id: number) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id && !q.voted ? { ...q, votes: q.votes + 1, voted: true } : q,
      ),
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--lb-surface)] font-[var(--font-body)]">
      <AudienceTopBar title="Q3 All-Hands" />
      <main className="flex flex-1 flex-col px-5 py-6">
        <div className="mb-4 font-[var(--font-display)] text-lg font-bold text-[var(--lb-text)]">
          Questions
        </div>
        <div className="flex flex-col gap-2.5 overflow-y-auto">
          {questions.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => upvote(q.id)}
              disabled={q.voted}
              className="flex items-center gap-3 rounded-xl bg-[var(--lb-bg)] p-3.5 text-left"
            >
              <div className="flex-1 text-[13px] leading-snug text-[var(--lb-text)]">
                &quot;{q.text}&quot;
              </div>
              <div className="flex shrink-0 flex-col items-center gap-0.5">
                <div
                  className={`text-sm font-bold ${
                    q.voted
                      ? "text-[var(--lb-accent)]"
                      : "text-[var(--lb-text-muted)]"
                  }`}
                >
                  ▲
                </div>
                <div className="text-xs font-bold text-[var(--lb-text)]">
                  {q.votes}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Link
          href="/join/ask"
          className="mt-4 rounded-xl border-[1.5px] border-[var(--lb-border)] py-3 text-center text-[13px] font-bold text-[var(--lb-accent)]"
        >
          + Ask your own question
        </Link>
      </main>
      <AudienceTabBar />
    </div>
  );
}
