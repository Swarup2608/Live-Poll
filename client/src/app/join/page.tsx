"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";
import { AudienceTopBar } from "@/components/AudienceNav";
import QrScanner from "@/components/QrScanner";

const VALID_CODE = "482991";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  const digits = code.replace(/\D/g, "").slice(0, 6);
  const formatted =
    digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits;

  function goToRoom(roomDigits: string) {
    router.push(
      roomDigits === VALID_CODE ? "/join/waiting" : "/join/not-found",
    );
  }

  function handleJoin() {
    if (digits.length !== 6) return;
    goToRoom(digits);
  }

  function handleScan(text: string) {
    const match = text.match(/\d{6}/);
    setScannerOpen(false);
    if (match) {
      setCode(match[0]);
      goToRoom(match[0]);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--lb-surface)] font-[var(--font-body)]">
      <AudienceTopBar title="loopballot" />
      <main className="flex flex-1 items-center justify-center px-7 py-10">
        <div className="w-full max-w-[360px] text-center">
          <div className="mx-auto mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border-[1.5px] border-dashed border-[var(--lb-border)] text-[11px] text-[var(--lb-text-muted)]">
            Logo
          </div>
          <div className="mb-2 font-[var(--font-display)] text-2xl font-bold text-[var(--lb-text)]">
            Q3 All-Hands
          </div>
          <div className="mb-8 text-sm text-[var(--lb-text-muted)]">
            Enter the room code to join
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={formatted}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            placeholder="482 991"
            className="mb-3.5 w-full rounded-xl border-[1.5px] border-[var(--lb-border)] bg-[var(--lb-surface)] px-4 py-4 text-center font-[var(--font-display)] text-[22px] font-bold tracking-[0.12em] text-[var(--lb-text)] outline-none focus:border-[var(--lb-accent)]"
          />
          <button
            type="button"
            onClick={handleJoin}
            disabled={digits.length !== 6}
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[var(--lb-accent)] text-[15px] font-bold text-white disabled:opacity-40"
          >
            Join room
          </button>
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-[var(--lb-accent)]"
          >
            <QrCode className="h-3.5 w-3.5" /> Scan the QR code on the venue
            screen
          </button>
        </div>
      </main>

      {scannerOpen && (
        <QrScanner onScan={handleScan} onClose={() => setScannerOpen(false)} />
      )}
    </div>
  );
}
