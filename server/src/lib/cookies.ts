import type { Response } from "express";
import { env } from "../env.js";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_PATH = "/api/v1/auth";

export const REFRESH_COOKIE_NAME = "lb_refresh";
export const SESSION_HINT_COOKIE_NAME = "lb_session_hint";
export const OAUTH_STATE_COOKIE_NAME = "lb_oauth_state";

const isProd = env.NODE_ENV === "production";

export function setRefreshCookie(res: Response, rawRefreshToken: string) {
  res.cookie(REFRESH_COOKIE_NAME, rawRefreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    maxAge: THIRTY_DAYS_MS
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
}

// Non-httpOnly, non-sensitive presence signal only — lets Next.js edge middleware
// redirect obviously-logged-out users without a network round trip. The real
// authorization boundary is requireAuth + /auth/me, not this cookie.
export function setSessionHintCookie(res: Response) {
  res.cookie(SESSION_HINT_COOKIE_NAME, "1", {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS_MS
  });
}

export function clearSessionHintCookie(res: Response) {
  res.clearCookie(SESSION_HINT_COOKIE_NAME, { path: "/" });
}

export function setOAuthStateCookie(res: Response, state: string) {
  res.cookie(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/api/v1/auth/google",
    maxAge: 10 * 60 * 1000,
    signed: true
  });
}

export function clearOAuthStateCookie(res: Response) {
  res.clearCookie(OAUTH_STATE_COOKIE_NAME, { path: "/api/v1/auth/google" });
}
