import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { AudienceTopBar } from "@/components/AudienceNav";

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[oklch(0.2_0.03_275)] font-[var(--font-body)]">
      <AudienceTopBar title="loopballot" variant="dark" />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-7 py-10 text-center text-white">
        <div className="lb-anim-float-a absolute -left-16 -top-16 h-[220px] w-[220px] rounded-full bg-[color-mix(in_srgb,var(--lb-grad1)_30%,transparent)]" />
        <div className="relative w-full max-w-[360px]">
          <div className="lb-anim-check-pop mx-auto mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[oklch(0.5_0.16_145)]">
            <CircleCheck className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
          <div className="mb-2.5 font-[var(--font-display)] text-xl font-bold">
            Thanks for joining!
          </div>
          <div className="mb-7 text-sm leading-relaxed text-[oklch(0.75_0.02_275)]">
            This session has ended. The host will share results and a recap
            soon.
          </div>
          <div className="text-[13px] text-[oklch(0.65_0.02_275)]">
            Powered by loopballot
          </div>
          <Link
            href="/join"
            className="mt-8 inline-block text-xs font-semibold text-white/50 underline underline-offset-2"
          >
            Join another event
          </Link>
        </div>
      </main>
    </div>
  );
}
