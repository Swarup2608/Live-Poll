import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AudienceTabBar, AudienceTopBar } from "@/components/AudienceNav";

const RESULTS = [
  { label: "Live captions", pct: 52 },
  { label: "Team spaces", pct: 31 },
  { label: "Mobile app", pct: 17 },
];

export default function LiveResultsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--lb-surface)] font-[var(--font-body)]">
      <AudienceTopBar title="Q3 All-Hands" />
      <main className="flex flex-1 flex-col px-6 py-7">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--lb-text-muted)]">
          Results · revealed live
        </div>
        <div className="mb-6 font-[var(--font-display)] text-xl font-bold leading-snug text-[var(--lb-text)]">
          Which feature should we ship next?
        </div>
        <div className="flex flex-col gap-[18px]">
          {RESULTS.map((r, i) => (
            <div key={r.label}>
              <div className="mb-1.5 flex justify-between text-sm font-bold text-[var(--lb-text)]">
                <div>{r.label}</div>
                <div>{r.pct}%</div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--lb-bg)]">
                <div
                  style={{
                    width: `${r.pct}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                  className="lb-anim-bar-grow-x h-full rounded-full bg-[linear-gradient(90deg,var(--lb-grad1),var(--lb-grad2))]"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1" />
        <div className="mt-6 text-center text-[13px] text-[var(--lb-text-muted)]">
          842 votes cast
        </div>
        <Link
          href="/join/ask"
          className="mt-4 flex items-center justify-center gap-1 text-center text-[13px] font-semibold text-[var(--lb-accent)]"
        >
          Next: Ask a question <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </main>
      <AudienceTabBar />
    </div>
  );
}
