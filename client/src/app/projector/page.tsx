const EVENT_TITLE = "Q3 All-Hands";
const ROOM_CODE = "482 991";
const ATTENDEE_COUNT = "1,204";
const VOTE_COUNT = "842";
const QUESTION = "Which feature should we ship next?";
const OPTIONS = [
  { label: "Live captions", pct: 52 },
  { label: "Team spaces", pct: 31 },
  { label: "Mobile app", pct: 17 },
];

export default function ProjectorPage() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#0d0d14] font-[var(--font-body)] text-white">
      <div className="lb-anim-float-a pointer-events-none absolute -right-20 -top-[120px] h-[480px] w-[480px] rounded-full bg-[oklch(0.55_0.2_320)] opacity-50 blur-[30px]" />
      <div className="lb-anim-float-b pointer-events-none absolute -bottom-40 -left-[100px] h-[520px] w-[520px] rounded-full bg-[oklch(0.5_0.2_260)] opacity-35 blur-[30px]" />

      <div className="relative z-10 flex items-center justify-between px-14 py-9">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-[10px] bg-[oklch(0.65_0.2_300)]" />
          <div className="font-[var(--font-display)] text-xl font-bold">
            {EVENT_TITLE}
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-base font-semibold text-[oklch(0.8_0.02_275)]">
          <div className="h-[9px] w-[9px] animate-pulse rounded-full bg-[oklch(0.65_0.2_300)]" />
          {ATTENDEE_COUNT} in the room
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-20">
        <div className="mb-16 max-w-[1100px] text-center font-[var(--font-display)] text-[56px] font-bold leading-tight">
          {QUESTION}
        </div>
        <div className="flex w-full max-w-[1100px] flex-col gap-7">
          {OPTIONS.map((o) => (
            <div key={o.label}>
              <div className="mb-3 flex items-baseline justify-between">
                <div className="text-[28px] font-bold">{o.label}</div>
                <div className="font-[var(--font-display)] text-4xl font-bold text-[oklch(0.65_0.2_300)]">
                  {o.pct}%
                </div>
              </div>
              <div className="h-7 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  style={{ width: `${o.pct}%` }}
                  className="lb-anim-bar-grow-x h-full rounded-full bg-[linear-gradient(90deg,oklch(0.65_0.2_300),oklch(0.6_0.19_260))]"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-xl text-[oklch(0.7_0.02_275)]">
          {VOTE_COUNT} votes cast
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-3.5 p-8">
        <div className="rounded-2xl bg-white/[0.08] px-7 py-3.5 font-[var(--font-display)] text-xl font-bold tracking-[0.1em]">
          JOIN AT LOOPBALLOT.LIVE · CODE {ROOM_CODE}
        </div>
      </div>
    </div>
  );
}
