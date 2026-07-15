"use client";

import { useRef, type PointerEvent } from "react";
import Navbar from "@/components/Navbar";

const features = [
  {
    swatchClass: "bg-[var(--lb-accent-soft)]",
    dotClass: "bg-[var(--lb-accent)]",
    dotShape: "rounded",
    title: "Live polls",
    body: "Multiple choice, ratings, open text — launched with one tap and revealed in real time.",
  },
  {
    swatchClass:
      "bg-[color-mix(in_srgb,var(--lb-grad2)_20%,var(--lb-surface))]",
    dotClass: "bg-[var(--lb-grad2)]",
    dotShape: "circle",
    title: "Moderated Q&A",
    body: "Audience questions rise by upvotes — you approve, pin, or hide before they hit the screen.",
  },
  {
    swatchClass:
      "bg-[color-mix(in_srgb,var(--lb-grad1)_20%,var(--lb-surface))]",
    dotClass: "bg-[var(--lb-grad1)]",
    dotShape: "triangle",
    title: "Projector view",
    body: "A clean, huge-type display built for the venue screen, branded to your event.",
  },
  {
    swatchClass:
      "bg-[color-mix(in_srgb,var(--lb-accent)_15%,var(--lb-surface))]",
    dotClass: "bg-[color-mix(in_srgb,var(--lb-accent)_70%,var(--lb-grad2))]",
    dotShape: "bar",
    title: "Instant exports",
    body: "Full results and analytics, ready as CSV or a shareable PDF the moment the room closes.",
  },
];

const pollResults = [
  {
    pct: "52%",
    label: "Live captions",
    heightClass: "h-[150px]",
    gradientClass:
      "bg-[linear-gradient(180deg,var(--lb-grad1),var(--lb-accent))]",
    delayClass: "[animation-delay:0s]",
  },
  {
    pct: "31%",
    label: "Team spaces",
    heightClass: "h-[90px]",
    gradientClass:
      "bg-[linear-gradient(180deg,var(--lb-grad2),var(--lb-accent))]",
    delayClass: "[animation-delay:0.1s]",
  },
  {
    pct: "17%",
    label: "Mobile app",
    heightClass: "h-[52px]",
    gradientClass:
      "bg-[linear-gradient(180deg,var(--lb-accent),var(--lb-grad1))]",
    delayClass: "[animation-delay:0.2s]",
  },
];

const logos = ["w-[110px]", "w-[90px]", "w-[130px]", "w-[100px]"];

type MockMotion = { x: number; y: number; rx: number; ry: number };
const neutralMockMotion: MockMotion = { x: 0, y: 0, rx: 6, ry: -5 };

export default function Home() {
  const mockRef = useRef<HTMLDivElement>(null);

  function applyMockMotion(motion: MockMotion) {
    if (!mockRef.current) return;
    mockRef.current.style.setProperty(
      "--lb-mock-slide-x",
      `${motion.x * 24}px`,
    );
    mockRef.current.style.setProperty("--lb-mock-slide-y", `${motion.y * 8}px`);
    mockRef.current.style.setProperty("--lb-mock-rotate-x", `${motion.rx}deg`);
    mockRef.current.style.setProperty("--lb-mock-rotate-y", `${motion.ry}deg`);
  }

  function handleMockPointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    applyMockMotion({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
      rx: neutralMockMotion.rx - y * 4,
      ry: neutralMockMotion.ry + x * 8,
    });
  }

  return (
    <div className="relative mx-auto box-border w-full max-w-[1440px] overflow-hidden bg-[var(--lb-surface)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Navbar />
      <div className="lb-hero-pad relative box-border min-h-[640px] overflow-hidden px-16 pb-0 pt-[70px]">
        <div className="lb-anim-float-a absolute right-[120px] top-[60px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--lb-grad2),var(--lb-grad1))] opacity-[0.35] blur-[2px]" />
        <div className="lb-anim-float-b absolute right-[340px] top-[280px] h-[120px] w-[120px] rounded-[32px] bg-[linear-gradient(135deg,var(--lb-grad1),var(--lb-accent))] opacity-50" />
        <div className="lb-anim-float-a absolute right-[420px] top-10 h-[70px] w-[70px] rounded-full border-[6px] border-[var(--lb-accent-soft)]" />

        <div className="relative z-[5] box-border w-full max-w-[640px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-[100px] bg-[var(--lb-accent-soft)] px-4 py-2 text-[13px] font-semibold text-[var(--lb-accent)]">
            <div className="h-[7px] w-[7px] rounded-full bg-[oklch(0.6_0.2_145)] shadow-[0_0_0_4px_oklch(0.6_0.2_145_/_0.2)]" />
            Live in 40,000+ events this year
          </div>
          <h1 className="lb-hero-title m-0 font-[var(--font-display)] text-[60px] leading-[1.05] font-bold tracking-[-0.02em] text-[var(--lb-text)]">
            Every voice in the room,{" "}
            <span className="text-[var(--lb-accent)]">
              on screen instantly.
            </span>
          </h1>
          <p className="lb-hero-sub mt-6 max-w-[520px] text-[19px] leading-[1.6] text-[var(--lb-text-muted)]">
            Loopballot turns any audience into a live conversation — polls,
            Q&amp;A, and results that appear on the big screen the moment votes
            come in.
          </p>
          <div className="lb-hero-actions mt-9 flex flex-wrap gap-4">
            <a
              href="/login"
              className="lb-btn-primary px-[30px] py-4 text-base"
            >
              Create your first event
            </a>
            <a href="#" className="lb-btn-outline px-[26px] py-4 text-base">
              Watch a 2-min demo ▸
            </a>
          </div>
        </div>

        <div className="lb-mock-stage relative z-[5] mb-[10px] mt-14">
          <div
            className="lb-mock-hitbox"
            onPointerMove={handleMockPointerMove}
            onPointerLeave={() => applyMockMotion(neutralMockMotion)}
          >
            <div ref={mockRef} className="lb-mock">
              <div className="lb-mock-grid mx-auto box-border grid w-[891px] max-w-full grid-cols-[1.3fr_1fr] items-stretch justify-start gap-5 rounded-[20px] border border-[var(--lb-border)] bg-[color-mix(in_srgb,var(--lb-surface)_85%,transparent)] p-7 shadow-[var(--lb-shadow)] [backdrop-filter:blur(20px)] [transform-style:preserve-3d]">
                <div className="lb-mock-poll-panel rounded-[14px] bg-[var(--lb-surface)] p-6 shadow-[var(--lb-shadow)]">
                  <div className="mb-4 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Q3 · Which feature should we ship next?
                  </div>
                  <div className="flex h-[180px] items-end gap-[18px]">
                    {pollResults.map((bar) => (
                      <div
                        key={bar.label}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <div className="text-[13px] font-bold text-[var(--lb-text)]">
                          {bar.pct}
                        </div>
                        <div
                          className={`lb-anim-bar-grow w-full origin-bottom rounded-t-[8px] ${bar.heightClass} ${bar.gradientClass} ${bar.delayClass}`}
                        />
                        <div className="text-center text-xs text-[var(--lb-text-muted)]">
                          {bar.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lb-mock-qa-panel flex flex-col gap-3 rounded-[14px] bg-[color-mix(in_srgb,var(--lb-text)_92%,transparent)] p-5 text-[var(--lb-surface)]">
                  <div className="text-xs font-semibold tracking-[0.05em] text-[color-mix(in_srgb,var(--lb-surface)_75%,transparent)] uppercase">
                    Q&amp;A · Moderation
                  </div>
                  <div className="rounded-[10px] bg-[color-mix(in_srgb,var(--lb-text)_82%,transparent)] p-3 text-[13px] leading-[1.4]">
                    &quot;Will this be available for hybrid events too?&quot;
                    <div className="mt-2 flex gap-2">
                      <div className="rounded-[100px] bg-[var(--lb-accent)] px-[10px] py-1 text-[11px] font-semibold">
                        ▲ 24
                      </div>
                      <div className="rounded-[100px] bg-[var(--lb-grad2)] px-[10px] py-1 text-[11px] font-semibold">
                        Pin
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[10px] bg-[color-mix(in_srgb,var(--lb-text)_82%,transparent)] p-3 text-[13px] leading-[1.4] opacity-70">
                    &quot;Can we brand the projector view?&quot;
                    <div className="mt-2 flex gap-2">
                      <div className="rounded-[100px] bg-[var(--lb-accent)] px-[10px] py-1 text-[11px] font-semibold">
                        ▲ 11
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lb-hero-pad relative z-[5] box-border px-16 pb-[90px] pt-[100px]">
        <div className="mb-3 text-center font-[var(--font-display)] text-4xl font-bold text-[var(--lb-text)]">
          Everything the room needs, in one flow
        </div>
        <div className="mb-14 text-center text-[17px] text-[var(--lb-text-muted)]">
          From the first invite to the export at the end.
        </div>
        <div className="lb-features grid grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-[var(--lb-surface)] p-7 shadow-[var(--lb-shadow)]"
            >
              <div
                className={`mb-[18px] flex h-11 w-11 items-center justify-center rounded-xl ${f.swatchClass}`}
              >
                <FeatureIcon shape={f.dotShape} colorClass={f.dotClass} />
              </div>
              <div className="mb-2 text-[17px] font-bold text-[var(--lb-text)]">
                {f.title}
              </div>
              <div className="text-sm leading-[1.55] text-[var(--lb-text-muted)]">
                {f.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lb-hero-pad box-border px-16 pb-20 pt-[60px] text-center">
        <div className="mb-6 font-[var(--font-display)] text-[15px] font-semibold tracking-[0.08em] text-[var(--lb-text-muted)] uppercase">
          Trusted for conferences, classrooms, town halls &amp; company
          all-hands
        </div>
        <div className="lb-logos flex justify-center gap-14 opacity-50">
          {logos.map((wClass, i) => (
            <div
              key={i}
              className={`h-[22px] rounded ${wClass} bg-[repeating-linear-gradient(90deg,var(--lb-text-muted),var(--lb-text-muted)_4px,transparent_4px,transparent_8px)]`}
            />
          ))}
        </div>
      </div>

      <div className="lb-cta relative mx-16 mb-16 overflow-hidden rounded-3xl bg-[color-mix(in_srgb,var(--lb-text)_92%,transparent)] p-16 text-center">
        <div className="lb-anim-float-a absolute -left-10 -top-10 h-[180px] w-[180px] rounded-full bg-[color-mix(in_srgb,var(--lb-grad1)_30%,transparent)]" />
        <div className="lb-anim-float-b absolute -bottom-[60px] right-20 h-[220px] w-[220px] rounded-full bg-[color-mix(in_srgb,var(--lb-grad2)_25%,transparent)]" />
        <div className="relative mb-4 font-[var(--font-display)] text-[34px] font-bold text-[var(--lb-surface)]">
          Your next event deserves a live room.
        </div>
        <div className="relative mb-8 text-base text-[color-mix(in_srgb,var(--lb-surface)_80%,transparent)]">
          Free for up to 50 participants. No credit card.
        </div>
        <a
          href="/login"
          className="relative inline-block rounded-xl bg-[var(--lb-surface)] px-[34px] py-4 text-base font-bold text-[color-mix(in_srgb,var(--lb-text)_92%,transparent)]"
        >
          Start free — 2 min setup
        </a>
      </div>

      <div className="lb-footer box-border flex justify-between border-t border-t-[var(--lb-border)] px-16 py-7 text-[13px] text-[var(--lb-text-muted)]">
        <div>© 2026 loopballot</div>
        <div className="flex gap-6">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <div className="fixed bottom-7 right-7 z-[100] flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full bg-[var(--lb-accent)] shadow-[0_10px_24px_var(--lb-accent-soft)]">
        <div className="h-5 w-5 rounded-full bg-[conic-gradient(var(--lb-grad1),var(--lb-grad2),var(--lb-accent),var(--lb-grad1))]" />
      </div>
    </div>
  );
}

function FeatureIcon({
  shape,
  colorClass,
}: {
  shape: string;
  colorClass: string;
}) {
  if (shape === "circle") {
    return <div className={`h-[18px] w-[18px] rounded-full ${colorClass}`} />;
  }
  if (shape === "triangle") {
    return (
      <div
        className={`h-[18px] w-[18px] ${colorClass} [clip-path:polygon(50%_0,100%_100%,0_100%)]`}
      />
    );
  }
  if (shape === "bar") {
    return <div className={`h-3 w-[18px] rounded-[3px] ${colorClass}`} />;
  }
  return <div className={`h-[18px] w-[18px] rounded-[5px] ${colorClass}`} />;
}
