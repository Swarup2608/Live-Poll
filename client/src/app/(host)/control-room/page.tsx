"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Timer } from "lucide-react";
import Sidebar, { MobileTopBar } from "@/components/Sidebar";
import Modal from "@/components/Modal";

type AgendaKind = "poll" | "qa";

type AgendaItem = {
  id: number;
  title: string;
  kind: AgendaKind;
  options?: { label: string; pct: number }[];
  timeLimit: number | null;
  voteCount?: string;
};

type Question = {
  id: number;
  text: string;
  votes: number;
  pinned: boolean;
  hidden: boolean;
};

const AGENDA: AgendaItem[] = [
  {
    id: 1,
    title: "Welcome poll: How’s everyone feeling?",
    kind: "poll",
    options: [
      { label: "Great", pct: 64 },
      { label: "Okay", pct: 28 },
      { label: "Rough day", pct: 8 },
    ],
    timeLimit: null,
    voteCount: "1,102",
  },
  {
    id: 2,
    title: "Rate this quarter’s roadmap",
    kind: "poll",
    options: [
      { label: "1–2", pct: 13 },
      { label: "3", pct: 18 },
      { label: "4–5", pct: 69 },
    ],
    timeLimit: 30,
    voteCount: "958",
  },
  {
    id: 3,
    title: "Which feature should we ship next?",
    kind: "poll",
    options: [
      { label: "Live captions", pct: 52 },
      { label: "Team spaces", pct: 31 },
      { label: "Mobile app", pct: 17 },
    ],
    timeLimit: 30,
    voteCount: "842",
  },
  { id: 4, title: "Open floor Q&A", kind: "qa", timeLimit: null },
  {
    id: 5,
    title: "What should we name the new tier?",
    kind: "poll",
    options: [
      { label: "Pro", pct: 44 },
      { label: "Plus", pct: 33 },
      { label: "Studio", pct: 23 },
    ],
    timeLimit: 60,
    voteCount: "0",
  },
  {
    id: 6,
    title: "Closing thoughts poll",
    kind: "poll",
    options: [
      { label: "Loved it", pct: 0 },
      { label: "It was fine", pct: 0 },
      { label: "Needs work", pct: 0 },
    ],
    timeLimit: 15,
    voteCount: "0",
  },
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Will this be available for hybrid events too?",
    votes: 24,
    pinned: false,
    hidden: false,
  },
  {
    id: 2,
    text: "Can we brand the projector view per room?",
    votes: 17,
    pinned: true,
    hidden: false,
  },
  {
    id: 3,
    text: "Does it support exporting to Slack automatically?",
    votes: 9,
    pinned: false,
    hidden: false,
  },
];

export default function ControlRoomPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(2);
  const [locked, setLocked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    AGENDA[2].timeLimit,
  );
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

  const current = AGENDA[activeIndex];
  const visibleQuestions = questions.filter((q) => !q.hidden);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || locked) return;
    const t = setTimeout(() => {
      setTimeRemaining((s) => (s !== null ? s - 1 : s));
    }, 1000);
    return () => clearTimeout(t);
  }, [timeRemaining, locked]);

  function goTo(index: number) {
    setActiveIndex(index);
    setTimeRemaining(AGENDA[index].timeLimit);
    setLocked(false);
    setRevealed(false);
    setPendingIndex(null);
  }

  function requestGoTo(index: number) {
    if (index === activeIndex || index < 0 || index >= AGENDA.length) return;
    const timerRunning =
      current.timeLimit !== null && (timeRemaining ?? 0) > 0 && !locked;
    if (timerRunning) {
      setPendingIndex(index);
    } else {
      goTo(index);
    }
  }

  function togglePin(id: number) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, pinned: !q.pinned } : q)),
    );
  }

  function approveQuestion(id: number) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, pinned: true } : q)),
    );
  }

  function hideQuestion(id: number) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, hidden: true } : q)),
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Sidebar
        activeHref="/control-room"
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-4 border-b border-[var(--lb-border)] bg-[var(--lb-surface)] px-4 py-4 sm:px-6 md:px-10">
          <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3.5">
              <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-[oklch(0.5_0.18_25_/_0.12)] px-3 py-1.5 text-xs font-bold text-[oklch(0.5_0.18_25)]">
                <div className="h-[7px] w-[7px] animate-pulse rounded-full bg-[oklch(0.55_0.2_25)]" />
                LIVE
              </div>
              <div>
                <div className="font-[var(--font-display)] text-lg font-bold sm:text-xl">
                  Q3 All-Hands — control room
                </div>
                <div className="mt-0.5 text-xs text-[var(--lb-text-muted)]">
                  Room code 482 991 · 1,204 connected
                </div>
              </div>
            </div>
            <a
              href="/projector"
              target="_blank"
              rel="noopener noreferrer"
              className="lb-btn-outline flex items-center gap-1.5 whitespace-nowrap px-[18px] py-2.5 text-[13px]"
            >
              Open projector view <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 items-start gap-6 px-4 py-7 sm:px-6 md:px-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-5">
            <div className="lb-surface rounded-2xl p-6">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold uppercase tracking-[0.05em] text-[var(--lb-text-muted)]">
                  Current on screen · {current.kind === "poll" ? "Poll" : "Q&A"}{" "}
                  {activeIndex + 1} of {AGENDA.length}
                </div>
                <div className="flex items-center gap-2">
                  {current.timeLimit !== null && (
                    <div className="flex items-center gap-1 rounded-full bg-[var(--lb-accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--lb-accent)]">
                      <Timer className="h-3 w-3" strokeWidth={2.5} />
                      {timeRemaining}s
                    </div>
                  )}
                  {current.kind === "poll" && (
                    <div
                      className="text-xs font-bold"
                      style={{
                        color: locked
                          ? "oklch(0.55 0.18 25)"
                          : "oklch(0.5 0.16 145)",
                      }}
                    >
                      {locked ? "Voting locked" : "Voting open"}
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-5 font-[var(--font-display)] text-xl font-bold">
                {current.title}
              </div>

              {current.kind === "poll" ? (
                <>
                  <div className="mb-6 flex flex-col gap-3">
                    {current.options!.map((o) => (
                      <div key={o.label}>
                        <div className="mb-1.5 flex justify-between text-[13px] font-semibold">
                          <div>{o.label}</div>
                          {revealed && <div>{o.pct}%</div>}
                        </div>
                        <div className="h-3.5 overflow-hidden rounded-full bg-[var(--lb-bg)]">
                          {revealed && (
                            <div
                              style={{ width: `${o.pct}%` }}
                              className="h-full rounded-full bg-[linear-gradient(90deg,var(--lb-grad1),var(--lb-grad2))] transition-[width] duration-500"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-[var(--lb-border)] pt-4">
                    <div className="text-[13px] text-[var(--lb-text-muted)]">
                      {current.voteCount} votes cast
                    </div>
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={() => setLocked((v) => !v)}
                      className={`rounded-[9px] border-[1.5px] border-[var(--lb-border)] px-[18px] py-2.5 text-[13px] font-semibold ${
                        locked
                          ? "bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]"
                          : "bg-transparent text-[var(--lb-text)]"
                      }`}
                    >
                      {locked ? "Unlock voting" : "Lock voting"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevealed((v) => !v)}
                      className="lb-btn-primary px-[18px] py-2.5 text-[13px]"
                    >
                      {revealed ? "Hide results" : "Reveal results"}
                    </button>
                    <button
                      type="button"
                      onClick={() => requestGoTo(activeIndex + 1)}
                      disabled={activeIndex >= AGENDA.length - 1}
                      className="lb-btn-outline flex items-center gap-1.5 px-[18px] py-2.5 text-[13px] disabled:opacity-40"
                    >
                      Next question <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl bg-[var(--lb-accent-soft)] p-4 text-[13px] leading-relaxed text-[var(--lb-text)]">
                    Open Q&amp;A — audience questions stream into the
                    moderation queue on the right.
                  </div>
                  <div className="flex justify-end border-t border-[var(--lb-border)] pt-4">
                    <button
                      type="button"
                      onClick={() => requestGoTo(activeIndex + 1)}
                      disabled={activeIndex >= AGENDA.length - 1}
                      className="lb-btn-outline flex items-center gap-1.5 px-[18px] py-2.5 text-[13px] disabled:opacity-40"
                    >
                      Next question <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="mb-2.5 flex items-baseline justify-between">
                <div className="font-[var(--font-display)] text-[15px] font-bold">
                  Agenda
                </div>
                <div className="text-xs text-[var(--lb-text-muted)]">
                  Click to launch
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {AGENDA.map((item, i) => {
                  const isLive = i === activeIndex;
                  const isDone = i < activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => requestGoTo(i)}
                      className={`flex items-center gap-3 rounded-xl border-[1.5px] px-3.5 py-3 text-left ${
                        isLive
                          ? "border-[var(--lb-accent)] bg-[var(--lb-accent-soft)]"
                          : "border-[var(--lb-border)] bg-[var(--lb-surface)]"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                          isLive
                            ? "bg-[var(--lb-accent)] text-white"
                            : "bg-[var(--lb-bg)] text-[var(--lb-text-muted)]"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1 text-sm font-semibold">
                        {item.title}
                      </div>
                      {isLive && (
                        <div className="text-[11px] font-bold text-[oklch(0.55_0.2_25)]">
                          LIVE
                        </div>
                      )}
                      {isDone && (
                        <div className="text-[11px] font-bold text-[var(--lb-text-muted)]">
                          Done
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="font-[var(--font-display)] text-[15px] font-bold">
                Moderation queue
              </div>
              <div className="rounded-full bg-[var(--lb-accent)] px-2.5 py-[3px] text-xs font-bold text-white">
                {visibleQuestions.length}
              </div>
            </div>

            {visibleQuestions.map((q) => (
              <div key={q.id} className="lb-surface rounded-[14px] p-4">
                <div className="mb-2.5 text-sm leading-relaxed">{q.text}</div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-full bg-[var(--lb-bg)] px-2.5 py-1 text-xs font-bold text-[var(--lb-text-muted)]">
                    ▲ {q.votes}
                  </div>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => togglePin(q.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      q.pinned
                        ? "bg-[var(--lb-accent)] text-white"
                        : "bg-[var(--lb-bg)] text-[var(--lb-text)]"
                    }`}
                  >
                    {q.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    type="button"
                    onClick={() => approveQuestion(q.id)}
                    className="rounded-lg bg-[oklch(0.5_0.15_145_/_0.15)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.4_0.15_145)]"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => hideQuestion(q.id)}
                    className="rounded-lg bg-[oklch(0.5_0.18_25_/_0.12)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.5_0.18_25)]"
                  >
                    Hide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {pendingIndex !== null && (
        <Modal onClose={() => setPendingIndex(null)}>
          <div className="mb-2 font-[var(--font-display)] text-base font-bold">
            Timer still running
          </div>
          <div className="mb-5 text-sm leading-relaxed text-[var(--lb-text-muted)]">
            This question still has {timeRemaining}s left on the clock.
            Moving on will end voting early for everyone in the room.
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setPendingIndex(null)}
              className="lb-btn-outline px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => goTo(pendingIndex)}
              className="lb-btn-primary px-4 py-2.5 text-sm"
            >
              Continue anyway
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
