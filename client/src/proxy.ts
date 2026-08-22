import { NextResponse, type NextRequest } from "next/server";

// Fast, cheap first line of defense: redirect obviously-logged-out users before
// any protected UI renders. This is NOT the authorization boundary — the presence
// cookie it checks is intentionally non-httpOnly and carries no session data. The
// real check happens client-side in (host)/layout.tsx via /auth/refresh + /auth/me.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create-event/:path*",
    "/event-builder/:path*",
    "/poll-editor/:path*",
    "/control-room/:path*",
    "/room-settings/:path*",
    "/account-settings/:path*",
    "/event-summary/:path*",
  ],
};

export function proxy(req: NextRequest) {
  const hasSession = req.cookies.has("lb_session_hint");

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
