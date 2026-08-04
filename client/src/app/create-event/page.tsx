"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import Sidebar, { MobileTopBar } from "@/components/Sidebar";

type Format = "inperson" | "virtual" | "hybrid";

const FORMATS: { key: Format; label: string }[] = [
  { key: "inperson", label: "In-person" },
  { key: "virtual", label: "Virtual" },
  { key: "hybrid", label: "Hybrid" },
];

const BRAND_COLORS = [
  "oklch(0.45 0.19 275)",
  "oklch(0.55 0.19 320)",
  "oklch(0.5 0.16 230)",
  "oklch(0.5 0.15 145)",
  "oklch(0.6 0.18 40)",
  "oklch(0.35 0.02 275)",
];

export default function CreateEventPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [format, setFormat] = useState<Format>("inperson");
  const [colorIdx, setColorIdx] = useState(0);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const accentColor = BRAND_COLORS[colorIdx];

  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    setLogoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  function handleRemoveLogo() {
    setLogoFile(null);
    setLogoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (logoInputRef.current) logoInputRef.current.value = "";
  }

  return (
    <div className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Sidebar
        activeHref="/create-event"
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-3 border-b border-[var(--lb-border)] bg-[var(--lb-surface)] px-4 py-5 sm:px-6 sm:py-7 md:px-10">
          <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />
          <div className="font-[var(--font-display)] text-xl font-bold sm:text-2xl">
            Create a new event
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex-1 px-4 py-8 sm:px-6 sm:py-9 md:px-10 lg:max-w-[560px]">
            <div className="mb-2 text-[15px] text-[var(--lb-text-muted)]">
              Set the basics now — you can add polls and Q&amp;A next.
            </div>

            <div className="my-5 flex gap-2">
              <div className="h-1 flex-1 rounded-full bg-[var(--lb-accent)]" />
              <div className="h-1 flex-1 rounded-full bg-[var(--lb-border)]" />
              <div className="h-1 flex-1 rounded-full bg-[var(--lb-border)]" />
            </div>

            <div className="flex flex-col gap-[22px]">
              <label className="block">
                <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                  Event name
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 All-Hands"
                  className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] p-3.5 text-base text-[var(--lb-text)] outline-none placeholder:text-[var(--lb-text-muted)] focus:border-[var(--lb-accent)]"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Date
                  </div>
                  <input
                    type="date"
                    className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] p-3.5 text-[15px] text-[var(--lb-text)] outline-none focus:border-[var(--lb-accent)]"
                  />
                </label>
                <label className="block">
                  <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                    Start time
                  </div>
                  <input
                    type="time"
                    className="w-full rounded-[10px] border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-bg)] p-3.5 text-[15px] text-[var(--lb-text)] outline-none focus:border-[var(--lb-accent)]"
                  />
                </label>
              </div>

              <div>
                <div className="mb-1.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                  Format
                </div>
                <div className="flex gap-2.5">
                  {FORMATS.map(({ key, label }) => {
                    const active = format === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormat(key)}
                        className={`flex-1 rounded-[10px] border-[1.5px] p-3 text-sm font-semibold ${
                          active
                            ? "border-[var(--lb-accent)] bg-[var(--lb-accent-soft)] text-[var(--lb-accent)]"
                            : "border-[var(--lb-border)] bg-[var(--lb-surface)] text-[var(--lb-text-muted)]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                  Branding
                </div>
                <div className="lb-surface flex flex-col gap-4 rounded-[14px] p-[18px]">
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-[1.5px] border-dashed border-[var(--lb-border)] text-[var(--lb-text-muted)]"
                    >
                      {logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoUrl}
                          alt="Event logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4" strokeWidth={1.75} />
                          <span className="text-[10px]">Logo</span>
                        </>
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] text-[var(--lb-text-muted)]">
                        Upload a square logo — shown on join screen &amp;
                        projector view.
                      </div>
                      {logoFile && (
                        <div className="mt-1.5 flex items-center gap-2 text-xs">
                          <span className="truncate text-[var(--lb-text)]">
                            {logoFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="shrink-0 font-semibold text-[var(--lb-accent)]"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <div className="mb-2.5 text-[13px] font-semibold text-[var(--lb-text-muted)]">
                      Accent color
                    </div>
                    <div className="flex gap-2.5">
                      {BRAND_COLORS.map((hex, i) => (
                        <button
                          key={hex}
                          type="button"
                          aria-label={`Select accent color ${i + 1}`}
                          onClick={() => setColorIdx(i)}
                          style={{
                            background: hex,
                            boxShadow:
                              i === colorIdx
                                ? `0 0 0 3px var(--lb-surface), 0 0 0 5px ${hex}`
                                : "none",
                          }}
                          className="h-8 w-8 shrink-0 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href="/dashboard"
                className="lb-btn-outline px-6 py-3.5 text-[15px]"
              >
                Cancel
              </a>
              <a
                href="/event-builder"
                className="lb-btn-primary flex flex-1 items-center justify-center gap-1.5 px-4 py-3.5 text-[15px]"
              >
                Continue to builder <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[oklch(0.2_0.03_275)] px-6 py-10 lg:py-0">
            <div
              style={{ background: accentColor }}
              className="absolute -left-10 -top-[60px] h-[260px] w-[260px] rounded-full opacity-35 blur-[10px]"
            />
            <div className="absolute -bottom-20 right-10 h-[300px] w-[300px] rounded-full bg-[oklch(0.55_0.2_320_/_0.2)] blur-[10px]" />

            <div className="relative z-[5] w-full max-w-[380px]">
              <div className="mb-3.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[oklch(0.65_0.02_275)]">
                Join screen preview
              </div>
              <div className="rounded-[20px] bg-white px-7 py-9 text-center shadow-[0_40px_80px_oklch(0_0_0_/_0.4)]">
                <div className="mx-auto mb-[18px] flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-dashed border-[oklch(0.8_0.01_275)] text-[9px] text-[oklch(0.55_0.02_275)]">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt="Event logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "Logo"
                  )}
                </div>
                <div className="mb-1.5 font-[var(--font-display)] text-xl font-bold text-[oklch(0.18_0.02_275)]">
                  {name || "Your event name"}
                </div>
                <div className="mb-6 text-[13px] text-[oklch(0.5_0.02_275)]">
                  Enter the room code to join
                </div>
                <div className="mb-3.5 flex h-12 items-center justify-center rounded-[10px] border-[1.5px] border-[oklch(0.88_0.01_275)] font-[var(--font-display)] text-lg font-bold tracking-[0.15em] text-[oklch(0.3_0.02_275)]">
                  482 991
                </div>
                <div
                  style={{ background: accentColor }}
                  className="flex h-[46px] items-center justify-center rounded-[10px] text-sm font-bold text-white"
                >
                  Join room
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
