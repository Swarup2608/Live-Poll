"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  Copy,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Sidebar, { MobileTopBar } from "@/components/Sidebar";
import Modal from "@/components/Modal";
import Toggle from "@/components/Toggle";

const BRAND_COLORS = [
  "oklch(0.45 0.19 275)",
  "oklch(0.55 0.19 320)",
  "oklch(0.5 0.16 230)",
  "oklch(0.5 0.15 145)",
  "oklch(0.6 0.18 40)",
  "oklch(0.35 0.02 275)",
];

function randomRoomCode() {
  const n = Math.floor(Math.random() * 1_000_000);
  return n.toString().padStart(6, "0");
}

export default function RoomSettingsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("482991");
  const [copied, setCopied] = useState(false);
  const [requireName, setRequireName] = useState(true);
  const [lockRoom, setLockRoom] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [allowAnonQ, setAllowAnonQ] = useState(true);
  const [colorIdx, setColorIdx] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  const formattedCode = `${roomCode.slice(0, 3)} ${roomCode.slice(3)}`;

  function handleRegenerate() {
    setRoomCode(randomRoomCode());
  }

  async function handleCopyLink() {
    const link = `https://loopballot.app/join/${roomCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard access denied — no-op
    }
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setLogoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  return (
    <div className="flex min-h-screen w-full bg-[var(--lb-bg)] font-[var(--font-body)] text-[var(--lb-text)]">
      <Sidebar
        activeHref="/room-settings"
        mobileOpen={menuOpen}
        onCloseMobile={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-5 border-b border-[var(--lb-border)] bg-[var(--lb-surface)] px-4 py-5 sm:px-6 sm:py-7 md:px-10">
          <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />

          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <a
                href="/event-builder"
                className="flex items-center gap-1 text-[13px] font-semibold text-[var(--lb-text-muted)]"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to agenda
              </a>
              <div className="mt-1.5 font-[var(--font-display)] text-xl font-bold sm:text-2xl">
                Q3 All-Hands — room settings
              </div>
            </div>
            <button
              type="button"
              className="lb-btn-primary whitespace-nowrap px-[22px] py-3 text-sm"
            >
              Save changes
            </button>
          </div>
        </header>

        <main className="flex max-w-[680px] flex-1 flex-col gap-7 px-4 py-7 sm:px-6 sm:py-9 md:px-10">
          <div className="lb-surface rounded-2xl p-6">
            <div className="mb-4 text-sm font-bold">Join code &amp; access</div>
            <div className="mb-4 flex flex-wrap items-center gap-3.5">
              <div className="rounded-[10px] bg-[var(--lb-bg)] px-[22px] py-3 font-[var(--font-display)] text-2xl font-bold tracking-[0.1em]">
                {formattedCode}
              </div>
              <button
                type="button"
                onClick={handleRegenerate}
                className="lb-btn-outline flex items-center gap-1.5 px-4 py-2.5 text-[13px]"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="lb-btn-outline flex items-center gap-1.5 px-4 py-2.5 text-[13px]"
              >
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--lb-border)] py-3.5">
              <div>
                <div className="text-sm font-semibold">
                  Require name to join
                </div>
                <div className="mt-0.5 text-xs text-[var(--lb-text-muted)]">
                  Otherwise attendees join anonymously.
                </div>
              </div>
              <Toggle
                checked={requireName}
                onChange={() => setRequireName((v) => !v)}
                label="Require name to join"
              />
            </div>
            <div className="flex items-center justify-between border-t border-[var(--lb-border)] py-3.5">
              <div>
                <div className="text-sm font-semibold">
                  Lock room after start
                </div>
                <div className="mt-0.5 text-xs text-[var(--lb-text-muted)]">
                  New attendees can&apos;t join once the event begins.
                </div>
              </div>
              <Toggle
                checked={lockRoom}
                onChange={() => setLockRoom((v) => !v)}
                label="Lock room after start"
              />
            </div>
          </div>

          <div className="lb-surface rounded-2xl p-6">
            <div className="mb-4 text-sm font-bold">Branding</div>
            <div className="mb-[18px] flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border-[1.5px] border-dashed border-[var(--lb-border)] text-[var(--lb-text-muted)]"
              >
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Room logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4" strokeWidth={1.75} />
                    <span className="text-[10px]">Logo</span>
                  </>
                )}
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <div className="text-[13px] text-[var(--lb-text-muted)]">
                Shown on join screen, waiting room &amp; projector view.
              </div>
            </div>
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

          <div className="lb-surface rounded-2xl p-6">
            <div className="mb-4 text-sm font-bold">Q&amp;A moderation</div>
            <div className="flex items-center justify-between pb-3.5">
              <div className="text-sm font-semibold">
                Require host approval before questions appear
              </div>
              <Toggle
                checked={requireApproval}
                onChange={() => setRequireApproval((v) => !v)}
                label="Require host approval before questions appear"
              />
            </div>
            <div className="flex items-center justify-between border-t border-[var(--lb-border)] pt-3.5">
              <div className="text-sm font-semibold">
                Allow anonymous questions
              </div>
              <Toggle
                checked={allowAnonQ}
                onChange={() => setAllowAnonQ((v) => !v)}
                label="Allow anonymous questions"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-[1.5px] border-[oklch(0.55_0.18_25_/_0.3)] bg-[oklch(0.55_0.18_25_/_0.06)] p-5">
            <div>
              <div className="text-sm font-bold text-[oklch(0.5_0.18_25)]">
                Delete this room
              </div>
              <div className="mt-0.5 text-xs text-[var(--lb-text-muted)]">
                Removes all polls, questions and results permanently.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-[9px] border-[1.5px] border-[oklch(0.55_0.18_25_/_0.4)] px-4 py-2.5 text-[13px] font-semibold text-[oklch(0.5_0.18_25)]"
            >
              Delete room
            </button>
          </div>
        </main>
      </div>

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(false)}>
          <div className="mb-2 flex items-center gap-2 font-[var(--font-display)] text-base font-bold text-[oklch(0.5_0.18_25)]">
            <Trash2 className="h-4 w-4" /> Delete this room?
          </div>
          <div className="mb-5 text-sm leading-relaxed text-[var(--lb-text-muted)]">
            This permanently removes all polls, questions, and results for Q3
            All-Hands. This can&apos;t be undone.
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="lb-btn-outline px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-[10px] bg-[oklch(0.5_0.18_25)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Delete room
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
