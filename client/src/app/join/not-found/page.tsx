import Link from "next/link";
import { AudienceTopBar } from "@/components/AudienceNav";

export default function RoomNotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--lb-bg)] font-[var(--font-body)]">
      <AudienceTopBar title="loopballot" />
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px] rounded-[24px] bg-[var(--lb-surface)] p-10 text-center shadow-[var(--lb-shadow)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--lb-accent-soft)] font-[var(--font-display)] text-2xl font-bold text-[var(--lb-accent)]">
            ?
          </div>
          <div className="mb-2.5 font-[var(--font-display)] text-xl font-bold text-[var(--lb-text)]">
            We couldn&apos;t find that room
          </div>
          <div className="mb-7 text-sm leading-relaxed text-[var(--lb-text-muted)]">
            The code may be wrong, or the event may have already ended.
            Double-check with your host.
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              href="/join"
              className="rounded-xl border-[1.5px] border-[var(--lb-border)] px-5 py-3 text-sm font-semibold text-[var(--lb-text)]"
            >
              Try another code
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-[var(--lb-accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              Go to loopballot.com
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
