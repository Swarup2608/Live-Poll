"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/lib/api";

// The actual authorization boundary for every host-only page. proxy.ts only
// checks a cheap presence cookie; this is what rehydrates the in-memory access
// token from the httpOnly refresh cookie and confirms the session is still valid.
export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser().then((me) => {
      if (cancelled) return;

      if (!me) {
        router.replace("/login");
        return;
      }

      setChecked(true);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
