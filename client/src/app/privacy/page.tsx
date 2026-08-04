import type { ReactNode } from "react";

function Section({
  title,
  children,
  last,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-5"}>
      <div className="mb-2 text-[15px] font-bold text-[oklch(0.2_0.02_275)]">
        {title}
      </div>
      <div className="text-sm leading-[1.7] text-[oklch(0.4_0.02_275)]">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[oklch(0.94_0.01_275)] px-6 py-12 font-[var(--font-body)]">
      <div className="mx-auto max-w-[640px] rounded-[24px] bg-white p-8 shadow-[0_20px_50px_oklch(0.3_0.03_275_/_0.1)] sm:p-11">
        <div className="mb-1.5 font-[var(--font-display)] text-xl font-bold text-[oklch(0.18_0.02_275)] sm:text-2xl">
          Privacy Policy &amp; Terms of Use
        </div>
        <div className="mb-7 text-[13px] text-[oklch(0.55_0.02_275)]">
          Last updated July 2026
        </div>

        <Section title="Anonymous participation">
          When you join a room via a code or QR link, loopballot does not
          require an account. Votes, ratings, and questions you submit are
          tied to a temporary session, not your identity, unless the room
          host has enabled &quot;require name to join.&quot;
        </Section>
        <Section title="What we collect">
          Poll responses, submitted questions and upvotes, and basic
          device/session metadata used to prevent duplicate voting. Hosts can
          export aggregated results; individual responses are not shared
          unless anonymity is disabled for that room.
        </Section>
        <Section title="Data retention">
          Session data is retained for the lifetime of the event plus 90 days
          to allow hosts to export results, then deleted automatically.
        </Section>
        <Section title="Terms of use" last>
          By joining a room you agree to participate respectfully; hosts may
          moderate, hide, or remove any submitted content at their
          discretion.
        </Section>

        <div className="mt-8 flex flex-wrap gap-5 border-t border-[oklch(0.92_0.01_275)] pt-5 text-[13px] font-semibold text-[oklch(0.45_0.19_275)]">
          <a href="mailto:privacy@loopballot.com">Contact privacy team</a>
          <a href="#">Download full policy (PDF)</a>
        </div>
      </div>
    </main>
  );
}
