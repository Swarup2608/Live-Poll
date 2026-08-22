"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchCurrentUser } from "@/lib/api";

// Landing target after the backend completes the Google OAuth flow. The backend
// has already set the refresh cookie via redirect; the access token is deliberately
// never put in the redirect URL (history/referrer leak risk), so this page mints
// one from the cookie the same way a hard-refresh rehydration would.
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser().then((me) => {
      router.replace(me ? "/dashboard" : "/login");
    });
  }, [router]);

  return null;
}
