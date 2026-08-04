"use client";

import { CreditCard, LayoutDashboard, Menu, Settings, Users, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Account settings", href: "/account-settings", icon: Settings },
  {
    label: "Billing",
    href: "/account-settings?tab=billing",
    icon: CreditCard,
  },
  {
    label: "Team members",
    href: "/account-settings?tab=team",
    icon: Users,
  },
];

function SidebarNav({ activeHref }: { activeHref: string }) {
  return (
    <>
      <div className="mb-9 flex items-center gap-2.5 px-2">
        <div className="h-[30px] w-[30px] rounded-lg bg-[linear-gradient(135deg,var(--lb-grad1),var(--lb-grad2))] shadow-[0_4px_14px_var(--lb-accent-soft)]" />
        <div className="font-[var(--font-display)] text-lg font-bold">
          loopballot
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === activeHref;
          return (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-[10px] px-3 py-[11px] text-sm font-semibold ${
                active
                  ? "bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]"
                  : "text-[var(--lb-text-muted)]"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
              {label}
            </a>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-2.5 border-t border-[var(--lb-border)] px-2 pt-2.5">
        <div className="h-8 w-8 shrink-0 rounded-full bg-[var(--lb-accent-soft)]" />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold">Jordan Ade</div>
          <div className="truncate text-xs text-[var(--lb-text-muted)]">
            jordan@company.com
          </div>
        </div>
      </div>
    </>
  );
}

export default function Sidebar({
  activeHref,
  mobileOpen,
  onCloseMobile,
}: {
  activeHref: string;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[var(--lb-border)] bg-[var(--lb-surface)] p-4 print:hidden md:flex">
        <SidebarNav activeHref={activeHref} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            onClick={onCloseMobile}
            className="absolute inset-0 bg-[oklch(0.1_0.02_275_/_0.5)]"
          />
          <aside className="relative flex h-full w-[240px] flex-col border-r border-[var(--lb-border)] bg-[var(--lb-surface)] p-4">
            <button
              type="button"
              onClick={onCloseMobile}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--lb-text-muted)]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarNav activeHref={activeHref} />
          </aside>
        </div>
      )}
    </>
  );
}

export function MobileTopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <div className="flex items-center gap-3 print:hidden md:hidden">
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[var(--lb-border)] text-[var(--lb-text)]"
        aria-label="Open menu"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-[linear-gradient(135deg,var(--lb-grad1),var(--lb-grad2))]" />
        <div className="font-[var(--font-display)] text-base font-bold">
          loopballot
        </div>
      </div>
    </div>
  );
}
