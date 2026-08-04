"use client";

import { useState } from "react";
import Link from "next/link";
import ReconnectingOverlay from "@/components/ReconnectingOverlay";
import { AudienceTabBar, AudienceTopBar } from "@/components/AudienceNav";

export default function WaitingRoomPage() {
  const [showReconnect, setShowReconnect] = useState(false);

  function simulateDisconnect() {
    setShowReconnect(true);
    setTimeout(() => setShowReconnect(false), 2600);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[oklch(0.2_0.03_275)] font-[var(--font-body)]">
      <AudienceTopBar title="Q3 All-Hands" variant="dark" />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-7 py-10 text-center text-white">
        <div className="lb-anim-float-a absolute -right-16 -top-16 h-[220px] w-[220px] rounded-full bg-[color-mix(in_srgb,var(--lb-grad2)_30%,transparent)]" />
        <div className="relative w-full max-w-[360px]">
          <div className="mx-auto mb-7 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-[1.5px] border-dashed border-[oklch(1_0_0_/_0.3)] text-[11px] text-[oklch(0.8_0.02_275)]">
            Logo
          </div>
          <div className="mb-2.5 font-[var(--font-display)] text-xl font-bold">
            You&apos;re in!
          </div>
          <div className="mb-7 text-sm leading-relaxed text-[oklch(0.75_0.02_275)]">
            The host will launch the first poll shortly. Sit tight.
          </div>
          <div className="mb-7 flex justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:0.2s]" />
            <div className="h-2 w-2 animate-pulse rounded-full bg-white [animation-delay:0.4s]" />
          </div>
          <div className="mb-10 text-[13px] text-[oklch(0.65_0.02_275)]">
            1,204 people waiting with you
          </div>

          <Link
            href="/join/poll"
            className="text-[13px] font-semibold text-white/70 underline underline-offset-2"
          >
            Continue to live poll (demo)
          </Link>
          <div className="mt-3">
            <button
              type="button"
              onClick={simulateDisconnect}
              className="text-xs text-white/40 underline underline-offset-2"
            >
              Simulate disconnect
            </button>
          </div>
        </div>

        {showReconnect && <ReconnectingOverlay />}
      </main>
      <AudienceTabBar />
    </div>
  );
}
