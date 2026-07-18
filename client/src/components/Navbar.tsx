"use client";

import Image from "next/image";
import { LOGO_BY_THEME, useTheme } from "./ThemeContext";

export default function Navbar() {
  const { theme } = useTheme();

  return (
    <nav className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-16 py-7">
      <div className="flex items-center gap-2.5">
        <Image
          src={LOGO_BY_THEME[theme]}
          alt="Loopballot"
          width={900}
          height={500}
          priority
          className="h-8 w-auto"
        />
      </div>
      <div className="lb-nav-links flex items-center gap-9 text-[15px] font-medium text-[var(--lb-text-muted)]">
        <a href="#">Product</a>
        <a href="#">Use cases</a>
        <a href="#">Pricing</a>
        <a href="/all-pages">All pages</a>
        <a href="#">Resources</a>
      </div>
      <div className="flex items-center gap-3.5">
        <a
          href="/login"
          className="px-1 py-2.5 text-[15px] font-semibold text-[var(--lb-text)]"
        >
          Log in
        </a>
        <a
          href="/login"
          className="lb-btn-primary px-[22px] py-[11px] text-[15px]"
        >
          Start free
        </a>
      </div>
    </nav>
  );
}
