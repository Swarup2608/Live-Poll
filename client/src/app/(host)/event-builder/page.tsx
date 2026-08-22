"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Lightbulb,
  Plus,
  X,
} from "lucide-react";
import Sidebar, { MobileTopBar } from "@/components/Sidebar";
import { useDragReorder } from "@/lib/useDragReorder";

type ItemType = "poll" | "qa";

type AgendaItem = {
  id: number;
  type: ItemType;
  title: string;
  subtitle: string;
};

const INITIAL_ITEMS: AgendaItem[] = [
  {
    id: 1,
    type: "poll",
    title: "Which feature should we ship next?",
    subtitle: "Multiple choice · 3 options",
  },
  {
    id: 2,
    type: "qa",
    title: "Open floor Q&A",
    subtitle: "Moderated · unlimited questions",
  },
  {
    id: 3,
    type: "poll",
    title: "Rate this quarter’s roadmap",
    subtitle: "Rating · 1–5 scale",
  },
  {
    id: 4,
    type: "poll",
    title: "What should we name the new tier?",
    subtitle: "Open text · anonymous",
  },
];

let idCounter = 100;

const TYPE_STYLE: Record<
  ItemType,
  {
    badge: string;
    badgeColor: string;
    badgeBg: string;
    iconBg: string;
    iconColor: string;
    iconRadius: string;
  }
> = {
  poll: {
    badge: "Poll",
    badgeColor: "oklch(0.45 0.19 275)",
    badgeBg: "oklch(0.94 0.04 275)",
    iconBg: "oklch(0.94 0.05 275)",
    iconColor: "oklch(0.45 0.19 275)",
    iconRadius: "4px",
  },
  qa: {
    badge: "Q&A",
    badgeColor: "oklch(0.55 0.19 320)",
    badgeBg: "oklch(0.95 0.05 320)",
    iconBg: "oklch(0.94 0.06 320)",
    iconColor: "oklch(0.55 0.19 320)",
    iconRadius: "50%",
  },
};

export default function EventBuilderPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState<AgendaItem[]>(INITIAL_ITEMS);
  const { draggedId, onPointerDown, onPointerMove, onPointerUp } =
    useDragReorder<AgendaItem>(setItems);

  function moveItem(id: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const i = next.findIndex((it) => it.id === id);
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function addItem(type: ItemType) {
    idCounter += 1;
    const base =
      type === "poll"
        ? { title: "New poll", subtitle: "Multiple choice · edit to configure" }
        : { title: "New Q&A session", subtitle: "Moderated · edit to configure" };
    setItems((prev) => [...prev, { id: idCounter, type, ...base }]);
  }

  const estimatedMinutes = Math.round(
    items.reduce((sum, it) => sum + (it.type === "poll" ? 1.5 : 5), 0),
  );

  return (
    <div className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Sidebar
        activeHref="/event-builder"
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-5 border-b border-[var(--lb-border)] bg-[var(--lb-surface)] px-4 py-5 sm:px-6 sm:py-7 md:px-10">
          <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />

          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <a
                href="/dashboard"
                className="flex items-center gap-1 text-[13px] font-semibold text-[var(--lb-text-muted)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
              </a>
              <div className="mt-1.5 font-[var(--font-display)] text-xl font-bold sm:text-2xl">
                Q3 All-Hands — event builder
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="lb-btn-outline px-5 py-[11px] text-sm">
                Preview
              </a>
              <a
                href="/control-room"
                className="lb-btn-primary flex items-center gap-1.5 whitespace-nowrap px-[22px] py-3 text-sm"
              >
                Go to control room <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-1 items-start gap-8 px-4 py-9 sm:px-6 md:px-10 lg:grid-cols-[1fr_320px]">
          <div className="max-w-[760px]">
            <div className="mb-1.5 flex items-baseline justify-between">
              <div className="font-[var(--font-display)] text-lg font-bold">
                Agenda
              </div>
              <div className="text-[13px] text-[var(--lb-text-muted)]">
                {items.length} items
              </div>
            </div>
            <div className="mb-6 text-sm text-[var(--lb-text-muted)]">
              Drag to reorder — this is the order the room will see them.
            </div>

            <div className="mb-6 flex flex-col gap-2.5">
              {items.map((item, i) => {
                const style = TYPE_STYLE[item.type];
                return (
                  <div
                    key={item.id}
                    data-drag-row={item.id}
                    className={`lb-surface flex flex-wrap items-center gap-3.5 rounded-[14px] px-4.5 py-4 transition-opacity ${
                      draggedId === item.id ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <span
                      onPointerDown={(e) => onPointerDown(e, item.id)}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      className="flex h-4 w-4 shrink-0 cursor-grab touch-none active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4 text-[var(--lb-border)]" />
                    </span>
                    <div
                      style={{ background: style.iconBg }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                    >
                      <div
                        style={{
                          background: style.iconColor,
                          borderRadius: style.iconRadius,
                        }}
                        className="h-3.5 w-3.5"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-bold">
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-xs text-[var(--lb-text-muted)]">
                        {item.subtitle}
                      </div>
                    </div>
                    <div
                      style={{
                        color: style.badgeColor,
                        background: style.badgeBg,
                      }}
                      className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    >
                      {style.badge}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, -1)}
                        disabled={i === 0}
                        className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] text-[var(--lb-text-muted)] disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(item.id, 1)}
                        disabled={i === items.length - 1}
                        className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] text-[var(--lb-text-muted)] disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <a
                      href={item.type === "poll" ? "/poll-editor" : "#"}
                      className="text-[13px] font-semibold"
                    >
                      Edit
                    </a>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="px-1 text-[var(--lb-text-muted)]"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => addItem("poll")}
                className="flex flex-1 items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-[var(--lb-border)] p-[18px] text-sm font-semibold text-[var(--lb-text-muted)]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]">
                  <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                Add poll
              </button>
              <button
                type="button"
                onClick={() => addItem("qa")}
                className="flex flex-1 items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-[var(--lb-border)] p-[18px] text-sm font-semibold text-[var(--lb-text-muted)]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]">
                  <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                Add Q&amp;A session
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="lb-surface rounded-2xl p-[22px]">
              <div className="mb-4 font-[var(--font-display)] text-[15px] font-bold">
                Event details
              </div>
              <div className="flex flex-col gap-3 text-[13px]">
                <div className="flex justify-between">
                  <div className="text-[var(--lb-text-muted)]">Date</div>
                  <div className="font-semibold">Jul 18, 2026</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-[var(--lb-text-muted)]">Time</div>
                  <div className="font-semibold">10:00 AM</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-[var(--lb-text-muted)]">Format</div>
                  <div className="font-semibold">In-person</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-[var(--lb-text-muted)]">
                    Room code
                  </div>
                  <div className="font-semibold">482 991</div>
                </div>
              </div>
              <div className="mt-[18px] flex gap-2">
                <a
                  href="/create-event"
                  className="flex-1 rounded-[9px] border-[1.5px] border-[var(--lb-border)] p-2.5 text-center text-[13px] font-semibold"
                >
                  Edit details
                </a>
                <a
                  href="/room-settings"
                  className="flex-1 rounded-[9px] border-[1.5px] border-[var(--lb-border)] p-2.5 text-center text-[13px] font-semibold"
                >
                  Room settings
                </a>
              </div>
            </div>

            <div className="lb-surface rounded-2xl p-[22px]">
              <div className="mb-3.5 font-[var(--font-display)] text-[15px] font-bold">
                Estimated runtime
              </div>
              <div className="mb-2.5 flex items-baseline gap-1.5">
                <div className="font-[var(--font-display)] text-[26px] font-bold">
                  {estimatedMinutes}
                </div>
                <div className="text-[13px] text-[var(--lb-text-muted)]">
                  min
                </div>
              </div>
              <div className="text-xs leading-relaxed text-[var(--lb-text-muted)]">
                Based on ~90 seconds per poll and 5 minutes per open Q&amp;A
                session.
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--lb-accent-soft)] p-5">
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-[var(--lb-accent)]">
                <Lightbulb className="h-3.5 w-3.5" strokeWidth={2.25} /> Tip
              </div>
              <div className="text-[13px] leading-relaxed text-[var(--lb-text)]">
                Open with a low-stakes poll to warm up the room before the
                first Q&amp;A.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
