"use client";

import { useState } from "react";
import { ArrowRight, Plus, Search } from "lucide-react";
import Sidebar, { MobileTopBar } from "@/components/Sidebar";

const participationBars = [55, 70, 60, 85, 76];

const upcomingEvents = [
  {
    title: "Q3 All-Hands",
    date: "Jul 18, 2026 · 10:00 AM",
    meta: "6 polls · 2 Q&A",
    badge: "LIVE SOON",
    gradientClass:
      "bg-[linear-gradient(135deg,var(--lb-grad1),var(--lb-grad2))]",
  },
  {
    title: "Product Conference 2026",
    date: "Jul 24, 2026 · 9:00 AM",
    meta: "12 polls · 1 Q&A",
    badge: null,
    gradientClass:
      "bg-[linear-gradient(135deg,var(--lb-grad2),var(--lb-grad1))]",
  },
  {
    title: "New Hire Orientation",
    date: "Aug 2, 2026 · 1:00 PM",
    meta: "3 polls · 0 Q&A",
    badge: null,
    gradientClass:
      "bg-[linear-gradient(135deg,var(--lb-accent),var(--lb-grad2))]",
  },
];

const pastEvents = [
  {
    title: "Design Systems Meetup",
    date: "Jun 30, 2026 · 214 attendees",
    gradientClass:
      "bg-[linear-gradient(135deg,var(--lb-grad1),var(--lb-grad2))]",
  },
  {
    title: "Customer Advisory Board",
    date: "Jun 12, 2026 · 48 attendees",
    gradientClass:
      "bg-[linear-gradient(135deg,var(--lb-grad2),var(--lb-accent))]",
  },
  {
    title: "Q2 Board Update",
    date: "May 28, 2026 · 32 attendees",
    gradientClass:
      "bg-[linear-gradient(135deg,var(--lb-accent),var(--lb-grad1))]",
  },
];

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Sidebar
        activeHref="/dashboard"
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-5 border-b border-[var(--lb-border)] bg-[var(--lb-surface)] px-4 py-5 sm:px-6 sm:py-7 md:px-10">
          <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-[var(--font-display)] text-xl font-bold sm:text-2xl">
                Your events
              </div>
              <div className="mt-1 text-sm text-[var(--lb-text-muted)]">
                3 upcoming · 3 past
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--lb-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search rooms…"
                  className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] py-[11px] pl-10 pr-3.5 text-sm text-[var(--lb-text)] outline-none placeholder:text-[var(--lb-text-muted)] sm:w-[200px]"
                />
              </div>
              <a
                href="#"
                className="lb-btn-primary flex items-center justify-center gap-1.5 whitespace-nowrap px-5 py-3 text-sm"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Create event
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-9 md:px-10">
          <div className="mb-5 font-[var(--font-display)] text-base font-bold">
            Overview · last 30 days
          </div>
          <div className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="lb-surface rounded-2xl p-6">
              <div className="mb-4.5 flex items-baseline justify-between">
                <div>
                  <div className="mb-1 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Votes cast
                  </div>
                  <div className="font-[var(--font-display)] text-[26px] font-bold">
                    18,420
                  </div>
                </div>
                <div className="rounded-full bg-[var(--lb-accent-soft)] px-2.5 py-1 text-xs font-bold text-[var(--lb-accent)]">
                  ▲ 12%
                </div>
              </div>
              <svg
                viewBox="0 0 280 60"
                className="h-[60px] w-full overflow-visible"
              >
                <polyline
                  points="0,44 40,38 80,42 120,28 160,32 200,16 240,20 280,6"
                  fill="none"
                  stroke="var(--lb-accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="lb-surface flex flex-col rounded-2xl p-6">
              <div className="mb-1 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Avg. participation
              </div>
              <div className="mb-4 font-[var(--font-display)] text-[26px] font-bold">
                76%
              </div>
              <div className="flex h-16 flex-1 items-end gap-2">
                {participationBars.map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`flex-1 rounded-t ${
                      i === participationBars.length - 1
                        ? "bg-[var(--lb-accent)]"
                        : "bg-[var(--lb-border)]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="lb-surface flex flex-col items-center justify-center gap-3.5 rounded-2xl p-6">
              <div className="relative h-24 w-24">
                <svg
                  viewBox="0 0 36 36"
                  className="h-full w-full -rotate-90"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="var(--lb-border)"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="var(--lb-accent)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="97.4"
                    strokeDashoffset="27"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-[var(--font-display)] text-lg font-bold">
                  72%
                </div>
              </div>
              <div className="text-center text-[13px] font-semibold text-[var(--lb-text-muted)]">
                Questions answered on air
              </div>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-[oklch(0.6_0.2_145)]" />
            <div className="font-[var(--font-display)] text-base font-bold">
              Upcoming
            </div>
          </div>
          <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.title}
                className="lb-surface flex flex-col gap-3.5 rounded-2xl p-6"
              >
                <div
                  className={`relative h-[100px] overflow-hidden rounded-xl ${event.gradientClass}`}
                >
                  {event.badge && (
                    <div className="absolute right-2.5 top-2.5 rounded-full bg-[oklch(1_0_0_/_0.2)] px-2.5 py-1 text-[11px] font-bold text-white">
                      {event.badge}
                    </div>
                  )}
                </div>
                <div>
                  <div className="mb-1 text-base font-bold">
                    {event.title}
                  </div>
                  <div className="text-[13px] text-[var(--lb-text-muted)]">
                    {event.date}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--lb-border)] pt-2.5">
                  <div className="text-xs text-[var(--lb-text-muted)]">
                    {event.meta}
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-1 text-[13px] font-semibold"
                  >
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}

            <a
              href="#"
              className="flex min-h-[190px] flex-col items-center justify-center gap-2.5 rounded-2xl border-[1.5px] border-dashed border-[var(--lb-border)] p-6 text-[var(--lb-text-muted)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]">
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div className="text-sm font-semibold">Create a new event</div>
            </a>
          </div>

          <div className="mb-5 flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-[var(--lb-text-muted)]" />
            <div className="font-[var(--font-display)] text-base font-bold">
              Past events
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {pastEvents.map((event) => (
              <div
                key={event.title}
                className="lb-surface flex flex-wrap items-center gap-5 rounded-[14px] px-5 py-4.5"
              >
                <div
                  className={`h-11 w-11 shrink-0 rounded-[10px] ${event.gradientClass}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">{event.title}</div>
                  <div className="text-[13px] text-[var(--lb-text-muted)]">
                    {event.date}
                  </div>
                </div>
                <div className="rounded-full bg-[var(--lb-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--lb-accent)]">
                  Completed
                </div>
                <a
                  href="/event-summary"
                  className="flex items-center gap-1 text-[13px] font-semibold"
                >
                  View results <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
