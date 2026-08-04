"use client";

import { useState } from "react";
import { THEMES, THEME_SWATCH_CLASS, ThemeKey, useTheme } from "./ThemeContext";

const DARK_THEMES: ThemeKey[] = ["dark", "midnight", "disco", "shootout"];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [panelOpen, setPanelOpen] = useState(false);
  const isDarkTheme = DARK_THEMES.includes(theme);

  return (
    <>
      <div
        onClick={() => setPanelOpen((open) => !open)}
        className={`fixed bottom-7 right-7 z-[100] flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full shadow-[0_10px_24px_var(--lb-accent-soft)] print:hidden ${
          isDarkTheme ? "bg-[#777777]" : "bg-[#aaaaaa]"
        }`}
      >
        <div className="h-5 w-5 rounded-full bg-[conic-gradient(var(--lb-grad1),var(--lb-grad2),var(--lb-accent),var(--lb-grad1))]" />
      </div>

      {panelOpen && (
        <div className="fixed bottom-[92px] right-7 z-[200] w-[220px] origin-bottom-right overflow-hidden rounded-2xl border border-[var(--lb-border)] bg-[var(--lb-surface)] font-[var(--font-body)] shadow-[var(--lb-shadow)] [animation:lb-genie_0.28s_cubic-bezier(0.2,0.8,0.3,1.1)] print:hidden">
          <div className="flex items-center justify-between border-b border-b-[var(--lb-border)] bg-[var(--lb-accent-soft)] px-4 py-3">
            <div className="text-[13px] font-bold text-[var(--lb-text)]">
              Appearance
            </div>
            <div
              onClick={() => setPanelOpen(false)}
              className="cursor-pointer text-sm font-bold text-[var(--lb-text-muted)]"
            >
              ✕
            </div>
          </div>
          <div className="flex max-h-80 flex-col overflow-y-auto p-2">
            {theme !== "light" && (
              <>
                <div
                  onClick={() => setTheme("light")}
                  className="flex cursor-pointer items-center gap-2.5 rounded-[9px] px-[10px] py-[9px] text-[13px] font-semibold text-[var(--lb-text-muted)]"
                >
                  <div className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border border-[var(--lb-text-muted)] text-[9px] leading-none">
                    ↺
                  </div>
                  Reset to Default
                </div>
                <div className="my-1 h-px shrink-0 bg-[var(--lb-border)]" />
              </>
            )}
            {THEMES.map((t) => {
              const isActive = t.key === theme;
              return (
                <div
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-[9px] px-[10px] py-[9px] text-[13px] font-semibold ${
                    isActive
                      ? "bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]"
                      : "text-[var(--lb-text-muted)]"
                  }`}
                >
                  <div
                    className={`h-[14px] w-[14px] shrink-0 rounded-full ${THEME_SWATCH_CLASS[t.key]}`}
                  />
                  {t.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
