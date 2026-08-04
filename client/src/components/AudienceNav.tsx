"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ListChecks,
  MessageSquarePlus,
  MessagesSquare,
} from "lucide-react";

const TABS = [
  { href: "/join/poll", label: "Vote", icon: ListChecks },
  { href: "/join/results", label: "Results", icon: BarChart3 },
  { href: "/join/ask", label: "Ask", icon: MessageSquarePlus },
  { href: "/join/questions", label: "Questions", icon: MessagesSquare },
];

export function AudienceTopBar({
  title,
  variant = "light",
}: {
  title: string;
  variant?: "light" | "dark";
}) {
  if (variant === "dark") {
    return (
      <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-center bg-[oklch(0.2_0.03_275_/_0.7)] px-4 backdrop-blur">
        <div className="text-sm font-bold text-white">{title}</div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-center border-b border-[var(--lb-border)] bg-[var(--lb-surface)]/90 px-4 backdrop-blur">
      <div className="text-sm font-bold text-[var(--lb-text)]">{title}</div>
    </div>
  );
}

export function AudienceTabBar() {
  const pathname = usePathname();

  return (
    <div className="sticky bottom-0 z-30 flex shrink-0 items-stretch border-t border-[var(--lb-border)] bg-[var(--lb-surface)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
              active ? "text-[var(--lb-accent)]" : "text-[var(--lb-text-muted)]"
            }`}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
