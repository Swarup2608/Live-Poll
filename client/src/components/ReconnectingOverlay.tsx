export default function ReconnectingOverlay() {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center overflow-hidden bg-[oklch(0.2_0.03_275)] p-6 text-center">
      <div className="lb-anim-float-a absolute -right-12 -top-12 h-[220px] w-[220px] rounded-full bg-[color-mix(in_srgb,var(--lb-grad2)_30%,transparent)]" />
      <div className="relative">
        <div className="mx-auto mb-6 h-[52px] w-[52px] animate-spin rounded-full border-[3px] border-[oklch(1_0_0_/_0.2)] border-t-white" />
        <div className="mb-2.5 font-[var(--font-display)] text-lg font-bold text-white">
          Reconnecting…
        </div>
        <div className="text-[13px] leading-relaxed text-[oklch(0.75_0.02_275)]">
          Hang tight — your connection dropped. We&apos;ll rejoin the room
          automatically.
        </div>
      </div>
    </div>
  );
}
