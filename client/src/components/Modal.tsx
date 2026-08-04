"use client";

import type { ReactNode } from "react";

export default function Modal({
  onClose,
  children,
  widthClass = "max-w-[380px]",
}: {
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[oklch(0.1_0.02_275_/_0.55)] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`lb-surface w-full ${widthClass} rounded-2xl p-6`}
      >
        {children}
      </div>
    </div>
  );
}
