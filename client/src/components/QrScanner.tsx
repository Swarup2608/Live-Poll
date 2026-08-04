"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { X } from "lucide-react";

export default function QrScanner({
  onScan,
  onClose,
}: {
  onScan: (text: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        frameRef.current = requestAnimationFrame(tick);
      } catch {
        if (!cancelled) {
          setError(
            "Couldn't access the camera. Check permissions, or enter the code manually.",
          );
        }
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = jsQR(imageData.data, canvas.width, canvas.height);
          if (result?.data) {
            onScan(result.data);
            return;
          }
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[400] flex flex-col bg-black">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="text-sm font-bold text-white">Scan QR code</div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
          aria-label="Close scanner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {!error && (
          <div className="relative h-[240px] w-[240px] rounded-2xl border-2 border-white/80" />
        )}

        {error && (
          <div className="relative mx-6 max-w-[300px] rounded-2xl bg-[var(--lb-surface)] p-5 text-center text-sm text-[var(--lb-text)]">
            {error}
          </div>
        )}
      </div>

      <div className="px-6 pb-8 pt-4 text-center text-xs text-white/60">
        Point your camera at the QR code on the venue screen.
      </div>
    </div>
  );
}
