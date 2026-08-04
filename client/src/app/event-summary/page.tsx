"use client";

import { useState } from "react";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Sidebar, { MobileTopBar } from "@/components/Sidebar";

const STATS = [
  { label: "Attendees", value: "214" },
  { label: "Votes cast", value: "1,842" },
  { label: "Questions asked", value: "63" },
  { label: "Avg. participation", value: "86%" },
];

const MC_OPTIONS = [
  { label: "Live captions", pct: 52 },
  { label: "Team spaces", pct: 31 },
  { label: "Mobile app", pct: 17 },
];

const RATING_BARS = [
  { score: 1, pct: 4, heightPx: 6, highlight: false },
  { score: 2, pct: 9, heightPx: 14, highlight: false },
  { score: 3, pct: 18, heightPx: 30, highlight: false },
  { score: 4, pct: 38, heightPx: 60, highlight: true },
  { score: 5, pct: 31, heightPx: 50, highlight: true },
];

const TOP_QUESTIONS = [
  { text: "Can we brand the projector view per room?", votes: 24 },
  { text: "Will this be available for hybrid events too?", votes: 17 },
  { text: "Does it support exporting to Slack automatically?", votes: 9 },
];

function buildSummaryCsv(): string {
  const lines: string[] = [];
  lines.push("Design Systems Meetup — summary");
  lines.push("");
  lines.push("Metric,Value");
  STATS.forEach((s) => lines.push(`${s.label},${s.value}`));
  lines.push("");
  lines.push("Which feature should we ship next?");
  lines.push("Option,Percent");
  MC_OPTIONS.forEach((o) => lines.push(`${o.label},${o.pct}%`));
  lines.push("");
  lines.push("Rate this quarter's roadmap (1-5)");
  lines.push("Score,Percent");
  RATING_BARS.forEach((b) => lines.push(`${b.score},${b.pct}%`));
  lines.push("");
  lines.push("Top questions");
  lines.push("Question,Upvotes");
  TOP_QUESTIONS.forEach((q) =>
    lines.push(`"${q.text.replace(/"/g, '""')}",${q.votes}`),
  );
  return lines.join("\n");
}

export default function EventSummaryPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleExportCsv() {
    const blob = new Blob([buildSummaryCsv()], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design-systems-meetup-summary.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleExportPdf() {
    window.print();
  }

  return (
    <div className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Sidebar
        activeHref="/event-summary"
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
                className="flex items-center gap-1 text-[13px] font-semibold text-[var(--lb-text-muted)] print:hidden"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
              </a>
              <div className="mt-1.5 font-[var(--font-display)] text-xl font-bold sm:text-2xl">
                Design Systems Meetup — summary
              </div>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              <button
                type="button"
                onClick={handleExportCsv}
                className="lb-btn-outline flex items-center gap-1.5 px-5 py-[11px] text-sm"
              >
                <FileText className="h-4 w-4" /> Export CSV
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="lb-btn-primary flex items-center gap-1.5 whitespace-nowrap px-[22px] py-3 text-sm"
              >
                <Download className="h-4 w-4" /> Export PDF
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 sm:py-9 md:px-10">
          <div className="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="lb-surface rounded-2xl p-[22px]">
                <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                  {stat.label}
                </div>
                <div className="font-[var(--font-display)] text-[28px] font-bold">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4 font-[var(--font-display)] text-[17px] font-bold">
            Poll results
          </div>
          <div className="mb-9 flex flex-col gap-4">
            <div className="lb-surface rounded-2xl p-6">
              <div className="mb-4 text-[15px] font-bold">
                Which feature should we ship next?
              </div>
              <div className="flex flex-col gap-2.5">
                {MC_OPTIONS.map((o) => (
                  <div key={o.label}>
                    <div className="mb-1 flex justify-between text-[13px] font-semibold">
                      <div>{o.label}</div>
                      <div>{o.pct}%</div>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[var(--lb-bg)]">
                      <div
                        style={{ width: `${o.pct}%` }}
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--lb-grad1),var(--lb-grad2))]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lb-surface rounded-2xl p-6">
              <div className="mb-4 text-[15px] font-bold">
                Rate this quarter&apos;s roadmap (1–5)
              </div>
              <div className="flex h-[90px] items-end gap-4">
                {RATING_BARS.map((bar) => (
                  <div
                    key={bar.score}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div className="text-xs font-bold">{bar.pct}%</div>
                    <div
                      style={{ height: `${bar.heightPx}px` }}
                      className={`w-full rounded-t ${
                        bar.highlight
                          ? "bg-[var(--lb-accent)]"
                          : "bg-[var(--lb-border)]"
                      }`}
                    />
                    <div className="text-[11px] text-[var(--lb-text-muted)]">
                      {bar.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4 font-[var(--font-display)] text-[17px] font-bold">
            Top questions
          </div>
          <div className="flex flex-col gap-2.5">
            {TOP_QUESTIONS.map((q) => (
              <div
                key={q.text}
                className="lb-surface flex items-center gap-4 rounded-[14px] px-5 py-4"
              >
                <div className="flex-1 text-sm">&quot;{q.text}&quot;</div>
                <div className="whitespace-nowrap rounded-full bg-[var(--lb-bg)] px-2.5 py-1 text-xs font-bold text-[var(--lb-text-muted)]">
                  ▲ {q.votes}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
