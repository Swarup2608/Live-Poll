"use client";

import { useState } from "react";
import {
  ArrowLeft,
  GripVertical,
  List,
  PenLine,
  Plus,
  Star,
  Timer,
  X,
} from "lucide-react";
import Sidebar, { MobileTopBar } from "@/components/Sidebar";
import Toggle from "@/components/Toggle";
import { useDragReorder } from "@/lib/useDragReorder";

type PollType = "mc" | "rating" | "open";
type TimeLimit = "none" | "15" | "30" | "60";

type Option = { id: number; text: string };

const POLL_TYPES: { key: PollType; label: string; icon: typeof List }[] = [
  { key: "mc", label: "Multiple choice", icon: List },
  { key: "rating", label: "Rating", icon: Star },
  { key: "open", label: "Open text", icon: PenLine },
];

let optionId = 10;

export default function PollEditorPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [type, setType] = useState<PollType>("mc");
  const [question, setQuestion] = useState(
    "Which feature should we ship next?",
  );
  const [options, setOptions] = useState<Option[]>([
    { id: 1, text: "Live captions" },
    { id: 2, text: "Team spaces" },
    { id: 3, text: "Mobile app" },
  ]);
  const [ratingScale, setRatingScale] = useState<5 | 10>(5);
  const [allowChange, setAllowChange] = useState(true);
  const [liveResults, setLiveResults] = useState(true);
  const [multiSelect, setMultiSelect] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [timeLimit, setTimeLimit] = useState<TimeLimit>("none");
  const { draggedId, onPointerDown, onPointerMove, onPointerUp } =
    useDragReorder<Option>(setOptions);

  const isMC = type === "mc";
  const isRating = type === "rating";
  const isOpen = type === "open";

  function setOptionText(id: number, text: string) {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  }

  function removeOption(id: number) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  }

  function addOption() {
    optionId += 1;
    setOptions((prev) => [...prev, { id: optionId, text: "" }]);
  }

  return (
    <div className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Sidebar
        activeHref="/poll-editor"
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-5 border-b border-[var(--lb-border)] bg-[var(--lb-surface)] px-4 py-5 sm:px-6 sm:py-7 md:px-10">
          <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />

          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <a
                href="/event-builder"
                className="flex items-center gap-1 text-[13px] font-semibold text-[var(--lb-text-muted)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to agenda
              </a>
              <div className="mt-1.5 font-[var(--font-display)] text-xl font-bold sm:text-2xl">
                Edit poll
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/event-builder" className="lb-btn-outline px-5 py-[11px] text-sm">
                Cancel
              </a>
              <a
                href="/event-builder"
                className="lb-btn-primary whitespace-nowrap px-[22px] py-3 text-sm"
              >
                Save poll
              </a>
            </div>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 items-start gap-8 px-4 py-9 sm:px-6 md:px-10 lg:grid-cols-[1fr_380px]">
          <div className="flex max-w-[640px] flex-col gap-6">
            <div>
              <div className="mb-2.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Poll type
              </div>
              <div className="flex gap-2.5">
                {POLL_TYPES.map(({ key, label, icon: Icon }) => {
                  const active = type === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      className={`flex-1 rounded-xl border-[1.5px] px-2.5 py-3.5 text-center text-[13px] font-semibold ${
                        active
                          ? "border-[var(--lb-accent)] bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]"
                          : "border-[var(--lb-border)] bg-[var(--lb-surface)] text-[var(--lb-text-muted)]"
                      }`}
                    >
                      <Icon className="mx-auto mb-1.5 h-[18px] w-[18px]" strokeWidth={2} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Question
              </div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you want to ask the room?"
                rows={2}
                className="w-full resize-y rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-surface)] p-3.5 text-base text-[var(--lb-text)] outline-none placeholder:text-[var(--lb-text-muted)] focus:border-[var(--lb-accent)]"
              />
            </label>

            {isMC && (
              <div>
                <div className="mb-2.5 flex items-baseline justify-between">
                  <div className="text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Options
                  </div>
                  <div className="text-xs text-[var(--lb-text-muted)]">
                    {options.length}/8
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {options.map((opt) => (
                    <div
                      key={opt.id}
                      data-drag-row={opt.id}
                      className={`flex items-center gap-2.5 transition-opacity ${
                        draggedId === opt.id ? "opacity-40" : "opacity-100"
                      }`}
                    >
                      <span
                        onPointerDown={(e) => onPointerDown(e, opt.id)}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        className="flex h-4 w-4 shrink-0 cursor-grab touch-none active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4 text-[var(--lb-border)]" />
                      </span>
                      <div className="h-[22px] w-[22px] shrink-0 rounded-[6px] border-[1.5px] border-[var(--lb-border)]" />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => setOptionText(opt.id, e.target.value)}
                        placeholder="Option text"
                        className="flex-1 rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-surface)] px-3.5 py-3 text-sm text-[var(--lb-text)] outline-none placeholder:text-[var(--lb-text-muted)] focus:border-[var(--lb-accent)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(opt.id)}
                        className="px-1 text-[var(--lb-text-muted)]"
                        aria-label="Remove option"
                      >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  disabled={options.length >= 8}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--lb-accent)] disabled:opacity-40"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Add
                  option
                </button>
                <div className="mt-4 flex items-center gap-2.5">
                  <Toggle
                    checked={multiSelect}
                    onChange={() => setMultiSelect((v) => !v)}
                    label="Allow selecting multiple options"
                  />
                  <div className="text-sm">
                    Allow selecting multiple options
                  </div>
                </div>
              </div>
            )}

            {isRating && (
              <div>
                <div className="mb-2.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                  Scale
                </div>
                <div className="flex gap-2.5">
                  {[5, 10].map((n) => {
                    const active = ratingScale === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRatingScale(n as 5 | 10)}
                        className={`flex-1 rounded-[10px] border-[1.5px] p-3 text-[13px] font-semibold ${
                          active
                            ? "border-[var(--lb-accent)] bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]"
                            : "border-[var(--lb-border)] bg-[var(--lb-surface)] text-[var(--lb-text-muted)]"
                        }`}
                      >
                        1–{n}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {isOpen && (
              <div className="rounded-xl bg-[var(--lb-accent-soft)] p-4 text-[13px] leading-relaxed text-[var(--lb-text)]">
                Open text responses stream in live and can be pinned or
                hidden from the control room, just like Q&amp;A.
              </div>
            )}

            <div>
              <div className="mb-2.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Settings
              </div>
              <div className="lb-surface overflow-hidden rounded-[14px]">
                <div className="flex items-center justify-between border-b border-[var(--lb-border)] px-4 py-3.5">
                  <div className="text-sm">
                    Allow vote changes before lock
                  </div>
                  <Toggle
                    checked={allowChange}
                    onChange={() => setAllowChange((v) => !v)}
                    label="Allow vote changes before lock"
                  />
                </div>
                <div className="flex items-center justify-between border-b border-[var(--lb-border)] px-4 py-3.5">
                  <div className="text-sm">
                    Show results live as votes come in
                  </div>
                  <Toggle
                    checked={liveResults}
                    onChange={() => setLiveResults((v) => !v)}
                    label="Show results live as votes come in"
                  />
                </div>
                <div className="flex items-center justify-between border-b border-[var(--lb-border)] px-4 py-3.5">
                  <div className="text-sm">Anonymous responses</div>
                  <Toggle
                    checked={anonymous}
                    onChange={() => setAnonymous((v) => !v)}
                    label="Anonymous responses"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <div className="text-sm">Time limit</div>
                  <select
                    value={timeLimit}
                    onChange={(e) =>
                      setTimeLimit(e.target.value as TimeLimit)
                    }
                    className="rounded-lg border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] px-2.5 py-2 text-[13px] text-[var(--lb-text)] outline-none"
                  >
                    <option value="none">No limit</option>
                    <option value="15">15 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--lb-text-muted)]">
              Audience preview
            </div>
            <div className="rounded-[24px] bg-[oklch(0.2_0.03_275)] p-5 shadow-[0_30px_60px_oklch(0.2_0.03_275_/_0.3)]">
              <div className="flex min-h-[280px] flex-col rounded-2xl bg-white p-6">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[oklch(0.5_0.02_275)]">
                    Live poll
                  </div>
                  {timeLimit !== "none" && (
                    <div className="flex items-center gap-1 rounded-full bg-[var(--lb-accent-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lb-accent)]">
                      <Timer className="h-3 w-3" strokeWidth={2.5} />
                      {timeLimit}s
                    </div>
                  )}
                </div>
                <div className="mb-5 font-[var(--font-display)] text-[17px] font-bold leading-snug text-[oklch(0.18_0.02_275)]">
                  {question || "What do you want to ask the room?"}
                </div>

                {isMC && (
                  <div className="flex flex-col gap-2.5">
                    {options.map((opt) => (
                      <div
                        key={opt.id}
                        className="rounded-[10px] border-[1.5px] border-[oklch(0.9_0.01_275)] px-3.5 py-3 text-sm font-semibold text-[oklch(0.3_0.02_275)]"
                      >
                        {opt.text || "Option text"}
                      </div>
                    ))}
                  </div>
                )}

                {isRating && (
                  <div className="mt-2 flex justify-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-[26px] w-[26px] text-[oklch(0.85_0.01_275)]"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                )}

                {isOpen && (
                  <div className="flex-1 rounded-[10px] border-[1.5px] border-[oklch(0.9_0.01_275)] p-3.5 text-sm text-[oklch(0.55_0.02_275)]">
                    Type your answer…
                  </div>
                )}

                <div className="flex-1" />
                <div className="mt-4 rounded-[10px] bg-[var(--lb-accent)] py-3 text-center text-sm font-bold text-white">
                  Submit
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
